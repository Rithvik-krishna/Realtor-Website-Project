import React, { useState } from 'react';
import { X, Copy, Check, Share2, Mail, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Property } from '../context/AppContext';

interface ShareModalProps {
  isOpen?: boolean;
  property?: Property;
  propertyTitle?: string;
  propertyUrl?: string;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen = true, property, propertyTitle, propertyUrl, onClose }) => {
  const { showToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (isOpen === false) return null;

  const title = propertyTitle || property?.title || 'Luxury Estate Showcase';
  const shareUrl = propertyUrl || (property ? `${window.location.origin}/#property-detail?id=${property.id}` : window.location.href);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    showToast('Listing link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      className="fade-in"
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '32px',
          borderRadius: '20px',
          border: '1px solid rgba(167, 139, 250, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: 'none',
            color: 'var(--text-muted)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          className="hover-lift"
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(167,139,250,0.2) 0%, rgba(37,99,235,0.2) 100%)',
              border: '1px solid rgba(167,139,250,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-lavender)'
            }}
          >
            <Share2 size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff' }}>Share Estate Listing</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Send this luxury property to partners or friends</p>
          </div>
        </div>

        {/* Property Card Strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '12px 16px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            marginBottom: '24px'
          }}
        >
          <img
            src={property?.imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80'}
            alt={title}
            style={{ width: '70px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
          />
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>{title}</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{property?.location || 'Toronto, ON'}</p>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-lavender)', marginTop: '2px' }}>
              {property?.price ? `$${property.price.toLocaleString()}` : 'Inquire Price'}
            </p>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
            Direct Share Link
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              readOnly
              value={shareUrl}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '10px',
                background: 'rgba(3,7,18,0.6)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#ffffff',
                fontSize: '0.82rem',
                outline: 'none'
              }}
            />
            <button
              onClick={handleCopy}
              className="btn btn-primary"
              style={{
                padding: '12px 20px',
                fontSize: '0.82rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <a
            href={`mailto:?subject=${encodeURIComponent(`Check out ${title}`)}&body=${encodeURIComponent(`Take a look at this luxury listing on NovaEstate: ${shareUrl}`)}`}
            className="btn btn-secondary hover-lift"
            style={{
              padding: '12px',
              fontSize: '0.82rem',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              textDecoration: 'none'
            }}
          >
            <Mail size={16} />
            <span>Send via Email</span>
          </a>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Check out ${title}: ${shareUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary hover-lift"
            style={{
              padding: '12px',
              fontSize: '0.82rem',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              textDecoration: 'none'
            }}
          >
            <MessageSquare size={16} />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
