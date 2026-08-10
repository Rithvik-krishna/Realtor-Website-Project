// Schema.org JSON-LD Generators for Canadian Real Estate (TRREB / REALTOR® Compliance)

export interface PropertySchemaInput {
  title: string;
  description: string;
  price: number;
  currency?: string;
  address: string;
  city: string;
  province?: string;
  postalCode?: string;
  beds: number;
  baths: number;
  sqft?: number;
  propertyType?: string;
  imageUrl?: string;
  images?: string[];
  mlsNumber?: string;
  url?: string;
  latitude?: number;
  longitude?: number;
  yearBuilt?: number;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface ArticleSchemaInput {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  category?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const DEFAULT_SITE_URL = 'https://www.kanghomes.ca';
export const DEFAULT_AGENT_NAME = 'Karan Kang';
export const DEFAULT_BROKERAGE = 'Royal LePage Pinnacle Real Estate';

/**
 * Organization & Brokerage Schema
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${DEFAULT_SITE_URL}/#organization`,
    name: 'Kang Homes | Royal LePage Pinnacle Real Estate',
    alternateName: 'Kang Homes Real Estate',
    url: DEFAULT_SITE_URL,
    logo: `${DEFAULT_SITE_URL}/royal-lepage-logo.jpg`,
    image: `${DEFAULT_SITE_URL}/karan-kang.jpg`,
    description: 'Premier Canadian Real Estate services serving Toronto, Oakville, Mississauga, Brampton, and the Greater Toronto Area (GTA).',
    telephone: '+1-416-555-0199',
    email: 'info@kanghomes.ca',
    priceRange: '$$$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '100 City Centre Drive',
      addressLocality: 'Mississauga',
      addressRegion: 'ON',
      postalCode: 'L5B 2C9',
      addressCountry: 'CA'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 43.5890,
      longitude: -79.6441
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '08:00',
      closes: '21:00'
    },
    sameAs: [
      'https://www.facebook.com/kanghomes',
      'https://www.instagram.com/kanghomes',
      'https://www.linkedin.com/in/karankangrealtor'
    ]
  };
}

/**
 * REALTOR® Agent Schema (E-E-A-T)
 */
export function generateRealEstateAgentSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${DEFAULT_SITE_URL}/#agent`,
    name: DEFAULT_AGENT_NAME,
    jobTitle: 'REALTOR®, Sales Representative',
    worksFor: {
      '@type': 'Organization',
      name: DEFAULT_BROKERAGE,
      url: DEFAULT_SITE_URL
    },
    image: `${DEFAULT_SITE_URL}/karan-kang.jpg`,
    url: `${DEFAULT_SITE_URL}/#about`,
    telephone: '+1-416-555-0199',
    email: 'karan@kanghomes.ca',
    knowsAbout: [
      'Toronto Real Estate',
      'Mississauga Homes for Sale',
      'Brampton Real Estate',
      'Oakville Luxury Estates',
      'TRREB MLS Listings',
      'Home Valuation & CMA'
    ]
  };
}

/**
 * Property Listing Schema (SingleFamilyResidence or Condominium)
 */
export function generatePropertySchema(p: PropertySchemaInput) {
  const isCondo = p.propertyType?.toLowerCase().includes('condo') || p.propertyType?.toLowerCase().includes('apartment');
  const schemaType = isCondo ? 'Condominium' : 'SingleFamilyResidence';

  return {
    '@context': 'https://schema.org',
    '@type': schemaType,
    '@id': p.url || `${DEFAULT_SITE_URL}/property/${p.mlsNumber || 'p-id'}`,
    name: p.title,
    description: p.description,
    url: p.url || `${DEFAULT_SITE_URL}/property/${p.mlsNumber || 'p-id'}`,
    image: p.images && p.images.length > 0 ? p.images : [p.imageUrl || `${DEFAULT_SITE_URL}/royal-lepage-logo.jpg`],
    address: {
      '@type': 'PostalAddress',
      streetAddress: p.address,
      addressLocality: p.city,
      addressRegion: p.province || 'ON',
      postalCode: p.postalCode || 'L5B 2C9',
      addressCountry: 'CA'
    },
    geo: p.latitude && p.longitude ? {
      '@type': 'GeoCoordinates',
      latitude: p.latitude,
      longitude: p.longitude
    } : undefined,
    numberOfBedrooms: p.beds,
    numberOfBathroomsTotal: p.baths,
    floorSize: p.sqft ? {
      '@type': 'QuantitativeValue',
      value: p.sqft,
      unitCode: 'FTK'
    } : undefined,
    yearBuilt: p.yearBuilt,
    offers: {
      '@type': 'Offer',
      price: p.price,
      priceCurrency: p.currency || 'CAD',
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString().split('T')[0],
      seller: {
        '@type': 'RealEstateAgent',
        name: `${DEFAULT_AGENT_NAME} - ${DEFAULT_BROKERAGE}`
      }
    }
  };
}

/**
 * BreadcrumbList Schema
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${DEFAULT_SITE_URL}${item.url}`
    }))
  };
}

/**
 * Article Schema (Blog)
 */
export function generateArticleSchema(article: ArticleSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url
    },
    headline: article.title,
    description: article.description,
    image: [article.imageUrl || `${DEFAULT_SITE_URL}/royal-lepage-logo.jpg`],
    datePublished: article.datePublished || new Date().toISOString(),
    dateModified: article.dateModified || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: article.authorName || DEFAULT_AGENT_NAME,
      jobTitle: 'REALTOR®'
    },
    publisher: {
      '@type': 'Organization',
      name: DEFAULT_BROKERAGE,
      logo: {
        '@type': 'ImageObject',
        url: `${DEFAULT_SITE_URL}/royal-lepage-logo.jpg`
      }
    },
    articleSection: article.category || 'Real Estate Insights'
  };
}

/**
 * FAQPage Schema
 */
export function generateFAQSchema(faqs: FAQItem[]) {
  if (!faqs || faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

/**
 * WebSite & SearchAction Schema
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: DEFAULT_SITE_URL,
    name: 'Kang Homes Canadian Real Estate',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${DEFAULT_SITE_URL}/#search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}
