import { Router } from 'express';
import { AnalyticsController } from './analytics.controller.js';

const router = Router();
const controller = new AnalyticsController();

router.get('/market', controller.getMarketDashboard);

export default router;
