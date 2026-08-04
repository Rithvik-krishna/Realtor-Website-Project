/**
 * Market Intelligence - AI Executive Summary & Market Insights
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors, Spacing, Typography, BorderRadius } from '@/theme';

export function MarketAIHeader() {
  return (
    <Animated.View entering={FadeInDown.duration(400)} style={styles.container}>
      <GlassCard style={styles.card} variant="goldBorder">
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🤖 NOVA AI MARKET ADVISOR</Text>
          </View>
          <Text style={styles.timeText}>Updated 10 mins ago</Text>
        </View>

        <Text style={styles.aiTitle}>GTA Luxury Housing Market Showing High Velocity</Text>
        <Text style={styles.aiBody}>
          Average Days on Market for Yorkville and Forest Hill luxury condos dropped to <Text style={styles.highlight}>14 days</Text> (vs. 22 days last quarter). Bank of Canada rate cuts are fueling strong buyer interest in <Text style={styles.highlight}>$2.5M - $5M</Text> freehold properties.
        </Text>
      </GlassCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  card: {
    padding: Spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  badge: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: Spacing.xs + 2,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: Colors.borderActive,
  },
  badgeText: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.primaryLight,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  timeText: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.textMuted,
  },
  aiTitle: {
    fontSize: Typography.fontSizes.md,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
  aiBody: {
    fontSize: Typography.fontSizes.xs + 1,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: Typography.lineHeights.xs,
  },
  highlight: {
    color: Colors.textGold,
    fontWeight: '700',
  },
});

export default MarketAIHeader;
