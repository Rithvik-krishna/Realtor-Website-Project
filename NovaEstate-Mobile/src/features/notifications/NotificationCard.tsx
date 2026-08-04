/**
 * Smart Notification Center - Item Card with Category Badges & Deep Linking
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors, Spacing, Typography, BorderRadius } from '@/theme';
import { triggerHaptic } from '@/utils';

export type NotificationType =
  | 'NEW_LISTING'
  | 'PRICE_DROP'
  | 'BUYER_INQUIRY'
  | 'CLIENT_ACTIVITY'
  | 'APPOINTMENT_REMINDER'
  | 'MARKET_UPDATE'
  | 'MORTGAGE_RATE'
  | 'OFFER_ACCEPTED';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  targetRoute: string;
}

interface NotificationCardProps {
  item: NotificationItem;
  onPress: () => void;
}

export function NotificationCard({ item, onPress }: NotificationCardProps) {
  const [isRead, setIsRead] = useState(item.isRead);

  const handlePress = () => {
    triggerHaptic.light();
    setIsRead(true);
    onPress();
  };

  const getCategoryConfig = (type: NotificationType) => {
    switch (type) {
      case 'PRICE_DROP':
        return { icon: '🏷️', color: Colors.danger, label: 'Price Drop' };
      case 'NEW_LISTING':
        return { icon: '🏡', color: Colors.primary, label: 'New Listing' };
      case 'BUYER_INQUIRY':
        return { icon: '💬', color: Colors.info, label: 'Buyer Inquiry' };
      case 'CLIENT_ACTIVITY':
        return { icon: '👁️', color: Colors.textSecondary, label: 'Client Activity' };
      case 'APPOINTMENT_REMINDER':
        return { icon: '📅', color: Colors.warning, label: 'Appointment' };
      case 'MARKET_UPDATE':
        return { icon: '📈', color: Colors.info, label: 'Market Update' };
      case 'MORTGAGE_RATE':
        return { icon: '🏦', color: Colors.textSecondary, label: 'Rate Change' };
      case 'OFFER_ACCEPTED':
        return { icon: '🎉', color: Colors.success, label: 'Offer Accepted' };
      default:
        return { icon: '🔔', color: Colors.primary, label: 'Alert' };
    }
  };

  const config = getCategoryConfig(item.type);

  return (
    <GlassCard style={[styles.card, !isRead && styles.unreadCard]} onPress={handlePress}>
      <View style={styles.cardRow}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>{config.icon}</Text>
        </View>

        <View style={styles.contentCol}>
          <View style={styles.titleRow}>
            <Text style={styles.titleText}>{item.title}</Text>
            {!isRead && <View style={styles.unreadDot} />}
          </View>

          <Text style={styles.bodyText} numberOfLines={2}>
            {item.body}
          </Text>

          <View style={styles.footerRow}>
            <View style={[styles.badge, { backgroundColor: `${config.color}20` }]}>
              <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
            </View>
            <Text style={styles.timeText}>{item.timestamp}</Text>
          </View>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  unreadCard: {
    borderColor: Colors.borderActive,
    backgroundColor: 'rgba(20, 23, 31, 0.95)',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cardHover,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  icon: {
    fontSize: Typography.fontSizes.md,
  },
  contentCol: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    fontSize: Typography.fontSizes.sm + 1,
    color: Colors.textPrimary,
    fontWeight: '700',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: Spacing.xs,
  },
  bodyText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: Typography.lineHeights.xs,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  badge: {
    paddingHorizontal: Spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  badgeText: {
    fontSize: Typography.fontSizes.xs - 2,
    fontWeight: '700',
  },
  timeText: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.textMuted,
  },
});

export default NotificationCard;
