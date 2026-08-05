import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, Building2, Users, Briefcase, Calendar, FileText, BarChart3, 
  Settings, Bell, User, LogOut, Search, Plus, Download, ArrowUpRight, 
  CheckCircle2, XCircle, Trash2, Star, RefreshCw, CheckSquare, Square, FileSpreadsheet
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    properties, adminUsers, adminAgents, adminAppointments, notifications, user, logout,
    updateListingStatus, toggleFeatureListing, deleteListing,
    updateUserStatus, deleteUser, updateAgentStatus, deleteAgent,
    updateAppointmentStatus, markNotificationAsRead, clearNotifications,
    showToast 
  } = useApp();

  type TabType = 
    | 'dashboard' 
    | 'listings' 
    | 'users' 
    | 'agents' 
    | 'appointments' 
    | 'reports' 
    | 'analytics' 
    | 'settings' 
    | 'notifications' 
    | 'profile';

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [globalSearch, setGlobalSearch] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);

  // Listings Tab Filters & Selection State
  const [listingSearch, setListingSearch] = useState('');
  const [listingCityFilter, setListingCityFilter] = useState('all');
  const [listingSortBy, setListingSortBy] = useState<'price-desc' | 'price-asc' | 'date'>('price-desc');
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [listingPage, setListingPage] = useState(1);
  const listingsPerPage = 5;

  // Users Tab State
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');

  // Agents Tab State
  const [agentSearch, setAgentSearch] = useState('');
  const [agentStatusFilter, setAgentStatusFilter] = useState('all');

  // Appointments Tab State
  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState('all');

  // Settings Tab State
  const [brandName, setBrandName] = useState('Kang Homes');
  const [primaryColor, setPrimaryColor] = useState('#E31837');
  const [accentColor, setAccentColor] = useState('#111827');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  // Quick Action Handlers
  const handleQuickAction = (action: string) => {
    setQuickActionsOpen(false);
    if (action === 'new-listing') {
      showToast('Opening New Luxury Listing Creation Studio', 'info');
      setActiveTab('listings');
    } else if (action === 'new-user') {
      showToast('Opening User Registration Gateway', 'info');
      setActiveTab('users');
    } else if (action === 'new-agent') {
      showToast('Opening Agent Credential Onboarding Panel', 'info');
      setActiveTab('agents');
    } else if (action === 'backup') {
      showToast('Enterprise Ledger Backup generated and downloaded.', 'success');
    }
  };

  // Filtered Property Listings
  const filteredListings = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(listingSearch.toLowerCase()) || 
                          p.city.toLowerCase().includes(listingSearch.toLowerCase()) ||
                          p.mlsNumber.toLowerCase().includes(listingSearch.toLowerCase());
    const matchesCity = listingCityFilter === 'all' || p.city === listingCityFilter;
    const matchesGlobal = !globalSearch || p.title.toLowerCase().includes(globalSearch.toLowerCase()) || p.city.toLowerCase().includes(globalSearch.toLowerCase());
    return matchesSearch && matchesCity && matchesGlobal;
  }).sort((a, b) => {
    if (listingSortBy === 'price-desc') return b.price - a.price;
    if (listingSortBy === 'price-asc') return a.price - b.price;
    return b.id.localeCompare(a.id);
  });

  const totalListingPages = Math.ceil(filteredListings.length / listingsPerPage) || 1;
  const paginatedListings = filteredListings.slice((listingPage - 1) * listingsPerPage, listingPage * listingsPerPage);

  // Bulk Listing Selector
  const toggleSelectAllListings = () => {
    if (selectedListings.length === paginatedListings.length) {
      setSelectedListings([]);
    } else {
      setSelectedListings(paginatedListings.map(p => p.id));
    }
  };

  const toggleSelectListing = (id: string) => {
    setSelectedListings(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // Filtered Users
  const filteredUsers = adminUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    const matchesStatus = userStatusFilter === 'all' || u.status === userStatusFilter;
    const matchesGlobal = !globalSearch || u.name.toLowerCase().includes(globalSearch.toLowerCase()) || u.email.toLowerCase().includes(globalSearch.toLowerCase());
    return matchesSearch && matchesRole && matchesStatus && matchesGlobal;
  });

  // Filtered Agents
  const filteredAgents = adminAgents.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(agentSearch.toLowerCase()) || a.email.toLowerCase().includes(agentSearch.toLowerCase());
    const matchesStatus = agentStatusFilter === 'all' || a.status === agentStatusFilter;
    const matchesGlobal = !globalSearch || a.name.toLowerCase().includes(globalSearch.toLowerCase()) || a.email.toLowerCase().includes(globalSearch.toLowerCase());
    return matchesSearch && matchesStatus && matchesGlobal;
  });

  // Filtered Appointments
  const filteredAppointments = adminAppointments.filter(app => {
    const matchesSearch = app.buyerName.toLowerCase().includes(appointmentSearch.toLowerCase()) || 
                          app.propertyTitle.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
                          app.agentName.toLowerCase().includes(appointmentSearch.toLowerCase());
    const matchesStatus = appointmentStatusFilter === 'all' || app.status === appointmentStatusFilter;
    const matchesGlobal = !globalSearch || app.buyerName.toLowerCase().includes(globalSearch.toLowerCase()) || app.propertyTitle.toLowerCase().includes(globalSearch.toLowerCase());
    return matchesSearch && matchesStatus && matchesGlobal;
  });

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fade-in" style={{ paddingTop: '16px', minHeight: '100vh', paddingBottom: '40px', background: 'radial-gradient(circle at top right, rgba(99,102,241,0.06), transparent 50%)' }}>
      
      {/* GLOBAL ENTERPRISE TOP NAVIGATION BAR */}
      <div 
        style={{ 
          position: 'sticky', 
          top: '80px', 
          zIndex: 100, 
          background: 'rgba(3, 7, 18, 0.88)', 
          backdropFilter: 'blur(16px)', 
          borderBottom: '1px solid rgba(167, 139, 250, 0.15)', 
          padding: '12px 24px', 
          marginBottom: '16px' 
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          
          {/* Global Real-Time Search Bar */}
          <div style={{ position: 'relative', width: '360px', maxWidth: '100%' }}>
            <input 
              type="text" 
              placeholder="Global Admin Search (Listings, Users, Agents, Tours)..."
              value={globalSearch}
              onChange={e => setGlobalSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '38px', paddingRight: '12px', height: '40px', fontSize: '0.82rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            {globalSearch && (
              <button onClick={() => setGlobalSearch('')} style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <XCircle size={16} />
              </button>
            )}
          </div>

          {/* Right Action Icons & Admin Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            
            {/* Quick Actions Dropdown */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setQuickActionsOpen(!quickActionsOpen)}
                className="btn btn-secondary hover-lift"
                style={{ height: '40px', padding: '0 16px', fontSize: '0.8rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(167,139,250,0.3)' }}
              >
                <Plus size={15} style={{ color: 'var(--color-lavender)' }} />
                <span>Quick Actions</span>
              </button>

              {quickActionsOpen && (
                <div className="glass-panel" style={{ position: 'absolute', right: 0, top: '48px', width: '220px', padding: '8px', borderRadius: '14px', border: '1px solid var(--glass-border-hover)', zIndex: 200, boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
                  <button onClick={() => handleQuickAction('new-listing')} style={{ width: '100%', background: 'none', border: 'none', padding: '10px', display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff', fontSize: '0.8rem', textAlign: 'left', cursor: 'pointer', borderRadius: '8px' }} className="hover-lift">
                    <Building2 size={14} style={{ color: 'var(--color-lavender)' }} />
                    <span>Create New Listing</span>
                  </button>
                  <button onClick={() => handleQuickAction('new-user')} style={{ width: '100%', background: 'none', border: 'none', padding: '10px', display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff', fontSize: '0.8rem', textAlign: 'left', cursor: 'pointer', borderRadius: '8px' }} className="hover-lift">
                    <Users size={14} style={{ color: '#06b6d4' }} />
                    <span>Register New User</span>
                  </button>
                  <button onClick={() => handleQuickAction('new-agent')} style={{ width: '100%', background: 'none', border: 'none', padding: '10px', display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff', fontSize: '0.8rem', textAlign: 'left', cursor: 'pointer', borderRadius: '8px' }} className="hover-lift">
                    <Briefcase size={14} style={{ color: '#10b981' }} />
                    <span>Onboard Licensed Agent</span>
                  </button>
                  <button onClick={() => handleQuickAction('backup')} style={{ width: '100%', background: 'none', border: 'none', padding: '10px', display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff', fontSize: '0.8rem', textAlign: 'left', cursor: 'pointer', borderRadius: '8px' }} className="hover-lift">
                    <Download size={14} style={{ color: '#f59e0b' }} />
                    <span>System Ledger Backup</span>
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Drawer Toggle */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', cursor: 'pointer', position: 'relative' }}
              >
                <Bell size={18} />
                {unreadNotifCount > 0 && (
                  <span style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-lavender)' }} />
                )}
              </button>

              {notificationsOpen && (
                <div className="glass-panel" style={{ position: 'absolute', right: 0, top: '48px', width: '320px', padding: '16px', borderRadius: '16px', border: '1px solid var(--glass-border-hover)', zIndex: 200, boxShadow: '0 20px 40px rgba(0,0,0,0.8)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <h4 style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 600 }}>System Notifications</h4>
                    <button onClick={clearNotifications} style={{ background: 'none', border: 'none', color: 'var(--color-lavender)', fontSize: '0.7rem', cursor: 'pointer' }}>Clear All</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
                    {notifications.map(n => (
                      <div key={n.id} onClick={() => markNotificationAsRead(n.id)} style={{ padding: '10px', background: n.read ? 'rgba(255,255,255,0.01)' : 'rgba(167, 139, 250, 0.08)', borderRadius: '10px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>{n.title}</p>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{n.message}</p>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>{n.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-lavender), var(--color-blue-primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 700, fontSize: '0.8rem' }}>
                {user?.name.charAt(0) || 'A'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>{user?.name || 'Marcus Aurelius'}</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-lavender)' }}>Managing Director</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* DASHBOARD WORKSPACE LAYOUT */}
      <div className="container responsive-dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px', alignItems: 'start' }}>
        
        {/* SIDEBAR NAVIGATION */}
        <div className="glass-panel" style={{ padding: '16px', borderRadius: '16px', border: '1px solid rgba(167, 139, 250, 0.2)', position: 'sticky', top: '148px' }}>
          <div style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--color-lavender)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>EXECUTIVE CONSOLE</span>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff', marginTop: '2px' }}>Admin CRM Suite</h3>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
              { id: 'listings', label: 'Manage Listings', icon: <Building2 size={16} />, badge: properties.length },
              { id: 'users', label: 'Manage Users', icon: <Users size={16} />, badge: adminUsers.length },
              { id: 'agents', label: 'Manage Agents', icon: <Briefcase size={16} />, badge: adminAgents.length },
              { id: 'appointments', label: 'Appointments', icon: <Calendar size={16} />, badge: adminAppointments.length },
              { id: 'reports', label: 'Reports', icon: <FileText size={16} /> },
              { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} /> },
              { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
              { id: 'notifications', label: 'Notifications', icon: <Bell size={16} />, badge: unreadNotifCount > 0 ? unreadNotifCount : undefined },
              { id: 'profile', label: 'Profile', icon: <User size={16} /> }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: isActive ? 'linear-gradient(90deg, rgba(167, 139, 250, 0.18), rgba(99, 102, 241, 0.08))' : 'transparent',
                    border: isActive ? '1px solid rgba(167, 139, 250, 0.3)' : '1px solid transparent',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)'
                  }}
                  className="hover-lift"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: isActive ? 'var(--color-lavender)' : 'var(--text-muted)' }}>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && (
                    <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '12px', background: isActive ? 'var(--color-lavender)' : 'rgba(255,255,255,0.06)', color: isActive ? '#ffffff' : 'var(--text-secondary)', fontWeight: 600 }}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '12px', paddingTop: '12px' }}>
              <button
                onClick={() => { logout(); showToast('Admin session terminated.', 'info'); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#ef4444',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                className="hover-lift"
              >
                <LogOut size={16} />
                <span>Sign Out Admin</span>
              </button>
            </div>
          </nav>
        </div>

        {/* MAIN WORKSPACE CONTENT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Header Title */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-lavender)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>PLATFORM PULSE</span>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#ffffff' }}>Executive Overview</h2>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => showToast('Platform metrics refreshed', 'info')} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.8rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <RefreshCw size={14} />
                    <span>Sync Ledger</span>
                  </button>
                </div>
              </div>

              {/* 10 DASHBOARD OVERVIEW CARDS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>TOTAL LISTINGS</span>
                  <h3 style={{ fontSize: '1.6rem', color: '#ffffff', fontWeight: 700, marginTop: '4px' }}>{properties.length}</h3>
                  <span style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <ArrowUpRight size={12} /> +14% vs last quarter
                  </span>
                </div>

                <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ACTIVE LISTINGS</span>
                  <h3 style={{ fontSize: '1.6rem', color: '#10b981', fontWeight: 700, marginTop: '4px' }}>{properties.length - 1}</h3>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Published on public MLS</span>
                </div>

                <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PENDING LISTINGS</span>
                  <h3 style={{ fontSize: '1.6rem', color: '#f59e0b', fontWeight: 700, marginTop: '4px' }}>1</h3>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Awaiting deed review</span>
                </div>

                <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>SOLD LISTINGS</span>
                  <h3 style={{ fontSize: '1.6rem', color: 'var(--color-lavender)', fontWeight: 700, marginTop: '4px' }}>28</h3>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Closed YTD 2026</span>
                </div>

                <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>REGISTERED BUYERS</span>
                  <h3 style={{ fontSize: '1.6rem', color: '#ffffff', fontWeight: 700, marginTop: '4px' }}>{adminUsers.filter(u => u.role === 'buyer').length}</h3>
                  <span style={{ fontSize: '0.7rem', color: '#10b981', marginTop: '4px', display: 'block' }}>Pre-approved VIPs</span>
                </div>

                <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>REGISTERED SELLERS</span>
                  <h3 style={{ fontSize: '1.6rem', color: '#ffffff', fontWeight: 700, marginTop: '4px' }}>{adminUsers.filter(u => u.role === 'seller').length}</h3>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Active Valuations</span>
                </div>

                <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>REGISTERED AGENTS</span>
                  <h3 style={{ fontSize: '1.6rem', color: '#ffffff', fontWeight: 700, marginTop: '4px' }}>{adminAgents.length}</h3>
                  <span style={{ fontSize: '0.7rem', color: '#10b981', marginTop: '4px', display: 'block' }}>Licensed Advisors</span>
                </div>

                <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>TODAY'S TOURS</span>
                  <h3 style={{ fontSize: '1.6rem', color: 'var(--color-lavender)', fontWeight: 700, marginTop: '4px' }}>{adminAppointments.length}</h3>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>3 Scheduled Today</span>
                </div>

                <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid rgba(167, 139, 250, 0.2)', background: 'rgba(99,102,241,0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-lavender)' }}>MONTHLY REVENUE (MOCK)</span>
                  <h3 style={{ fontSize: '1.6rem', color: '#ffffff', fontWeight: 700, marginTop: '4px' }}>$14,250,000</h3>
                  <span style={{ fontSize: '0.7rem', color: '#10b981', marginTop: '4px', display: 'block' }}>Commission yield 2.5%</span>
                </div>

                <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PENDING APPROVALS</span>
                  <h3 style={{ fontSize: '1.6rem', color: '#f59e0b', fontWeight: 700, marginTop: '4px' }}>2</h3>
                  <span style={{ fontSize: '0.7rem', color: '#f59e0b', marginTop: '4px', display: 'block' }}>Requires Admin Signoff</span>
                </div>
              </div>

              {/* Chart Preview & System Ledger */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', color: '#ffffff', fontWeight: 600 }}>Regional Transaction Ledger</h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Monthly luxury volume closed across Canadian primary hubs ($ Million)</p>
                  </div>
                  <button onClick={() => setActiveTab('analytics')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px' }}>
                    View Deep Analytics
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px', height: '160px', alignItems: 'end', paddingTop: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {[
                    { month: 'Mar', val: 65, label: '$65M' },
                    { month: 'Apr', val: 82, label: '$82M' },
                    { month: 'May', val: 110, label: '$110M' },
                    { month: 'Jun', val: 95, label: '$95M' },
                    { month: 'Jul', val: 142, label: '$142M' },
                    { month: 'Aug (Proj)', val: 168, label: '$168M' }
                  ].map((bar, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-lavender)', fontWeight: 600 }}>{bar.label}</span>
                      <div 
                        style={{ 
                          width: '100%', 
                          maxWidth: '36px',
                          height: `${(bar.val / 168) * 100}%`, 
                          background: i === 4 ? 'linear-gradient(180deg, var(--color-lavender), var(--color-blue-primary))' : 'rgba(255,255,255,0.08)', 
                          borderRadius: '6px 6px 0 0',
                          transition: 'height 0.8s ease'
                        }} 
                      />
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{bar.month}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MANAGE LISTINGS */}
          {activeTab === 'listings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-lavender)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>INVENTORY CONTROL</span>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#ffffff' }}>Manage Listings</h2>
                </div>
                <button onClick={() => showToast('New listing creation modal initialized', 'info')} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.82rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Plus size={16} />
                  <span>Create New Listing</span>
                </button>
              </div>

              {/* Listing Filters & Actions Bar */}
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
                  <div style={{ position: 'relative', width: '240px' }}>
                    <input 
                      type="text" 
                      placeholder="Search Title, City, MLS#..." 
                      value={listingSearch}
                      onChange={e => { setListingSearch(e.target.value); setListingPage(1); }}
                      className="form-input"
                      style={{ paddingLeft: '32px', height: '36px', fontSize: '0.8rem' }}
                    />
                    <Search size={14} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--text-muted)' }} />
                  </div>

                  <select 
                    value={listingCityFilter} 
                    onChange={e => { setListingCityFilter(e.target.value); setListingPage(1); }}
                    className="form-input"
                    style={{ height: '36px', fontSize: '0.8rem', width: '130px' }}
                  >
                    <option value="all">All Cities</option>
                    <option value="Toronto">Toronto</option>
                    <option value="Vancouver">Vancouver</option>
                    <option value="Oakville">Oakville</option>
                    <option value="Montreal">Montreal</option>
                  </select>

                  <select 
                    value={listingSortBy} 
                    onChange={e => setListingSortBy(e.target.value as any)}
                    className="form-input"
                    style={{ height: '36px', fontSize: '0.8rem', width: '140px' }}
                  >
                    <option value="price-desc">Highest Price</option>
                    <option value="price-asc">Lowest Price</option>
                  </select>
                </div>

                {/* Selected Count & Bulk Actions */}
                {selectedListings.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-lavender)', fontWeight: 600 }}>{selectedListings.length} Selected</span>
                    <button onClick={() => { selectedListings.forEach(id => updateListingStatus(id, 'active')); setSelectedListings([]); }} className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '0.72rem', borderRadius: '6px' }}>
                      Approve Bulk
                    </button>
                    <button onClick={() => { selectedListings.forEach(id => deleteListing(id)); setSelectedListings([]); }} className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '0.72rem', color: '#ef4444', borderRadius: '6px' }}>
                      Delete Bulk
                    </button>
                  </div>
                )}
              </div>

              {/* Listings Table */}
              <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '14px 16px', width: '40px' }}>
                        <button onClick={toggleSelectAllListings} style={{ background: 'none', border: 'none', color: 'var(--color-lavender)', cursor: 'pointer' }}>
                          {selectedListings.length === paginatedListings.length && paginatedListings.length > 0 ? <CheckSquare size={16} /> : <Square size={16} />}
                        </button>
                      </th>
                      <th style={{ padding: '14px 16px' }}>PROPERTY</th>
                      <th style={{ padding: '14px 16px' }}>CITY & MLS</th>
                      <th style={{ padding: '14px 16px' }}>LIST PRICE</th>
                      <th style={{ padding: '14px 16px' }}>FEATURED</th>
                      <th style={{ padding: '14px 16px' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedListings.map(p => {
                      const isSelected = selectedListings.includes(p.id);
                      return (
                        <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: isSelected ? 'rgba(167, 139, 250, 0.06)' : 'transparent' }}>
                          <td style={{ padding: '14px 16px' }}>
                            <button onClick={() => toggleSelectListing(p.id)} style={{ background: 'none', border: 'none', color: isSelected ? 'var(--color-lavender)' : 'var(--text-muted)', cursor: 'pointer' }}>
                              {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                            </button>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <img src={p.imageUrl} alt={p.title} style={{ width: '48px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
                              <div>
                                <p style={{ fontWeight: 600, color: '#ffffff' }}>{p.title}</p>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.propertyType} • {p.beds} Beds • {p.sqft.toLocaleString()} SqFt</span>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <p style={{ color: '#ffffff' }}>{p.city}</p>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>MLS: {p.mlsNumber}</span>
                          </td>
                          <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--color-lavender)' }}>
                            ${p.price.toLocaleString()}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <button onClick={() => toggleFeatureListing(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: p.featured ? '#f59e0b' : 'var(--text-muted)' }}>
                              <Star size={18} fill={p.featured ? '#f59e0b' : 'none'} />
                            </button>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button onClick={() => updateListingStatus(p.id, 'active')} title="Approve Listing" style={{ padding: '6px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', cursor: 'pointer' }}>
                                <CheckCircle2 size={14} />
                              </button>
                              <button onClick={() => updateListingStatus(p.id, 'rejected')} title="Reject Listing" style={{ padding: '6px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', cursor: 'pointer' }}>
                                <XCircle size={14} />
                              </button>
                              <button onClick={() => deleteListing(p.id)} title="Delete Listing" style={{ padding: '6px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Pagination */}
                <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Showing Page {listingPage} of {totalListingPages}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button disabled={listingPage === 1} onClick={() => setListingPage(prev => prev - 1)} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '6px' }}>
                      Previous
                    </button>
                    <button disabled={listingPage === totalListingPages} onClick={() => setListingPage(prev => prev + 1)} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '6px' }}>
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MANAGE USERS */}
          {activeTab === 'users' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-lavender)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>IDENTITY MANAGEMENT</span>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#ffffff' }}>Manage Users</h2>
                </div>
                <button onClick={() => showToast('New User Registration Modal Triggered', 'info')} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.82rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Plus size={16} />
                  <span>Register User</span>
                </button>
              </div>

              {/* User Search & Filters */}
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', width: '280px' }}>
                  <input 
                    type="text" 
                    placeholder="Search Users by Name or Email..."
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '32px', height: '36px', fontSize: '0.8rem' }}
                  />
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--text-muted)' }} />
                </div>

                <select value={userRoleFilter} onChange={e => setUserRoleFilter(e.target.value)} className="form-input" style={{ height: '36px', fontSize: '0.8rem', width: '130px' }}>
                  <option value="all">All Roles</option>
                  <option value="buyer">Buyers Only</option>
                  <option value="seller">Sellers Only</option>
                </select>

                <select value={userStatusFilter} onChange={e => setUserStatusFilter(e.target.value)} className="form-input" style={{ height: '36px', fontSize: '0.8rem', width: '140px' }}>
                  <option value="all">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              {/* Users Table */}
              <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '14px 16px' }}>NAME & PROFILE</th>
                      <th style={{ padding: '14px 16px' }}>CONTACT EMAIL</th>
                      <th style={{ padding: '14px 16px' }}>ROLE</th>
                      <th style={{ padding: '14px 16px' }}>STATUS</th>
                      <th style={{ padding: '14px 16px' }}>REG DATE</th>
                      <th style={{ padding: '14px 16px' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-lavender), var(--color-blue-primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 700, fontSize: '0.8rem' }}>
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <p style={{ fontWeight: 600, color: '#ffffff' }}>{u.name}</p>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{u.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{u.email}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600, background: u.role === 'buyer' ? 'rgba(99,102,241,0.15)' : 'rgba(167,139,250,0.15)', color: u.role === 'buyer' ? '#818cf8' : 'var(--color-lavender)' }}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600, background: u.status === 'Active' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: u.status === 'Active' ? '#10b981' : '#ef4444' }}>
                            {u.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{u.registrationDate}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {u.status === 'Active' ? (
                              <button onClick={() => updateUserStatus(u.id, 'Suspended')} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.72rem', borderRadius: '6px' }}>
                                Suspend
                              </button>
                            ) : (
                              <button onClick={() => updateUserStatus(u.id, 'Active')} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.72rem', color: '#10b981', borderRadius: '6px' }}>
                                Activate
                              </button>
                            )}
                            <button onClick={() => deleteUser(u.id)} style={{ padding: '6px', borderRadius: '6px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', cursor: 'pointer' }}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: MANAGE AGENTS */}
          {activeTab === 'agents' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-lavender)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>REALTOR ROSTER</span>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#ffffff' }}>Manage Licensed Agents</h2>
                </div>
                <button onClick={() => showToast('Agent Onboarding Form Triggered', 'info')} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.82rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Plus size={16} />
                  <span>Onboard Agent</span>
                </button>
              </div>

              {/* Agents Search & Filters Bar */}
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', width: '280px' }}>
                  <input 
                    type="text" 
                    placeholder="Search Agents by Name or Email..."
                    value={agentSearch}
                    onChange={e => setAgentSearch(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '32px', height: '36px', fontSize: '0.8rem' }}
                  />
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--text-muted)' }} />
                </div>

                <select value={agentStatusFilter} onChange={e => setAgentStatusFilter(e.target.value)} className="form-input" style={{ height: '36px', fontSize: '0.8rem', width: '140px' }}>
                  <option value="all">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Pending Approval">Pending Approval</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              {/* Agents Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {filteredAgents.map(a => (
                  <div key={a.id} className="glass-panel" style={{ padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img src={a.photo} alt={a.name} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-lavender)' }} />
                      <div>
                        <h4 style={{ fontSize: '1rem', color: '#ffffff', fontWeight: 600 }}>{a.name}</h4>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{a.experience} • Rating {a.rating} ★</span>
                        <div style={{ marginTop: '4px' }}>
                          <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 600, background: a.status === 'Active' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: a.status === 'Active' ? '#10b981' : '#f59e0b' }}>
                            {a.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                      <div>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>LISTINGS ASSIGNED</span>
                        <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>{a.propertiesCount} Active</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>COMMISSION</span>
                        <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-lavender)' }}>{a.commissionRate}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {a.status === 'Active' ? (
                        <button onClick={() => updateAgentStatus(a.id, 'Suspended')} className="btn btn-secondary" style={{ flex: 1, padding: '8px', fontSize: '0.75rem', borderRadius: '8px' }}>
                          Suspend
                        </button>
                      ) : (
                        <button onClick={() => updateAgentStatus(a.id, 'Active')} className="btn btn-primary" style={{ flex: 1, padding: '8px', fontSize: '0.75rem', borderRadius: '8px' }}>
                          Approve
                        </button>
                      )}
                      <button onClick={() => deleteAgent(a.id)} className="btn btn-secondary" style={{ padding: '8px', color: '#ef4444', borderRadius: '8px' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: APPOINTMENTS */}
          {activeTab === 'appointments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-lavender)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>SCHEDULE CONTROL</span>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#ffffff' }}>Appointments & Tours</h2>
                </div>
              </div>

              {/* Appointments Search & Filters Bar */}
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', width: '280px' }}>
                  <input 
                    type="text" 
                    placeholder="Search Buyer, Realtor, or Property..."
                    value={appointmentSearch}
                    onChange={e => setAppointmentSearch(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '32px', height: '36px', fontSize: '0.8rem' }}
                  />
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--text-muted)' }} />
                </div>

                <select value={appointmentStatusFilter} onChange={e => setAppointmentStatusFilter(e.target.value)} className="form-input" style={{ height: '36px', fontSize: '0.8rem', width: '140px' }}>
                  <option value="all">All Statuses</option>
                  <option value="Approved">Approved</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Appointments Table */}
              <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '14px 16px' }}>BUYER / CLIENT</th>
                      <th style={{ padding: '14px 16px' }}>PROPERTY</th>
                      <th style={{ padding: '14px 16px' }}>ASSIGNED REALTOR</th>
                      <th style={{ padding: '14px 16px' }}>DATE & TIME</th>
                      <th style={{ padding: '14px 16px' }}>MEETING TYPE</th>
                      <th style={{ padding: '14px 16px' }}>STATUS</th>
                      <th style={{ padding: '14px 16px' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map(app => (
                      <tr key={app.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 600, color: '#ffffff' }}>{app.buyerName}</td>
                        <td style={{ padding: '14px 16px', color: 'var(--color-lavender)' }}>{app.propertyTitle}</td>
                        <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{app.agentName}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <p style={{ color: '#ffffff' }}>{app.date}</p>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{app.time}</span>
                        </td>
                        <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{app.meetingType}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600, background: app.status === 'Approved' ? 'rgba(16,185,129,0.15)' : app.status === 'Upcoming' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)', color: app.status === 'Approved' ? '#10b981' : app.status === 'Upcoming' ? '#f59e0b' : '#ef4444' }}>
                            {app.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => updateAppointmentStatus(app.id, 'Approved')} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.72rem', color: '#10b981', borderRadius: '6px' }}>
                              Approve
                            </button>
                            <button onClick={() => updateAppointmentStatus(app.id, 'Cancelled')} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.72rem', color: '#ef4444', borderRadius: '6px' }}>
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: REPORTS */}
          {activeTab === 'reports' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-lavender)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>FINANCIAL & OPERATIONAL INTELLIGENCE</span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#ffffff' }}>Reports Center</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {[
                  { title: 'Listing Audit Report', desc: 'Complete breakdown of all active, pending, and sold properties with price histories.', type: 'PDF' },
                  { title: 'Sales Performance Ledger', desc: 'Quarterly transaction volume, commission yield, and agent closing ratios.', type: 'Excel' },
                  { title: 'Buyer Activity Report', desc: 'Pre-approval distribution, saved searches, and high-intent buyer inquiries.', type: 'PDF' },
                  { title: 'Seller Valuation Report', desc: 'Regional AI home valuations, appraisal bookings, and listing conversion rates.', type: 'Excel' },
                  { title: 'Agent Commission Summary', desc: 'Individual agent splits, performance scores, and active listing assignments.', type: 'PDF' },
                  { title: 'Annual Revenue Analysis', desc: 'Enterprise 2026 revenue projections vs actual closed escrow fees.', type: 'Excel' }
                ].map((rep, index) => (
                  <div key={index} className="glass-panel" style={{ padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(167, 139, 250, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-lavender)' }}>
                        {rep.type === 'PDF' ? <FileText size={18} /> : <FileSpreadsheet size={18} />}
                      </div>
                      <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 700, background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
                        {rep.type} FORMAT
                      </span>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '1rem', color: '#ffffff', fontWeight: 600 }}>{rep.title}</h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{rep.desc}</p>
                    </div>

                    <button onClick={() => showToast(`Generating ${rep.title} in ${rep.type} format... File downloaded.`, 'success')} className="btn btn-secondary hover-lift" style={{ padding: '8px 14px', fontSize: '0.78rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Download size={14} />
                      <span>Export {rep.type}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-lavender)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>PREDICTIVE PLATFORM DATA</span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#ffffff' }}>Analytics & Market Intelligence</h2>
              </div>

              {/* Monthly Listings & Buyer/Seller Growth Chart */}
              <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px', border: '1px solid rgba(167, 139, 250, 0.15)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: '#ffffff', fontWeight: 600 }}>Monthly Listing & Registration Trajectory</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>YTD platform growth in new luxury inventory and registered clients</p>
                </div>

                <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {[
                    { month: 'Jan', listings: 12, users: 45 },
                    { month: 'Feb', listings: 18, users: 62 },
                    { month: 'Mar', listings: 24, users: 88 },
                    { month: 'Apr', listings: 30, users: 110 },
                    { month: 'May', listings: 38, users: 142 },
                    { month: 'Jun', listings: 45, users: 180 },
                    { month: 'Jul', listings: 52, users: 220 }
                  ].map((item, idx) => (
                    <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                      <div style={{ display: 'flex', gap: '4px', height: '100%', alignItems: 'flex-end', width: '100%', justifyContent: 'center' }}>
                        <div style={{ width: '12px', height: `${(item.listings / 52) * 100}%`, background: 'var(--color-lavender)', borderRadius: '4px 4px 0 0' }} title={`Listings: ${item.listings}`} />
                        <div style={{ width: '12px', height: `${(item.users / 220) * 100}%`, background: 'var(--color-blue-primary)', borderRadius: '4px 4px 0 0' }} title={`Users: ${item.users}`} />
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.month}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '20px', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}>
                    <span style={{ width: '10px', height: '10px', background: 'var(--color-lavender)', borderRadius: '2px' }} />
                    <span>New Listings</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}>
                    <span style={{ width: '10px', height: '10px', background: 'var(--color-blue-primary)', borderRadius: '2px' }} />
                    <span>Registered Clients</span>
                  </div>
                </div>
              </div>

              {/* Popular Communities & Demand Heatmap */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '16px' }}>Top Searched Luxury Communities</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { name: 'Bridle Path, Toronto', share: '38%', count: '1,420 searches' },
                      { name: 'Shaughnessy, Vancouver', share: '26%', count: '980 searches' },
                      { name: 'Old Oakville, Oakville', share: '20%', count: '740 searches' },
                      { name: 'Westmount, Montreal', share: '16%', count: '610 searches' }
                    ].map((c, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
                        <div>
                          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>{c.name}</p>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.count}</span>
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-lavender)' }}>{c.share}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '16px' }}>Regional Demand Heatmap</h4>
                  <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Highest buyer intent currently concentrated in Greater Toronto Area & West Vancouver waterfront estates.</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                      <span style={{ padding: '4px 12px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>GTA Heat: 98/100</span>
                      <span style={{ padding: '4px 12px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>Vancouver Heat: 94/100</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', border: '1px solid rgba(167, 139, 250, 0.2)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-lavender)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>SYSTEM CONFIGURATION</span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#ffffff' }}>Admin Settings</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '520px' }}>
                <div className="form-input-container">
                  <label className="form-label">Brand Name</label>
                  <input type="text" value={brandName} onChange={e => setBrandName(e.target.value)} className="form-input" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-input-container">
                    <label className="form-label">Primary Color</label>
                    <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="form-input" style={{ height: '42px', padding: '4px' }} />
                  </div>
                  <div className="form-input-container">
                    <label className="form-label">Accent Color</label>
                    <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} className="form-input" style={{ height: '42px', padding: '4px' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff' }}>System Alerts & Dispatch</label>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Email System Alerts</span>
                    <button onClick={() => setEmailAlerts(!emailAlerts)} className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: '0.75rem' }}>
                      {emailAlerts ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>SMS Escrow Notifications</span>
                    <button onClick={() => setSmsAlerts(!smsAlerts)} className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: '0.75rem' }}>
                      {smsAlerts ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                </div>

                <button onClick={() => showToast('Platform configuration saved successfully.', 'success')} className="btn btn-primary" style={{ width: 'fit-content', padding: '10px 24px', fontSize: '0.85rem', borderRadius: '10px' }}>
                  Save Platform Settings
                </button>
              </div>
            </div>
          )}

          {/* TAB 9: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-lavender)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>SYSTEM DISPATCH</span>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#ffffff' }}>System Notifications</h2>
                </div>
                <button onClick={clearNotifications} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.78rem' }}>
                  Clear All
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {notifications.map(n => (
                  <div key={n.id} onClick={() => markNotificationAsRead(n.id)} style={{ padding: '16px', borderRadius: '12px', background: n.read ? 'rgba(255,255,255,0.02)' : 'rgba(167,139,250,0.08)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 600 }}>{n.title}</h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{n.message}</p>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>{n.date}</span>
                    </div>
                    {!n.read && (
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-lavender)' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: PROFILE */}
          {activeTab === 'profile' && (
            <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', border: '1px solid rgba(167, 139, 250, 0.2)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-lavender)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>ADMIN CREDENTIALS</span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#ffffff' }}>Managing Director Profile</h2>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-lavender), var(--color-blue-primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 700, fontSize: '1.8rem' }}>
                  {user?.name.charAt(0) || 'M'}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 600 }}>{user?.name || 'Marcus Aurelius'}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-lavender)' }}>{user?.email || 'admin@novaestate.ca'}</p>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Role: Enterprise Platform Administrator</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => showToast('Admin credentials updated.', 'success')} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.82rem', borderRadius: '10px' }}>
                  Update Credentials
                </button>
                <button onClick={() => { logout(); showToast('Signed out of Admin Console', 'info'); }} className="btn btn-secondary" style={{ padding: '10px 20px', fontSize: '0.82rem', color: '#ef4444', borderRadius: '10px' }}>
                  Logout Admin Session
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
