import { Response } from 'express';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../types';

export const getWatchlist = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.watchlist.findMany({
        where: { userId: req.user.id },
        include: {
          auction: {
            include: {
              seller: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                },
              },
              category: true,
              _count: {
                select: { bids: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.watchlist.count({
        where: { userId: req.user.id },
      }),
    ]);

    res.json({
      watchlist: items.map((item) => item.auction),
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

export const addToWatchlist = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const { auctionId } = req.params;

    // Check if auction exists
    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
    });

    if (!auction) {
      throw new AppError('Auction not found', 404);
    }

    // Check if already in watchlist
    const existing = await prisma.watchlist.findUnique({
      where: {
        userId_auctionId: {
          userId: req.user.id,
          auctionId,
        },
      },
    });

    if (existing) {
      throw new AppError('Auction already in watchlist', 400);
    }

    const watchlistItem = await prisma.watchlist.create({
      data: {
        userId: req.user.id,
        auctionId,
      },
      include: {
        auction: true,
      },
    });

    res.status(201).json(watchlistItem);
  } catch (error) {
    throw error;
  }
};

export const removeFromWatchlist = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const { auctionId } = req.params;

    const watchlistItem = await prisma.watchlist.findUnique({
      where: {
        userId_auctionId: {
          userId: req.user.id,
          auctionId,
        },
      },
    });

    if (!watchlistItem) {
      throw new AppError('Auction not in watchlist', 404);
    }

    await prisma.watchlist.delete({
      where: {
        userId_auctionId: {
          userId: req.user.id,
          auctionId,
        },
      },
    });

    res.json({ message: 'Removed from watchlist' });
  } catch (error) {
    throw error;
  }
};

export const isInWatchlist = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.json({ inWatchlist: false });
    }

    const { auctionId } = req.params;

    const watchlistItem = await prisma.watchlist.findUnique({
      where: {
        userId_auctionId: {
          userId: req.user.id,
          auctionId,
        },
      },
    });

    res.json({ inWatchlist: !!watchlistItem });
  } catch (error) {
    throw error;
  }
};
