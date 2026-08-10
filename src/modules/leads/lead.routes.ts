import { Router } from 'express';
import { LeadController } from './lead.controller.js';

const router = Router();

router.post('/capture', LeadController.captureLead);
router.post('/viewing', LeadController.captureLead);
router.post('/alert', LeadController.captureLead);
router.post('/valuation', LeadController.captureLead);
router.get('/', LeadController.getLeads);
router.get('/stats', LeadController.getLeadStats);

export default router;
