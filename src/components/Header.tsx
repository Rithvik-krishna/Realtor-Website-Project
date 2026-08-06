import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../design-system/BrandAssets';
import { 
  Menu, X, LogOut, User, Bell, Settings, 
  Search, Building, Shield, LayoutDashboard, ArrowRight
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentPage, setCurrentPage, user, logout, triggerRoleSwitchWarning
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Lock body scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Dynamic nav links according to role
  const getNavLinks = () => {
    if (!user) {
      return [
        { id: 'home', label: 'Home' },
        { id: 'search', label: 'Buy' },
        { id: 'seller', label: 'Sell' },
        { id: 'community', label: 'Communities' },
        { id: 'featured', label: 'Featured' },
        { id: 'blog', label: 'Market Insights' },
        { id: 'contact', label: 'Contact' }
      ];
    }

    if (user.role === 'buyer') {
      return [
        { id: 'home', label: 'Home' },
        { id: 'search', label: 'Search' },
        { id: 'dashboard-buyer', label: 'Saved Homes', target: 'dashboard-buyer' },
        { id: 'dashboard-buyer', label: 'Buyer Dashboard', target: 'dashboard-buyer' },
        { id: 'contact', label: 'Contact' },
        { id: 'dashboard-buyer', label: 'Notifications', target: 'dashboard-buyer' }
      ];
    }

    if (user.role === 'seller') {
      return [
        { id: 'home', label: 'Home' },
        { id: 'home-valuation', label: 'Home Valuation' },
        { id: 'dashboard-seller', label: 'My Listings', target: 'dashboard-seller' },
        { id: 'dashboard-seller', label: 'Seller Dashboard', target: 'dashboard-seller' },
        { id: 'contact', label: 'Contact' },
        { id: 'dashboard-seller', label: 'Notifications', target: 'dashboard-seller' }
      ];
    }

    if (user.role === 'admin') {
      return [
        { id: 'dashboard-admin', label: 'Dashboard' },
        { id: 'dashboard-admin', label: 'Listings' },
        { id: 'dashboard-admin', label: 'Users' },
        { id: 'dashboard-admin', label: 'Agents' },
        { id: 'dashboard-admin', label: 'Appointments' },
        { id: 'dashboard-admin', label: 'Reports' },
        { id: 'dashboard-admin', label: 'Analytics' },
        { id: 'dashboard-admin', label: 'Settings' },
        { id: 'dashboard-admin', label: 'Notifications' }
      ];
    }

    return [];
  };

  const navLinks = getNavLinks();

  const handleNavClick = (pageId: string) => {
    setMobileMenuOpen(false);

    if (!user) {
      if (pageId === 'admin') {
        setCurrentPage('admin-login');
        return;
      }
      if (pageId === 'dashboard-seller' || pageId === 'seller-portal') {
        setCurrentPage('auth-seller');
        return;
      }
      if (pageId === 'dashboard-buyer' || pageId === 'buyer-portal') {
        setCurrentPage('auth-buyer');
        return;
      }
      setCurrentPage(pageId);
      return;
    }

    // Role-logged-in user handling
    if (pageId === 'buyer') {
      if (user.role === 'buyer') {
        setCurrentPage('dashboard-buyer');
      } else {
        triggerRoleSwitchWarning('buyer', 'dashboard-buyer');
      }
      return;
    }

    if (pageId === 'seller') {
      if (user.role === 'seller') {
        setCurrentPage('dashboard-seller');
      } else {
        triggerRoleSwitchWarning('seller', 'dashboard-seller');
      }
      return;
    }

    if (pageId === 'admin' || pageId === 'admin-login') {
      setCurrentPage('admin-login');
      return;
    }

    setCurrentPage(pageId);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(prev => !prev);
  };

  const handleAuthShortcut = (role: 'buyer' | 'seller' | 'admin') => {
    setProfileDropdownOpen(false);
    if (role === 'admin') {
      setCurrentPage('admin-login');
      return;
    }

    if (user) {
      if (user.role !== role) {
        triggerRoleSwitchWarning(role, `dashboard-${role}`);
      } else {
        setCurrentPage(`dashboard-${role}`);
      }
    } else {
      if (role === 'seller') {
        setCurrentPage('auth-seller');
      } else if (role === 'buyer') {
        setCurrentPage('auth-buyer');
      }
    }
  };

  return (
    <nav className="glass-navigation" style={{ height: '80px', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1000 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ cursor: 'pointer' }} onClick={() => handleNavClick('home')}>
            <Logo size={36} />
          </div>
        </div>

        {/* Desktop Dynamic Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="desktop-menu-only">
          <ul style={{ display: 'flex', listStyle: 'none', gap: '24px', alignItems: 'center' }}>
            {navLinks.map((link, idx) => {
              const isActive = currentPage === link.id;
              return (
                <li key={`${link.id}-${idx}`}>
                  <button
                    onClick={() => handleNavClick(link.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.88rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#E31837' : '#374151',
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)',
                      position: 'relative',
                      padding: '8px 0',
                    }}
                    className="hover-lift"
                  >
                    {link.label}
                    {isActive && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: '10%',
                          width: '80%',
                          height: '2px',
                          background: '#E31837',
                          borderRadius: '2px'
                        }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <div style={{ height: '20px', width: '1px', background: '#e2e8f0' }} />

          {/* Avatar Profile Icon */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={toggleProfileDropdown}
              aria-label="User Account Menu"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: user 
                  ? '#E31837' 
                  : '#f1f5f9',
                border: user 
                  ? '2px solid #E31837' 
                  : '1px solid #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: user ? '#ffffff' : '#334155',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
                boxShadow: user ? '0 2px 8px rgba(227, 24, 55, 0.3)' : 'none'
              }}
              className="hover-lift"
            >
              {user ? (
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                  {user.name.charAt(0)}
                </span>
              ) : (
                <User size={18} style={{ opacity: 0.8 }} />
              )}
            </button>

            {/* Compact Opaque Premium User Profile Dropdown */}
            {profileDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '52px',
                  right: 0,
                  width: '290px',
                  padding: '16px',
                  borderRadius: '16px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12)',
                  zIndex: 2000,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                {!user ? (
                  // UNAUTHENTICATED DROPDOWN OPTIONS
                  <>
                    <div style={{ paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                      <p style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '2px' }}>
                        Portal Account
                      </p>
                      <p style={{ fontSize: '13px', color: '#64748b' }}>
                        Sign in or register to manage portfolios
                      </p>
                    </div>

                    <button
                      onClick={() => { handleNavClick('auth'); setProfileDropdownOpen(false); }}
                      style={{
                        height: '46px',
                        width: '100%',
                        borderRadius: '12px',
                        background: '#0f172a',
                        color: '#ffffff',
                        fontWeight: 600,
                        fontSize: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 16px',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)',
                        margin: '2px 0'
                      }}
                    >
                      <span>Sign In / Register</span>
                      <ArrowRight size={18} />
                    </button>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {[
                        { label: 'Buyer Portal', role: 'buyer', icon: Search, color: '#4f46e5' },
                        { label: 'Seller Portal', role: 'seller', icon: Building, color: '#0284c7' },
                        { label: 'Admin Portal', role: 'admin', icon: Shield, color: '#E31837' }
                      ].map((item) => (
                        <button
                          key={item.role}
                          onClick={() => handleAuthShortcut(item.role as any)}
                          style={{
                            height: '44px',
                            width: '100%',
                            borderRadius: '10px',
                            padding: '0 12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            color: '#0f172a',
                            fontSize: '15px',
                            fontWeight: 600,
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <item.icon size={20} style={{ color: item.color }} />
                          <span style={{ color: '#0f172a' }}>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  // AUTHENTICATED DROPDOWN OPTIONS
                  <>
                    {/* Header */}
                    <div style={{ paddingBottom: '10px', borderBottom: '1px solid #e2e8f0' }}>
                      <p style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '2px', lineHeight: '1.2' }}>
                        {user.name}
                      </p>
                      <p style={{ fontSize: '14px', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>
                        {user.email}
                      </p>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 12px',
                          borderRadius: '16px',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          background: '#0f172a',
                          color: '#ffffff',
                          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.2)'
                        }}
                      >
                        {user.role} ACCOUNT
                      </span>
                    </div>

                    {/* Standalone Primary Dashboard Button */}
                    <button
                      onClick={() => { handleNavClick(`dashboard-${user.role}`); setProfileDropdownOpen(false); }}
                      style={{
                        height: '46px',
                        width: '100%',
                        borderRadius: '12px',
                        background: '#0f172a',
                        color: '#ffffff',
                        fontWeight: 600,
                        fontSize: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 16px',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)',
                        margin: '4px 0 2px 0'
                      }}
                    >
                      <span>Enter {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard</span>
                      <ArrowRight size={18} />
                    </button>

                    {/* Menu Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {[
                        { label: 'Profile', icon: User, iconColor: '#0f172a' },
                        { label: 'My Dashboard', icon: LayoutDashboard, iconColor: '#4f46e5' },
                        { label: 'Notifications', icon: Bell, iconColor: '#0284c7' },
                        { label: 'Settings', icon: Settings, iconColor: '#64748b' }
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => { handleNavClick(`dashboard-${user.role}`); setProfileDropdownOpen(false); }}
                          style={{
                            height: '44px',
                            width: '100%',
                            borderRadius: '10px',
                            padding: '0 12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            color: '#0f172a',
                            fontSize: '15px',
                            fontWeight: 600,
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <item.icon size={20} style={{ color: item.iconColor }} />
                          <span style={{ color: '#0f172a' }}>{item.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Logout Button Section */}
                    <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '8px', marginTop: '2px' }}>
                      <button
                        onClick={() => { logout(); setProfileDropdownOpen(false); }}
                        style={{
                          height: '44px',
                          width: '100%',
                          borderRadius: '10px',
                          padding: '0 12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          color: '#ef4444',
                          fontSize: '15px',
                          fontWeight: 500,
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <LogOut size={20} style={{ color: '#ef4444' }} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Hamburger toggle */}
        <button
          className="mobile-toggle-only"
          onClick={() => setMobileMenuOpen(prev => !prev)}
          style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', display: 'none' }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          {/* Dark Backdrop Overlay */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(2px)',
              zIndex: 2999,
              transition: 'opacity 0.25s ease-in-out'
            }}
          />

          {/* Solid Mobile Side Drawer */}
          <aside
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: 'min(88vw, 360px)',
              height: '100vh',
              background: '#0B1220',
              color: '#ffffff',
              zIndex: 3000,
              boxShadow: '0 0 40px rgba(0,0,0,0.65)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              borderRight: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            {/* Drawer Top Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                background: '#0B1220',
                position: 'sticky',
                top: 0,
                zIndex: 10
              }}
            >
              <div onClick={() => { handleNavClick('home'); setMobileMenuOpen(false); }} style={{ cursor: 'pointer' }}>
                <Logo />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation & Portals Content */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Main Navigation
              </p>

              {navLinks.map((link) => {
                const isActive = currentPage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => { handleNavClick(link.id); setMobileMenuOpen(false); }}
                    style={{
                      height: '50px',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 12px',
                      borderRadius: '10px',
                      background: isActive ? 'rgba(167, 139, 250, 0.12)' : 'transparent',
                      color: isActive ? '#a78bfa' : '#ffffff',
                      fontSize: '16px',
                      fontWeight: isActive ? 600 : 500,
                      border: 'none',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{link.label}</span>
                    <ArrowRight size={16} style={{ opacity: isActive ? 1 : 0.4, color: isActive ? '#a78bfa' : '#ffffff' }} />
                  </button>
                );
              })}

              {/* Portal Access Section */}
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Portal Access
                </p>

                {user ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <p style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff' }}>{user.name}</p>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {user.email} • <span style={{ color: '#a78bfa', fontWeight: 600 }}>{user.role.toUpperCase()}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => { handleNavClick(`dashboard-${user.role}`); setMobileMenuOpen(false); }}
                      style={{
                        height: '48px',
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
                        cursor: 'pointer'
                      }}
                    >
                      <span>Go to {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard</span>
                      <ArrowRight size={16} />
                    </button>
                    <button
                      onClick={() => { logout(); setMobileMenuOpen(false); }}
                      style={{
                        height: '44px',
                        width: '100%',
                        borderRadius: '12px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        fontWeight: 600,
                        fontSize: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button
                      onClick={() => { handleAuthShortcut('buyer'); setMobileMenuOpen(false); }}
                      style={{
                        height: '48px',
                        width: '100%',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        fontWeight: 600,
                        fontSize: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 16px',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Search size={18} style={{ color: '#818cf8' }} />
                        <span>Buyer Portal</span>
                      </div>
                      <ArrowRight size={16} style={{ opacity: 0.6 }} />
                    </button>

                    <button
                      onClick={() => { handleAuthShortcut('seller'); setMobileMenuOpen(false); }}
                      style={{
                        height: '48px',
                        width: '100%',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        fontWeight: 600,
                        fontSize: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 16px',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Building size={18} style={{ color: '#a78bfa' }} />
                        <span>Seller Portal</span>
                      </div>
                      <ArrowRight size={16} style={{ opacity: 0.6 }} />
                    </button>

                    <button
                      onClick={() => { handleAuthShortcut('admin'); setMobileMenuOpen(false); }}
                      style={{
                        height: '48px',
                        width: '100%',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #6D5BFF 0%, #8A63FF 100%)',
                        color: '#ffffff',
                        fontWeight: 600,
                        fontSize: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 16px',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(109, 91, 255, 0.25)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Shield size={18} style={{ color: '#ffffff' }} />
                        <span>Admin Portal</span>
                      </div>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-menu-only { display: none !important; }
          .mobile-toggle-only { display: block !important; }
        }
      `}</style>
    </nav>
  );
};
