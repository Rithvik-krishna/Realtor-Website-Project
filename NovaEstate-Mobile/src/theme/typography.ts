/**
 * NovaEstate Mobile - Typography Token System
 */

export const Typography = {
  fontFamilies: {
    sans: 'System',
    serif: 'Georgia',
    mono: 'Courier New',
  },
  fontSizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
    display: 36,
  },
  fontWeights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    xs: 16,
    sm: 18,
    md: 22,
    lg: 26,
    xl: 30,
    xxl: 36,
    display: 44,
  },
  letterSpacings: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    uppercase: 1.2,
  },
} as const;
