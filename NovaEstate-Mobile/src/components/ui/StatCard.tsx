/**
 * NovaEstate Mobile - Reusable Realtor KPI Stat Card
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from './GlassCard';
import { Colors, Spacing, Typography } from '@/theme';

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatCard({ label, value, subValue, trend }: StatCardProps) {
  return (
    <GlassCard variant="goldBorder" style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {subValue ? (
        <Text
          style={[
            styles.subValue,
            trend === 'up' && { color: Colors.success },
            trend === 'down' && { color: Colors.danger },
          ]}
        >
          {subValue}
        </Text>
      ) : null}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
  },
  label: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeights.medium as any,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.xs,
  },
  value: {
    fontSize: Typography.fontSizes.xl,
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeights.bold as any,
  },
  subValue: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
});

export default StatCard;
