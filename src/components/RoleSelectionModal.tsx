import React, { useState } from 'react';
import { Search, Building, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Logo } from '../design-system/BrandAssets';

interface RoleSelectionModalProps {
  isOpen: boolean;
  userName?: string;
  userEmail?: string;
  userPhoto?: string;
  onSelectRole: (role: 'buyer' | 'seller') => Promise<void> | void;
  onClose?: () => void;
}

export const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  isOpen,
  userName = 'Valued Client',
  userEmail = '',
  userPhoto,
  onSelectRole
}) => {
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller'>('buyer');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onSelectRole(selectedRole);
    } catch (err) {
      console.error('Error setting role:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(12px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      className="fade-in"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '36px',
          borderRadius: '24px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <Logo size={42} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
            {userPhoto ? (
              <img src={userPhoto} alt={userName} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #0f172a' }} />
            ) : (
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {userName.charAt(0)}
              </div>
            )}
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', lineHeight: '1.2' }}>{userName}</p>
              <p style={{ fontSize: '0.78rem', color: '#64748b' }}>{userEmail}</p>
            </div>
          </div>

          <div style={{ marginTop: '8px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-display)' }}>
              Select Your Portal Account Role
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
              To personalize your workspace, please choose how you will be using Kang Homes.
            </p>
          </div>
        </div>

        {/* Role Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Option 1: Buyer */}
          <div
            onClick={() => setSelectedRole('buyer')}
            style={{
              padding: '20px',
              borderRadius: '16px',
              border: selectedRole === 'buyer' ? '2.5px solid #0f172a' : '1.5px solid #cbd5e1',
              background: selectedRole === 'buyer' ? '#f8fafc' : '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              transition: 'all 0.2s ease',
              boxShadow: selectedRole === 'buyer' ? '0 4px 16px rgba(15, 23, 42, 0.08)' : 'none'
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: selectedRole === 'buyer' ? '#0f172a' : '#f1f5f9',
                color: selectedRole === 'buyer' ? '#ffffff' : '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Search size={22} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>Buyer Account</h3>
                {selectedRole === 'buyer' && <CheckCircle2 size={20} style={{ color: '#0f172a' }} />}
              </div>
              <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: '4px', lineHeight: '1.4' }}>
                Browse MLS properties, save homes, track price drop alerts, schedule private viewing tours, and submit purchase offers.
              </p>
            </div>
          </div>

          {/* Option 2: Seller / Agent */}
          <div
            onClick={() => setSelectedRole('seller')}
            style={{
              padding: '20px',
              borderRadius: '16px',
              border: selectedRole === 'seller' ? '2.5px solid #0f172a' : '1.5px solid #cbd5e1',
              background: selectedRole === 'seller' ? '#f8fafc' : '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              transition: 'all 0.2s ease',
              boxShadow: selectedRole === 'seller' ? '0 4px 16px rgba(15, 23, 42, 0.08)' : 'none'
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: selectedRole === 'seller' ? '#0f172a' : '#f1f5f9',
                color: selectedRole === 'seller' ? '#ffffff' : '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Building size={22} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>Agent / Seller Account</h3>
                {selectedRole === 'seller' && <CheckCircle2 size={20} style={{ color: '#0f172a' }} />}
              </div>
              <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: '4px', lineHeight: '1.4' }}>
                Request instant AI home valuations, list properties, track listing performance, and manage client consultations.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="btn btn-primary hover-lift"
          style={{
            width: '100%',
            height: '48px',
            fontSize: '0.95rem',
            fontWeight: 800,
            borderRadius: '12px',
            background: '#0f172a',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          {isSubmitting ? (
            <span>Processing...</span>
          ) : (
            <>
              <span>Continue to {selectedRole === 'buyer' ? 'Buyer Dashboard' : 'Agent Dashboard'}</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
