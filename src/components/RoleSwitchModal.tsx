import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, LogOut, X } from 'lucide-react';

export const RoleSwitchModal: React.FC = () => {
  const { roleSwitchModal, closeRoleSwitchModal, confirmRoleSwitch } = useApp();

  if (!roleSwitchModal.isOpen) return null;

  const currentRoleTitle = roleSwitchModal.currentRole
    ? roleSwitchModal.currentRole.toUpperCase()
    : 'USER';
  const targetRoleTitle = roleSwitchModal.targetRole
    ? roleSwitchModal.targetRole.toUpperCase()
    : 'ANOTHER PORTAL';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={closeRoleSwitchModal}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '32px',
          borderRadius: '24px',
          border: '1px solid var(--glass-border-hover)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={closeRoleSwitchModal}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444'
            }}
          >
            <ShieldAlert size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Role Switch Protection
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', marginTop: '2px' }}>
              Portal Access Restricted
            </h3>
          </div>
        </div>

        <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            You are currently logged in as a <strong style={{ color: '#ffffff' }}>{currentRoleTitle}</strong>.
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.5' }}>
            Please log out of your current session before accessing the <strong style={{ color: 'var(--color-lavender)' }}>{targetRoleTitle}</strong> portal.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button
            onClick={closeRoleSwitchModal}
            className="btn btn-secondary"
            style={{ flex: 1, padding: '12px', fontSize: '0.88rem', borderRadius: '12px' }}
          >
            Cancel
          </button>
          <button
            onClick={confirmRoleSwitch}
            className="btn btn-primary"
            style={{
              flex: 1.2,
              padding: '12px',
              fontSize: '0.88rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              border: 'none',
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
            }}
          >
            <LogOut size={16} />
            <span>Logout & Continue</span>
          </button>
        </div>
      </div>
    </div>
  );
};
