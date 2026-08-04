import { Router } from 'express';
import { AIController } from './ai.controller.js';

const router = Router();
const controller = new AIController();

router.post('/search-parse', controller.parseQuery);
router.post('/assistant', controller.askAssistant);

export default router;
