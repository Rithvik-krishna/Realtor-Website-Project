/**
 * Market Intelligence - Interactive Price Trend Visualizer
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors, Spacing, Typography, BorderRadius } from '@/theme';
import { formatCurrency, triggerHaptic } from '@/utils';

interface MonthData {
  month: string;
  price: number;
  heightPct: number;
}

const TREND_DATA: MonthData[] = [
  { month: 'Feb', price: 1220000, heightPct: 45 },
  { month: 'Mar', price: 1240000, heightPct: 55 },
  { month: 'Apr', price: 1270000, heightPct: 68 },
  { month: 'May', price: 1290000, heightPct: 78 },
  { month: 'Jun', price: 1305000, heightPct: 88 },
  { month: 'Jul', price: 1320000, heightPct: 100 },
];

export function PriceTrendChart() {
  const [selectedBar, setSelectedBar] = useState<MonthData>(TREND_DATA[5]);

  const handleBarSelect = (bar: MonthData) => {
    triggerHaptic.light();
    setSelectedBar(bar);
  };

  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.sectionTitle}>GTA AVG LUXURY SALE PRICE</Text>
          <Text style={styles.selectedPrice}>{formatCurrency(selectedBar.price)}</Text>
        </View>
        <Text style={styles.selectedMonth}>{selectedBar.month} 2026</Text>
      </View>

      {/* Bar Chart Container */}
      <View style={styles.chartArea}>
        {TREND_DATA.map((item) => {
          const isSelected = selectedBar.month === item.month;
          return (
            <TouchableOpacity
              key={item.month}
              activeOpacity={0.8}
              style={styles.barCol}
              onPress={() => handleBarSelect(item)}
            >
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { height: `${item.heightPct}%` },
                    isSelected && styles.barFillSelected,
                  ]}
                />
              </View>
              <Text style={[styles.monthLabel, isSelected && styles.monthLabelSelected]}>
                {item.month}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.textMuted,
    fontWeight: '700',
    letterSpacing: 1,
  },
  selectedPrice: {
    fontSize: Typography.fontSizes.lg,
    color: Colors.textGold,
    fontWeight: '700',
    marginTop: 2,
  },
  selectedMonth: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  chartArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: Spacing.sm,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    height: 90,
    width: 24,
    backgroundColor: Colors.cardHover,
    borderRadius: BorderRadius.xs,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: 'rgba(212, 175, 55, 0.4)',
    borderRadius: BorderRadius.xs,
  },
  barFillSelected: {
    backgroundColor: Colors.primary,
  },
  monthLabel: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    fontWeight: '600',
  },
  monthLabelSelected: {
    color: Colors.primaryLight,
    fontWeight: '700',
  },
});

export default PriceTrendChart;
