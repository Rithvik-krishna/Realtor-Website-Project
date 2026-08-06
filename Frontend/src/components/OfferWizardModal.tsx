import React, { useState } from 'react';
import { X, CheckCircle2, ChevronRight, ChevronLeft, ShieldCheck, DollarSign, FileText, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Property } from '../context/AppContext';

interface OfferWizardModalProps {
  isOpen?: boolean;
  property: Property;
  onClose: () => void;
}

export const OfferWizardModal: React.FC<OfferWizardModalProps> = ({ isOpen = true, property, onClose }) => {
  const { user, submitOffer, setCurrentPage, showToast } = useApp();

  if (isOpen === false) return null;

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form Fields
  const [offerAmount, setOfferAmount] = useState<number>(property.price);
  const [deposit, setDeposit] = useState<number>(Math.round(property.price * 0.05));
  const [closingDate, setClosingDate] = useState('2026-09-30');
  const [irrevocableDate, setIrrevocableDate] = useState('2026-08-10');
  
  // Conditions
  const [conditions, setConditions] = useState<{
    financing: boolean;
    inspection: boolean;
    statusCertificate: boolean;
    appraisal: boolean;
  }>({
    financing: true,
    inspection: true,
    statusCertificate: property.propertyType === 'Condo',
    appraisal: false
  });

  const [signature, setSignature] = useState(user ? user.name : '');

  const handleToggleCondition = (key: keyof typeof conditions) => {
    setConditions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNext = () => {
    if (step === 1 && !user) {
      showToast('Please authenticate before making a formal purchase offer.', 'warning');
      setCurrentPage('auth');
      onClose();
      return;
    }
    setStep(prev => (prev < 5 ? (prev + 1) as any : prev));
  };

  const handleBack = () => {
    setStep(prev => (prev > 1 ? (prev - 1) as any : prev));
  };

  const handleSubmitOffer = () => {
    const selectedConditionsList: string[] = [];
    if (conditions.financing) selectedConditionsList.push('Subject to Buyer Financing Approval (5 Days)');
    if (conditions.inspection) selectedConditionsList.push('Subject to Home Inspection Approval (3 Days)');
    if (conditions.statusCertificate) selectedConditionsList.push('Subject to Status Certificate Review');
    if (conditions.appraisal) selectedConditionsList.push('Subject to Property Appraisal Verification');

    submitOffer({
      propertyId: property.id,
      offerAmount,
      deposit,
      closingDate,
      irrevocableDate,
      conditions: selectedConditionsList,
      notes: `Formal signed purchase agreement for ${property.title} by ${signature}.`
    });

    setStep(5);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(3, 7, 18, 0.88)',
        backdropFilter: 'blur(16px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      className="fade-in"
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: 'min(92vw, 620px)',
          padding: '20px 24px',
          borderRadius: '20px',
          border: '1px solid rgba(167, 139, 250, 0.35)',
          boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.8)',
          position: 'relative',
          maxHeight: 'calc(100vh - 32px)',
          overflowY: 'auto'
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: 'none',
            color: 'var(--text-muted)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          className="hover-lift"
        >
          <X size={16} />
        </button>

        {/* Progress Multi-step Tracker */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-lavender)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Sovereign Purchase Portal
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Step {step} of 5
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
            {[1, 2, 3, 4, 5].map(s => (
              <div
                key={s}
                style={{
                  height: '100%',
                  background: s <= step ? 'linear-gradient(90deg, var(--color-lavender), var(--color-blue-primary))' : 'transparent',
                  transition: '0.3s ease'
                }}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: PROPERTY REVIEW */}
        {step === 1 && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff' }}>Step 1: Review Property & Terms</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Verify property specs and starting parameters before generating formal purchase contract.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '14px',
                padding: '12px 14px',
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <img
                src={property.imageUrl}
                alt={property.title}
                style={{ width: '100px', height: '75px', borderRadius: '10px', objectFit: 'cover' }}
              />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span className="badge badge-blue" style={{ width: 'fit-content', fontSize: '0.65rem', marginBottom: '4px', padding: '2px 8px' }}>
                  MLS® #{property.mlsNumber}
                </span>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff' }}>{property.title}</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{property.location}</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-lavender)', marginTop: '4px' }}>
                  List Price: ${property.price.toLocaleString()}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div className="glass-panel" style={{ padding: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Beds / Baths</span>
                <strong style={{ fontSize: '0.88rem', color: '#fff' }}>{property.beds} Beds / {property.baths} Baths</strong>
              </div>
              <div className="glass-panel" style={{ padding: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Square Footage</span>
                <strong style={{ fontSize: '0.88rem', color: '#fff' }}>{property.sqft.toLocaleString()} sqft</strong>
              </div>
              <div className="glass-panel" style={{ padding: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Estimated Tax</span>
                <strong style={{ fontSize: '0.88rem', color: '#fff' }}>${property.taxes.toLocaleString()}/yr</strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button
                onClick={handleNext}
                className="btn btn-primary"
                style={{ padding: '10px 24px', fontSize: '0.85rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>Continue to Financials</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: ENTER OFFER AMOUNT & DEPOSIT */}
        {step === 2 && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff' }}>Step 2: Offer Financials</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Specify offer price, earnest deposit, and target closing schedule.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Offer Price ($ CAD)
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <DollarSign size={16} style={{ position: 'absolute', left: '12px', color: 'var(--color-lavender)' }} />
                  <input
                    type="number"
                    value={offerAmount}
                    onChange={e => setOfferAmount(Number(e.target.value))}
                    step={10000}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: '10px',
                      background: 'rgba(3,7,18,0.7)',
                      border: '1px solid rgba(167,139,250,0.4)',
                      color: '#ffffff',
                      fontSize: '1rem',
                      fontWeight: 700,
                      outline: 'none'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <span>List Price: ${property.price.toLocaleString()}</span>
                  <span>Variance: {(((offerAmount - property.price) / property.price) * 100).toFixed(1)}%</span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Initial Earnest Deposit ($ CAD)
                </label>
                <input
                  type="number"
                  value={deposit}
                  onChange={e => setDeposit(Number(e.target.value))}
                  step={5000}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: 'rgba(3,7,18,0.7)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '3px' }}>
                  Standard GTA deposit is 5% of offer amount (${Math.round(offerAmount * 0.05).toLocaleString()})
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Proposed Closing Date
                  </label>
                  <input
                    type="date"
                    value={closingDate}
                    onChange={e => setClosingDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: 'rgba(3,7,18,0.7)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#ffffff',
                      fontSize: '0.82rem',
                      outline: 'none',
                      colorScheme: 'dark'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Irrevocable Until
                  </label>
                  <input
                    type="date"
                    value={irrevocableDate}
                    onChange={e => setIrrevocableDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: 'rgba(3,7,18,0.7)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#ffffff',
                      fontSize: '0.82rem',
                      outline: 'none',
                      colorScheme: 'dark'
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
              <button
                onClick={handleBack}
                className="btn btn-secondary"
                style={{ padding: '10px 18px', fontSize: '0.85rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>

              <button
                onClick={handleNext}
                className="btn btn-primary"
                style={{ padding: '10px 24px', fontSize: '0.85rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>Select Conditions</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CONDITIONS */}
        {step === 3 && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff' }}>Step 3: Protective Conditions</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Select standard conditions to protect your capital during the transaction.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { key: 'financing', title: 'Subject to Buyer Financing (5 Days)', desc: 'Full mortgage underwriting approval confirmation' },
                { key: 'inspection', title: 'Subject to Professional Inspection (3 Days)', desc: 'Comprehensive structural & thermal analysis by certified engineer' },
                { key: 'statusCertificate', title: 'Subject to Status Certificate Review', desc: 'Legal review of condo reserve fund and bylaws' },
                { key: 'appraisal', title: 'Subject to Independent Property Appraisal', desc: 'Bank asset appraisal matching or exceeding purchase price' }
              ].map(cond => {
                const isSelected = conditions[cond.key as keyof typeof conditions];
                return (
                  <div
                    key={cond.key}
                    onClick={() => handleToggleCondition(cond.key as keyof typeof conditions)}
                    className="hover-lift"
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: isSelected ? '1px solid var(--color-lavender)' : '1px solid rgba(255,255,255,0.06)',
                      background: isSelected ? 'rgba(167, 139, 250, 0.1)' : 'rgba(255,255,255,0.02)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>{cond.title}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '1px' }}>{cond.desc}</p>
                    </div>

                    <div
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '6px',
                        border: isSelected ? 'none' : '2px solid rgba(255,255,255,0.2)',
                        background: isSelected ? 'var(--color-lavender)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#000000'
                      }}
                    >
                      {isSelected && <CheckCircle2 size={16} style={{ color: '#030712' }} />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
              <button
                onClick={handleBack}
                className="btn btn-secondary"
                style={{ padding: '10px 18px', fontSize: '0.85rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>

              <button
                onClick={handleNext}
                className="btn btn-primary"
                style={{ padding: '10px 24px', fontSize: '0.85rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>Review & Sign</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & DIGITAL SIGNATURE */}
        {step === 4 && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff' }}>Step 4: Contract Review & Signature</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Review generated Agreement of Purchase and Sale terms before submission.
              </p>
            </div>

            <div
              className="glass-panel"
              style={{
                padding: '14px 16px',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Property Address:</span>
                <strong style={{ color: '#fff', fontSize: '0.78rem' }}>{property.address}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Purchase Offer Amount:</span>
                <strong style={{ color: 'var(--color-lavender)', fontSize: '1rem', fontWeight: 700 }}>${offerAmount.toLocaleString()}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Deposit Required:</span>
                <strong style={{ color: '#fff', fontSize: '0.78rem' }}>${deposit.toLocaleString()}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Closing Date:</span>
                <strong style={{ color: '#fff', fontSize: '0.78rem' }}>{closingDate}</strong>
              </div>

              <div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', display: 'block', marginBottom: '4px' }}>Attached Protective Clauses:</span>
                <ul style={{ paddingLeft: '18px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {conditions.financing && <li>Subject to Buyer Financing Approval (5 Days)</li>}
                  {conditions.inspection && <li>Subject to Home Inspection Approval (3 Days)</li>}
                  {conditions.statusCertificate && <li>Subject to Status Certificate Review</li>}
                  {conditions.appraisal && <li>Subject to Independent Property Appraisal</li>}
                </ul>
              </div>
            </div>

            {/* Digital Signature */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Digital Signature (Type Full Legal Name)
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <FileText size={16} style={{ position: 'absolute', left: '12px', color: 'var(--color-lavender)' }} />
                <input
                  type="text"
                  value={signature}
                  onChange={e => setSignature(e.target.value)}
                  placeholder="e.g. Laurent de Bourgeois"
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '10px',
                    background: 'rgba(3,7,18,0.7)',
                    border: '1px solid rgba(167,139,250,0.4)',
                    color: 'var(--color-lavender)',
                    fontSize: '0.92rem',
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    outline: 'none'
                  }}
                />
              </div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', marginTop: '3px' }}>
                By signing, you initiate a formal offer logged on NovaEstate Sovereign Ledger.
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
              <button
                onClick={handleBack}
                className="btn btn-secondary"
                style={{ padding: '10px 18px', fontSize: '0.85rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>

              <button
                onClick={handleSubmitOffer}
                className="btn btn-primary"
                style={{ padding: '10px 24px', fontSize: '0.85rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Lock size={16} />
                <span>Submit & Transmit Offer</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: CONFIRMATION & TIMELINE INITIATION */}
        {step === 5 && (
          <div className="fade-in" style={{ textAlign: 'center', padding: '12px 8px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981',
                margin: '0 auto 14px auto'
              }}
            >
              <ShieldCheck size={32} />
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>
              Purchase Offer Transmitted!
            </h3>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', maxWidth: '400px', margin: '0 auto 16px auto', lineHeight: '1.5' }}>
              Your formal purchase offer of <strong style={{ color: 'var(--color-lavender)' }}>${offerAmount.toLocaleString()}</strong> for <strong style={{ color: '#fff' }}>{property.title}</strong> has been transmitted to listing agent {property.agent.name}.
            </p>

            <div
              className="glass-panel"
              style={{ padding: '12px', borderRadius: '12px', marginBottom: '18px', border: '1px solid rgba(167, 139, 250, 0.2)' }}
            >
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>
                Purchase Milestone Initiated
              </span>
              <strong style={{ fontSize: '0.88rem', color: '#ffffff', display: 'block', marginTop: '2px' }}>
                Step 3 of 8: Offer Submitted to Listing Agent
              </strong>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  onClose();
                  setCurrentPage('dashboard-buyer');
                }}
                className="btn btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.85rem', borderRadius: '10px' }}
              >
                View Purchase Timeline in Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
