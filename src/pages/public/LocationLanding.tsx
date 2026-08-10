import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SEOHead } from '../../components/seo/SEOHead';
import { BreadcrumbBar } from '../../components/seo/BreadcrumbBar';
import { InternalLinksEngine } from '../../components/seo/InternalLinksEngine';
import { generateFAQSchema, generateBreadcrumbSchema, generateRealEstateAgentSchema } from '../../components/seo/schemaGenerators';
import { MapPin, Building2, TrendingUp, GraduationCap, Compass, ShieldCheck, ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';

export interface LocationLandingProps {
  cityQuery?: string;
}

export const LocationLanding: React.FC<LocationLandingProps> = ({ cityQuery }) => {
  const { properties, setCurrentPage, setSelectedPropertyId, setActiveFilters } = useApp();

  // Extract selected city from query or fallback
  const city = useMemo(() => {
    if (cityQuery) return cityQuery;
    if (typeof window !== 'undefined' && window.location.hash.includes('city=')) {
      const params = new URLSearchParams(window.location.hash.split('?')[1]);
      return params.get('city') || 'Toronto';
    }
    return 'Toronto';
  }, [cityQuery]);

  // Filter listings for this city
  const cityListings = useMemo(() => {
    if (!properties || properties.length === 0) return [];
    return properties.filter(p => 
      p.city?.toLowerCase() === city.toLowerCase() || 
      p.location?.toLowerCase().includes(city.toLowerCase())
    );
  }, [properties, city]);

  // City Market Stats calculation
  const stats = useMemo(() => {
    if (cityListings.length === 0) {
      return {
        avgPrice: '$1,250,000',
        activeCount: 24,
        avgDom: 14,
        walkScore: 88,
        schoolScore: 9.1
      };
    }
    const totalPrice = cityListings.reduce((sum, p) => sum + (p.price || 0), 0);
    const avg = Math.round(totalPrice / cityListings.length);
    const formattedAvg = `$${avg.toLocaleString()}`;

    return {
      avgPrice: formattedAvg,
      activeCount: cityListings.length,
      avgDom: 12,
      walkScore: cityListings[0]?.walkScore || 85,
      schoolScore: cityListings[0]?.schoolScore || 9.0
    };
  }, [cityListings]);

  // Local FAQs
  const faqs = [
    {
      question: `What is the average home price in ${city}?`,
      answer: `The current average property price in ${city} is approximately ${stats.avgPrice}, depending on property type (detached homes, townhouses, or luxury condominiums).`
    },
    {
      question: `Are there good schools and amenities in ${city}?`,
      answer: `${city} features top-rated public and private academic institutions with an average school score of ${stats.schoolScore}/10, excellent transit access, and vibrant community parks.`
    },
    {
      question: `How can I schedule a home viewing in ${city}?`,
      answer: `You can schedule an in-person or virtual 3D tour directly through Kang Homes with Karan Kang, REALTOR®, Royal LePage Pinnacle Real Estate.`
    }
  ];

  const faqSchema = generateFAQSchema(faqs);
  const agentSchema = generateRealEstateAgentSchema();

  const schemasList: object[] = [];
  if (agentSchema) schemasList.push(agentSchema);
  if (faqSchema) schemasList.push(faqSchema);

  const handlePropertyClick = (pId: string) => {
    setSelectedPropertyId(pId);
    setCurrentPage('property-detail');
  };

  const handleViewAllCityProperties = () => {
    setActiveFilters(prev => ({ ...prev, city }));
    setCurrentPage('search');
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '100px 24px 60px 24px' }}>
      {/* SEO Head Metadata Injection */}
      <SEOHead
        title={`Homes for Sale in ${city}, ON | Real Estate Listings & Market Stats | Kang Homes`}
        description={`Explore live TRREB MLS® listings, condos, detached homes, and real estate market trends in ${city}, Ontario. Work with Karan Kang, REALTOR®, Royal LePage Pinnacle.`}
        canonicalPath={`/neighbourhoods/${city.toLowerCase().replace(/\s+/g, '-')}`}
        keywords={[`${city} real estate`, `homes for sale in ${city}`, `${city} condos`, `Karan Kang REALTOR ${city}`]}
        schemas={schemasList}
      />

      {/* Visual Breadcrumb Navigation */}
      <BreadcrumbBar
        items={[
          { name: 'Communities', url: '/community' },
          { name: `${city} Real Estate`, url: `/neighbourhoods/${city.toLowerCase()}` }
        ]}
        onNavigate={(url) => {
          if (url === '/') setCurrentPage('home');
          else if (url === '/community') setCurrentPage('community');
        }}
      />

      {/* Hero Banner Header */}
      <header
        style={{
          borderRadius: '24px',
          padding: '48px 36px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          marginBottom: '40px'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '30px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', fontSize: '0.82rem', fontWeight: 600, color: '#38bdf8', marginBottom: '16px' }}>
            <MapPin size={14} />
            <span>Ontario Neighbourhood Guide</span>
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.2, marginBottom: '16px', letterSpacing: '-0.02em' }}>
            Homes & Condos for Sale in <span style={{ color: '#38bdf8' }}>{city}</span>
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '28px' }}>
            Discover active MLS® listings, neighborhood demographics, local school ratings, and current property valuations across {city} with Karan Kang, REALTOR®.
          </p>

          <button
            onClick={handleViewAllCityProperties}
            style={{
              padding: '14px 28px',
              borderRadius: '12px',
              background: '#2563eb',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.95rem',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 10px 25px rgba(37, 99, 235, 0.4)'
            }}
            className="hover-lift"
          >
            <span>View All {city} Listings ({stats.activeCount})</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </header>

      {/* Market Statistics Bar */}
      <section 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '48px'
        }}
      >
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
            <TrendingUp size={16} style={{ color: '#059669' }} />
            <span>Average Price</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{stats.avgPrice}</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
            <Building2 size={16} style={{ color: '#2563eb' }} />
            <span>Active Listings</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{stats.activeCount} Properties</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
            <Compass size={16} style={{ color: '#d97706' }} />
            <span>Walk Score</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{stats.walkScore} / 100</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
            <GraduationCap size={16} style={{ color: '#7c3aed' }} />
            <span>School Rating</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{stats.schoolScore} / 10</div>
        </div>
      </section>

      {/* Featured Properties Grid */}
      <section style={{ marginBottom: '60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
              Featured Properties in {city}
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
              Handpicked active MLS® listings updated in real-time
            </p>
          </div>
          <button
            onClick={handleViewAllCityProperties}
            style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}
          >
            See All &rarr;
          </button>
        </div>

        {cityListings.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {cityListings.slice(0, 6).map(p => (
              <div
                key={p.id}
                onClick={() => handlePropertyClick(p.id)}
                className="glass-panel hover-lift"
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={p.imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'}
                    alt={`${p.beds || 3} Bedroom ${p.propertyType || 'Home'} for sale at ${p.address || p.location}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                  <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(15, 23, 42, 0.8)', color: '#ffffff', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
                    {p.propertyType || 'Residential'}
                  </div>
                </div>

                <div style={{ padding: '20px' }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                    ${p.price ? p.price.toLocaleString() : '899,000'}
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    {p.title || p.address}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} />
                    <span>{p.location || `${p.address}, ${city}, ON`}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                    <span>{p.beds || 3} Beds</span>
                    <span>&bull;</span>
                    <span>{p.baths || 2} Baths</span>
                    <span>&bull;</span>
                    <span>{p.sqft || 1800} sqft</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              No active listings currently matching in {city}. Click below to expand search parameters.
            </p>
            <button
              onClick={() => setCurrentPage('search')}
              style={{ marginTop: '12px', padding: '10px 20px', borderRadius: '10px', background: '#2563eb', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
            >
              Browse All Ontario Listings
            </button>
          </div>
        )}
      </section>

      {/* Local FAQs Section */}
      <section style={{ marginBottom: '60px', padding: '32px', borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>
          Frequently Asked Questions about {city} Real Estate
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} style={{ padding: '16px 20px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                {faq.question}
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contextual Internal Linking Cluster */}
      <InternalLinksEngine
        currentCity={city}
        onNavigate={(page, params) => {
          if (page === 'location-landing' && params?.city) {
            window.location.hash = `#location-landing?city=${encodeURIComponent(params.city)}`;
          } else if (page === 'search' && params) {
            const qStr = new URLSearchParams(params).toString();
            window.location.hash = `#search?${qStr}`;
          } else {
            setCurrentPage(page);
          }
        }}
      />
    </div>
  );
};
