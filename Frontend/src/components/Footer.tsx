import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../design-system/BrandAssets';
import { Send, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage, showToast } = useApp();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    showToast('Subscription requested. Welcome to Kang Homes Real Estate Insights.', 'success');
    setEmail('');
  };

  return (
    <footer
      style={{
        borderTop: '1px solid #e2e8f0',
        borderRadius: '24px 24px 0 0',
        padding: '48px 0 28px 0',
        background: '#f8fafc',
        position: 'relative',
        zIndex: 5,
        color: '#334155'
      }}
    >
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '36px', marginBottom: '40px' }}>
          {/* Brand Presentation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Logo size={42} />
            <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: '1.6', maxWidth: '320px' }}>
              Kang Homes - Trusted Canadian Real Estate guidance with Karan Kang, REALTOR® at Royal LePage Pinnacle Real Estate. Serving Oakville, Mississauga, Toronto, and Ontario.
            </p>
            
            {/* Brokerage Badge */}
            <div style={{ padding: '12px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827' }}>
                Royal LePage Pinnacle Real Estate
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>
                Independently Owned and Operated Brokerage
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#111827' }}>Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              {[
                { id: 'home', name: 'Home' },
                { id: 'search', name: 'Buy Homes' },
                { id: 'mississauga-real-estate', name: 'Mississauga Real Estate ($500K-$1.3M)' },
                { id: 'brampton-real-estate', name: 'Brampton Real Estate ($500K-$1.3M)' },
                { id: 'gta-real-estate', name: 'GTA Real Estate ($500K-$1.3M)' },
                { id: 'seller', name: 'Sell Your Property' },
                { id: 'community', name: 'Communities' },
                { id: 'about', name: 'About Karan Kang' },
                { id: 'contact', name: 'Contact Us' }
              ].map(page => (
                <li key={page.id}>
                  <button
                    onClick={() => setCurrentPage(page.id)}
                    style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', textAlign: 'left', transition: 'var(--transition-fast)', fontWeight: 500 }}
                    className="hover-lift"
                  >
                    {page.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Realtor Direct */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#111827' }}>Direct Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem', color: '#475569' }}>
              <div style={{ fontWeight: 700, color: '#111827' }}>Karan Kang, REALTOR®</div>
              <a href="tel:4379985873" style={{ color: '#475569', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={14} style={{ color: '#E31837' }} /> Cell: 437-998-5873
              </a>
              <a href="tel:9054643035" style={{ color: '#475569', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={14} style={{ color: '#1e293b' }} /> Office: 905-464-3035
              </a>
              <a href="mailto:realtorkarankang@gmail.com" style={{ color: '#475569', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={14} style={{ color: '#E31837' }} /> realtorkarankang@gmail.com
              </a>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: '1.4' }}>
                <MapPin size={14} style={{ color: '#E31837', flexShrink: 0, marginTop: '2px' }} />
                <span>17 - 1075 North Service Road W., Oakville, ON L6M 2G2</span>
              </div>
            </div>
          </div>

          {/* Market Insights Newsletter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#111827' }}>Market Insights</h4>
            <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.5' }}>
              Subscribe to receive GTA market reports, property valuations, and off-market listings.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px', position: 'relative' }}>
              <input
                type="email"
                placeholder="Your email address..."
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  padding: '12px 48px 12px 16px',
                  borderRadius: '10px',
                  color: '#111827',
                  fontSize: '0.85rem',
                  width: '100%',
                  outline: 'none',
                  fontFamily: 'var(--font-sans)',
                  transition: 'var(--transition-fast)'
                }}
                onFocus={e => e.target.style.borderColor = '#E31837'}
                onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                required
              />
              <button
                type="submit"
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '6px',
                  bottom: '6px',
                  background: '#E31837',
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
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>

        <div style={{ height: '1px', background: '#e2e8f0', marginBottom: '24px' }} />

        {/* Lower footer copyright */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '0.82rem', color: '#64748b' }}>
          <div>
            &copy; 2026 Kang Homes | Royal LePage Pinnacle Real Estate. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Karan Kang, REALTOR®</span>
            <span style={{ height: '12px', width: '1px', background: '#cbd5e1' }} />
            <span>Oakville &amp; GTA Real Estate</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
