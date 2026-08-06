import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Clock, Video, UserCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Property } from '../context/AppContext';

interface BookViewingModalProps {
  isOpen?: boolean;
  property?: Property;
  propertyId?: string;
  propertyTitle?: string;
  propertyAddress?: string;
  onClose: () => void;
}

export const BookViewingModal: React.FC<BookViewingModalProps> = ({
  isOpen = true,
  property,
  propertyId,
  propertyTitle,
  propertyAddress,
  onClose
}) => {
  const { user, setCurrentPage, bookViewing, showToast } = useApp();
  const modalRef = useRef<HTMLDivElement>(null);

  const targetId = propertyId || property?.id || '1';
  const targetTitle = propertyTitle || property?.title || 'Luxury Estate';
  const targetAddress = propertyAddress || property?.address || 'Toronto, ON';
  const agentName = property?.agent?.name || 'Sébastien LeClerc';
  const agentPhone = property?.agent?.phone || '+1 (604) 555-0199';

  const [date, setDate] = useState('2026-08-05');
  const [time, setTime] = useState('11:00 AM');
  const [tourType, setTourType] = useState<'in-person' | 'virtual'>('in-person');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Prevent background scrolling and handle Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (isOpen === false) return null;

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Please sign in to schedule a private property viewing.', 'warning');
      setCurrentPage('auth');
      onClose();
      return;
    }

    bookViewing({
      propertyId: targetId,
      date,
      time,
      tourType,
      agentName,
      agentPhone,
      notes: notes || 'Looking forward to touring this property.',
      meetingLocation: tourType === 'in-person' ? targetAddress : 'Private HD Video Stream Link'
    });

    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2400);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(12px)',
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
        ref={modalRef}
        className="book-viewing-modal-container"
        onClick={e => e.stopPropagation()}
      >
        {/* Header - Fixed Top Section */}
        <div className="modal-header-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(109,91,255,0.25) 0%, rgba(138,99,255,0.25) 100%)',
                border: '1px solid rgba(167,139,250,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#a78bfa',
                flexShrink: 0
              }}
            >
              <Calendar size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', lineHeight: '1.2' }}>
                Schedule Private Viewing
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Reserve a VIP tour with senior advisor {agentName}
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.2s ease'
            }}
            aria-label="Close modal"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body Content Area - Scrollable */}
        <div className="modal-body-content">
          {submitted ? (
            <div style={{ padding: '24px 12px', textAlign: 'center' }} className="fade-in">
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
                  margin: '0 auto 16px auto'
                }}
              >
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                Viewing Confirmed
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '400px', margin: '0 auto 16px auto', lineHeight: '1.5' }}>
                Your private tour request for <strong style={{ color: '#ffffff' }}>{targetTitle}</strong> has been confirmed and logged in your calendar.
              </p>
              <span
                style={{
                  display: 'inline-block',
                  padding: '8px 18px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  background: 'rgba(167, 139, 250, 0.12)',
                  border: '1px solid rgba(167, 139, 250, 0.3)',
                  color: '#a78bfa'
                }}
              >
                {date} at {time} ({tourType === 'in-person' ? 'In-Person' : 'Virtual'})
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Compact Property Card */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  minHeight: '64px'
                }}
              >
                <img
                  src={property?.imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80'}
                  alt={targetTitle}
                  style={{ width: '60px', height: '48px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {targetTitle}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {targetAddress}
                  </p>
                </div>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#a78bfa', flexShrink: 0, paddingLeft: '6px' }}>
                  {property?.price ? `$${property.price.toLocaleString()}` : 'Inquire Price'}
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Tour Type Selection */}
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 500, color: '#ffffff', display: 'block', marginBottom: '8px' }}>
                    Experience Format
                  </label>
                  <div className="modal-experience-grid">
                    <button
                      type="button"
                      onClick={() => setTourType('in-person')}
                      style={{
                        height: '42px',
                        padding: '0 12px',
                        borderRadius: '10px',
                        border: tourType === 'in-person' ? '1px solid #a78bfa' : '1px solid rgba(255, 255, 255, 0.08)',
                        background: tourType === 'in-person' ? 'rgba(167, 139, 250, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                        color: tourType === 'in-person' ? '#ffffff' : 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontSize: '0.85rem',
                        fontWeight: tourType === 'in-person' ? 600 : 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        width: '100%'
                      }}
                    >
                      <UserCheck size={16} style={{ color: tourType === 'in-person' ? '#a78bfa' : 'inherit', flexShrink: 0 }} />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>In-Person Walkthrough</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTourType('virtual')}
                      style={{
                        height: '42px',
                        padding: '0 12px',
                        borderRadius: '10px',
                        border: tourType === 'virtual' ? '1px solid #a78bfa' : '1px solid rgba(255, 255, 255, 0.08)',
                        background: tourType === 'virtual' ? 'rgba(167, 139, 250, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                        color: tourType === 'virtual' ? '#ffffff' : 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontSize: '0.85rem',
                        fontWeight: tourType === 'virtual' ? 600 : 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        width: '100%'
                      }}
                    >
                      <Video size={16} style={{ color: tourType === 'virtual' ? '#a78bfa' : 'inherit', flexShrink: 0 }} />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Live 4K Virtual Stream</span>
                    </button>
                  </div>
                </div>

                {/* Date & Slot Inputs */}
                <div className="modal-form-row">
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 500, color: '#ffffff', display: 'block', marginBottom: '8px' }}>
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      required
                      style={{
                        height: '42px',
                        width: '100%',
                        padding: '0 12px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        fontSize: '0.88rem',
                        outline: 'none',
                        colorScheme: 'dark'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 500, color: '#ffffff', display: 'block', marginBottom: '8px' }}>
                      Preferred Slot
                    </label>
                    <select
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      style={{
                        height: '42px',
                        width: '100%',
                        padding: '0 12px',
                        borderRadius: '10px',
                        background: '#0B1220',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        fontSize: '0.88rem',
                        outline: 'none'
                      }}
                    >
                      <option value="09:30 AM">09:30 AM (Morning Key)</option>
                      <option value="11:00 AM">11:00 AM (Golden Daylight)</option>
                      <option value="02:00 PM">02:00 PM (Afternoon Peak)</option>
                      <option value="05:30 PM">05:30 PM (Sunset Dusk)</option>
                    </select>
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 500, color: '#ffffff', display: 'block', marginBottom: '8px' }}>
                    Requirements or Special Questions
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="e.g. Interested in seeing the basement suite and wine cellar..."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      outline: 'none',
                      resize: 'none'
                    }}
                  />
                </div>

                {/* Confirm Button */}
                <button
                  type="submit"
                  style={{
                    height: '46px',
                    width: '100%',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #6D5BFF 0%, #8A63FF 100%)',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(109, 91, 255, 0.35)',
                    marginTop: '4px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(109, 91, 255, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(109, 91, 255, 0.35)';
                  }}
                >
                  <Clock size={18} />
                  <span>Confirm & Lock Appointment</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Responsive CSS styles scoped to this modal */}
        <style>{`
          .book-viewing-modal-container {
            width: 90%;
            max-width: 720px;
            max-height: 90vh;
            background: #0B1220;
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 25px 70px rgba(0, 0, 0, 0.85);
            position: relative;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            animation: modal-pop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          .modal-header-section {
            padding: 20px 24px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            flex-shrink: 0;
            background: rgba(11, 18, 32, 0.98);
          }

          .modal-body-content {
            padding: 20px 24px;
            overflow-y: auto;
            flex: 1;
          }

          .modal-experience-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .modal-form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }

          @keyframes modal-pop {
            0% {
              opacity: 0;
              transform: scale(0.95) translateY(10px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          /* Tablet Responsive Styles (1024px to 768px) */
          @media (max-width: 1024px) {
            .book-viewing-modal-container {
              width: 90%;
              max-width: 680px;
              max-height: 90vh;
            }
          }

          /* Mobile Responsive Styles (Under 600px) */
          @media (max-width: 600px) {
            .book-viewing-modal-container {
              width: 95%;
              max-width: 420px;
              max-height: 92vh;
              border-radius: 16px;
            }

            .modal-header-section {
              padding: 16px 18px;
            }

            .modal-body-content {
              padding: 16px 18px;
            }

            .modal-form-row {
              grid-template-columns: 1fr;
              gap: 12px;
            }

            .modal-experience-grid {
              grid-template-columns: 1fr 1fr;
              gap: 8px;
            }
          }

          /* Ultra Small Mobile (Under 380px) */
          @media (max-width: 380px) {
            .modal-experience-grid {
              grid-template-columns: 1fr;
              gap: 8px;
            }
          }
        `}</style>
      </div>
    </div>
  );
};
