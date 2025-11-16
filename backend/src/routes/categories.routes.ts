import { Router } from 'express';
import * as categoriesController from '../controllers/categories.controller';
import { validate } from '../middleware/validate';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', categoriesController.getAllCategories);
router.get('/:id', categoriesController.getCategory);
router.post('/', authenticate, requireAdmin, validate(categoriesController.createCategorySchema), categoriesController.createCategory);
router.put('/:id', authenticate, requireAdmin, validate(categoriesController.createCategorySchema.partial()), categoriesController.updateCategory);
router.delete('/:id', authenticate, requireAdmin, categoriesController.deleteCategory);

export default router;
