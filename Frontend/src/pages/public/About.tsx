import React from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, ShieldCheck, Heart } from 'lucide-react';

export const About: React.FC = () => {
  const { setCurrentPage } = useApp();

  const milestones = [
    { year: '2018', title: 'Conceptual Genesis', desc: 'Formed as an exclusive offline family wealth advisory partnership focusing on high-wealth Canadian estates.' },
    { year: '2021', title: 'The Billion-Dollar Threshold', desc: 'Surpassed $1.2B in privately brokered real estate volume, prompting the creation of a secure digital ledger platform.' },
    { year: '2024', title: 'NovaAI Integration', desc: 'Unveiled natural-language AI property search, structural analysis algorithms, and responsive mortgage automation tools.' },
    { year: '2026', title: 'Continental Hegemony', desc: 'Establishing flagship offices in Vancouver, Toronto, Montreal, and Calgary, dominating the luxury alpine & waterfront domains.' }
  ];

  const valuePillars = [
    { icon: <Compass size={24} className="text-gradient" />, title: 'Architectural Critic standards', desc: 'We select properties based on strict design critique, spatial integrity, material authenticity, and geographic privilege.' },
    { icon: <ShieldCheck size={24} style={{ color: 'var(--color-lavender)' }} />, title: 'Sovereign Discretion', desc: 'Our clients value absolute privacy. Transactions are brokered through private ledgers, blind trusts, and secure escrow accounts.' },
    { icon: <Heart size={24} style={{ color: '#ef4444' }} />, title: 'Spatial Legacies', desc: 'We believe premium properties are physical art portfolios that increase generational wealth and cultural significance over centuries.' }
  ];

  return (
    <div className="fade-in" style={{ paddingTop: '20px', minHeight: '100vh', paddingBottom: '40px' }}>
      <div className="container">
        
        {/* 1. Immersive Story Headline */}
        <section style={{ textAlign: 'center', maxWidth: '850px', margin: '16px auto 40px auto' }}>
          <span className="badge badge-lavender" style={{ marginBottom: '12px' }}>ESTABLISHED 2018</span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 600, lineHeight: '1.25', marginBottom: '16px' }}>
            Designing spatial legacies for the <span className="text-gradient-electric">world’s elite.</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: '1.6' }}>
            NovaEstate is a design-centric luxury real estate advisory and software engine. We cater to sovereign family offices, design purists, and institutional investors looking to acquire architectural masterpieces across Canada.
          </p>
        </section>

        {/* 2. Brand Value Pillars (Stripe style column layout) */}
        <section style={{ marginBottom: '48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {valuePillars.map((pillar, idx) => (
              <div
                key={idx}
                className="glass-panel"
                style={{ padding: '24px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {pillar.icon}
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff' }}>{pillar.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6' }}>{pillar.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Chronological Milestone Timeline (Linear style vertical line) */}
        <section style={{ marginBottom: '48px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span className="badge badge-blue">OUR EVOLUTION</span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 600, marginTop: '8px' }}>Milestones in Spatial Brokerage</h2>
          </div>

          <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
            {/* Center spine */}
            <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 0, bottom: 0, width: '1px', background: 'rgba(167, 139, 250, 0.15)' }} className="timeline-spine" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
              {milestones.map((ms, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: isEven ? 'flex-start' : 'flex-end',
                      width: '100%',
                      position: 'relative',
                    }}
                    className="timeline-item"
                  >
                    {/* Node on spine */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '20px',
                        transform: 'translateX(-50%)',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: 'var(--color-lavender)',
                        border: '2px solid #020617',
                        boxShadow: '0 0 10px var(--color-lavender)',
                        zIndex: 10
                      }}
                    />

                    {/* Timeline card */}
                    <div
                      className="glass-panel timeline-card"
                      style={{
                        width: '45%',
                        padding: '24px',
                        border: '1px solid rgba(255,255,255,0.04)'
                      }}
                    >
                      <span style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-lavender)' }}>{ms.year}</span>
                      <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff', margin: '4px 0 8px 0' }}>{ms.title}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.6' }}>{ms.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Leadership Partners grid */}
        <section>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="badge badge-lavender">THE VISIONARIES</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 500, marginTop: '8px' }}>Licensed Advisory Council</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '40px' }}>
            {[
              {
                name: 'Jean-Pierre Cardin',
                role: 'Founder & Managing Director',
                phone: '+1 (514) 555-0122',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop'
              },
              {
                name: 'Victoria Hastings',
                role: 'Senior Executive Partner - Toronto',
                phone: '+1 (416) 555-0144',
                avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop'
              },
              {
                name: 'Sébastien LeClerc',
                role: 'Director of High-End Acquisitions',
                phone: '+1 (604) 555-0199',
                avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&auto=format&fit=crop'
              }
            ].map(partner => (
              <div
                key={partner.name}
                className="glass-panel"
                style={{ padding: '30px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <img
                  src={partner.avatar}
                  alt={partner.name}
                  style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', marginBottom: '20px', border: '2px solid var(--color-lavender)' }}
                />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff' }}>{partner.name}</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>{partner.role}</p>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', marginBottom: '16px' }} />
                <button
                  onClick={() => setCurrentPage('contact')}
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '10px', fontSize: '0.78rem', borderRadius: '8px' }}
                >
                  Direct Consultation
                </button>
              </div>
            ))}
          </div>
        </section>

      </div>

      {styleStyles}
    </div>
  );
};

// CSS style override for responsive timeline
const styleStyles = (
  <style>{`
    @media (max-width: 768px) {
      .timeline-spine { left: 16px !important; transform: none !important; }
      .timeline-item { justify-content: flex-start !important; }
      .timeline-item div:nth-child(1) { left: 16px !important; transform: none !important; }
      .timeline-card { width: calc(100% - 40px) !important; margin-left: 40px !important; }
    }
  `}</style>
);
