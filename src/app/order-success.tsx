import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Muted, PrimaryButton } from '@/components/ui';
import { colors, formatINR, radius } from '@/theme';

export default function OrderSuccess() {
  const { id, total, method } = useLocalSearchParams<{ id: string; total: string; method: string }>();
  const insets = useSafeAreaInsets();
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  }, [scale]);

  return (
    <View style={[styles.root, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }]}>
      <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
        <Animated.View style={[styles.circle, { transform: [{ scale }] }]}>
          <Ionicons name="checkmark" size={64} color={colors.white} />
        </Animated.View>
        <Text style={styles.title}>Order placed!</Text>
        <Muted style={{ fontSize: 15, textAlign: 'center' }}>
          Thank you for choosing Aquaphil. We'll call you to schedule free installation.
        </Muted>
        <View style={styles.box}>
          <Row label="Order number" value={id ?? '-'} />
          <Row label="Amount" value={formatINR(Number(total ?? 0))} />
          <Row label="Payment" value={method === 'Cash on Delivery' ? 'Cash on Delivery' : `${method} · Paid`} />
          <Row label="Estimated delivery" value="2–3 business days" />
        </View>
      </View>
      <View style={{ gap: 10 }}>
        <PrimaryButton title="View Order" onPress={() => router.replace({ pathname: '/order/[id]', params: { id: id ?? '' } })} />
        <PrimaryButton title="Continue Shopping" variant="outline" onPress={() => router.replace('/(tabs)')} />
      </View>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 }}>
      <Muted style={{ fontSize: 14 }}>{label}</Muted>
      <Text style={{ fontWeight: '700', color: colors.text }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24 },
  circle: { width: 112, height: 112, borderRadius: 56, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: '900', color: colors.text, marginTop: 24, marginBottom: 8 },
  box: {
    alignSelf: 'stretch',
    marginTop: 28,
    padding: 16,
    borderRadius: radius.lg,
    backgroundColor: colors.bgSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
