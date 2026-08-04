import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, BorderRadius } from '@/theme';
import { normalizeFont } from '@/utils/responsive';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export function EmptyState({
  icon = '✨',
  title,
  description,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {(primaryActionLabel || secondaryActionLabel) && (
        <View style={styles.buttonRow}>
          {primaryActionLabel && onPrimaryAction && (
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={onPrimaryAction}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryBtnText}>{primaryActionLabel}</Text>
            </TouchableOpacity>
          )}

          {secondaryActionLabel && onSecondaryAction && (
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={onSecondaryAction}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryBtnText}>{secondaryActionLabel}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 36,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 28,
  },
  title: {
    fontSize: normalizeFont(17),
    color: Colors.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  description: {
    fontSize: normalizeFont(13),
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: BorderRadius.sm,
  },
  primaryBtnText: {
    fontSize: normalizeFont(13),
    color: Colors.background,
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: Colors.cardHover,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  secondaryBtnText: {
    fontSize: normalizeFont(13),
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});

export default EmptyState;
