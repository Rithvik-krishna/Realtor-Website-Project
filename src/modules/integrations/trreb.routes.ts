import { Router } from 'express';
import { TRREBController } from './trreb.controller.js';
import { authenticateJWT } from '../../middleware/auth.middleware.js';
import { requireRoles } from '../../middleware/rbac.middleware.js';

const router = Router();
const controller = new TRREBController();

router.post('/sync', authenticateJWT, requireRoles(['ADMIN', 'SUPER_ADMIN']), controller.triggerSync);

export default router;
