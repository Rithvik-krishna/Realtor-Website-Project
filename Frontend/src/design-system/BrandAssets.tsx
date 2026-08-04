import React from 'react';

export const Logo: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 32 }) => {
  return (
    <div className={`logo-container ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 0 12px rgba(167, 139, 250, 0.45))' }}
      >
        {/* Abstract continuous geometric ribbon for N and luxury architecture roofline */}
        <path
          d="M20 75V25C20 25 35 15 50 28L80 50V75L50 45L20 75Z"
          fill="url(#paint0_linear_logo)"
          opacity="0.85"
        />
        <path
          d="M20 25L50 45L80 25V35L50 55L20 35V25Z"
          fill="url(#paint1_linear_logo)"
        />
        {/* Glowing polar star burst in the upper corner representing Nova (The Star) */}
        <path
          d="M80 18C80 23 75 25 75 25C75 25 80 27 80 32C80 27 85 25 85 25C85 25 80 23 80 18Z"
          fill="#ffffff"
          style={{ filter: 'drop-shadow(0 0 8px #d8b4fe)' }}
        />
        
        <defs>
          <linearGradient id="paint0_linear_logo" x1="20" y1="75" x2="80" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="50%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
          <linearGradient id="paint1_linear_logo" x1="20" y1="25" x2="80" y2="55" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: `${size * 0.55}px`,
          letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, #ffffff 0%, #d8b4fe 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 30px rgba(167, 139, 250, 0.15)'
        }}
      >
        Nova<span style={{ fontWeight: 300, color: 'var(--color-lavender)' }}>Estate</span>
      </span>
    </div>
  );
};

export const FaviconSVG: React.FC<{ size?: number }> = ({ size = 64 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="24" fill="#020617" />
      <path
        d="M25 75V25C25 25 40 15 55 28L80 50V75L55 45L25 75Z"
        fill="url(#paint0_favicon)"
      />
      <path
        d="M75 18C75 22 71 24 71 24C71 24 75 26 75 30C75 26 79 24 79 24C79 24 75 22 75 18Z"
        fill="#ffffff"
      />
      <defs>
        <linearGradient id="paint0_favicon" x1="25" y1="75" x2="80" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
    </svg>
  );
};
