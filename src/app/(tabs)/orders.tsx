import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Chip, Muted, PrimaryButton, StatusBadge, TabHeader } from '@/components/ui';
import { formatDate, Order, productById, ServiceRequest } from '@/data/mock';
import { useApp } from '@/store/AppContext';
import { colors, formatINR, radius } from '@/theme';

const TABS = ['All', 'Products', 'Services'] as const;
type Tab = (typeof TABS)[number];

export default function Orders() {
  const params = useLocalSearchParams<{ tab?: string }>();
  const { orders, services } = useApp();
  const [tab, setTab] = useState<Tab>('All');

  useEffect(() => {
    if (params.tab && (TABS as readonly string[]).includes(params.tab)) setTab(params.tab as Tab);
  }, [params.tab]);

  const rows = useMemo(() => {
    const list: (Order | ServiceRequest)[] = [
      ...(tab !== 'Services' ? orders : []),
      ...(tab !== 'Products' ? services : []),
    ];
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [orders, services, tab]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgSoft }}>
      <TabHeader title="My Orders" />
      <View style={styles.tabs}>
        {TABS.map((t) => (
          <Chip key={t} label={t} active={tab === t} onPress={() => setTab(t)} />
        ))}
      </View>
      <FlatList
        data={rows}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 60, gap: 12 }}>
            <MaterialCommunityIcons name="package-variant" size={56} color={colors.border} />
            <Muted>Nothing here yet.</Muted>
            <PrimaryButton title="Start shopping" variant="blue" onPress={() => router.push('/products')} />
          </View>
        }
        renderItem={({ item }) => (item.kind === 'product' ? <OrderRow order={item} /> : <ServiceRow req={item} />)}
      />
    </View>
  );
}

function OrderRow({ order }: { order: Order }) {
  const first = productById(order.items[0]?.productId ?? '');
  const more = order.items.length - 1;
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.icon, { backgroundColor: first?.tint ?? colors.tile }]}>
          <MaterialCommunityIcons name="package-variant-closed" size={24} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>
            {first?.name ?? 'Order'}
            {more > 0 ? ` +${more} more` : ''}
          </Text>
          <Muted>
            {order.id} · {formatDate(order.createdAt)}
          </Muted>
        </View>
        <StatusBadge status={order.status} />
      </View>
      <View style={styles.footer}>
        <Text style={styles.amount}>{formatINR(order.total)}</Text>
        <Pressable onPress={() => router.push({ pathname: '/order/[id]', params: { id: order.id } })}>
          <Text style={styles.link}>View Details ›</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ServiceRow({ req }: { req: ServiceRequest }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.icon, { backgroundColor: '#FFF4E0' }]}>
          <MaterialCommunityIcons name="tools" size={22} color="#B26A00" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>
            {req.type} · {req.productName}
          </Text>
          <Muted>
            {req.id} · {formatDate(req.preferredDate)}, {req.slot}
          </Muted>
        </View>
        <StatusBadge status={req.status} />
      </View>
      <View style={styles.footer}>
        <Muted>Service request</Muted>
        <Pressable onPress={() => router.push({ pathname: '/track/[id]', params: { id: req.id } })}>
          <Text style={styles.link}>Track Service ›</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: colors.white },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 14, borderWidth: 1, borderColor: colors.border },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 46, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 2 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  amount: { fontSize: 16, fontWeight: '800', color: colors.text },
  link: { color: colors.primary, fontWeight: '700' },
});
