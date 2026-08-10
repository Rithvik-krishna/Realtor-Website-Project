import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SEOHead } from '../../components/seo/SEOHead';
import { BreadcrumbBar } from '../../components/seo/BreadcrumbBar';
import { InternalLinksEngine } from '../../components/seo/InternalLinksEngine';
import { PropertyInfoModal } from '../../components/PropertyInfoModal';
import { ListingAlertModal } from '../../components/ListingAlertModal';
import { generateFAQSchema, generateRealEstateAgentSchema, generateOrganizationSchema } from '../../components/seo/schemaGenerators';
import { MapPin, Building2, TrendingUp, GraduationCap, Compass, ShieldCheck, ArrowRight, Bell, Info, Heart, CheckCircle2, ChevronRight, SlidersHorizontal } from 'lucide-react';

export interface HomesForSaleLandingProps {
  locationParam?: string;
  priceParam?: string;
  typeParam?: string;
}

export const HomesForSaleLanding: React.FC<HomesForSaleLandingProps> = ({
  locationParam,
  priceParam,
  typeParam
}) => {
  const { properties, setCurrentPage, setSelectedPropertyId, setActiveFilters, savedProperties, toggleSaveProperty } = useApp();

  // Selected property for PropertyInfoModal
  const [infoModalProperty, setInfoModalProperty] = useState<any>(null);
  const [alertModalOpen, setAlertModalOpen] = useState(false);

  // Parse location (Mississauga, Brampton, GTA / Toronto, etc.)
  const location = useMemo(() => {
    if (locationParam) return locationParam;
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      const parts = hash.split('/');
      if (parts[0] === 'homes-for-sale' && parts[1]) {
        const loc = parts[1].replace(/-/g, ' ');
        return loc.charAt(0).toUpperCase() + loc.slice(1);
      }
    }
    return 'Mississauga';
  }, [locationParam]);

  const isGTA = location.toLowerCase().includes('gta') || location.toLowerCase().includes('toronto');

  // Filter listings by target location and target price range ($750k - $1.3M CAD)
  const filteredListings = useMemo(() => {
    if (!properties || properties.length === 0) return [];

    return properties.filter(p => {
      // 1. Location match
      const pCity = (p.city || '').toLowerCase();
      const pLoc = (p.location || '').toLowerCase();
      const targetLocLower = location.toLowerCase();

      let matchesLocation = false;
      if (isGTA) {
        matchesLocation = true; // GTA covers entire region
      } else {
        matchesLocation = pCity.includes(targetLocLower) || pLoc.includes(targetLocLower);
      }

      // 2. Price filter ($750,000 - $1,300,000 CAD)
      const matchesPrice = p.price >= 750000 && p.price <= 1300000;

      // 3. Optional property type filter
      let matchesType = true;
      if (typeParam && typeParam !== 'all') {
        matchesType = p.propertyType?.toLowerCase().includes(typeParam.toLowerCase()) || false;
      }

      return matchesLocation && matchesPrice && matchesType;
    });
  }, [properties, location, isGTA, typeParam]);

  // Market stats calculation
  const stats = useMemo(() => {
    if (filteredListings.length === 0) {
      return {
        avgPrice: '$985,000',
        count: 100,
        avgDom: 11,
        walkScore: 86
      };
    }
    const totalPrice = filteredListings.reduce((sum, p) => sum + (p.price || 0), 0);
    const avg = Math.round(totalPrice / filteredListings.length);
    return {
      avgPrice: `$${avg.toLocaleString()}`,
      count: filteredListings.length,
      avgDom: 12,
      walkScore: filteredListings[0]?.walkScore || 85
    };
  }, [filteredListings]);

  // Local FAQs
  const faqs = [
    {
      question: `What are the typical prices for homes for sale in ${location} between $750,000 and $1,300,000?`,
      answer: `In ${location}, $750,000 to $1,300,000 CAD offers excellent value including modern 3 to 4 bedroom detached family homes, semi-detached properties, and luxury penthouses with top-tier school access.`
    },
    {
      question: `How quickly do homes in ${location} sell?`,
      answer: `Active MLS® listings in ${location} currently spend an average of ${stats.avgDom} days on market. Working with Karan Kang, REALTOR®, ensures immediate access to new inventory as soon as it is listed.`
    },
    {
      question: `Can I get automated listing alerts for homes in ${location}?`,
      answer: `Yes! You can set up instant email and SMS listing alerts through Kang Homes to receive immediate updates when new properties between $750k and $1.3M hit the market.`
    }
  ];

  const faqSchema = generateFAQSchema(faqs);
  const agentSchema = generateRealEstateAgentSchema();
  const orgSchema = generateOrganizationSchema();

  const schemasList: object[] = [];
  if (agentSchema) schemasList.push(agentSchema);
  if (orgSchema) schemasList.push(orgSchema);
  if (faqSchema) schemasList.push(faqSchema);

  const handlePropertyClick = (pId: string) => {
    setSelectedPropertyId(pId);
    setCurrentPage('property-detail');
  };

  const handleOpenInfoModal = (e: React.MouseEvent, p: any) => {
    e.stopPropagation();
    setInfoModalProperty(p);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '100px 24px 60px 24px' }}>
      {/* SEO Head Metadata Injection */}
      <SEOHead
        title={`Homes for Sale in ${location} $750K–$1.3M CAD | MLS® Listings | Kang Homes`}
        description={`Browse ${stats.count} active TRREB MLS® homes for sale in ${location} between $750,000 and $1,300,000 CAD. Book viewings & receive listing alerts with Karan Kang, REALTOR®.`}
        canonicalPath={`/homes-for-sale/${location.toLowerCase().replace(/\s+/g, '-')}/750k-1.3m`}
        keywords={[`homes for sale ${location} 750k to 1.3m`, `houses for sale ${location}`, `${location} real estate under 1.3m`]}
        schemas={schemasList}
      />

      {/* Visual Breadcrumb Bar */}
      <BreadcrumbBar
        items={[
          { name: 'Homes for Sale', url: '/search' },
          { name: location, url: `/homes-for-sale/${location.toLowerCase()}` },
          { name: '$750K - $1.3M CAD', url: `/homes-for-sale/${location.toLowerCase()}/750k-1.3m` }
        ]}
        onNavigate={(url) => {
          if (url === '/search') setCurrentPage('search');
        }}
      />

      {/* Hero Banner Header */}
      <header
        style={{
          borderRadius: '24px',
          padding: '44px 36px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          marginBottom: '36px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px'
        }}
      >
        <div style={{ maxWidth: '680px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '30px', background: 'rgba(37, 99, 235, 0.2)', color: '#60a5fa', fontSize: '0.82rem', fontWeight: 700, marginBottom: '14px', border: '1px solid rgba(96, 165, 250, 0.3)' }}>
            <MapPin size={14} />
            <span>Target Buyer Inventory &bull; $750,000 – $1,300,000 CAD</span>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.2, marginBottom: '14px', letterSpacing: '-0.02em' }}>
            Homes for Sale in <span style={{ color: '#38bdf8' }}>{location}</span> from $750K to $1.3M
          </h1>

          <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '24px' }}>
            Explore {filteredListings.length > 0 ? filteredListings.length : stats.count} active MLS® properties matching your exact target criteria across {location}. Handpicked for quality, location, and long-term resale value.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setAlertModalOpen(true)}
              style={{ padding: '12px 22px', borderRadius: '12px', background: '#059669', color: '#fff', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 20px rgba(5, 150, 105, 0.3)' }}
              className="hover-lift"
            >
              <Bell size={16} />
              <span>Get Instant Listing Alerts</span>
            </button>
          </div>
        </div>

        {/* Quick Inventory Summary Box */}
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', padding: '24px', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.12)', minWidth: '240px' }}>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, marginBottom: '6px' }}>Average Price in Range</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38bdf8', marginBottom: '14px' }}>{stats.avgPrice}</div>
          <div style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={14} style={{ color: '#10b981' }} />
            <span>{filteredListings.length} Verified MLS® Listings</span>
          </div>
        </div>
      </header>

      {/* Property Cards Grid */}
      <section style={{ marginBottom: '60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
            Available Listings in {location} ($750K - $1.3M)
          </h2>
          <button
            onClick={() => {
              setActiveFilters(prev => ({ ...prev, city: location, priceRange: [750000, 1300000] }));
              setCurrentPage('search');
            }}
            style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}
          >
            Open Interactive Map &rarr;
          </button>
        </div>

        {filteredListings.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {filteredListings.map(p => {
              const isSaved = savedProperties.includes(p.id);

              return (
                <div
                  key={p.id}
                  onClick={() => handlePropertyClick(p.id)}
                  className="glass-panel hover-lift"
                  style={{
                    borderRadius: '18px',
                    overflow: 'hidden',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ height: '210px', overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={p.imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'}
                      alt={`${p.beds || 3} Bedroom ${p.propertyType || 'Home'} for sale in ${p.city}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                    <div style={{ position: 'absolute', top: '12px', left: '12px', background: '#2563eb', color: '#ffffff', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
                      ${p.price ? p.price.toLocaleString() : '988,000'}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveProperty(p.id);
                      }}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(255,255,255,0.85)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '34px',
                        height: '34px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <Heart size={16} style={{ color: isSaved ? '#e11d48' : '#64748b', fill: isSaved ? '#e11d48' : 'none' }} />
                    </button>
                  </div>

                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                        {p.title || p.address}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={13} />
                        <span>{p.location || `${p.address}, ${p.city}, ON`}</span>
                      </div>

                      <div style={{ display: 'flex', gap: '14px', fontSize: '0.85rem', color: '#475569', fontWeight: 600, marginBottom: '16px' }}>
                        <span>{p.beds || 3} Beds</span>
                        <span>&bull;</span>
                        <span>{p.baths || 2} Baths</span>
                        <span>&bull;</span>
                        <span>{p.sqft || 1850} sqft</span>
                      </div>
                    </div>

                    {/* Lead Capture Action Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                      <button
                        onClick={(e) => handleOpenInfoModal(e, p)}
                        style={{ padding: '8px 12px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                      >
                        <Info size={13} />
                        <span>Get Info</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPropertyId(p.id);
                          setCurrentPage('property-detail');
                        }}
                        style={{ padding: '8px 12px', borderRadius: '8px', background: '#2563eb', color: '#ffffff', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                      >
                        <span>View Details</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ padding: '48px', textAlign: 'center', background: '#f8fafc', borderRadius: '20px', border: '1px dashed #cbd5e1' }}>
            <p style={{ fontSize: '1rem', color: '#64748b', marginBottom: '16px' }}>
              Currently synchronizing latest MLS® inventory for {location} in the $750k–$1.3M range.
            </p>
            <button
              onClick={() => setAlertModalOpen(true)}
              style={{ padding: '12px 24px', borderRadius: '12px', background: '#059669', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
            >
              Sign Up for Instant Listing Alerts
            </button>
          </div>
        )}
      </section>

      {/* Local FAQs */}
      <section style={{ marginBottom: '60px', padding: '32px', borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>
          Buying a Home in {location} ($750K - $1.3M CAD) FAQ
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} style={{ padding: '16px 20px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                {faq.question}
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contextual SEO Internal Links */}
      <InternalLinksEngine
        currentCity={location}
        onNavigate={(page, params) => {
          if (page === 'search') {
            setActiveFilters(prev => ({ ...prev, ...params }));
            setCurrentPage('search');
          } else {
            setCurrentPage(page);
          }
        }}
      />

      {/* Lead Capture Modals */}
      <PropertyInfoModal
        isOpen={Boolean(infoModalProperty)}
        onClose={() => setInfoModalProperty(null)}
        property={infoModalProperty}
      />

      <ListingAlertModal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        defaultLocation={location}
      />
    </div>
  );
};
