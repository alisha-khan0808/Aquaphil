import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';

import { Card, Muted, ScreenHeader } from '@/components/ui';
import { colors } from '@/theme';

const METHODS = [
  { icon: 'cellphone-check' as const, title: 'UPI', sub: 'Pay with any UPI app at checkout' },
  { icon: 'credit-card-outline' as const, title: 'Cards', sub: 'Visa, Mastercard, RuPay, Amex' },
  { icon: 'bank-outline' as const, title: 'Netbanking', sub: '50+ Indian banks supported' },
  { icon: 'cash' as const, title: 'Cash on Delivery / at Service', sub: 'Available on select orders' },
];

export default function PaymentMethods() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bgSoft }}>
      <ScreenHeader title="Payment Methods" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {METHODS.map((m) => (
          <Card key={m.title} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <MaterialCommunityIcons name={m.icon} size={26} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '800', color: colors.text, fontSize: 15 }}>{m.title}</Text>
              <Muted>{m.sub}</Muted>
            </View>
          </Card>
        ))}
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', padding: 8 }}>
          <MaterialCommunityIcons name="lock" size={16} color={colors.green} />
          <Muted style={{ flex: 1 }}>
            Card and bank details are handled entirely by our PCI-DSS compliant payment partner and are never stored by Aquaphil.
          </Muted>
        </View>
      </ScrollView>
    </View>
  );
}
