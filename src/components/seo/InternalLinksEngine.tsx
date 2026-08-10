import React from 'react';
import { ArrowUpRight, MapPin, Building2, BookOpen, ShieldCheck, Home } from 'lucide-react';

export interface InternalLinksEngineProps {
  currentCity?: string;
  currentPropertyType?: string;
  onNavigate?: (page: string, params?: any) => void;
}

const CITIES = ['Toronto', 'Mississauga', 'Brampton', 'Oakville', 'Milton', 'Vaughan', 'Markham', 'Richmond Hill'];
const PROPERTY_TYPES = ['Detached', 'Semi Detached', 'Townhouse', 'Condo', 'Luxury Estate'];

export const InternalLinksEngine: React.FC<InternalLinksEngineProps> = ({
  currentCity = 'Toronto',
  currentPropertyType = 'Detached',
  onNavigate
}) => {
  const handleLinkClick = (e: React.MouseEvent, page: string, params?: any) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page, params);
    } else {
      if (page === 'location-landing' && params?.city) {
        window.location.hash = `#location-landing?city=${encodeURIComponent(params.city)}`;
      } else if (page === 'search' && params) {
        const qStr = new URLSearchParams(params).toString();
        window.location.hash = `#search?${qStr}`;
      } else {
        window.location.hash = `#${page}`;
      }
    }
  };

  return (
    <section 
      style={{
        marginTop: '40px',
        padding: '32px 24px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.9) 100%)',
        border: '1px solid rgba(226, 232, 240, 1)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
      }}
    >
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
          Explore Real Estate Across Greater Toronto
        </h3>
        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
          Browse popular locations, property types, and market guides compiled by Karan Kang REALTOR®
        </p>
      </div>

      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px'
        }}
      >
        {/* Column 1: Regional Cities & Communities */}
        <div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={16} style={{ color: '#2563eb' }} />
            Popular Cities & Hubs
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {CITIES.map(city => (
              <li key={city}>
                <a
                  href={`#location-landing?city=${encodeURIComponent(city)}`}
                  onClick={(e) => handleLinkClick(e, 'location-landing', { city })}
                  style={{
                    fontSize: '0.85rem',
                    color: city.toLowerCase() === currentCity.toLowerCase() ? '#2563eb' : '#475569',
                    fontWeight: city.toLowerCase() === currentCity.toLowerCase() ? 700 : 500,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  className="hover:text-blue-600 hover:underline"
                >
                  <span>Homes for Sale in {city}</span>
                  <ArrowUpRight size={13} style={{ opacity: 0.6 }} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Property Types & Categories */}
        <div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Building2 size={16} style={{ color: '#059669' }} />
            Property Types in {currentCity}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {PROPERTY_TYPES.map(type => (
              <li key={type}>
                <a
                  href={`#search?city=${encodeURIComponent(currentCity)}&type=${encodeURIComponent(type)}`}
                  onClick={(e) => handleLinkClick(e, 'search', { city: currentCity, type })}
                  style={{
                    fontSize: '0.85rem',
                    color: type.toLowerCase() === currentPropertyType.toLowerCase() ? '#059669' : '#475569',
                    fontWeight: type.toLowerCase() === currentPropertyType.toLowerCase() ? 700 : 500,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  className="hover:text-emerald-600 hover:underline"
                >
                  <span>{type}s in {currentCity}</span>
                  <ArrowUpRight size={13} style={{ opacity: 0.6 }} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Home Buyers & Sellers Resources */}
        <div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} style={{ color: '#d97706' }} />
            Buyer & Seller Hubs
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>
              <a
                href="#buyer"
                onClick={(e) => handleLinkClick(e, 'buyer')}
                style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                className="hover:text-amber-600 hover:underline"
              >
                <span>Home Buyer Strategy Guide</span>
                <ArrowUpRight size={13} style={{ opacity: 0.6 }} />
              </a>
            </li>
            <li>
              <a
                href="#seller"
                onClick={(e) => handleLinkClick(e, 'seller')}
                style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                className="hover:text-amber-600 hover:underline"
              >
                <span>What Is My Home Worth? (Valuation)</span>
                <ArrowUpRight size={13} style={{ opacity: 0.6 }} />
              </a>
            </li>
            <li>
              <a
                href="#community"
                onClick={(e) => handleLinkClick(e, 'community')}
                style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                className="hover:text-amber-600 hover:underline"
              >
                <span>Neighbourhood & Lifestyle Guides</span>
                <ArrowUpRight size={13} style={{ opacity: 0.6 }} />
              </a>
            </li>
            <li>
              <a
                href="#blog"
                onClick={(e) => handleLinkClick(e, 'blog')}
                style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                className="hover:text-amber-600 hover:underline"
              >
                <span>GTA Market Reports & Editorial</span>
                <ArrowUpRight size={13} style={{ opacity: 0.6 }} />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div 
        style={{
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(203, 213, 225, 0.6)',
          fontSize: '0.78rem',
          color: '#64748b',
          lineHeight: 1.5
        }}
      >
        <strong>MLS® System Disclaimer:</strong> Listing information is derived from the Toronto Regional Real Estate Board (TRREB) MLS® System. Indicated properties are listed by Royal LePage Pinnacle Real Estate and participating TRREB brokerage firms. Not intended to solicit properties currently under contract.
      </div>
    </section>
  );
};
