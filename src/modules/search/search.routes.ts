import { Router } from 'express';
import { SearchController } from './search.controller.js';

const router = Router();
const controller = new SearchController();

router.get('/', controller.search);
router.get('/communities', controller.getCommunities);

export default router;
