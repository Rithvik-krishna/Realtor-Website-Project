/**
 * Property Listing - Platform Safe Map View (Native & Web)
 */

import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius, LuxuryPalette } from '@/theme';
import { Property } from '@/types';
import { formatCurrency, triggerHaptic } from '@/utils';

interface PropertyMapViewProps {
  properties: Property[];
}

export function PropertyMapView({ properties }: PropertyMapViewProps) {
  const router = useRouter();

  const handleMarkerPress = (id: string) => {
    triggerHaptic.light();
    router.push(`/property/${id}` as any);
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <View style={styles.webHeader}>
          <Text style={styles.webTitle}>🗺️ GTA Interactive Property Map</Text>
          <Text style={styles.webSub}>{properties.length} active listings mapped across Toronto & Oakville</Text>
        </View>

        <ScrollView contentContainerStyle={styles.webGrid} showsVerticalScrollIndicator={false}>
          {properties.map((prop) => (
            <TouchableOpacity
              key={prop.id}
              style={styles.webCard}
              onPress={() => handleMarkerPress(prop.id)}
              activeOpacity={0.8}
            >
              <View style={styles.webMarkerBadge}>
                <Text style={styles.webMarkerText}>📍 {formatCurrency(prop.price)}</Text>
              </View>
              <View style={styles.webCardInfo}>
                <Text style={styles.webPropTitle} numberOfLines={1}>{prop.title}</Text>
                <Text style={styles.webPropAddress} numberOfLines={1}>{prop.address}, {prop.city}</Text>
                <Text style={styles.webPropSpecs}>{prop.bedrooms} Bed • {prop.bathrooms} Bath • {prop.sqft} sqft</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  // Native map lazy require
  const MapView = require('react-native-maps').default;
  const { Marker, PROVIDER_DEFAULT } = require('react-native-maps');

  const initialRegion = {
    latitude: 43.6532,
    longitude: -79.3832,
    latitudeDelta: 0.12,
    longitudeDelta: 0.12,
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={initialRegion}
        userInterfaceStyle="dark"
      >
        {properties.map((property, idx) => (
          <Marker
            key={property.id}
            coordinate={{
              latitude: 43.6532 + (idx * 0.015 - 0.03),
              longitude: -79.3832 + (idx * 0.012 - 0.02),
            }}
            onPress={() => handleMarkerPress(property.id)}
          >
            <View style={styles.markerContainer}>
              <Text style={styles.markerText}>{formatCurrency(property.price)}</Text>
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    backgroundColor: LuxuryPalette.obsidian900,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: LuxuryPalette.goldPrimary,
    elevation: 4,
  },
  markerText: {
    fontSize: Typography.fontSizes.xs,
    color: LuxuryPalette.goldPrimary,
    fontWeight: '700',
  },
  /* Web Map Fallback Styles */
  webContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.md,
  },
  webHeader: {
    marginBottom: Spacing.md,
  },
  webTitle: {
    fontSize: Typography.fontSizes.lg,
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  webSub: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textGold,
    marginTop: 2,
  },
  webGrid: {
    gap: Spacing.sm,
  },
  webCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  webMarkerBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginRight: Spacing.md,
  },
  webMarkerText: {
    fontSize: Typography.fontSizes.xs + 1,
    color: Colors.textGold,
    fontWeight: '800',
  },
  webCardInfo: {
    flex: 1,
  },
  webPropTitle: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  webPropAddress: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
    marginTop: 1,
  },
  webPropSpecs: {
    fontSize: Typography.fontSizes.xs - 1,
    color: Colors.textSecondary,
    marginTop: 3,
  },
});

export default PropertyMapView;
