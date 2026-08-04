import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, MapPin } from 'lucide-react';
import { HeroSearch } from '../../components/search/HeroSearch';

const SLIDESHOW_IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1920&auto=format&fit=crop"
];

export const Home: React.FC = () => {
  const { 
    properties, 
    communities, 
    setCurrentPage, 
    setSelectedPropertyId, 
    setSelectedCommunityName
  } = useApp();
  
  // Slideshow Control
  const [activeSlide, setActiveSlide] = useState(0);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % SLIDESHOW_IMAGES.length);
    }, 6000);
    return () => clearInterval(slideTimer);
  }, []);

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
    <div className="fade-in" style={{ position: 'relative', zIndex: 1 }}>
      
      {/* Dynamic Keyframe & Hover Style Injector */}
      <style>{`
        @keyframes scale-up {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fade-in-slide-down {
          0% { transform: translateY(-10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes fade-in-slide {
          0% { transform: translateY(10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .hover-purple-bg:hover {
          background: rgba(167, 139, 250, 0.12) !important;
        }
        .dropdown-item-hover:hover {
          background: rgba(167, 139, 250, 0.1) !important;
          color: var(--color-lavender) !important;
        }
        .suggestion-item-hover:hover {
          background: rgba(167, 139, 250, 0.12) !important;
        }
        .hover-white-bg:hover {
          background: rgba(255,255,255,0.12) !important;
          color: #ffffff !important;
        }
        .hover-glow-lift:hover {
          transform: scale(1.08);
          box-shadow: 0 0 20px rgba(124, 58, 237, 0.6) !important;
        }
        .search-bar-container:focus-within {
          border-color: rgba(167, 139, 250, 0.5) !important;
          box-shadow: 0 12px 30px rgba(0,0,0,0.6), 0 0 25px rgba(167, 139, 250, 0.25) !important;
        }
        @media (max-width: 768px) {
          .search-bar-container {
            flex-direction: column !important;
            border-radius: 24px !important;
            padding: 16px !important;
            align-items: stretch !important;
            gap: 12px !important;
          }
          .search-mode-col {
            width: 100% !important;
          }
          .search-bar-container > div {
            width: 100% !important;
          }
          .search-bar-container > div > button {
            width: 100% !important;
            justify-content: space-between !important;
          }
          .search-bar-container > button {
            width: 100% !important;
            border-radius: 12px !important;
            height: 44px !important;
          }
          .search-bar-container > div:nth-child(2) {
            display: none !important; /* hide vertical divider on mobile */
          }
        }
      `}</style>
      
      {/* 1. PROFESSIONAL HERO SECTION */}
      <header
        style={{
          position: 'relative',
          minHeight: isFiltersExpanded ? '1020px' : '780px',
          marginTop: '-80px',
          paddingTop: '80px',
          paddingBottom: isFiltersExpanded ? '320px' : '240px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          overflow: 'visible',
          marginBottom: '50px',
          transition: 'min-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), padding-bottom 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Full-bleed background slideshow clipping container */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: -5
          }}
        >
          {SLIDESHOW_IMAGES.map((imgUrl, index) => {
            const isActive = index === activeSlide;
            return (
              <div
                key={imgUrl}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${imgUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'scale(1.04)' : 'scale(1.00)',
                  transition: 'opacity 1.5s ease-in-out, transform 4.5s ease-out',
                  zIndex: -3
                }}
              />
            );
          })}

          {/* Clean Gradient Overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(180deg, rgba(3, 7, 18, 0.5) 0%, rgba(3, 7, 18, 0.95) 100%)',
              zIndex: -2,
              pointerEvents: 'none'
            }}
          />
        </div>

        <div className="container" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          
          <div style={{ maxWidth: '720px' }}>
            <span className="badge badge-lavender" style={{ marginBottom: '8px' }}>
              LUXURY REAL ESTATE PLATFORM
            </span>
            <h1 style={{ color: '#ffffff', marginBottom: '8px' }}>
              Find Your Dream Property in Canada
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '580px', marginBottom: '24px' }}>
              Explore luxury estates, urban penthouses, and waterfront homes with real-time analytics.
            </p>

            {/* 1.1 UNIFIED HERO SEARCH BAR */}
            <div 
              className="hero-search-wrapper"
              style={{
                width: '100%',
                maxWidth: '720px',
                position: 'relative',
                zIndex: 100
              }}
            >
              <HeroSearch onToggleExpand={(isExpanded) => setIsFiltersExpanded(isExpanded)} />
            </div>

          </div>

        </div>
      </header>

      {/* 2. FEATURED PROPERTIES */}
      <section className="section-standard">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <span className="badge badge-lavender" style={{ marginBottom: '4px' }}>FEATURED</span>
              <h2>Featured Properties</h2>
            </div>
            <button onClick={() => setCurrentPage('featured')} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
              View All <ArrowRight size={12} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {featuredList.map((property) => (
              <div
                key={property.id}
                className="floating-card"
                onClick={() => selectProperty(property.id)}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
                  <img src={property.imageUrl} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span className="badge badge-lavender" style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(3,7,18,0.8)' }}>
                    {property.category}
                  </span>
                  <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(3,7,18,0.85)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-lavender)' }}>
                    ${property.price.toLocaleString()}
                  </div>
                </div>
                <div style={{ padding: '14px' }}>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>{property.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '10px' }}>
                    <MapPin size={11} style={{ color: 'var(--color-lavender)' }} />
                    <span>{property.location}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
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
      <section className="section-standard" style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="container">
          <div style={{ marginBottom: '24px' }}>
            <span className="badge badge-lavender" style={{ marginBottom: '4px' }}>COMMUNITIES</span>
            <h2>Popular Communities</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {communities.slice(0, 4).map((community) => (
              <div
                key={community.name}
                className="floating-card"
                onClick={() => selectCommunity(community.name)}
                style={{ cursor: 'pointer', height: '220px', position: 'relative', overflow: 'hidden' }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `linear-gradient(180deg, rgba(3, 7, 18, 0.2) 0%, rgba(3, 7, 18, 0.9) 100%), url(${community.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: -1
                  }}
                />
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff' }}>{community.name}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    <span>{community.city}</span>
                    <span style={{ color: 'var(--color-lavender)', fontWeight: 600 }}>Avg: {community.averagePrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE NOVAESTATE */}
      <section className="section-standard">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 32px auto' }}>
            <span className="badge badge-lavender" style={{ marginBottom: '4px' }}>BENEFITS</span>
            <h2>Why Choose NovaEstate</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
              Sovereign discretion, AI-assisted valuation vectors, and managing partner guidance.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {[
              { title: 'Sovereign Discretion', desc: 'Discreet off-market portfolios and encrypted inquiry channels for ultra-high-net-worth clients.' },
              { title: 'AI Valuation Vectors', desc: 'Predictive analytics algorithms calculating spatial value appreciation and yield forecasts.' },
              { title: 'Licensed Managing Partners', desc: 'Direct access to senior brokers across Toronto, Vancouver, Montreal, and Calgary.' }
            ].map((pillar, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff' }}>{pillar.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6' }}>{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. LATEST MARKET INSIGHTS */}
      <section className="section-standard">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <span className="badge badge-blue" style={{ marginBottom: '4px' }}>INTELLIGENCE</span>
              <h2>Market Insights</h2>
            </div>
            <button onClick={() => setCurrentPage('blog')} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
              Read Magazine <ArrowRight size={12} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {[
              { title: "GTA Luxury Real Estate Market Q3 Trends & Yield Forecast", category: "Market Report", date: "July 2026", readTime: "4 min read" },
              { title: "Architectural Trends in Luxury Waterfront Modern Estates", category: "Design Insights", date: "June 2026", readTime: "5 min read" },
              { title: "Mortgage Rates Analysis & Buyers' Strategic Timing Guide", category: "Financial Analysis", date: "June 2026", readTime: "3 min read" }
            ].map((article, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span className="badge badge-lavender" style={{ width: 'fit-content' }}>{article.category}</span>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 600, color: '#ffffff', lineHeight: '1.4' }}>{article.title}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'auto' }}>
                  <span>{article.date}</span>
                  <span>{article.readTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section className="section-standard" style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 32px auto' }}>
            <span className="badge badge-lavender" style={{ marginBottom: '4px' }}>REPUTATION</span>
            <h2>Client Endorsements</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {[
              { quote: "NovaEstate secured our Yorkville penthouse discreetly off-market within 48 hours. Absolute institutional precision.", author: "Alexander V.", role: "Family Office Director" },
              { quote: "The AI valuation engine provided an exact comparable analysis that gave us complete confidence during negotiations.", author: "Evelyn C.", role: "Tech Entrepreneur" },
              { quote: "Their managing partner personally guided our Whistler ski chalet acquisition. The highest standard in Canadian real estate.", author: "Marcus S.", role: "Sovereign Investor" }
            ].map((test, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ color: 'var(--text-primary)', fontSize: '0.88rem', fontStyle: 'italic', lineHeight: '1.6' }}>"{test.quote}"</p>
                <div style={{ marginTop: 'auto' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 600 }}>{test.author}</h4>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{test.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CONTACT CTA */}
      <section className="section-standard">
        <div className="container">
          <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px', textAlign: 'center', border: '1px solid rgba(167, 139, 250, 0.25)', background: 'linear-gradient(135deg, rgba(7, 13, 36, 0.9) 0%, rgba(10, 18, 42, 0.6) 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <span className="badge badge-lavender">BESPOKE CONSULTATION</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#ffffff' }}>Ready to Acquire or Divest a Luxury Asset?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '580px' }}>
              Connect directly with Michael Anderson and senior managing partners for a private advisory session.
            </p>
            <button onClick={() => setCurrentPage('contact')} className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
              Schedule Consultation <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
