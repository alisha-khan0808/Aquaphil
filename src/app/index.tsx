import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { Logo, Sunburst, Waves } from '@/components/ui';
import { useScreen } from '@/hooks/useScreen';
import { useApp } from '@/store/AppContext';
import { colors } from '@/theme';

// Splash: brand moment, then routes to onboarding, login or home.
export default function Splash() {
  const { ready, onboarded, user } = useApp();
  const { width, height } = useScreen();
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5 }),
      Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [scale, opacity]);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      if (!onboarded) router.replace('/onboarding');
      else if (!user) router.replace('/login');
      else router.replace('/(tabs)');
    }, 1600);
    return () => clearTimeout(t);
  }, [ready, onboarded, user]);

  return (
    <LinearGradient colors={[colors.heroTop, colors.heroBottom]} style={styles.root}>
      <StatusBar style="light" />
      <Sunburst width={width} height={height} />
      <Animated.View style={{ alignItems: 'center', transform: [{ scale }], opacity }}>
        <View style={styles.badge}>
          <Logo size={40} light />
        </View>
        <Text style={styles.tag}>Pure water. Expert care.</Text>
      </Animated.View>
      <Waves width={width} height={140} />
      <Text style={styles.footer}>Water Care</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  badge: {
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  tag: { color: colors.white, marginTop: 16, fontSize: 16, fontWeight: '600', opacity: 0.95 },
  footer: { position: 'absolute', bottom: 40, color: colors.primaryDark, fontWeight: '700', letterSpacing: 4 },
});
