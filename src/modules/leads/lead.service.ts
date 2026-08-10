import { prisma } from '../../database/client.js';

export interface CreateLeadInput {
  name: string;
  email: string;
  phone?: string;
  leadType?: 'BUYER' | 'SELLER' | 'INVESTOR' | 'GENERAL';
  source?: 'ORGANIC' | 'PROPERTY_PAGE' | 'LANDING_PAGE' | 'BLOG' | 'DIRECT' | 'VALUATION_PAGE';
  location?: string;
  propertyId?: string;
  searchCriteria?: any;
  pageUrl?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

class LeadService {
  // In-memory fallback array for resilient offline operation if DB connection is unavailable
  private inMemoryLeads: any[] = [];

  async createLead(data: CreateLeadInput) {
    const searchCriteriaStr = data.searchCriteria ? (typeof data.searchCriteria === 'string' ? data.searchCriteria : JSON.stringify(data.searchCriteria)) : null;

    try {
      const lead = await prisma.lead.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          leadType: data.leadType || 'BUYER',
          source: data.source || 'ORGANIC',
          location: data.location || null,
          propertyId: data.propertyId || null,
          searchCriteria: searchCriteriaStr,
          pageUrl: data.pageUrl || null,
          utmSource: data.utmSource || null,
          utmMedium: data.utmMedium || null,
          utmCampaign: data.utmCampaign || null,
          status: 'NEW'
        }
      });
      console.log(`🎯 [Lead Service] New lead captured in DB: ${lead.name} (${lead.email}, Type: ${lead.leadType})`);
      return lead;
    } catch (err: any) {
      console.warn(`⚠️ [Lead Service DB Fallback] Using memory cache for lead: ${err.message}`);
      const fallbackLead = {
        id: `lead-${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        leadType: data.leadType || 'BUYER',
        source: data.source || 'ORGANIC',
        location: data.location || null,
        propertyId: data.propertyId || null,
        searchCriteria: searchCriteriaStr,
        pageUrl: data.pageUrl || null,
        utmSource: data.utmSource || null,
        utmMedium: data.utmMedium || null,
        utmCampaign: data.utmCampaign || null,
        status: 'NEW',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.inMemoryLeads.unshift(fallbackLead);
      return fallbackLead;
    }
  }

  async getAllLeads(filter?: { leadType?: string; status?: string }) {
    try {
      const where: any = {};
      if (filter?.leadType) where.leadType = filter.leadType;
      if (filter?.status) where.status = filter.status;

      const dbLeads = await prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });
      return [...dbLeads, ...this.inMemoryLeads];
    } catch {
      return this.inMemoryLeads;
    }
  }

  async getLeadStats() {
    try {
      const total = await prisma.lead.count();
      const buyers = await prisma.lead.count({ where: { leadType: 'BUYER' } });
      const sellers = await prisma.lead.count({ where: { leadType: 'SELLER' } });
      const organic = await prisma.lead.count({ where: { source: 'ORGANIC' } });
      const landingPages = await prisma.lead.count({ where: { source: 'LANDING_PAGE' } });

      return {
        totalLeads: total + this.inMemoryLeads.length,
        buyerLeads: buyers + this.inMemoryLeads.filter(l => l.leadType === 'BUYER').length,
        sellerLeads: sellers + this.inMemoryLeads.filter(l => l.leadType === 'SELLER').length,
        organicLeads: organic + this.inMemoryLeads.filter(l => l.source === 'ORGANIC').length,
        landingPageLeads: landingPages + this.inMemoryLeads.filter(l => l.source === 'LANDING_PAGE').length,
        recentLeadsCount: total
      };
    } catch {
      return {
        totalLeads: this.inMemoryLeads.length,
        buyerLeads: this.inMemoryLeads.filter(l => l.leadType === 'BUYER').length,
        sellerLeads: this.inMemoryLeads.filter(l => l.leadType === 'SELLER').length,
        organicLeads: this.inMemoryLeads.filter(l => l.source === 'ORGANIC').length,
        landingPageLeads: this.inMemoryLeads.filter(l => l.source === 'LANDING_PAGE').length,
        recentLeadsCount: this.inMemoryLeads.length
      };
    }
  }
}

export const leadService = new LeadService();
