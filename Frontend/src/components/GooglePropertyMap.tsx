import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useJsApiLoader, GoogleMap, InfoWindowF, OverlayViewF, OVERLAY_MOUSE_TARGET } from '@react-google-maps/api';
import type { Property } from '../context/AppContext';
import { MapPin, Plus, Minus, Sparkles, Layers, Maximize2, Edit3 } from 'lucide-react';

interface GooglePropertyMapProps {
  properties: Property[];
  selectedPropertyId: string | null;
  hoveredPropertyId: string | null;
  onSelectProperty: (property: Property) => void;
  onHoverProperty: (id: string | null) => void;
  searchCity?: string;
  onVisiblePropertiesChange?: (visibleIds: string[]) => void;
  totalPropertiesCount?: number;
}

// City Center Coordinates Mapping for Search behavior
const CITY_CENTERS: Record<string, { lat: number; lng: number }> = {
  'Toronto': { lat: 43.6532, lng: -79.3832 },
  'Mississauga': { lat: 43.5890, lng: -79.6441 },
  'Oakville': { lat: 43.4675, lng: -79.6877 },
  'Brampton': { lat: 43.7315, lng: -79.7624 },
  'Vaughan': { lat: 43.8563, lng: -79.5085 },
  'Markham': { lat: 43.8561, lng: -79.3370 },
  'Richmond Hill': { lat: 43.8828, lng: -79.4403 },
  'Hamilton': { lat: 43.2557, lng: -79.8711 },
  'Milton': { lat: 43.5183, lng: -79.8774 },
  'Default': { lat: 43.6532, lng: -79.3832 }
};

// Luxury Dark Map Styles for Google Maps
const DARK_MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#030712' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#030712' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#a5b4fc' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#c7d2fe' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#818cf8' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#09152b' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#0f172a' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#312e81' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1e1b4b' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#020617' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#6366f1' }] }
];

