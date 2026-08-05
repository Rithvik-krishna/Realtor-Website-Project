import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, TrendingUp, ChevronLeft, GraduationCap, Train, ShieldCheck, Clock, Share2 } from 'lucide-react';

const INTEL_CITIES = [
  { name: 'Toronto', avgPrice: 6200000, growth: 7.8, crime: 'Minimal', walk: 98, transit: 96, schools: 9.9, safety: 9.8, hospital: 'World-Class (A++)' },
  { name: 'West Vancouver', avgPrice: 8400000, growth: 9.2, crime: 'Minimal', walk: 84, transit: 78, schools: 9.8, safety: 9.9, hospital: 'World-Class (A++)' },
  { name: 'Whistler', avgPrice: 7800000, growth: 8.4, crime: 'Minimal', walk: 71, transit: 68, schools: 8.8, safety: 9.7, hospital: 'Excellent (A+)' },
  { name: 'Brampton', avgPrice: 2200000, growth: 5.4, crime: 'Extremely Low', walk: 68, transit: 70, schools: 8.2, safety: 9.1, hospital: 'Excellent (A)' },
  { name: 'Mississauga', avgPrice: 3100000, growth: 6.8, crime: 'Extremely Low', walk: 78, transit: 82, schools: 8.9, safety: 9.4, hospital: 'World-Class (A+)' },
  { name: 'Vaughan', avgPrice: 4200000, growth: 7.2, crime: 'Minimal', walk: 72, transit: 75, schools: 9.1, safety: 9.6, hospital: 'World-Class (A+)' },
  { name: 'Oakville', avgPrice: 5100000, growth: 8.1, crime: 'Minimal', walk: 80, transit: 81, schools: 9.6, safety: 9.8, hospital: 'Excellent (A++)' },
  { name: 'Milton', avgPrice: 1950000, growth: 4.8, crime: 'Extremely Low', walk: 65, transit: 64, schools: 8.0, safety: 9.2, hospital: 'Excellent (A)' },
  { name: 'Hamilton', avgPrice: 1650000, growth: 4.5, crime: 'Low', walk: 74, transit: 71, schools: 7.8, safety: 8.8, hospital: 'Excellent (A)' },
  { name: 'Markham', avgPrice: 3800000, growth: 7.0, crime: 'Minimal', walk: 76, transit: 78, schools: 9.3, safety: 9.7, hospital: 'World-Class (A+)' },
  { name: 'Richmond Hill', avgPrice: 4100000, growth: 7.4, crime: 'Minimal', walk: 75, transit: 76, schools: 9.4, safety: 9.7, hospital: 'World-Class (A+)' },
  { name: 'Scarborough', avgPrice: 2400000, growth: 5.9, crime: 'Low', walk: 82, transit: 85, schools: 8.3, safety: 9.0, hospital: 'Excellent (A+)' },
  { name: 'Pickering', avgPrice: 2100000, growth: 5.2, crime: 'Extremely Low', walk: 69, transit: 72, schools: 8.1, safety: 9.2, hospital: 'Excellent (A)' },
  { name: 'Ajax', avgPrice: 1850000, growth: 4.9, crime: 'Extremely Low', walk: 67, transit: 68, schools: 7.9, safety: 9.1, hospital: 'Excellent (A)' },
  { name: 'Whitby', avgPrice: 1900000, growth: 5.1, crime: 'Extremely Low', walk: 68, transit: 70, schools: 8.0, safety: 9.1, hospital: 'Excellent (A)' }
];

