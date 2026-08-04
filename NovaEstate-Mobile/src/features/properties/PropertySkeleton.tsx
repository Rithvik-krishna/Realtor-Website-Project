/**
 * Property Listing - Native Shimmer Skeleton Loader
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Colors, Spacing, BorderRadius } from '@/theme';

const { width } = Dimensions.get('window');

interface PropertySkeletonProps {
  viewMode?: 'list' | 'grid';
}

export function PropertySkeleton({ viewMode = 'list' }: PropertySkeletonProps) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.8, { duration: 800 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const cardWidth = viewMode === 'grid' ? (width - Spacing.md * 3) / 2 : width - Spacing.md * 2;

  return (
    <View style={[styles.card, { width: cardWidth }]}>
      <Animated.View style={[styles.imageSkeleton, animatedStyle, { height: viewMode === 'grid' ? 120 : 180 }]} />
      <View style={styles.content}>
        <Animated.View style={[styles.priceSkeleton, animatedStyle]} />
        <Animated.View style={[styles.titleSkeleton, animatedStyle]} />
        <Animated.View style={[styles.locationSkeleton, animatedStyle]} />
      </View>
    </View>
  );
}

export function PropertySkeletonList({ viewMode = 'list', count = 4 }: { viewMode?: 'list' | 'grid'; count?: number }) {
  return (
    <View style={viewMode === 'grid' ? styles.gridContainer : styles.listContainer}>
      {Array.from({ length: count }).map((_, i) => (
        <PropertySkeleton key={i} viewMode={viewMode} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  imageSkeleton: {
    backgroundColor: Colors.cardHover,
    width: '100%',
  },
  content: {
    padding: Spacing.md,
  },
  priceSkeleton: {
    height: 20,
    width: '40%',
    backgroundColor: Colors.cardHover,
    borderRadius: BorderRadius.xs,
    marginBottom: Spacing.xs,
  },
  titleSkeleton: {
    height: 16,
    width: '80%',
    backgroundColor: Colors.cardHover,
    borderRadius: BorderRadius.xs,
    marginBottom: Spacing.xs,
  },
  locationSkeleton: {
    height: 14,
    width: '60%',
    backgroundColor: Colors.cardHover,
    borderRadius: BorderRadius.xs,
  },
});

export default PropertySkeleton;
