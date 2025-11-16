import { Router } from 'express';
import * as ordersController from '../controllers/orders.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, validate(ordersController.createOrderSchema), ordersController.createOrder);
router.get('/:id', authenticate, ordersController.getOrder);
router.get('/', authenticate, ordersController.getUserOrders);
router.put('/:id', authenticate, validate(ordersController.updateOrderSchema), ordersController.updateOrder);

export default router;
