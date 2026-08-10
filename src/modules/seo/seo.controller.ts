import { Request, Response } from 'express';
import { seoService } from './seo.service.js';
import { ResponseUtil } from '../../utils/response.util.js';

export class SEOController {
  // Master Sitemap Index
  static async getSitemapIndex(req: Request, res: Response) {
    const xml = await seoService.generateSitemapIndexXML();
    res.header('Content-Type', 'application/xml');
    return res.status(200).send(xml);
  }

  // Pages Sitemap
  static async getPagesSitemap(req: Request, res: Response) {
    const xml = await seoService.generatePagesSitemapXML();
    res.header('Content-Type', 'application/xml');
    return res.status(200).send(xml);
  }

  // Properties Sitemap
  static async getPropertiesSitemap(req: Request, res: Response) {
    const xml = await seoService.generatePropertiesSitemapXML();
    res.header('Content-Type', 'application/xml');
    return res.status(200).send(xml);
  }

  // Locations Sitemap
  static async getLocationsSitemap(req: Request, res: Response) {
    const xml = await seoService.generateLocationsSitemapXML();
    res.header('Content-Type', 'application/xml');
    return res.status(200).send(xml);
  }

  // Blog Sitemap
  static async getBlogSitemap(req: Request, res: Response) {
    const xml = await seoService.generateBlogSitemapXML();
    res.header('Content-Type', 'application/xml');
    return res.status(200).send(xml);
  }

  // Robots.txt
  static getRobotsTxt(req: Request, res: Response) {
    const txt = seoService.generateRobotsTxt();
    res.header('Content-Type', 'text/plain');
    return res.status(200).send(txt);
  }

  // AI SEO Content Pipeline Endpoints
  static getContentPipeline(req: Request, res: Response) {
    const items = seoService.getContentPipeline();
    return ResponseUtil.success(res, items, 'AI Content Pipeline fetched');
  }

  static createContentPipelineItem(req: Request, res: Response) {
    const { keyword, searchIntent, location, contentType, targetPage, priority, status } = req.body;
    if (!keyword) {
      return ResponseUtil.error(res, 'Keyword parameter is required', 400);
    }
    const item = seoService.addContentPipelineItem({
      keyword,
      searchIntent: searchIntent || 'Transactional',
      location: location || 'Ontario',
      contentType: contentType || 'Blog',
      targetPage: targetPage || '/blog',
      priority: priority || 'MEDIUM',
      status: status || 'DISCOVERED'
    });
    return ResponseUtil.success(res, item, 'AI Content Pipeline item created', 201);
  }

  static updateContentPipelineStatus(req: Request, res: Response) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { status } = req.body;
    const updated = seoService.updateContentPipelineStatus(id, status);
    if (!updated) {
      return ResponseUtil.error(res, 'Pipeline item not found', 404);
    }
    return ResponseUtil.success(res, updated, 'Content Pipeline item updated');
  }

  // Keyword Mapping Endpoint
  static getKeywordsMap(req: Request, res: Response) {
    const map = seoService.getKeywordPageMap();
    return ResponseUtil.success(res, map, 'Keyword-to-page map retrieved');
  }

  // SEO Dashboard Performance Metrics
  static getDashboardMetrics(req: Request, res: Response) {
    const metrics = seoService.getSEODashboardMetrics();
    return ResponseUtil.success(res, metrics, 'SEO Dashboard metrics retrieved');
  }
}
