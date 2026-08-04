/**
 * Client Sharing - Fullscreen Presentation Pitch Mode
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Colors, Spacing, Typography, BorderRadius, LuxuryPalette } from '@/theme';
import { Property } from '@/types';
import { formatCurrency, triggerHaptic } from '@/utils';

const { width, height } = Dimensions.get('window');

interface PresentationModeProps {
  property: Property;
  onExit: () => void;
}

export function PresentationModeView({ property, onExit }: PresentationModeProps) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const handleScroll = (e: any) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const idx = Math.round(offsetX / width);
    if (idx !== activeImgIndex && idx >= 0 && idx < property.images.length) {
      setActiveImgIndex(idx);
    }
  };

  const handleExit = () => {
    triggerHaptic.light();
    onExit();
  };

  return (
    <View style={styles.container}>
      {/* High-Res Gallery Carousel */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.gallery}
      >
        {property.images.map((img, idx) => (
          <Image key={idx} source={{ uri: img }} style={styles.image} contentFit="cover" />
        ))}
      </ScrollView>

      {/* Floating Exit Pitch Button */}
      <TouchableOpacity style={styles.exitBtn} onPress={handleExit}>
        <Text style={styles.exitText}>✕ Exit Pitch Mode</Text>
      </TouchableOpacity>

      {/* Luxury Specs Overlay */}
      <View style={styles.overlay}>
        <Text style={styles.priceText}>{formatCurrency(property.price)}</Text>
        <Text style={styles.titleText}>{property.title}</Text>
        <Text style={styles.addressText}>
          {property.address}, {property.city}
        </Text>

        <View style={styles.specsRow}>
          <Text style={styles.specItem}>{property.bedrooms} Beds</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.specItem}>{property.bathrooms} Baths</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.specItem}>{property.sqft} sqft</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LuxuryPalette.obsidian900,
  },
  gallery: {
    width: width,
    height: height,
  },
  image: {
    width: width,
    height: height,
  },
  exitBtn: {
    position: 'absolute',
    top: 50,
    right: Spacing.md,
    backgroundColor: 'rgba(7, 8, 10, 0.75)',
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    zIndex: 20,
  },
  exitText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  overlay: {
    position: 'absolute',
    bottom: 40,
    left: Spacing.md,
    right: Spacing.md,
    backgroundColor: 'rgba(11, 13, 18, 0.88)',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  priceText: {
    fontSize: Typography.fontSizes.xxl,
    color: Colors.textGold,
    fontWeight: '700',
  },
  titleText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: 2,
  },
  addressText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
    marginTop: 1,
  },
  specsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGlass,
  },
  specItem: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  dot: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
    marginHorizontal: Spacing.xs,
  },
});

export default PresentationModeView;
