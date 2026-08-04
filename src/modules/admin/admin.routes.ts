import { Router } from 'express';
import { AdminController } from './admin.controller.js';
import { authenticateJWT } from '../../middleware/auth.middleware.js';
import { requireRoles } from '../../middleware/rbac.middleware.js';

const router = Router();
const controller = new AdminController();

router.use(authenticateJWT, requireRoles(['ADMIN', 'SUPER_ADMIN']));

router.get('/stats', controller.getDashboardStats);
router.get('/users', controller.getAllUsers);
router.get('/sync-logs', controller.getSyncLogs);

export default router;
