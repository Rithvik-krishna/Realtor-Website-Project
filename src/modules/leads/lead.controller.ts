import { Request, Response } from 'express';
import { leadService } from './lead.service.js';
import { ResponseUtil } from '../../utils/response.util.js';

export class LeadController {
  static async captureLead(req: Request, res: Response) {
    const { name, email, phone, leadType, source, location, propertyId, searchCriteria, pageUrl, utmSource, utmMedium, utmCampaign } = req.body;

    if (!name || !email) {
      return ResponseUtil.error(res, 'Name and Email are required fields for lead capture', 400);
    }

    const lead = await leadService.createLead({
      name,
      email,
      phone,
      leadType: leadType || 'BUYER',
      source: source || 'ORGANIC',
      location,
      propertyId,
      searchCriteria,
      pageUrl,
      utmSource,
      utmMedium,
      utmCampaign
    });

    return ResponseUtil.success(res, lead, 'Lead captured successfully', 201);
  }

  static async getLeads(req: Request, res: Response) {
    const { leadType, status } = req.query;
    const leads = await leadService.getAllLeads({
      leadType: typeof leadType === 'string' ? leadType : undefined,
      status: typeof status === 'string' ? status : undefined
    });
    return ResponseUtil.success(res, leads, 'Leads retrieved successfully');
  }

  static async getLeadStats(req: Request, res: Response) {
    const stats = await leadService.getLeadStats();
    return ResponseUtil.success(res, stats, 'Lead statistics retrieved');
  }
}
