import React, { useEffect } from 'react';
import { DEFAULT_SITE_URL } from './schemaGenerators';

export interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  noIndex?: boolean;
  schemas?: object[];
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalPath = '',
  keywords = [],
  ogImage = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  ogType = 'website',
  noIndex = false,
  schemas = []
}) => {
  const fullCanonicalUrl = `${DEFAULT_SITE_URL}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;

  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // Helper to create or update meta tag
    const setMetaTag = (selector: string, attrName: string, attrValue: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Set Standard Meta Tags
    setMetaTag('meta[name="description"]', 'name', 'description', description);
    
    if (keywords && keywords.length > 0) {
      setMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords.join(', '));
    }

    setMetaTag('meta[name="robots"]', 'name', 'robots', noIndex ? 'noindex, follow' : 'index, follow');

    // 3. Set Open Graph Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', fullCanonicalUrl);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Kang Homes | Royal LePage Pinnacle Real Estate');

    // 4. Set Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);

    // 5. Set Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullCanonicalUrl);

    // 6. Inject JSON-LD Schema Scripts
    const existingSchemaScripts = document.querySelectorAll('script[data-seo-schema="true"]');
    existingSchemaScripts.forEach(script => script.remove());

    if (schemas && schemas.length > 0) {
      schemas.forEach((schemaObj, index) => {
        if (!schemaObj) return;
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo-schema', 'true');
        script.id = `seo-schema-${index}`;
        script.textContent = JSON.stringify(schemaObj);
        document.head.appendChild(script);
      });
    }

    // Scroll to top automatically when head metadata updates
    window.scrollTo({ top: 0, behavior: 'smooth' });

  }, [title, description, fullCanonicalUrl, keywords, ogImage, ogType, noIndex, JSON.stringify(schemas)]);

  return null; // Side-effect rendering only
};
