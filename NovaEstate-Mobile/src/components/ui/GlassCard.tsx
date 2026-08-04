/**
 * NovaEstate Mobile - GlassCard Primitive Component
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import { Colors, Shadows, BorderRadius, Spacing } from '@/theme';

export interface GlassCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'goldBorder' | 'elevated';
  onPress?: () => void;
}

export function GlassCard({ children, style, variant = 'default', onPress }: GlassCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'goldBorder':
        return styles.goldBorder;
      case 'elevated':
        return styles.elevated;
      default:
        return styles.default;
    }
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[styles.base, getVariantStyles(), style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.base, getVariantStyles(), style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.glassBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  default: {
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    ...Shadows.sm,
  },
  goldBorder: {
    borderWidth: 1,
    borderColor: Colors.borderActive,
    ...Shadows.md,
  },
  elevated: {
    backgroundColor: Colors.cardHover,
    ...Shadows.lg,
  },
});

export default GlassCard;
