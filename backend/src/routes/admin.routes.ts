import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate, requireAdmin);

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getAllUsers);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.get('/auctions', adminController.getAllAuctionsAdmin);
router.delete('/auctions/:id', adminController.deleteAuctionAdmin);
router.get('/orders', adminController.getAllOrders);

export default router;
