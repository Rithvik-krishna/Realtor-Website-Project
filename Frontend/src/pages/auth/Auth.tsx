import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../../design-system/BrandAssets';
import { KeyRound, Mail, ArrowRight, ArrowLeft, Sparkles, Building, Briefcase, Phone, User, CheckSquare, Square, Search, ShieldCheck } from 'lucide-react';

interface AuthProps {
  initialMode?: 'login' | 'register' | 'forgot' | 'admin-login' | 'admin-register';
  initialRole?: 'buyer' | 'seller' | 'admin';
}

export const Auth: React.FC<AuthProps> = ({ initialMode = 'login', initialRole = 'buyer' }) => {
  const { login, register, showToast, pendingSearchFilters, pendingValuationData } = useApp();

  // Auth states: 'login' | 'register' | 'forgot' | 'admin-login' | 'admin-register'
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'admin-login' | 'admin-register'>(initialMode);
  
  // Inputs state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller' | 'admin'>(initialRole);

  React.useEffect(() => {
    if (initialRole) {
      setSelectedRole(initialRole);
    }
  }, [initialRole]);

  // Standard Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    let roleToLog = selectedRole;
    if (email.toLowerCase().includes('admin')) roleToLog = 'admin';
    else if (email.toLowerCase().includes('seller')) roleToLog = 'seller';

    let derivedName = '';
    if (email.includes('@')) {
      const username = email.split('@')[0];
      derivedName = username.split(/[\._]/).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
    }

    login(roleToLog, undefined, { name: derivedName, email });
  };

  // Dedicated Admin Login Submit
  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    let derivedName = fullName;
    if (!derivedName && email.includes('@')) {
      const username = email.split('@')[0];
      derivedName = username.split(/[\._]/).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
    }
    login('admin', 'dashboard-admin', { name: derivedName, email });
  };

  // Standard Register Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName) return;
    if (password && confirmPassword && password !== confirmPassword) {
      showToast('Passwords do not match. Please verify your password.', 'warning');
      return;
    }
    if (!agreeTerms) {
      showToast('Please accept the Terms of Service & Privacy Policy.', 'warning');
      return;
    }

    const nameToRegister = `${firstName} ${lastName}`.trim();
    register({
      name: nameToRegister,
      email,
      phone,
      role: selectedRole
    });
  };

  // Dedicated Admin Register Submit
  const handleAdminRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName) {
      showToast('Please provide your Full Name and Email Address.', 'warning');
      return;
    }
    if (password && confirmPassword && password !== confirmPassword) {
      showToast('Passwords do not match. Please verify password entry.', 'warning');
      return;
    }
    if (!agreeTerms) {
      showToast('Please accept the Terms of Service & Privacy Policy.', 'warning');
      return;
    }

    // Do NOT automatically log in. Redirect to Admin Login page so user enters credentials manually.
    showToast('Admin account created successfully! Please sign in with your credentials.', 'success');
    setMode('admin-login');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    showToast('Secure password-reset link dispatched to your email.', 'success');
    setMode('login');
  };

  const isAdminFlow = mode === 'admin-login' || mode === 'admin-register';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        zIndex: 5
      }}
      className="fade-in"
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: isAdminFlow ? '520px' : '480px',
          padding: '36px',
          borderRadius: '24px',
          border: '1px solid rgba(167, 139, 250, 0.25)',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.75), 0 0 40px rgba(167, 139, 250, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Logo size={42} />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            {isAdminFlow ? 'Kang Homes Enterprise Admin Gateway' : 'Kang Homes Portal'}
          </span>
        </div>

        {/* Saved Valuation Details Alert Banner */}
        {pendingValuationData && !isAdminFlow && (
          <div 
            style={{ 
              background: 'rgba(167, 139, 250, 0.12)', 
              border: '1px solid rgba(167, 139, 250, 0.3)', 
              padding: '12px 16px', 
              borderRadius: '14px', 
              display: 'flex', 
              gap: '10px', 
              alignItems: 'center' 
            }}
          >
            <Sparkles size={18} style={{ color: 'var(--color-lavender)', flexShrink: 0 }} />
            <div style={{ fontSize: '0.78rem', color: '#0f172a' }}>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>Valuation Captured!</span> Sign in or create an account to view your AI Valuation Report for <strong style={{ color: '#0f172a' }}>{pendingValuationData.address}</strong>.
            </div>
          </div>
        )}

        {/* Saved Search Criteria Alert Banner */}
        {pendingSearchFilters && !isAdminFlow && (
          <div 
            style={{ 
              background: 'rgba(167, 139, 250, 0.12)', 
              border: '1px solid rgba(167, 139, 250, 0.3)', 
              padding: '12px 16px', 
              borderRadius: '14px', 
              display: 'flex', 
              gap: '10px', 
              alignItems: 'center' 
            }}
          >
            <Search size={18} style={{ color: 'var(--color-lavender)', flexShrink: 0 }} />
            <div style={{ fontSize: '0.78rem', color: '#0f172a' }}>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>Search Saved!</span> Sign in or create an account to automatically restore your search results.
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 1. DEDICATED ADMIN LOGIN PAGE */}
        {/* ========================================================================= */}
        {mode === 'admin-login' && (
          <form onSubmit={handleAdminLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: 'rgba(167, 139, 250, 0.15)', border: '1px solid rgba(167, 139, 250, 0.3)', borderRadius: '20px', color: 'var(--color-lavender)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '8px' }}>
                <ShieldCheck size={14} />
                <span>ADMINISTRATOR ACCESS</span>
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>Admin Portal Login</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '4px' }}>
                Enterprise CRM, user management, and property registry controls
              </p>
            </div>

            {/* Email Field */}
            <div className="form-input-container">
              <label className="form-label" style={{ fontSize: '0.65rem' }}>Admin Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="admin@novaestate.ca"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '40px', fontSize: '0.85rem' }}
                  required
                />
                <Mail size={15} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-secondary)' }} />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-input-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" style={{ fontSize: '0.65rem' }}>Password</label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  style={{ background: 'none', border: 'none', color: 'var(--color-lavender)', fontSize: '0.72rem', cursor: 'pointer' }}
                >
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '40px', fontSize: '0.85rem' }}
                  required
                />
                <KeyRound size={15} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-secondary)' }} />
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setRememberMe(!rememberMe)}>
              {rememberMe ? (
                <CheckSquare size={16} style={{ color: 'var(--color-lavender)' }} />
              ) : (
                <Square size={16} style={{ color: 'var(--text-muted)' }} />
              )}
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Remember session on this device</span>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '0.9rem', borderRadius: '12px', marginTop: '6px' }}>
              <span>Sign In to Admin Console</span>
              <ArrowRight size={16} />
            </button>

            {/* Register Link */}
            <div style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', marginTop: '8px' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Don't have an Admin account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('admin-register')}
                  style={{ background: 'none', border: 'none', color: 'var(--color-lavender)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'underline' }}
                >
                  Register
                </button>
              </p>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* 2. DEDICATED ADMIN REGISTRATION PAGE */}
        {/* ========================================================================= */}
        {mode === 'admin-register' && (
          <form onSubmit={handleAdminRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: 'rgba(167, 139, 250, 0.15)', border: '1px solid rgba(167, 139, 250, 0.3)', borderRadius: '20px', color: 'var(--color-lavender)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '8px' }}>
                <Briefcase size={14} />
                <span>ENTERPRISE ONBOARDING</span>
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>Admin Registration</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '4px' }}>
                Create an authorized Administrator account
              </p>
            </div>

            {/* Full Name */}
            <div className="form-input-container">
              <label className="form-label" style={{ fontSize: '0.65rem' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Marcus Aurelius"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '38px', fontSize: '0.82rem' }}
                  required
                />
                <User size={14} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-secondary)' }} />
              </div>
            </div>

            {/* Email & Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-input-container">
                <label className="form-label" style={{ fontSize: '0.65rem' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    placeholder="admin@novaestate.ca"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '36px', fontSize: '0.82rem' }}
                    required
                  />
                  <Mail size={13} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-secondary)' }} />
                </div>
              </div>

              <div className="form-input-container">
                <label className="form-label" style={{ fontSize: '0.65rem' }}>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="tel"
                    placeholder="+1 (416) 555-0199"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '36px', fontSize: '0.82rem' }}
                    required
                  />
                  <Phone size={13} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-secondary)' }} />
                </div>
              </div>
            </div>

            {/* Company (Optional) */}
            <div className="form-input-container">
              <label className="form-label" style={{ fontSize: '0.65rem' }}>Company / Brokerage (Optional)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="NovaEstate Holdings Inc."
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '38px', fontSize: '0.82rem' }}
                />
                <Building size={14} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-secondary)' }} />
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-input-container">
                <label className="form-label" style={{ fontSize: '0.65rem' }}>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '0.82rem' }}
                  required
                />
              </div>

              <div className="form-input-container">
                <label className="form-label" style={{ fontSize: '0.65rem' }}>Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '0.82rem' }}
                  required
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '2px' }} onClick={() => setAgreeTerms(!agreeTerms)}>
              {agreeTerms ? (
                <CheckSquare size={16} style={{ color: 'var(--color-lavender)', flexShrink: 0 }} />
              ) : (
                <Square size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              )}
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                I accept the <span style={{ color: 'var(--color-lavender)' }}>Enterprise Terms of Service</span> & Privacy Policy
              </span>
            </div>

            {/* Create Admin Account Button */}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '0.9rem', borderRadius: '12px', marginTop: '6px' }}>
              <span>Create Account & Launch Dashboard</span>
              <ArrowRight size={16} />
            </button>

            {/* Back to Admin Login Link */}
            <div style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px', marginTop: '4px' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Already have an Admin account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('admin-login')}
                  style={{ background: 'none', border: 'none', color: 'var(--color-lavender)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'underline' }}
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* 3. STANDARD USER LOGIN MODE */}
        {/* ========================================================================= */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ textAlign: 'center', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#0f172a' }}>
                {selectedRole === 'admin' ? 'Sign In to Admin CRM Suite' : selectedRole === 'seller' ? 'Sign In to Seller Console' : 'Sign In to Buyer Portal'}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '4px' }}>
                {selectedRole === 'admin' ? 'Enterprise management, users, agents, and listing controls' : selectedRole === 'seller' ? 'Home valuation reports, evaluation appointments, and property analytics' : 'Access saved homes, tours, price alerts, and purchase tools'}
              </p>
            </div>

            {/* Persona Quick selectors */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span className="form-label" style={{ fontSize: '0.65rem' }}>Select Role Persona</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[
                  { id: 'buyer', icon: <Sparkles size={14} />, label: 'Buyer' },
                  { id: 'seller', icon: <Building size={14} />, label: 'Seller' },
                  { id: 'admin', icon: <Briefcase size={14} />, label: 'Admin' }
                ].map(role => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => {
                      if (role.id === 'admin') {
                        setMode('admin-login');
                      } else {
                        setSelectedRole(role.id as any);
                      }
                    }}
                    style={{
                      background: selectedRole === role.id ? 'rgba(15, 23, 42, 0.08)' : '#f8fafc',
                      border: `1px solid ${selectedRole === role.id ? '#0f172a' : '#cbd5e1'}`,
                      borderRadius: '8px',
                      padding: '8px',
                      color: '#0f172a',
                      fontSize: '0.75rem',
                      fontWeight: selectedRole === role.id ? 700 : 500,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    {role.icon}
                    <span>{role.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Email Field */}
            <div className="form-input-container">
              <label className="form-label" style={{ fontSize: '0.65rem' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '40px', fontSize: '0.85rem' }}
                  required
                />
                <Mail size={14} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-secondary)' }} />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-input-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" style={{ fontSize: '0.65rem' }}>Password</label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  style={{ background: 'none', border: 'none', color: 'var(--color-lavender)', fontSize: '0.72rem', cursor: 'pointer' }}
                >
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '40px', fontSize: '0.85rem' }}
                  required
                />
                <KeyRound size={14} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-secondary)' }} />
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setRememberMe(!rememberMe)}>
              {rememberMe ? (
                <CheckSquare size={16} style={{ color: 'var(--color-lavender)' }} />
              ) : (
                <Square size={16} style={{ color: 'var(--text-muted)' }} />
              )}
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Remember me on this device</span>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '0.85rem', marginTop: '6px' }}>
              <span>Sign In to Continue</span>
              <ArrowRight size={14} />
            </button>

            {/* Bottom Register Redirect Link */}
            <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode(selectedRole === 'admin' ? 'admin-register' : 'register')}
                style={{ background: 'none', border: 'none', color: 'var(--color-lavender)', cursor: 'pointer', fontWeight: 600 }}
              >
                Create your account
              </button>
            </p>
          </form>
        )}

        {/* ========================================================================= */}
        {/* 4. STANDARD USER REGISTER MODE */}
        {/* ========================================================================= */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#0f172a' }}>
                {selectedRole === 'seller' ? 'Create Seller Account' : 'Create Your Buyer Account'}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '4px' }}>Unlock full search results, saved homes, and tour booking</p>
            </div>

            {/* First Name & Last Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-input-container">
                <label className="form-label" style={{ fontSize: '0.65rem' }}>First Name</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '36px', fontSize: '0.82rem' }}
                    required
                  />
                  <User size={13} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-secondary)' }} />
                </div>
              </div>

              <div className="form-input-container">
                <label className="form-label" style={{ fontSize: '0.65rem' }}>Last Name</label>
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '0.82rem' }}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="form-input-container">
              <label className="form-label" style={{ fontSize: '0.65rem' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '36px', fontSize: '0.82rem' }}
                  required
                />
                <Mail size={13} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-secondary)' }} />
              </div>
            </div>

            {/* Phone Number Field */}
            <div className="form-input-container">
              <label className="form-label" style={{ fontSize: '0.65rem' }}>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  placeholder="+1 (416) 555-0199"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '36px', fontSize: '0.82rem' }}
                />
                <Phone size={13} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-secondary)' }} />
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-input-container">
                <label className="form-label" style={{ fontSize: '0.65rem' }}>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '0.82rem' }}
                  required
                />
              </div>

              <div className="form-input-container">
                <label className="form-label" style={{ fontSize: '0.65rem' }}>Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '0.82rem' }}
                  required
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '2px' }} onClick={() => setAgreeTerms(!agreeTerms)}>
              {agreeTerms ? (
                <CheckSquare size={16} style={{ color: 'var(--color-lavender)', flexShrink: 0 }} />
              ) : (
                <Square size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              )}
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                I accept the <span style={{ color: 'var(--color-lavender)' }}>Terms of Service</span> & Privacy Policy
              </span>
            </div>

            {/* Create Account Button */}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '0.85rem', marginTop: '6px' }}>
              <span>Create Account</span>
              <ArrowRight size={14} />
            </button>

            {/* Back to Login Link */}
            <button
              type="button"
              onClick={() => setMode('login')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                justifyContent: 'center',
                marginTop: '4px'
              }}
              className="hover-lift"
            >
              <ArrowLeft size={14} />
              <span>Already have an account? Sign In</span>
            </button>
          </form>
        )}

        {/* ========================================================================= */}
        {/* 5. FORGOT PASSWORD MODE */}
        {/* ========================================================================= */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#0f172a' }}>Retrieve Password</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '4px' }}>Enter your email address to receive password reset instructions</p>
            </div>

            <div className="form-input-container">
              <label className="form-label" style={{ fontSize: '0.65rem' }}>Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '0.85rem' }}>
              <span>Send Password Reset Link</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('login')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                justifyContent: 'center'
              }}
              className="hover-lift"
            >
              <ArrowLeft size={14} />
              <span>Back to Sign In</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
