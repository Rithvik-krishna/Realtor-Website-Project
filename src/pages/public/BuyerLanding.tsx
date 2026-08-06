import React from 'react';
import { useApp } from '../../context/AppContext';
import { Heart, Search, Calendar, Bell, Calculator, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

export const BuyerLanding: React.FC = () => {
  const { setCurrentPage, showToast } = useApp();

  const handleEnterPortal = () => {
    setCurrentPage('search');
    showToast('Entering Dream Home Search Portal.', 'info');
  };

  const privileges = [
    {
      icon: <Heart size={24} style={{ color: 'var(--color-lavender)' }} />,
      title: 'Saved Masterpieces',
      desc: 'Bookmark ultra-high-end waterfront estates, ski chalets, and skyline penthouses into a personal private Reserve ledger.'
    },
    {
      icon: <Search size={24} style={{ color: 'var(--color-lavender)' }} />,
      title: 'Persistent Searches',
      desc: 'Save detailed natural language prompt results and filtering parameters to auto-monitor inventory movements.'
    },
    {
      icon: <Calendar size={24} style={{ color: 'var(--color-lavender)' }} />,
      title: 'Escrow Tour Schedules',
      desc: 'Coordinate discreet, non-disclosed private physically guided viewings with managing partners at your convenience.'
    },
    {
      icon: <Bell size={24} style={{ color: 'var(--color-lavender)' }} />,
      title: 'Real-Time Telemetry Alerts',
      desc: 'Immediate encrypted SMS or email notifications the moment an off-market asset fitting your profile becomes unlocked.'
    },
    {
      icon: <Calculator size={24} style={{ color: 'var(--color-lavender)' }} />,
      title: 'Bespoke Amortization Tools',
      desc: 'Verify tax margins, mortgage scales, and luxury HOA terms interactively with dynamic vector-graphics financial dashboards.'
    },
    {
      icon: <MapPin size={24} style={{ color: 'var(--color-lavender)' }} />,
      title: 'Community Intelligence',
      desc: 'Review neighborhood wellness grids, school ratings, and transit access metrics of elite Canadian metropolitan centers.'
    }
  ];

  return (
    <div className="fade-in" style={{ paddingTop: '20px', minHeight: '100vh', paddingBottom: '40px' }}>
      <div className="container">
        
        {/* Hero Section */}
        <section 
          className="glass-panel buyer-hero-split" 
          style={{ 
            padding: '36px 32px', 
            borderRadius: '20px', 
            display: 'grid', 
            gridTemplateColumns: '1.2fr 1fr', 
            gap: '32px', 
            alignItems: 'center',
            background: 'linear-gradient(135deg, rgba(7,13,36,0.8) 0%, rgba(10,18,42,0.4) 100%)',
            border: '1px solid rgba(167, 139, 250, 0.2)',
            marginBottom: '60px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="badge badge-lavender badge-glow" style={{ alignSelf: 'flex-start', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <ShieldCheck size={12} />
              <span>ACQUISITION GATEWAY</span>
            </div>
            
            <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: '1.1', color: '#ffffff' }}>
              Search & Purchase Your <span className="text-gradient-electric">Dream Home</span>
            </h1>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '550px' }}>
              Welcome to Canada’s premier luxury real estate discovery engine. Search verified residential listings, explore interactive neighborhood telemetry, and purchase your dream property seamlessly in one unified platform.
            </p>

            <div style={{ display: 'flex', gap: '16px', marginTop: '10px', flexWrap: 'wrap' }}>
              <button 
                onClick={handleEnterPortal}
                className="btn btn-primary hover-lift"
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 36px', fontSize: '0.95rem', fontWeight: 600, borderRadius: '12px' }}
              >
                <span>Enter Buyer Portal</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div 
              style={{ 
                position: 'relative', 
                width: '100%', 
                maxWidth: '380px', 
                height: '240px', 
                borderRadius: '20px', 
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=600&auto=format&fit=crop" 
                alt="Luxury Lounge" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(3,7,18,0.3)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: '16px', left: '16px' }} className="badge badge-lavender">DISCREET ACCESS</div>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>PORTAL ADVANTAGES</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 500, color: '#ffffff', marginTop: '6px' }}>Bespoke Privileges Unlocked</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {privileges.map((p, idx) => (
              <div 
                key={idx}
                className="glass-panel privilege-card"
                style={{ 
                  padding: '30px', 
                  border: '1px solid rgba(255,255,255,0.04)', 
                  borderRadius: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  background: 'rgba(7, 13, 36, 0.25)',
                  transition: '0.3s'
                }}
              >
                <div 
                  style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '12px', 
                    background: 'rgba(167, 139, 250, 0.1)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '1px solid rgba(167, 139, 250, 0.2)'
                  }}
                >
                  {p.icon}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff' }}>{p.title}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      <style>{`
        .privilege-card:hover {
          transform: translateY(-4px);
          border-color: rgba(167, 139, 250, 0.25) !important;
          background: rgba(7, 13, 36, 0.4) !important;
          box-shadow: 0 15px 30px rgba(0,0,0,0.6);
        }
        @media (max-width: 900px) {
          .buyer-hero-split { grid-template-columns: 1fr !important; padding: 40px !important; }
        }
      `}</style>
    </div>
  );
};
