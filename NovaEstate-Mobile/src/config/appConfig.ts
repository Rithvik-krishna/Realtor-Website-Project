/**
 * NovaEstate Mobile - App Configuration Environment & Feature Flags
 */

export const AppConfig = {
  env: process.env.NODE_ENV || 'development',
  apiBaseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://172.20.231.66:5000/api/v1',
  appName: 'NovaEstate Mobile',
  version: '1.0.0',
  enableAISearch: true,
  enableValuationCalculator: true,
  enableVoiceNotes: true,
  enableHaptics: true,
  cacheTimeMs: 1000 * 60 * 15, // 15 mins
};

export default AppConfig;
