import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import rateLimit from 'express-rate-limit';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { verifyAccessToken } from './utils/jwt';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', limiter);

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api', routes);

// Error handler
app.use(errorHandler);

// Socket.IO for real-time features
const connectedUsers = new Map<string, string>(); // userId -> socketId

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = verifyAccessToken(token);
    socket.data.user = decoded;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.data.user?.id;

  if (userId) {
    connectedUsers.set(userId, socket.id);
    console.log(`User ${userId} connected`);

    // Join user's personal room
    socket.join(`user:${userId}`);

    // Handle disconnection
    socket.on('disconnect', () => {
      connectedUsers.delete(userId);
      console.log(`User ${userId} disconnected`);
    });

    // Handle new message
    socket.on('send_message', (data) => {
      const { receiverId } = data;
      // Emit to receiver's room
      io.to(`user:${receiverId}`).emit('new_message', data);
    });

    // Handle new bid
    socket.on('new_bid', (data) => {
      // Broadcast to all users watching this auction
      io.to(`auction:${data.auctionId}`).emit('bid_placed', data);
    });

    // Join auction room
    socket.on('join_auction', (auctionId: string) => {
      socket.join(`auction:${auctionId}`);
    });

    // Leave auction room
    socket.on('leave_auction', (auctionId: string) => {
      socket.leave(`auction:${auctionId}`);
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const { receiverId } = data;
      io.to(`user:${receiverId}`).emit('user_typing', {
        userId,
        typing: true,
      });
    });

    socket.on('stop_typing', (data) => {
      const { receiverId } = data;
      io.to(`user:${receiverId}`).emit('user_typing', {
        userId,
        typing: false,
      });
    });
  }
});

// Make io accessible in routes
app.set('io', io);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Aligone Marketplace API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      api: '/api',
      health: '/api/health',
      docs: 'https://github.com/yourusername/aligone-marketplace',
    },
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.IO server running`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export { io };
