import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';

import { Card, Logo, Muted, ScreenHeader } from '@/components/ui';
import { colors } from '@/theme';

const FAQ = [
  ['How often should I change filters?', 'Sediment and carbon filters every 6 months; RO membrane every 12–18 months depending on water TDS.'],
  ['Is installation free?', 'Yes — installation is free on every new Aquaphil purifier, along with the first year of AMC.'],
  ['How fast will a technician arrive?', 'Most service requests are assigned within 2 hours and attended within 24 hours.'],
];

export default function About() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bgSoft }}>
      <ScreenHeader title="About Us" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        <Card style={{ alignItems: 'center', gap: 10, paddingVertical: 24 }}>
          <Logo size={34} />
          <Muted style={{ textAlign: 'center', fontSize: 14, lineHeight: 21 }}>
            Aquaphil Water Care sells, installs and services RO water purifiers, genuine spare parts and AMC plans — so every home and
            business gets safe, great-tasting water.
          </Muted>
        </Card>
        <Text style={{ fontSize: 17, fontWeight: '800', color: colors.text }}>FAQs</Text>
        {FAQ.map(([q, a]) => (
          <Card key={q}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <MaterialCommunityIcons name="help-circle" size={18} color={colors.primary} />
              <Text style={{ fontWeight: '800', color: colors.text, flex: 1 }}>{q}</Text>
            </View>
            <Muted style={{ marginTop: 6, fontSize: 14, lineHeight: 20 }}>{a}</Muted>
          </Card>
        ))}
        <Muted style={{ textAlign: 'center' }}>Version 1.0.0</Muted>
      </ScrollView>
    </View>
  );
}
