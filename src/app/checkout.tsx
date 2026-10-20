import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Line, Muted, PrimaryButton, ScreenHeader } from '@/components/ui';
import { useApp } from '@/store/AppContext';
import { colors, formatINR, radius } from '@/theme';

type MCIName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const PAYMENTS: { key: string; label: string; sub: string; icon: MCIName }[] = [
  { key: 'UPI', label: 'UPI', sub: 'Google Pay, PhonePe, Paytm & more', icon: 'cellphone-check' },
  { key: 'Card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay', icon: 'credit-card-outline' },
  { key: 'Netbanking', label: 'Netbanking', sub: 'All major Indian banks', icon: 'bank-outline' },
  { key: 'Cash on Delivery', label: 'Cash on Delivery', sub: 'Pay when your purifier arrives', icon: 'cash' },
];

export default function Checkout() {
  const insets = useSafeAreaInsets();
  const { ready, cart, cartTotal, addresses, addAddress, placeOrder } = useApp();
  const [address, setAddress] = useState(addresses[0] ?? '');
  const [adding, setAdding] = useState(addresses.length === 0);
  const [draft, setDraft] = useState({ line: '', city: '', pin: '' });
  const [payment, setPayment] = useState('UPI');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (ready && cart.length === 0 && !processing) router.replace('/cart');
  }, [ready, cart.length, processing]);

  const draftValid = draft.line.trim().length > 4 && draft.city.trim().length > 1 && /^\d{6}$/.test(draft.pin);

  const saveAddress = () => {
    const full = `${draft.line.trim()}, ${draft.city.trim()} ${draft.pin}`;
    addAddress(full);
    setAddress(full);
    setAdding(false);
    setDraft({ line: '', city: '', pin: '' });
  };

  const pay = () => {
    setProcessing(true);
    // Stand-in for the Razorpay/Cashfree checkout sheet.
    setTimeout(() => {
      const order = placeOrder(payment, address);
      router.replace({ pathname: '/order-success', params: { id: order.id, total: String(order.total), method: payment } });
    }, 1200);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgSoft }}>
      <ScreenHeader title="Checkout" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 140 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Delivery address</Text>
        <View style={{ gap: 8 }}>
          {addresses.map((a) => (
            <Pressable key={a} onPress={() => setAddress(a)} style={[styles.option, address === a && styles.optionActive]}>
              <MaterialCommunityIcons
                name={address === a ? 'radiobox-marked' : 'radiobox-blank'}
                size={22}
                color={address === a ? colors.primary : colors.textMuted}
              />
              <Text style={{ flex: 1, color: colors.text, fontSize: 14, lineHeight: 20 }}>{a}</Text>
            </Pressable>
          ))}
          {adding ? (
            <View style={styles.form}>
              <TextInput
                placeholder="House no., building, street"
                placeholderTextColor={colors.textMuted}
                value={draft.line}
                onChangeText={(line) => setDraft((d) => ({ ...d, line }))}
                style={styles.input}
              />
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TextInput
                  placeholder="City"
                  placeholderTextColor={colors.textMuted}
                  value={draft.city}
                  onChangeText={(city) => setDraft((d) => ({ ...d, city }))}
                  style={[styles.input, { flex: 1 }]}
                />
                <TextInput
                  placeholder="PIN code"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="number-pad"
                  maxLength={6}
                  value={draft.pin}
                  onChangeText={(pin) => setDraft((d) => ({ ...d, pin: pin.replace(/\D/g, '') }))}
                  style={[styles.input, { width: 120 }]}
                />
              </View>
              <PrimaryButton title="Save address" variant="blue" disabled={!draftValid} onPress={saveAddress} />
            </View>
          ) : (
            <Pressable onPress={() => setAdding(true)} style={styles.addRow}>
              <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
              <Text style={{ color: colors.primary, fontWeight: '700' }}>Add new address</Text>
            </Pressable>
          )}
        </View>

        <Text style={styles.label}>Payment method</Text>
        <View style={{ gap: 8 }}>
          {PAYMENTS.map((p) => (
            <Pressable key={p.key} onPress={() => setPayment(p.key)} style={[styles.option, payment === p.key && styles.optionActive]}>
              <View style={styles.payIcon}>
                <MaterialCommunityIcons name={p.icon} size={22} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '700', color: colors.text, fontSize: 15 }}>{p.label}</Text>
                <Muted style={{ fontSize: 12 }}>{p.sub}</Muted>
              </View>
              <MaterialCommunityIcons
                name={payment === p.key ? 'radiobox-marked' : 'radiobox-blank'}
                size={22}
                color={payment === p.key ? colors.primary : colors.textMuted}
              />
            </Pressable>
          ))}
        </View>

        <View style={styles.summary}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: colors.text }}>Order summary</Text>
          <Line label={`Items (${cart.reduce((s, i) => s + i.qty, 0)})`} value={formatINR(cartTotal)} />
          <Line label="Delivery & installation" value="FREE" color={colors.green} />
          <View style={{ height: 1, backgroundColor: colors.border, marginTop: 12, marginBottom: 4 }} />
          <Line label="Amount payable" value={formatINR(cartTotal)} bold />
        </View>
        <View style={styles.secure}>
          <Ionicons name="lock-closed" size={14} color={colors.green} />
          <Muted style={{ fontSize: 12 }}>Payments are processed securely by our payment partner.</Muted>
        </View>
      </ScrollView>

      <View style={[styles.bar, { paddingBottom: insets.bottom + 12 }]}>
        {processing ? (
          <View style={[styles.processing]}>
            <ActivityIndicator color={colors.white} />
            <Text style={{ color: colors.white, fontWeight: '700', fontSize: 16 }}>Processing…</Text>
          </View>
        ) : (
          <PrimaryButton
            title={payment === 'Cash on Delivery' ? `Place Order · ${formatINR(cartTotal)}` : `Pay ${formatINR(cartTotal)}`}
            disabled={!address || adding}
            onPress={pay}
            style={{ flex: 1 }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 16, fontWeight: '800', color: colors.text, marginTop: 8, marginBottom: 10 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  optionActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  form: { gap: 8, backgroundColor: colors.white, padding: 12, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    height: 46,
    fontSize: 15,
    color: colors.text,
  },
  addRow: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 12 },
  payIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.tile, alignItems: 'center', justifyContent: 'center' },
  summary: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: colors.border, marginTop: 24 },
  secure: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, justifyContent: 'center' },
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  processing: {
    flex: 1,
    height: 52,
    borderRadius: radius.sm,
    backgroundColor: colors.ink,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
});
