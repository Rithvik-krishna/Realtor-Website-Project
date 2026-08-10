import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Award, MapPin, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import { RealtorProfileCard } from '../../components/RealtorProfileCard';
import { SEOHead } from '../../components/seo/SEOHead';
import { generateRealEstateAgentSchema } from '../../components/seo/schemaGenerators';
import { BreadcrumbBar } from '../../components/seo/BreadcrumbBar';

export const About: React.FC = () => {
  const { setCurrentPage } = useApp();

  const agentSchema = generateRealEstateAgentSchema();

  const areasServed = [
    { city: 'Oakville', desc: 'Lakeshore waterfront estates, Joshua Creek family homes, Glen Abbey & Bronte Creek.' },
    { city: 'Mississauga', desc: 'Lorne Park, Mineola, Port Credit waterfront, and City Centre luxury condominiums.' },
    { city: 'Toronto & GTA', desc: 'Yorkville, Forest Hill, Lawrence Park, Markham, Vaughan, and Brampton.' },
    { city: 'Greater Ontario', desc: 'Waterfront properties, cottage country, investment portfolios across Southern Ontario.' }
  ];

  return (
    <div className="fade-in" style={{ paddingTop: '24px', minHeight: '100vh', paddingBottom: '60px', background: '#ffffff' }}>
      <SEOHead
        title="About Karan Kang, REALTOR® | Royal LePage Pinnacle Real Estate"
        description="Learn about Karan Kang, REALTOR® at Royal LePage Pinnacle Real Estate. Serving home buyers and sellers across Oakville, Mississauga, Brampton, Toronto, and Ontario."
        canonicalPath="/about"
        keywords={['Karan Kang REALTOR', 'Royal LePage Pinnacle Real Estate agent', 'Oakville real estate agent', 'Mississauga realtor']}
        schemas={[agentSchema]}
      />

      <div className="container">
        <BreadcrumbBar items={[{ name: 'About Karan Kang', url: '/about' }]} />
        
        {/* 1. HERO BRAND SECTION */}
        <section style={{ textAlign: 'center', maxWidth: '800px', margin: '16px auto 40px auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(227, 24, 55, 0.08)',
              color: '#E31837',
              padding: '6px 16px',
              borderRadius: '30px',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '16px',
              border: '1px solid rgba(227, 24, 55, 0.18)'
            }}
          >
            <Award size={14} /> KANG HOMES &amp; ROYAL LEPAGE PINNACLE
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3rem)', fontWeight: 800, color: '#111827', lineHeight: '1.25', marginBottom: '16px' }}>
            Dedicated Real Estate Representation in Ontario
          </h1>

          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.6', fontWeight: 500 }}>
            At <strong>Kang Homes</strong>, led by <strong>Karan Kang, REALTOR®</strong> at Royal LePage Pinnacle Real Estate, we deliver unparalleled market expertise, personal dedication, and strategic real estate solutions across Oakville and the Greater Toronto Area.
          </p>
        </section>

        {/* 2. REALTOR PROFILE CARD */}
        <section style={{ marginBottom: '50px' }}>
          <RealtorProfileCard />
        </section>

        {/* 3. ABOUT KARAN KANG & MISSION */}
        <section style={{ marginBottom: '50px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
            
            <div className="glass-panel" style={{ padding: '32px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(227, 24, 55, 0.1)', color: '#E31837', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>
                About Karan Kang
              </h3>
              <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.7', marginBottom: '12px' }}>
                Karan Kang is a licensed REALTOR® with Royal LePage Pinnacle Real Estate, specializing in residential home sales, luxury acquisitions, and real estate investments in Ontario.
              </p>
              <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.7' }}>
                With a deep understanding of local neighborhood dynamics, pricing trends, and negotiation strategies, Karan provides clients with a seamless and rewarding real estate experience from consultation to closing.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '32px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f1f5f9', color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Building2 size={22} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>
                Our Mission
              </h3>
              <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.7', marginBottom: '12px' }}>
                To empower home buyers and sellers with transparent advice, accurate market data, and top-tier promotional reach backed by Royal LePage Canada's nationwide network.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                {['Client-first advisory and integrity', 'Data-driven market valuations', 'Targeted marketing for maximum exposure', 'Personalized support 7 days a week'].map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#111827', fontWeight: 600 }}>
                    <CheckCircle2 size={16} style={{ color: '#E31837' }} /> {item}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </section>

        {/* 4. AREAS SERVED */}
        <section style={{ marginBottom: '50px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span className="badge badge-lavender" style={{ marginBottom: '6px', background: 'rgba(227, 24, 55, 0.08)', color: '#E31837' }}>COMMUNITIES</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827' }}>Key Areas Served</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {areasServed.map((area, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '24px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E31837', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>
                  <MapPin size={18} /> {area.city}
                </div>
                <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: '1.6' }}>{area.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. CALL TO ACTION */}
        <section>
          <div style={{ padding: '40px', borderRadius: '20px', background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)', color: '#ffffff', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>Schedule a Consultation with Karan Kang</h2>
            <p style={{ color: '#d1d5db', fontSize: '0.95rem', maxWidth: '580px', lineHeight: '1.6' }}>
              Whether you are looking to purchase your first home, upgrade your current property, or sell for maximum value, we are here to assist.
            </p>
            <button onClick={() => setCurrentPage('contact')} className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '0.92rem' }}>
              Contact Karan Kang <ArrowRight size={16} />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};
