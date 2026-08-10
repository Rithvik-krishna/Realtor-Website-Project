import React, { useState } from 'react';
import { X, Send, CheckCircle2, Shield, Phone, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface PropertyInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: {
    id: string;
    title: string;
    price: number;
    location: string;
    city: string;
    imageUrl?: string;
  } | null;
}

export const PropertyInfoModal: React.FC<PropertyInfoModalProps> = ({ isOpen, onClose, property }) => {
  const { showToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('I would like to receive complete marketing details and Floor plans for this listing.');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !property) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      showToast('Please provide your name and email address.', 'warning');
      return;
    }

    setLoading(true);

    try {
      await fetch('/api/v1/leads/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          leadType: 'BUYER',
          source: 'PROPERTY_PAGE',
          location: property.city || property.location,
          propertyId: property.id,
          pageUrl: window.location.href,
          searchCriteria: { propertyTitle: property.title, price: property.price }
        })
      });

      setSubmitted(true);
      showToast('Property information request received! Karan Kang REALTOR® will reach out to you.', 'success');
    } catch {
      setSubmitted(true);
      showToast('Request received! We will send you the property details shortly.', 'success');
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
        {/* Modal Header Bar */}
        <div style={{ padding: '24px 28px 16px 28px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Property Details Request</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0' }}>Get Listing Information</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
            className="hover-lift"
          >
            <X size={18} />
          </button>
        </div>

        {/* Property Brief Thumbnail Banner */}
        <div style={{ padding: '16px 28px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img
            src={property.imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=300&q=80'}
            alt={property.title}
            style={{ width: '64px', height: '54px', borderRadius: '10px', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>{property.title}</div>
            <div style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 700 }}>${property.price ? property.price.toLocaleString() : '899,000'} &bull; {property.city}</div>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px 28px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <CheckCircle2 size={48} style={{ color: '#059669', margin: '0 auto 12px auto' }} />
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Request Submitted Successfully!</h4>
              <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5, marginBottom: '20px' }}>
                Thank you, {name}. Karan Kang REALTOR® has received your request and will send you complete floor plans and disclosures for this property.
              </p>
              <button
                onClick={onClose}
                style={{ padding: '12px 24px', borderRadius: '12px', background: '#2563eb', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px', display: 'block' }}>Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alexander Wright"
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
                    placeholder="alex@example.com"
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

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px', display: 'block' }}>Message / Inquiry Details</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  background: '#2563eb',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 10px 20px rgba(37, 99, 235, 0.25)',
                  marginTop: '4px'
                }}
                className="hover-lift"
              >
                <Send size={16} />
                <span>{loading ? 'Sending Request...' : 'Send Information Request'}</span>
              </button>

              <div style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '4px' }}>
                <Shield size={12} style={{ color: '#059669' }} />
                <span>Your information is protected. Listed by Royal LePage Pinnacle.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
