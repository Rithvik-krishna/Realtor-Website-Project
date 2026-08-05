import React from 'react';

export const Logo: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 40 }) => {
  return (
    <div className={`logo-container ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {/* Royal LePage Pinnacle Official Logo Image */}
      <img
        src="/royal-lepage-logo.jpg"
        alt="Royal LePage Pinnacle Real Estate"
        style={{
          height: `${size}px`,
          width: 'auto',
          objectFit: 'contain',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: `${Math.max(size * 0.5, 18)}px`,
            letterSpacing: '-0.02em',
            color: '#111827'
          }}
        >
          Kang <span style={{ fontWeight: 600, color: '#E31837' }}>Homes</span>
        </span>
      </div>
    </div>
  );
};

export const FaviconSVG: React.FC<{ size?: number }> = ({ size = 64 }) => {
  return (
    <img
      src="/royal-lepage-logo.jpg"
      alt="Kang Homes Royal LePage"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'contain'
      }}
    />
  );
};
