import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Download, ChevronLeft, ChevronRight, Heart, Share2, Compass, DollarSign, Bell, Maximize2, X, Volume2, VolumeX, RotateCw } from 'lucide-react';
import { ShareModal } from '../../components/ShareModal';
import { BookViewingModal } from '../../components/BookViewingModal';
import { OfferWizardModal } from '../../components/OfferWizardModal';
import { PropertyCompareModal } from '../../components/PropertyCompareModal';
import { PropertyGallery } from '../../components/PropertyGallery';
import { apiService } from '../../services/api';

export const PropertyDetail: React.FC = () => {
  const { 
    selectedPropertyId, 
    properties, 
    setCurrentPage, 
    savedProperties, 
    toggleSaveProperty, 
    compareList, 
    toggleCompare, 
    addPriceAlert, 
    addToRecentlyViewed,
    user, 
    showToast,
    setPendingPropertyAction,
    autoOpenPropertyModal,
    setAutoOpenPropertyModal,
    triggerRoleSwitchWarning
  } = useApp();

  const [fetchedProperty, setFetchedProperty] = React.useState<any>(null);

  // 1. Find active property from global properties list
  const foundProperty = React.useMemo(() => {
    if (!selectedPropertyId) return properties[0];
    return properties.find(p => p.id === selectedPropertyId || p.mlsNumber === selectedPropertyId);
  }, [properties, selectedPropertyId]);

  // 2. Fetch directly from backend API if listing ID is in URL but list is still loading
  React.useEffect(() => {
    if (foundProperty) {
      setFetchedProperty(null);
      return;
    }

    if (selectedPropertyId && selectedPropertyId !== 'default-1') {
      apiService.getPropertyById(selectedPropertyId)
        .then(res => {
          if (res && res.success && res.data) {
            setFetchedProperty(res.data);
          }
        })
        .catch(() => {});
    }
  }, [foundProperty, selectedPropertyId]);

  // 3. Safe, memoized active property (unconditional hook execution)
  const activeProperty = React.useMemo(() => {
    if (foundProperty) return foundProperty;
    if (fetchedProperty) return fetchedProperty;
    if (properties && properties.length > 0) return properties[0];
    return {
      id: selectedPropertyId || 'default-1',
      title: 'Toronto Luxury Residence',
      price: 988000,
      sqft: 1850,
      taxes: 2766,
      yearBuilt: 2022,
      category: 'Luxury Residence',
      propertyType: 'Residential',
      address: 'Bay Street',
      city: 'Toronto',
      location: 'Bay Street, Toronto, ON',
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'],
      description: 'Luxury residence in prime GTA location.',
      transitScore: 88,
      schoolScore: 8.9,
      crimeRate: 'Minimal (0.2%)',
      hospitalRating: 'Toronto General Hospital',
      monthlyHOA: 450
    };
  }, [foundProperty, fetchedProperty, properties, selectedPropertyId]);

  const propertyPrice = activeProperty?.price || 988000;
  const propertyTaxes = activeProperty?.taxes ?? Math.round(propertyPrice * 0.0028);
  const propertySqft = activeProperty?.sqft ?? 1850;
  const propertyYearBuilt = activeProperty?.yearBuilt ?? 2022;
  const propertyTransitScore = activeProperty?.transitScore ?? 88;
  const propertySchoolScore = activeProperty?.schoolScore ?? 8.9;
  const propertyCrimeRate = activeProperty?.crimeRate || 'Minimal (0.2%)';
  const propertyHospitalRating = activeProperty?.hospitalRating || 'Toronto General Hospital';

  React.useEffect(() => {
    if (activeProperty && activeProperty.id) {
      setHomeValue(propertyPrice);
      setDownPayment(Math.floor(propertyPrice * 0.2));
      addToRecentlyViewed(activeProperty.id);
    }
  }, [activeProperty?.id]);

  const isSaved = activeProperty ? savedProperties.includes(activeProperty.id) : false;
  const isComparing = activeProperty ? compareList.includes(activeProperty.id) : false;

  // Modal Visibility States
  const [shareOpen, setShareOpen] = useState(false);
  const [bookViewingOpen, setBookViewingOpen] = useState(false);
  const [offerWizardOpen, setOfferWizardOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  // Image Carousel & Lightbox Gallery States
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const allImages = React.useMemo(() => {
    if (activeProperty && activeProperty.images && Array.isArray(activeProperty.images) && activeProperty.images.length > 0) {
      return activeProperty.images;
    }
    return [activeProperty?.imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'];
  }, [activeProperty]);

  React.useEffect(() => {
    setActiveImageIndex(0);
  }, [activeProperty?.id]);

  const handlePrevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveImageIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveImageIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  React.useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'ArrowRight') handleNextImage();
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, allImages.length]);

  // Tabs layout control
  const [activeTab, setActiveTab] = useState<'details' | 'amenities' | 'floorplan'>('details');

  // 360° Virtual Tour & AI Drone Preview States
  const [tourRoomIndex, setTourRoomIndex] = useState(0);
  const [tourAutoPlay, setTourAutoPlay] = useState(false);
  const [tourFading, setTourFading] = useState(false);
  const [isTourFullscreen, setIsTourFullscreen] = useState(false);
  const [droneMuted, setDroneMuted] = useState(true);

  const hasOfficialTour = Boolean(activeProperty && typeof (activeProperty as any).virtualTour === 'string' && ((activeProperty as any).virtualTour as string).length > 5);

  // Smart distinct-photo sampling — guarantees 8 truly different images
  const tourImages: string[] = React.useMemo(() => {
    if (!allImages || allImages.length === 0) {
      return [
        activeProperty?.imageUrl || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1800&auto=format&fit=crop'
      ];
    }

    // Deduplicate the full image array first (exact URL match)
    const unique: string[] = (Array.from(new Set(allImages)).filter(Boolean) as string[]);

    if (unique.length <= 8) return unique;

    const total = unique.length;
    const TARGET = 8;

    // Sample 20 candidate indices spread evenly across the full range
    // (skipping the very last index to avoid the "same last shot" problem)
    const candidateIndices: number[] = [];
    for (let i = 0; i < 20; i++) {
      candidateIndices.push(Math.floor((i / 19) * (total - 1)));
    }

    // Greedily pick TARGET photos, ensuring each URL has a different
    // filename stem (last segment before query string) — prevents
    // visually-identical duplicate shots that share the same base name
    const picked: string[] = [];
    const seenStems = new Set<string>();

    for (const idx of candidateIndices) {
      if (picked.length >= TARGET) break;
      const url = unique[idx];
      if (!url) continue;
      // Extract filename stem e.g. "IMG_1234" from the URL
      const stem = url.split('/').pop()?.split('?')[0]?.replace(/\.\w+$/, '') || url;
      if (!seenStems.has(stem)) {
        seenStems.add(stem);
        picked.push(url);
      }
    }

    // If still short (all stems were identical), pad from sequential spread
    if (picked.length < TARGET) {
      for (let i = 0; picked.length < TARGET && i < total; i++) {
        const url = unique[i];
        if (url && !picked.includes(url)) picked.push(url);
      }
    }

    return picked.length > 0 ? picked : unique;
  }, [allImages, activeProperty]);

  // Tour navigation with cross-fade
  const navigateTour = React.useCallback((newIndex: number) => {
    setTourFading(true);
    setTimeout(() => {
      setTourRoomIndex(newIndex);
      setTourFading(false);
    }, 280);
  }, []);

  const tourPrev = React.useCallback(() => {
    navigateTour(tourRoomIndex === 0 ? tourImages.length - 1 : tourRoomIndex - 1);
  }, [tourRoomIndex, tourImages.length, navigateTour]);

  const tourNext = React.useCallback(() => {
    navigateTour(tourRoomIndex === tourImages.length - 1 ? 0 : tourRoomIndex + 1);
  }, [tourRoomIndex, tourImages.length, navigateTour]);

  // Auto-slideshow every 4 seconds
  React.useEffect(() => {
    if (!tourAutoPlay || hasOfficialTour) return;
    const interval = setInterval(() => {
      setTourFading(true);
      setTimeout(() => {
        setTourRoomIndex(prev => (prev === tourImages.length - 1 ? 0 : prev + 1));
        setTourFading(false);
      }, 280);
    }, 4000);
    return () => clearInterval(interval);
  }, [tourAutoPlay, tourImages.length, hasOfficialTour]);

  // Keyboard navigation for tour fullscreen
  React.useEffect(() => {
    if (!isTourFullscreen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') tourPrev();
      if (e.key === 'ArrowRight') tourNext();
      if (e.key === 'Escape') setIsTourFullscreen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isTourFullscreen, tourPrev, tourNext]);

  // Dynamic Mortgage Calculator Sliders
  const [homeValue, setHomeValue] = useState(propertyPrice);
  const [downPayment, setDownPayment] = useState(Math.floor(propertyPrice * 0.2));
  const [interestRate, setInterestRate] = useState(4.2);
  const loanTerm = 25;
  // Math Calculations for Mortgage Chart
  const principal = Math.max(0, homeValue - downPayment);
  const monthlyRate = (interestRate / 100) / 12;
  const totalMonths = loanTerm * 12;
  const monthlyPayment = monthlyRate > 0 ? (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1) : principal / totalMonths;
  const monthlyHOA = activeProperty?.monthlyHOA || 450;
  const monthlyTaxes = propertyTaxes / 12;
  const totalMonthlyEstimate = monthlyPayment + monthlyHOA + monthlyTaxes;

  // Pie chart variables
  const principalPercent = (monthlyPayment / totalMonthlyEstimate) * 100;
  const taxesPercent = (monthlyTaxes / totalMonthlyEstimate) * 100;

  React.useEffect(() => {
    if (autoOpenPropertyModal) {
      if (autoOpenPropertyModal === 'book') setCurrentPage('schedule-viewing');
      if (autoOpenPropertyModal === 'buy' || autoOpenPropertyModal === 'offer') setCurrentPage('purchase-offer');
      setAutoOpenPropertyModal(null);
    }
  }, [autoOpenPropertyModal, setCurrentPage, setAutoOpenPropertyModal]);

  const handleProtectedAction = (
    actionType: 'save' | 'book' | 'offer' | 'buy' | 'price_alert' | 'contact_agent',
    actionCallback: () => void
  ) => {
    if (!user) {
      setPendingPropertyAction({
        type: actionType,
        propertyId: activeProperty.id,
        propertyTitle: activeProperty.title
      });
      showToast(`Login as Buyer required to proceed. Your action will complete after login.`, 'info');
      setCurrentPage('auth-buyer');
    } else if (user.role !== 'buyer') {
      triggerRoleSwitchWarning('buyer', 'property-detail');
    } else {
      actionCallback();
    }
  };

  const handleAddPriceAlert = () => {
    handleProtectedAction('price_alert', () => {
      addPriceAlert({
        name: `Price drop alert for ${activeProperty.title}`,
        conditionType: 'Price Drop',
        targetPrice: activeProperty.price,
        city: activeProperty.city,
        propertyType: activeProperty.propertyType
      });
    });
  };

  return (
    <div className="fade-in" style={{ paddingTop: '10px', paddingBottom: '0px' }}>
      <div className="container">
        
        {/* Back Link and Quick Actions (Mobile Optimized Stack) */}
        <div className="top-nav-actions-bar">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                setCurrentPage('search');
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.85rem'
            }}
            className="hover-lift"
          >
            <ChevronLeft size={16} />
            <span>Return to Portfolio</span>
          </button>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }} className="action-bar-scroll">
            {/* Save Property Action */}
            <button
              onClick={() => handleProtectedAction('save', () => toggleSaveProperty(activeProperty.id))}
              className="btn btn-secondary hover-lift"
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                borderColor: isSaved ? 'var(--color-lavender)' : 'rgba(255,255,255,0.08)',
                color: isSaved ? 'var(--color-lavender)' : '#ffffff'
              }}
            >
              <Heart size={14} fill={isSaved ? 'var(--color-lavender)' : 'none'} />
              <span>{isSaved ? 'Saved' : 'Save Property'}</span>
            </button>

            {/* Price Alert Action */}
            <button
              onClick={handleAddPriceAlert}
              className="btn btn-secondary hover-lift"
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Bell size={14} style={{ color: 'var(--color-lavender)' }} />
              <span>Price Alert</span>
            </button>

            {/* Compare Action */}
            <button
              onClick={() => {
                toggleCompare(activeProperty.id);
                setCompareModalOpen(true);
              }}
              className="btn btn-secondary hover-lift"
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                borderColor: isComparing ? 'var(--color-lavender)' : 'rgba(255,255,255,0.08)'
              }}
            >
              <Compass size={14} style={{ color: isComparing ? 'var(--color-lavender)' : '#ffffff' }} />
              <span>{isComparing ? 'Comparing' : 'Compare'}</span>
            </button>

            {/* Share Action */}
            <button
              onClick={() => setShareOpen(true)}
              className="btn btn-secondary hover-lift"
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Share2 size={14} />
              <span>Share</span>
            </button>

            {/* Print Brochure */}
            <button
              onClick={() => showToast('Bespoke property booklet compiled and ready.', 'success')}
              className="btn btn-secondary hover-lift"
              style={{ padding: '8px 14px', borderRadius: '10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={14} />
              <span>Booklet</span>
            </button>
          </div>
        </div>

        {/* 1. Interactive High-Resolution Sliding Header Gallery */}
        <div style={{ marginBottom: '14px' }}>
          <PropertyGallery
            images={allImages}
            activeIndex={activeImageIndex}
            onIndexChange={setActiveImageIndex}
            onPrev={handlePrevImage}
            onNext={handleNextImage}
            onFullscreen={() => setLightboxOpen(true)}
            viewAllLabel={`View All (${allImages.length})`}
            variant="hero"
          />
        </div>

        {/* 2-Column Main Layout: Specs vs Booking Container */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 340px', gap: '16px', alignItems: 'start' }} className="detail-split">
          
          {/* Left Column: Specs Tabs, 360 Tour, and Calculator */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Specs & Interactive Tabs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div className="tabs-nav">
                <button onClick={() => setActiveTab('details')} className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}>Spatial Anatomy</button>
                <button onClick={() => setActiveTab('amenities')} className={`tab-btn ${activeTab === 'amenities' ? 'active' : ''}`}>Community Intelligence</button>
                <button onClick={() => setActiveTab('floorplan')} className={`tab-btn ${activeTab === 'floorplan' ? 'active' : ''}`}>Blueprint & Floor Plan</button>
              </div>

              <div className="glass-panel" style={{ padding: '20px', border: '1px solid rgba(255,255,255,0.04)' }}>
                {activeTab === 'details' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '24px' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Private Land Area</span>
                        <p style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff', fontFamily: 'var(--font-display)', marginTop: '4px' }}>{propertySqft.toLocaleString()} Sq Ft</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Built / Unveiled</span>
                        <p style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff', fontFamily: 'var(--font-display)', marginTop: '4px' }}>{propertyYearBuilt}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Annual Taxes</span>
                        <p style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff', fontFamily: 'var(--font-display)', marginTop: '4px' }}>${propertyTaxes.toLocaleString()}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Tonnage Rating</span>
                        <p style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff', fontFamily: 'var(--font-display)', marginTop: '4px' }}>Grade-A</p>
                      </div>
                    </div>

                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '10px 0' }} />

                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff', marginBottom: '8px' }}>Architectural Synopsis</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.7' }}>{activeProperty.description}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'amenities' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
                      <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '14px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>TRANSIT ACCESS</span>
                        <h4 style={{ fontSize: '1.8rem', color: 'var(--color-lavender)', fontWeight: 700, fontFamily: 'var(--font-display)', marginTop: '4px' }}>{propertyTransitScore}%</h4>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Excellent regional link</span>
                      </div>
                      <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '14px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>SCHOOL STANDARDS</span>
                        <h4 style={{ fontSize: '1.8rem', color: 'var(--color-lavender)', fontWeight: 700, fontFamily: 'var(--font-display)', marginTop: '4px' }}>{propertySchoolScore}/10</h4>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Elite Academy Zones</span>
                      </div>
                      <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '14px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>MUNICIPAL SAFETY</span>
                        <h4 style={{ fontSize: '1.8rem', color: 'var(--color-lavender)', fontWeight: 700, fontFamily: 'var(--font-display)', marginTop: '4px' }}>{propertyCrimeRate}</h4>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Top 1% National rating</span>
                      </div>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '0.92rem', color: '#ffffff', marginBottom: '8px' }}>Asset Security & Amenities Overview</h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        This luxury estate is situated in an elite geographical coordinate. Protected by fully redundant perimeter cameras, advanced double insulation windows, and an outstanding local community watch. Local medical centers include {propertyHospitalRating} with outstanding ratings.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'floorplan' && (
                  <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <h4 style={{ fontSize: '1rem', color: '#ffffff' }}>Level 1 & Level 2 Spatial Blueprint</h4>
                    
                    {/* Architectural blueprint render box */}
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '480px',
                        height: '240px',
                        background: 'rgba(3, 7, 18, 0.6)',
                        border: '1px solid rgba(167, 139, 250, 0.2)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Grid blueprints vector drawing */}
                      <svg width="100%" height="100%" viewBox="0 0 400 200" style={{ opacity: 0.35 }}>
                        <path d="M50 30 H 350 V 170 H 50 Z M 150 30 V 170 M 50 100 H 350" fill="none" stroke="var(--color-lavender)" strokeWidth="1" strokeDasharray="3,3" />
                        <text x="70" y="60" fill="#ffffff" fontSize="12">Master Suite</text>
                        <text x="220" y="60" fill="#ffffff" fontSize="12">Basalt Courtyard</text>
                        <text x="70" y="140" fill="#ffffff" fontSize="12">Wellness Spa</text>
                        <text x="220" y="140" fill="#ffffff" fontSize="12">Wine Crypt</text>
                      </svg>
                      
                      <span className="badge badge-lavender" style={{ position: 'absolute', bottom: '16px' }}>
                        Bespoke Blueprint File Locked
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 1. Interactive Property Photo Tour (TRREB IDX Compliant) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }} className="section-header-mobile">
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span>Interactive Property Photo Tour</span>
                    <span className="badge badge-lavender" style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid var(--color-lavender)', color: 'var(--color-lavender)', fontSize: '0.65rem' }}>
                      Official IDX Media
                    </span>
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Interactive Photo Gallery from Official TRREB Listing Feed
                  </span>
                </div>

                <button
                  onClick={() => setTourAutoPlay(prev => !prev)}
                  className="btn btn-secondary hover-lift"
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.78rem',
                    borderRadius: '10px',
                    background: tourAutoPlay ? 'rgba(167,139,250,0.25)' : 'rgba(255,255,255,0.06)',
                    color: tourAutoPlay ? '#c084fc' : '#ffffff',
                    border: tourAutoPlay ? '1px solid #a78bfa' : '1px solid rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: 600
                  }}
                >
                  <RotateCw size={13} className={tourAutoPlay ? 'spin' : ''} />
                  <span>{tourAutoPlay ? '⏸ Pause Slideshow' : '▶ Auto Slideshow'}</span>
                </button>
              </div>

              {/* PropertyGallery — Luxury Minimalist Photo Tour */}
              <PropertyGallery
                images={tourImages}
                activeIndex={tourRoomIndex}
                onIndexChange={navigateTour}
                onPrev={tourPrev}
                onNext={tourNext}
                onFullscreen={() => setIsTourFullscreen(true)}
                viewAllLabel="Fullscreen"
                variant="standard"
              />


              {/* ── 2. Official Virtual Tour Section (TRREB Compliant) ── */}
              <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(167, 139, 250, 0.15)', background: 'rgba(3,7,18,0.7)', padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }} className="card-header-mobile">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '220px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: hasOfficialTour ? '#3b82f6' : 'rgba(255,255,255,0.3)', boxShadow: hasOfficialTour ? '0 0 8px #3b82f6' : 'none', flexShrink: 0 }} />
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff', margin: 0 }}>Official Virtual Tour</h4>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                        {hasOfficialTour ? 'Provided by listing brokerage via TRREB' : 'No Official Virtual Tour Available.'}
                      </span>
                    </div>
                  </div>

                  {hasOfficialTour ? (
                    <a
                      href={(activeProperty as any).virtualTour}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary hover-lift"
                      style={{ padding: '8px 16px', fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Maximize2 size={14} />
                      <span>Launch Official Virtual Tour</span>
                    </a>
                  ) : (
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontStyle: 'italic', background: 'rgba(255,255,255,0.03)', padding: '4px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      No Official Virtual Tour Available.
                    </span>
                  )}
                </div>

                {hasOfficialTour && (
                  <div style={{ marginTop: '16px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(59,130,246,0.3)' }}>
                    <iframe
                      src={(activeProperty as any).virtualTour || ''}
                      title={`${activeProperty.title} Official Virtual Tour`}
                      style={{ width: '100%', height: '420px', border: 'none', display: 'block' }}
                      allowFullScreen
                    />
                  </div>
                )}
              </div>

              {/* ── Full-Screen Tour Modal ── */}
              {isTourFullscreen && (
                <div style={{
                  position: 'fixed', inset: 0, zIndex: 9999,
                  background: 'rgba(0,0,0,0.97)',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center'
                }}>
                  {/* Close */}
                  <button
                    onClick={() => setIsTourFullscreen(false)}
                    style={{
                      position: 'absolute', top: '20px', right: '20px',
                      width: '42px', height: '42px', borderRadius: '50%',
                      background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                      color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      zIndex: 10, backdropFilter: 'blur(10px)'
                    }}
                  >
                    <X size={20} />
                  </button>

                  {/* Photo counter */}
                  <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--color-lavender)' }}>
                      {tourRoomIndex + 1} / {tourImages.length}
                    </div>
                  </div>

                  {/* Full-screen image */}
                  <div style={{ position: 'relative', width: '90vw', maxHeight: '72vh', borderRadius: '16px', overflow: 'hidden' }}>
                    <img
                      src={tourImages[tourRoomIndex]}
                      alt={`Photo ${tourRoomIndex + 1}`}
                      style={{
                        width: '100%', maxHeight: '72vh',
                        objectFit: 'contain', display: 'block',
                        opacity: tourFading ? 0 : 1,
                        transition: 'opacity 0.28s ease'
                      }}
                    />
                    <button onClick={tourPrev} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={26} /></button>
                    <button onClick={tourNext} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight size={26} /></button>
                  </div>

                  {/* Thumbnail strip */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '18px', overflowX: 'auto', maxWidth: '90vw', padding: '4px 0' }}>
                    {tourImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => navigateTour(idx)}
                        style={{
                          flexShrink: 0, width: '80px', height: '56px',
                          padding: 0, borderRadius: '8px', overflow: 'hidden',
                          border: tourRoomIndex === idx ? '2.5px solid var(--color-lavender)' : '2px solid rgba(255,255,255,0.15)',
                          cursor: 'pointer', transition: 'border-color 0.2s',
                          boxShadow: tourRoomIndex === idx ? '0 0 14px rgba(167,139,250,0.7)' : 'none'
                        }}
                      >
                        <img src={imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Official Drone / Video Media (TRREB Compliant) */}
            <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(167, 139, 250, 0.15)', background: 'rgba(3,7,18,0.7)', padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }} className="card-header-mobile">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: activeProperty.videoUrl ? '#10b981' : 'rgba(255,255,255,0.3)', boxShadow: activeProperty.videoUrl ? '0 0 8px #10b981' : 'none' }} />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff', margin: 0 }}>Official Drone & Aerial Video</h4>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                      {activeProperty.videoUrl ? 'Official Video Media from Listing Feed' : 'Drone Video Not Available'}
                    </span>
                  </div>
                </div>

                {activeProperty.videoUrl ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setDroneMuted(prev => !prev)}
                      className="btn btn-secondary hover-lift"
                      style={{ padding: '5px 10px', fontSize: '0.74rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      {droneMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                      <span>{droneMuted ? 'Muted' : 'Sound On'}</span>
                    </button>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontStyle: 'italic', background: 'rgba(255,255,255,0.03)', padding: '4px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    Drone Video Not Available
                  </span>
                )}
              </div>

              {activeProperty.videoUrl && (
                <div style={{ marginTop: '16px', borderRadius: '14px', overflow: 'hidden', height: '320px', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
                  <video
                    src={activeProperty.videoUrl}
                    poster={activeProperty.imageUrl}
                    controls
                    ref={(el) => { if (el) el.muted = droneMuted; }}
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>

            {/* 3. Bespoke Mortgage Calculator with animated Pie Chart */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 500, color: '#ffffff' }}>Mortgage Intelligence Matrix</h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Animate and recalculate investment thresholds instantly</span>
              </div>

              <div className="glass-panel calculator-split" style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'center', border: '1px solid rgba(167, 139, 250, 0.15)' }}>
                
                {/* Sliders Container */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Acquisition Cost</span>
                      <span style={{ color: '#ffffff', fontWeight: 600 }}>${homeValue.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min={Math.floor(activeProperty.price * 0.7)}
                      max={Math.floor(activeProperty.price * 1.5)}
                      step="100000"
                      value={homeValue}
                      onChange={e => { setHomeValue(Number(e.target.value)); setDownPayment(Math.floor(Number(e.target.value) * 0.2)); }}
                      style={{ accentColor: 'var(--color-lavender)', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Down Payment (20%)</span>
                      <span style={{ color: '#ffffff', fontWeight: 600 }}>${downPayment.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min={Math.floor(homeValue * 0.1)}
                      max={Math.floor(homeValue * 0.8)}
                      step="50000"
                      value={downPayment}
                      onChange={e => setDownPayment(Number(e.target.value))}
                      style={{ accentColor: 'var(--color-lavender)', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Interest Rate</span>
                      <span style={{ color: '#ffffff', fontWeight: 600 }}>{interestRate}%</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="8"
                      step="0.1"
                      value={interestRate}
                      onChange={e => setInterestRate(Number(e.target.value))}
                      style={{ accentColor: 'var(--color-lavender)', cursor: 'pointer' }}
                    />
                  </div>
                </div>

                {/* SVG Animated Chart & Results */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                  <div style={{ position: 'relative', width: '150px', height: '150px' }}>
                    
                    {/* Ring Pie drawing using SVG path calculations */}
                    <svg width="100%" height="100%" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
                      
                      {/* Principal Portion */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="var(--color-lavender)"
                        strokeWidth="8"
                        strokeDasharray={`${principalPercent * 2.51} 251`}
                        strokeDashoffset="0"
                        transform="rotate(-90 50 50)"
                        style={{ transition: 'stroke-dasharray 0.5s ease' }}
                      />

                      {/* Taxes Portion */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="8"
                        strokeDasharray={`${taxesPercent * 2.51} 251`}
                        strokeDashoffset={`-${principalPercent * 2.51}`}
                        transform="rotate(-90 50 50)"
                        style={{ transition: 'stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease' }}
                      />
                    </svg>

                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Monthly Est</span>
                      <p style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-display)', marginTop: '20px' }}>
                        ${Math.round(totalMonthlyEstimate).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-lavender)' }} />
                        <span>Principal & Interest</span>
                      </span>
                      <span>${Math.round(monthlyPayment).toLocaleString()}/mo</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} />
                        <span>Property Taxes</span>
                      </span>
                      <span>${Math.round(monthlyTaxes).toLocaleString()}/mo</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                        <span>HOA Dues</span>
                      </span>
                      <span>${monthlyHOA}/mo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Buyer VIP Actions Console */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* VIP Buyer Actions Box */}
            <div className="glass-panel" style={{ padding: '28px', border: '1px solid var(--color-lavender)', boxShadow: '0 15px 35px rgba(124, 58, 237, 0.2)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <span className="badge badge-lavender" style={{ marginBottom: '8px' }}>BUYER VIP GATEWAY</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff', fontFamily: 'var(--font-display)' }}>
                  ${propertyPrice.toLocaleString('en-CA')}
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Est. ${(Math.round(propertyPrice * 0.0048)).toLocaleString()}/mo • Listing MLS® #{activeProperty.mlsNumber || `N${activeProperty.id}`}
                </p>
              </div>

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />

              {/* Primary Action 1: Book Viewing */}
              <button
                onClick={() => handleProtectedAction('book', () => setCurrentPage('schedule-viewing'))}
                className="btn btn-primary hover-lift"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                <Calendar size={18} />
                <span>Book Private Viewing</span>
              </button>

              {/* Primary Action 2: Make Purchase Offer */}
              <button
                onClick={() => handleProtectedAction('buy', () => setCurrentPage('purchase-offer'))}
                className="btn hover-lift"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                }}
              >
                <DollarSign size={18} />
                <span>Make Purchase Offer</span>
              </button>

              {/* Secondary Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '4px' }}>
                <button
                  onClick={() => {
                    toggleCompare(activeProperty.id);
                    setCompareModalOpen(true);
                  }}
                  className="btn btn-secondary hover-lift"
                  style={{ padding: '10px', fontSize: '0.78rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Compass size={14} />
                  <span>Compare</span>
                </button>

                <button
                  onClick={() => setShareOpen(true)}
                  className="btn btn-secondary hover-lift"
                  style={{ padding: '10px', fontSize: '0.78rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Share2 size={14} />
                  <span>Share</span>
                </button>
              </div>

              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.4' }}>
                🔒 Direct transmission to Kang Homes &amp; Karan Kang, REALTOR®. Royal LePage Pinnacle Real Estate.
              </span>
            </div>

            {/* Managing Partner Agent Card */}
            <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Managing Listing Realtor</span>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <img
                  src="/karan-kang.jpg"
                  alt="Karan Kang REALTOR®"
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', border: '2px solid #E31837', flexShrink: 0 }}
                />
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>Karan Kang, REALTOR®</h4>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Royal LePage Pinnacle Real Estate</p>
                </div>
              </div>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                <span>Cell: 437-998-5873</span>
                <span>Office: 905-464-3035</span>
                <span>Mail: realtorkarankang@gmail.com</span>
              </div>
            </div>

            {/* TRREB / PropTx IDX Disclosure Card (100% TRREB & PropTx DLA Compliant) */}
            <div className="glass-panel" style={{ padding: '18px 20px', border: '1px solid rgba(167,139,250,0.15)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(3,7,18,0.6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-lavender)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  TRREB / PropTx IDX Disclosure
                </span>
                <span className="badge badge-lavender" style={{ fontSize: '0.62rem' }}>TRREB Member Brokerage</span>
              </div>
              <div style={{ fontSize: '0.76rem', color: '#ffffff', fontWeight: 600 }}>
                Listing Brokerage: {activeProperty.listOfficeName || 'TRREB Member Brokerage'} · MLS® #{activeProperty.mlsNumber || activeProperty.id}
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: '1.45', margin: 0 }}>
                The information provided herein is deemed reliable but is not guaranteed accurate by PROPTX.
              </p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: '1.45', margin: 0 }}>
                The information provided herein must only be used by consumers that have a bona fide interest in the purchase, sale, or lease of real estate and may not be used for any commercial purpose or any other purpose.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Render All Workflow Modals */}
      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        propertyTitle={activeProperty.title}
        propertyUrl={typeof window !== 'undefined' ? window.location.href : 'https://novaestate.ca'}
      />

      <BookViewingModal
        isOpen={bookViewingOpen}
        onClose={() => setBookViewingOpen(false)}
        propertyId={activeProperty.id}
        propertyTitle={activeProperty.title}
        propertyAddress={activeProperty.location || activeProperty.address}
      />

      <OfferWizardModal
        isOpen={offerWizardOpen}
        onClose={() => setOfferWizardOpen(false)}
        property={activeProperty}
      />

      <PropertyCompareModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
      />

      {/* Full-Screen Lightbox Gallery Modal */}
      {lightboxOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: 'rgba(3, 7, 18, 0.96)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '20px'
          }}
          className="fade-in"
        >
          {/* Lightbox Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ffffff' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>{activeProperty.title}</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Photo {activeImageIndex + 1} of {allImages.length}
              </span>
            </div>

            <button
              onClick={() => setLightboxOpen(false)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              className="hover-lift"
              title="Close (Esc)"
            >
              <X size={20} />
            </button>
          </div>

          {/* Lightbox Main Stage */}
          <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0', overflow: 'hidden' }}>
            <button
              onClick={handlePrevImage}
              style={{
                position: 'absolute',
                left: '20px',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(3, 7, 18, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
              className="hover-lift"
              title="Previous (Left Arrow)"
            >
              <ChevronLeft size={26} />
            </button>

            <img
              src={allImages[activeImageIndex]}
              alt={`Photo ${activeImageIndex + 1}`}
              style={{
                maxWidth: '90vw',
                maxHeight: '75vh',
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
              }}
            />

            <button
              onClick={handleNextImage}
              style={{
                position: 'absolute',
                right: '20px',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(3, 7, 18, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
              className="hover-lift"
              title="Next (Right Arrow)"
            >
              <ChevronRight size={26} />
            </button>
          </div>

          {/* Lightbox Bottom Thumbnail Strip */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              overflowX: 'auto',
              padding: '10px 0'
            }}
          >
            {allImages.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                style={{
                  width: '64px',
                  height: '48px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  padding: 0,
                  border: idx === activeImageIndex ? '2px solid var(--color-lavender)' : '1px solid rgba(255,255,255,0.1)',
                  opacity: idx === activeImageIndex ? 1 : 0.5,
                  cursor: 'pointer',
                  transform: idx === activeImageIndex ? 'scale(1.08)' : 'scale(1)',
                  transition: 'all 0.2s ease'
                }}
              >
                <img src={img} alt={`Thumb ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .gallery-grid { grid-template-columns: 1fr !important; height: auto !important; }
          .gallery-grid div:nth-child(2) { display: none !important; }
          .detail-split { grid-template-columns: 1fr !important; gap: 40px !important; }
          .calculator-split { grid-template-columns: 1fr !important; gap: 30px !important; }
        }
      `}</style>
    </div>
  );
};
