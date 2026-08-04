/**
 * Realtor Profile - Performance Dashboard Metrics
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors, Spacing, Typography } from '@/theme';
import { formatCurrency } from '@/utils';

export function RealtorPerformanceCard() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>PERFORMANCE DASHBOARD</Text>

      <View style={styles.grid}>
        <GlassCard style={styles.card}>
          <Text style={styles.label}>YTD VOLUME SOLD</Text>
          <Text style={styles.value}>{formatCurrency(42500000)}</Text>
          <Text style={styles.subText}>28 Closed Deals</Text>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={styles.label}>ACTIVE LISTINGS</Text>
          <Text style={styles.value}>6 Active</Text>
          <Text style={styles.subText}>$18.4M Inventory</Text>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={styles.label}>CLIENT RATING</Text>
          <Text style={styles.value}>4.95 ⭐</Text>
          <Text style={styles.subText}>38 Verified Reviews</Text>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={styles.label}>AVG DAYS ON MARKET</Text>
          <Text style={styles.value}>11 Days</Text>
          <Text style={styles.subText}>Top 1% Speed</Text>
        </GlassCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.textMuted,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.xs + 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
  subText: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.textGold,
    marginTop: 2,
    fontWeight: '600',
  },
});

export default RealtorPerformanceCard;
