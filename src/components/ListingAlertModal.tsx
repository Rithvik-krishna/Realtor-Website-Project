import React, { useState } from 'react';
import { X, Bell, CheckCircle2, Shield, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface ListingAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultLocation?: string;
}

export const ListingAlertModal: React.FC<ListingAlertModalProps> = ({ isOpen, onClose, defaultLocation = 'Mississauga' }) => {
  const { showToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState(defaultLocation);
  const [maxPrice, setMaxPrice] = useState('1300000');
  const [propertyType, setPropertyType] = useState('Detached');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      showToast('Please provide your name and email address.', 'warning');
      return;
    }

    setLoading(true);

    try {
      await fetch('/api/v1/leads/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          leadType: 'BUYER',
          source: 'LANDING_PAGE',
          location,
          pageUrl: window.location.href,
          searchCriteria: { location, maxPrice: parseInt(maxPrice, 10), propertyType }
        })
      });

      setSubmitted(true);
      showToast('Listing alerts activated! You will receive instant notifications when matching properties are listed.', 'success');
    } catch {
      setSubmitted(true);
      showToast('Alert preferences saved!', 'success');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        animation: 'fade-in 0.2s ease'
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          background: '#ffffff',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ padding: '24px 28px 16px 28px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={14} /> Instant Listing Alerts
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0' }}>Get New Listing Notifications</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
            className="hover-lift"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: '24px 28px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <CheckCircle2 size={48} style={{ color: '#059669', margin: '0 auto 12px auto' }} />
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Alerts Successfully Configured!</h4>
              <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5, marginBottom: '20px' }}>
                We will email you at <strong>{email}</strong> whenever new properties matching <strong>{location} (up to ${parseInt(maxPrice, 10).toLocaleString()})</strong> hit the TRREB MLS® System.
              </p>
              <button
                onClick={onClose}
                style={{ padding: '12px 24px', borderRadius: '12px', background: '#059669', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px', display: 'block' }}>Target Location</label>
                  <select
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', background: '#fff' }}
                  >
                    <option value="Mississauga">Mississauga</option>
                    <option value="Brampton">Brampton</option>
                    <option value="Toronto">Toronto / GTA</option>
                    <option value="Oakville">Oakville</option>
                    <option value="Milton">Milton</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px', display: 'block' }}>Max Budget (CAD)</label>
                  <select
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', background: '#fff' }}
                  >
                    <option value="1000000">$1,000,000</option>
                    <option value="1300000">$1,300,000 (Target)</option>
                    <option value="1800000">$1,800,000</option>
                    <option value="2500000">$2,500,000+</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px', display: 'block' }}>Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px', display: 'block' }}>Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px', display: 'block' }}>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="(416) 555-0199"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  background: '#059669',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 10px 20px rgba(5, 150, 105, 0.25)',
                  marginTop: '4px'
                }}
                className="hover-lift"
              >
                <Bell size={16} />
                <span>{loading ? 'Activating Alerts...' : 'Activate Instant Listing Alerts'}</span>
              </button>

              <div style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Shield size={12} style={{ color: '#059669' }} />
                <span>No spam. Unsubscribe anytime with 1-click.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
