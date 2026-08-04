import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base screen width reference (e.g., standard iPhone / mid-size Android ~ 375-390px)
const BASE_WIDTH = 375;

/**
 * Scale element dimensions based on screen width
 */
export const scaleWidth = (size: number): number => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

/**
 * Scale font sizes responsively, capped to prevent extreme scaling on large/small screens
 */
export const normalizeFont = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  
  // Cap lower and upper bounds for clean readability
  const fontScale = PixelRatio.getFontScale();
  const scaledSize = Math.round(PixelRatio.roundToNearestPixel(newSize)) / fontScale;
  
  return Math.max(Math.min(scaledSize, size * 1.25), size * 0.85);
};

export const SCREEN_SIZE = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH < 360,
  isLargeDevice: SCREEN_WIDTH > 410,
};
