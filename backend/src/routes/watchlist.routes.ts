import { Router } from 'express';
import * as watchlistController from '../controllers/watchlist.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, watchlistController.getWatchlist);
router.post('/:auctionId', authenticate, watchlistController.addToWatchlist);
router.delete('/:auctionId', authenticate, watchlistController.removeFromWatchlist);
router.get('/:auctionId/check', authenticate, watchlistController.isInWatchlist);

export default router;
