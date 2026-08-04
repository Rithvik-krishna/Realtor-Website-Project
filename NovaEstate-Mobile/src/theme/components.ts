/**
 * NovaEstate Mobile - Component Styles & Variants
 */

import { DarkThemeColors, LightThemeColors, LuxuryPalette } from './colors';
import { BorderRadius, ComponentSizes, Spacing } from './layout';
import { Typography } from './typography';
import { Shadows } from './effects';

export const ComponentVariants = {
  // Button Styles & Variants
  button: {
    solidGold: {
      backgroundColor: LuxuryPalette.goldPrimary,
      textColor: LuxuryPalette.obsidian900,
      borderRadius: BorderRadius.sm,
      height: ComponentSizes.buttonHeight.md,
    },
    outlineGold: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: LuxuryPalette.goldPrimary,
      textColor: LuxuryPalette.goldPrimary,
      borderRadius: BorderRadius.sm,
      height: ComponentSizes.buttonHeight.md,
    },
    ghost: {
      backgroundColor: 'transparent',
      textColor: LuxuryPalette.goldLight,
      borderRadius: BorderRadius.sm,
      height: ComponentSizes.buttonHeight.md,
    },
  },

  // Input Field Styles & Variants
  input: {
    dark: {
      backgroundColor: DarkThemeColors.backgroundElevated,
      borderColor: DarkThemeColors.border,
      focusBorderColor: DarkThemeColors.borderActive,
      textColor: DarkThemeColors.textPrimary,
      placeholderColor: DarkThemeColors.textMuted,
      borderRadius: BorderRadius.sm,
      height: ComponentSizes.inputHeight.md,
      paddingHorizontal: Spacing.md,
    },
    light: {
      backgroundColor: LightThemeColors.backgroundElevated,
      borderColor: LightThemeColors.border,
      focusBorderColor: LightThemeColors.borderActive,
      textColor: LightThemeColors.textPrimary,
      placeholderColor: LightThemeColors.textMuted,
      borderRadius: BorderRadius.sm,
      height: ComponentSizes.inputHeight.md,
      paddingHorizontal: Spacing.md,
    },
  },

  // Card Styles & Variants
  card: {
    default: {
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      borderWidth: 1,
      borderColor: LuxuryPalette.borderGlassDark,
      ...Shadows.sm,
    },
    goldBorder: {
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      borderWidth: 1,
      borderColor: LuxuryPalette.borderActiveGold,
      ...Shadows.md,
    },
    elevated: {
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      backgroundColor: DarkThemeColors.cardHover,
      ...Shadows.lg,
    },
  },

  // Skeleton Loader Styles
  skeleton: {
    dark: {
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      highlightColor: 'rgba(255, 255, 255, 0.12)',
      borderRadius: BorderRadius.xs,
    },
    light: {
      backgroundColor: 'rgba(0, 0, 0, 0.06)',
      highlightColor: 'rgba(0, 0, 0, 0.12)',
      borderRadius: BorderRadius.xs,
    },
  },

  // Toast Styles
  toast: {
    success: {
      backgroundColor: LuxuryPalette.obsidian700,
      borderColor: LuxuryPalette.emeraldSuccess,
      textColor: DarkThemeColors.textPrimary,
      iconColor: LuxuryPalette.emeraldSuccess,
    },
    warning: {
      backgroundColor: LuxuryPalette.obsidian700,
      borderColor: LuxuryPalette.amberWarning,
      textColor: DarkThemeColors.textPrimary,
      iconColor: LuxuryPalette.amberWarning,
    },
    error: {
      backgroundColor: LuxuryPalette.obsidian700,
      borderColor: LuxuryPalette.crimsonDanger,
      textColor: DarkThemeColors.textPrimary,
      iconColor: LuxuryPalette.crimsonDanger,
    },
  },

  // Bottom Sheet Drawer Styles
  bottomSheet: {
    dark: {
      backgroundColor: DarkThemeColors.backgroundElevated,
      handleColor: LuxuryPalette.goldPrimary,
      borderColor: DarkThemeColors.borderActive,
      borderTopLeftRadius: BorderRadius.lg,
      borderTopRightRadius: BorderRadius.lg,
    },
  },

  // Modal Styles
  modal: {
    dark: {
      overlayColor: DarkThemeColors.overlay,
      contentBackgroundColor: DarkThemeColors.backgroundElevated,
      borderColor: DarkThemeColors.borderActive,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
    },
  },

  // Tab Styles
  tabBar: {
    dark: {
      backgroundColor: 'rgba(11, 13, 18, 0.85)', // Blur background
      activeTintColor: LuxuryPalette.goldPrimary,
      inactiveTintColor: '#6B7280',
      borderTopColor: LuxuryPalette.borderGlassDark,
      height: 64,
    },
  },
} as const;
