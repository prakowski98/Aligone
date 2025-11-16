import { Router } from 'express';
import * as bidsController from '../controllers/bids.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/auctions/:id/bids', authenticate, validate(bidsController.placeBidSchema), bidsController.placeBid);
router.get('/auctions/:id/bids', bidsController.getAuctionBids);
router.get('/my-bids', authenticate, bidsController.getUserBids);

export default router;
