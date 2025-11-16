export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  role: 'USER' | 'ADMIN';
  rating: number;
  ratingCount: number;
  verified: boolean;
  emailVerified: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  _count?: {
    auctions: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Auction {
  id: string;
  title: string;
  description: string;
  type: 'BUY_NOW' | 'AUCTION' | 'BOTH';
  status: 'DRAFT' | 'ACTIVE' | 'ENDED' | 'CANCELLED';
  startingPrice: number;
  currentPrice: number;
  buyNowPrice?: number;
  reservePrice?: number;
  quantity: number;
  condition?: string;
  location?: string;
  shippingCost?: number;
  shippingInfo?: string;
  images: string[];
  views: number;
  featured: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  sellerId: string;
  seller?: User;
  categoryId: string;
  category?: Category;
  bids?: Bid[];
  _count?: {
    bids: number;
    watchlist: number;
  };
}

export interface Bid {
  id: string;
  amount: number;
  automatic: boolean;
  maxBid?: number;
  createdAt: string;
  auctionId: string;
  auction?: Auction;
  bidderId: string;
  bidder?: User;
}

export interface Message {
  id: string;
  content: string;
  read: boolean;
  createdAt: string;
  senderId: string;
  sender?: User;
  receiverId: string;
  receiver?: User;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  reviewerId: string;
  reviewer?: User;
  reviewedId: string;
  reviewed?: User;
}

export interface Order {
  id: string;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  totalAmount: number;
  shippingAddress: string;
  shippingCost: number;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  buyerId: string;
  buyer?: User;
  sellerId: string;
  seller?: User;
  auctionId: string;
  auction?: Auction;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
  userId: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface Conversation {
  partner: User;
  lastMessage: Message;
  unreadCount: number;
}
