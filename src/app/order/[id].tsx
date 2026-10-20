import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card, Line, Muted, PrimaryButton, ProductArt, ScreenHeader, StatusBadge } from '@/components/ui';
import { formatDate, formatTime, OrderStatus, productById } from '@/data/mock';
import { useApp } from '@/store/AppContext';
import { colors, formatINR, radius } from '@/theme';

const STEPS: OrderStatus[] = ['Placed', 'Shipped', 'Delivered'];

export default function OrderDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders } = useApp();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <View style={{ flex: 1 }}>
        <ScreenHeader title="Order" />
        <Muted style={{ textAlign: 'center', marginTop: 40 }}>Order not found.</Muted>
      </View>
    );
  }

  const current = STEPS.indexOf(order.status);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgSoft }}>
      <ScreenHeader title="Order Details" onBack={() => (router.canGoBack() ? router.back() : router.replace('/orders'))} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={styles.id}>{order.id}</Text>
              <Muted>
                Placed {formatDate(order.createdAt)}, {formatTime(order.createdAt)}
              </Muted>
            </View>
            <StatusBadge status={order.status} />
          </View>
          <View style={styles.progress}>
            {STEPS.map((s, i) => (
              <View key={s} style={{ flex: 1, alignItems: 'center' }}>
                <View style={styles.progressRow}>
                  <View style={[styles.bar, { opacity: i === 0 ? 0 : 1 }, i <= current && styles.barDone]} />
                  <View style={[styles.node, i <= current && styles.nodeDone]}>
                    {i <= current && <Ionicons name="checkmark" size={12} color={colors.white} />}
                  </View>
                  <View style={[styles.bar, { opacity: i === STEPS.length - 1 ? 0 : 1 }, i < current && styles.barDone]} />
                </View>
                <Text style={[styles.stepText, i <= current && { color: colors.text }]}>{s}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card style={{ gap: 12 }}>
          <Text style={styles.title}>Items</Text>
          {order.items.map((it) => {
            const p = productById(it.productId);
            if (!p) return null;
            return (
              <View key={it.productId} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                <View style={{ width: 56, borderRadius: radius.sm, overflow: 'hidden' }}>
                  <ProductArt product={p} size={56} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', color: colors.text }}>{p.name}</Text>
                  <Muted>Qty {it.qty}</Muted>
                </View>
                <Text style={{ fontWeight: '800', color: colors.text }}>{formatINR(p.price * it.qty)}</Text>
              </View>
            );
          })}
        </Card>

        <Card>
          <Text style={styles.title}>Payment</Text>
          <Line label="Method" value={order.paymentMethod} />
          <Line label="Status" value={order.paymentMethod === 'Cash on Delivery' && order.status !== 'Delivered' ? 'Pay on delivery' : 'Paid'} />
          <Line label="Total" value={formatINR(order.total)} bold />
        </Card>

        <Card>
          <Text style={styles.title}>Delivery address</Text>
          <Text style={{ color: colors.text, lineHeight: 20, marginTop: 6 }}>{order.address}</Text>
        </Card>

        {order.status === 'Delivered' && (
          <PrimaryButton title="Book Installation / Service" onPress={() => router.push({ pathname: '/service', params: { type: 'Installation' } })} />
        )}
        <PrimaryButton title="Need help with this order?" variant="outline" onPress={() => router.push('/chat')} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  id: { fontSize: 17, fontWeight: '800', color: colors.text },
  title: { fontSize: 16, fontWeight: '800', color: colors.text },
  progress: { flexDirection: 'row', marginTop: 20 },
  progressRow: { flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch' },
  bar: { flex: 1, height: 3, backgroundColor: colors.border },
  barDone: { backgroundColor: colors.green },
  node: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeDone: { backgroundColor: colors.green, borderColor: colors.green },
  stepText: { fontSize: 12, color: colors.textMuted, marginTop: 6, fontWeight: '600' },
});
