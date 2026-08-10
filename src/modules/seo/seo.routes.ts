import { Router } from 'express';
import { SEOController } from './seo.controller.js';

const router = Router();

// REST APIs
router.get('/dashboard', SEOController.getDashboardMetrics);
router.get('/keywords', SEOController.getKeywordsMap);
router.get('/content-pipeline', SEOController.getContentPipeline);
router.post('/content-pipeline', SEOController.createContentPipelineItem);
router.patch('/content-pipeline/:id/status', SEOController.updateContentPipelineStatus);

export default router;
