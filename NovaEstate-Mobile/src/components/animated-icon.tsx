import React from 'react';
import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

export function AnimatedSplashOverlay() {
  const [visible, setVisible] = useState(true);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});

    // Float animation
    translateY.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
        withTiming(3, { duration: 1200, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    // Fade out overlay after splash sequence
    const timer = setTimeout(() => {
      opacity.value = withTiming(
        0,
        { duration: 400, easing: Easing.out(Easing.quad) },
        (finished) => {
          if (finished) {
            runOnJS(setVisible)(false);
          }
        }
      );
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  if (!visible) return null;

  return (
    <View style={styles.splashOverlay}>
      <View style={styles.ambientGlow} />
      <Animated.View style={[styles.imageContainer, animatedStyle]}>
        <Image
          style={styles.logoImage}
          source={require('@/assets/images/logo-glow.png')}
          contentFit="contain"
        />
      </Animated.View>
    </View>
  );
}

export function AnimatedIcon() {
  const scale = useSharedValue(0.95);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 800 });
    scale.value = withTiming(1.0, { duration: 900, easing: Easing.out(Easing.back(1.2)) });

    translateY.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
        withTiming(3, { duration: 1200, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  return (
    <View style={styles.iconContainer}>
      <View style={styles.ambientGlowIcon} />
      <Animated.View style={[styles.imageContainer, animatedStyle]}>
        <Image
          style={styles.iconImage}
          source={require('@/assets/images/logo-glow.png')}
          contentFit="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  splashOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#050B1A',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    experimental_backgroundImage: 'radial-gradient(circle at 50% 45%, #0B1530 0%, #050B1A 75%, #030712 100%)',
  },
  ambientGlow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#2A1B4E',
    filter: 'blur(35px)',
    opacity: 0.4,
  },
  ambientGlowIcon: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#2A1B4E',
    filter: 'blur(25px)',
    opacity: 0.4,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 160,
    height: 160,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 220,
    height: 220,
  },
  iconImage: {
    width: 140,
    height: 140,
  },
});

