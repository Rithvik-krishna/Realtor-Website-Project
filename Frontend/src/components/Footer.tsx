import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../design-system/BrandAssets';
import { Send, Globe, Award, Shield, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage, showToast } = useApp();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    showToast('Subscription requested. Welcome to NovaEstate Curated Circular.', 'success');
    setEmail('');
  };

  return (
    <footer
      className="glass-panel"
      style={{
        marginTop: '16px',
        borderTop: '1px solid rgba(167, 139, 250, 0.1)',
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom: 'none',
        borderRadius: '24px 24px 0 0',
        padding: '40px 0 24px 0',
        background: 'linear-gradient(180deg, rgba(8, 14, 36, 0.6) 0%, rgba(3, 7, 18, 0.95) 100%)',
        position: 'relative',
        zIndex: 5,
        overflow: 'hidden'
      }}
    >
      {/* Decorative vertical divider stripes */}
      <div style={{ position: 'absolute', top: 0, left: '20%', width: '1px', height: '100%', background: 'rgba(255,255,255,0.01)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, left: '50%', width: '1px', height: '100%', background: 'rgba(255,255,255,0.01)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, left: '80%', width: '1px', height: '100%', background: 'rgba(255,255,255,0.01)', pointerEvents: 'none' }} />

      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px', marginBottom: '32px' }}>
          {/* Brand Presentation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Logo size={40} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.7', maxWidth: '300px' }}>
              Redefining luxury real estate across Canada. Immersive drone tours, AI-curated portfolios, and modern architectural masterpieces.
            </p>
            
            {/* Certifications badges */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                <Award size={14} className="text-gradient" />
                <span>CHBA Luxury Associate</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                <Shield size={14} style={{ color: 'var(--color-lavender)' }} />
                <span>Secure Gateway</span>
              </div>
            </div>
          </div>

          {/* Curated Portfolios links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ffffff' }}>Collections</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
              {['West Vancouver Coastal', 'Yorkville Penthouse Duplexes', 'Whistler Ski-In Chalets', 'Montreal Heritage Glass', 'Calgary Monolithic Concrete'].map(item => (
                <li key={item}>
                  <button
                    onClick={() => setCurrentPage('search')}
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', transition: 'var(--transition-fast)' }}
                    className="hover-lift"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick site navigation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ffffff' }}>Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
              {[
                { id: 'home', name: 'Cinematic Front' },
                { id: 'search', name: 'Curated Search' },
                { id: 'about', name: 'Our Visionaries' },
                { id: 'blog', name: 'Design Magazine' },
                { id: 'contact', name: 'Bespoke Consultation' }
              ].map(page => (
                <li key={page.id}>
                  <button
                    onClick={() => setCurrentPage(page.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', transition: 'var(--transition-fast)' }}
                    className="hover-lift"
                  >
                    {page.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Circular Subscription */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ffffff' }}>The Circular</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6' }}>
              Subscribe to receive private, off-market real estate catalogs and architectural whitepapers quarterly.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px', position: 'relative' }}>
              <input
                type="email"
                placeholder="Private Email..."
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '12px 48px 12px 16px',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  width: '100%',
                  outline: 'none',
                  fontFamily: 'var(--font-sans)',
                  transition: 'var(--transition-fast)'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--color-lavender)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                required
              />
              <button
                type="submit"
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '6px',
                  bottom: '6px',
                  background: 'linear-gradient(135deg, var(--color-blue-primary), var(--color-lavender-dark))',
                  border: 'none',
                  borderRadius: '6px',
                  width: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
              >
                <Send size={12} />
              </button>
            </form>
          </div>
        </div>

        <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.05)', marginBottom: '40px' }} />

        {/* Lower footer copyright */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <div>
            &copy; 2026 NovaEstate Platform. All rights reserved. Designed for Canadian Architectural Supremacy.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              Made with <Heart size={10} style={{ color: 'var(--color-lavender)' }} /> in Canada
            </span>
            <span style={{ height: '12px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={12} /> Global Private Ledger
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
