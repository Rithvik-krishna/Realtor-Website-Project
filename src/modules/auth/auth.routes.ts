import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { SignupSchema, LoginSchema } from './auth.validator.js';

const router = Router();
const controller = new AuthController();

router.post('/signup', validateRequest(SignupSchema), controller.signup);
router.post('/login', validateRequest(LoginSchema), controller.login);
router.get('/me', controller.getMe);

export default router;
