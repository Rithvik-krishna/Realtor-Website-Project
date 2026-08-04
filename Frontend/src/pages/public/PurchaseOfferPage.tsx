import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  DollarSign, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  CheckSquare, 
  Square, 
  MapPin
} from 'lucide-react';

export const PurchaseOfferPage: React.FC = () => {
  const { 
    selectedPropertyId, 
    properties, 
    setCurrentPage, 
    user, 
    submitOffer, 
    showToast 
  } = useApp();

  const property = properties.find(p => p.id === selectedPropertyId) || properties[0];

  // 5 Step Wizard state
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form Fields
  const [offerPrice, setOfferPrice] = useState(property.price);
  const [depositAmount, setDepositAmount] = useState(Math.round(property.price * 0.05));
  const [closingDays, setClosingDays] = useState(30);
  const [financingCondition, setFinancingCondition] = useState(true);
  const [inspectionCondition, setInspectionCondition] = useState(true);
  const [appraisalCondition, setAppraisalCondition] = useState(true);
  const [statusCertCondition, setStatusCertCondition] = useState(true);
  
  // Legal Signature
  const [signatureName, setSignatureName] = useState(user?.name || 'Laurent de Bourgeois');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [submittedOfferId, setSubmittedOfferId] = useState('');

  const handleNext = () => {
    if (step < 4) {
      setStep((step + 1) as any);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep((step - 1) as any);
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) {
      showToast('Please confirm the legal attestation checkbox.', 'warning');
      return;
    }

    const offerId = `OFFER-${Date.now().toString().slice(-5)}`;
    submitOffer({
      propertyId: property.id,
      offerAmount: offerPrice,
      deposit: depositAmount,
      closingDate: `${closingDays} Days`,
      irrevocableDate: '48 Hours',
      conditions: [
        financingCondition ? 'Financing Clearance' : '',
        inspectionCondition ? 'On-site Inspection' : '',
        appraisalCondition ? 'Valuation Appraisal' : '',
        statusCertCondition ? 'Status Certificate' : ''
      ].filter(Boolean)
    });

    setSubmittedOfferId(offerId);
    setStep(5);
    showToast(`Purchase offer ${offerId} successfully transmitted!`, 'success');
  };

  const handleReturnToProperty = () => {
    setCurrentPage('property-detail');
  };

  const stepsList = [
    { num: 1, label: 'Property Specs' },
    { num: 2, label: 'Financials' },
    { num: 3, label: 'Conditions' },
    { num: 4, label: 'Signature' },
    { num: 5, label: 'Transmitted' }
  ];

  return (
    <div className="fade-in" style={{ paddingTop: '20px', paddingBottom: '60px', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        
        {/* Navigation Breadcrumbs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button
            onClick={handleReturnToProperty}
            className="btn btn-secondary hover-lift"
            style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <ArrowLeft size={16} />
            <span>Return to Listing</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-lavender" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              SOVEREIGN OFFER PORTAL
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              MLS® #{property.mlsNumber || `N${property.id}`}
            </span>
          </div>
        </div>

        {/* Page Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Sovereign Purchase <span className="text-gradient-electric">Portal</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
            Submit an encrypted, binding purchase agreement directly to NovaEstate Senior Partners.
          </p>
        </div>

        {/* Progress Step Bar */}
        <div 
          className="glass-panel" 
          style={{ 
            padding: '16px 24px', 
            borderRadius: '16px', 
            marginBottom: '28px', 
            border: '1px solid rgba(167, 139, 250, 0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            overflowX: 'auto'
          }}
        >
          {stepsList.map(s => {
            const isActive = step === s.num;
            const isCompleted = step > s.num;
            return (
              <div 
                key={s.num} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  opacity: isActive || isCompleted ? 1 : 0.4,
                  whiteSpace: 'nowrap'
                }}
              >
                <div 
                  style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: isCompleted ? '#10b981' : isActive ? 'var(--color-lavender)' : 'rgba(255,255,255,0.08)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 700
                  }}
                >
                  {isCompleted ? <CheckCircle2 size={18} /> : s.num}
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: isActive ? 600 : 400, color: isActive ? '#ffffff' : 'var(--text-secondary)' }}>
                  {s.label}
                </span>
                {s.num < 5 && <div style={{ width: '20px', height: '1px', background: 'rgba(255,255,255,0.1)' }} />}
              </div>
            );
          })}
        </div>

        {/* Main 2-Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '28px', alignItems: 'start' }}>
          
          {/* Left Column: Multi-Step Wizard Body */}
          <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
            
            {/* STEP 1: PROPERTY SPECS & ASSET CONTEXT */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <span className="badge badge-lavender" style={{ marginBottom: '8px' }}>STEP 1 OF 4</span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff' }}>Property Specifications & Asset Context</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Confirm the legal land description and asset identifier.
                  </p>
                </div>

                <div className="glass-panel" style={{ padding: '18px', borderRadius: '14px', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Asset Title:</span>
                    <span style={{ color: '#ffffff', fontWeight: 600 }}>{property.title}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Property Type:</span>
                    <span style={{ color: '#ffffff' }}>{property.propertyType}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Location:</span>
                    <span style={{ color: '#ffffff' }}>{property.address}, {property.city}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Listed Valuation:</span>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>${property.price.toLocaleString('en-CA')}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button onClick={handleNext} className="btn btn-primary hover-lift" style={{ padding: '12px 28px', fontSize: '0.88rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Continue to Financials</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: FINANCIAL PARAMETERS */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <span className="badge badge-lavender" style={{ marginBottom: '8px' }}>STEP 2 OF 4</span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff' }}>Financial Terms & Offer Structure</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Define purchase offer valuation, initial deposit, and closing timeframe.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.72rem' }}>Purchase Offer Amount (CAD)</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        value={offerPrice}
                        onChange={e => setOfferPrice(Number(e.target.value))}
                        className="form-input"
                        style={{ paddingLeft: '40px', fontSize: '1rem', fontWeight: 600, color: '#10b981' }}
                        step={10000}
                        required
                      />
                      <DollarSign size={18} style={{ position: 'absolute', left: '14px', top: '13px', color: '#10b981' }} />
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                      Listing Price: ${property.price.toLocaleString('en-CA')}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.72rem' }}>Initial Escrow Deposit (CAD)</label>
                      <input
                        type="number"
                        value={depositAmount}
                        onChange={e => setDepositAmount(Number(e.target.value))}
                        className="form-input"
                        style={{ fontSize: '0.88rem' }}
                        step={5000}
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.72rem' }}>Closing Period (Days)</label>
                      <select
                        value={closingDays}
                        onChange={e => setClosingDays(Number(e.target.value))}
                        className="form-input"
                        style={{ fontSize: '0.88rem', cursor: 'pointer' }}
                      >
                        <option value={15} style={{ background: '#0b1220' }}>15 Days (Fast-Track)</option>
                        <option value={30} style={{ background: '#0b1220' }}>30 Days (Standard)</option>
                        <option value={60} style={{ background: '#0b1220' }}>60 Days</option>
                        <option value={90} style={{ background: '#0b1220' }}>90 Days</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                  <button onClick={handlePrev} className="btn btn-secondary hover-lift" style={{ padding: '12px 20px', fontSize: '0.85rem', borderRadius: '10px' }}>
                    Back
                  </button>
                  <button onClick={handleNext} className="btn btn-primary hover-lift" style={{ padding: '12px 28px', fontSize: '0.88rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Protective Conditions</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PROTECTIVE CONDITIONS */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <span className="badge badge-lavender" style={{ marginBottom: '8px' }}>STEP 3 OF 4</span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff' }}>Protective Clauses & Contingencies</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Select mandatory protective contingencies for the buyer.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { state: financingCondition, setState: setFinancingCondition, title: 'Financing Clearance Contingency', desc: 'Subject to buyer securing satisfactory mortgage approval within 5 business days.' },
                    { state: inspectionCondition, setState: setInspectionCondition, title: 'On-Site Property Inspection', desc: 'Subject to satisfactory structural, mechanical, and roof inspection report.' },
                    { state: appraisalCondition, setState: setAppraisalCondition, title: 'Bank Property Appraisal', desc: 'Subject to lender appraisal verifying minimum valuation matching offer amount.' },
                    { state: statusCertCondition, setState: setStatusCertCondition, title: 'Status Certificate / Title Review', desc: 'Subject to buyer solicitor reviewing title, easements, and reserve fund status.' }
                  ].map((cond, idx) => (
                    <div
                      key={idx}
                      onClick={() => cond.setState(!cond.state)}
                      style={{
                        padding: '14px',
                        borderRadius: '12px',
                        background: cond.state ? 'rgba(167, 139, 250, 0.1)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${cond.state ? 'rgba(167, 139, 250, 0.3)' : 'rgba(255,255,255,0.06)'}`,
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start',
                        cursor: 'pointer'
                      }}
                    >
                      {cond.state ? <CheckSquare size={18} style={{ color: 'var(--color-lavender)', marginTop: '2px', flexShrink: 0 }} /> : <Square size={18} style={{ color: 'var(--text-muted)', marginTop: '2px', flexShrink: 0 }} />}
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: cond.state ? '#ffffff' : 'var(--text-secondary)' }}>{cond.title}</div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', margin: 0 }}>{cond.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                  <button onClick={handlePrev} className="btn btn-secondary hover-lift" style={{ padding: '12px 20px', fontSize: '0.85rem', borderRadius: '10px' }}>
                    Back
                  </button>
                  <button onClick={handleNext} className="btn btn-primary hover-lift" style={{ padding: '12px 28px', fontSize: '0.88rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Review & Signature</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW & DIGITAL SIGNATURE */}
            {step === 4 && (
              <form onSubmit={handleFinalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <span className="badge badge-lavender" style={{ marginBottom: '8px' }}>STEP 4 OF 4</span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff' }}>Review & Legal Digital Signature</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Review offer terms and provide digital attestation signature.
                  </p>
                </div>

                {/* Offer Summary Box */}
                <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Purchaser:</span>
                    <span style={{ color: '#ffffff', fontWeight: 600 }}>{user?.name || signatureName}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Offer Amount:</span>
                    <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.95rem' }}>${offerPrice.toLocaleString('en-CA')} CAD</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Initial Escrow Deposit:</span>
                    <span style={{ color: '#ffffff' }}>${depositAmount.toLocaleString('en-CA')} CAD</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Closing Period:</span>
                    <span style={{ color: '#ffffff' }}>{closingDays} Days</span>
                  </div>
                </div>

                {/* Signature input */}
                <div>
                  <label className="form-label" style={{ fontSize: '0.72rem' }}>Full Legal Name for Digital Attestation</label>
                  <input
                    type="text"
                    value={signatureName}
                    onChange={e => setSignatureName(e.target.value)}
                    className="form-input"
                    style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.03em' }}
                    required
                  />
                </div>

                {/* Terms agreement */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }} onClick={() => setAgreedTerms(!agreedTerms)}>
                  {agreedTerms ? <CheckSquare size={18} style={{ color: 'var(--color-lavender)', flexShrink: 0, marginTop: '2px' }} /> : <Square size={18} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '2px' }} />}
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    I authorize NovaEstate Managing Directors to transmit this encrypted purchase agreement to the property vendor's legal counsel.
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                  <button type="button" onClick={handlePrev} className="btn btn-secondary hover-lift" style={{ padding: '12px 20px', fontSize: '0.85rem', borderRadius: '10px' }}>
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn hover-lift"
                    style={{
                      padding: '14px 28px',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 18px rgba(16, 185, 129, 0.35)'
                    }}
                  >
                    <Lock size={16} />
                    <span>Transmit Encrypted Offer</span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 5: TRANSMITTED CONFIRMATION */}
            {step === 5 && (
              <div style={{ textAlign: 'center', padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                  <CheckCircle2 size={36} />
                </div>

                <span className="badge badge-lavender" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>OFFER TRANSMITTED</span>
                
                <h2 style={{ fontSize: '1.6rem', fontWeight: 600, color: '#ffffff' }}>Purchase Offer Active</h2>
                
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '420px', lineHeight: '1.5' }}>
                  Your binding offer <strong style={{ color: '#10b981' }}>#{submittedOfferId}</strong> for <strong style={{ color: '#ffffff' }}>{property.title}</strong> has been transmitted.
                </p>

                <div className="glass-panel" style={{ width: '100%', padding: '16px 20px', borderRadius: '12px', textAlign: 'left', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Offer Amount:</span>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>${offerPrice.toLocaleString('en-CA')} CAD</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Purchaser:</span>
                    <span style={{ color: '#ffffff' }}>{signatureName}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Managing Director:</span>
                    <span style={{ color: '#ffffff' }}>{property.agent ? property.agent.name : 'Sébastien LeClerc'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px', width: '100%' }}>
                  <button
                    onClick={() => setCurrentPage('dashboard-buyer')}
                    className="btn btn-primary hover-lift"
                    style={{ flex: 1, padding: '12px', fontSize: '0.85rem', borderRadius: '10px' }}
                  >
                    View Offer Status in Workspace
                  </button>
                  <button
                    onClick={handleReturnToProperty}
                    className="btn btn-secondary hover-lift"
                    style={{ flex: 1, padding: '12px', fontSize: '0.85rem', borderRadius: '10px' }}
                  >
                    Return to Listing
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Property Overview & Security Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Property Showcase Card */}
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ height: '180px', borderRadius: '14px', overflow: 'hidden', marginBottom: '14px', position: 'relative' }}>
                <img
                  src={property.imageUrl}
                  alt={property.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(3, 7, 18, 0.85)', padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-lavender)' }}>
                  ${property.price.toLocaleString('en-CA')}
                </div>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff' }}>{property.title}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <MapPin size={14} style={{ color: 'var(--color-lavender)' }} />
                <span>{property.address}, {property.city}</span>
              </p>

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '14px 0' }} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center', fontSize: '0.78rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '8px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>Beds</div>
                  <div style={{ color: '#ffffff', fontWeight: 600 }}>{property.beds}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '8px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>Baths</div>
                  <div style={{ color: '#ffffff', fontWeight: 600 }}>{property.baths}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '8px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>Sqft</div>
                  <div style={{ color: '#ffffff', fontWeight: 600 }}>{property.sqft.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Escrow Guarantee Card */}
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={20} style={{ color: '#10b981' }} />
                <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#ffffff' }}>NovaEstate Sovereign Escrow</h4>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>
                All deposit funds are held in trust under Schedule I Canadian Bank Escrow accounts with zero third-party disclosure.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
