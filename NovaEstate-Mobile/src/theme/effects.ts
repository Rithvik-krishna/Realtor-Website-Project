/**
 * NovaEstate Mobile - Elevation, Shadows & Animation Presets
 */

import { LuxuryPalette } from './colors';

export const Shadows = {
  sm: {
    shadowColor: LuxuryPalette.obsidian900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: LuxuryPalette.obsidian900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: LuxuryPalette.obsidian900,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  goldGlow: {
    shadowColor: LuxuryPalette.goldPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

export const AnimationDurations = {
  instant: 100,
  fast: 200,
  normal: 350,
  slow: 500,
  carousel: 4000,
} as const;
