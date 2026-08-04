/**
 * Realtor Profile - Achievements & Subscription Tier
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors, Spacing, Typography, BorderRadius } from '@/theme';

export function AchievementsCard() {
  return (
    <View style={styles.container}>
      {/* Achievements Badges */}
      <Text style={styles.sectionTitle}>REALTOR ACHIEVEMENTS</Text>
      <GlassCard style={styles.card}>
        <View style={styles.badgeList}>
          <View style={styles.badgeItem}>
            <Text style={styles.badgeIcon}>🏆</Text>
            <Text style={styles.badgeName}>Chairman's Club</Text>
            <Text style={styles.badgeDesc}>Top 1% Nationwide</Text>
          </View>

          <View style={styles.badgeItem}>
            <Text style={styles.badgeIcon}>💎</Text>
            <Text style={styles.badgeName}>Diamond Producer</Text>
            <Text style={styles.badgeDesc}>$40M+ Volume</Text>
          </View>

          <View style={styles.badgeItem}>
            <Text style={styles.badgeIcon}>⚡</Text>
            <Text style={styles.badgeName}>Fast Closer</Text>
            <Text style={styles.badgeDesc}>Under 14 DOM Avg</Text>
          </View>
        </View>
      </GlassCard>

      {/* Subscription Tier */}
      <Text style={[styles.sectionTitle, { marginTop: Spacing.md }]}>PLATFORM SUBSCRIPTION</Text>
      <GlassCard style={styles.card} variant="goldBorder">
        <View style={styles.subRow}>
          <View>
            <Text style={styles.subTierTitle}>NOVAESTATE BLACK TIER</Text>
            <Text style={styles.subDesc}>Unlimited AI Co-Pilot, MLS Sync & Unlimited CRM Leads</Text>
          </View>
          <View style={styles.activePill}>
            <Text style={styles.activeText}>ACTIVE</Text>
          </View>
        </View>
      </GlassCard>
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
  },
  badgeList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badgeItem: {
    flex: 1,
    alignItems: 'center',
  },
  badgeIcon: {
    fontSize: Typography.fontSizes.xl,
    marginBottom: 4,
  },
  badgeName: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
  },
  badgeDesc: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  subRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subTierTitle: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textGold,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  subDesc: {
    fontSize: Typography.fontSizes.xs - 1,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  activePill: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: Spacing.xs + 2,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  activeText: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.success,
    fontWeight: '800',
  },
});

export default AchievementsCard;
