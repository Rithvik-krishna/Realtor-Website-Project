import React from 'react';
import { type Property, useApp } from '../context/AppContext';
import { Bed, Bath, Maximize, MapPin, Heart, ArrowRight } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { setSelectedPropertyId, setCurrentPage, savedProperties, toggleSaveProperty } = useApp();
  const isSaved = savedProperties.includes(property.id);

  const handleClick = () => {
    setSelectedPropertyId(property.id);
    setCurrentPage('property-detail');
  };

  return (
    <div
      onClick={handleClick}
      className="glass-panel hover-lift"
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid #e2e8f0',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
        transition: 'all 0.25s ease'
      }}
    >
      {/* Image Container */}
      <div style={{ position: 'relative', height: '210px', width: '100%', overflow: 'hidden', background: '#0f172a' }}>
        <img
          src={property.imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'}
          alt={property.title}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';
          }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
        />

        {/* Price Badge */}
        <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', color: '#ffffff', padding: '6px 14px', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 800 }}>
          ${property.price ? property.price.toLocaleString() : 'N/A'}
        </div>

        {/* Heart Save Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveProperty(property.id);
          }}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        >
          <Heart size={18} fill={isSaved ? '#E31837' : 'none'} color={isSaved ? '#E31837' : '#475569'} />
        </button>

        {/* City Badge */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(227, 24, 55, 0.9)', color: '#ffffff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>
          {property.city || 'Ontario'}
        </div>
      </div>

      {/* Details Container */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {property.title}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#475569' }}>
          <MapPin size={14} style={{ color: '#E31837', flexShrink: 0 }} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {property.address || property.location || property.city}
          </span>
        </div>

        {/* Specs Grid */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', color: '#334155', fontWeight: 600, borderTop: '1px solid #f1f5f9', paddingTop: '10px', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Bed size={14} style={{ color: '#64748b' }} />
            <span>{property.beds ?? 'N/A'} Beds</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Bath size={14} style={{ color: '#64748b' }} />
            <span>{property.baths ?? 'N/A'} Baths</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Maximize size={14} style={{ color: '#64748b' }} />
            <span>{property.sqft ? `${property.sqft.toLocaleString()} sqft` : 'N/A'}</span>
          </div>
        </div>

        {/* Card Footer Link */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
            MLS® {property.mlsNumber || property.id}
          </span>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#E31837', display: 'flex', alignItems: 'center', gap: '4px' }}>
            View Details <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </div>
  );
};
