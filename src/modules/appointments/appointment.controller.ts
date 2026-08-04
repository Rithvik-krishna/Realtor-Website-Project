import { Response, NextFunction } from 'express';
import { AppointmentService } from './appointment.service.js';
import { ResponseUtil } from '../../utils/response.util.js';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';

export class AppointmentController {
  private appointmentService: AppointmentService;

  constructor() {
    this.appointmentService = new AppointmentService();
  }

  book = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const buyerId = req.user!.id;
      const appt = await this.appointmentService.bookAppointment({
        ...req.body,
        buyerId
      });
      return ResponseUtil.success(res, appt, 'Appointment booked successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  getMyAppointments = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const isAgent = req.user!.roles.includes('AGENT');
      const appts = isAgent
        ? await this.appointmentService.getAgentAppointments(req.user!.id)
        : await this.appointmentService.getBuyerAppointments(req.user!.id);

      return ResponseUtil.success(res, appts, 'Appointments retrieved', 200);
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await this.appointmentService.updateAppointmentStatus(id, status);
      return ResponseUtil.success(res, updated, 'Appointment status updated', 200);
    } catch (error) {
      next(error);
    }
  };
}
