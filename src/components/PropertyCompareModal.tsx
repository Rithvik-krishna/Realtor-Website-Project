import React from 'react';
import { X, Trash2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PropertyCompareModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

export const PropertyCompareModal: React.FC<PropertyCompareModalProps> = ({ isOpen = true, onClose }) => {
  const { compareList, properties, toggleCompare, setSelectedPropertyId, setCurrentPage } = useApp();

  if (isOpen === false) return null;

  const compareProperties = properties.filter(p => compareList.includes(p.id));

  const handleSelectProperty = (id: string) => {
    setSelectedPropertyId(id);
    setCurrentPage('property-detail');
    onClose();
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
        backdropFilter: 'blur(16px)',
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
          maxWidth: '1100px',
          padding: '36px',
          borderRadius: '24px',
          border: '1px solid rgba(167, 139, 250, 0.35)',
          boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.8)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto'
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

        <div style={{ marginBottom: '28px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-lavender)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Side-by-Side Analysis
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 600, color: '#ffffff', marginTop: '4px' }}>
            Compare Estates ({compareProperties.length})
          </h2>
        </div>

        {compareProperties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '16px' }}>
              No properties selected for comparison. Click "Compare" on any property card to compare specs.
            </p>
            <button onClick={onClose} className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '0.85rem' }}>
              Back to Browse
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
              <thead>
                <tr>
                  <th style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', width: '200px', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                    Property Feature
                  </th>
                  {compareProperties.map(p => (
                    <th key={p.id} style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ position: 'relative', height: '120px', borderRadius: '12px', overflow: 'hidden' }}>
                          <img src={p.imageUrl} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button
                            onClick={() => toggleCompare(p.id)}
                            style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px',
                              background: 'rgba(3,7,18,0.8)',
                              border: 'none',
                              color: '#ef4444',
                              borderRadius: '50%',
                              width: '28px',
                              height: '28px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff', lineHeight: '1.3' }}>{p.title}</h4>
                        <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-lavender)' }}>
                          ${p.price.toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleSelectProperty(p.id)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        >
                          <span>View Details</span>
                          <ArrowRight size={12} />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Location / City', render: (p: any) => p.location },
                  { label: 'Property Type', render: (p: any) => p.propertyType },
                  { label: 'Bedrooms', render: (p: any) => `${p.beds} Beds` },
                  { label: 'Bathrooms', render: (p: any) => `${p.baths} Baths` },
                  { label: 'Square Feet', render: (p: any) => `${p.sqft.toLocaleString()} sqft` },
                  { label: 'Est. Price / Sqft', render: (p: any) => `$${Math.round(p.price / p.sqft)}` },
                  { label: 'Garage', render: (p: any) => p.garage },
                  { label: 'Walk Score', render: (p: any) => `${p.walkScore}/100` },
                  { label: 'School Rating', render: (p: any) => `${p.schoolScore}/10` },
                  { label: 'Annual Taxes', render: (p: any) => `$${p.taxes.toLocaleString()}` },
                  { label: 'Monthly HOA', render: (p: any) => p.monthlyHOA ? `$${p.monthlyHOA}` : 'None' },
                  { label: 'Status', render: (p: any) => p.propertyStatus }
                ].map((row, idx) => (
                  <tr key={idx} style={{ background: idx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      {row.label}
                    </td>
                    {compareProperties.map(p => (
                      <td key={p.id} style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.85rem', color: '#ffffff', fontWeight: 600 }}>
                        {row.render(p)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
