import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  ArrowLeft, 
  CheckCircle2, 
  MapPin, 
  ShieldCheck, 
  Video, 
  Home, 
  Lock
} from 'lucide-react';

export const ScheduleViewingPage: React.FC = () => {
  const { 
    selectedPropertyId, 
    properties, 
    setCurrentPage, 
    user, 
    showToast 
  } = useApp();

  const property = properties.find(p => p.id === selectedPropertyId) || properties[0];

  const [tourType, setTourType] = useState<'in-person' | 'virtual'>('in-person');
  const [selectedDate, setSelectedDate] = useState('2026-08-05');
  const [selectedSlot, setSelectedSlot] = useState('11:00 AM');
  const [fullName, setFullName] = useState(user?.name || 'Laurent de Bourgeois');
  const [email, setEmail] = useState(user?.email || 'buyer@novaestate.ca');
  const [phone, setPhone] = useState('+1 (416) 555-0199');
  const [specialNotes, setSpecialNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const availableSlots = ['09:30 AM', '11:00 AM', '01:30 PM', '03:30 PM', '05:30 PM'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    showToast(`Private viewing confirmed for ${property.title} on ${selectedDate} at ${selectedSlot}!`, 'success');
  };

  const handleReturnToProperty = () => {
    setCurrentPage('property-detail');
  };

  return (
    <div className="fade-in" style={{ paddingTop: '20px', paddingBottom: '60px', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        
        {/* Navigation Breadcrumb */}
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
            <span className="badge badge-lavender">DISCREET BOOKING</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              MLS® #{property.mlsNumber || `N${property.id}`}
            </span>
          </div>
        </div>

        {/* Page Header Banner */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Schedule Private <span className="text-gradient-electric">Viewing</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
            Reserve an exclusive, non-public walkthrough with our Senior Regional Partner.
          </p>
        </div>

        {/* Main 2-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '28px', alignItems: 'start' }}>
          
          {/* Left Column: Form / Confirmation */}
          <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* 1. Tour Format Selection */}
                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-lavender)', marginBottom: '10px', display: 'block' }}>
                    1. Tour Format & Experience
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setTourType('in-person')}
                      style={{
                        padding: '16px',
                        borderRadius: '12px',
                        background: tourType === 'in-person' ? 'rgba(167, 139, 250, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                        border: tourType === 'in-person' ? '1.5px solid var(--color-lavender)' : '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'var(--transition-fast)'
                      }}
                    >
                      <Home size={22} style={{ color: tourType === 'in-person' ? 'var(--color-lavender)' : 'var(--text-secondary)' }} />
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: tourType === 'in-person' ? '#ffffff' : 'var(--text-primary)' }}>
                          In-Person Walkthrough
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>On-site private tour</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTourType('virtual')}
                      style={{
                        padding: '16px',
                        borderRadius: '12px',
                        background: tourType === 'virtual' ? 'rgba(167, 139, 250, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                        border: tourType === 'virtual' ? '1.5px solid var(--color-lavender)' : '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'var(--transition-fast)'
                      }}
                    >
                      <Video size={22} style={{ color: tourType === 'virtual' ? 'var(--color-lavender)' : 'var(--text-secondary)' }} />
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: tourType === 'virtual' ? '#ffffff' : 'var(--text-primary)' }}>
                          Live 4K Virtual Stream
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Encrypted video walkthrough</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 2. Date & Time Selection */}
                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-lavender)', marginBottom: '10px', display: 'block' }}>
                    2. Preferred Schedule & Time Slot
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Date</span>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={e => setSelectedDate(e.target.value)}
                          className="form-input"
                          style={{ paddingLeft: '40px', fontSize: '0.85rem' }}
                          required
                        />
                        <Calendar size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-secondary)' }} />
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Time Slot</span>
                      <div style={{ position: 'relative' }}>
                        <select
                          value={selectedSlot}
                          onChange={e => setSelectedSlot(e.target.value)}
                          className="form-input"
                          style={{ paddingLeft: '40px', fontSize: '0.85rem', cursor: 'pointer' }}
                        >
                          {availableSlots.map(slot => (
                            <option key={slot} value={slot} style={{ background: '#0b1220', color: '#ffffff' }}>
                              {slot}
                            </option>
                          ))}
                        </select>
                        <Clock size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-secondary)' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Contact & Access Details */}
                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-lavender)', marginBottom: '10px', display: 'block' }}>
                    3. Contact & Access Details
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        placeholder="Full Legal Name"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: '40px', fontSize: '0.85rem' }}
                        required
                      />
                      <User size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-secondary)' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="email"
                          placeholder="Email Address"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="form-input"
                          style={{ paddingLeft: '40px', fontSize: '0.85rem' }}
                          required
                        />
                        <Mail size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-secondary)' }} />
                      </div>

                      <div style={{ position: 'relative' }}>
                        <input
                          type="tel"
                          placeholder="Direct Phone Number"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          className="form-input"
                          style={{ paddingLeft: '40px', fontSize: '0.85rem' }}
                          required
                        />
                        <Phone size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-secondary)' }} />
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Special Notes or Access Instructions (Optional)</span>
                      <textarea
                        rows={3}
                        placeholder="e.g., Helicopter landing pad access, non-disclosure requirements, or architectural specific interest..."
                        value={specialNotes}
                        onChange={e => setSpecialNotes(e.target.value)}
                        className="form-input"
                        style={{ padding: '12px', fontSize: '0.85rem', resize: 'vertical' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  className="btn btn-primary hover-lift"
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    background: 'linear-gradient(135deg, var(--color-lavender) 0%, var(--color-blue-primary) 100%)',
                    boxShadow: '0 4px 20px rgba(109, 91, 255, 0.35)'
                  }}
                >
                  <Lock size={18} />
                  <span>Confirm & Lock Viewing Appointment</span>
                </button>
              </form>
            ) : (
              /* Confirmation Screen */
              <div style={{ textAlign: 'center', padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                  <CheckCircle2 size={36} />
                </div>

                <span className="badge badge-lavender">APPOINTMENT RESERVED</span>
                
                <h2 style={{ fontSize: '1.6rem', fontWeight: 600, color: '#ffffff' }}>Viewing Confirmed</h2>
                
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '420px', lineHeight: '1.5' }}>
                  Your private viewing for <strong style={{ color: '#ffffff' }}>{property.title}</strong> has been secured for <strong style={{ color: 'var(--color-lavender)' }}>{selectedDate} at {selectedSlot}</strong>.
                </p>

                <div className="glass-panel" style={{ width: '100%', padding: '16px 20px', borderRadius: '12px', textAlign: 'left', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Format:</span>
                    <span style={{ color: '#ffffff', fontWeight: 600 }}>{tourType === 'in-person' ? 'In-Person Walkthrough' : 'Live 4K Virtual Stream'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Location:</span>
                    <span style={{ color: '#ffffff', fontWeight: 500 }}>{property.address}, {property.city}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Listing Agent:</span>
                    <span style={{ color: '#ffffff', fontWeight: 500 }}>{property.agent ? property.agent.name : 'Sébastien LeClerc'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px', width: '100%' }}>
                  <button
                    onClick={() => setCurrentPage('dashboard-buyer')}
                    className="btn btn-primary hover-lift"
                    style={{ flex: 1, padding: '12px', fontSize: '0.85rem', borderRadius: '10px' }}
                  >
                    View in Buyer Workspace
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

          {/* Right Column: Property Summary & Concierge Guarantee Card */}
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

            {/* Listing Partner Card */}
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Listing Director</span>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '10px' }}>
                <img
                  src={property.agent ? property.agent.avatar : 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80'}
                  alt={property.agent ? property.agent.name : 'Sébastien LeClerc'}
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--color-lavender)' }}
                />
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#ffffff' }}>
                    {property.agent ? property.agent.name : 'Sébastien LeClerc'}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Senior Managing Director</p>
                </div>
              </div>
            </div>

            {/* Security Guarantee Box */}
            <div className="glass-panel" style={{ padding: '16px', borderRadius: '14px', background: 'rgba(167, 139, 250, 0.05)', border: '1px solid rgba(167, 139, 250, 0.15)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <ShieldCheck size={18} style={{ color: 'var(--color-lavender)', flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>
                <strong style={{ color: '#ffffff' }}>Private Access Standard:</strong> All viewing appointments are strictly non-public. Your identity is held under non-disclosure protocols.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
