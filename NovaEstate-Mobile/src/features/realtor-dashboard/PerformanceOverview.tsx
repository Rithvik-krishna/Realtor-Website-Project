import React from 'react';
import { View, Text, StyleSheet, DimensionValue } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors, Spacing, BorderRadius } from '@/theme';
import { formatCurrency, normalizeFont } from '@/utils';

interface PerformanceProps {
  ytdVolume?: number;
  netCommission?: number;
  activeLeadsCount?: number;
  conversionRate?: number;
}

const WEEKLY_REVENUE: { day: string; height: DimensionValue }[] = [
  { day: 'M', height: '40%' },
  { day: 'T', height: '65%' },
  { day: 'W', height: '50%' },
  { day: 'T', height: '85%' },
  { day: 'F', height: '100%' },
  { day: 'S', height: '70%' },
  { day: 'S', height: '45%' },
];

export function PerformanceOverview({
  ytdVolume = 12850000,
  netCommission = 182500,
  activeLeadsCount = 14,
  conversionRate = 32.4,
}: PerformanceProps) {
  return (
    <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.container}>
      <GlassCard variant="goldBorder" style={styles.mainCard}>
        <View style={styles.headerRow}>
          <Text style={styles.subtitle} numberOfLines={1}>2026 YTD PERFORMANCE</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText} numberOfLines={1}>TOP 1% AGENT</Text>
          </View>
        </View>

        <View style={styles.volumeRow}>
          <View style={styles.volumeLeft}>
            <Text
              style={styles.volumeText}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              {formatCurrency(ytdVolume)}
            </Text>
            <Text style={styles.volumeLabel}>Total Closed & Pending Volume</Text>
          </View>

          {/* Mini Weekly Chart Bars */}
          <View style={styles.chartContainer}>
            {WEEKLY_REVENUE.map((bar, idx) => (
              <View key={idx} style={styles.barCol}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { height: bar.height },
                      idx === 4 && styles.barFillPeak,
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{bar.day}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel} numberOfLines={1}>NET COMMISSION</Text>
            <Text
              style={styles.statValue}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              {formatCurrency(netCommission)}
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statLabel} numberOfLines={1}>ACTIVE LEADS</Text>
            <Text
              style={styles.statValue}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              {activeLeadsCount} Buyers
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statLabel} numberOfLines={1}>CONVERSION</Text>
            <Text style={styles.conversionValue}>{conversionRate}%</Text>
          </View>
        </View>
      </GlassCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  mainCard: {
    width: '100%',
    padding: 16,
    borderRadius: 18,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: 8,
  },
  subtitle: {
    flexShrink: 1,
    fontSize: normalizeFont(11),
    color: Colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 1,
  },
  badge: {
    flexShrink: 0,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.borderActive,
  },
  badgeText: {
    fontSize: normalizeFont(9),
    color: Colors.primaryLight,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  volumeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 4,
  },
  volumeLeft: {
    flex: 1,
    marginRight: 12,
  },
  volumeText: {
    fontSize: normalizeFont(28),
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  volumeLabel: {
    fontSize: normalizeFont(11),
    color: Colors.textMuted,
    marginTop: 2,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 48,
    gap: 4,
  },
  barCol: {
    alignItems: 'center',
    width: 10,
  },
  barTrack: {
    height: 34,
    width: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: 'rgba(212, 175, 55, 0.5)',
    borderRadius: 3,
  },
  barFillPeak: {
    backgroundColor: Colors.primary,
  },
  barLabel: {
    fontSize: normalizeFont(8),
    color: Colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderGlass,
    marginVertical: 14,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.borderGlass,
    marginHorizontal: 8,
  },
  statLabel: {
    fontSize: normalizeFont(9),
    color: Colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  statValue: {
    fontSize: normalizeFont(13),
    color: Colors.success,
    fontWeight: '700',
    marginTop: 2,
  },
  conversionValue: {
    fontSize: normalizeFont(13),
    color: Colors.textGold,
    fontWeight: '700',
    marginTop: 2,
  },
});

export default PerformanceOverview;


