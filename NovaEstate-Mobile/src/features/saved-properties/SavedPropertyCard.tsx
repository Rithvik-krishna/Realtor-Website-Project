/**
 * Saved Properties - Luxury Card Component with Archive & Quick Share
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { Image } from 'expo-image';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors, Spacing, Typography, BorderRadius } from '@/theme';
import { Property } from '@/types';
import { formatCurrency, triggerHaptic } from '@/utils';

interface SavedPropertyCardProps {
  property: Property;
  onPress: () => void;
  onArchiveToggle: (id: string) => void;
}

export function SavedPropertyCard({ property, onPress, onArchiveToggle }: SavedPropertyCardProps) {
  const [isArchived, setIsArchived] = useState(false);

  const handleShare = async () => {
    triggerHaptic.light();
    await Share.share({
      message: `Sharing saved luxury listing: ${property.title} in ${property.city} listed for $${property.price.toLocaleString()}: https://novaestate.ca/properties/${property.slug}`,
    });
  };

  const handleArchive = () => {
    triggerHaptic.medium();
    setIsArchived(!isArchived);
    onArchiveToggle(property.id);
  };

  return (
    <GlassCard style={styles.card} onPress={onPress}>
      <View style={styles.imageRow}>
        <Image source={{ uri: property.images[0] }} style={styles.image} contentFit="cover" transition={250} />

        <View style={styles.contentCol}>
          <View style={styles.titleRow}>
            <Text style={styles.priceText}>{formatCurrency(property.price)}</Text>
            <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
              <Text style={styles.iconText}>🔗</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.titleText} numberOfLines={1}>
            {property.title}
          </Text>
          <Text style={styles.addressText} numberOfLines={1}>
            {property.address}, {property.city}
          </Text>

          <View style={styles.specsRow}>
            <Text style={styles.specText}>
              {property.bedrooms} Bed • {property.bathrooms} Bath • {property.sqft} sqft
            </Text>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.savedDate}>Saved 2 days ago</Text>

            <TouchableOpacity style={styles.archiveBtn} onPress={handleArchive}>
              <Text style={styles.archiveText}>{isArchived ? 'Unarchive' : 'Archive'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.sm + 2,
    marginBottom: Spacing.md,
  },
  imageRow: {
    flexDirection: 'row',
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: BorderRadius.xs,
  },
  contentCol: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  iconBtn: {
    padding: 2,
  },
  iconText: {
    fontSize: Typography.fontSizes.sm,
  },
  titleText: {
    fontSize: Typography.fontSizes.xs + 1,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  addressText: {
    fontSize: Typography.fontSizes.xs - 1,
    color: Colors.textMuted,
    marginTop: 1,
  },
  specsRow: {
    marginTop: Spacing.xs,
  },
  specText: {
    fontSize: Typography.fontSizes.xs - 1,
    color: Colors.textGold,
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGlass,
  },
  savedDate: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.textMuted,
  },
  archiveBtn: {
    paddingHorizontal: Spacing.xs,
  },
  archiveText: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.primaryLight,
    fontWeight: '600',
  },
});

export default SavedPropertyCard;
