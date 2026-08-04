/**
 * NovaEstate Mobile - Unified Design System Engine
 */

import { DarkThemeColors, LightThemeColors, LuxuryPalette } from './colors';
import { Typography } from './typography';
import { Spacing, BorderRadius, ComponentSizes } from './layout';
import { Shadows, AnimationDurations } from './effects';
import { ComponentVariants } from './components';

export * from './colors';
export * from './typography';
export * from './layout';
export * from './effects';
export * from './components';

export const DarkTheme = {
  dark: true,
  colors: DarkThemeColors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  sizes: ComponentSizes,
  shadows: Shadows,
  animations: AnimationDurations,
  variants: ComponentVariants,
} as const;

export const LightTheme = {
  dark: false,
  colors: LightThemeColors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  sizes: ComponentSizes,
  shadows: Shadows,
  animations: AnimationDurations,
  variants: ComponentVariants,
} as const;

export const Theme = DarkTheme;

export default Theme;
