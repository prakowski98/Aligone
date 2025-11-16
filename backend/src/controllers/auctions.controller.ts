import { Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest, AuctionFilters } from '../types';
import { AuctionStatus, AuctionType } from '@prisma/client';

export const createAuctionSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(10),
  type: z.enum(['BUY_NOW', 'AUCTION', 'BOTH']),
  startingPrice: z.number().positive(),
  buyNowPrice: z.number().positive().optional(),
  reservePrice: z.number().positive().optional(),
  quantity: z.number().int().positive().default(1),
  condition: z.string().optional(),
  location: z.string().optional(),
  shippingCost: z.number().nonnegative().optional(),
  shippingInfo: z.string().optional(),
  categoryId: z.string(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime(),
});

export const updateAuctionSchema = createAuctionSchema.partial();

export const getAllAuctions = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const filters: AuctionFilters = {
      categoryId: req.query.categoryId as string,
      minPrice: req.query.minPrice as string,
      maxPrice: req.query.maxPrice as string,
      condition: req.query.condition as string,
      location: req.query.location as string,
      search: req.query.search as string,
      status: req.query.status as string,
      type: req.query.type as string,
    };

    const where: any = {};

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.minPrice || filters.maxPrice) {
      where.currentPrice = {};
      if (filters.minPrice) where.currentPrice.gte = parseFloat(filters.minPrice);
      if (filters.maxPrice) where.currentPrice.lte = parseFloat(filters.maxPrice);
    }

    if (filters.condition) {
      where.condition = filters.condition;
    }

    if (filters.location) {
      where.location = { contains: filters.location, mode: 'insensitive' };
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.status) {
      where.status = filters.status;
    } else {
      where.status = 'ACTIVE';
    }

    if (filters.type) {
      where.type = filters.type;
    }

    const [auctions, total] = await Promise.all([
      prisma.auction.findMany({
        where,
        include: {
          seller: {
            select: {
              id: true,
              username: true,
              avatar: true,
              rating: true,
            },
          },
          category: true,
          _count: {
            select: { bids: true, watchlist: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.auction.count({ where }),
    ]);

    res.json({
      auctions,
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

export const getAuction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const auction = await prisma.auction.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            avatar: true,
            rating: true,
            ratingCount: true,
            verified: true,
          },
        },
        category: true,
        bids: {
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
          take: 10,
        },
        _count: {
          select: { bids: true, watchlist: true },
        },
      },
    });

    if (!auction) {
      throw new AppError('Auction not found', 404);
    }

    // Increment views
    await prisma.auction.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    res.json(auction);
  } catch (error) {
    throw error;
  }
};

export const createAuction = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const data = req.body;

    // Handle uploaded images
    const images: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file: Express.Multer.File) => {
        images.push(`/uploads/${file.filename}`);
      });
    }

    const auction = await prisma.auction.create({
      data: {
        ...data,
        images,
        currentPrice: data.startingPrice,
        startDate: data.startDate ? new Date(data.startDate) : new Date(),
        endDate: new Date(data.endDate),
        sellerId: req.user.id,
      },
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        category: true,
      },
    });

    res.status(201).json(auction);
  } catch (error) {
    throw error;
  }
};

export const updateAuction = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const { id } = req.params;
    const data = req.body;

    // Check ownership
    const auction = await prisma.auction.findUnique({
      where: { id },
    });

    if (!auction) {
      throw new AppError('Auction not found', 404);
    }

    if (auction.sellerId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new AppError('Not authorized to update this auction', 403);
    }

    // Cannot edit active auction with bids
    if (auction.status === 'ACTIVE') {
      const bidsCount = await prisma.bid.count({
        where: { auctionId: id },
      });

      if (bidsCount > 0) {
        throw new AppError('Cannot edit auction with existing bids', 400);
      }
    }

    const updatedAuction = await prisma.auction.update({
      where: { id },
      data: {
        ...data,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
      },
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        category: true,
      },
    });

    res.json(updatedAuction);
  } catch (error) {
    throw error;
  }
};

export const deleteAuction = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const { id } = req.params;

    const auction = await prisma.auction.findUnique({
      where: { id },
    });

    if (!auction) {
      throw new AppError('Auction not found', 404);
    }

    if (auction.sellerId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new AppError('Not authorized to delete this auction', 403);
    }

    // Cannot delete active auction with bids
    if (auction.status === 'ACTIVE') {
      const bidsCount = await prisma.bid.count({
        where: { auctionId: id },
      });

      if (bidsCount > 0) {
        throw new AppError('Cannot delete auction with existing bids', 400);
      }
    }

    await prisma.auction.delete({
      where: { id },
    });

    res.json({ message: 'Auction deleted successfully' });
  } catch (error) {
    throw error;
  }
};

export const publishAuction = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const { id } = req.params;

    const auction = await prisma.auction.findUnique({
      where: { id },
    });

    if (!auction) {
      throw new AppError('Auction not found', 404);
    }

    if (auction.sellerId !== req.user.id) {
      throw new AppError('Not authorized', 403);
    }

    if (auction.status !== 'DRAFT') {
      throw new AppError('Only draft auctions can be published', 400);
    }

    const updatedAuction = await prisma.auction.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });

    res.json(updatedAuction);
  } catch (error) {
    throw error;
  }
};
