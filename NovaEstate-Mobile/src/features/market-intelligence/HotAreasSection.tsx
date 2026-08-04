/**
 * Market Intelligence - Hot Neighborhoods & Growth Zones
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors, Spacing, Typography } from '@/theme';

interface AreaItem {
  name: string;
  avgPrice: string;
  appreciation: string;
  growthDriver: string;
}

const HOT_AREAS: AreaItem[] = [
  { name: 'Yorkville (Toronto)', avgPrice: '$3,850,000', appreciation: '+9.2% YoY', growthDriver: 'High Condominium Luxury Resale Demand' },
  { name: 'Bridle Path - Sunnybrook', avgPrice: '$8,400,000', appreciation: '+11.4% YoY', growthDriver: 'Ultra-Luxury Estate Inquiries' },
  { name: 'Forest Hill South', avgPrice: '$4,200,000', appreciation: '+8.1% YoY', growthDriver: 'Private School Catchment Area' },
  { name: 'Oakville Waterfront', avgPrice: '$3,600,000', appreciation: '+7.5% YoY', growthDriver: 'Commercial Tech Executive Relocation' },
];

export function HotAreasSection() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>HOT NEIGHBORHOODS & GROWTH ZONES</Text>

      {HOT_AREAS.map((area, idx) => (
        <GlassCard key={idx} style={styles.card}>
          <View style={styles.topRow}>
            <Text style={styles.areaName}>{area.name}</Text>
            <Text style={styles.appreciationText}>{area.appreciation}</Text>
          </View>

          <Text style={styles.priceText}>Avg Price: {area.avgPrice}</Text>
          <Text style={styles.driverText}>Key Driver: {area.growthDriver}</Text>
        </GlassCard>
      ))}
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
  card: {
    padding: Spacing.md,
    marginBottom: Spacing.xs + 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  areaName: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  appreciationText: {
    fontSize: Typography.fontSizes.xs - 1,
    color: Colors.success,
    fontWeight: '700',
  },
  priceText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textGold,
    fontWeight: '600',
    marginTop: 2,
  },
  driverText: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.textMuted,
    marginTop: 2,
  },
});

export default HotAreasSection;
