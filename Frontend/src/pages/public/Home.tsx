import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, MapPin, Award, ShieldCheck } from 'lucide-react';
import { HeroSearch } from '../../components/search/HeroSearch';
import { RealtorProfileCard } from '../../components/RealtorProfileCard';

export const Home: React.FC = () => {
  const { 
    properties, 
    communities, 
    setCurrentPage, 
    setSelectedPropertyId, 
    setSelectedCommunityName
  } = useApp();
  
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  const selectProperty = (id: string) => {
    setSelectedPropertyId(id);
    setCurrentPage('property-detail');
  };

  const selectCommunity = (name: string) => {
    setSelectedCommunityName(name);
    setCurrentPage('community');
  };

  const featuredList = properties.slice(0, 3);

  return (
    <div className="fade-in" style={{ position: 'relative', zIndex: 1, background: '#ffffff' }}>
      
      {/* 1. HERO SECTION - CLEAN CANADIAN REAL ESTATE DESIGN */}
      <header
        style={{
          position: 'relative',
          minHeight: isFiltersExpanded ? '920px' : '640px',
          marginTop: '-80px',
          paddingTop: '120px',
          paddingBottom: '80px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
          borderBottom: '1px solid #e2e8f0',
          transition: 'min-height 0.3s ease'
        }}
      >
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>
          
          <div style={{ maxWidth: '800px', marginBottom: '32px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(227, 24, 55, 0.08)',
                color: '#E31837',
                padding: '6px 16px',
                borderRadius: '30px',
                fontSize: '0.8rem',
                fontWeight: 700,
                marginBottom: '16px',
                border: '1px solid rgba(227, 24, 55, 0.18)'
              }}
            >
              <Award size={14} /> ROYAL LEPAGE PINNACLE REAL ESTATE
            </div>

            <h1 style={{ color: '#111827', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, lineHeight: '1.2', marginBottom: '12px' }}>
              Find Your Dream Home Across Ontario
            </h1>

            <p style={{ color: '#4b5563', fontSize: '1.05rem', fontWeight: 500, maxWidth: '640px', margin: '0 auto 28px auto', lineHeight: '1.6' }}>
              Expert Real Estate Guidance with <strong style={{ color: '#111827' }}>Karan Kang, REALTOR®</strong>. Discover premium homes, condos, and investment properties in Oakville, Mississauga, Toronto &amp; the GTA.
            </p>

            {/* 1.1 UNIFIED HERO SEARCH BAR */}
            <div 
              className="hero-search-wrapper"
              style={{
                width: '100%',
                maxWidth: '740px',
                margin: '0 auto',
                position: 'relative',
                zIndex: 100
              }}
            >
              <HeroSearch onToggleExpand={(isExpanded) => setIsFiltersExpanded(isExpanded)} />
            </div>

          </div>

        </div>
      </header>

      {/* 2. REALTOR PROFILE SECTION - KARAN KANG */}
      <section className="section-standard" style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 32px auto' }}>
            <span className="badge badge-lavender" style={{ marginBottom: '8px', background: 'rgba(227, 24, 55, 0.08)', color: '#E31837' }}>
              MEET YOUR REALTOR®
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827' }}>Personalized Canadian Real Estate Service</h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '6px' }}>
              Dedicated guidance with deep local market knowledge and Royal LePage Pinnacle backing.
            </p>
          </div>

          <RealtorProfileCard />
        </div>
      </section>

      {/* 3. FEATURED PROPERTIES */}
      <section className="section-standard" style={{ borderBottom: '1px solid #f1f5f9' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <div>
              <span className="badge badge-lavender" style={{ marginBottom: '6px', background: 'rgba(227, 24, 55, 0.08)', color: '#E31837' }}>FEATURED LISTINGS</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827' }}>Featured Properties</h2>
            </div>
            <button onClick={() => setCurrentPage('featured')} className="btn btn-secondary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
              View All Properties <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {featuredList.map((property) => (
              <div
                key={property.id}
                className="floating-card"
                onClick={() => selectProperty(property.id)}
                style={{ cursor: 'pointer', background: '#ffffff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0' }}
              >
                <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                  <img src={property.imageUrl} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: '12px', right: '12px', background: '#ffffff', color: '#111827', padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    {property.category}
                  </span>
                  <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: '#E31837', padding: '6px 12px', borderRadius: '8px', fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}>
                    ${property.price.toLocaleString()}
                  </div>
                </div>
                <div style={{ padding: '18px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>{property.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.82rem', marginBottom: '14px' }}>
                    <MapPin size={14} style={{ color: '#E31837' }} />
                    <span>{property.location}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#475569', fontWeight: 600, borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                    <span>{property.beds} Beds</span>
                    <span>{property.baths} Baths</span>
                    <span>{property.sqft.toLocaleString()} Sq Ft</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. POPULAR COMMUNITIES */}
      <section className="section-standard" style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ marginBottom: '28px' }}>
            <span className="badge badge-lavender" style={{ marginBottom: '6px', background: 'rgba(227, 24, 55, 0.08)', color: '#E31837' }}>ONTARIO NEIGHBOURHOODS</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827' }}>Popular Communities</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {communities.slice(0, 4).map((community) => (
              <div
                key={community.name}
                className="floating-card"
                onClick={() => selectCommunity(community.name)}
                style={{ cursor: 'pointer', height: '240px', position: 'relative', overflow: 'hidden', borderRadius: '16px' }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `linear-gradient(180deg, rgba(17, 24, 39, 0.1) 0%, rgba(17, 24, 39, 0.85) 100%), url(${community.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: 1
                  }}
                />
                <div style={{ position: 'absolute', bottom: '18px', left: '18px', right: '18px', zIndex: 2 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>{community.name}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#e2e8f0', marginTop: '4px', fontWeight: 500 }}>
                    <span>{community.city}</span>
                    <span style={{ color: '#ffffff', fontWeight: 700 }}>Avg: {community.averagePrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE KANG HOMES */}
      <section className="section-standard" style={{ borderBottom: '1px solid #f1f5f9' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 36px auto' }}>
            <span className="badge badge-lavender" style={{ marginBottom: '6px', background: 'rgba(227, 24, 55, 0.08)', color: '#E31837' }}>THE KANG HOMES ADVANTAGE</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827' }}>Why Choose Kang Homes</h2>
            <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '6px' }}>
              Full-service real estate representation tailored to your buying, selling, and investment goals.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              { title: 'Royal LePage Pinnacle Backing', desc: 'Industry-leading market intelligence, trusted brokerage infrastructure, and maximum exposure for your property.' },
              { title: 'Direct Realtor Guidance', desc: 'Work directly with Karan Kang for personalized strategy, skilled negotiation, and seamless transaction management.' },
              { title: 'Comprehensive GTA Coverage', desc: 'In-depth expertise spanning Oakville, Mississauga, Toronto, Brampton, Burlington, and surrounding Ontario communities.' }
            ].map((pillar, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '28px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(227, 24, 55, 0.1)', color: '#E31837', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={22} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111827' }}>{pillar.title}</h3>
                <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: '1.6' }}>{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION CONSULTATION */}
      <section className="section-standard">
        <div className="container">
          <div style={{ padding: '48px 32px', borderRadius: '20px', textAlign: 'center', border: '1px solid #e2e8f0', background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)', color: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <span style={{ background: '#E31837', color: '#ffffff', padding: '4px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>
              EXPERT CONSULTATION
            </span>
            <h2 className="cta-title" style={{ fontSize: '2.1rem', fontWeight: 800, color: '#ffffff' }}>Ready to Buy or Sell Your Home in Ontario?</h2>
            <p style={{ color: '#d1d5db', fontSize: '1rem', maxWidth: '600px', lineHeight: '1.6' }}>
              Contact Karan Kang today for a complimentary property market evaluation or personalized buyer consultation.
            </p>
            <button onClick={() => setCurrentPage('contact')} className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
              Contact Karan Kang <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
