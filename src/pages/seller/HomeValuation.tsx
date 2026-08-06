import React, { useState } from 'react';
import { useApp, type ValuationData } from '../../context/AppContext';
import { Sparkles, Building2, MapPin, Layers, CheckSquare, ArrowRight, ShieldCheck } from 'lucide-react';

export const HomeValuation: React.FC = () => {
  const { user, savePendingValuation, setCurrentValuationData, setCurrentPage, showToast, triggerRoleSwitchWarning } = useApp();

  // Form Fields State
  const [address, setAddress] = useState('102 Radcliffe Ridge');
  const [postalCode, setPostalCode] = useState('M5H 2N2');
  const [city, setCity] = useState('Toronto');
  const [province, setProvince] = useState('Ontario');
  const [propertyType, setPropertyType] = useState('Detached');
  const [beds, setBeds] = useState(5);
  const [baths, setBaths] = useState(6);
  const [garage, setGarage] = useState(3);
  const [sqft, setSqft] = useState(6800);
  const [lotSize, setLotSize] = useState('65 x 140 ft');
  const [yearBuilt, setYearBuilt] = useState(2022);
  const [basementType, setBasementType] = useState('Finished Walkout');
  const [selectedRenovations, setSelectedRenovations] = useState<string[]>([
    'Custom Kitchen',
    'Primary Suite Spa',
    'Wine Cellar',
    'Smart Home Tech'
  ]);
  const [additionalFeatures, setAdditionalFeatures] = useState('Heated infinity pool, rooftop terrace, elevator, motorized glass walls.');

  const renovationOptions = [
    'Custom Kitchen',
    'Primary Suite Spa',
    'Pool / Hot Tub / Spa',
    'Wine Cellar',
    'Smart Home Automation',
    'Landscaping & Patio',
    'Energy Efficiency / Solar',
    'Home Theater'
  ];

  const handleToggleRenovation = (item: string) => {
    setSelectedRenovations(prev =>
      prev.includes(item) ? prev.filter(r => r !== item) : [...prev, item]
    );
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!address || !city) {
      showToast('Please enter a valid property address and city.', 'warning');
      return;
    }

    // Dynamic valuation calculation model based on inputs
    let basePricePerSqft = 850; // default Toronto
    if (city === 'Vancouver') basePricePerSqft = 1100;
    else if (city === 'Whistler') basePricePerSqft = 1250;
    else if (city === 'Oakville') basePricePerSqft = 900;
    else if (city === 'Montreal') basePricePerSqft = 700;
    else if (city === 'Calgary') basePricePerSqft = 600;

    if (propertyType === 'Estate' || propertyType === 'Luxury Villa') basePricePerSqft *= 1.25;
    if (propertyType === 'Condo Penthouse') basePricePerSqft *= 1.35;

    const baseVal = sqft * basePricePerSqft;
    const bedsBathsBonus = (beds * 100000) + (baths * 85000) + (garage * 45000);
    const renoBonus = selectedRenovations.length * 120000;
    
    const computedEstimate = Math.round(baseVal + bedsBathsBonus + renoBonus);
    const suggestedPrice = Math.round(computedEstimate * 0.98);
    const priceMin = Math.round(computedEstimate * 0.95);
    const priceMax = Math.round(computedEstimate * 1.06);

    const valData: ValuationData = {
      address,
      postalCode,
      city,
      province,
      propertyType,
      beds,
      baths,
      garage,
      sqft,
      lotSize,
      yearBuilt,
      basementType,
      renovations: selectedRenovations,
      additionalFeatures,
      estimatedValue: computedEstimate,
      suggestedSellingPrice: suggestedPrice,
      priceRangeMin: priceMin,
      priceRangeMax: priceMax,
      confidenceScore: 96,
      demandScore: 94,
      daysOnMarket: 18
    };

    if (user) {
      if (user.role === 'seller') {
        setCurrentValuationData(valData);
        setCurrentPage('valuation-report');
        showToast(`AI Valuation generated for ${address}!`, 'success');
      } else {
        savePendingValuation(valData, 'valuation-report');
        triggerRoleSwitchWarning('seller', 'valuation-report');
      }
    } else {
      savePendingValuation(valData, 'valuation-report');
      setCurrentPage('auth');
      showToast('Property details captured! Please log in or register as a Seller to unlock your complete AI Valuation Report.', 'info');
    }
  };

  return (
    <div className="fade-in" style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '100px' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div className="badge badge-lavender badge-glow" style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
            <Sparkles size={14} />
            <span>AI PROPERTY VALUATION ENGINE</span>
          </div>
          
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.02em' }}>
            What's My Home <span className="text-gradient-electric">Worth?</span>
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '640px', lineHeight: '1.6' }}>
            Enter your property specifications below to trigger our sovereign AI price evaluation model trained on millions of Canadian MLS® and off-market luxury records.
          </p>
        </div>

        {/* Main Valuation Form Glass Panel */}
        <form 
          onSubmit={handleCalculate}
          className="glass-panel" 
          style={{ 
            padding: '40px', 
            borderRadius: '24px', 
            border: '1px solid rgba(167, 139, 250, 0.2)',
            background: 'linear-gradient(135deg, rgba(7,13,36,0.9) 0%, rgba(10,18,42,0.6) 100%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px'
          }}
        >
          {/* Section 1: Address & Location */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={18} style={{ color: 'var(--color-lavender)' }} />
              <span>1. Property Location & Address</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="form-input-container">
                <label className="form-label">Property Street Address</label>
                <input 
                  type="text" 
                  value={address} 
                  onChange={e => setAddress(e.target.value)}
                  placeholder="e.g. 102 Radcliffe Ridge or 88 Yorkville Ave" 
                  className="form-input" 
                  style={{ background: '#070d24', border: '1px solid rgba(255,255,255,0.08)' }}
                  required 
                />
              </div>

              <div className="form-input-container">
                <label className="form-label">Postal Code</label>
                <input 
                  type="text" 
                  value={postalCode} 
                  onChange={e => setPostalCode(e.target.value)}
                  placeholder="e.g. M5H 2N2" 
                  className="form-input"
                  style={{ background: '#070d24', border: '1px solid rgba(255,255,255,0.08)' }} 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-input-container">
                <label className="form-label">City / Metropolitan Area</label>
                <select 
                  value={city} 
                  onChange={e => setCity(e.target.value)}
                  className="form-input"
                  style={{ background: '#070d24', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <option value="Toronto">Toronto (GTA)</option>
                  <option value="Vancouver">Vancouver (Metro)</option>
                  <option value="Oakville">Oakville / Burlington</option>
                  <option value="Mississauga">Mississauga</option>
                  <option value="Whistler">Whistler / Resort</option>
                  <option value="Calgary">Calgary</option>
                  <option value="Montreal">Montreal</option>
                  <option value="Ottawa">Ottawa</option>
                </select>
              </div>

              <div className="form-input-container">
                <label className="form-label">Province</label>
                <select 
                  value={province} 
                  onChange={e => setProvince(e.target.value)}
                  className="form-input"
                  style={{ background: '#070d24', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <option value="Ontario">Ontario (ON)</option>
                  <option value="British Columbia">British Columbia (BC)</option>
                  <option value="Alberta">Alberta (AB)</option>
                  <option value="Quebec">Quebec (QC)</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

          {/* Section 2: Property Specifications */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building2 size={18} style={{ color: 'var(--color-lavender)' }} />
              <span>2. Architectural Specifications</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="form-input-container">
                <label className="form-label">Property Type</label>
                <select 
                  value={propertyType} 
                  onChange={e => setPropertyType(e.target.value)}
                  className="form-input"
                  style={{ background: '#070d24', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <option value="Detached">Detached Single Family</option>
                  <option value="Semi-Detached">Semi-Detached</option>
                  <option value="Townhouse">Executive Townhouse</option>
                  <option value="Condo Penthouse">Condo Penthouse</option>
                  <option value="Estate">Gated Country Estate</option>
                  <option value="Luxury Villa">Waterfront Luxury Villa</option>
                </select>
              </div>

              <div className="form-input-container">
                <label className="form-label">Bedrooms</label>
                <input 
                  type="number" 
                  min={1} 
                  max={12} 
                  value={beds} 
                  onChange={e => setBeds(Number(e.target.value))}
                  className="form-input"
                  style={{ background: '#070d24' }} 
                />
              </div>

              <div className="form-input-container">
                <label className="form-label">Bathrooms</label>
                <input 
                  type="number" 
                  min={1} 
                  max={15} 
                  value={baths} 
                  onChange={e => setBaths(Number(e.target.value))}
                  className="form-input"
                  style={{ background: '#070d24' }} 
                />
              </div>

              <div className="form-input-container">
                <label className="form-label">Garage Spaces</label>
                <input 
                  type="number" 
                  min={0} 
                  max={10} 
                  value={garage} 
                  onChange={e => setGarage(Number(e.target.value))}
                  className="form-input"
                  style={{ background: '#070d24' }} 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
              <div className="form-input-container">
                <label className="form-label">Square Feet</label>
                <input 
                  type="number" 
                  min={800} 
                  max={30000} 
                  step={100}
                  value={sqft} 
                  onChange={e => setSqft(Number(e.target.value))}
                  className="form-input"
                  style={{ background: '#070d24' }} 
                />
              </div>

              <div className="form-input-container">
                <label className="form-label">Lot Dimensions</label>
                <input 
                  type="text" 
                  value={lotSize} 
                  onChange={e => setLotSize(e.target.value)}
                  placeholder="e.g. 60 x 135 ft" 
                  className="form-input"
                  style={{ background: '#070d24' }} 
                />
              </div>

              <div className="form-input-container">
                <label className="form-label">Year Built</label>
                <input 
                  type="number" 
                  min={1880} 
                  max={2026} 
                  value={yearBuilt} 
                  onChange={e => setYearBuilt(Number(e.target.value))}
                  className="form-input"
                  style={{ background: '#070d24' }} 
                />
              </div>

              <div className="form-input-container">
                <label className="form-label">Basement Type</label>
                <select 
                  value={basementType} 
                  onChange={e => setBasementType(e.target.value)}
                  className="form-input"
                  style={{ background: '#070d24', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <option value="Finished Walkout">Finished Walkout</option>
                  <option value="Finished">Finished Standard</option>
                  <option value="Unfinished">Unfinished / Shell</option>
                  <option value="None">None / Slab</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

          {/* Section 3: Recent Renovations & Features */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layers size={18} style={{ color: 'var(--color-lavender)' }} />
              <span>3. Recent Renovations & Premium Upgrades</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
              {renovationOptions.map((item, idx) => {
                const checked = selectedRenovations.includes(item);
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleToggleRenovation(item)}
                    style={{
                      background: checked ? 'rgba(167, 139, 250, 0.15)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${checked ? 'var(--color-lavender)' : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: '12px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      color: checked ? '#ffffff' : 'var(--text-secondary)',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      transition: '0.2s',
                      textAlign: 'left'
                    }}
                  >
                    <CheckSquare size={16} style={{ color: checked ? 'var(--color-lavender)' : 'rgba(255,255,255,0.3)' }} />
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>

            <div className="form-input-container">
              <label className="form-label">Additional Features & Custom Architectural Detail</label>
              <textarea 
                rows={3} 
                value={additionalFeatures} 
                onChange={e => setAdditionalFeatures(e.target.value)}
                placeholder="e.g., Heated driveway, custom Italian cabinetry, smart security system, wine tasting room..." 
                className="form-input"
                style={{ background: '#070d24', border: '1px solid rgba(255,255,255,0.08)', resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Submit CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
            <button 
              type="submit" 
              className="btn btn-primary hover-lift"
              style={{
                padding: '18px 36px',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                background: 'linear-gradient(135deg, var(--color-lavender) 0%, var(--color-blue-primary) 100%)',
                boxShadow: '0 10px 25px rgba(124, 58, 237, 0.3)'
              }}
            >
              <Sparkles size={20} />
              <span>Get AI Valuation Report</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              <ShieldCheck size={14} style={{ color: '#10b981' }} />
              <span>Confidential calculation. No obligation. Sovereign privacy guaranteed.</span>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
