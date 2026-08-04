/**
 * NovaEstate Mobile - Reusable Status Badge Component
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Spacing, Typography } from '@/theme';

interface BadgeProps {
  label: string;
  variant?: 'gold' | 'success' | 'warning' | 'info' | 'muted';
  style?: ViewStyle;
}

export function Badge({ label, variant = 'gold', style }: BadgeProps) {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'success':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: Colors.success, border: 'rgba(16, 185, 129, 0.3)' };
      case 'warning':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: Colors.warning, border: 'rgba(245, 158, 11, 0.3)' };
      case 'info':
        return { bg: 'rgba(56, 189, 248, 0.15)', text: Colors.accent, border: 'rgba(56, 189, 248, 0.3)' };
      case 'muted':
        return { bg: 'rgba(255, 255, 255, 0.08)', text: Colors.textSecondary, border: Colors.borderGlass };
      default:
        return { bg: 'rgba(212, 175, 55, 0.15)', text: Colors.primaryLight, border: Colors.borderActive };
    }
  };

  const currentTheme = getBadgeStyle();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: currentTheme.bg, borderColor: currentTheme.border },
        style,
      ]}
    >
      <Text style={[styles.text, { color: currentTheme.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs - 1,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.semibold as any,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

export default Badge;
