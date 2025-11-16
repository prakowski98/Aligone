import { Router } from 'express';
import * as usersController from '../controllers/users.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/:id', usersController.getUser);
router.put('/profile', authenticate, validate(usersController.updateProfileSchema), usersController.updateProfile);
router.post('/avatar', authenticate, upload.single('avatar'), usersController.uploadAvatar);
router.get('/:id/auctions', usersController.getUserAuctions);
router.get('/:id/reviews', usersController.getUserReviews);
router.post('/:id/reviews', authenticate, usersController.createReview);

export default router;
