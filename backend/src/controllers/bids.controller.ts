import { Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../types';

export const placeBidSchema = z.object({
  amount: z.number().positive(),
  automatic: z.boolean().default(false),
  maxBid: z.number().positive().optional(),
});

export const placeBid = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const { id: auctionId } = req.params;
    const { amount, automatic, maxBid } = req.body;

    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
      include: {
        bids: {
          orderBy: { amount: 'desc' },
          take: 1,
        },
      },
    });

    if (!auction) {
      throw new AppError('Auction not found', 404);
    }

    // Cannot bid on own auction
    if (auction.sellerId === req.user.id) {
      throw new AppError('Cannot bid on your own auction', 400);
    }

    // Check auction status
    if (auction.status !== 'ACTIVE') {
      throw new AppError('Auction is not active', 400);
    }

    // Check if auction has ended
    if (new Date() > new Date(auction.endDate)) {
      throw new AppError('Auction has ended', 400);
    }

    // Check if auction has started
    if (new Date() < new Date(auction.startDate)) {
      throw new AppError('Auction has not started yet', 400);
    }

    // Validate bid amount
    const currentPrice = auction.currentPrice;
    const minimumBid = currentPrice * 1.05; // 5% increment

    if (amount < minimumBid) {
      throw new AppError(
        `Bid must be at least ${minimumBid.toFixed(2)}`,
        400
      );
    }

    // Create bid
    const bid = await prisma.bid.create({
      data: {
        auctionId,
        bidderId: req.user.id,
        amount,
        automatic,
        maxBid,
      },
      include: {
        bidder: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    // Update auction current price
    await prisma.auction.update({
      where: { id: auctionId },
      data: { currentPrice: amount },
    });

    // Create notification for seller
    await prisma.notification.create({
      data: {
        userId: auction.sellerId,
        type: 'NEW_BID',
        title: 'New Bid',
        message: `Someone placed a bid of $${amount} on your auction "${auction.title}"`,
        link: `/auctions/${auctionId}`,
      },
    });

    // Notify previous highest bidder if exists
    if (auction.bids.length > 0) {
      const previousBidder = auction.bids[0].bidderId;
      if (previousBidder !== req.user.id) {
        await prisma.notification.create({
          data: {
            userId: previousBidder,
            type: 'OUTBID',
            title: 'You have been outbid',
            message: `You have been outbid on "${auction.title}"`,
            link: `/auctions/${auctionId}`,
          },
        });
      }
    }

    res.status(201).json(bid);
  } catch (error) {
    throw error;
  }
};

export const getAuctionBids = async (req: AuthRequest, res: Response) => {
  try {
    const { id: auctionId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [bids, total] = await Promise.all([
      prisma.bid.findMany({
        where: { auctionId },
        include: {
          bidder: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.bid.count({
        where: { auctionId },
      }),
    ]);

    res.json({
      bids,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getUserBids = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [bids, total] = await Promise.all([
      prisma.bid.findMany({
        where: { bidderId: req.user.id },
        include: {
          auction: {
            include: {
              category: true,
              seller: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.bid.count({
        where: { bidderId: req.user.id },
      }),
    ]);

    res.json({
      bids,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    throw error;
  }
};
