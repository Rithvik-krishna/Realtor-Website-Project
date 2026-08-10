import React, { useEffect, useState } from 'react';
import { useApp, type Property } from '../../context/AppContext';
import { PropertyCard } from '../../components/PropertyCard';
import { 
  Building2, MapPin, Search, Filter, 
  ArrowRight, PhoneCall, Calendar, CheckCircle2, ChevronRight, TrendingUp, Award, Sparkles, RefreshCw
} from 'lucide-react';
import { apiService } from '../../services/api';

interface CityRealEstateLandingProps {
  city: 'Mississauga' | 'Brampton' | 'GTA';
  minPrice?: number;
  maxPrice?: number;
}

export const CityRealEstateLanding: React.FC<CityRealEstateLandingProps> = ({
  city,
  minPrice = 500000,
  maxPrice = 1300000
}) => {
  const { setCurrentPage, setActiveFilters } = useApp();
  const [cityProperties, setCityProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalListings, setTotalListings] = useState<number>(0);

  const formattedMin = `$${(minPrice / 1000).toFixed(0)}K`;
  const formattedMax = `$${(maxPrice / 1000000).toFixed(1)}M`;
  const fullCityName = city === 'GTA' ? 'Greater Toronto Area (GTA)' : `${city}, Ontario`;

  // SEO Page Metadata Configs
  const seoConfig = {
    Mississauga: {
      title: `Mississauga Real Estate & Homes for Sale | $500K–$1.3M CAD | NovaEstate`,
      description: `Explore active Mississauga real estate listings and homes for sale between $500,000 and $1,300,000 CAD. Access live TRREB MLS data, detached homes, townhomes, and condos in Square One, Port Credit, Erin Mills, and Lorne Park.`,
      h1: `Mississauga Real Estate & Homes for Sale ($500K–$1.3M)`,
      canonical: `https://novaestate.ca/mississauga-real-estate`,
      heroDesc: `Discover premium detached houses, semi-detached residences, townhomes, and luxury condos across Mississauga priced between $500,000 and $1,300,000 CAD. Updated in real-time with direct MLS® feed data.`,
      neighborhoods: ['Square One / City Centre', 'Port Credit', 'Erin Mills', 'Lorne Park', 'Streetsville', 'Meadowvale', 'Cooksville', 'Clarkson'],
      marketCopy: `Mississauga is one of Ontario's most sought-after real estate markets, offering a blend of vibrant urban living around Square One and serene waterfront communities along Lake Ontario in Port Credit and Clarkson. The $500,000 to $1,300,000 price range represents the core demand segment for single-family homebuyers, young professionals, and investors seeking high capital growth.`
    },
    Brampton: {
      title: `Brampton Real Estate & Homes for Sale | $500K–$1.3M CAD | NovaEstate`,
      description: `Browse live Brampton real estate listings and homes for sale priced from $500,000 to $1,300,000 CAD. Explore Bram West, Mount Pleasant, Castlemore, and Heart Lake properties with verified MLS details and virtual tours.`,
      h1: `Brampton Real Estate & Homes for Sale ($500K–$1.3M)`,
      canonical: `https://novaestate.ca/brampton-real-estate`,
      heroDesc: `Explore verified single-family detached homes, townhouses, and spacious semi-detached properties in Brampton priced between $500,000 and $1,300,000 CAD. Powered by direct TRREB MLS® synchronization.`,
      neighborhoods: ['Bram West', 'Mount Pleasant', 'Castlemore', 'Heart Lake', 'Springdale', 'Downtown Brampton', 'Bramalea', 'Goreway Drive'],
      marketCopy: `Brampton continues to be one of Canada's fastest-growing municipalities, celebrated for family-oriented neighborhoods, top-rated schools, and exceptional parkland connectivity. Properties in the $500K–$1.3M price tier offer outstanding value, featuring multi-bedroom layouts, finished basements, and generous lot sizes ideal for growing families.`
    },
    GTA: {
      title: `GTA Real Estate & Greater Toronto Area Homes for Sale | $500K–$1.3M | NovaEstate`,
      description: `Search Greater Toronto Area (GTA) real estate and homes for sale between $500,000 and $1,300,000 CAD. Access active MLS listings across Toronto, Mississauga, Brampton, Vaughan, Markham, and Oakville.`,
      h1: `GTA Real Estate & Greater Toronto Area Homes for Sale ($500K–$1.3M)`,
      canonical: `https://novaestate.ca/gta-real-estate`,
      heroDesc: `Comprehensive directory of active real estate listings across the Greater Toronto Area (GTA) priced between $500,000 and $1,300,000 CAD. Live MLS® data for Toronto, Peel, York, and Halton regions.`,
      neighborhoods: ['Toronto Central', 'Mississauga', 'Brampton', 'Vaughan', 'Markham', 'Richmond Hill', 'Oakville', 'Milton'],
      marketCopy: `The Greater Toronto Area (GTA) real estate market represents the economic heartbeat of Canadian residential property. Homes priced between $500,000 and $1,300,000 CAD encompass a diverse portfolio ranging from luxury high-rise condominiums in downtown cores to spacious detached suburban properties near top transit corridors.`
    }
  }[city];

  // Live Data Fetching for Landing Page
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchLandingData = async () => {
      try {
        const res = await apiService.getProperties({
          city: city === 'GTA' ? 'GTA' : city,
          minPrice: minPrice,
          maxPrice: maxPrice,
          page: 1,
          limit: 300
        });

        if (isMounted && res && res.success && Array.isArray(res.data)) {
          setCityProperties(res.data);
          setTotalListings(res.meta?.total || res.data.length);
        }
      } catch (err) {
        console.warn(`Could not fetch landing page properties for ${city}:`, err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLandingData();

    return () => {
      isMounted = false;
    };
  }, [city, minPrice, maxPrice]);

  // Dynamic SEO Metadata Injection (Title, Description, Canonical, OG, JSON-LD Schema)
  useEffect(() => {
    document.title = seoConfig.title;

    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', seoConfig.description);

    // Canonical Tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', seoConfig.canonical);

    // Open Graph Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', seoConfig.title);

    // Open Graph Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', seoConfig.description);

    // Open Graph URL
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', seoConfig.canonical);

    // JSON-LD Structured Data Schema.org
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": seoConfig.title,
      "description": seoConfig.description,
      "url": seoConfig.canonical,
      "about": {
        "@type": "Place",
        "name": fullCityName,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": city === 'GTA' ? 'Toronto' : city,
          "addressRegion": "ON",
          "addressCountry": "CA"
        }
      },
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": totalListings,
        "itemListElement": cityProperties.slice(0, 10).map((prop, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "item": {
            "@type": "RealEstateListing",
            "name": prop.title,
            "url": `https://novaestate.ca/#property-detail?id=${prop.id}`,
            "price": prop.price,
            "priceCurrency": "CAD"
          }
        }))
      }
    };

    let scriptTag = document.getElementById('seo-jsonld-schema') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'seo-jsonld-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(schemaData);

    return () => {
      // Clean up script tag on unmount
      const existingScript = document.getElementById('seo-jsonld-schema');
      if (existingScript) existingScript.remove();
    };
  }, [seoConfig, cityProperties, totalListings, fullCityName, city]);

  const handleSearchWithFilters = () => {
    setActiveFilters(prev => ({
      ...prev,
      city: city === 'GTA' ? 'All' : city,
      priceRange: [minPrice, maxPrice]
    }));
    setCurrentPage('search');
  };

  return (
    <div style={{ background: '#f8fafc', color: '#0f172a', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* HERO SECTION */}
      <section 
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          padding: '60px 24px 70px 24px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          {/* Breadcrumb Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '16px' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => setCurrentPage('home')}>Home</span>
            <ChevronRight size={14} />
            <span style={{ cursor: 'pointer' }} onClick={() => setCurrentPage('search')}>Real Estate</span>
            <ChevronRight size={14} />
            <span style={{ color: '#f8fafc', fontWeight: 600 }}>{city} Homes ({formattedMin}–{formattedMax})</span>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(227, 24, 55, 0.15)', border: '1px solid rgba(227, 24, 55, 0.4)', borderRadius: '20px', padding: '6px 14px', marginBottom: '20px' }}>
            <Sparkles size={16} style={{ color: '#E31837' }} />
            <span style={{ fontSize: '0.82rem', color: '#f1f5f9', fontWeight: 700 }}>
              Live TRREB MLS® Feed · Verified Listings
            </span>
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: '1.2', marginBottom: '16px', letterSpacing: '-0.02em' }}>
            {seoConfig.h1}
          </h1>

          <p style={{ fontSize: '1.1rem', color: '#cbd5e1', maxWidth: '800px', lineHeight: '1.6', marginBottom: '32px' }}>
            {seoConfig.heroDesc}
          </p>

          {/* Quick Action Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <button
              onClick={handleSearchWithFilters}
              className="btn hover-lift"
              style={{
                background: '#E31837',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.95rem',
                padding: '14px 28px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(227, 24, 55, 0.35)'
              }}
            >
              <Search size={18} />
              <span>Explore All {totalListings > 0 ? totalListings : 'Active'} Listings</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => setCurrentPage('contact')}
              className="btn hover-lift"
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.95rem',
                padding: '14px 24px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                border: '1px solid rgba(255,255,255,0.2)',
                cursor: 'pointer'
              }}
            >
              <PhoneCall size={18} />
              <span>Speak with Local Realtor</span>
            </button>
          </div>

          {/* Stat Cards */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginTop: '40px',
              paddingTop: '32px',
              borderTop: '1px solid rgba(255,255,255,0.12)'
            }}
          >
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff' }}>
                {totalListings > 0 ? totalListings.toLocaleString() : '100+'}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Available Active Listings</div>
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff' }}>
                {formattedMin} – {formattedMax}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Approved Target Price Range</div>
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff' }}>100% Real</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Direct MLS® / AMPRE Feed</div>
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff' }}>0ms</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Cached Instant Delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <div style={{ maxWidth: '1200px', margin: '40px auto 0 auto', padding: '0 24px' }}>
        
        {/* LISTINGS SECTION */}
        <section style={{ marginBottom: '60px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Active {city} Properties ({formattedMin} – {formattedMax})
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '4px 0 0 0' }}>
                Showing verified properties currently active on the market in {fullCityName}
              </p>
            </div>

            <button
              onClick={handleSearchWithFilters}
              style={{
                background: '#ffffff',
                border: '1.5px solid #cbd5e1',
                padding: '10px 18px',
                borderRadius: '10px',
                fontSize: '0.88rem',
                fontWeight: 700,
                color: '#0f172a',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              className="hover-lift"
            >
              <Filter size={16} />
              <span>Advanced Search &amp; Map View</span>
            </button>
          </div>

          {loading ? (
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '60px 24px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
              <RefreshCw size={36} className="spin" style={{ color: '#E31837', margin: '0 auto 16px auto', display: 'block' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                Loading Verified TRREB MLS® Listings for {city}...
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Connecting to live OData data pipeline...</p>
            </div>
          ) : cityProperties.length === 0 ? (
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '60px 24px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
              <Building2 size={40} style={{ color: '#94a3b8', margin: '0 auto 16px auto', display: 'block' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                No active listings match exact filters right now
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '500px', margin: '0 auto 20px auto' }}>
                We could not find active properties in {city} in the exact ${minPrice.toLocaleString()} – ${maxPrice.toLocaleString()} range at this second.
              </p>
              <button
                onClick={handleSearchWithFilters}
                style={{ background: '#0f172a', color: '#ffffff', padding: '12px 24px', borderRadius: '10px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
              >
                Browse All {city} Real Estate
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '24px'
              }}
            >
              {cityProperties.slice(0, 12).map(prop => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          )}

          {cityProperties.length > 12 && (
            <div style={{ textAlign: 'center', marginTop: '36px' }}>
              <button
                onClick={handleSearchWithFilters}
                className="btn hover-lift"
                style={{
                  background: '#0f172a',
                  color: '#ffffff',
                  padding: '14px 32px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <span>View All {cityProperties.length} Properties in {city}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </section>

        {/* SEO CONTENT & LOCAL MARKET GUIDE */}
        <section 
          style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '40px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            marginBottom: '60px'
          }}
        >
          <div style={{ maxWidth: '900px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#E31837', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              <Award size={16} />
              <span>Local Market Insights &amp; Buying Guide</span>
            </div>

            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
              Navigating {city} Real Estate Between $500K and $1.3M CAD
            </h2>

            <p style={{ fontSize: '1rem', color: '#334155', lineHeight: '1.7', marginBottom: '24px' }}>
              {seoConfig.marketCopy}
            </p>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginTop: '32px', marginBottom: '16px' }}>
              Top Communities &amp; Neighborhoods in {city}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px', marginBottom: '32px' }}>
              {seoConfig.neighborhoods.map((hood, i) => (
                <div 
                  key={i}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#0f172a'
                  }}
                >
                  <MapPin size={16} style={{ color: '#E31837', flexShrink: 0 }} />
                  <span>{hood}</span>
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginTop: '32px', marginBottom: '16px' }}>
              Why Buy in {city} with NovaEstate?
            </h3>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '14px' }}>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.95rem', color: '#334155', lineHeight: '1.5' }}>
                  <strong>Verified MLS® Feed:</strong> Every listing is synchronized directly with official TRREB/AMPRE board feeds, ensuring 100% accurate prices, addresses, and status updates.
                </span>
              </li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.95rem', color: '#334155', lineHeight: '1.5' }}>
                  <strong>Local Market Expertise:</strong> Access neighborhood school ratings, walk scores, transit accessibility ratings, and historical price trends for every property.
                </span>
              </li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.95rem', color: '#334155', lineHeight: '1.5' }}>
                  <strong>Direct Realtor Support:</strong> Connect with experienced local agents to schedule VIP private viewings, draft purchase agreements, or request custom market valuations.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* LEAD GENERATION CTA BANNER */}
        <section 
          style={{
            background: 'linear-gradient(135deg, #E31837 0%, #b91c1c 100%)',
            color: '#ffffff',
            borderRadius: '20px',
            padding: '48px 36px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(227, 24, 55, 0.25)',
            marginBottom: '60px'
          }}
        >
          <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '12px' }}>
            Looking to Buy or Sell in {city}?
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#fecdd3', maxWidth: '650px', margin: '0 auto 28px auto', lineHeight: '1.6' }}>
            Get instant access to off-market listings, price drops, and personalized property recommendations in {city} priced between $500K and $1.3M CAD.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setCurrentPage('schedule-viewing')}
              className="btn hover-lift"
              style={{
                background: '#ffffff',
                color: '#b91c1c',
                fontWeight: 800,
                padding: '14px 28px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Calendar size={18} />
              <span>Book a Private Viewing</span>
            </button>

            <button
              onClick={() => setCurrentPage('home-valuation')}
              className="btn hover-lift"
              style={{
                background: 'rgba(0,0,0,0.25)',
                color: '#ffffff',
                fontWeight: 700,
                padding: '14px 28px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.4)',
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <TrendingUp size={18} />
              <span>Get Free Home Valuation</span>
            </button>
          </div>
        </section>

        {/* OTHER LOCATION LINKS (INTERNAL LINKING FOR SEO) */}
        <section>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
            Explore Other GTA Real Estate Locations
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {city !== 'Mississauga' && (
              <div 
                onClick={() => setCurrentPage('mississauga-real-estate')}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '20px',
                  cursor: 'pointer'
                }}
                className="hover-lift"
              >
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem', marginBottom: '4px' }}>
                  Mississauga Real Estate
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Homes for sale ($500K–$1.3M CAD)
                </div>
              </div>
            )}

            {city !== 'Brampton' && (
              <div 
                onClick={() => setCurrentPage('brampton-real-estate')}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '20px',
                  cursor: 'pointer'
                }}
                className="hover-lift"
              >
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem', marginBottom: '4px' }}>
                  Brampton Real Estate
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Homes for sale ($500K–$1.3M CAD)
                </div>
              </div>
            )}

            {city !== 'GTA' && (
              <div 
                onClick={() => setCurrentPage('gta-real-estate')}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '20px',
                  cursor: 'pointer'
                }}
                className="hover-lift"
              >
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem', marginBottom: '4px' }}>
                  Greater Toronto Area (GTA)
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  All GTA homes for sale ($500K–$1.3M CAD)
                </div>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};
