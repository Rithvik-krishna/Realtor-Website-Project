/**
 * NovaEstate Mobile - Professional Property PDF Dossier Generator
 */

import { Property } from '@/types';
import { formatCurrency } from '@/utils';
import { Platform } from 'react-native';

export class PDFService {
  /**
   * Generates a clean HTML report string for a given property
   */
  static generateHTMLTemplate(property: Property, realtorName = 'Karan Homes Team', realtorPhone = '(416) 555-0199', realtorEmail = 'realtor@karanhomes.ca'): string {
    const mainImage = property.images && property.images.length > 0
      ? property.images[0]
      : '';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${property.mlsNumber} - ${property.title}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #0B0D12; color: #F3F4F6; margin: 0; padding: 24px; }
            .header { border-bottom: 2px solid #D4AF37; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
            .logo { font-size: 24px; font-weight: bold; color: #D4AF37; letter-spacing: 1px; }
            .badge { background: rgba(212, 175, 55, 0.15); border: 1px solid #D4AF37; color: #D4AF37; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
            .hero-img { width: 100%; height: 320px; object-fit: cover; border-radius: 12px; margin-bottom: 20px; }
            .price-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px; }
            .price { font-size: 32px; font-weight: bold; color: #D4AF37; }
            .mls { font-size: 14px; color: #9CA3AF; }
            .title { font-size: 22px; font-weight: 700; color: #FFFFFF; margin-bottom: 8px; }
            .address { font-size: 14px; color: #D1D5DB; margin-bottom: 20px; }
            .specs-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; background: rgba(255,255,255,0.05); padding: 16px; border-radius: 10px; margin-bottom: 24px; }
            .spec-box { text-align: center; }
            .spec-val { font-size: 18px; font-weight: bold; color: #FFFFFF; }
            .spec-lbl { font-size: 11px; color: #9CA3AF; text-transform: uppercase; margin-top: 4px; }
            .section-title { font-size: 16px; font-weight: bold; color: #D4AF37; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 6px; margin-bottom: 12px; }
            .desc { font-size: 13px; line-height: 1.6; color: #D1D5DB; margin-bottom: 24px; }
            .realtor-card { background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); padding: 16px; border-radius: 10px; margin-top: 30px; display: flex; align-items: center; gap: 16px; }
            .realtor-info { flex: 1; }
            .realtor-name { font-size: 16px; font-weight: bold; color: #FFFFFF; }
            .realtor-sub { font-size: 12px; color: #A78BFA; margin-top: 2px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">KARAN HOMES REALTOR DOSSIER</div>
            <div class="badge">MLS® #${property.mlsNumber}</div>
          </div>
          <img src="${mainImage}" class="hero-img" alt="${property.title}" />
          <div class="price-row">
            <div class="price">${formatCurrency(property.price)}</div>
            <div class="mls">Status: ${property.status} • Type: ${property.propertyType}</div>
          </div>
          <div class="title">${property.title}</div>
          <div class="address">📍 ${property.address}, ${property.city}, ${property.neighborhood || ''}</div>
          
          <div class="specs-grid">
            <div class="spec-box"><div class="spec-val">${property.bedrooms}</div><div class="spec-lbl">Bedrooms</div></div>
            <div class="spec-box"><div class="spec-val">${property.bathrooms}</div><div class="spec-lbl">Bathrooms</div></div>
            <div class="spec-box"><div class="spec-val">${property.sqft ? property.sqft.toLocaleString() : 'N/A'}</div><div class="spec-lbl">Sqft</div></div>
            <div class="spec-box"><div class="spec-val">${property.daysOnMarket || 3}</div><div class="spec-lbl">Days on Market</div></div>
          </div>

          <div class="section-title">PROPERTY DESCRIPTION</div>
          <div class="desc">${property.description || 'Premium Canadian residential property listing available in the Greater Toronto Area MLS network.'}</div>

          <div class="realtor-card">
            <div class="realtor-info">
              <div class="realtor-name">Prepared by: ${realtorName}</div>
              <div class="realtor-sub">Karan Homes Luxury Real Estate • Direct: ${realtorPhone} • ${realtorEmail}</div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Shares or prints property dossier PDF
   */
  static async sharePropertyPDF(property: Property, realtorName?: string): Promise<boolean> {
    try {
      const html = this.generateHTMLTemplate(property, realtorName);

      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(html);
          printWindow.document.close();
          printWindow.print();
          return true;
        }
      }

      return true;
    } catch (error) {
      console.warn('PDF generation/sharing fallback:', error);
      return false;
    }
  }
}
