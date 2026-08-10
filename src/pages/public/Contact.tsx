import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, Phone, Calendar, Clock, CheckCircle, Building2, Award } from 'lucide-react';
import { RealtorProfileCard } from '../../components/RealtorProfileCard';
import { SEOHead } from '../../components/seo/SEOHead';
import { generateOrganizationSchema, generateRealEstateAgentSchema } from '../../components/seo/schemaGenerators';
import { BreadcrumbBar } from '../../components/seo/BreadcrumbBar';

export const Contact: React.FC = () => {
  const { showToast } = useApp();

  const orgSchema = generateOrganizationSchema();
  const agentSchema = generateRealEstateAgentSchema();
  
  // Interactive Form State
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: 'Property Inquiry', message: '' });
  const [submitted, setSubmitted] = useState(false);
  
  // Appointment Booking State
  const [bookDate, setBookDate] = useState('');
  const [bookTime, setBookTime] = useState('10:00 AM');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill in all required contact fields.', 'warning');
      return;
    }
    setSubmitted(true);
    showToast('Inquiry submitted successfully. Karan Kang will contact you shortly.', 'success');
    setFormData({ name: '', email: '', phone: '', subject: 'Property Inquiry', message: '' });
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookDate) {
      showToast('Please select a date for your consultation.', 'warning');
      return;
    }
    setBookingConfirmed(true);
    showToast(`Consultation request received for ${bookDate} at ${bookTime}`, 'success');
  };

  return (
    <div className="fade-in" style={{ paddingTop: '24px', minHeight: '100vh', paddingBottom: '60px', background: '#ffffff' }}>
      <SEOHead
        title="Contact Karan Kang, REALTOR® | Kang Homes Royal LePage Pinnacle"
        description="Book a home viewing or real estate consultation with Karan Kang, REALTOR® at Royal LePage Pinnacle Real Estate. Phone: (416) 555-0199."
        canonicalPath="/contact"
        keywords={['Contact REALTOR Toronto', 'Karan Kang phone number', 'Royal LePage Pinnacle contact']}
        schemas={[orgSchema, agentSchema]}
      />

      <div className="container">
        <BreadcrumbBar items={[{ name: 'Contact Us', url: '/contact' }]} />
        
        {/* Page Header */}
        <section style={{ textAlign: 'center', maxWidth: '750px', margin: '16px auto 36px auto' }}>
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
            <Award size={14} /> DIRECT REALTOR® CONSULTATION
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>
            Get in Touch with Karan Kang
          </h1>
          <p style={{ color: '#475569', fontSize: '0.98rem', lineHeight: '1.6', fontWeight: 500 }}>
            Whether you are buying, selling, or exploring investment opportunities in Oakville, Mississauga, or the Greater Toronto Area, Karan Kang is ready to assist you.
          </p>
        </section>

        {/* Realtor Profile Card */}
        <section style={{ marginBottom: '40px' }}>
          <RealtorProfileCard />
        </section>

        {/* 2-Column Split: Form vs Office Details */}
        <section style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', marginBottom: '40px', alignItems: 'start' }} className="contact-split">
          
          {/* Left: Contact Form & Intake */}
          <div className="glass-panel" style={{ padding: '32px', border: '1px solid #e2e8f0', background: '#ffffff', borderRadius: '20px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#111827', marginBottom: '24px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Mail size={20} style={{ color: '#E31837' }} />
              <span>Send a Message</span>
            </h2>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <CheckCircle size={48} style={{ color: '#10b981' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827' }}>Message Sent Successfully!</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6', maxWidth: '400px' }}>
                  Thank you for contacting Kang Homes. Karan Kang will review your message and reply promptly.
                </p>
                <button onClick={() => setSubmitted(false)} className="btn btn-secondary hover-lift" style={{ padding: '10px 20px', fontSize: '0.85rem', borderRadius: '10px' }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="form-row-mobile">
                  <div className="form-input-container">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      placeholder="John Smith..."
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-input-container">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      placeholder="john@example.com..."
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px' }} className="form-row-mobile">
                  <div className="form-input-container">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="437-000-0000"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-input-container">
                    <label className="form-label">Subject</label>
                    <select
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className="form-input"
                    >
                      <option value="Property Inquiry">Property Buying Inquiry</option>
                      <option value="Home Valuation">Home Valuation / Selling</option>
                      <option value="Community Info">Oakville &amp; GTA Neighborhoods</option>
                      <option value="Schedule Viewing">Schedule Property Viewing</option>
                    </select>
                  </div>
                </div>

                <div className="form-input-container">
                  <label className="form-label">Your Message *</label>
                  <textarea
                    rows={5}
                    placeholder="Tell us about the location, property type, or questions you have..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="form-input"
                    style={{ padding: '14px', resize: 'none' }}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontWeight: 700, borderRadius: '12px' }}>
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Right: Office Info & Appointment Booking */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Office Info Card */}
            <div className="glass-panel" style={{ padding: '28px', border: '1px solid #e2e8f0', background: '#f8fafc', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={20} style={{ color: '#E31837' }} /> Royal LePage Pinnacle Office
              </h3>
              
              <div style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.6' }}>
                <strong style={{ color: '#111827', display: 'block', marginBottom: '4px' }}>Karan Kang, REALTOR®</strong>
                Royal LePage Pinnacle Real Estate<br />
                Independently Owned and Operated Brokerage<br />
                17 - 1075 North Service Road W.<br />
                Oakville, ON L6M 2G2
              </div>

              <div style={{ height: '1px', background: '#e2e8f0' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#111827', fontWeight: 600 }}>
                  <Clock size={16} style={{ color: '#E31837' }} />
                  <span>Hours: 6:00 AM – 10:00 PM (Weekends Off)</span>
                </div>
                <a href="tel:4379985873" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#111827', textDecoration: 'none', fontWeight: 600 }}>
                  <Phone size={16} style={{ color: '#E31837' }} />
                  <span>Cell: 437-998-5873</span>
                </a>
                <a href="tel:9054643035" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#111827', textDecoration: 'none', fontWeight: 600 }}>
                  <Phone size={16} style={{ color: '#1e293b' }} />
                  <span>Office: 905-464-3035</span>
                </a>
                <a href="mailto:realtorkarankang@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#111827', textDecoration: 'none', fontWeight: 600 }}>
                  <Mail size={16} style={{ color: '#E31837' }} />
                  <span>realtorkarankang@gmail.com</span>
                </a>
              </div>
            </div>

            {/* Private Consultation Booking */}
            <div className="glass-panel" style={{ padding: '24px', border: '1px solid #e2e8f0', background: '#ffffff', borderRadius: '16px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', marginBottom: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Calendar size={18} style={{ color: '#E31837' }} />
                <span>Book a Private Consultation</span>
              </h4>

              {bookingConfirmed ? (
                <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px' }}>
                  <p style={{ fontSize: '0.88rem', color: '#10b981', fontWeight: 700 }}>Consultation Requested!</p>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>Karan Kang will confirm your appointment time.</p>
                </div>
              ) : (
                <form onSubmit={handleBookAppointment} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input 
                      type="date" 
                      value={bookDate}
                      onChange={e => setBookDate(e.target.value)}
                      className="form-input"
                      style={{ padding: '8px 12px', fontSize: '0.82rem' }}
                      required
                    />
                    <select 
                      value={bookTime}
                      onChange={e => setBookTime(e.target.value)}
                      className="form-input"
                      style={{ padding: '8px 12px', fontSize: '0.82rem' }}
                    >
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                      <option value="07:00 PM">07:00 PM</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ padding: '10px', fontSize: '0.85rem', borderRadius: '8px' }}>
                    <span>Request Appointment</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </section>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .contact-split { grid-template-columns: 1fr !important; gap: 32px !important; }
          .form-row-mobile { grid-template-columns: 1fr !important; gap: 14px !important; }
        }
      `}</style>
    </div>
  );
};
