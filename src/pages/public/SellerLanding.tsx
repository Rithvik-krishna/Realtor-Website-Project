import React from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, ShieldCheck, FileText, Calendar, TrendingUp, ArrowRight, DollarSign, Sparkles } from 'lucide-react';

export const SellerLanding: React.FC = () => {
  const { setCurrentPage } = useApp();

  const handleStartValuation = () => {
    setCurrentPage('home-valuation');
  };

  const modules = [
    {
      icon: <DollarSign size={22} style={{ color: 'var(--color-lavender)' }} />,
      title: 'Real-Time Valuation Engine',
      desc: 'Verify the active market capitalization of your assets dynamically based on spatial parameters and transactional comparables.'
    },
    {
      icon: <Activity size={22} style={{ color: 'var(--color-lavender)' }} />,
      title: 'Advanced Listing Analytics',
      desc: 'Monitor impressions, buyer bookmarking ratios, virtual tour engagement stats, and secure private inquiry flows.'
    },
    {
      icon: <FileText size={22} style={{ color: 'var(--color-lavender)' }} />,
      title: 'Bespoke Market Reports',
      desc: 'Download monthly and quarterly research pamphlets tracking global sovereign wealth flow into key Canadian regions.'
    },
    {
      icon: <Calendar size={22} style={{ color: 'var(--color-lavender)' }} />,
      title: 'Managing Partner Consults',
      desc: 'Coordinate discreet on-site reviews and structural valuation inspections with licensed regional managing directors.'
    }
  ];

  return (
    <div className="fade-in" style={{ paddingTop: '20px', minHeight: '100vh', paddingBottom: '40px' }}>
      <div className="container">
        
        {/* Upper Hero Grid */}
        <section 
          className="glass-panel seller-hero-split" 
          style={{ 
            padding: '36px 32px', 
            borderRadius: '20px', 
            display: 'grid', 
            gridTemplateColumns: '1.2fr 1fr', 
            gap: '32px', 
            alignItems: 'center',
            background: 'linear-gradient(135deg, rgba(7,13,36,0.85) 0%, rgba(10,18,42,0.4) 100%)',
            border: '1px solid rgba(167,139,250,0.2)',
            marginBottom: '32px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="badge badge-lavender badge-glow" style={{ alignSelf: 'flex-start', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <ShieldCheck size={12} />
              <span>SELLER PORTAL & VALUATION</span>
            </div>
            
            <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: '1.1', color: '#ffffff' }}>
              Discover What Your Home Is <span className="text-gradient-electric">Truly Worth</span>
            </h1>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: '1.6', maxWidth: '550px' }}>
              Instantly estimate your Canadian luxury property's true market value using our real-time AI valuation engine. Analyze comparable off-market sales, neighborhood growth trends, and buyer demand indices in seconds.
            </p>

            {/* Single Primary CTA: "Start Home Valuation" */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
              <button 
                onClick={handleStartValuation}
                className="btn btn-primary hover-lift"
                style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '16px 36px', fontSize: '0.95rem', fontWeight: 600, borderRadius: '14px', background: 'linear-gradient(135deg, var(--color-lavender) 0%, var(--color-blue-primary) 100%)' }}
              >
                <Sparkles size={18} />
                <span>Start Home Valuation</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Value Proposition Feature Box */}
          <div className="glass-panel" style={{ padding: '36px', border: '1px solid rgba(167, 139, 250, 0.2)', background: 'rgba(3,7,18,0.85)', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(167, 139, 250, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(167,139,250,0.3)' }}>
                <TrendingUp size={22} style={{ color: 'var(--color-lavender)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#ffffff' }}>AI Home Valuation Engine</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>Instant • Precision Algorithmic Assessment</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-lavender)' }} />
                <span>Real-time off-market transactional comparables</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-lavender)' }} />
                <span>AI confidence score & suggested listing price strategies</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-lavender)' }} />
                <span>Regional buyer demand heat maps & inventory forecasts</span>
              </div>
            </div>

            <button 
              onClick={handleStartValuation}
              className="btn btn-secondary hover-lift"
              style={{ padding: '12px 20px', fontSize: '0.85rem', width: '100%', borderRadius: '12px' }}
            >
              <span>Calculate Home Value Now</span>
            </button>
          </div>
        </section>

        {/* Console Capabilities */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>EXECUTIVE CAPABILITIES</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 500, color: '#ffffff', marginTop: '6px' }}>Sovereign Divestment Ecosystem</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
            {modules.map((m, idx) => (
              <div 
                key={idx}
                className="glass-panel module-card"
                style={{ 
                  padding: '24px', 
                  border: '1px solid rgba(255,255,255,0.04)', 
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  background: 'rgba(7, 13, 36, 0.25)',
                  transition: '0.3s'
                }}
              >
                <div 
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '10px', 
                    background: 'rgba(167, 139, 250, 0.1)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '1px solid rgba(167, 139, 250, 0.15)'
                  }}
                >
                  {m.icon}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 600, color: '#ffffff' }}>{m.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      <style>{`
        .module-card:hover {
          transform: translateY(-4px);
          border-color: rgba(167, 139, 250, 0.25) !important;
          background: rgba(7, 13, 36, 0.4) !important;
          box-shadow: 0 15px 30px rgba(0,0,0,0.6);
        }
        @media (max-width: 900px) {
          .seller-hero-split { grid-template-columns: 1fr !important; padding: 40px !important; }
        }
      `}</style>
    </div>
  );
};