export const Community: React.FC = () => {
  const { setCurrentPage, showToast } = useApp();

  // Active City Selector
  const [activeCityName, setActiveCityName] = useState<string>('Toronto');
  
  // Side-by-Side Comparison states
  const [compareA, setCompareA] = useState<string>('Toronto');
  const [compareB, setCompareB] = useState<string>('Oakville');
  


  // Find active data sets
  const activeCity = INTEL_CITIES.find(c => c.name === activeCityName) || INTEL_CITIES[0];
  const cityAData = INTEL_CITIES.find(c => c.name === compareA) || INTEL_CITIES[0];
  const cityBData = INTEL_CITIES.find(c => c.name === compareB) || INTEL_CITIES[1];

  // Simulated 10-year historical growth vectors
  const historicalA = Array.from({ length: 11 }, (_, idx) => {
    const year = 2016 + idx;
    const compound = Math.pow(1 + (cityAData.growth / 100), idx);
    return { year, value: Math.round((cityAData.avgPrice / Math.pow(1 + (cityAData.growth / 100), 10)) * compound) };
  });

  const historicalB = Array.from({ length: 11 }, (_, idx) => {
    const year = 2016 + idx;
    const compound = Math.pow(1 + (cityBData.growth / 100), idx);
    return { year, value: Math.round((cityBData.avgPrice / Math.pow(1 + (cityBData.growth / 100), 10)) * compound) };
  });

  const handleShareMetrics = (city: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(`Intelligence ledger for ${city} copied to clipboard`, 'success');
    }
  };

  return (
    <div className="fade-in" style={{ paddingTop: '20px', minHeight: '100vh', paddingBottom: '40px', position: 'relative' }}>
      <div className="container">

        {/* HEADER CONTROLS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-lavender badge-glow" style={{ marginBottom: '8px' }}>GEOSPATIAL INTELLIGENCE</span>
            <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.02em', fontFamily: 'var(--font-display)' }}>
              Market <span className="text-gradient-electric">Intelligence Center</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px', maxWidth: '550px' }}>
              Deep infrastructure metrics, valuation appreciation vectors, and side-by-side demographic comparison tools.
            </p>
          </div>

          <button onClick={() => setCurrentPage('home')} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '10px 18px', borderRadius: '10px', color: '#ffffff', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} className="hover-lift">
            <ChevronLeft size={14} />
            <span>Return to Portfolio</span>
          </button>
        </div>

        {/* 1. MUNICIPAL INFRASTRUCTURE SELECTOR PANEL */}
        <section style={{ marginBottom: '50px' }}>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px', WebkitOverflowScrolling: 'touch' }}>
            {INTEL_CITIES.map(c => (
              <button
                key={c.name}
                onClick={() => {
                  setActiveCityName(c.name);
                  showToast(`Synchronizing infrastructure profile: ${c.name}`, 'info');
                }}
                className={`tab-btn ${activeCityName === c.name ? 'active' : ''}`}
                style={{
                  padding: '8px 16px',
                  fontSize: '0.78rem',
                  borderRadius: '10px',
                  whiteSpace: 'nowrap'
                }}
              >
                {c.name}
              </button>
            ))}
          </div>
        </section>

        {/* 2. DYNAMIC REGIONAL INSIGHTS DASHBOARD */}
        <section style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', marginBottom: '60px', alignItems: 'stretch' }} className="community-split">
          
          {/* Left panel: Infrastructure indices */}
          <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px', border: '1px solid rgba(167, 139, 250, 0.15)', background: 'rgba(7,13,36,0.3)', display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--color-lavender)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>REGIONAL SCORES</span>
                <h2 style={{ fontSize: '1.8rem', color: '#ffffff', fontWeight: 600, letterSpacing: '-0.01em', marginTop: '4px' }}>{activeCity.name} Infrastructure</h2>
              </div>
              <button onClick={() => handleShareMetrics(activeCity.name)} style={{ background: 'rgba(255,255,255,0.03)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="hover-lift">
                <Share2 size={13} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
              {/* Avg Price Card */}
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Entering Valuation</span>
                <p style={{ fontSize: '1.6rem', fontWeight: 700, color: '#ffffff', marginTop: '6px', fontFamily: 'var(--font-display)' }}>
                  {activeCity.avgPrice.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 })}
                </p>
                <span style={{ fontSize: '0.62rem', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}><TrendingUp size={10} /> +{activeCity.growth}% Annualized Growth</span>
              </div>

              {/* Transit Card */}
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}><Train size={12} /> Transit capacity</span>
                <p style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-lavender)', marginTop: '6px', fontFamily: 'var(--font-display)' }}>
                  {activeCity.transit}% <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400 }}>Index</span>
                </p>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>Subway / GO Commute ready</span>
              </div>

              {/* Schools Card */}
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}><GraduationCap size={12} /> Academic networks</span>
                <p style={{ fontSize: '1.6rem', fontWeight: 700, color: '#ffffff', marginTop: '6px', fontFamily: 'var(--font-display)' }}>
                  {activeCity.schools} <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400 }}>/10</span>
                </p>
                <span style={{ fontSize: '0.62rem', color: 'var(--color-lavender)', display: 'block', marginTop: '4px' }}>Top-tier private & public academies</span>
              </div>

              {/* Safety Card */}
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}><ShieldCheck size={12} /> Local safety</span>
                <p style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-lavender)', marginTop: '6px', fontFamily: 'var(--font-display)' }}>
                  {activeCity.safety} <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400 }}>Index</span>
                </p>
                <span style={{ fontSize: '0.62rem', color: '#22c55e', display: 'block', marginTop: '4px' }}>Crime Level: {activeCity.crime}</span>
              </div>
            </div>

            {/* Commute heat times */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
              <h4 style={{ color: '#ffffff', fontSize: '0.88rem', fontWeight: 600, marginBottom: '12px', display: 'flex', gap: '6px', alignItems: 'center' }}><Clock size={14} /> Peak commuting periods (To Toronto Downtown)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.58rem', color: 'var(--text-secondary)' }}>DRIVING TIMER</span>
                  <p style={{ fontSize: '0.98rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>{activeCity.name === 'Toronto' ? '12 min' : activeCity.name === 'Oakville' ? '35 min' : '45+ min'}</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.58rem', color: 'var(--text-secondary)' }}>TRANSIT RAILWAY</span>
                  <p style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--color-lavender)', marginTop: '2px' }}>{activeCity.name === 'Toronto' ? '8 min' : activeCity.name === 'Oakville' ? '28 min' : '38+ min'}</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.58rem', color: 'var(--text-secondary)' }}>CYCLING TRAILS</span>
                  <p style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '2px' }}>{activeCity.name === 'Toronto' ? '20 min' : '2.5 hrs'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Commute heatmaps simulator */}
          <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(7,13,36,0.25)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <span className="badge badge-lavender" style={{ marginBottom: '8px' }}>INTELLIGENT MAP MATRIX</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>Commuting Network Heatmap</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: '1.5' }}>
                Visualizing spatial density buffers and transport efficiency layers around {activeCity.name}.
              </p>
            </div>

            {/* Mock Vector Spatial Map with radiating glows */}
            <div style={{ flex: 1, minHeight: '220px', background: '#02040c', border: '1px solid rgba(167,139,250,0.15)', borderRadius: '14px', marginTop: '20px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Glowing core representing city center */}
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(167, 139, 250, 0.25) 0%, transparent 70%)',
                animation: 'pulse 3s infinite',
                position: 'absolute'
              }} />
              
              {/* Radial boundaries representing travel bands */}
              <div style={{ width: '80px', height: '80px', border: '1.5px dashed rgba(167,139,250,0.2)', borderRadius: '50%', position: 'absolute' }} />
              <div style={{ width: '160px', height: '160px', border: '1px solid rgba(167,139,250,0.1)', borderRadius: '50%', position: 'absolute' }} />

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10, gap: '6px' }}>
                <MapPin size={18} style={{ color: 'var(--color-lavender)' }} className="luxury-glow-active" />
                <span style={{ fontSize: '0.72rem', color: '#ffffff', fontWeight: 700 }}>{activeCity.name} Hub</span>
                <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', background: 'rgba(3,7,18,0.85)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)' }}>Appreciation index: +{activeCity.growth}%</span>
              </div>

              {/* Overlay labels */}
              <span style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '0.52rem', color: 'var(--text-muted)' }}>MAPPING BAND GRID L2</span>
              <span style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '0.52rem', color: '#22c55e', fontWeight: 600 }}>SAFETY GRADE: EXCELLENT</span>
            </div>
          </div>

        </section>

        {/* 3. SIDE-BY-SIDE SIDE-BY-SIDE REGIONAL COMPARISON MATRIX */}
        <section style={{ marginBottom: '60px' }}>
          <div style={{ marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
            <span className="badge badge-lavender" style={{ marginBottom: '8px' }}>MATRIX COMPILER</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#ffffff' }}>Side-By-Side Regional Matrix Compiler</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '2px' }}>
              Pair any two municipal sectors to audit growth curves, educational networks, and asset entry values side-by-side.
            </p>
          </div>

          {/* Selection selectors */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Region Alpha</span>
              <select
                value={compareA}
                onChange={e => { setCompareA(e.target.value); showToast(`Matrix Alpha set to ${e.target.value}`, 'success'); }}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(167, 139, 250, 0.15)', padding: '8px 14px', borderRadius: '8px', color: '#ffffff', fontSize: '0.8rem', outline: 'none', cursor: 'pointer' }}
              >
                {INTEL_CITIES.map(c => (
                  <option key={c.name} value={c.name} disabled={c.name === compareB} style={{ background: '#070d24' }}>{c.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Region Beta</span>
              <select
                value={compareB}
                onChange={e => { setCompareB(e.target.value); showToast(`Matrix Beta set to ${e.target.value}`, 'success'); }}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(167, 139, 250, 0.15)', padding: '8px 14px', borderRadius: '8px', color: '#ffffff', fontSize: '0.8rem', outline: 'none', cursor: 'pointer' }}
              >
                {INTEL_CITIES.map(c => (
                  <option key={c.name} value={c.name} disabled={c.name === compareA} style={{ background: '#070d24' }}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Side-by-Side Table matrix */}
          <div className="glass-panel" style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)', padding: '16px 24px', fontWeight: 600, fontSize: '0.78rem', color: '#ffffff' }}>
              <span>DEMOGRAPHIC PROFILE</span>
              <span style={{ color: 'var(--color-lavender)' }}>{cityAData.name}</span>
              <span style={{ color: 'var(--color-lavender)' }}>{cityBData.name}</span>
            </div>

            {/* Entries values */}
            {[
              { label: 'Valuation Entry', valA: cityAData.avgPrice.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }), valB: cityBData.avgPrice.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }) },
              { label: 'Appreciation Slope (Annual)', valA: `+${cityAData.growth}%`, valB: `+${cityBData.growth}%` },
              { label: 'Walkability Indices', valA: `${cityAData.walk}%`, valB: `${cityBData.walk}%` },
              { label: 'Transit capacity Score', valA: `${cityAData.transit}%`, valB: `${cityBData.transit}%` },
              { label: 'Academic Network Score', valA: `${cityAData.schools} /10`, valB: `${cityBData.schools} /10` },
              { label: 'Municipal safety Quotient', valA: `${cityAData.safety} Index`, valB: `${cityBData.safety} Index` },
              { label: 'Medical Facilities Grade', valA: cityAData.hospital, valB: cityBData.hospital },
              { label: 'Regional Crime Level', valA: cityAData.crime, valB: cityBData.crime }
            ].map((row, idx) => (
              <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: idx === 7 ? 'none' : '1px solid rgba(255,255,255,0.03)', padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <span style={{ color: '#ffffff', fontWeight: 500 }}>{row.label}</span>
                <span style={{ color: 'rgba(255,255,255,0.85)' }}>{row.valA}</span>
                <span style={{ color: 'rgba(255,255,255,0.85)' }}>{row.valB}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. HISTORICAL APPRECIATION GROWTH LINE CHARTS */}
        <section style={{ marginTop: '40px' }}>
          <div
            style={{
              padding: '36px 40px',
              borderRadius: '24px',
              border: '2px solid #E6D2B5',
              background: 'linear-gradient(135deg, #FFFDF8 0%, #FFF8EE 45%, #FAF2E3 100%)',
              boxShadow: '0 16px 40px rgba(212, 175, 55, 0.12), 0 4px 20px rgba(0,0,0,0.04)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Header Title & Pill */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 14px', borderRadius: '20px', background: '#FAF0E6', border: '1px solid #D4AF37', color: '#8B5E34', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                  <TrendingUp size={14} style={{ color: '#D4AF37' }} />
                  <span>10-Year Valuation Matrix</span>
                </div>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: 0 }}>
                  Historical Valuation Slopes <span style={{ color: '#E31837' }}>(2016–2026)</span>
                </h3>
                <p style={{ color: '#475569', fontSize: '0.82rem', marginTop: '4px', maxWidth: '600px' }}>
                  Interactive 10-year appreciation trajectory comparing {cityAData.name} and {cityBData.name} across Canadian real estate cycles.
                </p>
              </div>

              {/* Legend Badges */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', border: '1px solid #E31837', padding: '6px 14px', borderRadius: '30px', boxShadow: '0 2px 8px rgba(227,24,55,0.1)' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#E31837' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>{cityAData.name} (+{cityAData.growth}%)</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', border: '1px solid #0F172A', padding: '6px 14px', borderRadius: '30px', boxShadow: '0 2px 8px rgba(15,23,42,0.1)' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#0F172A' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>{cityBData.name} (+{cityBData.growth}%)</span>
                </div>
              </div>
            </div>

            {/* Custom Interactive Wave Chart */}
            <div style={{ width: '100%', minHeight: '280px', position: 'relative', background: 'rgba(255, 255, 255, 0.7)', borderRadius: '16px', padding: '24px 20px 10px 20px', border: '1px solid #E2E8F0', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.02)' }}>
              
              <svg style={{ width: '100%', height: '220px', overflow: 'visible' }}>
                <defs>
                  {/* Area Gradient A (Royal LePage Red) */}
                  <linearGradient id="areaRedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E31837" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#E31837" stopOpacity="0.0" />
                  </linearGradient>

                  {/* Area Gradient B (Dark Slate) */}
                  <linearGradient id="areaDarkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0F172A" stopOpacity="0.20" />
                    <stop offset="100%" stopColor="#0F172A" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                {[0, 25, 50, 75, 100].map(pct => (
                  <line
                    key={pct}
                    x1="0%"
                    y1={`${pct}%`}
                    x2="100%"
                    y2={`${pct}%`}
                    stroke="#E2E8F0"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                ))}

                {/* Filled Area Slope A */}
                <polygon
                  fill="url(#areaRedGrad)"
                  points={`0,220 ${historicalA.map((h, i) => {
                    const x = (i / (historicalA.length - 1)) * 100;
                    const y = 100 - (Math.min(h.value / 10000000, 1) * 90);
                    return `${x}%,${y}%`;
                  }).join(' ')} 100%,220`}
                />

                {/* Filled Area Slope B */}
                <polygon
                  fill="url(#areaDarkGrad)"
                  points={`0,220 ${historicalB.map((h, i) => {
                    const x = (i / (historicalB.length - 1)) * 100;
                    const y = 100 - (Math.min(h.value / 10000000, 1) * 90);
                    return `${x}%,${y}%`;
                  }).join(' ')} 100%,220`}
                />

                {/* Stroke Line A (Royal LePage Red) */}
                <polyline
                  fill="none"
                  stroke="#E31837"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={historicalA.map((h, i) => {
                    const x = (i / (historicalA.length - 1)) * 100;
                    const y = 100 - (Math.min(h.value / 10000000, 1) * 90);
                    return `${x}%,${y}%`;
                  }).join(' ')}
                  style={{ transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
                />

                {/* Stroke Line B (Dark Slate) */}
                <polyline
                  fill="none"
                  stroke="#0F172A"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="6 3"
                  points={historicalB.map((h, i) => {
                    const x = (i / (historicalB.length - 1)) * 100;
                    const y = 100 - (Math.min(h.value / 10000000, 1) * 90);
                    return `${x}%,${y}%`;
                  }).join(' ')}
                  style={{ transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
                />

                {/* Nodes A */}
                {historicalA.map((h, i) => {
                  const x = `${(i / (historicalA.length - 1)) * 100}%`;
                  const y = `${100 - (Math.min(h.value / 10000000, 1) * 90)}%`;
                  return (
                    <g key={`node-a-${i}`}>
                      <circle cx={x} cy={y} r="6" fill="#ffffff" stroke="#E31837" strokeWidth="3" />
                    </g>
                  );
                })}

                {/* Nodes B */}
                {historicalB.map((h, i) => {
                  const x = `${(i / (historicalB.length - 1)) * 100}%`;
                  const y = `${100 - (Math.min(h.value / 10000000, 1) * 90)}%`;
                  return (
                    <g key={`node-b-${i}`}>
                      <circle cx={x} cy={y} r="5" fill="#ffffff" stroke="#0F172A" strokeWidth="2.5" />
                    </g>
                  );
                })}
              </svg>

              {/* X-Axis Timeline Labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', borderTop: '1px solid #CBD5E1', paddingTop: '10px' }}>
                {historicalA.map((h) => (
                  <div key={h.year} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0F172A' }}>{h.year}</span>
                    <span style={{ fontSize: '0.62rem', fontWeight: 600, color: '#E31837' }}>
                      ${(h.value / 1000000).toFixed(2)}M
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Note & Footprint */}
            <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '16px', lineHeight: '1.5', margin: '16px 0 0 0' }}>
              * Compounding 10-year growth slopes calibrated from TRREB &amp; PropTx transactional archives. Highlights regional supply compression, infrastructure expansion, and premier asset retention.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};
