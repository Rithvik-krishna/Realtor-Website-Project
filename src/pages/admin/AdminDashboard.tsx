import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, Building2, Users, Briefcase, Calendar, FileText, BarChart3, 
  Settings, Bell, User, Search, Plus, Download, 
  Trash2, FileSpreadsheet, X, Lock, TrendingUp, XCircle, LogOut, RefreshCw,
  ArrowUpRight, CheckSquare, Square, Star, CheckCircle2
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    properties, adminUsers, adminAgents, adminAppointments, notifications, user, logout,
    updateListingStatus, toggleFeatureListing, deleteListing,
    updateUserStatus, deleteUser, addAgent, updateAgentStatus, deleteAgent,
    updateAdminProfile, updateAppointmentStatus, markNotificationAsRead, clearNotifications,
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

  // Modal States
  const [isOnboardAgentOpen, setIsOnboardAgentOpen] = useState(false);
  const [isUpdateCredentialsOpen, setIsUpdateCredentialsOpen] = useState(false);

  // Onboard Agent Form State
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentEmail, setNewAgentEmail] = useState('');
  const [newAgentPhone, setNewAgentPhone] = useState('');
  const [newAgentExperience, setNewAgentExperience] = useState('8 Years');
  const [newAgentCommission, setNewAgentCommission] = useState('2.5%');
  const [newAgentPhoto, setNewAgentPhoto] = useState('https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80');

  // Update Credentials Form State
  const [credName, setCredName] = useState(user?.name || 'Marcus Aurelius (Director)');
  const [credEmail, setCredEmail] = useState(user?.email || 'admin@novaestate.ca');
  const [credPhone, setCredPhone] = useState('+1 (416) 555-0199');
  const [credCurrentPass, setCredCurrentPass] = useState('');
  const [credNewPass, setCredNewPass] = useState('');
  const [credConfirmPass, setCredConfirmPass] = useState('');

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
      setIsOnboardAgentOpen(true);
    } else if (action === 'backup') {
      showToast('Enterprise Ledger Backup generated and downloaded.', 'success');
    }
  };

  // Submit Onboard Agent Handler
  const handleOnboardAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName || !newAgentEmail) {
      showToast('Please provide agent name and email address.', 'warning');
      return;
    }
    addAgent({
      name: newAgentName,
      email: newAgentEmail,
      phone: newAgentPhone || '+1 (416) 555-0199',
      photo: newAgentPhoto,
      experience: newAgentExperience,
      commissionRate: newAgentCommission,
      status: 'Active'
    });
    setNewAgentName('');
    setNewAgentEmail('');
    setNewAgentPhone('');
    setIsOnboardAgentOpen(false);
  };

  // Submit Update Credentials Handler
  const handleUpdateCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credName || !credEmail) {
      showToast('Name and email are required.', 'warning');
      return;
    }
    if (credNewPass && credNewPass !== credConfirmPass) {
      showToast('New passwords do not match.', 'warning');
      return;
    }
    updateAdminProfile({
      name: credName,
      email: credEmail,
      phone: credPhone
    });
    setCredCurrentPass('');
    setCredNewPass('');
    setCredConfirmPass('');
    setIsUpdateCredentialsOpen(false);
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
                <div style={{ position: 'absolute', right: 0, top: '48px', width: '230px', padding: '8px', borderRadius: '14px', background: '#0f172a', border: '1px solid #334155', zIndex: 200, boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
                  <button onClick={() => handleQuickAction('new-listing')} style={{ width: '100%', background: 'none', border: 'none', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px', color: '#f8fafc', fontSize: '0.82rem', fontWeight: 600, textAlign: 'left', cursor: 'pointer', borderRadius: '8px', transition: 'background 0.2s' }} onMouseEnter={e => (e.currentTarget.style.background = '#1e293b')} onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                    <Building2 size={16} style={{ color: '#818cf8' }} />
                    <span style={{ color: '#f8fafc' }}>Create New Listing</span>
                  </button>
                  <button onClick={() => handleQuickAction('new-user')} style={{ width: '100%', background: 'none', border: 'none', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px', color: '#f8fafc', fontSize: '0.82rem', fontWeight: 600, textAlign: 'left', cursor: 'pointer', borderRadius: '8px', transition: 'background 0.2s' }} onMouseEnter={e => (e.currentTarget.style.background = '#1e293b')} onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                    <Users size={16} style={{ color: '#06b6d4' }} />
                    <span style={{ color: '#f8fafc' }}>Register New User</span>
                  </button>
                  <button onClick={() => handleQuickAction('new-agent')} style={{ width: '100%', background: 'none', border: 'none', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px', color: '#f8fafc', fontSize: '0.82rem', fontWeight: 600, textAlign: 'left', cursor: 'pointer', borderRadius: '8px', transition: 'background 0.2s' }} onMouseEnter={e => (e.currentTarget.style.background = '#1e293b')} onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                    <Briefcase size={16} style={{ color: '#10b981' }} />
                    <span style={{ color: '#f8fafc' }}>Onboard Licensed Agent</span>
                  </button>
                  <button onClick={() => handleQuickAction('backup')} style={{ width: '100%', background: 'none', border: 'none', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px', color: '#f8fafc', fontSize: '0.82rem', fontWeight: 600, textAlign: 'left', cursor: 'pointer', borderRadius: '8px', transition: 'background 0.2s' }} onMouseEnter={e => (e.currentTarget.style.background = '#1e293b')} onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                    <Download size={16} style={{ color: '#f59e0b' }} />
                    <span style={{ color: '#f8fafc' }}>System Ledger Backup</span>
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
                <div style={{ position: 'absolute', right: 0, top: '48px', width: '320px', padding: '16px', borderRadius: '16px', background: '#0f172a', border: '1px solid #334155', zIndex: 200, boxShadow: '0 20px 40px rgba(0,0,0,0.8)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #334155' }}>
                    <h4 style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 600 }}>System Notifications</h4>
                    <button onClick={clearNotifications} style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Clear All</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
                    {notifications.map(n => (
                      <div key={n.id} onClick={() => markNotificationAsRead(n.id)} style={{ padding: '10px', background: n.read ? '#1e293b' : 'rgba(129, 140, 248, 0.15)', borderRadius: '10px', cursor: 'pointer', border: '1px solid #334155' }}>
                        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>{n.title}</p>
                        <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>{n.message}</p>
                        <span style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '4px', display: 'block' }}>{n.date}</span>
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
                    background: isActive ? 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)' : 'transparent',
                    border: isActive ? '1px solid #334155' : '1px solid transparent',
                    color: isActive ? '#ffffff' : '#334155',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)',
                    boxShadow: isActive ? '0 4px 12px rgba(15, 23, 42, 0.25)' : 'none'
                  }}
                  className="hover-lift"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: isActive ? '#818cf8' : '#64748b' }}>{tab.icon}</span>
                    <span style={{ color: isActive ? '#ffffff' : '#1e293b' }}>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && (
                    <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '12px', background: isActive ? '#E31837' : '#f1f5f9', color: isActive ? '#ffffff' : '#0f172a', fontWeight: 700 }}>
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
                <button onClick={() => setIsOnboardAgentOpen(true)} className="btn btn-primary hover-lift" style={{ padding: '8px 16px', fontSize: '0.82rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                        <h4 style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 700 }}>{a.name}</h4>
                        <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 500 }}>{a.experience} • Rating {a.rating} ★</span>
                        <div style={{ marginTop: '4px' }}>
                          <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 700, background: a.status === 'Active' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: a.status === 'Active' ? '#059669' : '#d97706' }}>
                            {a.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div>
                        <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>LISTINGS ASSIGNED</span>
                        <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{a.propertiesCount} Active</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>COMMISSION</span>
                        <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#E31837' }}>{a.commissionRate}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {a.status === 'Active' ? (
                        <button onClick={() => updateAgentStatus(a.id, 'Suspended')} className="btn btn-secondary" style={{ flex: 1, padding: '8px', fontSize: '0.75rem', borderRadius: '8px', fontWeight: 600 }}>
                          Suspend
                        </button>
                      ) : (
                        <button onClick={() => updateAgentStatus(a.id, 'Active')} className="btn btn-primary" style={{ flex: 1, padding: '8px', fontSize: '0.75rem', borderRadius: '8px', fontWeight: 600 }}>
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
              <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#ffffff' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.05em' }}>
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
                      <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9', background: '#ffffff' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #0f172a, #2563eb)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
                              {app.buyerName.charAt(0)}
                            </div>
                            <div>
                              <p style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.86rem', margin: 0 }}>{app.buyerName}</p>
                              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>VIP Client</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1e293b' }}>{app.propertyTitle}</td>
                        <td style={{ padding: '14px 16px', color: '#334155', fontWeight: 500 }}>{app.agentName}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <p style={{ color: '#0f172a', fontWeight: 600, margin: 0 }}>{app.date}</p>
                          <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>{app.time}</span>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#334155', fontWeight: 500 }}>{app.meetingType}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700, background: app.status === 'Approved' ? '#dcfce7' : app.status === 'Upcoming' ? '#fef3c7' : '#fee2e2', color: app.status === 'Approved' ? '#166534' : app.status === 'Upcoming' ? '#b45309' : '#991b1b' }}>
                            {app.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => updateAppointmentStatus(app.id, 'Approved')} className="btn btn-secondary hover-lift" style={{ padding: '4px 10px', fontSize: '0.75rem', fontWeight: 600, color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: '6px' }}>
                              Approve
                            </button>
                            <button onClick={() => updateAppointmentStatus(app.id, 'Cancelled')} className="btn btn-secondary hover-lift" style={{ padding: '4px 10px', fontSize: '0.75rem', fontWeight: 600, color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px' }}>
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
                      <h4 style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 700 }}>{rep.title}</h4>
                      <p style={{ fontSize: '0.78rem', color: '#475569', marginTop: '4px' }}>{rep.desc}</p>
                    </div>

                    <button onClick={() => showToast(`Generating ${rep.title} in ${rep.type} format... File downloaded.`, 'success')} className="btn btn-secondary hover-lift" style={{ padding: '8px 14px', fontSize: '0.78rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600 }}>
                      <Download size={14} />
                      <span>Export {rep.type}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: ANALYTICS (HIGH IMPACT GRAPHICAL VIEW) */}
          {activeTab === 'analytics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#E31837', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>PREDICTIVE PLATFORM INTELLIGENCE</span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>Analytics & Market Intelligence</h2>
              </div>

              {/* Key Performance Metric Highlights */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div style={{ padding: '20px', borderRadius: '16px', background: 'linear-gradient(135deg, #0f172a, #1e293b)', border: '1px solid #334155', color: '#ffffff' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>YTD LISTINGS INVENTORY</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '6px' }}>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>219</h3>
                    <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}><TrendingUp size={12} /> +24% YTD</span>
                  </div>
                </div>

                <div style={{ padding: '20px', borderRadius: '16px', background: 'linear-gradient(135deg, #0f172a, #1e293b)', border: '1px solid #334155', color: '#ffffff' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>REGISTERED CLIENTS</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '6px' }}>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>842</h3>
                    <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}><TrendingUp size={12} /> +38% YTD</span>
                  </div>
                </div>

                <div style={{ padding: '20px', borderRadius: '16px', background: 'linear-gradient(135deg, #0f172a, #1e293b)', border: '1px solid #334155', color: '#ffffff' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>CONVERSION YIELD</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '6px' }}>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#E31837' }}>8.4%</h3>
                    <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 700 }}>+1.8% QoQ</span>
                  </div>
                </div>
              </div>

              {/* Monthly Listings & Registration Trajectory Chart */}
              <div style={{ padding: '28px', borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: 800, margin: 0 }}>Monthly Listing & Registration Trajectory</h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>YTD platform growth in new luxury inventory and registered clients</p>
                  </div>

                  {/* Interactive Legend Badges */}
                  <div style={{ display: 'flex', gap: '16px', background: '#f8fafc', padding: '6px 14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>
                      <span style={{ width: '12px', height: '12px', background: 'linear-gradient(180deg, #E31837, #991b1b)', borderRadius: '3px' }} />
                      <span>New Listings</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>
                      <span style={{ width: '12px', height: '12px', background: 'linear-gradient(180deg, #4f46e5, #1e1b4b)', borderRadius: '3px' }} />
                      <span>Registered Clients</span>
                    </div>
                  </div>
                </div>

                {/* GRAPHICAL BAR CHART WITH NUMERICAL BADGES */}
                <div style={{ height: '240px', display: 'flex', alignItems: 'flex-end', gap: '16px', paddingBottom: '24px', borderBottom: '2px solid #f1f5f9', paddingTop: '20px' }}>
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
                      <div style={{ display: 'flex', gap: '6px', height: '100%', alignItems: 'flex-end', width: '100%', justifyContent: 'center' }}>
                        
                        {/* Listings Bar */}
                        <div style={{ flex: 1, maxWidth: '22px', height: `${(item.listings / 52) * 100}%`, background: 'linear-gradient(180deg, #E31837, #991b1b)', borderRadius: '6px 6px 0 0', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', transition: 'all 0.3s' }} title={`Listings Added in ${item.month}: ${item.listings}`}>
                          <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#ffffff', marginTop: '-18px' }}>{item.listings}</span>
                        </div>

                        {/* Users Bar */}
                        <div style={{ flex: 1, maxWidth: '22px', height: `${(item.users / 220) * 100}%`, background: 'linear-gradient(180deg, #4f46e5, #1e1b4b)', borderRadius: '6px 6px 0 0', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', transition: 'all 0.3s' }} title={`Clients Registered in ${item.month}: ${item.users}`}>
                          <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#1e1b4b', marginTop: '-18px' }}>{item.users}</span>
                        </div>

                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Communities & Demand Heatmap */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                
                {/* Top Searched Luxury Communities Card */}
                <div style={{ padding: '24px', borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: 800, margin: 0 }}>Top Searched Luxury Communities</h4>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#E31837', background: '#fee2e2', padding: '2px 8px', borderRadius: '10px' }}>Live Trends</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {[
                      { rank: '#1', name: 'Bridle Path, Toronto', share: 38, count: '1,420 searches', color: 'linear-gradient(90deg, #E31837, #dc2626)' },
                      { rank: '#2', name: 'West Vancouver, BC', share: 26, count: '980 searches', color: 'linear-gradient(90deg, #4f46e5, #3b82f6)' },
                      { rank: '#3', name: 'Old Oakville, ON', share: 20, count: '740 searches', color: 'linear-gradient(90deg, #06b6d4, #0891b2)' },
                      { rank: '#4', name: 'Forest Hill, Toronto', share: 16, count: '610 searches', color: 'linear-gradient(90deg, #10b981, #059669)' }
                    ].map((c, i) => (
                      <div key={i} style={{ padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#0f172a', color: '#ffffff', fontSize: '0.72rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.rank}</span>
                            <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{c.name}</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>{c.share}%</span>
                            <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>{c.count}</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
                          <div style={{ width: `${c.share}%`, height: '100%', background: c.color, borderRadius: '99px' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Regional Demand Heatmap Card */}
                <div style={{ padding: '24px', borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: 800, marginBottom: '12px' }}>Regional Demand Heatmap</h4>
                    <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: '1.5' }}>Highest buyer intent currently concentrated in Greater Toronto Area &amp; West Vancouver waterfront estates based on live ML search heat vectors.</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                    <div style={{ padding: '12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#166534' }}>GTA Waterfront Corridor</span>
                      <span style={{ padding: '4px 10px', background: '#16a34a', color: '#ffffff', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>Heat Score: 98/100</span>
                    </div>

                    <div style={{ padding: '12px', background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#3730a3' }}>West Vancouver Benchlands</span>
                      <span style={{ padding: '4px 10px', background: '#4f46e5', color: '#ffffff', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>Heat Score: 94/100</span>
                    </div>

                    <div style={{ padding: '12px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#9f1239' }}>Muskoka Lakes Alpine</span>
                      <span style={{ padding: '4px 10px', background: '#E31837', color: '#ffffff', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>Heat Score: 89/100</span>
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
                      <h4 style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 700 }}>{n.title}</h4>
                      <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: '2px' }}>{n.message}</p>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px', display: 'block' }}>{n.date}</span>
                    </div>
                    {!n.read && (
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E31837' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: PROFILE */}
          {activeTab === 'profile' && (
            <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', border: '1px solid rgba(167, 139, 250, 0.2)', display: 'flex', flexDirection: 'column', gap: '24px', background: '#ffffff' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#E31837', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>ADMIN CREDENTIALS</span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>Managing Director Profile</h2>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #0f172a, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 800, fontSize: '1.8rem' }}>
                  {user?.name.charAt(0) || 'M'}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 800, margin: 0 }}>{user?.name || 'Marcus Aurelius (Director)'}</h3>
                  <p style={{ fontSize: '0.88rem', color: '#E31837', fontWeight: 600, margin: '2px 0 0 0' }}>{user?.email || 'admin@novaestate.ca'}</p>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block', fontWeight: 500 }}>Role: Enterprise Platform Administrator</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setIsUpdateCredentialsOpen(true)} className="btn btn-primary hover-lift" style={{ padding: '12px 24px', fontSize: '0.85rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                  <Lock size={16} />
                  <span>Update Credentials</span>
                </button>
                <button onClick={() => { logout(); showToast('Signed out of Admin Console', 'info'); }} className="btn btn-secondary hover-lift" style={{ padding: '12px 24px', fontSize: '0.85rem', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '10px', fontWeight: 600 }}>
                  Logout Admin Session
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* MODAL 1: ONBOARD LICENSED AGENT MODAL */}
      {isOnboardAgentOpen && (
        <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '520px', background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }} className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#E31837', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>REALTOR ONBOARDING</span>
                <h3 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 800, margin: '2px 0 0 0' }}>Onboard Licensed Agent</h3>
              </div>
              <button onClick={() => setIsOnboardAgentOpen(false)} style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0f172a' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleOnboardAgentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '6px' }}>Agent Full Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Karan Kang" 
                  value={newAgentName} 
                  onChange={e => setNewAgentName(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', height: '42px', color: '#0f172a', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0 12px' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '6px' }}>Email Address *</label>
                  <input 
                    type="email" 
                    placeholder="agent@royal-lepage.ca" 
                    value={newAgentEmail} 
                    onChange={e => setNewAgentEmail(e.target.value)}
                    className="form-input"
                    style={{ width: '100%', height: '42px', color: '#0f172a', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0 12px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '6px' }}>Phone Number</label>
                  <input 
                    type="text" 
                    placeholder="+1 (416) 555-0199" 
                    value={newAgentPhone} 
                    onChange={e => setNewAgentPhone(e.target.value)}
                    className="form-input"
                    style={{ width: '100%', height: '42px', color: '#0f172a', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0 12px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '6px' }}>Experience</label>
                  <input 
                    type="text" 
                    value={newAgentExperience} 
                    onChange={e => setNewAgentExperience(e.target.value)}
                    className="form-input"
                    style={{ width: '100%', height: '42px', color: '#0f172a', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0 12px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '6px' }}>Commission Rate</label>
                  <input 
                    type="text" 
                    value={newAgentCommission} 
                    onChange={e => setNewAgentCommission(e.target.value)}
                    className="form-input"
                    style={{ width: '100%', height: '42px', color: '#0f172a', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0 12px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '6px' }}>Profile Photo URL</label>
                <input 
                  type="text" 
                  value={newAgentPhoto} 
                  onChange={e => setNewAgentPhoto(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', height: '42px', color: '#0f172a', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0 12px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsOnboardAgentOpen(false)} className="btn btn-secondary" style={{ flex: 1, padding: '12px', fontSize: '0.85rem', fontWeight: 600 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '12px', fontSize: '0.85rem', fontWeight: 700, background: '#0f172a', color: '#ffffff' }}>
                  Submit Onboarding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: UPDATE CREDENTIALS MODAL */}
      {isUpdateCredentialsOpen && (
        <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '520px', background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }} className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#E31837', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>SECURITY MANAGEMENT</span>
                <h3 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 800, margin: '2px 0 0 0' }}>Update Admin Credentials</h3>
              </div>
              <button onClick={() => setIsUpdateCredentialsOpen(false)} style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0f172a' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateCredentialsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '6px' }}>Director Full Name *</label>
                <input 
                  type="text" 
                  value={credName} 
                  onChange={e => setCredName(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', height: '42px', color: '#0f172a', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0 12px' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '6px' }}>Admin Email *</label>
                  <input 
                    type="email" 
                    value={credEmail} 
                    onChange={e => setCredEmail(e.target.value)}
                    className="form-input"
                    style={{ width: '100%', height: '42px', color: '#0f172a', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0 12px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '6px' }}>Contact Phone</label>
                  <input 
                    type="text" 
                    value={credPhone} 
                    onChange={e => setCredPhone(e.target.value)}
                    className="form-input"
                    style={{ width: '100%', height: '42px', color: '#0f172a', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0 12px' }}
                  />
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>Change Security Password</span>
                
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Current Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={credCurrentPass} 
                    onChange={e => setCredCurrentPass(e.target.value)}
                    className="form-input"
                    style={{ width: '100%', height: '40px', color: '#0f172a', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0 12px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>New Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={credNewPass} 
                      onChange={e => setCredNewPass(e.target.value)}
                      className="form-input"
                      style={{ width: '100%', height: '40px', color: '#0f172a', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0 12px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Confirm Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={credConfirmPass} 
                      onChange={e => setCredConfirmPass(e.target.value)}
                      className="form-input"
                      style={{ width: '100%', height: '40px', color: '#0f172a', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0 12px' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsUpdateCredentialsOpen(false)} className="btn btn-secondary" style={{ flex: 1, padding: '12px', fontSize: '0.85rem', fontWeight: 600 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '12px', fontSize: '0.85rem', fontWeight: 700, background: '#E31837', color: '#ffffff' }}>
                  Save Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