export const GooglePropertyMap: React.FC<GooglePropertyMapProps> = ({
  properties,
  selectedPropertyId,
  hoveredPropertyId,
  onSelectProperty,
  onHoverProperty,
  searchCity = 'Toronto',
  onVisiblePropertiesChange
}) => {
  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyC6D_AoRBq3Fpg3BOdgs2wuDNuJRf27k-8';

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey
  });

  const [activeInfoWindowId, setActiveInfoWindowId] = useState<string | null>(selectedPropertyId);
  const [mapType, setMapType] = useState<'dark' | 'roadmap' | 'satellite'>('dark');
  const [isDrawing, setIsDrawing] = useState(false);
  const [fallbackZoom, setFallbackZoom] = useState<number>(1);

  const mapRef = useRef<google.maps.Map | null>(null);

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    if (properties && properties.length > 0 && typeof google !== 'undefined') {
      const bounds = new google.maps.LatLngBounds();
      properties.forEach(p => {
        if (p.lat && p.lng) bounds.extend({ lat: p.lat, lng: p.lng });
      });
      map.fitBounds(bounds, 50);
    }
  }, [properties]);

  const handleMapIdle = useCallback(() => {
    if (!mapRef.current || !onVisiblePropertiesChange) return;

    const bounds = mapRef.current.getBounds();
    if (!bounds) return;

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    const visibleIds = properties
      .filter(prop => {
        if (!prop.lat || !prop.lng) return false;
        const inLat = prop.lat >= sw.lat() && prop.lat <= ne.lat();
        const inLng = prop.lng >= sw.lng() && prop.lng <= ne.lng();
        return inLat && inLng;
      })
      .map(p => p.id);

    onVisiblePropertiesChange(visibleIds);
  }, [properties, onVisiblePropertiesChange]);

  // Auto-fit map bounds when properties list changes
  useEffect(() => {
    if (mapRef.current && properties && properties.length > 0 && typeof google !== 'undefined') {
      const bounds = new google.maps.LatLngBounds();
      let validCount = 0;
      properties.forEach(p => {
        if (p.lat && p.lng) {
          bounds.extend({ lat: p.lat, lng: p.lng });
          validCount++;
        }
      });
      if (validCount > 0) {
        mapRef.current.fitBounds(bounds, 50);
      }
    }
  }, [properties.length]);

  // Compute map center dynamically based on active city
  const mapCenter = useMemo(() => {
    const matchedCity = Object.keys(CITY_CENTERS).find(
      c => c.toLowerCase() === searchCity.toLowerCase()
    );
    return matchedCity ? CITY_CENTERS[matchedCity] : CITY_CENTERS['Default'];
  }, [searchCity]);

  // Helper to format price for map badge
  const formatPriceTag = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(price % 1000000 === 0 ? 0 : 1)}M`;
    }
    return `$${Math.round(price / 1000)}K`;
  };

  const mapContainerStyle = useMemo(() => ({
    width: '100%',
    height: '100%',
    minHeight: '100%'
  }), []);

  const mapOptions = useMemo(() => ({
    styles: mapType === 'dark' ? DARK_MAP_STYLES : [],
    mapTypeId: mapType === 'satellite' ? 'satellite' : 'roadmap',
    disableDefaultUI: true,
    zoomControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false
  }), [mapType]);

  const activeProperty = useMemo(() => {
    return properties.find(p => p.id === (activeInfoWindowId || selectedPropertyId));
  }, [properties, activeInfoWindowId, selectedPropertyId]);

  const handleMarkerClick = useCallback((prop: Property) => {
    setActiveInfoWindowId(prop.id);
    onSelectProperty(prop);
  }, [onSelectProperty]);

  // If Google Maps API is loaded and valid
  if (apiKey && isLoaded && !loadError) {
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        
        {/* Map Top Control Toolbar */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            right: '12px',
            zIndex: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px',
            pointerEvents: 'auto'
          }}
        >
          {/* Status badge */}
          <div
            className="glass-panel"
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              background: 'rgba(7, 13, 36, 0.88)',
              border: '1px solid rgba(167, 139, 250, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              color: '#ffffff',
              fontWeight: 600
            }}
          >
            <Sparkles size={13} style={{ color: 'var(--color-lavender)' }} />
            <span>{searchCity} ({properties.length.toLocaleString()} {properties.length === 1 ? 'Listing' : 'Listings'})</span>
          </div>

          {/* Controls Cluster */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {/* Map Type Toggle */}
            <button
              onClick={() => setMapType(prev => prev === 'dark' ? 'satellite' : prev === 'satellite' ? 'roadmap' : 'dark')}
              className="glass-panel hover-lift"
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                background: 'rgba(7, 13, 36, 0.88)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#ffffff',
                fontSize: '0.72rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Toggle Map Style"
            >
              <Layers size={13} />
              <span style={{ textTransform: 'capitalize' }}>{mapType}</span>
            </button>

            {/* Draw Area Toggle */}
            <button
              onClick={() => setIsDrawing(prev => !prev)}
              className="glass-panel hover-lift"
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                background: isDrawing ? 'var(--color-lavender)' : 'rgba(7, 13, 36, 0.88)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: isDrawing ? '#030712' : '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Draw Search Boundary"
            >
              <Edit3 size={13} />
              <span>{isDrawing ? 'Drawing' : 'Draw Boundary'}</span>
            </button>
          </div>
        </div>

        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={11}
          options={mapOptions}
          onLoad={handleMapLoad}
          onIdle={handleMapIdle}
        >
          {properties.map(prop => {
            const isSelected = prop.id === selectedPropertyId || prop.id === activeInfoWindowId;
            const isHovered = prop.id === hoveredPropertyId;
            const isBlinking = isSelected || isHovered;

            return (
              <OverlayViewF
                key={prop.id}
                position={{ lat: prop.lat, lng: prop.lng }}
                mapPaneName={OVERLAY_MOUSE_TARGET}
              >
                <div
                  onClick={() => handleMarkerClick(prop)}
                  onMouseEnter={() => onHoverProperty(prop.id)}
                  onMouseLeave={() => onHoverProperty(null)}
                  className={isBlinking ? 'marker-hover-blinking' : ''}
                  style={{
                    transform: 'translate(-50%, -50%)',
                    padding: isSelected ? '6px 12px' : isHovered ? '5px 10px' : '4px 8px',
                    borderRadius: '20px',
                    background: isSelected
                      ? 'linear-gradient(135deg, #a78bfa 0%, #3b82f6 100%)'
                      : isHovered
                      ? 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)'
                      : 'rgba(15, 23, 42, 0.92)',
                    color: isSelected ? '#ffffff' : '#ffffff',
                    fontWeight: 700,
                    fontSize: isSelected ? '0.82rem' : '0.72rem',
                    border: isSelected
                      ? '2px solid #ffffff'
                      : isHovered
                      ? '1.5px solid #a78bfa'
                      : '1px solid rgba(255, 255, 255, 0.25)',
                    boxShadow: isSelected
                      ? '0 0 25px rgba(167, 139, 250, 0.9), 0 0 10px rgba(59, 130, 246, 0.8)'
                      : '0 4px 12px rgba(0,0,0,0.5)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  {formatPriceTag(prop.price)}
                </div>
              </OverlayViewF>
            );
          })}

          {activeProperty && (
            <InfoWindowF
              position={{ lat: activeProperty.lat, lng: activeProperty.lng }}
              onCloseClick={() => setActiveInfoWindowId(null)}
            >
              <div
                style={{
                  padding: '8px',
                  maxWidth: '220px',
                  background: '#070d24',
                  color: '#ffffff',
                  borderRadius: '10px'
                }}
              >
                <img
                  src={activeProperty.imageUrl}
                  alt={activeProperty.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';
                  }}
                  style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }}
                />
                <div style={{ fontSize: '0.7rem', color: '#a5b4fc', textTransform: 'uppercase', fontWeight: 600 }}>
                  {activeProperty.city} • {activeProperty.propertyType}
                </div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: '2px 0 4px', color: '#ffffff' }}>
                  {activeProperty.title}
                </h4>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#c7d2fe', marginBottom: '6px' }}>
                  ${activeProperty.price.toLocaleString()}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProperty(activeProperty);
                  }}
                  style={{
                    width: '100%',
                    padding: '6px 12px',
                    background: 'linear-gradient(135deg, #3b82f6, #a78bfa)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  View Details
                </button>
              </div>
            </InfoWindowF>
          )}
        </GoogleMap>
      </div>
    );
  }

  // Graceful Fallback UI (Interactive GIS Vector Radar Map) when API key is absent
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: 'linear-gradient(135deg, #02040d 0%, #070d24 50%, #030712 100%)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Map Control Bar Overlay */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '12px',
          zIndex: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <div
          className="glass-panel"
          style={{
            padding: '6px 12px',
            borderRadius: '10px',
            background: 'rgba(7, 13, 36, 0.88)',
            border: '1px solid rgba(167, 139, 250, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            color: '#ffffff',
            fontWeight: 600
          }}
        >
          <Sparkles size={13} style={{ color: 'var(--color-lavender)' }} />
          <span>Interactive Radar Map ({properties.length} Properties)</span>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setFallbackZoom(1)}
            className="glass-panel hover-lift"
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              background: 'rgba(7, 13, 36, 0.88)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#ffffff',
              fontSize: '0.72rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Reset Map Bounds"
          >
            <Maximize2 size={13} />
            <span>Fit Bounds</span>
          </button>
        </div>
      </div>

      {/* Vector Canvas Container */}
      <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1000 600"
          preserveAspectRatio="none"
          style={{
            width: '100%',
            height: '100%',
            transform: `scale(${fallbackZoom})`,
            transformOrigin: 'center center',
            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <defs>
            <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
            </pattern>
            <radialGradient id="lakeGlow" cx="50%" cy="100%" r="80%">
              <stop offset="0%" stopColor="rgba(99, 102, 241, 0.15)" />
              <stop offset="100%" stopColor="rgba(2, 6, 23, 0.95)" />
            </radialGradient>
          </defs>

          {/* Grid Background */}
          <rect width="1000" height="600" fill="url(#gridPattern)" />

          {/* Lake Ontario Vector Curve */}
          <path
            d="M 0 520 Q 250 480 500 500 T 1000 460 L 1000 600 L 0 600 Z"
            fill="url(#lakeGlow)"
            stroke="rgba(99, 102, 241, 0.3)"
            strokeWidth="1.5"
          />
          <text x="500" y="560" fill="rgba(165, 180, 252, 0.4)" fontSize="13" fontWeight="600" textAnchor="middle" letterSpacing="3">
            LAKE ONTARIO
          </text>

          {/* Major GTA Highway Lines */}
          <path d="M 50 320 Q 500 280 950 310" stroke="rgba(255,255,255,0.08)" strokeWidth="2" fill="none" strokeDasharray="6 4" />
          <path d="M 550 50 L 550 490" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" fill="none" />
        </svg>

        {/* Projected Pins */}
        {properties.map(prop => {
          const minLat = 43.40;
          const maxLat = 43.90;
          const minLng = -79.85;
          const maxLng = -79.00;

          const pctY = Math.max(12, Math.min(82, 100 - ((prop.lat - minLat) / (maxLat - minLat)) * 100));
          const pctX = Math.max(12, Math.min(88, ((prop.lng - minLng) / (maxLng - minLng)) * 100));

          const isSelected = prop.id === selectedPropertyId;
          const isHovered = prop.id === hoveredPropertyId;

          return (
            <div
              key={prop.id}
              onClick={() => onSelectProperty(prop)}
              onMouseEnter={() => onHoverProperty(prop.id)}
              onMouseLeave={() => onHoverProperty(null)}
              style={{
                position: 'absolute',
                left: `${pctX}%`,
                top: `${pctY}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: isSelected ? 40 : isHovered ? 30 : 10,
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div
                className={isSelected || isHovered ? 'marker-hover-blinking' : ''}
                style={{
                  background: isSelected
                    ? 'linear-gradient(135deg, #c7d2fe 0%, #818cf8 100%)'
                    : isHovered
                    ? 'linear-gradient(135deg, #818cf8 0%, #4338ca 100%)'
                    : 'rgba(7, 13, 36, 0.92)',
                  color: isSelected ? '#030712' : '#ffffff',
                  padding: isSelected ? '6px 12px' : '4px 8px',
                  borderRadius: '16px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  border: isSelected
                    ? '2px solid #ffffff'
                    : isHovered
                    ? '1.5px solid #a5b4fc'
                    : '1px solid rgba(255,255,255,0.18)',
                  boxShadow: isSelected
                    ? '0 0 20px rgba(199, 210, 254, 0.6)'
                    : '0 4px 12px rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  whiteSpace: 'nowrap'
                }}
              >
                <MapPin size={11} style={{ color: isSelected ? '#030712' : 'var(--color-lavender)' }} />
                <span>{formatPriceTag(prop.price)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Zoom Controls */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          zIndex: 20
        }}
      >
        <button
          onClick={() => setFallbackZoom(prev => Math.min(prev + 0.2, 2))}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(7, 13, 36, 0.88)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <Plus size={15} />
        </button>
        <button
          onClick={() => setFallbackZoom(prev => Math.max(prev - 0.2, 0.8))}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(7, 13, 36, 0.88)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <Minus size={15} />
        </button>
      </div>
    </div>
  );
};
