/**
 * NovaEstate Mobile - Smart Notification Detail Screen
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { GlassCard } from '@/components/ui/GlassCard';
import { GoldButton } from '@/components/ui/GoldButton';
import { Colors, Spacing, Typography } from '@/theme';
import { NotificationCard, NotificationItem } from '@/features/notifications/NotificationCard';
import { MOCK_NOTIFICATIONS } from './index';
import { triggerHaptic } from '@/utils';

export default function NotificationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const selectedNotif = MOCK_NOTIFICATIONS.find((n) => n.id === id) || MOCK_NOTIFICATIONS[0];

  const handleNavigateTarget = () => {
    triggerHaptic.medium();
    if (selectedNotif.targetRoute) {
      router.push(selectedNotif.targetRoute as any);
    }
  };

  const handleBackToCenter = () => {
    triggerHaptic.light();
    router.push('/notification' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header Title */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>NOTIFICATION DETAIL</Text>
          <TouchableOpacity onPress={handleBackToCenter}>
            <Text style={styles.backText}>← All Alerts</Text>
          </TouchableOpacity>
        </View>

        {/* Selected Notification Payload Card */}
        <GlassCard style={styles.payloadCard} variant="goldBorder">
          <Text style={styles.payloadTitle}>{selectedNotif.title}</Text>
          <Text style={styles.payloadTime}>{selectedNotif.timestamp}</Text>
          <Text style={styles.payloadBody}>{selectedNotif.body}</Text>

          <View style={styles.actionBtnRow}>
            <GoldButton title="View Listing / Action Target →" onPress={handleNavigateTarget} />
          </View>
        </GlassCard>

        {/* Recent Alerts Feed */}
        <Text style={styles.feedTitle}>OTHER SMART ALERTS</Text>
        {MOCK_NOTIFICATIONS.filter((n) => n.id !== selectedNotif.id).map((item) => (
          <NotificationCard
            key={item.id}
            item={item}
            onPress={() => router.push(`/notification/${item.id}` as any)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 1,
  },
  backText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.primary,
    fontWeight: '600',
  },
  payloadCard: {
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  payloadTitle: {
    fontSize: Typography.fontSizes.lg,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  payloadTime: {
    fontSize: Typography.fontSizes.xs - 1,
    color: Colors.textGold,
    marginTop: 2,
    fontWeight: '600',
  },
  payloadBody: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    lineHeight: Typography.lineHeights.sm,
  },
  actionBtnRow: {
    marginTop: Spacing.md,
  },
  feedTitle: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
});
