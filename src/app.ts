import express, { Application, Request, Response } from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/index.js';
import v1Router from './api/v1/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import { ResponseUtil } from './utils/response.util.js';

import { SEOController } from './modules/seo/seo.controller.js';

const app: Application = express();

// Middlewares
app.use(compression());
app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req: Request, res: Response) => {
  return ResponseUtil.success(res, { status: 'UP', timestamp: new Date() }, 'Canadian Realtor Backend API is healthy');
});

// Dynamic Root XML Sitemaps & Robots.txt
app.get('/sitemap.xml', SEOController.getSitemapIndex);
app.get('/sitemap-pages.xml', SEOController.getPagesSitemap);
app.get('/sitemap-properties.xml', SEOController.getPropertiesSitemap);
app.get('/sitemap-locations.xml', SEOController.getLocationsSitemap);
app.get('/sitemap-blog.xml', SEOController.getBlogSitemap);
app.get('/robots.txt', SEOController.getRobotsTxt);

// API Routes
app.use('/api/v1', v1Router);

// 404 Handler
app.use('*', (req: Request, res: Response) => {
  return ResponseUtil.error(res, `Cannot ${req.method} ${req.originalUrl}`, 404);
});

// Central Error Middleware
app.use(errorHandler);

export default app;
