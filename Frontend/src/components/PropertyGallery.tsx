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
}

/**
 * Luxury Minimalist Property Gallery (Sotheby's / Compass / Michael Solomon style)
 * Distraction-free high-resolution photography viewing with zero text labels, badges, or category filters.
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
}) => {
  const isHero = variant === 'hero';
  const totalCount = images.length;
  const currentImage = images[activeIndex] || images[0];

  return (
    <div className="pg-wrapper">

      {/* ════════════════════════════════════════════════════════
          DESKTOP VIEW (≥ 769px)
      ════════════════════════════════════════════════════════ */}
      <div className="pg-desktop-only">
        {isHero ? (
          /* Hero variant: 2.4fr main + 1fr side previews */
          <div className="pg-desktop-grid">
            <div className="pg-hero-desktop" onClick={onFullscreen}>
              <img src={currentImage} alt={`Property Photo ${activeIndex + 1}`} className="pg-hero-img" />
              <div className="pg-scrim" />

              <button className="pg-arrow pg-arrow-left hover-lift" onClick={(e) => { e.stopPropagation(); onPrev(); }} title="Previous">
                <ChevronLeft size={20} />
              </button>
              <button className="pg-arrow pg-arrow-right hover-lift" onClick={(e) => { e.stopPropagation(); onNext(); }} title="Next">
                <ChevronRight size={20} />
              </button>

              <div className="pg-counter">{activeIndex + 1} / {totalCount}</div>

              <div className="pg-overlay-desktop pg-overlay-minimal">
                <button className="btn btn-secondary hover-lift pg-fullscreen-btn" onClick={(e) => { e.stopPropagation(); onFullscreen(); }}>
                  <Maximize2 size={13} />
                  <span>{viewAllLabel}</span>
                </button>
              </div>
            </div>

            <div className="pg-side-grid">
              <div className="pg-side-preview" onClick={() => onIndexChange((activeIndex + 1) % totalCount)}>
                <img src={images[(activeIndex + 1) % totalCount]} alt="Preview 1" className="pg-side-img hover-lift" />
              </div>
              <div className="pg-side-preview" onClick={onFullscreen}>
                <img src={images[(activeIndex + 2) % totalCount]} alt="Preview 2" className="pg-side-img hover-lift" />
                <div className="pg-side-overlay">
                  <Camera size={22} style={{ color: 'var(--color-lavender)' }} />
                  <span className="pg-side-more">+{totalCount - 1} Photos</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Standard variant: Clean 100% full-width photo frame */
          <div className="pg-standard-frame" onClick={onFullscreen}>
            <img src={currentImage} alt={`Property Photo ${activeIndex + 1}`} className="pg-hero-img" />
            <div className="pg-scrim" />

            <button className="pg-arrow pg-arrow-left hover-lift" onClick={(e) => { e.stopPropagation(); onPrev(); }} title="Previous">
              <ChevronLeft size={20} />
            </button>
            <button className="pg-arrow pg-arrow-right hover-lift" onClick={(e) => { e.stopPropagation(); onNext(); }} title="Next">
              <ChevronRight size={20} />
            </button>

            <div className="pg-counter">{activeIndex + 1} / {totalCount}</div>

            <div className="pg-overlay-desktop pg-overlay-minimal">
              <button className="btn btn-secondary hover-lift pg-fullscreen-btn" onClick={(e) => { e.stopPropagation(); onFullscreen(); }}>
                <Maximize2 size={13} />
                <span>{viewAllLabel}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════
          MOBILE VIEW (≤ 768px)
          Native App card layout — distraction-free image presentation
      ════════════════════════════════════════════════════════ */}
      <div className="pg-mobile-only">
        <div className="pg-mobile-card">
          <div className="pg-mobile-hero" onClick={onFullscreen}>
            <img src={currentImage} alt={`Property Photo ${activeIndex + 1}`} className="pg-mobile-img" />

            <button className="pg-arrow pg-arrow-left hover-lift" onClick={(e) => { e.stopPropagation(); onPrev(); }} title="Previous">
              <ChevronLeft size={18} />
            </button>
            <button className="pg-arrow pg-arrow-right hover-lift" onClick={(e) => { e.stopPropagation(); onNext(); }} title="Next">
              <ChevronRight size={18} />
            </button>
            <div className="pg-counter">{activeIndex + 1} / {totalCount}</div>
            <button className="pg-mobile-expand" onClick={(e) => { e.stopPropagation(); onFullscreen(); }}>
              <Maximize2 size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          CLEAN THUMBNAIL NAVIGATION (Zero text labels)
      ════════════════════════════════════════════════════════ */}
      <div className="pg-thumbs">
        {images.map((imgUrl, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={index}
              onClick={() => onIndexChange(index)}
              className={`pg-thumb-btn${isActive ? ' pg-thumb-active' : ''}`}
              title={`View Photo ${index + 1}`}
            >
              <img src={imgUrl} alt={`Thumbnail ${index + 1}`} className="pg-thumb-img" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
