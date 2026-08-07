import React from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Camera } from 'lucide-react';

interface PropertyGalleryProps {
  images: string[];
  activeIndex: number;
  onIndexChange: (idx: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onFullscreen: () => void;
  viewAllLabel?: string;
  variant?: 'hero' | 'standard';
  autoplay?: boolean;
  autoplayInterval?: number;
}

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80';

/**
 * Luxury Minimalist Property Gallery (Sotheby's / Compass / Michael Solomon style)
 * Distraction-free high-resolution photography viewing with zero text labels, badges, or category filters.
 * Premium responsive controls, lazy loading, preloading, loading states, and mobile gestures.
 */
export const PropertyGallery: React.FC<PropertyGalleryProps> = ({
  images,
  activeIndex,
  onIndexChange,
  onPrev,
  onNext,
  onFullscreen,
  viewAllLabel = 'Fullscreen',
  variant = 'standard',
  autoplay = false,
  autoplayInterval = 5000,
}) => {
  // 1. Sanitize & Filter Images (Ensure we always have a non-empty string array)
  const galleryImages = React.useMemo(() => {
    if (!images || !Array.isArray(images)) return [PLACEHOLDER_IMAGE];
    const cleaned = images.filter((img) => typeof img === 'string' && img.trim() !== '');
    return cleaned.length > 0 ? cleaned : [PLACEHOLDER_IMAGE];
  }, [images]);

  const totalCount = galleryImages.length;

  // 2. Clamp Active Index (Prevent indices that are out of bounds on array resize)
  const safeActiveIndex = React.useMemo(() => {
    if (activeIndex < 0) return 0;
    if (activeIndex >= totalCount) return totalCount - 1;
    return activeIndex;
  }, [activeIndex, totalCount]);

  const currentImage = galleryImages[safeActiveIndex] || PLACEHOLDER_IMAGE;

  // 3. Force Standard Frame Layout for listings with fewer than 3 images
  const effectiveVariant = (variant === 'hero' && totalCount >= 3) ? 'hero' : 'standard';
  const isHeroMode = effectiveVariant === 'hero';

  // 4. Loading States for Images
  const [activeImageLoading, setActiveImageLoading] = React.useState(true);
  const [side1Loading, setSide1Loading] = React.useState(true);
  const [side2Loading, setSide2Loading] = React.useState(true);

  React.useEffect(() => {
    setActiveImageLoading(true);
  }, [currentImage]);

  React.useEffect(() => {
    setSide1Loading(true);
    setSide2Loading(true);
  }, [safeActiveIndex]);

  // 5. Autoplay Effect
  React.useEffect(() => {
    if (!autoplay || totalCount <= 1) return;
    const timer = setInterval(() => {
      onNext();
    }, autoplayInterval);
    return () => clearInterval(timer);
  }, [autoplay, autoplayInterval, onNext, totalCount]);

  // 6. Preload Next & Previous Images in background for instant transition
  React.useEffect(() => {
    if (totalCount <= 1) return;

    const nextIndex = (safeActiveIndex + 1) % totalCount;
    const nextImg = new Image();
    nextImg.src = galleryImages[nextIndex];

    const prevIndex = (safeActiveIndex - 1 + totalCount) % totalCount;
    const prevImg = new Image();
    prevImg.src = galleryImages[prevIndex];
  }, [safeActiveIndex, galleryImages, totalCount]);

  // 7. Mobile Swipe Gestures
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    const isSwipeLeft = distance > 50;  // Swiped left -> show next
    const isSwipeRight = distance < -50; // Swiped right -> show prev

    if (isSwipeLeft) {
      onNext();
    } else if (isSwipeRight) {
      onPrev();
    }
  };

  // Pre-calculate side preview indices safely
  const sideIndex1 = (safeActiveIndex + 1) % totalCount;
  const sideIndex2 = (safeActiveIndex + 2) % totalCount;

