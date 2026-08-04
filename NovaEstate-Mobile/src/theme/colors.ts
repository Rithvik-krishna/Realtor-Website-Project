/**
 * NovaEstate Mobile - Luxury Color Palette
 * Inspired by Airbnb, Tesla, Linear UI design language.
 */

export const LuxuryPalette = {
  // Obsidian Dark Core
  obsidian900: '#07080A', // Deepest background
  obsidian800: '#0B0D12', // Main Dark Background
  obsidian700: '#14171F', // Elevated Card / Surface
  obsidian600: '#1E232E', // Interactive Surface
  obsidian500: '#282E3D', // Hover / Selected Border

  // Platinum Light Core
  platinum100: '#FFFFFF', // Pure White
  platinum200: '#F8F9FA', // Main Light Background
  platinum300: '#F0F2F5', // Light Elevated Surface
  platinum400: '#E2E4E9', // Light Interactive Surface
  platinum500: '#CDD0D7', // Light Border

  // Metallic Gold Accents
  goldPrimary: '#D4AF37', // Pure Metallic Gold
  goldLight: '#F3E5AB',   // Pale Gold Highlight
  goldDark: '#997A15',    // Deep Antique Gold
  goldGlow: 'rgba(212, 175, 55, 0.25)',

  // Semantic & KPI Tones
  emeraldSuccess: '#10B981', // Commission Payout Green
  amberWarning: '#F59E0B',   // Alert Amber
  crimsonDanger: '#EF4444',  // Error Red
  techCyan: '#38BDF8',       // AI & Tech Blue

  // Glassmorphism Borders & Overlays
  borderGlassDark: 'rgba(255, 255, 255, 0.08)',
  borderGlassLight: 'rgba(0, 0, 0, 0.08)',
  borderActiveGold: 'rgba(212, 175, 55, 0.4)',
  overlayDark: 'rgba(7, 8, 10, 0.82)',
  overlayLight: 'rgba(255, 255, 255, 0.75)',
} as const;

export const DarkThemeColors = {
  background: LuxuryPalette.obsidian800,
  backgroundElevated: LuxuryPalette.obsidian700,
  card: LuxuryPalette.obsidian700,
  cardHover: LuxuryPalette.obsidian600,
  border: LuxuryPalette.borderGlassDark,
  borderGlass: LuxuryPalette.borderGlassDark,
  borderActive: LuxuryPalette.borderActiveGold,
  
  textPrimary: LuxuryPalette.platinum100,
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  textGold: '#E2C044',
  textAccent: LuxuryPalette.goldLight,

  primary: LuxuryPalette.goldPrimary,
  primaryLight: LuxuryPalette.goldLight,
  primaryDark: LuxuryPalette.goldDark,
  accent: LuxuryPalette.techCyan,

  success: LuxuryPalette.emeraldSuccess,
  warning: LuxuryPalette.amberWarning,
  danger: LuxuryPalette.crimsonDanger,
  info: LuxuryPalette.techCyan,

  overlay: LuxuryPalette.overlayDark,
  glassBackground: 'rgba(20, 23, 31, 0.85)',
} as const;

export const LightThemeColors = {
  background: LuxuryPalette.platinum200,
  backgroundElevated: LuxuryPalette.platinum100,
  card: LuxuryPalette.platinum100,
  cardHover: LuxuryPalette.platinum300,
  border: LuxuryPalette.borderGlassLight,
  borderGlass: LuxuryPalette.borderGlassLight,
  borderActive: LuxuryPalette.goldPrimary,

  textPrimary: LuxuryPalette.obsidian900,
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',
  textGold: '#997A15',
  textAccent: LuxuryPalette.goldDark,

  primary: LuxuryPalette.goldPrimary,
  primaryLight: LuxuryPalette.goldLight,
  primaryDark: LuxuryPalette.goldDark,
  accent: LuxuryPalette.techCyan,

  success: LuxuryPalette.emeraldSuccess,
  warning: LuxuryPalette.amberWarning,
  danger: LuxuryPalette.crimsonDanger,
  info: LuxuryPalette.techCyan,

  overlay: LuxuryPalette.overlayLight,
  glassBackground: 'rgba(255, 255, 255, 0.85)',
} as const;

export const Colors = DarkThemeColors;
