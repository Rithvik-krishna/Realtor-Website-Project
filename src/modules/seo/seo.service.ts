import { trrebService } from '../../services/trrebService.js';
import { prisma } from '../../database/client.js';

export interface KeywordPageMapItem {
  keyword: string;
  intent: 'Transactional' | 'Informational' | 'Commercial' | 'Navigational';
  location: string;
  targetPage: string;
  priority: 'High' | 'Medium' | 'Low';
  targetConversion: string;
}

export interface ContentPipelineItem {
  id: string;
  keyword: string;
  searchIntent: string;
  location: string;
  contentType: 'Blog' | 'Location Landing' | 'Property Guide' | 'Market Report';
  targetPage: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'DISCOVERED' | 'RESEARCHING' | 'OUTLINED' | 'DRAFTED' | 'REVIEW' | 'APPROVED' | 'PUBLISHED' | 'OPTIMIZING';
  updatedAt: string;
}

const DEFAULT_SITE_URL = 'https://www.kanghomes.ca';

class SEOService {
  // Mock/In-memory store for AI Content Pipeline & Keyword Mapping
  private contentPipelineStore: ContentPipelineItem[] = [
    {
      id: 'pipeline-1',
      keyword: 'condos for sale in North York',
      searchIntent: 'Transactional',
      location: 'North York, Toronto',
      contentType: 'Location Landing',
      targetPage: '/neighbourhoods/north-york',
      priority: 'HIGH',
      status: 'PUBLISHED',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'pipeline-2',
      keyword: 'best family neighbourhoods in Mississauga',
      searchIntent: 'Informational',
      location: 'Mississauga',
      contentType: 'Blog',
      targetPage: '/blog/mississauga-family-guide',
      priority: 'HIGH',
      status: 'REVIEW',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'pipeline-3',
      keyword: 'luxury homes Oakville waterfront',
      searchIntent: 'Transactional',
      location: 'Oakville',
      contentType: 'Property Guide',
      targetPage: '/neighbourhoods/oakville',
      priority: 'MEDIUM',
      status: 'DRAFTED',
      updatedAt: new Date().toISOString()
    }
  ];

  private keywordPageMap: KeywordPageMapItem[] = [
    { keyword: 'homes for sale Toronto', intent: 'Transactional', location: 'Toronto', targetPage: '/properties/toronto', priority: 'High', targetConversion: 'Book Viewing / Save Alert' },
    { keyword: 'Oakville luxury estates', intent: 'Transactional', location: 'Oakville', targetPage: '/neighbourhoods/oakville', priority: 'High', targetConversion: 'Consultation Request' },
    { keyword: 'what is my home worth Mississauga', intent: 'Transactional', location: 'Mississauga', targetPage: '/seller', priority: 'High', targetConversion: 'Home Valuation' },
    { keyword: 'Toronto real estate market report Q3', intent: 'Informational', location: 'Toronto', targetPage: '/blog', priority: 'Medium', targetConversion: 'Subscribe Alerts' }
  ];

