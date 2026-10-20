import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton, Sunburst } from '@/components/ui';
import { useScreen } from '@/hooks/useScreen';
import { useApp } from '@/store/AppContext';
import { colors } from '@/theme';

const SLIDES = [
  {
    icon: 'water-pump' as const,
    title: 'RO purifiers & genuine spares',
    body: 'Shop domestic and commercial purifiers, filters and membranes — delivered and installed by Aquaphil experts.',
  },
  {
    icon: 'account-wrench' as const,
    title: 'Book service in 30 seconds',
    body: 'Installation, repair or AMC visits at a time slot that suits you. No more phone calls.',
  },
  {
    icon: 'map-marker-path' as const,
    title: 'Track every step live',
    body: 'See your technician, follow job status and chat with support — all in one app.',
  },
];

export default function Onboarding() {
  const { width, height } = useScreen();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useApp();
  const [index, setIndex] = useState(0);
  const heroH = height * 0.5;
  const illus = Math.min(220, Math.round(height * 0.28));
  const list = useRef<FlatList>(null);

  const finish = () => {
    completeOnboarding();
    router.replace('/login');
  };

  const next = () => {
    if (index < SLIDES.length - 1) {
      list.current?.scrollToOffset({ offset: (index + 1) * width, animated: true });
      setIndex(index + 1);
    }
    else finish();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="light" />
      <LinearGradient colors={[colors.heroTop, colors.heroBottom]} style={[styles.hero, { height: heroH }]}>
        <Sunburst width={width} height={heroH} />
      </LinearGradient>
      <FlatList
        ref={list}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={StyleSheet.absoluteFill}
        keyExtractor={(s) => s.title}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <View style={{ width, alignItems: 'center' }}>
            <View style={{ height: heroH, justifyContent: 'center', paddingTop: insets.top }}>
              <View style={[styles.illus, { width: illus, height: illus, borderRadius: illus / 2 }]}>
                <MaterialCommunityIcons name={item.icon} size={illus * 0.5} color={colors.primary} />
              </View>
            </View>
            <View style={{ paddingHorizontal: 28, marginTop: height < 700 ? 20 : 32 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
            </View>
          </View>
        )}
      />
      <Pressable onPress={finish} style={[styles.skip, { top: insets.top + 12 }]} hitSlop={10}>
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>
      <View style={[styles.bottom, { paddingBottom: insets.bottom + 24 }]} pointerEvents="box-none">
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
        <PrimaryButton
          title={index === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          icon="chevron-forward"
          onPress={next}
          style={{ alignSelf: 'stretch' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { borderBottomLeftRadius: 36, borderBottomRightRadius: 36, overflow: 'hidden' },
  skip: {
    position: 'absolute',
    right: 20,
    zIndex: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  skipText: { color: colors.white, fontWeight: '700' },
  illus: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#002A6B',
    shadowOpacity: 0.25,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  title: { fontSize: 26, fontWeight: '800', color: colors.text, textAlign: 'center' },
  body: { fontSize: 15, lineHeight: 22, color: colors.textMuted, textAlign: 'center', marginTop: 12 },
  bottom: { position: 'absolute', left: 24, right: 24, bottom: 0, alignItems: 'center', gap: 20 },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { width: 24, backgroundColor: colors.primary },
});
