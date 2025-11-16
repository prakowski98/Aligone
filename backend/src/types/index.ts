import { Request } from 'express';
import { UserRole } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface AuctionFilters {
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  condition?: string;
  location?: string;
  search?: string;
  status?: string;
  type?: string;
  sellerId?: string;
}

export interface MessageFilters {
  userId?: string;
  read?: string;
}
