import { Platform, useWindowDimensions } from 'react-native';

// On wide web screens the app renders inside a phone-sized frame (see app/_layout.tsx),
// so layout math must use the frame width rather than the browser width.
export const MAX_APP_WIDTH = 440;

export function isFramed(windowWidth: number) {
  return Platform.OS === 'web' && windowWidth > MAX_APP_WIDTH;
}

export function useScreen() {
  const { width, height } = useWindowDimensions();
  const framed = isFramed(width);
  const w = framed ? MAX_APP_WIDTH : width;
  return { width: w, height, framed, compact: w < 380 };
}
