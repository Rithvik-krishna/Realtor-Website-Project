import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors, Spacing, BorderRadius } from '@/theme';
import { Property } from '@/types';
import { formatCurrency, triggerHaptic, normalizeFont } from '@/utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.72, 270);

interface NewListingsProps {
  properties: Property[];
}

export function NewListingsSection({ properties }: NewListingsProps) {
  const router = useRouter();

  const handlePress = (id: string) => {
    triggerHaptic.light();
    router.push(`/property/${id}` as any);
  };

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(400)} style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>NEW MLS LISTINGS & FEATURED</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/properties' as any)}>
          <Text style={styles.viewAllText}>All Listings →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {properties.map((property) => (
          <GlassCard key={property.id} style={styles.card} onPress={() => handlePress(property.id)}>
            <Image
              source={{ uri: property.images[0] }}
              style={styles.image}
              contentFit="cover"
              transition={300}
            />
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{property.propertyType}</Text>
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.priceText} numberOfLines={1}>{formatCurrency(property.price)}</Text>
              <Text style={styles.titleText} numberOfLines={1}>
                {property.title}
              </Text>
              <Text style={styles.locationText} numberOfLines={1}>{property.city}, ON</Text>

              <View style={styles.specsRow}>
                <Text style={styles.specItem}>{property.bedrooms} Beds</Text>
                <Text style={styles.specDot}>•</Text>
                <Text style={styles.specItem}>{property.bathrooms} Baths</Text>
                <Text style={styles.specDot}>•</Text>
                <Text style={styles.specItem}>{property.sqft} sqft</Text>
              </View>
            </View>
          </GlassCard>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: normalizeFont(11),
    color: Colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 1,
  },
  viewAllText: {
    fontSize: normalizeFont(11),
    color: Colors.primary,
    fontWeight: '600',
  },
  scrollContent: {
    paddingRight: 16,
  },
  card: {
    width: CARD_WIDTH,
    marginRight: 12,
    padding: 0,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 135,
  },
  tagBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(7, 8, 10, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  tagText: {
    fontSize: normalizeFont(9),
    color: Colors.primaryLight,
    fontWeight: '700',
  },
  cardContent: {
    padding: 12,
  },
  priceText: {
    fontSize: normalizeFont(15),
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  titleText: {
    fontSize: normalizeFont(12),
    color: Colors.textSecondary,
    marginTop: 2,
  },
  locationText: {
    fontSize: normalizeFont(10),
    color: Colors.textMuted,
    marginTop: 1,
  },
  specsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  specItem: {
    fontSize: normalizeFont(10),
    color: Colors.textSecondary,
  },
  specDot: {
    fontSize: normalizeFont(10),
    color: Colors.textMuted,
    marginHorizontal: 4,
  },
});

export default NewListingsSection;