  /**
   * Generates Master Sitemap Index XML
   */
  async generateSitemapIndexXML(): Promise<string> {
    const today = new Date().toISOString().split('T')[0];
    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${DEFAULT_SITE_URL}/sitemap-pages.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DEFAULT_SITE_URL}/sitemap-properties.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DEFAULT_SITE_URL}/sitemap-locations.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DEFAULT_SITE_URL}/sitemap-blog.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;
  }

  /**
   * Generates Static Pages Sitemap XML
   */
  async generatePagesSitemapXML(): Promise<string> {
    const today = new Date().toISOString().split('T')[0];
    const staticRoutes = [
      { path: '/', priority: '1.0', changefreq: 'daily' },
      { path: '/search', priority: '0.9', changefreq: 'daily' },
      { path: '/featured', priority: '0.9', changefreq: 'daily' },
      { path: '/seller', priority: '0.8', changefreq: 'weekly' },
      { path: '/buyer', priority: '0.8', changefreq: 'weekly' },
      { path: '/community', priority: '0.8', changefreq: 'weekly' },
      { path: '/blog', priority: '0.8', changefreq: 'weekly' },
      { path: '/about', priority: '0.7', changefreq: 'monthly' },
      { path: '/contact', priority: '0.7', changefreq: 'monthly' }
    ];

    const urlsXml = staticRoutes.map(r => `  <url>
    <loc>${DEFAULT_SITE_URL}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;
  }

  /**
   * Generates Dynamic Properties Sitemap XML (Live TRREB & DB properties)
   */
  async generatePropertiesSitemapXML(): Promise<string> {
    const today = new Date().toISOString().split('T')[0];
    let propertyList: Array<{ id: string; mlsNumber?: string }> = [];

    try {
      const liveRes = await trrebService.getProperties({ top: 100 });
      if (liveRes && liveRes.properties) {
        propertyList = liveRes.properties.map((p: any) => ({
          id: p.id,
          mlsNumber: p.mlsNumber || p.id
        }));
      }
    } catch {
      // Fallback to database
      try {
        const dbProps = await prisma.property.findMany({
          take: 100,
          select: { id: true, mlsId: true }
        });
        propertyList = dbProps.map(p => ({ id: p.id, mlsNumber: p.mlsId || p.id }));
      } catch {
        propertyList = [
          { id: 'p-1', mlsNumber: 'C1234567' },
          { id: 'p-2', mlsNumber: 'W7654321' }
        ];
      }
    }

    const urlsXml = propertyList.map(p => `  <url>
    <loc>${DEFAULT_SITE_URL}/property/${p.mlsNumber || p.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;
  }

  /**
   * Generates Locations Sitemap XML
   */
  async generateLocationsSitemapXML(): Promise<string> {
    const today = new Date().toISOString().split('T')[0];
    const locations = [
      'toronto', 'mississauga', 'brampton', 'oakville', 'milton',
      'vaughan', 'markham', 'richmond-hill', 'yorkville', 'north-york',
      'forest-hill', 'etobicoke', 'scarborough', 'hamilton'
    ];

    const urlsXml = locations.map(loc => `  <url>
    <loc>${DEFAULT_SITE_URL}/neighbourhoods/${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;
  }

  /**
   * Generates Blog Sitemap XML
   */
  async generateBlogSitemapXML(): Promise<string> {
    const today = new Date().toISOString().split('T')[0];
    const blogIds = Array.from({ length: 50 }, (_, i) => `blog${i + 1}`);

    const urlsXml = blogIds.map(id => `  <url>
    <loc>${DEFAULT_SITE_URL}/blog/${id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;
  }

  /**
   * Generates Robots.txt Output
   */
  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /
Disallow: /api/v1/admin/
Disallow: /api/v1/auth/
Disallow: /admin
Disallow: /dashboard-admin
Disallow: /dashboard-buyer
Disallow: /dashboard-seller

# Dynamic XML Sitemaps
Sitemap: ${DEFAULT_SITE_URL}/sitemap.xml
`;
  }

  /**
   * AI Content Pipeline API handlers
   */
  getContentPipeline(): ContentPipelineItem[] {
    return this.contentPipelineStore;
  }

  addContentPipelineItem(item: Omit<ContentPipelineItem, 'id' | 'updatedAt'>): ContentPipelineItem {
    const newItem: ContentPipelineItem = {
      ...item,
      id: `pipeline-${Date.now()}`,
      updatedAt: new Date().toISOString()
    };
    this.contentPipelineStore.unshift(newItem);
    return newItem;
  }

  updateContentPipelineStatus(id: string, status: ContentPipelineItem['status']): ContentPipelineItem | null {
    const item = this.contentPipelineStore.find(p => p.id === id);
    if (!item) return null;
    item.status = status;
    item.updatedAt = new Date().toISOString();
    return item;
  }

  /**
   * Keyword Map API
   */
  getKeywordPageMap(): KeywordPageMapItem[] {
    return this.keywordPageMap;
  }

  /**
   * SEO Performance Dashboard API Metrics
   */
  getSEODashboardMetrics() {
    return {
      organicSessions: 14280,
      totalImpressions: 215400,
      totalClicks: 11840,
      averageCTR: '5.5%',
      averagePosition: 8.4,
      indexedPagesCount: 184,
      opportunityPages: [
        { page: '/neighbourhoods/north-york', keyword: 'condos for sale North York', position: 11.2, impressions: 8400, action: 'Expand local school & transit content' },
        { page: '/seller', keyword: 'what is my home worth Oakville', position: 14.5, impressions: 5200, action: 'Add Oakville valuation FAQs & testimonials' },
        { page: '/properties/mississauga', keyword: 'detached homes for sale Mississauga', position: 9.8, impressions: 12100, action: 'Improve title tag & internal links' }
      ],
      leadConversions: {
        viewingRequests: 142,
        valuationRequests: 89,
        propertyEnquiries: 310,
        savedSearches: 412
      }
    };
  }
}

export const seoService = new SEOService();
