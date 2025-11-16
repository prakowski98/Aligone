import { Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../types';

export const createOrderSchema = z.object({
  auctionId: z.string(),
  shippingAddress: z.string().min(10),
  notes: z.string().optional(),
});

export const updateOrderSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
  trackingNumber: z.string().optional(),
});

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const { auctionId, shippingAddress, notes } = req.body;

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

    // Cannot buy own auction
    if (auction.sellerId === req.user.id) {
      throw new AppError('Cannot buy your own auction', 400);
    }

    // Check if auction has ended or can be bought now
    const canBuyNow = auction.type === 'BUY_NOW' || auction.type === 'BOTH';
    const hasEnded = new Date() > new Date(auction.endDate);
    const isWinner =
      hasEnded &&
      auction.bids.length > 0 &&
      auction.bids[0].bidderId === req.user.id;

    if (!canBuyNow && !isWinner) {
      throw new AppError('Cannot purchase this auction', 400);
    }

    // Calculate total
    const price = canBuyNow && !hasEnded ? auction.buyNowPrice || auction.currentPrice : auction.currentPrice;
    const shippingCost = auction.shippingCost || 0;
    const totalAmount = price + shippingCost;

    const order = await prisma.order.create({
      data: {
        buyerId: req.user.id,
        sellerId: auction.sellerId,
        auctionId,
        totalAmount,
        shippingCost,
        shippingAddress,
        notes,
      },
      include: {
        auction: true,
        buyer: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
          },
        },
        seller: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    // Update auction status
    await prisma.auction.update({
      where: { id: auctionId },
      data: { status: 'ENDED' },
    });

    // Create notifications
    await prisma.notification.create({
      data: {
        userId: auction.sellerId,
        type: 'NEW_ORDER',
        title: 'New Order',
        message: `You have a new order for "${auction.title}"`,
        link: `/orders/${order.id}`,
      },
    });

    res.status(201).json(order);
  } catch (error) {
    throw error;
  }
};

export const getOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        auction: true,
        buyer: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
            phoneNumber: true,
          },
        },
        seller: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
            phoneNumber: true,
          },
        },
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Check authorization
    if (
      order.buyerId !== req.user.id &&
      order.sellerId !== req.user.id &&
      req.user.role !== 'ADMIN'
    ) {
      throw new AppError('Not authorized', 403);
    }

    res.json(order);
  } catch (error) {
    throw error;
  }
};

export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const type = req.query.type as string; // 'purchases' or 'sales'
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const where = type === 'sales'
      ? { sellerId: req.user.id }
      : { buyerId: req.user.id };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          auction: true,
          buyer: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
          seller: {
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
      prisma.order.count({ where }),
    ]);

    res.json({
      orders,
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

export const updateOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Only seller can update order
    if (order.sellerId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new AppError('Not authorized', 403);
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status,
        trackingNumber,
      },
      include: {
        auction: true,
        buyer: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        seller: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    // Notify buyer
    await prisma.notification.create({
      data: {
        userId: order.buyerId,
        type: 'ORDER_UPDATE',
        title: 'Order Updated',
        message: `Your order status has been updated to ${status}`,
        link: `/orders/${id}`,
      },
    });

    res.json(updatedOrder);
  } catch (error) {
    throw error;
  }
};
