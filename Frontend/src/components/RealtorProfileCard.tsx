import React from 'react';
import { Phone, Mail, MapPin, Clock, Award, ShieldCheck, Building2 } from 'lucide-react';

interface RealtorProfileCardProps {
  compact?: boolean;
  className?: string;
}

export const RealtorProfileCard: React.FC<RealtorProfileCardProps> = ({ compact = false, className = '' }) => {
  return (
    <div
      className={`glass-panel ${className}`}
      style={{
        background: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)',
        padding: compact ? '24px' : '32px',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Top Royal LePage Accent Strip */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: 'linear-gradient(90deg, #E31837 0%, #111827 100%)'
        }}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: compact ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '28px',
          alignItems: 'center'
        }}
      >
        {/* Left Column: Karan Kang Headshot Photo & Badge */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div
            style={{
              position: 'relative',
              width: compact ? '140px' : '180px',
              height: compact ? '140px' : '180px',
              borderRadius: '50%',
              padding: '4px',
              background: 'linear-gradient(135deg, #E31837 0%, #111827 100%)',
              marginBottom: '16px',
              boxShadow: '0 10px 25px rgba(227, 24, 55, 0.2)'
            }}
          >
            <img
              src="/karan-kang.jpg"
              alt="Karan Kang REALTOR®"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                objectPosition: 'center top',
                border: '3px solid #ffffff'
              }}
            />

            <div
              style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                background: '#E31837',
                color: '#ffffff',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
              }}
              title="Verified Royal LePage Agent"
            >
              <ShieldCheck size={18} />
            </div>
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827', marginBottom: '2px' }}>
            Karan Kang
          </h3>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(227, 24, 55, 0.08)',
              color: '#E31837',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '10px'
            }}
          >
            <Award size={14} /> REALTOR®
          </div>

          {/* Brokerage Logo Image */}
          <img
            src="/royal-lepage-logo.jpg"
            alt="Royal LePage Pinnacle Real Estate"
            style={{
              height: '32px',
              width: 'auto',
              objectFit: 'contain',
              marginBottom: '4px'
            }}
          />

          <div style={{ fontSize: '0.78rem', color: '#6b7280', fontStyle: 'italic' }}>
            Independently Owned and Operated Brokerage
          </div>
        </div>

        {/* Right Column: Contact Details Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={18} style={{ color: '#E31837' }} /> Contact &amp; Office Info
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Direct line to Oakville &amp; GTA Canadian Real Estate Services
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {/* Cell Phone */}
            <a
              href="tel:4379985873"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                borderRadius: '12px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
              className="hover-lift"
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(227, 24, 55, 0.1)', color: '#E31837', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Phone size={18} style={{ margin: 'auto' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Cell Phone
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#111827' }}>
                  437-998-5873
                </div>
              </div>
            </a>

            {/* Office Phone */}
            <a
              href="tel:9054643035"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                borderRadius: '12px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
              className="hover-lift"
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f1f5f9', color: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Phone size={18} style={{ margin: 'auto' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Office Phone
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#111827' }}>
                  905-464-3035
                </div>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:realtorkarankang@gmail.com"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                borderRadius: '12px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                textDecoration: 'none',
                gridColumn: '1 / -1',
                transition: 'all 0.2s ease'
              }}
              className="hover-lift"
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(227, 24, 55, 0.1)', color: '#E31837', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={18} style={{ margin: 'auto' }} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Direct Email
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  realtorkarankang@gmail.com
                </div>
              </div>
            </a>

            {/* Office Address */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px',
                borderRadius: '12px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                gridColumn: '1 / -1'
              }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f1f5f9', color: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={18} style={{ margin: 'auto' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Oakville Office Address
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1e293b', lineHeight: '1.3' }}>
                  17 - 1075 North Service Road W., Oakville, ON L6M 2G2
                </div>
              </div>
            </div>

            {/* Hours */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                borderRadius: '12px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                gridColumn: '1 / -1'
              }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f1f5f9', color: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Clock size={18} style={{ margin: 'auto' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Working Hours
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1e293b' }}>
                  6:00 AM – 10:00 PM <span style={{ color: '#E31837', fontWeight: 700, marginLeft: '6px' }}>(Weekends Off)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
