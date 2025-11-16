import { Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../types';

export const createCategorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100),
  description: z.string().optional(),
  icon: z.string().optional(),
  parentId: z.string().optional(),
});

export const getAllCategories = async (req: AuthRequest, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        children: true,
        parent: true,
        _count: {
          select: { auctions: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.json(categories);
  } catch (error) {
    throw error;
  }
};

export const getCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        parent: true,
        _count: {
          select: { auctions: true },
        },
      },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    res.json(category);
  } catch (error) {
    throw error;
  }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      throw new AppError('Admin access required', 403);
    }

    const data = req.body;

    const category = await prisma.category.create({
      data,
      include: {
        children: true,
        parent: true,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    throw error;
  }
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      throw new AppError('Admin access required', 403);
    }

    const { id } = req.params;
    const data = req.body;

    const category = await prisma.category.update({
      where: { id },
      data,
      include: {
        children: true,
        parent: true,
      },
    });

    res.json(category);
  } catch (error) {
    throw error;
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      throw new AppError('Admin access required', 403);
    }

    const { id } = req.params;

    // Check if category has auctions
    const auctionsCount = await prisma.auction.count({
      where: { categoryId: id },
    });

    if (auctionsCount > 0) {
      throw new AppError(
        'Cannot delete category with existing auctions',
        400
      );
    }

    // Check if category has children
    const childrenCount = await prisma.category.count({
      where: { parentId: id },
    });

    if (childrenCount > 0) {
      throw new AppError(
        'Cannot delete category with subcategories',
        400
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    throw error;
  }
};
