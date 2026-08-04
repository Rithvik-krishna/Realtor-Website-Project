import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, Phone, MapPin, Calendar, Clock, CheckCircle, Globe } from 'lucide-react';

export const Contact: React.FC = () => {
  const { showToast } = useApp();
  
  // Interactive Form State
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: 'Acquisition Request', message: '' });
  const [submitted, setSubmitted] = useState(false);
  
  // Appointment Booking State
  const [bookDate, setBookDate] = useState('');
  const [bookTime, setBookTime] = useState('10:00 AM');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);



  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fulfill all mandatory legal fields.', 'warning');
      return;
    }
    setSubmitted(true);
    showToast('Inquiry received. Michael Anderson will contact you shortly.', 'success');
    setFormData({ name: '', email: '', phone: '', subject: 'Acquisition Request', message: '' });
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookDate) {
      showToast('Please select an appointment date.', 'warning');
      return;
    }
    setBookingConfirmed(true);
    showToast(`Bespoke appointment secured for ${bookDate} at ${bookTime}`, 'success');
  };



  return (
    <div className="fade-in" style={{ paddingTop: '20px', minHeight: '100vh', paddingBottom: '40px' }}>
      <div className="container">
        
        {/* Page Header */}
        <section style={{ textAlign: 'center', maxWidth: '750px', margin: '16px auto 32px auto' }}>
          <span className="badge badge-lavender" style={{ marginBottom: '12px' }}>BESPOKE DIRECTORY</span>
          <h1 style={{ fontSize: 'clamp(2rem, 3vw, 2.6rem)', fontWeight: 600, marginBottom: '12px' }}>Bespoke Consultation Gateway</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
            Whether you are preparing a multi-million dollar divestment or acquiring an alpine legacy, Michael Anderson and our managing partners provide absolute institutional security.
          </p>
        </section>

        {/* 2-Column Split: Form vs Agent profile Card */}
        <section style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px', marginBottom: '40px', alignItems: 'start' }} className="contact-split">
          
          {/* Left: Contact Form & Intake */}
          <div className="glass-panel" style={{ padding: '28px', border: '1px solid rgba(167, 139, 250, 0.15)', background: 'rgba(7, 13, 36, 0.3)' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#ffffff', marginBottom: '24px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Calendar size={18} style={{ color: 'var(--color-lavender)' }} />
              <span>Secure Intake Terminal</span>
            </h2>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <CheckCircle size={48} style={{ color: '#10b981' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Message Transmitted Securely</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6', maxWidth: '400px' }}>
                  Your secure packet has been routed to Michael Anderson. A response will be transmitted to your office in under 2 hours.
                </p>
                <button onClick={() => setSubmitted(false)} className="btn btn-secondary hover-lift" style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: '10px' }}>
                  Transmit Another Packet
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="form-row-mobile">
                  <div className="form-input-container">
                    <label className="form-label" style={{ fontSize: '0.65rem' }}>Full Legal Name</label>
                    <input
                      type="text"
                      placeholder="Jane Doe..."
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="form-input"
                      style={{ padding: '12px 16px', fontSize: '0.85rem' }}
                      required
                    />
                  </div>

                  <div className="form-input-container">
                    <label className="form-label" style={{ fontSize: '0.65rem' }}>Secure Email Address</label>
                    <input
                      type="email"
                      placeholder="jane@esrow.com..."
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="form-input"
                      style={{ padding: '12px 16px', fontSize: '0.85rem' }}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px' }} className="form-row-mobile">
                  <div className="form-input-container">
                    <label className="form-label" style={{ fontSize: '0.65rem' }}>Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="form-input"
                      style={{ padding: '12px 16px', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div className="form-input-container">
                    <label className="form-label" style={{ fontSize: '0.65rem' }}>Subject Matter</label>
                    <select
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className="form-input"
                      style={{ padding: '12px 16px', fontSize: '0.85rem', background: '#070d24', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <option value="Acquisition Request">Acquisition Request</option>
                      <option value="Divestment Proposal">Divestment Proposal</option>
                      <option value="Off-Market Reserve Access">Off-Market Reserve Access</option>
                      <option value="Sovereign Escrow Tour">Sovereign Escrow Tour</option>
                    </select>
                  </div>
                </div>

                <div className="form-input-container">
                  <label className="form-label" style={{ fontSize: '0.65rem' }}>Encrypted Message Packet</label>
                  <textarea
                    rows={5}
                    placeholder="Provide details about your target region, asset class, or architectural specifications..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="form-input"
                    style={{ padding: '16px', fontSize: '0.85rem', resize: 'none' }}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary hover-lift" style={{ width: '100%', padding: '14px', fontWeight: 600, borderRadius: '12px' }}>
                  <span>Securely Transmit Intake</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Agent Professional Card & Directory Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Michael Anderson Profile Card */}
            <div className="glass-panel" style={{ padding: '30px', border: '1px solid rgba(167, 139, 250, 0.25)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop" 
                  alt="Michael Anderson" 
                  style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-lavender)' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff' }}>Michael Anderson</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Senior Acquisitions Partner & Representative</p>
                  <span className="badge badge-lavender" style={{ fontSize: '0.62rem', marginTop: '6px', padding: '2px 8px' }}>Active License #416-0922</span>
                </div>
              </div>

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
                <a href="tel:+14165551234" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', textDecoration: 'none' }} className="hover-lift">
                  <Phone size={14} style={{ color: 'var(--color-lavender)' }} />
                  <span>+1 (416) 555-1234</span>
                </a>
                <a href="mailto:michael@example.com" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', textDecoration: 'none' }} className="hover-lift">
                  <Mail size={14} style={{ color: 'var(--color-lavender)' }} />
                  <span>michael@example.com</span>
                </a>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                  <MapPin size={14} style={{ color: 'var(--color-lavender)' }} />
                  <span>Toronto, Ontario</span>
                </div>
              </div>

              {/* Quick actions CTAs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '4px' }}>
                <a href="tel:+14165551234" className="btn btn-secondary hover-lift" style={{ padding: '10px', fontSize: '0.78rem', borderRadius: '10px', display: 'flex', gap: '6px' }}>
                  <Phone size={12} />
                  <span>Call Partner</span>
                </a>
                <a href="mailto:michael@example.com" className="btn btn-secondary hover-lift" style={{ padding: '10px', fontSize: '0.78rem', borderRadius: '10px', display: 'flex', gap: '6px' }}>
                  <Mail size={12} />
                  <span>Email Partner</span>
                </a>
              </div>
            </div>

            {/* Book Appointment CTA Inline form */}
            <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(255,255,255,0.04)', background: 'rgba(7, 13, 36, 0.2)' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#ffffff', marginBottom: '12px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <Calendar size={14} style={{ color: 'var(--color-lavender)' }} />
                <span>Private Consultation Booking</span>
              </h4>

              {bookingConfirmed ? (
                <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px' }}>
                  <p style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>Appointment Secured!</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>A calendar handshake token has been emitted.</p>
                </div>
              ) : (
                <form onSubmit={handleBookAppointment} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input 
                      type="date" 
                      value={bookDate}
                      onChange={e => setBookDate(e.target.value)}
                      className="form-input"
                      style={{ padding: '8px', fontSize: '0.75rem' }}
                      required
                    />
                    <select 
                      value={bookTime}
                      onChange={e => setBookTime(e.target.value)}
                      className="form-input"
                      style={{ padding: '8px', fontSize: '0.75rem', background: '#070d24', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="04:30 PM">04:30 PM</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ padding: '8px', fontSize: '0.78rem', borderRadius: '8px' }}>
                    <span>Secure Slot</span>
                  </button>
                </form>
              )}
            </div>

            {/* Social media presence & Office Hours */}
            <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>OFFICE HOURS (EST)</span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}><Clock size={12} /> Mon - Fri: 09:00 AM - 07:00 PM</p>
              </div>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />
              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>SOCIAL INTEGRITY CODES</span>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  {[
                    { icon: <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>, url: 'https://linkedin.com' },
                    { icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>, url: 'https://instagram.com' },
                    { icon: <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 3.779 8.502 11.24H16.17l-5.214-6.817L4.99 17.25H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 13.02h1.833L7.084 4.126H5.117z"/></svg>, url: 'https://twitter.com' },
                    { icon: <Globe size={14} />, url: 'https://google.com' }
                  ].map((s, idx) => (
                    <a key={idx} href={s.url} target="_blank" rel="noreferrer" style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textDecoration: 'none' }} className="hover-lift">
                      <span style={{ margin: 'auto', display: 'flex', alignItems: 'center' }}>{s.icon}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Styled Placeholder Google Map section */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 500, color: '#ffffff' }}>Regional Coordinates Hub</h2>
          
          <div 
            className="glass-panel" 
            style={{ 
              height: '350px', 
              borderRadius: '24px', 
              overflow: 'hidden', 
              border: '1px solid rgba(167, 139, 250, 0.15)',
              position: 'relative'
            }}
          >
            {/* High-fidelity Vector Map representation */}
            <div 
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%', 
                background: 'radial-gradient(circle at 40% 50%, rgba(167, 139, 250, 0.08) 0%, rgba(3, 7, 18, 0.9) 80%), #030712'
              }} 
            />
            
            {/* Grid styling overlay representing Stripe/Stamen maps */}
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.18 }}>
              <defs>
                <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(167, 139, 250, 0.4)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#mapGrid)" />
            </svg>

            {/* Interactive Vector Points mapping Michael's Office */}
            <div style={{ position: 'absolute', top: '50%', left: '40%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="luxury-glow-active">
              <div 
                style={{ 
                  width: '16px', 
                  height: '16px', 
                  borderRadius: '50%', 
                  background: 'var(--color-lavender)', 
                  border: '3px solid #ffffff', 
                  boxShadow: '0 0 20px var(--glow-lavender)',
                  cursor: 'pointer' 
                }} 
              />
              <div 
                className="glass-panel"
                style={{ 
                  padding: '10px 14px', 
                  background: 'rgba(3,7,18,0.95)', 
                  border: '1px solid var(--color-lavender)', 
                  borderRadius: '10px', 
                  fontSize: '0.72rem', 
                  color: '#ffffff',
                  marginTop: '8px',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.5)'
                }}
              >
                <strong>Yorkville HQ Office</strong><br />
                <span>Michael Anderson, Sales Rep</span>
              </div>
            </div>

            {/* Zoom telemetry controls */}
            <div style={{ position: 'absolute', bottom: '16px', right: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div className="glass-panel" style={{ padding: '6px 12px', fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(3,7,18,0.85)' }}>
                <span>GPS: 43.6702° N, 79.3927° W</span>
              </div>
            </div>
          </div>
        </section>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .contact-split { grid-template-columns: 1fr !important; gap: 40px !important; }
          .form-row-mobile { grid-template-columns: 1fr !important; gap: 14px !important; }
        }
      `}</style>
    </div>
  );
};
