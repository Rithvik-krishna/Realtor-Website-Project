/**
 * NovaEstate Mobile - Spacing, Radius & Component Sizes
 */

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const BorderRadius = {
  none: 0,
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
} as const;

export const ComponentSizes = {
  buttonHeight: {
    sm: 36,
    md: 48,
    lg: 56,
  },
  inputHeight: {
    sm: 40,
    md: 50,
    lg: 58,
  },
  avatarSize: {
    sm: 32,
    md: 44,
    lg: 60,
    xl: 80,
  },
  iconSize: {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  },
} as const;
