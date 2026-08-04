import { Router } from 'express';
import { BuyerController } from './buyer.controller.js';
import { authenticateJWT } from '../../middleware/auth.middleware.js';

const router = Router();
const controller = new BuyerController();

router.use(authenticateJWT);

router.get('/saved-properties', controller.getSavedProperties);
router.post('/saved-properties', controller.saveProperty);
router.delete('/saved-properties/:propertyId', controller.removeSavedProperty);

router.get('/saved-searches', controller.getSavedSearches);
router.post('/saved-searches', controller.saveSearch);

export default router;
