/**
 * NovaEstate Mobile - Smart Notification Center List Screen
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors, Spacing, Typography, BorderRadius } from '@/theme';
import { NotificationCard, NotificationItem } from '@/features/notifications/NotificationCard';
import { triggerHaptic } from '@/utils';

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'PRICE_DROP',
    title: 'Price Reduced by $150,000',
    body: '188 Yorkville Ave PH1 dropped from $3,000,000 to $2,850,000. Perfect match for Alexander Wright.',
    timestamp: '10 mins ago',
    isRead: false,
    targetRoute: '/property/prop-1',
  },
  {
    id: 'notif-2',
    type: 'BUYER_INQUIRY',
    title: 'New VIP Showing Request',
    body: 'Sophia Vance requested a private showing for 45 Forest Hill Rd on Friday at 11:00 AM.',
    timestamp: '45 mins ago',
    isRead: false,
    targetRoute: '/client/lead-102',
  },
  {
    id: 'notif-3',
    type: 'OFFER_ACCEPTED',
    title: 'Offer Officially Accepted!',
    body: 'Congratulations! Offer accepted on 22 Bridle Path for $5,400,000.',
    timestamp: '2 hours ago',
    isRead: true,
    targetRoute: '/property/prop-2',
  },
  {
    id: 'notif-4',
    type: 'MORTGAGE_RATE',
    title: 'Bank of Canada Rate Cut',
    body: 'BoC announced a 25bps rate cut. Prime rate dropped to 4.75%. Update client mortgage estimators.',
    timestamp: '5 hours ago',
    isRead: true,
    targetRoute: '/market-intelligence/index',
  },
];

export default function NotificationCenterScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  const handleMarkAllRead = () => {
    triggerHaptic.light();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleSelectNotif = (notif: NotificationItem) => {
    triggerHaptic.light();
    // Mark item as read and navigate to detail or target route
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );
    router.push(`/notification/${notif.id}` as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header Title & Actions */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>SMART NOTIFICATION CENTER</Text>
          <TouchableOpacity onPress={handleMarkAllRead}>
            <Text style={styles.markReadText}>Mark All Read</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications Feed */}
        {notifications.map((item) => (
          <NotificationCard
            key={item.id}
            item={item}
            onPress={() => handleSelectNotif(item)}
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
  markReadText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.primary,
    fontWeight: '600',
  },
});
