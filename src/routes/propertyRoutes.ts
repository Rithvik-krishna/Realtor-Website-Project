import { Router } from 'express';
import {
  getProperties,
  getPropertyById,
  searchProperties,
  getFeaturedProperties
} from '../controllers/propertyController.js';

const router = Router();

router.get('/', getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/search', searchProperties);
router.get('/:id', getPropertyById);

export default router;
