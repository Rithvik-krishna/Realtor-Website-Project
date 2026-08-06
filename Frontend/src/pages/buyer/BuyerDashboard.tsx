import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Heart, 
  Search, 
  Bell, 
  Calendar, 
  DollarSign, 
  GitCommit, 
  FileText, 
  Settings, 
  MapPin, 
  Plus, 
  Trash2, 
  Compass, 
  X, 
  Download, 
  Edit
} from 'lucide-react';
import { PropertyCompareModal } from '../../components/PropertyCompareModal';

export const BuyerDashboard: React.FC = () => {
  const { 
    user,
    savedProperties, 
    properties, 
    toggleSaveProperty, 
    compareList,
    toggleCompare,
    recentlyViewed,
    savedSearches,
    deleteSavedSearch,
    favoriteCommunities,
    toggleFavoriteCommunity,
    communities,
    viewingSchedule,
    rescheduleViewing,
    cancelViewing,
    addViewingNote,
    priceAlerts,
    addPriceAlert,
    togglePriceAlertStatus,
    deletePriceAlert,
    mortgageProgress,
    documents,
    appointmentHistory,
    activeOffers,
    purchaseTimeline,
    notifications,
    markNotificationAsRead,
    clearNotifications,
    setCurrentPage, 
    setSelectedPropertyId,
    setActiveFilters,
    showToast 
  } = useApp();
  
  // Dashboard 12-tab state
  type TabType = 
    | 'overview' 
    | 'saved-homes' 
    | 'saved-searches' 
    | 'favourite-communities' 
    | 'recently-viewed' 
    | 'schedule' 
    | 'offers'
    | 'timeline'
    | 'price-alerts' 
    | 'mortgage-status' 
    | 'documents' 
    | 'appointment-history' 
    | 'notifications' 
    | 'settings';

  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Modal State for Compare
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  // New Price Alert Form Modal State
  const [newAlertOpen, setNewAlertOpen] = useState(false);
  const [newAlertName, setNewAlertName] = useState('');
  const [newAlertCity, setNewAlertCity] = useState('Toronto');
  const [newAlertCondition, setNewAlertCondition] = useState('Price Drop');
  const [newAlertTargetPrice, setNewAlertTargetPrice] = useState(1500000);

  // Viewing reschedule modal state
  const [rescheduleModalId, setRescheduleModalId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('11:00 AM');

  // Viewing Note edit state
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  // Find saved property objects
  const bookmarkedProperties = properties.filter(p => savedProperties.includes(p.id));
  const recentlyViewedProperties = properties.filter(p => recentlyViewed.includes(p.id));
  const favoriteCommunityObjects = communities.filter(c => favoriteCommunities.includes(c.name));

  const handlePropertyClick = (id: string) => {
    setSelectedPropertyId(id);
    setCurrentPage('property-detail');
  };

  const handleApplySavedSearch = (s: any) => {
    setActiveFilters(s.filters);
    setCurrentPage('search');
    showToast(`Applied search criteria: ${s.name}`, 'success');
  };

  const handleCreatePriceAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlertName) return;
    addPriceAlert({
      name: newAlertName,
      conditionType: newAlertCondition,
      targetPrice: newAlertTargetPrice,
      city: newAlertCity
    });
    setNewAlertName('');
    setNewAlertOpen(false);
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (rescheduleModalId && rescheduleDate) {
      rescheduleViewing(rescheduleModalId, rescheduleDate, rescheduleTime);
      setRescheduleModalId(null);
    }
  };

  const handleSaveNote = (id: string) => {
    addViewingNote(id, noteText);
    setEditingNoteId(null);
    setNoteText('');
  };

  const tabsConfig = [
    { id: 'overview' as TabType, label: 'Overview', icon: <LayoutDashboard size={16} /> },
    { id: 'saved-homes' as TabType, label: `Saved Homes (${bookmarkedProperties.length})`, icon: <Heart size={16} /> },
    { id: 'saved-searches' as TabType, label: `Saved Searches (${savedSearches.length})`, icon: <Search size={16} /> },
    { id: 'favourite-communities' as TabType, label: `Favourite Communities (${favoriteCommunities.length})`, icon: <MapPin size={16} /> },
    { id: 'recently-viewed' as TabType, label: `Recently Viewed (${recentlyViewedProperties.length})`, icon: <Compass size={16} /> },
    { id: 'schedule' as TabType, label: `Viewing Schedule (${viewingSchedule.length})`, icon: <Calendar size={16} /> },
    { id: 'offers' as TabType, label: `Offer Center (${activeOffers.length})`, icon: <DollarSign size={16} /> },
    { id: 'timeline' as TabType, label: 'Purchase Timeline', icon: <GitCommit size={16} /> },
    { id: 'price-alerts' as TabType, label: `Price Alerts (${priceAlerts.length})`, icon: <Bell size={16} /> },
    { id: 'mortgage-status' as TabType, label: 'Mortgage Status', icon: <DollarSign size={16} /> },
    { id: 'documents' as TabType, label: `Vault Documents (${documents.length})`, icon: <FileText size={16} /> },
    { id: 'appointment-history' as TabType, label: `Appointment History (${appointmentHistory.length})`, icon: <GitCommit size={16} /> },
    { id: 'notifications' as TabType, label: `Notifications (${notifications.length})`, icon: <Bell size={16} /> },
    { id: 'settings' as TabType, label: 'Settings', icon: <Settings size={16} /> }
  ];

  return (
    <div className="fade-in" style={{ paddingTop: '16px', minHeight: '100vh', paddingBottom: '40px' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Workspace Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-lavender">BUYER WORKSPACE</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Welcome back, {user?.name || user?.email?.split('@')[0] || 'Valued Client'}</span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#ffffff', marginTop: '2px' }}>Client Command Center</h1>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setCurrentPage('search')} className="btn btn-primary hover-lift" style={{ padding: '9px 18px', fontSize: '0.82rem', borderRadius: '10px' }}>
              Explore New Listings
            </button>
          </div>
        </div>

        {/* Workspace Nav Tabs */}
        <div 
          className="tabs-nav"
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '8px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            scrollbarWidth: 'none'
          }}
        >
          {tabsConfig.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                fontSize: '0.82rem',
                whiteSpace: 'nowrap',
                borderRadius: '10px'
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Top Metric Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div className="glass-panel hover-glow" style={{ padding: '20px', border: '1px solid rgba(167, 139, 250, 0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Saved Homes</span>
                  <Heart size={18} style={{ color: 'var(--color-lavender)' }} />
                </div>
                <h3 style={{ fontSize: '2rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-display)' }}>{bookmarkedProperties.length}</h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Curated properties in vault</span>
              </div>

              <div className="glass-panel hover-glow" style={{ padding: '24px', border: '1px solid rgba(167, 139, 250, 0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Active Offers</span>
                  <DollarSign size={18} style={{ color: '#10b981' }} />
                </div>
                <h3 style={{ fontSize: '2rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-display)' }}>{activeOffers.length}</h3>
                <span style={{ fontSize: '0.72rem', color: '#10b981' }}>
                  {activeOffers.length > 0 ? `${activeOffers.length} Live Offer${activeOffers.length > 1 ? 's' : ''}` : 'No Active Offers'}
                </span>
              </div>

              <div className="glass-panel hover-glow" style={{ padding: '24px', border: '1px solid rgba(167, 139, 250, 0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Scheduled Tours</span>
                  <Calendar size={18} style={{ color: '#3b82f6' }} />
                </div>
                <h3 style={{ fontSize: '2rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-display)' }}>{viewingSchedule.length}</h3>
                <span style={{ fontSize: '0.72rem', color: '#3b82f6' }}>
                  {viewingSchedule.length > 0 ? `Next: ${viewingSchedule[0].date}` : 'No Tours Scheduled'}
                </span>
              </div>

              <div className="glass-panel hover-glow" style={{ padding: '24px', border: '1px solid rgba(167, 139, 250, 0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Active Price Alerts</span>
                  <Bell size={18} style={{ color: '#f59e0b' }} />
                </div>
                <h3 style={{ fontSize: '2rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-display)' }}>{priceAlerts.filter(a => a.status === 'Active').length}</h3>
                <span style={{ fontSize: '0.72rem', color: '#f59e0b' }}>
                  {priceAlerts.length > 0 ? 'Real-time telemetry active' : 'No Alerts Set'}
                </span>
              </div>
            </div>

            {/* Split layout: Recent Notifications + Active Offers Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }} className="overview-split">
              
              {/* Notifications box */}
              <div className="glass-panel" style={{ padding: '28px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bell size={18} style={{ color: 'var(--color-lavender)' }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff' }}>System Notifications</h3>
                  </div>
                  {notifications.length > 0 && (
                    <button onClick={clearNotifications} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.72rem', cursor: 'pointer' }} className="hover-lift">
                      Clear All
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {notifications.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>No notifications at this time.</p>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        style={{
                          background: n.read ? 'rgba(255,255,255,0.02)' : 'rgba(167,139,250,0.08)',
                          border: `1px solid ${n.read ? 'rgba(255,255,255,0.04)' : 'rgba(167,139,250,0.2)'}`,
                          padding: '14px',
                          borderRadius: '12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: n.read ? '#ffffff' : 'var(--color-lavender)' }}>{n.title}</span>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{n.date}</span>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Active Offers Summary box */}
              <div className="glass-panel" style={{ padding: '28px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <DollarSign size={18} style={{ color: '#10b981' }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff' }}>Active Purchase Offers</h3>
                  </div>
                  <button onClick={() => setActiveTab('offers')} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.72rem', borderRadius: '8px' }}>
                    View Offer Center
                  </button>
                </div>

                {activeOffers.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>No active purchase offers. Submit an offer on any listing to track status in real-time.</p>
                    <button onClick={() => setCurrentPage('search')} className="btn btn-primary hover-lift" style={{ padding: '8px 16px', fontSize: '0.78rem' }}>
                      Browse MLS Listings
                    </button>
                  </div>
                ) : (
                  activeOffers.map(o => {
                    const targetProp = properties.find(p => p.id === o.propertyId) || properties[0];
                    return (
                      <div key={o.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '16px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>{targetProp.title}</h4>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{targetProp.location}</span>
                          </div>
                          <span className="badge badge-lavender">{o.status}</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', background: 'rgba(3,7,18,0.5)', padding: '10px', borderRadius: '8px' }}>
                          <div>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Offer Amount:</span>
                            <p style={{ fontWeight: 700, color: '#ffffff' }}>${o.offerAmount.toLocaleString()}</p>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Deposit:</span>
                            <p style={{ fontWeight: 700, color: '#ffffff' }}>${o.deposit.toLocaleString()}</p>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Closing Date:</span>
                            <p style={{ fontWeight: 700, color: '#ffffff' }}>{o.closingDate}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: SAVED HOMES */}
        {activeTab === 'saved-homes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff' }}>Curated Homes Vault ({bookmarkedProperties.length})</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Compare and review bookmarked properties</p>
              </div>

              {compareList.length > 0 && (
                <button onClick={() => setCompareModalOpen(true)} className="btn btn-primary hover-lift" style={{ padding: '8px 18px', fontSize: '0.8rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <Compass size={14} />
                  <span>Open Comparison ({compareList.length})</span>
                </button>
              )}
            </div>

            {bookmarkedProperties.length === 0 ? (
              <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)' }}>
                <Heart size={36} style={{ color: 'var(--color-lavender)', opacity: 0.4, marginBottom: '16px' }} />
                <h3 style={{ fontSize: '1.15rem', color: '#ffffff' }}>Your Vault is Empty</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '380px', margin: '8px auto 20px auto', lineHeight: '1.6' }}>
                  Browse our portfolio and click the heart icon on any property card to save it here for comparison.
                </p>
                <button onClick={() => setCurrentPage('search')} className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '0.82rem' }}>
                  Search Properties
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
                {bookmarkedProperties.map(p => (
                  <div key={p.id} className="glass-panel hover-lift" style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(167, 139, 250, 0.15)' }}>
                    <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                      <img src={p.imageUrl} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      
                      <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => toggleCompare(p.id)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: compareList.includes(p.id) ? 'var(--color-lavender)' : 'rgba(3,7,18,0.8)',
                            color: compareList.includes(p.id) ? '#030712' : '#ffffff',
                            border: '1px solid rgba(255,255,255,0.15)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Toggle comparison"
                        >
                          <Compass size={14} />
                        </button>

                        <button
                          onClick={() => toggleSaveProperty(p.id)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'rgba(3,7,18,0.8)',
                            color: '#ef4444',
                            border: '1px solid rgba(255,255,255,0.15)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Remove from saved"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <span style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(3,7,18,0.85)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.65rem', color: 'var(--color-lavender)', fontWeight: 700 }}>
                        {p.category}
                      </span>
                    </div>

                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff' }}>{p.title}</h3>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                          <MapPin size={12} style={{ color: 'var(--color-lavender)' }} />
                          <span>{p.location}</span>
                        </p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-display)' }}>
                          ${p.price.toLocaleString()}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {p.beds} Beds • {p.baths} Baths • {p.sqft.toLocaleString()} SqFt
                        </span>
                      </div>

                      <button onClick={() => handlePropertyClick(p.id)} className="btn btn-primary hover-lift" style={{ width: '100%', padding: '10px', fontSize: '0.8rem', borderRadius: '10px' }}>
                        View Full Property Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SAVED SEARCHES */}
        {activeTab === 'saved-searches' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff' }}>Saved Search Criteria ({savedSearches.length})</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Instantly re-apply curated search parameters</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {savedSearches.map(s => (
                <div key={s.id} className="glass-panel" style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff' }}>{s.name}</h3>
                      <span className="badge badge-lavender" style={{ fontSize: '0.68rem' }}>{s.matchCount} Matches</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      City: {s.city} • Price Range: ${s.filters.priceRange[0].toLocaleString()} - ${s.filters.priceRange[1].toLocaleString()} • Beds: {s.filters.beds}
                    </p>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Created on {s.dateCreated}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button onClick={() => handleApplySavedSearch(s)} className="btn btn-primary hover-lift" style={{ padding: '8px 16px', fontSize: '0.78rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Search size={14} />
                      <span>Apply Search</span>
                    </button>

                    <button onClick={() => deleteSavedSearch(s.id)} className="btn btn-secondary hover-lift" style={{ padding: '8px 12px', fontSize: '0.78rem', borderRadius: '8px', color: '#ef4444' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PRICE ALERTS */}
        {activeTab === 'price-alerts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff' }}>Price & Telemetry Alerts ({priceAlerts.length})</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Receive real-time notifications when prices drop</p>
              </div>

              <button onClick={() => setNewAlertOpen(true)} className="btn btn-primary hover-lift" style={{ padding: '8px 16px', fontSize: '0.78rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={14} />
                <span>Create New Alert</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {priceAlerts.map(alert => (
                <div key={alert.id} className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff' }}>{alert.name}</h3>
                      <span className={`badge ${alert.status === 'Active' ? 'badge-lavender' : 'badge-blue'}`} style={{ fontSize: '0.68rem' }}>
                        {alert.status}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Condition: {alert.conditionType} {alert.targetPrice ? `Target: $${alert.targetPrice.toLocaleString()}` : ''} • Region: {alert.city || 'All Cities'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button onClick={() => togglePriceAlertStatus(alert.id)} className="btn btn-secondary hover-lift" style={{ padding: '6px 14px', fontSize: '0.75rem', borderRadius: '8px' }}>
                      {alert.status === 'Active' ? 'Pause Alert' : 'Activate Alert'}
                    </button>

                    <button onClick={() => deletePriceAlert(alert.id)} className="btn btn-secondary hover-lift" style={{ padding: '6px 10px', fontSize: '0.75rem', borderRadius: '8px', color: '#ef4444' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal to create new alert */}
            {newAlertOpen && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(3,7,18,0.85)', backdropFilter: 'blur(10px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '32px', borderRadius: '24px', border: '1px solid var(--color-lavender)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff' }}>Create Price Alert</h3>
                    <button onClick={() => setNewAlertOpen(false)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}><X size={18} /></button>
                  </div>

                  <form onSubmit={handleCreatePriceAlert} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="form-input-container">
                      <label className="form-label" style={{ fontSize: '0.68rem' }}>Alert Label</label>
                      <input type="text" placeholder="e.g. Toronto Waterfront Price Drop" value={newAlertName} onChange={e => setNewAlertName(e.target.value)} className="form-input" style={{ padding: '10px' }} required />
                    </div>

                    <div className="form-input-container">
                      <label className="form-label" style={{ fontSize: '0.68rem' }}>Target City</label>
                      <select value={newAlertCity} onChange={e => setNewAlertCity(e.target.value)} className="form-input" style={{ padding: '10px', background: '#070d24' }}>
                        <option value="Toronto">Toronto</option>
                        <option value="Mississauga">Mississauga</option>
                        <option value="Brampton">Brampton</option>
                        <option value="Oakville">Oakville</option>
                        <option value="Vaughan">Vaughan</option>
                      </select>
                    </div>

                    <div className="form-input-container">
                      <label className="form-label" style={{ fontSize: '0.68rem' }}>Condition Type</label>
                      <select value={newAlertCondition} onChange={e => setNewAlertCondition(e.target.value)} className="form-input" style={{ padding: '10px', background: '#070d24' }}>
                        <option value="Price Drop">Price Drop</option>
                        <option value="New Listing">New Listing</option>
                        <option value="Back on Market">Back on Market</option>
                      </select>
                    </div>

                    <div className="form-input-container">
                      <label className="form-label" style={{ fontSize: '0.68rem' }}>Target Maximum Price ($)</label>
                      <input type="number" value={newAlertTargetPrice} onChange={e => setNewAlertTargetPrice(Number(e.target.value))} className="form-input" style={{ padding: '10px' }} required />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '0.85rem' }}>Create Alert</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: VIEWING SCHEDULE */}
        {activeTab === 'schedule' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff' }}>Scheduled Property Tours ({viewingSchedule.length})</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Manage upcoming VIP tours and add private notes</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {viewingSchedule.map(v => {
                const targetProp = properties.find(p => p.id === v.propertyId) || properties[0];
                return (
                  <div key={v.id} className="glass-panel" style={{ padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <img src={targetProp.imageUrl} alt={targetProp.title} style={{ width: '90px', height: '60px', borderRadius: '10px', objectFit: 'cover' }} />
                        <div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff' }}>{targetProp.title}</h3>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                            <Calendar size={12} style={{ color: 'var(--color-lavender)' }} />
                            <span>{v.date} at {v.time} ({v.tourType.toUpperCase()})</span>
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span className={`badge ${v.status === 'Upcoming' ? 'badge-lavender' : 'badge-blue'}`}>{v.status}</span>
                        {v.status === 'Upcoming' && (
                          <>
                            <button onClick={() => { setRescheduleModalId(v.id); setRescheduleDate(v.date); setRescheduleTime(v.time); }} className="btn btn-secondary hover-lift" style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px' }}>
                              Reschedule
                            </button>
                            <button onClick={() => cancelViewing(v.id)} className="btn btn-secondary hover-lift" style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px', color: '#ef4444' }}>
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Agent & Notes Footer */}
                    <div style={{ background: 'rgba(3,7,18,0.5)', padding: '12px 16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Agent: {v.agentName} ({v.agentPhone})</span>
                      
                      {editingNoteId === v.id ? (
                        <div style={{ display: 'flex', gap: '8px', width: '100%', marginTop: '8px' }}>
                          <input type="text" value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Add private note..." className="form-input" style={{ padding: '6px 10px', fontSize: '0.78rem', flex: 1 }} />
                          <button onClick={() => handleSaveNote(v.id)} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Save</button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Note: {v.notes || 'No private notes added'}</span>
                          <button onClick={() => { setEditingNoteId(v.id); setNoteText(v.notes || ''); }} style={{ background: 'none', border: 'none', color: 'var(--color-lavender)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Edit size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reschedule Modal */}
            {rescheduleModalId && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(3,7,18,0.85)', backdropFilter: 'blur(10px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '32px', borderRadius: '24px', border: '1px solid var(--color-lavender)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff' }}>Reschedule Viewing</h3>
                    <button onClick={() => setRescheduleModalId(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}><X size={18} /></button>
                  </div>

                  <form onSubmit={handleConfirmReschedule} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="form-input-container">
                      <label className="form-label" style={{ fontSize: '0.68rem' }}>New Date</label>
                      <input type="date" value={rescheduleDate} onChange={e => setRescheduleDate(e.target.value)} className="form-input" style={{ padding: '10px' }} required />
                    </div>

                    <div className="form-input-container">
                      <label className="form-label" style={{ fontSize: '0.68rem' }}>New Time Slot</label>
                      <select value={rescheduleTime} onChange={e => setRescheduleTime(e.target.value)} className="form-input" style={{ padding: '10px', background: '#070d24' }}>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="05:30 PM">05:30 PM</option>
                      </select>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>Confirm Reschedule</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: OFFER CENTER */}
        {activeTab === 'offers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff' }}>Offer Center ({activeOffers.length})</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Review submitted agreements of purchase and sale</p>
            </div>

            {activeOffers.map(o => {
              const targetProp = properties.find(p => p.id === o.propertyId) || properties[0];
              return (
                <div key={o.id} className="glass-panel" style={{ padding: '32px', borderRadius: '24px', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff' }}>{targetProp.title}</h3>
                        <span className="badge badge-lavender">Offer #{o.id}</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{targetProp.location}</p>
                    </div>

                    <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '6px 14px', fontSize: '0.8rem', fontWeight: 700 }}>
                      STATUS: {o.status.toUpperCase()}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', background: 'rgba(3,7,18,0.6)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Offer Amount</span>
                      <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-display)', marginTop: '4px' }}>${o.offerAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Deposit Amount</span>
                      <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-display)', marginTop: '4px' }}>${o.deposit.toLocaleString()}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target Closing</span>
                      <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-display)', marginTop: '4px' }}>{o.closingDate}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Irrevocable Until</span>
                      <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-display)', marginTop: '4px' }}>{o.irrevocableDate}</p>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '8px' }}>Offer Conditions</h4>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {o.conditions.map(c => (
                        <span key={c} style={{ background: 'rgba(167, 139, 250, 0.08)', border: '1px solid rgba(167, 139, 250, 0.2)', color: 'var(--color-lavender)', padding: '4px 12px', borderRadius: '8px', fontSize: '0.75rem' }}>
                          ✓ {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Submitted on {o.dateSubmitted}</span>
                    <button onClick={() => showToast('Downloading Official Agreement PDF document...', 'success')} className="btn btn-secondary hover-lift" style={{ padding: '8px 18px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Download size={14} />
                      <span>Download Executed Offer PDF</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 7: PURCHASE TIMELINE */}
        {activeTab === 'timeline' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff' }}>Purchase Progress & Escrow Milestones</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>End-to-end milestone tracker for property acquisition</p>
            </div>

            <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
                {purchaseTimeline.map((step, idx) => (
                  <div key={step.stepId} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: step.status === 'completed' ? '#10b981' : step.status === 'active' ? 'var(--color-lavender)' : 'rgba(255,255,255,0.05)',
                        color: step.status === 'completed' || step.status === 'active' ? '#030712' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.85rem'
                      }}>
                        {step.status === 'completed' ? '✓' : idx + 1}
                      </div>
                      {idx < purchaseTimeline.length - 1 && (
                        <div style={{ width: '2px', height: '36px', background: step.status === 'completed' ? '#10b981' : 'rgba(255,255,255,0.08)', margin: '4px 0' }} />
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: step.status === 'pending' ? 'var(--text-muted)' : '#ffffff' }}>
                          {step.title}
                        </h4>
                        {step.dateCompleted && (
                          <span style={{ fontSize: '0.72rem', color: '#10b981' }}>Completed {step.dateCompleted}</span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: DOCUMENTS VAULT */}
        {activeTab === 'documents' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff' }}>Encrypted Vault Storage ({documents.length})</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>All legal disclosures, mortgage pre-approvals, and inspection reports</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {documents.map(doc => (
                <div key={doc.id} className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <FileText size={24} style={{ color: 'var(--color-lavender)' }} />
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>{doc.name}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Category: {doc.category} • Size: {doc.size} • Uploaded {doc.date}</p>
                    </div>
                  </div>

                  <button onClick={() => showToast(`Downloading ${doc.name}`, 'success')} className="btn btn-secondary hover-lift" style={{ padding: '8px 16px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Download size={14} />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: FAVOURITE COMMUNITIES */}
        {activeTab === 'favourite-communities' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff' }}>Favourite Communities ({favoriteCommunityObjects.length})</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Track neighborhood metrics, average prices, and school ratings</p>
            </div>

            {favoriteCommunityObjects.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <MapPin size={32} style={{ color: 'var(--color-lavender)', opacity: 0.5, marginBottom: '12px' }} />
                <h3 style={{ color: '#ffffff', fontSize: '1.1rem' }}>No Favorite Communities Yet</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '6px' }}>Save communities from search or property pages to track neighborhood insights.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {favoriteCommunityObjects.map((comm) => (
                  <div key={comm.name} className="glass-panel hover-lift" style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(167, 139, 250, 0.15)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: '160px', position: 'relative' }}>
                      <img src={comm.imageUrl} alt={comm.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(7,13,36,0.9) 100%)' }} />
                      <button
                        onClick={() => toggleFavoriteCommunity(comm.name)}
                        style={{ position: 'absolute', top: '12px', right: '12px', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(3,7,18,0.8)', border: '1px solid rgba(255,255,255,0.15)', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Trash2 size={14} />
                      </button>
                      <div style={{ position: 'absolute', bottom: '12px', left: '16px' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--color-lavender)', textTransform: 'uppercase', fontWeight: 700 }}>{comm.city}</span>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff' }}>{comm.name}</h3>
                      </div>
                    </div>
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'space-between' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.78rem' }}>
                        <div>
                          <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>Avg Price</span>
                          <span style={{ color: '#ffffff', fontWeight: 600 }}>{comm.averagePrice}</span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>Market Trend</span>
                          <span style={{ color: '#22c55e', fontWeight: 600 }}>{comm.marketTrend}</span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>Walk Score</span>
                          <span style={{ color: '#ffffff', fontWeight: 600 }}>{comm.walkScore} / 100</span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>School Score</span>
                          <span style={{ color: '#ffffff', fontWeight: 600 }}>{comm.schoolRating} / 10</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setActiveFilters({ city: comm.city, beds: 'All', priceRange: [0, 50000000], category: 'All' });
                          setCurrentPage('search');
                        }}
                        className="btn btn-secondary hover-lift"
                        style={{ width: '100%', padding: '8px', fontSize: '0.78rem', marginTop: '6px' }}
                      >
                        Explore Homes in {comm.name}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: RECENTLY VIEWED */}
        {activeTab === 'recently-viewed' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff' }}>Recently Viewed Properties ({recentlyViewedProperties.length})</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Properties you recently inspected in your buyer session</p>
            </div>

            {recentlyViewedProperties.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Compass size={32} style={{ color: 'var(--color-lavender)', opacity: 0.5, marginBottom: '12px' }} />
                <h3 style={{ color: '#ffffff', fontSize: '1.1rem' }}>No Recently Viewed Properties</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '6px' }}>Explore the property catalog to automatically build your viewing history.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {recentlyViewedProperties.map(prop => (
                  <div key={prop.id} onClick={() => handlePropertyClick(prop.id)} className="glass-panel hover-lift" style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(167, 139, 250, 0.15)', cursor: 'pointer' }}>
                    <div style={{ height: '160px', position: 'relative' }}>
                      <img src={prop.imageUrl} alt={prop.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(7,13,36,0.85) 100%)' }} />
                      <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(3,7,18,0.85)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.65rem', color: 'var(--color-lavender)', fontWeight: 700 }}>
                        {prop.city}
                      </span>
                    </div>
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 600 }}>{prop.title}</h4>
                      <p style={{ color: 'var(--color-lavender)', fontSize: '1.1rem', fontWeight: 700 }}>${prop.price.toLocaleString()}</p>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <span>{prop.beds} Beds</span> • <span>{prop.baths} Baths</span> • <span>{prop.sqft} SqFt</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: MORTGAGE STATUS */}
        {activeTab === 'mortgage-status' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff' }}>Mortgage Pre-Approval Pipeline</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Verified pre-approval limits and lender documentation status</p>
            </div>

            <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', border: '1px solid rgba(167, 139, 250, 0.2)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <span className="badge badge-lavender" style={{ marginBottom: '6px', display: 'inline-block' }}>LENDER STATUS</span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#ffffff' }}>Royal Bank of Canada (RBC) Pre-Approved</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Pre-Approval Rate Guarantee: 4.25% Fixed (Locked until Sept 30, 2026)</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>QUALIFIED PURCHASING CAPITAL</span>
                  <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-lavender)', fontFamily: 'var(--font-display)' }}>$4,000,000</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#ffffff', marginBottom: '8px' }}>
                  <span>Approval Progress Stage ({mortgageProgress.stage})</span>
                  <span>75% Complete</span>
                </div>
                <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ width: '75%', height: '100%', background: 'linear-gradient(90deg, #818cf8 0%, #c084fc 100%)', borderRadius: '10px', transition: '0.6s' }} />
                </div>
              </div>

              {/* Document Checklist */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff', marginBottom: '14px' }}>Underwriting Checklist</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                  {[
                    { label: 'T4 & Tax Assessment Statements', status: 'Verified' },
                    { label: 'Proof of Down Payment Funds', status: 'Verified' },
                    { label: 'Employment Verification Letter', status: 'Verified' },
                    { label: 'Credit Score Bureau Pull (790)', status: 'Approved' }
                  ].map((item, idx) => (
                    <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '12px 16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: '#ffffff' }}>{item.label}</span>
                      <span style={{ fontSize: '0.68rem', color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: APPOINTMENT HISTORY */}
        {activeTab === 'appointment-history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff' }}>Appointment & Viewing History ({appointmentHistory.length})</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Log of completed property tours and advisory consultations</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {appointmentHistory.map((appt) => (
                <div key={appt.id} className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <span className="badge badge-lavender" style={{ fontSize: '0.65rem', marginBottom: '4px', display: 'inline-block' }}>Viewing Consultation</span>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff' }}>{appt.propertyTitle}</h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{appt.date} at {appt.time} • Agent: {appt.agentName}</p>
                    {appt.feedback && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '6px' }}>"{appt.feedback}"</p>
                    )}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: appt.status === 'Completed' ? '#22c55e' : '#f59e0b', background: appt.status === 'Completed' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', padding: '4px 12px', borderRadius: '8px', fontWeight: 700 }}>
                    {appt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff' }}>Buyer Notification Center ({notifications.length})</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Real-time alerts for price changes, tour confirmations, and market updates</p>
              </div>
              {notifications.length > 0 && (
                <button onClick={clearNotifications} className="btn btn-secondary hover-lift" style={{ padding: '8px 16px', fontSize: '0.78rem' }}>
                  Clear All Notifications
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {notifications.length === 0 ? (
                <div style={{ padding: '60px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <Bell size={32} style={{ color: 'var(--color-lavender)', opacity: 0.5, marginBottom: '12px' }} />
                  <h3 style={{ color: '#ffffff', fontSize: '1.1rem' }}>No Active Notifications</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '6px' }}>You're all caught up! New price alerts and tour updates will appear here.</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationAsRead(notif.id)}
                    className="glass-panel hover-lift"
                    style={{
                      padding: '18px 20px',
                      borderRadius: '16px',
                      border: `1px solid ${notif.read ? 'rgba(255,255,255,0.05)' : 'rgba(167,139,250,0.3)'}`,
                      background: notif.read ? 'rgba(7,13,36,0.4)' : 'rgba(167,139,250,0.06)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <Bell size={18} style={{ color: notif.read ? 'var(--text-muted)' : 'var(--color-lavender)', flexShrink: 0 }} />
                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>{notif.title}</h4>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{notif.message}</p>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>{notif.date}</span>
                      </div>
                    </div>
                    {!notif.read && (
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-lavender)', flexShrink: 0 }} />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        {activeTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff' }}>Account & Financing Preferences</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Manage your profile credentials and default pre-approval parameters</p>
            </div>

            <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-input-container">
                <label className="form-label" style={{ fontSize: '0.7rem' }}>Full Name</label>
                <input type="text" key={user?.name} defaultValue={user?.name || user?.email?.split('@')[0] || ''} className="form-input" style={{ padding: '10px' }} />
              </div>

              <div className="form-input-container">
                <label className="form-label" style={{ fontSize: '0.7rem' }}>Email Address</label>
                <input type="email" key={user?.email} defaultValue={user?.email || ''} className="form-input" style={{ padding: '10px' }} />
              </div>

              <div className="form-input-container">
                <label className="form-label" style={{ fontSize: '0.7rem' }}>Pre-Approval Qualification Capital ($)</label>
                <input type="number" defaultValue={4000000} className="form-input" style={{ padding: '10px' }} />
              </div>

              <button onClick={() => showToast('Profile preferences updated successfully', 'success')} className="btn btn-primary" style={{ padding: '12px', fontSize: '0.85rem' }}>
                Save Profile Changes
              </button>
            </div>
          </div>
        )}

      </div>

      <PropertyCompareModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
      />

      <style>{`
        @media (max-width: 900px) {
          .overview-split { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
