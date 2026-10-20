import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Card, PrimaryButton, ScreenHeader } from '@/components/ui';
import { useApp } from '@/store/AppContext';
import { colors, radius } from '@/theme';

export default function Addresses() {
  const { addresses, addAddress } = useApp();
  const [line, setLine] = useState('');
  const [city, setCity] = useState('');
  const [pin, setPin] = useState('');
  const valid = line.trim().length > 4 && city.trim().length > 1 && /^\d{6}$/.test(pin);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgSoft }}>
      <ScreenHeader title="Addresses" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }} keyboardShouldPersistTaps="handled">
        {addresses.map((a, i) => (
          <Card key={a} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
            <MaterialCommunityIcons name={i === 0 ? 'home' : 'map-marker'} size={22} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '800', color: colors.text }}>{i === 0 ? 'Home' : `Address ${i + 1}`}</Text>
              <Text style={{ color: colors.textMuted, marginTop: 2, lineHeight: 20 }}>{a}</Text>
            </View>
          </Card>
        ))}
        <Card style={{ gap: 8 }}>
          <Text style={{ fontWeight: '800', color: colors.text, marginBottom: 4 }}>Add new address</Text>
          <TextInput placeholder="House no., building, street" placeholderTextColor={colors.textMuted} value={line} onChangeText={setLine} style={styles.input} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TextInput placeholder="City" placeholderTextColor={colors.textMuted} value={city} onChangeText={setCity} style={[styles.input, { flex: 1 }]} />
            <TextInput
              placeholder="PIN code"
              placeholderTextColor={colors.textMuted}
              value={pin}
              onChangeText={(t) => setPin(t.replace(/\D/g, ''))}
              keyboardType="number-pad"
              maxLength={6}
              style={[styles.input, { width: 120 }]}
            />
          </View>
          <PrimaryButton
            title="Save address"
            variant="blue"
            disabled={!valid}
            onPress={() => {
              addAddress(`${line.trim()}, ${city.trim()} ${pin}`);
              setLine('');
              setCity('');
              setPin('');
            }}
          />
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    height: 46,
    fontSize: 15,
    color: colors.text,
  },
});
