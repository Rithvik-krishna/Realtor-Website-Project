import { Router } from 'express';
import { SellerController } from './seller.controller.js';
import { authenticateJWT } from '../../middleware/auth.middleware.js';
import { requireRoles } from '../../middleware/rbac.middleware.js';

const router = Router();
const controller = new SellerController();

router.post('/valuation', controller.requestValuation);
router.get('/valuations', authenticateJWT, requireRoles(['AGENT', 'ADMIN', 'SUPER_ADMIN']), controller.getValuations);

export default router;
