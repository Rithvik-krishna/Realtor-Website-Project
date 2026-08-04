import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '@/theme';

// Keep native splash screen visible while loading resources
SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore error if already hidden or prevented */
});

interface SplashScreenViewProps {
  onAnimationFinish?: () => void;
  autoHideNativeSplash?: boolean;
}

export function SplashScreenView({
  onAnimationFinish,
  autoHideNativeSplash = true,
}: SplashScreenViewProps) {
  // Shared values for smooth 600ms fade-in animation
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.96);

  useEffect(() => {
    // Hide native splash screen smoothly when custom splash mounts
    if (autoHideNativeSplash) {
      SplashScreen.hideAsync().catch(() => {});
    }

    // Smooth 600ms fade-in and subtle scale transition
    opacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });

    scale.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });

    // Hold splash screen for clean presentation before calling finish
    const timer = setTimeout(() => {
      if (onAnimationFinish) {
        onAnimationFinish();
      }
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Centered Logo Container */}
      <Animated.View style={[styles.brandContainer, animatedLogoStyle]}>
        <Image
          source={require('@/assets/images/splash-icon.png')}
          style={styles.logoMark}
          contentFit="contain"
          transition={0}
        />
        <Text style={styles.brandTitle}>NOVAESTATE</Text>
        <Text style={styles.brandSubtitle}>LUXURY REAL ESTATE</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0B0B12', // Premium luxury dark background
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
  },
  brandContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logoMark: {
    width: 110,
    height: 110,
    marginBottom: 20,
  },
  brandTitle: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 4,
    textAlign: 'center',
  },
  brandSubtitle: {
    fontSize: 10,
    color: '#D4AF37', // Gold accent branding
    fontWeight: '700',
    letterSpacing: 3,
    marginTop: 6,
    textAlign: 'center',
  },
});

export default SplashScreenView;

