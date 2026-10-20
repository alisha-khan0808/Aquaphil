import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { isFramed, MAX_APP_WIDTH } from '@/hooks/useScreen';
import { AppProvider } from '@/store/AppContext';
import { colors } from '@/theme';

export default function RootLayout() {
  const { width } = useWindowDimensions();
  const framed = isFramed(width);

  return (
    <AppProvider>
      <StatusBar style="dark" />
      {/* On desktop browsers, show the app in a centred phone-width column. */}
      <View style={[styles.backdrop, framed && styles.backdropFramed]}>
        <View style={[styles.app, framed && styles.appFramed]}>
          <Stack
            screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'slide_from_right' }}
          >
            <Stack.Screen name="index" options={{ animation: 'fade' }} />
            <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
            <Stack.Screen name="login" options={{ animation: 'fade' }} />
            <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
            <Stack.Screen name="order-success" options={{ gestureEnabled: false, animation: 'fade' }} />
          </Stack>
        </View>
      </View>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.bg },
  backdropFramed: { backgroundColor: '#DCE6F2', alignItems: 'center' },
  app: { flex: 1, width: '100%' },
  appFramed: {
    maxWidth: MAX_APP_WIDTH,
    overflow: 'hidden',
    backgroundColor: colors.bg,
    shadowColor: '#0B2A5B',
    shadowOpacity: 0.18,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
  },
});
