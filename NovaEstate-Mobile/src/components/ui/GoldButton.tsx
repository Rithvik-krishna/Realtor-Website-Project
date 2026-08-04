/**
 * NovaEstate Mobile - Reusable Luxury Gold Button
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { Colors, BorderRadius, Spacing, Typography } from '@/theme';
import { triggerHaptic } from '@/utils/haptics';

interface GoldButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'solid' | 'outline' | 'ghost';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
}

export function GoldButton({
  title,
  onPress,
  variant = 'solid',
  style,
  textStyle,
  disabled = false,
  loading = false,
}: GoldButtonProps) {
  const handlePress = () => {
    if (disabled || loading) return;
    triggerHaptic.light();
    onPress();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={disabled || loading}
      style={[
        styles.button,
        variant === 'solid' && styles.solid,
        variant === 'outline' && styles.outline,
        variant === 'ghost' && styles.ghost,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'solid' ? '#000000' : Colors.primary} size="small" />
      ) : (
        <Text
          style={[
            styles.text,
            variant === 'solid' && styles.solidText,
            variant === 'outline' && styles.outlineText,
            variant === 'ghost' && styles.ghostText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  solid: {
    backgroundColor: Colors.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.semibold as any,
  },
  solidText: {
    color: '#000000',
  },
  outlineText: {
    color: Colors.primary,
  },
  ghostText: {
    color: Colors.primaryLight,
  },
});

export default GoldButton;
