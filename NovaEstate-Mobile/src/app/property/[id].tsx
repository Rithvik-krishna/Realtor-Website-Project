/**
 * NovaEstate Mobile - Property Details Screen
 */

import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Text, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius } from '@/theme';
import { usePropertyDetailsQuery } from '@/hooks';
import { GoldButton } from '@/components/ui/GoldButton';
import { triggerHaptic } from '@/utils';

import { ImageGalleryCarousel } from '@/features/property-details/ImageGalleryCarousel';
import { PropertyOverviewSection } from '@/features/property-details/PropertyOverviewSection';
import { AmenitiesSection } from '@/features/property-details/AmenitiesSection';
import { NeighborhoodSection } from '@/features/property-details/NeighborhoodSection';
import { MortgageCalculatorSection } from '@/features/property-details/MortgageCalculatorSection';
import { AgentProfileSection } from '@/features/property-details/AgentProfileSection';

export default function PropertyDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: response, isLoading } = usePropertyDetailsQuery(id || 'prop-1');
  const property = response?.data;

  const handleBack = () => {
    triggerHaptic.light();
    router.back();
  };

  const handleShare = async () => {
    triggerHaptic.light();
    if (property) {
      await Share.share({
        message: `Check out ${property.title} in ${property.city} listed for $${property.price.toLocaleString()}: https://novaestate.ca/properties/${property.slug}`,
      });
    }
  };

  const handleScheduleVisit = () => {
    triggerHaptic.medium();
    router.push('/bottom-sheet' as any);
  };

  const handleDownloadBrochure = () => {
    triggerHaptic.light();
    alert('Feature Brochure PDF downloaded to device storage.');
  };

  if (isLoading || !property) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Luxury Property Details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* 1. Animated Image Gallery */}
        <ImageGalleryCarousel
          images={property.images}
          onBackPress={handleBack}
          onSharePress={handleShare}
        />

        {/* 2. Overview & Key Specs */}
        <PropertyOverviewSection property={property} />

        {/* 3. Official TRREB Features & Specs */}
        <AmenitiesSection property={property} />

        {/* 4. Neighborhood & Local City Schools */}
        <NeighborhoodSection city={property.city} />

        {/* 5. Mortgage Estimator */}
        <MortgageCalculatorSection propertyPrice={property.price} />

        {/* 6. Listing Brokerage & TRREB Member Profile */}
        <AgentProfileSection listOfficeName={property.listOfficeName} mlsNumber={property.mlsNumber || property.id} />
      </ScrollView>

      {/* Floating Glass Bottom Action Bar */}
      <SafeAreaView style={styles.bottomBarWrapper}>
        <View style={styles.bottomBarContainer}>
          <TouchableOpacity style={styles.brochureBtn} onPress={handleDownloadBrochure}>
            <Text style={styles.brochureIcon}>📄</Text>
          </TouchableOpacity>

          <View style={styles.scheduleBtnContainer}>
            <GoldButton title="Schedule Showing" onPress={handleScheduleVisit} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textMuted,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  bottomBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(11, 13, 18, 0.92)',
    borderTopWidth: 1,
    borderTopColor: Colors.borderGlass,
  },
  bottomBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
  },
  brochureBtn: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.xs,
    backgroundColor: Colors.cardHover,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  brochureIcon: {
    fontSize: Typography.fontSizes.lg,
  },
  scheduleBtnContainer: {
    flex: 1,
  },
});
