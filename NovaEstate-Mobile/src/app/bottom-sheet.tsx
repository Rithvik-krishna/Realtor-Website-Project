/**
 * NovaEstate Mobile - Reusable Glass Bottom Sheet Modal Route
 * Powered strictly by Live Authenticated TRREB MLS Data
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography } from '@/theme';
import { usePropertiesQuery } from '@/hooks/usePropertyQueries';
import { triggerHaptic } from '@/utils';

import { ClientSharingSheet } from '@/features/sharing/ClientSharingSheet';
import { PresentationModeView } from '@/features/sharing/PresentationModeView';

export default function BottomSheetModalScreen() {
  const router = useRouter();
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  const { data: propertiesResponse, isLoading } = usePropertiesQuery({ limit: 1 });
  const realProperty = propertiesResponse?.data?.[0];

  const handleClose = () => {
    triggerHaptic.light();
    router.back();
  };

  if (isLoading || !realProperty) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loaderText}>Loading Live TRREB Property Details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isPresentationMode) {
    return (
      <PresentationModeView
        property={realProperty}
        onExit={() => setIsPresentationMode(false)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.sheetHeader}>
        <View style={styles.dragIndicator} />
        <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Client Sharing Workflows */}
        <ClientSharingSheet
          property={realProperty}
          onOpenPresentationMode={() => setIsPresentationMode(true)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundElevated,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loaderText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSizes.sm,
  },
  sheetHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGlass,
  },
  dragIndicator: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.borderGlass,
  },
  closeBtn: {
    position: 'absolute',
    right: Spacing.md,
    top: Spacing.xs,
    padding: Spacing.xs,
  },
  closeText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.textMuted,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
});
