import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Chip, Muted, PrimaryButton, TabHeader } from '@/components/ui';
import { productById, ServiceType, TIME_SLOTS } from '@/data/mock';
import { useApp } from '@/store/AppContext';
import { colors, radius } from '@/theme';

const TYPES: { type: ServiceType; icon: React.ComponentProps<typeof MaterialCommunityIcons>['name']; note: string }[] = [
  { type: 'Installation', icon: 'hammer-wrench', note: 'Free with new purchase' },
  { type: 'Repair', icon: 'wrench', note: 'Visit charge ₹299, waived under AMC' },
  { type: 'AMC', icon: 'shield-check', note: 'Scheduled preventive maintenance' },
];

const MANUAL = '__manual__';
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export default function ServiceBooking() {
  const params = useLocalSearchParams<{ type?: string }>();
  const { orders, bookService } = useApp();
  const [type, setType] = useState<ServiceType>('Installation');
  const [product, setProduct] = useState<string | null>(null);
  const [manualName, setManualName] = useState('');
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [desc, setDesc] = useState('');

  useEffect(() => {
    if (params.type && TYPES.some((t) => t.type === params.type)) setType(params.type as ServiceType);
  }, [params.type]);

  // Products from purchase history (purifiers only), de-duplicated.
  const owned = useMemo(() => {
    const names = new Set<string>();
    orders.forEach((o) =>
      o.items.forEach((i) => {
        const p = productById(i.productId);
        if (p && p.category !== 'Spares') names.add(p.name);
      })
    );
    return [...names];
  }, [orders]);

  const days = useMemo(() => {
    const out: Date[] = [];
    const start = new Date();
    for (let i = 1; i <= 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      out.push(d);
    }
    return out;
  }, []);

  const productName = product === MANUAL ? manualName.trim() : product;
  const canSubmit = !!productName && !!date && !!slot && (type !== 'Repair' || desc.trim().length >= 5);

  const submit = () => {
    if (!canSubmit || !productName || !date || !slot) return;
    const req = bookService({ type, productName, preferredDate: date, slot, description: desc.trim() });
    setProduct(null);
    setManualName('');
    setDate(null);
    setSlot(null);
    setDesc('');
    router.push({ pathname: '/track/[id]', params: { id: req.id, fresh: '1' } });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bgSoft }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TabHeader title="Book a Service" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <View style={styles.types}>
          {TYPES.map((t) => {
            const active = t.type === type;
            return (
              <Pressable key={t.type} onPress={() => setType(t.type)} style={[styles.type, active && styles.typeActive]}>
                <MaterialCommunityIcons name={t.icon} size={26} color={active ? colors.white : colors.primary} />
                <Text style={[styles.typeText, active && { color: colors.white }]}>{t.type}</Text>
              </Pressable>
            );
          })}
        </View>
        <Muted style={{ marginTop: 8, textAlign: 'center' }}>{TYPES.find((t) => t.type === type)?.note}</Muted>

        <Text style={styles.label}>Select product</Text>
        <View style={{ gap: 8 }}>
          {owned.map((name) => (
            <Option key={name} label={name} sub="From your purchases" selected={product === name} onPress={() => setProduct(name)} />
          ))}
          <Option label="Other purifier" sub="Enter brand & model" selected={product === MANUAL} onPress={() => setProduct(MANUAL)} />
          {product === MANUAL && (
            <TextInput
              value={manualName}
              onChangeText={setManualName}
              placeholder="e.g. Kent Grand Plus"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
          )}
        </View>

        <Text style={styles.label}>Preferred date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
          {days.map((d) => {
            const iso = toISODate(d);
            const active = date === iso;
            return (
              <Pressable key={iso} onPress={() => setDate(iso)} style={[styles.day, active && styles.typeActive]}>
                <Text style={[styles.dayName, active && { color: colors.white }]}>{DAYS[d.getDay()]}</Text>
                <Text style={[styles.dayNum, active && { color: colors.white }]}>{d.getDate()}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={styles.label}>Time slot</Text>
        <View style={styles.slots}>
          {TIME_SLOTS.map((s) => (
            <Chip key={s} label={s} active={slot === s} onPress={() => setSlot(s)} style={{ width: '48%', alignItems: 'center' }} />
          ))}
        </View>

        <Text style={styles.label}>Describe the problem {type !== 'Repair' && <Text style={{ fontWeight: '400' }}>(optional)</Text>}</Text>
        <TextInput
          value={desc}
          onChangeText={setDesc}
          placeholder="e.g. Water tastes salty, slow flow, leakage…"
          placeholderTextColor={colors.textMuted}
          multiline
          style={[styles.input, { height: 100, textAlignVertical: 'top', paddingTop: 12 }]}
        />

        <PrimaryButton title="Confirm Booking" disabled={!canSubmit} onPress={submit} style={{ marginTop: 24 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Option({ label, sub, selected, onPress }: { label: string; sub: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.option, selected && { borderColor: colors.primary, backgroundColor: colors.primaryLight }]}>
      <MaterialCommunityIcons name={selected ? 'radiobox-marked' : 'radiobox-blank'} size={22} color={selected ? colors.primary : colors.textMuted} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>{label}</Text>
        <Muted style={{ fontSize: 12 }}>{sub}</Muted>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  types: { flexDirection: 'row', gap: 10 },
  type: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  typeText: { fontWeight: '700', color: colors.text },
  label: { fontSize: 15, fontWeight: '800', color: colors.text, marginTop: 22, marginBottom: 10 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    height: 50,
    fontSize: 15,
    color: colors.text,
  },
  day: {
    width: 58,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayName: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  dayNum: { fontSize: 20, fontWeight: '800', color: colors.text, marginTop: 2 },
  slots: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 },
});
