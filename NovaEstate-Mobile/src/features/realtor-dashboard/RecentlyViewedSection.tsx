import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '@/theme';
import { useRecentlyViewedStore } from '@/store';
import { FastPropertyImage } from '@/components/ui/FastPropertyImage';
import { formatCurrency, triggerHaptic } from '@/utils';
import { useRouter } from 'expo-router';

export function RecentlyViewedSection() {
  const router = useRouter();
  const { recentlyViewed } = useRecentlyViewedStore();

  if (recentlyViewed.length === 0) return null;

  const handlePressProperty = (id: string) => {
    triggerHaptic.light();
    router.push(`/property/${id}` as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>👀 Recently Viewed Listings</Text>
        <Text style={styles.countBadge}>{recentlyViewed.length} properties</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {recentlyViewed.map((prop) => (
          <TouchableOpacity
            key={prop.id}
            style={styles.itemCard}
            onPress={() => handlePressProperty(prop.id)}
            activeOpacity={0.8}
          >
            <FastPropertyImage uri={prop.images?.[0] || ''} style={styles.itemImage} />
            <Text style={styles.itemPrice} numberOfLines={1}>{formatCurrency(prop.price)}</Text>
            <Text style={styles.itemMls} numberOfLines={1}>MLS® #{prop.mlsNumber}</Text>
            <Text style={styles.itemAddress} numberOfLines={1}>{prop.address}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  countBadge: {
    fontSize: Typography.fontSizes.xs - 1,
    color: Colors.textGold,
    fontWeight: '700',
  },
  scrollContent: {
    gap: Spacing.sm,
  },
  itemCard: {
    width: 140,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: BorderRadius.md,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  itemImage: {
    width: '100%',
    height: 80,
    borderRadius: BorderRadius.xs,
    marginBottom: 6,
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
  },
  itemMls: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textGold,
  },
  itemAddress: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