  return (
    <div className="pg-wrapper">

      {/* ════════════════════════════════════════════════════════
          DESKTOP VIEW (≥ 769px)
      ════════════════════════════════════════════════════════ */}
      <div className="pg-desktop-only">
        {isHeroMode ? (
          /* Hero variant: 2.4fr main + 1fr side previews */
          <div className="pg-desktop-grid">
            <div className="pg-hero-desktop" onClick={onFullscreen}>
              {activeImageLoading && <div className="pg-skeleton" />}
              <img
                src={currentImage}
                alt={`Property Photo ${safeActiveIndex + 1}`}
                className="pg-hero-img"
                onLoad={() => setActiveImageLoading(false)}
                onError={() => setActiveImageLoading(false)}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                style={{ opacity: activeImageLoading ? 0 : 1 }}
              />
              <div className="pg-scrim" />

              <button
                className="pg-arrow pg-arrow-left hover-lift"
                onClick={(e) => { e.stopPropagation(); onPrev(); }}
                title="Previous Photo"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                className="pg-arrow pg-arrow-right hover-lift"
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                title="Next Photo"
              >
                <ChevronRight size={20} />
              </button>

              <div className="pg-counter">{safeActiveIndex + 1} / {totalCount}</div>

              <div className="pg-overlay-desktop pg-overlay-minimal">
                <button
                  className="btn btn-secondary hover-lift pg-fullscreen-btn"
                  onClick={(e) => { e.stopPropagation(); onFullscreen(); }}
                >
                  <Maximize2 size={13} />
                  <span>{viewAllLabel}</span>
                </button>
              </div>
            </div>

            <div className="pg-side-grid">
              <div className="pg-side-preview" onClick={() => onIndexChange(sideIndex1)}>
                {side1Loading && <div className="pg-skeleton" />}
                <img
                  src={galleryImages[sideIndex1]}
                  alt={`Preview Photo ${sideIndex1 + 1}`}
                  className="pg-side-img hover-lift"
                  onLoad={() => setSide1Loading(false)}
                  onError={() => setSide1Loading(false)}
                  loading="lazy"
                  decoding="async"
                  style={{ opacity: side1Loading ? 0 : 1 }}
                />
              </div>
              <div className="pg-side-preview" onClick={onFullscreen}>
                {side2Loading && <div className="pg-skeleton" />}
                <img
                  src={galleryImages[sideIndex2]}
                  alt={`Preview Photo ${sideIndex2 + 1}`}
                  className="pg-side-img hover-lift"
                  onLoad={() => setSide2Loading(false)}
                  onError={() => setSide2Loading(false)}
                  loading="lazy"
                  decoding="async"
                  style={{ opacity: side2Loading ? 0 : 1 }}
                />
                <div className="pg-side-overlay">
                  <Camera size={22} style={{ color: 'var(--color-red-primary)' }} />
                  <span className="pg-side-more">+{totalCount - 1} Photos</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Standard variant: Clean 100% full-width photo frame */
          <div className="pg-standard-frame" onClick={onFullscreen}>
            {activeImageLoading && <div className="pg-skeleton" />}
            <img
              src={currentImage}
              alt={`Property Photo ${safeActiveIndex + 1}`}
              className="pg-hero-img"
              onLoad={() => setActiveImageLoading(false)}
              onError={() => setActiveImageLoading(false)}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              style={{ opacity: activeImageLoading ? 0 : 1 }}
            />
            <div className="pg-scrim" />

            <button
              className="pg-arrow pg-arrow-left hover-lift"
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              title="Previous Photo"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="pg-arrow pg-arrow-right hover-lift"
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              title="Next Photo"
            >
              <ChevronRight size={20} />
            </button>

            <div className="pg-counter">{safeActiveIndex + 1} / {totalCount}</div>

            <div className="pg-overlay-desktop pg-overlay-minimal">
              <button
                className="btn btn-secondary hover-lift pg-fullscreen-btn"
                onClick={(e) => { e.stopPropagation(); onFullscreen(); }}
              >
                <Maximize2 size={13} />
                <span>{viewAllLabel}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════
          MOBILE VIEW (≤ 768px)
          Native App card layout — distraction-free image presentation with swipes
      ════════════════════════════════════════════════════════ */}
      <div className="pg-mobile-only">
        <div className="pg-mobile-card">
          <div
            className="pg-mobile-hero"
            onClick={onFullscreen}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {activeImageLoading && <div className="pg-skeleton" />}
            <img
              src={currentImage}
              alt={`Property Photo ${safeActiveIndex + 1}`}
              className="pg-mobile-img"
              onLoad={() => setActiveImageLoading(false)}
              onError={() => setActiveImageLoading(false)}
              loading="eager"
              decoding="async"
              style={{ opacity: activeImageLoading ? 0 : 1 }}
            />

            <button
              className="pg-arrow pg-arrow-left hover-lift"
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              title="Previous Photo"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="pg-arrow pg-arrow-right hover-lift"
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              title="Next Photo"
            >
              <ChevronRight size={18} />
            </button>
            <div className="pg-counter">{safeActiveIndex + 1} / {totalCount}</div>
            <button
              className="pg-mobile-expand"
              onClick={(e) => { e.stopPropagation(); onFullscreen(); }}
              title="Maximize"
            >
              <Maximize2 size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          CLEAN THUMBNAIL NAVIGATION (Zero text labels)
      ════════════════════════════════════════════════════════ */}
      {totalCount > 1 && (
        <div className="pg-thumbs">
          {galleryImages.map((imgUrl, index) => {
            const isActive = index === safeActiveIndex;
            // Generate a secure, unique, and stable React key combining index and a URL slice
            const elementKey = `thumb-${index}-${imgUrl.slice(-15)}`;
            return (
              <button
                key={elementKey}
                onClick={() => onIndexChange(index)}
                className={`pg-thumb-btn${isActive ? ' pg-thumb-active' : ''}`}
                title={`View Photo ${index + 1}`}
              >
                <img
                  src={imgUrl}
                  alt={`Thumbnail ${index + 1}`}
                  className="pg-thumb-img"
                  loading="lazy"
                  decoding="async"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
