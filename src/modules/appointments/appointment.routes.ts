import { Router } from 'express';
import { AppointmentController } from './appointment.controller.js';
import { authenticateJWT } from '../../middleware/auth.middleware.js';

const router = Router();
const controller = new AppointmentController();

router.use(authenticateJWT);

router.post('/book', controller.book);
router.get('/my-appointments', controller.getMyAppointments);
router.patch('/:id/status', controller.updateStatus);

export default router;
