/**
 * Property Details - Overview & Core Key Specs Section
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors, Spacing, Typography, BorderRadius } from '@/theme';
import { Property } from '@/types';
import { formatCurrency } from '@/utils';

interface PropertyOverviewProps {
  property: Property;
}

export function PropertyOverviewSection({ property }: PropertyOverviewProps) {
  return (
    <View style={styles.container}>
      {/* Price & Title Block */}
      <View style={styles.headerBlock}>
        <View style={styles.priceRow}>
          <Text style={styles.priceText}>{formatCurrency(property.price)}</Text>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{property.propertyType}</Text>
          </View>
        </View>

        <Text style={styles.titleText}>{property.title}</Text>
        <Text style={styles.addressText}>
          {property.address}, {property.neighborhood}, {property.city}
        </Text>
      </View>

      {/* Key Specs Card */}
      <GlassCard style={styles.specsCard}>
        <View style={styles.specItem}>
          <Text style={styles.specValue}>{property.bedrooms}</Text>
          <Text style={styles.specLabel}>BEDROOMS</Text>
        </View>
        <View style={styles.specDivider} />
        <View style={styles.specItem}>
          <Text style={styles.specValue}>{property.bathrooms}</Text>
          <Text style={styles.specLabel}>BATHROOMS</Text>
        </View>
        <View style={styles.specDivider} />
        <View style={styles.specItem}>
          <Text style={styles.specValue}>{property.sqft}</Text>
          <Text style={styles.specLabel}>SQ FT</Text>
        </View>
        <View style={styles.specDivider} />
        <View style={styles.specItem}>
          <Text style={styles.specValue}>{property.walkScore || 94}</Text>
          <Text style={styles.specLabel}>WALKSCORE</Text>
        </View>
      </GlassCard>

      {/* Description Text */}
      <View style={styles.descriptionBlock}>
        <Text style={styles.sectionTitle}>PROPERTY DESCRIPTION</Text>
        <Text style={styles.descriptionText}>{property.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  headerBlock: {
    marginBottom: Spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  priceText: {
    fontSize: Typography.fontSizes.xxl,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  typeBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: Colors.borderActive,
  },
  typeText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.primaryLight,
    fontWeight: '700',
  },
  titleText: {
    fontSize: Typography.fontSizes.lg,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  addressText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  specsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
  },
  specItem: {
    alignItems: 'center',
    flex: 1,
  },
  specDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.borderGlass,
  },
  specValue: {
    fontSize: Typography.fontSizes.lg,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  specLabel: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  descriptionBlock: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  descriptionText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeights.md,
  },
});

export default PropertyOverviewSection;
