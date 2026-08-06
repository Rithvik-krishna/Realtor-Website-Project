import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, TrendingUp, Calendar, FileText, MessageSquare, Bell, Settings, Phone, Mail, Video, DollarSign, Award, Layers, X, Send, Sparkles, Building2, Download, Copy, ExternalLink } from 'lucide-react';

export const SellerDashboard: React.FC = () => {
  const { 
    currentValuationData, 
    sellerEvaluationBookings, 
    cancelSellerEvaluationBooking, 
    rescheduleSellerEvaluationBooking, 
    notifications, 
    markNotificationAsRead, 
    clearNotifications, 
    showToast 
  } = useApp();

  type TabType = 
    | 'overview' 
    | 'property-value' 
    | 'local-trends' 
    | 'comparable-sales' 
    | 'demand-score' 
    | 'suggested-price' 
    | 'evaluation-bookings' 
    | 'documents' 
    | 'messages' 
    | 'notifications' 
    | 'saved-reports' 
    | 'account-settings' 
    | 'contact-agent';

  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Filter / Sort state for Comparable Sales
  const [compFilterCity, setCompFilterCity] = useState('All');
  const [compSortBy, setCompSortBy] = useState<'price' | 'date' | 'sqft'>('price');
  const [selectedCompForModal, setSelectedCompForModal] = useState<any | null>(null);

  // Reschedule Modal State
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('10:00 AM');

  // Agent Contact Modals State
  const [activeAgentModal, setActiveAgentModal] = useState<'call' | 'email' | 'video' | null>(null);
  const [callbackPhone, setCallbackPhone] = useState('+1 (416) 555-0199');
  const [callbackSlot, setCallbackTimeSlot] = useState('ASAP (Within 15 Mins)');

  const [emailSubject, setEmailSubject] = useState('Inquiry regarding 102 Radcliffe Ridge Evaluation');
  const [emailBody, setEmailBody] = useState('Hi Elena,\n\nI would like to discuss our property valuation strategy and next steps for listing 102 Radcliffe Ridge on MLS.\n\nBest regards,');
  const [emailPriority, setEmailPriority] = useState('High');

  // Vault Document Preview State
  const [previewDoc, setPreviewDoc] = useState<any | null>(null);

  // Chat message state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'agent', text: 'Hello! I am Elena Rostova, your Managing Partner. How can I assist with your listing today?', time: '10:15 AM' },
    { sender: 'user', text: 'Hi Elena, I reviewed the AI valuation report for 102 Radcliffe Ridge. Is $4,850,000 realistic in this quarter?', time: '10:18 AM' },
    { sender: 'agent', text: 'Absolutely. With 42 matched VIP buyers in Toronto and only 1.8 months of supply, $4.85M is a solid target.', time: '10:20 AM' }
  ]);

  const val = currentValuationData;

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = { sender: 'user', text: chatInput, time: 'Just now' };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        sender: 'agent',
        text: 'Thank you! I have noted this request in your seller ledger and will call you shortly.',
        time: 'Just now'
      }]);
    }, 1000);
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (rescheduleId && newDate) {
      rescheduleSellerEvaluationBooking(rescheduleId, newDate, newTime);
      setRescheduleId(null);
    }
  };

  const tabsConfig = [
    { id: 'overview' as TabType, label: 'Overview', icon: <LayoutDashboard size={16} /> },
    { id: 'property-value' as TabType, label: 'Property Value', icon: <DollarSign size={16} /> },
    { id: 'local-trends' as TabType, label: 'Local Market Trends', icon: <TrendingUp size={16} /> },
    { id: 'comparable-sales' as TabType, label: 'Comparable Sales', icon: <Building2 size={16} /> },
    { id: 'demand-score' as TabType, label: 'Demand Score', icon: <Award size={16} /> },
    { id: 'suggested-price' as TabType, label: 'Suggested Price', icon: <Sparkles size={16} /> },
    { id: 'evaluation-bookings' as TabType, label: `Evaluation Bookings (${sellerEvaluationBookings.length})`, icon: <Calendar size={16} /> },
    { id: 'documents' as TabType, label: 'Vault Documents (5)', icon: <FileText size={16} /> },
    { id: 'messages' as TabType, label: 'Messages', icon: <MessageSquare size={16} /> },
    { id: 'notifications' as TabType, label: `Notifications (${notifications.length})`, icon: <Bell size={16} /> },
    { id: 'saved-reports' as TabType, label: 'Saved Reports (2)', icon: <Layers size={16} /> },
    { id: 'account-settings' as TabType, label: 'Account Settings', icon: <Settings size={16} /> },
    { id: 'contact-agent' as TabType, label: 'Contact Agent', icon: <Phone size={16} /> }
  ];

  // Mock comparable sales dataset
  const compsList = [
    { id: 'cs-1', address: '108 Radcliffe Ridge', city: 'Toronto', price: 4890000, beds: 5, baths: 6, sqft: 6700, date: '2026-07-15', status: 'Sold' },
    { id: 'cs-2', address: '94 Highland Crescent', city: 'Toronto', price: 4700000, beds: 4, baths: 5, sqft: 6200, date: '2026-06-28', status: 'Sold' },
    { id: 'cs-3', address: '112 Bridle Path Ave', city: 'Toronto', price: 5150000, beds: 6, baths: 7, sqft: 7400, date: '2026-07-20', status: 'Pending' },
    { id: 'cs-4', address: '42 Lakeshore Blvd', city: 'Oakville', price: 5400000, beds: 5, baths: 6, sqft: 7100, date: '2026-07-02', status: 'Sold' },
    { id: 'cs-5', address: '210 Point Grey Rd', city: 'Vancouver', price: 8200000, beds: 6, baths: 8, sqft: 8500, date: '2026-07-18', status: 'Sold' }
  ];

  const filteredComps = compsList
    .filter(c => compFilterCity === 'All' || c.city === compFilterCity)
    .sort((a, b) => {
      if (compSortBy === 'price') return b.price - a.price;
      if (compSortBy === 'sqft') return b.sqft - a.sqft;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return (
    <div className="fade-in" style={{ paddingTop: '90px', minHeight: '100vh', paddingBottom: '80px' }}>
      <div className="container responsive-dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '30px', alignItems: 'start' }}>
        
        {/* SIDEBAR NAVIGATION */}
        <div className="glass-panel" style={{ padding: '16px', borderRadius: '20px', border: '1px solid rgba(167, 139, 250, 0.2)', position: 'sticky', top: '100px' }}>
          <div style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--color-lavender)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>EXECUTIVE CONSOLE</span>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff', marginTop: '2px' }}>Seller Dashboard</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {tabsConfig.map(tab => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: active ? 'linear-gradient(90deg, rgba(167, 139, 250, 0.2) 0%, rgba(167, 139, 250, 0.05) 100%)' : 'none',
                    border: 'none',
                    borderLeft: active ? '3px solid var(--color-lavender)' : '3px solid transparent',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: active ? '#ffffff' : 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    fontWeight: active ? 600 : 400,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: '0.2s'
                  }}
                  className="hover-lift"
                >
                  <span style={{ color: active ? 'var(--color-lavender)' : 'var(--text-muted)' }}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN DASHBOARD CONTENT AREA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#ffffff' }}>Divestment Portfolio Overview</h1>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Real-time status for <strong>{val.address}</strong> ({val.city}, {val.province})
                </p>
              </div>

              {/* Stats Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>ESTIMATED VALUE</span>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-lavender)', marginTop: '4px' }}>
                    ${(val.estimatedValue || 4850000).toLocaleString()}
                  </h3>
                  <span style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', gap: '4px', marginTop: '4px' }}>
                    <TrendingUp size={12} /> +5.4% YoY Appreciation
                  </span>
                </div>

                <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>BUYER DEMAND SCORE</span>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>94/100</h3>
                  <span style={{ fontSize: '0.7rem', color: '#10b981' }}>High Density (42 Matched)</span>
                </div>

                <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>PAGE IMPRESSIONS</span>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>1,420</h3>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>38 Bookmarked as Favorite</span>
                </div>
              </div>

              {/* Quick Jump Shortcuts */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <button onClick={() => setActiveTab('suggested-price')} className="btn btn-secondary hover-lift" style={{ padding: '12px', fontSize: '0.8rem', textAlign: 'center' }}>
                  Review Suggested Price
                </button>
                <button onClick={() => setActiveTab('evaluation-bookings')} className="btn btn-secondary hover-lift" style={{ padding: '12px', fontSize: '0.8rem', textAlign: 'center' }}>
                  View Evaluation Visits ({sellerEvaluationBookings.length})
                </button>
                <button onClick={() => setActiveTab('messages')} className="btn btn-primary hover-lift" style={{ padding: '12px', fontSize: '0.8rem', textAlign: 'center' }}>
                  Message Agent Elena
                </button>
              </div>

              {/* Quick Agent Contact Card */}
              <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff' }}>Contact Your Assigned Agent</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Senior Partner Elena Rostova • Direct Line +1 (416) 555-0199</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px' }}>
                  <button onClick={() => setActiveAgentModal('call')} className="btn btn-secondary hover-lift" style={{ padding: '14px', textAlign: 'center', color: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <Phone size={18} style={{ color: 'var(--color-lavender)' }} />
                    <span>Call Agent</span>
                  </button>

                  <button onClick={() => setActiveAgentModal('email')} className="btn btn-secondary hover-lift" style={{ padding: '14px', textAlign: 'center', color: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <Mail size={18} style={{ color: 'var(--color-lavender)' }} />
                    <span>Send Email</span>
                  </button>

                  <button onClick={() => setActiveAgentModal('video')} className="btn btn-secondary hover-lift" style={{ padding: '14px', textAlign: 'center', color: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <Video size={18} style={{ color: 'var(--color-lavender)' }} />
                    <span>Video Call</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROPERTY VALUE */}
          {activeTab === 'property-value' && (
            <div className="glass-panel" style={{ padding: '32px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#ffffff' }}>Property Value & Historical Appreciation</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Valuation breakdown for {val.address}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CURRENT ESTIMATE</span>
                  <h3 style={{ fontSize: '1.6rem', color: 'var(--color-lavender)', fontWeight: 700 }}>${(val.estimatedValue || 4850000).toLocaleString()}</h3>
                </div>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CONFIDENCE SCORE</span>
                  <h3 style={{ fontSize: '1.6rem', color: '#ffffff', fontWeight: 700 }}>{val.confidenceScore || 96}% Precision</h3>
                </div>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ESTIMATED DAYS ON MARKET</span>
                  <h3 style={{ fontSize: '1.6rem', color: '#ffffff', fontWeight: 700 }}>{val.daysOnMarket || 18} Days</h3>
                </div>
              </div>

              {/* Price Growth History Timeline */}
              <div style={{ background: 'rgba(3,7,18,0.6)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: '12px' }}>Historical Price Progression Timeline</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span>2022 Acquisition / Construction</span>
                    <span style={{ color: '#ffffff', fontWeight: 600 }}>$3,800,000</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span>2024 Renovations Completed (Kitchen & Spa)</span>
                    <span style={{ color: '#ffffff', fontWeight: 600 }}>+$240,000 added value</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span>2026 Active Market Valuation</span>
                    <span style={{ color: 'var(--color-lavender)', fontWeight: 700 }}>${(val.estimatedValue || 4850000).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LOCAL MARKET TRENDS */}
          {activeTab === 'local-trends' && (
            <div className="glass-panel" style={{ padding: '32px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#ffffff' }}>Local Market Trends ({val.city})</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Regional market metrics & inventory indices</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>AVG SELLING PRICE</span>
                  <h3 style={{ fontSize: '1.5rem', color: '#ffffff', fontWeight: 700, marginTop: '4px' }}>$4,250,000</h3>
                </div>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>MONTHLY GROWTH</span>
                  <h3 style={{ fontSize: '1.5rem', color: '#10b981', fontWeight: 700, marginTop: '4px' }}>+1.2%</h3>
                </div>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>INVENTORY LEVEL</span>
                  <h3 style={{ fontSize: '1.5rem', color: '#ffffff', fontWeight: 700, marginTop: '4px' }}>1.8 Months</h3>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-lavender)' }}>Seller Market</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COMPARABLE SALES */}
          {activeTab === 'comparable-sales' && (
            <div className="glass-panel" style={{ padding: '32px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#ffffff' }}>Comparable Nearby Sales</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Filtered transactional benchmarks</p>
                </div>

                {/* Filter & Sort Controls */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <select value={compFilterCity} onChange={e => setCompFilterCity(e.target.value)} className="form-input" style={{ padding: '8px 12px', fontSize: '0.8rem', background: '#070d24' }}>
                    <option value="All">All Cities</option>
                    <option value="Toronto">Toronto</option>
                    <option value="Oakville">Oakville</option>
                    <option value="Vancouver">Vancouver</option>
                  </select>

                  <select value={compSortBy} onChange={e => setCompSortBy(e.target.value as any)} className="form-input" style={{ padding: '8px 12px', fontSize: '0.8rem', background: '#070d24' }}>
                    <option value="price">Sort by Price</option>
                    <option value="sqft">Sort by Sq Ft</option>
                    <option value="date">Sort by Date</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredComps.map(c => (
                  <div key={c.id} style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 600 }}>{c.address} ({c.city})</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.beds} Beds • {c.baths} Baths • {c.sqft.toLocaleString()} Sq Ft • Sold {c.date}</p>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-lavender)' }}>${c.price.toLocaleString()}</span>
                      <button onClick={() => setSelectedCompForModal(c)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                        Compare
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: DEMAND SCORE */}
          {activeTab === 'demand-score' && (
            <div className="glass-panel" style={{ padding: '32px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#ffffff' }}>Buyer Demand Score & Heat Index</h2>
              <div style={{ padding: '24px', background: 'rgba(167, 139, 250, 0.1)', border: '1px solid var(--color-lavender)', borderRadius: '16px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-lavender)', fontWeight: 600 }}>REGIONAL DEMAND SCORE</span>
                <h2 style={{ fontSize: '3rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-display)', margin: '8px 0' }}>94 / 100</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>42 Active VIP Buyers Matched with Your Property Criteria</p>
              </div>
            </div>
          )}

          {/* TAB 6: SUGGESTED PRICE */}
          {activeTab === 'suggested-price' && (
            <div className="glass-panel" style={{ padding: '32px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#ffffff' }}>AI Suggested Pricing Strategies</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Detailed listing strategy recommendations</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                <div style={{ padding: '20px', background: 'rgba(167,139,250,0.1)', border: '1px solid var(--color-lavender)', borderRadius: '14px' }}>
                  <span className="badge badge-lavender">RECOMMENDED</span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', marginTop: '8px' }}>${(val.suggestedSellingPrice || 4750000).toLocaleString()}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>18-day average closing speed target</p>
                </div>

                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PREMIUM LISTING</span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', marginTop: '8px' }}>${((val.suggestedSellingPrice || 4750000) + 250000).toLocaleString()}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Maximum yield target (45-60 days)</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: EVALUATION BOOKINGS */}
          {activeTab === 'evaluation-bookings' && (
            <div className="glass-panel" style={{ padding: '32px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#ffffff' }}>In-Person Evaluation Appointments</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Manage scheduled physical appraisals and inspections</p>
              </div>

              {sellerEvaluationBookings.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No evaluation visits booked yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {sellerEvaluationBookings.map(b => (
                    <div key={b.id} style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span className={`badge ${b.status === 'Upcoming' ? 'badge-lavender' : 'badge-secondary'}`}>{b.status}</span>
                          <span style={{ fontSize: '0.88rem', color: '#ffffff', fontWeight: 600 }}>{b.date} at {b.time}</span>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{b.address}</p>
                        {b.notes && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Note: {b.notes}</p>}
                      </div>

                      {b.status === 'Upcoming' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => setRescheduleId(b.id)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Reschedule</button>
                          <button onClick={() => cancelSellerEvaluationBooking(b.id)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem', color: '#ef4444' }}>Cancel</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: VAULT DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="glass-panel" style={{ padding: '32px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#ffffff' }}>Encrypted Vault Documents</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Title searches, inspection records, and draft listing agreements</p>
              </div>

              {[
                { name: 'AI Valuation Report - Confidential Audit.pdf', date: '2026-07-26', size: '3.2 MB' },
                { name: 'Property Disclosure & Land Title Search.pdf', date: '2026-07-20', size: '4.8 MB' },
                { name: 'Architectural Floor Plans & 3D Renderings.zip', date: '2026-07-15', size: '18.4 MB' }
              ].map((doc, idx) => (
                <div key={idx} style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FileText size={20} style={{ color: 'var(--color-lavender)' }} />
                    <div>
                      <h4 style={{ fontSize: '0.88rem', color: '#ffffff', fontWeight: 600 }}>{doc.name}</h4>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Uploaded {doc.date} • {doc.size}</span>
                    </div>
                  </div>
                  <button onClick={() => setPreviewDoc(doc)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <Download size={14} />
                    <span>View / Download</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 9: MESSAGES */}
          {activeTab === 'messages' && (
            <div className="glass-panel" style={{ padding: '32px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#ffffff' }}>Agent Messaging Thread</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Direct encrypted communication with Senior Partner Elena Rostova</p>
              </div>

              <div style={{ height: '280px', background: 'rgba(3,7,18,0.6)', borderRadius: '14px', padding: '16px', border: '1px solid rgba(255,255,255,0.04)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {chatMessages.map((m, idx) => (
                  <div key={idx} style={{ alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '75%', padding: '10px 14px', borderRadius: '12px', background: m.sender === 'user' ? 'var(--color-blue-primary)' : 'rgba(167, 139, 250, 0.15)', border: `1px solid ${m.sender === 'user' ? 'rgba(255,255,255,0.2)' : 'rgba(167,139,250,0.2)'}` }}>
                    <p style={{ fontSize: '0.82rem', color: '#ffffff', margin: 0 }}>{m.text}</p>
                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px', display: 'block', textAlign: 'right' }}>{m.time}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '10px' }}>
                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type a message to Elena Rostova..." className="form-input" style={{ fontSize: '0.85rem', background: '#070d24' }} />
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px' }}>
                  <Send size={16} />
                </button>
              </form>
            </div>
          )}

          {/* TAB 10: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="glass-panel" style={{ padding: '32px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#ffffff' }}>Notifications & Alerts</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Market updates and booking activity</p>
                </div>
                <button onClick={clearNotifications} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>Clear All</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {notifications.map(n => (
                  <div key={n.id} onClick={() => markNotificationAsRead(n.id)} style={{ padding: '14px', background: n.read ? 'rgba(255,255,255,0.01)' : 'rgba(167, 139, 250, 0.08)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                    <h4 style={{ fontSize: '0.88rem', color: '#ffffff', fontWeight: 600 }}>{n.title}</h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{n.message}</p>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>{n.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 11: SAVED REPORTS */}
          {activeTab === 'saved-reports' && (
            <div className="glass-panel" style={{ padding: '32px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#ffffff' }}>Saved Valuation Reports</h2>
              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 600 }}>AI Valuation Report - {val.address}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Generated {new Date().toLocaleDateString()} • Estimated ${ (val.estimatedValue || 4850000).toLocaleString() }</p>
                </div>
                <button onClick={() => showToast('Opening Report PDF...', 'info')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>View Report</button>
              </div>
            </div>
          )}

          {/* TAB 12: ACCOUNT SETTINGS */}
          {activeTab === 'account-settings' && (
            <div className="glass-panel" style={{ padding: '32px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#ffffff' }}>Seller Workspace Settings</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Manage notification channels and account security preferences.</p>
              <button onClick={() => showToast('Settings saved successfully.', 'success')} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem', width: '200px' }}>
                Save Settings
              </button>
            </div>
          )}

          {/* TAB 13: CONTACT AGENT */}
          {activeTab === 'contact-agent' && (
            <div className="glass-panel" style={{ padding: '32px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#ffffff' }}>Contact Your Assigned Agent</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Senior Partner Elena Rostova</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
                <button onClick={() => setActiveAgentModal('call')} className="btn btn-secondary hover-lift" style={{ padding: '20px', textAlign: 'center', color: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <Phone size={22} style={{ color: 'var(--color-lavender)' }} />
                  <span style={{ fontWeight: 600 }}>Call Agent</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>+1 (416) 555-0199</span>
                </button>

                <button onClick={() => setActiveAgentModal('email')} className="btn btn-secondary hover-lift" style={{ padding: '20px', textAlign: 'center', color: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <Mail size={22} style={{ color: 'var(--color-lavender)' }} />
                  <span style={{ fontWeight: 600 }}>Send Email</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>elena@novaestate.ca</span>
                </button>

                <button onClick={() => setActiveAgentModal('video')} className="btn btn-secondary hover-lift" style={{ padding: '20px', textAlign: 'center', color: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <Video size={22} style={{ color: 'var(--color-lavender)' }} />
                  <span style={{ fontWeight: 600 }}>Video Call</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Virtual Room Active</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Reschedule Modal */}
      {rescheduleId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '28px', borderRadius: '20px', border: '1px solid var(--color-lavender)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff' }}>Reschedule Evaluation Visit</h3>
              <button onClick={() => setRescheduleId(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleConfirmReschedule} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-input-container">
                <label className="form-label" style={{ fontSize: '0.65rem' }}>New Target Date</label>
                <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="form-input" required />
              </div>

              <div className="form-input-container">
                <label className="form-label" style={{ fontSize: '0.65rem' }}>New Time Slot</label>
                <select value={newTime} onChange={e => setNewTime(e.target.value)} className="form-input" style={{ background: '#070d24' }}>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="05:00 PM">05:00 PM</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '10px', fontSize: '0.82rem', marginTop: '10px' }}>
                Confirm Reschedule
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Comparable Side-by-Side Comparison Modal */}
      {selectedCompForModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '28px', borderRadius: '20px', border: '1px solid var(--color-lavender)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff' }}>Side-by-Side Valuation Benchmark</h3>
              <button onClick={() => setSelectedCompForModal(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.8rem' }}>
              <div style={{ padding: '12px', background: 'rgba(167,139,250,0.1)', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-lavender)', fontWeight: 600 }}>YOUR PROPERTY</span>
                <h4 style={{ color: '#ffffff', fontWeight: 600, marginTop: '4px' }}>{val.address}</h4>
                <p style={{ color: 'var(--color-lavender)', fontWeight: 700, marginTop: '4px' }}>${(val.estimatedValue || 4850000).toLocaleString()}</p>
                <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>{val.sqft.toLocaleString()} Sq Ft</p>
              </div>

              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>NEARBY BENCHMARK</span>
                <h4 style={{ color: '#ffffff', fontWeight: 600, marginTop: '4px' }}>{selectedCompForModal.address}</h4>
                <p style={{ color: '#ffffff', fontWeight: 700, marginTop: '4px' }}>${selectedCompForModal.price.toLocaleString()}</p>
                <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>{selectedCompForModal.sqft.toLocaleString()} Sq Ft</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CALL AGENT MODAL */}
      {activeAgentModal === 'call' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '28px', borderRadius: '20px', border: '1px solid var(--color-lavender)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={22} style={{ color: 'var(--color-lavender)' }} />
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#ffffff' }}>Call Senior Partner</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Elena Rostova • Direct Line</p>
                </div>
              </div>
              <button onClick={() => setActiveAgentModal(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ padding: '16px', background: 'rgba(167, 139, 250, 0.1)', borderRadius: '12px', border: '1px solid rgba(167, 139, 250, 0.2)', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-lavender)', fontWeight: 600 }}>DIRECT REALTOR PHONE</span>
                <h4 style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 700, marginTop: '2px' }}>+1 (416) 555-0199</h4>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('+1 (416) 555-0199');
                  showToast('Phone number +1 (416) 555-0199 copied to clipboard!', 'success');
                }}
                className="btn btn-secondary"
                style={{ padding: '8px 12px', fontSize: '0.75rem', display: 'flex', gap: '6px', alignItems: 'center' }}
              >
                <Copy size={14} />
                <span>Copy</span>
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              showToast(`Callback requested! Elena Rostova will call ${callbackPhone} at ${callbackSlot}`, 'success');
              setActiveAgentModal(null);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff' }}>Request Immediate Agent Callback</span>
              
              <div className="form-input-container">
                <label className="form-label" style={{ fontSize: '0.65rem' }}>Your Phone Number</label>
                <input type="text" value={callbackPhone} onChange={e => setCallbackPhone(e.target.value)} className="form-input" style={{ background: '#070d24' }} required />
              </div>

              <div className="form-input-container">
                <label className="form-label" style={{ fontSize: '0.65rem' }}>Preferred Time Slot</label>
                <select value={callbackSlot} onChange={e => setCallbackTimeSlot(e.target.value)} className="form-input" style={{ background: '#070d24' }}>
                  <option value="ASAP (Within 15 Mins)">ASAP (Within 15 Mins)</option>
                  <option value="Today 02:00 PM">Today 02:00 PM</option>
                  <option value="Today 05:00 PM">Today 05:00 PM</option>
                  <option value="Tomorrow Morning">Tomorrow Morning (10:00 AM)</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '12px', fontSize: '0.85rem', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Phone size={16} />
                <span>Request Callback Now</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SEND EMAIL MODAL */}
      {activeAgentModal === 'email' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '28px', borderRadius: '20px', border: '1px solid var(--color-lavender)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={22} style={{ color: 'var(--color-lavender)' }} />
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#ffffff' }}>Send Email to Elena Rostova</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>elena@novaestate.ca</p>
                </div>
              </div>
              <button onClick={() => setActiveAgentModal(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!emailSubject || !emailBody) return;
              
              // Push to chat messages
              const userMsg = { sender: 'user', text: `[EMAIL SENT] ${emailSubject}\n${emailBody}`, time: 'Just now' };
              setChatMessages(prev => [...prev, userMsg]);

              setTimeout(() => {
                setChatMessages(prev => [...prev, {
                  sender: 'agent',
                  text: `Thank you for your email regarding "${emailSubject}". I have received it and will follow up shortly.`,
                  time: 'Just now'
                }]);
              }, 1200);

              showToast('Email transmitted to Elena Rostova! A confirmation copy was sent to your inbox.', 'success');
              setActiveAgentModal(null);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div className="form-input-container">
                <label className="form-label" style={{ fontSize: '0.65rem' }}>Subject Line</label>
                <input type="text" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} className="form-input" style={{ background: '#070d24' }} required />
              </div>

              <div className="form-input-container">
                <label className="form-label" style={{ fontSize: '0.65rem' }}>Priority Level</label>
                <select value={emailPriority} onChange={e => setEmailPriority(e.target.value)} className="form-input" style={{ background: '#070d24' }}>
                  <option value="Normal">Normal Inquiry</option>
                  <option value="High">High Priority - Offer / Pricing Strategy</option>
                  <option value="Urgent">Urgent - Listing Appraisal</option>
                </select>
              </div>

              <div className="form-input-container">
                <label className="form-label" style={{ fontSize: '0.65rem' }}>Email Message Body</label>
                <textarea value={emailBody} onChange={e => setEmailBody(e.target.value)} rows={5} className="form-input" style={{ background: '#070d24', resize: 'vertical' }} required />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '12px', fontSize: '0.85rem', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Send size={16} />
                <span>Transmit Email</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* VIDEO CALL MODAL */}
      {activeAgentModal === 'video' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '28px', borderRadius: '20px', border: '1px solid var(--color-lavender)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Video size={22} style={{ color: 'var(--color-lavender)' }} />
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#ffffff' }}>Live HD Video Consultation</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Virtual Room ID: MEET-ELENA-9921</p>
                </div>
              </div>
              <button onClick={() => setActiveAgentModal(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ height: '140px', background: '#030712', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(167,139,250,0.15)', color: 'var(--color-lavender)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Video size={24} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600, display: 'block' }}>Senior Partner Elena Rostova</span>
                <span style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center', marginTop: '2px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                  <span>Room Active • Host Available</span>
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => {
                  showToast('Connecting to Elena Rostova virtual video conference room...', 'success');
                  setTimeout(() => window.open('https://meet.google.com', '_blank'), 800);
                  setActiveAgentModal(null);
                }}
                className="btn btn-primary"
                style={{ padding: '12px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <ExternalLink size={16} />
                <span>Join Video Room Now</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText('https://meet.google.com/xyz-kang-homes-elena');
                  showToast('Video consultation link copied to clipboard!', 'info');
                }}
                className="btn btn-secondary"
                style={{ padding: '10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Copy size={14} />
                <span>Copy Room Invitation Link</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VAULT DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '28px', borderRadius: '20px', border: '1px solid var(--color-lavender)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={22} style={{ color: 'var(--color-lavender)' }} />
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff' }}>Vault Document Inspection</h3>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Encrypted 256-bit Security Verified</p>
                </div>
              </div>
              <button onClick={() => setPreviewDoc(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 600 }}>{previewDoc.name}</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Uploaded {previewDoc.date} • Size {previewDoc.size}</p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  showToast(`Downloading encrypted vault document: ${previewDoc.name}`, 'success');
                  setPreviewDoc(null);
                }}
                className="btn btn-primary"
                style={{ flex: 1, padding: '12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Download size={16} />
                <span>Download Document</span>
              </button>

              <button
                onClick={() => setPreviewDoc(null)}
                className="btn btn-secondary"
                style={{ padding: '12px 20px', fontSize: '0.85rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .responsive-dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
