import { Router } from 'express';
import { PropertyController } from './property.controller.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { CreatePropertySchema } from './property.validator.js';
import { authenticateJWT } from '../../middleware/auth.middleware.js';
import { requireRoles } from '../../middleware/rbac.middleware.js';

const router = Router();
const controller = new PropertyController();

router.get('/', controller.getProperties);
router.get('/compare', controller.compareProperties);
router.get('/:identifier', controller.getPropertyDetails);

// Protected Admin / Agent creation
router.post(
  '/',
  authenticateJWT,
  requireRoles(['AGENT', 'ADMIN', 'SUPER_ADMIN']),
  validateRequest(CreatePropertySchema),
  controller.createProperty
);

export default router;
