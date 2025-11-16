import { Router } from 'express';
import authRoutes from './auth.routes';
import usersRoutes from './users.routes';
import auctionsRoutes from './auctions.routes';
import bidsRoutes from './bids.routes';
import messagesRoutes from './messages.routes';
import categoriesRoutes from './categories.routes';
import watchlistRoutes from './watchlist.routes';
import ordersRoutes from './orders.routes';
import notificationsRoutes from './notifications.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/auctions', auctionsRoutes);
router.use('/', bidsRoutes); // Includes /auctions/:id/bids
router.use('/messages', messagesRoutes);
router.use('/categories', categoriesRoutes);
router.use('/watchlist', watchlistRoutes);
router.use('/orders', ordersRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/admin', adminRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
