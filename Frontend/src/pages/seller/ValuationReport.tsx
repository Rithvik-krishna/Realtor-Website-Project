import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, TrendingUp, Calendar, CheckCircle2, Phone, Mail, Send, ArrowRight, Award } from 'lucide-react';

export const ValuationReport: React.FC = () => {
  const { currentValuationData, addSellerEvaluationBooking, setCurrentPage, properties, showToast } = useApp();

  // Booking Form State
  const [evalDate, setEvalDate] = useState('');
  const [evalTime, setEvalTime] = useState('10:00 AM');
  const [evalNotes, setEvalNotes] = useState('');
  const [evalBooked, setEvalBooked] = useState(false);

  // Realtor Contact Form State
  const [msgText, setMsgText] = useState('');
  const [msgSent, setMsgBooked] = useState(false);

  const val = currentValuationData;
  const estimatedVal = val.estimatedValue || 4850000;
  const suggestedPrice = val.suggestedSellingPrice || 4750000;
  const priceMin = val.priceRangeMin || 4600000;
  const priceMax = val.priceRangeMax || 5100000;

  const handleBookEval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evalDate) return;
    addSellerEvaluationBooking({
      date: evalDate,
      time: evalTime,
      address: `${val.address}, ${val.city}, ${val.province}`,
      notes: evalNotes
    });
    setEvalBooked(true);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgText) return;
    setMsgBooked(true);
    showToast('Direct dispatch sent to Managing Partner Elena Rostova.', 'success');
  };

  // Mock Comparables Data
  const comparables = [
    {
      id: 'comp-1',
      address: '108 Radcliffe Ridge',
      price: 4950000,
      soldPrice: 4890000,
      beds: 5,
      baths: 6,
      sqft: 6700,
      daysOnMarket: 14,
      distance: '0.2 km',
      diff: '+$40,000',
      status: 'Sold',
      image: properties[0]?.imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'comp-2',
      address: '94 Highland Crescent',
      price: 4720000,
      soldPrice: 4700000,
      beds: 4,
      baths: 5,
      sqft: 6200,
      daysOnMarket: 21,
      distance: '0.5 km',
      diff: '-$150,000',
      status: 'Sold',
      image: properties[1]?.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'comp-3',
      address: '112 Bridle Path Ave',
      price: 5200000,
      soldPrice: 5150000,
      beds: 6,
      baths: 7,
      sqft: 7400,
      daysOnMarket: 9,
      distance: '0.8 km',
      diff: '+$300,000',
      status: 'Pending',
      image: properties[2]?.imageUrl || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="fade-in" style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '100px' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div className="badge badge-lavender badge-glow" style={{ alignSelf: 'flex-start', display: 'inline-flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
              <Sparkles size={12} />
              <span>CONFIDENTIAL AI VALUATION AUDIT</span>
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 600, color: '#ffffff', margin: 0 }}>
              {val.address}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              {val.city}, {val.province} • {val.propertyType} • {val.sqft.toLocaleString()} Sq Ft
            </p>
          </div>

          <button 
            onClick={() => { setCurrentPage('dashboard-seller'); showToast('Opening Executive Seller Console.', 'success'); }}
            className="btn btn-primary hover-lift"
            style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '14px 28px', fontSize: '0.88rem', fontWeight: 600, borderRadius: '12px' }}
          >
            <span>Enter Seller Dashboard</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* 1. Valuation Summary Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '28px', border: '1px solid rgba(167, 139, 250, 0.3)', background: 'linear-gradient(135deg, rgba(167,139,250,0.1) 0%, rgba(7,13,36,0.8) 100%)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-lavender)', fontWeight: 600, letterSpacing: '0.05em' }}>ESTIMATED MARKET VALUE</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-display)', marginTop: '6px' }}>
              ${estimatedVal.toLocaleString()}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.78rem', color: '#10b981' }}>
              <TrendingUp size={14} />
              <span>+5.4% Year-over-Year Growth</span>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '28px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>SUGGESTED LISTING PRICE</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--color-lavender)', fontFamily: 'var(--font-display)', marginTop: '6px' }}>
              ${suggestedPrice.toLocaleString()}
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>Optimized for 18-day target acquisition</p>
          </div>

          <div className="glass-panel" style={{ padding: '28px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>ESTIMATED PRICE RANGE</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#ffffff', marginTop: '10px' }}>
              ${priceMin.toLocaleString()} – ${priceMax.toLocaleString()}
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>96% AI Precision Confidence</p>
          </div>

          <div className="glass-panel" style={{ padding: '28px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>BUYER DEMAND INDEX</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-display)', marginTop: '6px' }}>
              94<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/100</span>
            </h2>
            <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '6px' }}>Extremely High Buyer Density (42 Matched)</p>
          </div>
        </div>

        {/* 2. Interactive SVG Valuation Curve & AI Insights */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '30px' }} className="responsive-split">
          <div className="glass-panel" style={{ padding: '32px', border: '1px solid rgba(167, 139, 250, 0.2)', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#ffffff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <TrendingUp size={18} style={{ color: 'var(--color-lavender)' }} />
              <span>Historical & Projected Price Trajectory</span>
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Comparative market historical pricing vs AI predictive yield over 12 months.
            </p>

            <div style={{ height: '220px', background: 'rgba(3,7,18,0.6)', borderRadius: '14px', padding: '20px', border: '1px solid rgba(255,255,255,0.04)', position: 'relative' }}>
              <svg width="100%" height="100%" viewBox="0 0 500 180">
                <defs>
                  <linearGradient id="valGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(167, 139, 250, 0.3)" />
                    <stop offset="100%" stopColor="rgba(167, 139, 250, 0)" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(255,255,255,0.04)" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.04)" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="rgba(255,255,255,0.04)" />

                <path d="M 0 150 Q 120 120 250 110 T 500 40 L 500 180 L 0 180 Z" fill="url(#valGrad)" />
                <path d="M 0 150 Q 120 120 250 110 T 500 40" fill="none" stroke="var(--color-lavender)" strokeWidth="3" />

                <circle cx="500" cy="40" r="5" fill="#ffffff" />
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                <span>Q1 2025 ($4.42M)</span>
                <span>Q3 2025 ($4.60M)</span>
                <span>Q1 2026 ($4.75M)</span>
                <span style={{ color: 'var(--color-lavender)', fontWeight: 600 }}>Current ($4.85M)</span>
              </div>
            </div>
          </div>

          {/* AI Strategic Insights */}
          <div className="glass-panel" style={{ padding: '32px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Award size={18} style={{ color: 'var(--color-lavender)' }} />
              <span>AI Strategic Market Insights</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', borderLeft: '3px solid var(--color-lavender)' }}>
                <strong style={{ color: '#ffffff' }}>Renovation Value Multiplier:</strong> Your custom kitchen and primary spa additions contributed an estimated <strong>+$240,000</strong> to the asset capitalization.
              </div>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', borderLeft: '3px solid #10b981' }}>
                <strong style={{ color: '#ffffff' }}>Low Regional Inventory:</strong> {val.city} currently has only <strong>1.8 months</strong> of luxury supply, creating a seller-dominant environment.
              </div>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', borderLeft: '3px solid #8b5cf6' }}>
                <strong style={{ color: '#ffffff' }}>Off-Market Buyer Match:</strong> 42 pre-qualified VIP buyers are currently searching for 5+ bed detached properties in {val.city}.
              </div>
            </div>
          </div>
        </div>

        {/* 3. Section: Comparable Nearby Homes */}
        <div>
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-lavender)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>TRANSACTIONAL BENCHMARKS</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#ffffff', marginTop: '4px' }}>Comparable Local Real Estate Sales</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {comparables.map((c) => (
              <div key={c.id} className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ position: 'relative', height: '160px', borderRadius: '10px', overflow: 'hidden' }}>
                  <img src={c.image} alt={c.address} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span className="badge badge-lavender" style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '0.68rem', padding: '4px 8px' }}>
                    {c.status} • {c.distance} away
                  </span>
                </div>

                <div>
                  <h4 style={{ fontSize: '1rem', color: '#ffffff', fontWeight: 600 }}>{c.address}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.beds} Beds • {c.baths} Baths • {c.sqft.toLocaleString()} Sq Ft</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>SOLD PRICE</span>
                      <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-lavender)' }}>${c.soldPrice.toLocaleString()}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>VARIANCE</span>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: c.diff.startsWith('+') ? '#10b981' : '#f59e0b' }}>{c.diff}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Section: Suggested Selling Price Options */}
        <div className="glass-panel" style={{ padding: '36px', borderRadius: '24px', border: '1px solid rgba(167,139,250,0.2)' }}>
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-lavender)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>STRATEGIC PRICING MODELS</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#ffffff', marginTop: '4px' }}>Suggested Listing Price Options</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '20px', background: 'rgba(167, 139, 250, 0.1)', border: '1px solid var(--color-lavender)', borderRadius: '16px' }}>
              <span className="badge badge-lavender" style={{ fontSize: '0.65rem' }}>RECOMMENDED</span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', marginTop: '10px' }}>${suggestedPrice.toLocaleString()}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Optimal balance of maximum yield and swift closing timeline (18 days).</p>
            </div>

            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>PREMIUM LISTING</span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', marginTop: '10px' }}>${(suggestedPrice + 250000).toLocaleString()}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>For patient sellers seeking peak capital extraction (45-60 days).</p>
            </div>

            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>QUICK SALE TARGET</span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', marginTop: '10px' }}>${(suggestedPrice - 150000).toLocaleString()}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Priced to trigger competitive bidding wars within 7-10 days.</p>
            </div>

            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>CONSERVATIVE FLOOR</span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', marginTop: '10px' }}>${priceMin.toLocaleString()}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Minimum guaranteed reserve price based on historical worst-case comparables.</p>
            </div>
          </div>
        </div>

        {/* 5. Section: Book Free In-Person Evaluation */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }} className="responsive-split">
          <div className="glass-panel" style={{ padding: '36px', borderRadius: '24px', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar size={20} style={{ color: 'var(--color-lavender)' }} />
              <span>Book Free On-Site Property Evaluation</span>
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Schedule a complimentary in-person inspection with our Senior Valuation Director to refine your price report.
            </p>

            {evalBooked ? (
              <div style={{ padding: '24px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={40} style={{ color: '#10b981' }} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff' }}>Evaluation Inspection Reserved</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Confirmed for <strong>{evalDate}</strong> at <strong>{evalTime}</strong> at <strong>{val.address}</strong>.
                </p>
                <button onClick={() => setEvalBooked(false)} className="btn btn-secondary" style={{ fontSize: '0.78rem', marginTop: '8px' }}>
                  Book Additional Slot
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookEval} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-input-container">
                  <label className="form-label" style={{ fontSize: '0.65rem' }}>Preferred Date</label>
                  <input type="date" value={evalDate} onChange={e => setEvalDate(e.target.value)} className="form-input" required />
                </div>

                <div className="form-input-container">
                  <label className="form-label" style={{ fontSize: '0.65rem' }}>Preferred Time Window</label>
                  <select value={evalTime} onChange={e => setEvalTime(e.target.value)} className="form-input" style={{ background: '#070d24' }}>
                    <option value="10:00 AM">10:00 AM – Morning Architectural Walkthrough</option>
                    <option value="02:00 PM">02:00 PM – Afternoon Structural & Market Review</option>
                    <option value="05:00 PM">05:00 PM – Sunset Light & Exterior Inspection</option>
                  </select>
                </div>

                <div className="form-input-container">
                  <label className="form-label" style={{ fontSize: '0.65rem' }}>Additional Notes / Special Instructions</label>
                  <textarea rows={2} value={evalNotes} onChange={e => setEvalNotes(e.target.value)} placeholder="e.g. Gate code or specific features to evaluate..." className="form-input" style={{ background: '#070d24' }} />
                </div>

                <button type="submit" className="btn btn-primary" style={{ padding: '12px', fontSize: '0.85rem' }}>
                  <span>Confirm In-Person Evaluation</span>
                </button>
              </form>
            )}
          </div>

          {/* 6. Section: Assigned Realtor Card */}
          <div className="glass-panel" style={{ padding: '36px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80" alt="Elena Rostova" style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-lavender)' }} />
              <div>
                <span className="badge badge-lavender" style={{ fontSize: '0.65rem' }}>ASSIGNED MANAGING PARTNER</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff', marginTop: '2px' }}>Elena Rostova</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Senior Luxury Pricing Specialist • 18+ Yrs Exp • 4.98/5.0 Rating</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <a href="tel:+14165550199" className="btn btn-secondary" style={{ padding: '10px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', textDecoration: 'none', color: '#ffffff' }}>
                <Phone size={14} />
                <span>+1 (416) 555-0199</span>
              </a>
              <a href="mailto:elena@novaestate.ca" className="btn btn-secondary" style={{ padding: '10px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', textDecoration: 'none', color: '#ffffff' }}>
                <Mail size={14} />
                <span>elena@novaestate.ca</span>
              </a>
            </div>

            {/* Direct Message Form */}
            {msgSent ? (
              <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', fontSize: '0.8rem', color: '#ffffff', textAlign: 'center' }}>
                Message transmitted to Elena Rostova. She will reach out within 15 minutes.
              </div>
            ) : (
              <form onSubmit={handleSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label className="form-label" style={{ fontSize: '0.65rem' }}>Send Private Message to Elena</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" value={msgText} onChange={e => setMsgText(e.target.value)} placeholder="Ask about listing strategy or commission..." className="form-input" style={{ fontSize: '0.8rem', background: '#070d24' }} required />
                  <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }}>
                    <Send size={14} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .responsive-split { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
