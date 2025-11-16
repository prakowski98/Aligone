import { Router } from 'express';
import * as auctionsController from '../controllers/auctions.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', auctionsController.getAllAuctions);
router.get('/:id', auctionsController.getAuction);
router.post(
  '/',
  authenticate,
  upload.array('images', 10),
  validate(auctionsController.createAuctionSchema),
  auctionsController.createAuction
);
router.put(
  '/:id',
  authenticate,
  validate(auctionsController.updateAuctionSchema),
  auctionsController.updateAuction
);
router.delete('/:id', authenticate, auctionsController.deleteAuction);
router.post('/:id/publish', authenticate, auctionsController.publishAuction);

export default router;
