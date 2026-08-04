/**
 * NovaEstate Mobile - App Root Index Entry Point
 * Orchestrates Splash Screen, First-time Onboarding, Auth Session Check & Route Redirection
 */

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { SplashScreenView } from '@/components/SplashScreenView';
import { useAuthStore, useOnboardingStore } from '@/store';
import { Colors } from '@/theme';

export default function RootIndex() {
  const [splashFinished, setSplashFinished] = useState(false);

  const { isAuthenticated, isLoading: isAuthLoading, initializeAuth } = useAuthStore();
  const {
    hasCompletedOnboarding,
    isCheckingOnboarding,
    checkOnboardingStatus,
  } = useOnboardingStore();

  useEffect(() => {
    // Check local storage for onboarding & auth token validity
    checkOnboardingStatus();
    initializeAuth();
  }, [checkOnboardingStatus, initializeAuth]);

  // 1. Render animated splash screen for ~1.5 seconds during cold boot
  if (!splashFinished) {
    return <SplashScreenView onAnimationFinish={() => setSplashFinished(true)} />;
  }

  // 2. Render loading indicator while checking SecureStore auth & onboarding state
  if (isCheckingOnboarding || isAuthLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // 3. First launch -> Redirect to Onboarding
  if (!hasCompletedOnboarding) {
    return <Redirect href={'/onboarding' as any} />;
  }

  // 4. Unauthenticated -> Redirect to Login
  if (!isAuthenticated) {
    return <Redirect href={'/(auth)/login' as any} />;
  }

  // 5. Authenticated -> Redirect directly to Dashboard Command Center
  return <Redirect href={'/(tabs)' as any} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
