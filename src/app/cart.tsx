import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Line, Muted, PrimaryButton, ProductArt, ScreenHeader } from '@/components/ui';
import { productById } from '@/data/mock';
import { useApp } from '@/store/AppContext';
import { colors, formatINR, radius } from '@/theme';

export default function Cart() {
  const insets = useSafeAreaInsets();
  const { cart, cartTotal, setQty, removeFromCart } = useApp();
  const mrpTotal = cart.reduce((s, i) => s + (productById(i.productId)?.mrp ?? 0) * i.qty, 0);

  if (cart.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScreenHeader title="My Cart" />
        <View style={styles.empty}>
          <MaterialCommunityIcons name="cart-outline" size={72} color={colors.border} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Muted>Add a purifier or spare part to get started.</Muted>
          <PrimaryButton title="Browse products" variant="blue" onPress={() => router.replace('/products')} style={{ marginTop: 12 }} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgSoft }}>
      <ScreenHeader title={`My Cart (${cart.length})`} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 140 }}>
        {cart.map((item) => {
          const p = productById(item.productId);
          if (!p) return null;
          return (
            <View key={p.id} style={styles.row}>
              <View style={{ width: 84, borderRadius: radius.md, overflow: 'hidden' }}>
                <ProductArt product={p} size={84} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.name} numberOfLines={2}>
                  {p.name}
                </Text>
                <Muted style={{ fontSize: 12 }}>{p.spec}</Muted>
                <Text style={styles.price}>{formatINR(p.price * item.qty)}</Text>
                <View style={styles.actions}>
                  <View style={styles.stepper}>
                    <Pressable onPress={() => setQty(p.id, item.qty - 1)} style={styles.stepBtn} accessibilityLabel="Decrease">
                      <Ionicons name="remove" size={16} color={colors.primary} />
                    </Pressable>
                    <Text style={styles.qty}>{item.qty}</Text>
                    <Pressable onPress={() => setQty(p.id, Math.min(10, item.qty + 1))} style={styles.stepBtn} accessibilityLabel="Increase">
                      <Ionicons name="add" size={16} color={colors.primary} />
                    </Pressable>
                  </View>
                  <Pressable onPress={() => removeFromCart(p.id)} hitSlop={8} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Ionicons name="trash-outline" size={16} color={colors.red} />
                    <Text style={{ color: colors.red, fontWeight: '600' }}>Remove</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        })}

        <View style={styles.summary}>
          <Text style={styles.sumTitle}>Price details</Text>
          <Line label="Total MRP" value={formatINR(mrpTotal)} />
          <Line label="Discount" value={'− ' + formatINR(mrpTotal - cartTotal)} color={colors.green} />
          <Line label="Delivery & installation" value="FREE" color={colors.green} />
          <View style={styles.sep} />
          <Line label="Total amount" value={formatINR(cartTotal)} bold />
        </View>
      </ScrollView>

      <View style={[styles.bar, { paddingBottom: insets.bottom + 12 }]}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: '900', color: colors.text }}>{formatINR(cartTotal)}</Text>
          <Text style={{ color: colors.green, fontWeight: '700', fontSize: 12 }}>You save {formatINR(mrpTotal - cartTotal)}</Text>
        </View>
        <PrimaryButton title="Checkout" icon="chevron-forward" onPress={() => router.push('/checkout')} style={{ flex: 1.2 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 24 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: colors.text, marginTop: 8 },
  row: { flexDirection: 'row', backgroundColor: colors.white, borderRadius: radius.lg, padding: 12, borderWidth: 1, borderColor: colors.border },
  name: { fontSize: 15, fontWeight: '700', color: colors.text },
  price: { fontSize: 16, fontWeight: '800', color: colors.text, marginTop: 6 },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  stepper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.2, borderColor: colors.border, borderRadius: radius.sm },
  stepBtn: { width: 34, height: 32, alignItems: 'center', justifyContent: 'center' },
  qty: { minWidth: 26, textAlign: 'center', fontWeight: '800', color: colors.text },
  summary: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: colors.border },
  sumTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  sep: { height: 1, backgroundColor: colors.border, marginTop: 12, marginBottom: 4 },
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
