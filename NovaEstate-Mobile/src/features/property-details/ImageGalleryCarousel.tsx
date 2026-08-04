/**
 * Property Details - Animated Mobile Image Gallery & Gesture Carousel
 */

import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Text, LayoutChangeEvent } from 'react-native';
import { Image } from 'expo-image';
import { Colors, Spacing, Typography, BorderRadius, LuxuryPalette } from '@/theme';
import { triggerHaptic } from '@/utils';

const { width: windowWidth } = Dimensions.get('window');
const GALLERY_HEIGHT = 340;

interface GalleryProps {
  images: string[];
  onBackPress: () => void;
  onSharePress: () => void;
}

export function ImageGalleryCarousel({ images = [], onBackPress, onSharePress }: GalleryProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [containerWidth, setContainerWidth] = useState(windowWidth);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  // Safe fallback if images array is empty or undefined
  const displayImages = (images || []).filter(Boolean);
  const hasImages = displayImages.length > 0;

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0 && width !== containerWidth) {
      setContainerWidth(width);
    }
  };

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / (containerWidth || windowWidth));
    if (index !== activeIndex && index >= 0 && index < displayImages.length) {
      setActiveIndex(index);
    }
  };

  const scrollToIndex = (index: number) => {
    if (!hasImages || index < 0 || index >= displayImages.length) return;
    triggerHaptic.light();
    setActiveIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * containerWidth,
      animated: true,
    });
  };

  const handlePrev = () => {
    if (!hasImages) return;
    if (activeIndex > 0) {
      scrollToIndex(activeIndex - 1);
    } else {
      scrollToIndex(displayImages.length - 1);
    }
  };

  const handleNext = () => {
    if (!hasImages) return;
    if (activeIndex < displayImages.length - 1) {
      scrollToIndex(activeIndex + 1);
    } else {
      scrollToIndex(0);
    }
  };

  const toggleFavorite = () => {
    triggerHaptic.light();
    setIsFavorite((prev) => !prev);
  };

  const toggleAutoPlay = () => {
    if (!hasImages) return;
    triggerHaptic.medium();
    setIsAutoPlay((prev) => !prev);
  };

  useEffect(() => {
    if (!isAutoPlay || !hasImages) return;
    const timer = setInterval(() => {
      handleNext();
    }, 3500);
    return () => clearInterval(timer);
  }, [isAutoPlay, activeIndex, containerWidth, displayImages.length]);

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {hasImages ? (
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {displayImages.map((url, idx) => (
            <Image
              key={idx}
              source={{ uri: url }}
              style={[styles.image, { width: containerWidth }]}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
          ))}
        </ScrollView>
      ) : (
        <View style={[styles.noPhotoContainer, { width: containerWidth }]}>
          <Text style={styles.noPhotoIcon}>📷</Text>
          <Text style={styles.noPhotoTitle}>No TRREB MLS® Photo Available</Text>
          <Text style={styles.noPhotoSubtitle}>Listing photos have not been published yet by the listing brokerage.</Text>
        </View>
      )}

      {/* Top Action Buttons Overlay */}
      <View style={styles.topActions}>
        <TouchableOpacity style={styles.actionBtn} onPress={onBackPress} activeOpacity={0.8}>
          <Text style={styles.btnIcon}>←</Text>
        </TouchableOpacity>

        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={toggleFavorite} activeOpacity={0.8}>
            <Text style={styles.btnIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.leftMargin]} onPress={onSharePress} activeOpacity={0.8}>
            <Text style={styles.btnIcon}>🔗</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Left Navigation Arrow */}
      {displayImages.length > 1 && (
        <TouchableOpacity
          style={[styles.navArrow, styles.navArrowLeft]}
          onPress={handlePrev}
          activeOpacity={0.7}
        >
          <Text style={styles.navArrowText}>‹</Text>
        </TouchableOpacity>
      )}

      {/* Right Navigation Arrow */}
      {displayImages.length > 1 && (
        <TouchableOpacity
          style={[styles.navArrow, styles.navArrowRight]}
          onPress={handleNext}
          activeOpacity={0.7}
        >
          <Text style={styles.navArrowText}>›</Text>
        </TouchableOpacity>
      )}

      {/* Bottom Control Bar with Counter, Dots, and Auto-Play */}
      <View style={styles.bottomOverlay}>
        {/* Photo Counter Pill */}
        <View style={styles.counterPill}>
          <Text style={styles.counterText}>📷 {activeIndex + 1} / {displayImages.length}</Text>
        </View>

        {/* Pagination Dots (Clickable) */}
        {displayImages.length > 1 && (
          <View style={styles.paginationDots}>
            {displayImages.map((_, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => scrollToIndex(idx)}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
              >
                <View
                  style={[styles.dot, idx === activeIndex ? styles.dotActive : styles.dotInactive]}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Auto Play Slideshow Toggle */}
        <TouchableOpacity
          style={[styles.autoPlayBtn, isAutoPlay && styles.autoPlayBtnActive]}
          onPress={toggleAutoPlay}
          activeOpacity={0.8}
        >
          <Text style={styles.autoPlayText}>{isAutoPlay ? '⏸ Pause' : '▶ Auto'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: GALLERY_HEIGHT,
    position: 'relative',
    backgroundColor: LuxuryPalette.obsidian900,
    overflow: 'hidden',
  },
  image: {
    height: GALLERY_HEIGHT,
  },
  topActions: {
    position: 'absolute',
    top: 40,
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 15,
  },
  rightActions: {
    flexDirection: 'row',
  },
  leftMargin: {
    marginLeft: Spacing.xs,
  },
  actionBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(11, 13, 18, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  btnIcon: {
    fontSize: Typography.fontSizes.md,
    color: Colors.textPrimary,
  },
  navArrow: {
    position: 'absolute',
    top: '46%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(11, 13, 18, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    zIndex: 20,
  },
  navArrowLeft: {
    left: 12,
  },
  navArrowRight: {
    right: 12,
  },
  navArrowText: {
    fontSize: 26,
    color: Colors.primaryLight,
    fontWeight: '300',
    marginTop: -3,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 15,
  },
  counterPill: {
    backgroundColor: 'rgba(11, 13, 18, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  counterText: {
    fontSize: 11,
    color: Colors.textGold,
    fontWeight: '700',
  },
  paginationDots: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 13, 18, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  dotActive: {
    width: 18,
    backgroundColor: Colors.primary,
  },
  dotInactive: {
    width: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  autoPlayBtn: {
    backgroundColor: 'rgba(11, 13, 18, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  autoPlayBtnActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.25)',
    borderColor: Colors.primary,
  },
  autoPlayText: {
    fontSize: 11,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  noPhotoContainer: {
    height: GALLERY_HEIGHT,
    backgroundColor: '#0F1218',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  noPhotoIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  noPhotoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  noPhotoSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default ImageGalleryCarousel;

