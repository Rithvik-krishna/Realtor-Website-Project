/**
 * Realtor Profile - Header Bio Card
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors, Spacing, Typography, BorderRadius } from '@/theme';

interface RealtorHeaderCardProps {
  name: string;
  title: string;
  brokerage: string;
  licenseNo: string;
  avatarUrl?: string;
}

export function RealtorHeaderCard({
  name,
  title,
  brokerage,
  licenseNo,
  avatarUrl,
}: RealtorHeaderCardProps) {
  return (
    <GlassCard style={styles.card} variant="goldBorder">
      <View style={styles.row}>
        {/* Avatar Image */}
        <View style={styles.avatarBorder}>
          <Image
            source={{
              uri:
                avatarUrl ||
                'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
            }}
            style={styles.avatar}
            contentFit="cover"
          />
        </View>

        {/* Info Column */}
        <View style={styles.infoCol}>
          <View style={styles.nameRow}>
            <Text style={styles.nameText}>{name}</Text>
            <Text style={styles.verifyBadge}>✓ VERIFIED</Text>
          </View>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.brokerageText}>{brokerage}</Text>
          <Text style={styles.licenseText}>MLS License: {licenseNo}</Text>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBorder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    padding: 2,
    borderWidth: 2,
    borderColor: Colors.borderActive,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 34,
  },
  infoCol: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameText: {
    fontSize: Typography.fontSizes.md + 2,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  verifyBadge: {
    fontSize: Typography.fontSizes.xs - 3,
    color: Colors.primaryLight,
    fontWeight: '800',
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  titleText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textGold,
    fontWeight: '600',
    marginTop: 2,
  },
  brokerageText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  licenseText: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.textMuted,
    marginTop: 2,
  },
});

export default RealtorHeaderCard;
