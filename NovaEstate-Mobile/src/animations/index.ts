/**
 * NovaEstate Mobile - Reanimated Preset Animations
 */

import { WithSpringConfig, withSpring, withTiming, WithTimingConfig } from 'react-native-reanimated';

export const SpringConfigs = {
  snappy: {
    damping: 15,
    stiffness: 150,
    mass: 0.6,
  } as WithSpringConfig,
  gentle: {
    damping: 20,
    stiffness: 90,
    mass: 1,
  } as WithSpringConfig,
};

export const TimingConfigs = {
  quick: {
    duration: 200,
  } as WithTimingConfig,
  smooth: {
    duration: 350,
  } as WithTimingConfig,
};

export const animateSpring = (value: number, config = SpringConfigs.snappy) => {
  'worklet';
  return withSpring(value, config);
};

export const animateTiming = (value: number, config = TimingConfigs.smooth) => {
  'worklet';
  return withTiming(value, config);
};
