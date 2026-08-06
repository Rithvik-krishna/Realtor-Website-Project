import React from 'react';
import { useApp } from '../../context/AppContext';
import { Heart, MapPin, Eye, Sparkles, Building, Waves, Trees } from 'lucide-react';

export const Featured: React.FC = () => {
  const { properties, savedProperties, toggleSaveProperty, setCurrentPage, setSelectedPropertyId, showToast } = useApp();

  // Filter for featured properties, ensuring we have at least 5-6 premium listings
  const featuredListings = properties.filter(p => p.featured).slice(0, 6);

  // If there are less than 6 featured flags, pad with premium ones
  const finalFeatured = featuredListings.length >= 5 
    ? featuredListings 
    : properties.slice(0, 6);

  const handleViewDetails = (id: string) => {
    setSelectedPropertyId(id);
    setCurrentPage('property-detail');
    showToast(`Loading high-fidelity details.`, 'info');
  };

  return (
    <div className="fade-in" style={{ paddingTop: '20px', minHeight: '100vh', paddingBottom: '40px' }}>
      <div className="container">
        
        {/* Header Hero Section */}
        <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', maxWidth: '800px', margin: '0 auto 32px auto' }}>
          <div className="badge badge-lavender" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Sparkles size={12} />
            <span>THE RESERVE SELECTION</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: '1.25' }}>
            Featured <span className="text-gradient-electric">Architectural Masterpieces</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
            Immerse yourself in our premier private Reserve ledger. High-fidelity residences selected for architectural prominence, elite locations, and sovereign integrity.
          </p>
        </section>

        {/* Listings Grid */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#ffffff' }}>Active Ledger Highlights</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Updated live with real-time TRREB integration tokens</p>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Showing <strong style={{ color: '#ffffff' }}>{finalFeatured.length}</strong> Premier Curations</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }} className="featured-listings-grid">
            {finalFeatured.map((p, idx) => {
              const isSaved = savedProperties.includes(p.id);
              
              // Custom floating visual category accent tags safely handling undefined p.category
              const categoryStr = (p.category || p.propertySubType || p.propertyType || 'Residential').toLowerCase();
              const isWaterfront = categoryStr.includes('waterfront');
              const isAlpine = categoryStr.includes('alpine');

              return (
                <div 
                  key={p.id} 
                  className="floating-card hover-glow featured-item-card"
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    background: 'rgba(7, 13, 36, 0.45)',
                    border: '1px solid rgba(167, 139, 250, 0.1)',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s'
                  }}
                >
                  
                  {/* Photo Container */}
                  <div style={{ height: '260px', overflow: 'hidden', position: 'relative' }}>
                    <img 
                      src={p.imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'} 
                      alt={p.title || 'Featured Property'} 
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }} 
                      className="featured-photo"
                    />
                    
                    {/* Atmospheric Dark Mask */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(180deg, transparent 60%, rgba(3,7,18,0.7) 100%)', pointerEvents: 'none' }} />
                    
                    {/* Floating Taxonomy badge */}
                    <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px' }}>
                      <span className="badge badge-lavender badge-glow" style={{ textShadow: 'none', background: 'rgba(3,7,18,0.85)' }}>
                        {isWaterfront && <Waves size={10} style={{ marginRight: '4px' }} />}
                        {isAlpine && <Trees size={10} style={{ marginRight: '4px' }} />}
                        {!isWaterfront && !isAlpine && <Building size={10} style={{ marginRight: '4px' }} />}
                        {p.category || p.propertySubType || p.propertyType || 'Residential'}
                      </span>
                      {idx < 2 && (
                        <span className="badge badge-blue" style={{ background: 'rgba(59, 130, 246, 0.25)', border: '1px solid rgba(59, 130, 246, 0.4)' }}>PLATINUM</span>
                      )}
                    </div>

                    {/* Heart Save CTA */}
                    <button
                      onClick={() => toggleSaveProperty(p.id)}
                      style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'rgba(3, 7, 18, 0.75)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: isSaved ? 'var(--color-lavender)' : '#ffffff',
                        transition: '0.3s',
                        backdropFilter: 'blur(8px)'
                      }}
                      className="hover-lift"
                    >
                      <Heart size={16} fill={isSaved ? 'var(--color-lavender)' : 'none'} style={{ transition: '0.2s' }} />
                    </button>
                  </div>

                  {/* Core details */}
                  <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '18px', flex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}>{p.title}</h3>
                        <span style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-lavender)', fontFamily: 'var(--font-display)' }}>${(p.price || 0).toLocaleString()}</span>
                      </div>
                      
                      <p style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <MapPin size={12} style={{ color: 'var(--color-lavender)' }} />
                        <span>{p.location || p.address || p.city || 'Ontario, Canada'}</span>
                      </p>
                    </div>

                    {/* Divider line */}
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

                    {/* Specs tokens */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '20px' }}>
                        <div>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Bedrooms</span>
                          <p style={{ fontSize: '0.92rem', fontWeight: 600, color: '#ffffff', marginTop: '2px' }}>{p.beds || 0} Br</p>
                        </div>
                        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.05)', alignSelf: 'center' }} />
                        <div>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Bathrooms</span>
                          <p style={{ fontSize: '0.92rem', fontWeight: 600, color: '#ffffff', marginTop: '2px' }}>{p.baths || 0} Ba</p>
                        </div>
                        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.05)', alignSelf: 'center' }} />
                        <div>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Area</span>
                          <p style={{ fontSize: '0.92rem', fontWeight: 600, color: '#ffffff', marginTop: '2px' }}>{(p.sqft || 0).toLocaleString()} Sq Ft</p>
                        </div>
                      </div>
                    </div>

                    {/* Divider line */}
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginTop: '2px' }} />

                    {/* Actions bar */}
                    <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                      <button 
                        onClick={() => handleViewDetails(p.id)}
                        className="btn btn-primary hover-lift"
                        style={{ flex: 1, padding: '12px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', gap: '8px', borderRadius: '12px' }}
                      >
                        <Eye size={14} />
                        <span>View Details</span>
                      </button>
                      <button 
                        onClick={() => toggleSaveProperty(p.id)}
                        className="btn btn-secondary hover-lift"
                        style={{ padding: '12px 18px', fontSize: '0.82rem', display: 'flex', gap: '6px', borderRadius: '12px', borderColor: isSaved ? 'rgba(167, 139, 250, 0.4)' : 'rgba(255,255,255,0.08)' }}
                      >
                        <Heart size={14} fill={isSaved ? 'var(--color-lavender)' : 'none'} style={{ color: isSaved ? 'var(--color-lavender)' : 'var(--text-secondary)' }} />
                        <span>{isSaved ? 'Curated' : 'Curate'}</span>
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        </section>

      </div>

      <style>{`
        .featured-item-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(167, 139, 250, 0.15);
          border-color: rgba(167, 139, 250, 0.3) !important;
        }
        .featured-item-card:hover .featured-photo {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};
