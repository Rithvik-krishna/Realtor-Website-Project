/**
 * Market Intelligence - Key Real Estate Macro Stats Grid
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors, Spacing, Typography } from '@/theme';
import { formatCurrency } from '@/utils';

export function MarketStatsGrid() {
  return (
    <View style={styles.grid}>
      <GlassCard style={styles.card}>
        <Text style={styles.label}>AVG SALE PRICE</Text>
        <Text style={styles.value}>{formatCurrency(1320000)}</Text>
        <Text style={styles.trendUp}>▲ +6.4% YoY</Text>
      </GlassCard>

      <GlassCard style={styles.card}>
        <Text style={styles.label}>DAYS ON MARKET</Text>
        <Text style={styles.value}>14 Days</Text>
        <Text style={styles.trendDown}>▼ -18% MoM</Text>
      </GlassCard>

      <GlassCard style={styles.card}>
        <Text style={styles.label}>ACTIVE LISTINGS</Text>
        <Text style={styles.value}>4,820</Text>
        <Text style={styles.trendNeutral}>Balanced Market</Text>
      </GlassCard>

      <GlassCard style={styles.card}>
        <Text style={styles.label}>BOC PRIME RATE</Text>
        <Text style={styles.value}>4.75%</Text>
        <Text style={styles.trendDown}>▼ -25 bps Cut</Text>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  card: {
    width: '48.5%',
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.textMuted,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  value: {
    fontSize: Typography.fontSizes.md + 2,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: 4,
  },
  trendUp: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.success,
    fontWeight: '700',
    marginTop: 2,
  },
  trendDown: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.primaryLight,
    fontWeight: '700',
    marginTop: 2,
  },
  trendNeutral: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});

export default MarketStatsGrid;
