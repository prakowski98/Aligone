import { Router } from 'express';
import * as messagesController from '../controllers/messages.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/conversations', authenticate, messagesController.getConversations);
router.get('/:userId', authenticate, messagesController.getMessages);
router.post('/', authenticate, validate(messagesController.sendMessageSchema), messagesController.sendMessage);
router.put('/:id/read', authenticate, messagesController.markAsRead);
router.get('/unread/count', authenticate, messagesController.getUnreadCount);

export default router;
