import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { generateBreadcrumbSchema, type BreadcrumbItem } from './schemaGenerators';

export interface BreadcrumbBarProps {
  items: BreadcrumbItem[];
  onNavigate?: (url: string) => void;
}

export const BreadcrumbBar: React.FC<BreadcrumbBarProps> = ({ items, onNavigate }) => {
  const schema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    ...items
  ]);

  const handleClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(url);
    } else {
      window.location.hash = url.startsWith('/') ? `#${url.slice(1)}` : `#${url}`;
    }
  };

  return (
    <nav 
      aria-label="Breadcrumb" 
      style={{
        padding: '10px 16px',
        margin: '12px 0 20px 0',
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        fontSize: '0.85rem',
        color: '#64748b'
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <a
        href="#home"
        onClick={(e) => handleClick(e, '/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: '#0f172a',
          fontWeight: 600,
          textDecoration: 'none',
          transition: 'color 0.2s'
        }}
        className="hover:text-blue-600"
      >
        <Home size={14} />
        <span>Home</span>
      </a>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;

        return (
          <React.Fragment key={idx}>
            <ChevronRight size={14} style={{ color: '#94a3b8', flexShrink: 0 }} />
            {isLast ? (
              <span
                style={{
                  color: '#0f172a',
                  fontWeight: 700,
                  maxWidth: '260px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {item.name}
              </span>
            ) : (
              <a
                href={`#${item.url.replace(/^\//, '')}`}
                onClick={(e) => handleClick(e, item.url)}
                style={{
                  color: '#475569',
                  fontWeight: 500,
                  textDecoration: 'none'
                }}
                className="hover:text-blue-600"
              >
                {item.name}
              </a>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
