import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Href, router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Muted, ScreenHeader } from '@/components/ui';
import { colors, radius } from '@/theme';

type Item = {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  color: string;
  title: string;
  body: string;
  when: string;
  href: Href;
};

const ITEMS: Item[] = [
  {
    icon: 'account-wrench',
    color: colors.primary,
    title: 'Technician on the way',
    body: 'Ravi Kumar is heading to you for AQ-SRV-2291.',
    when: '10:30 AM',
    href: { pathname: '/track/[id]', params: { id: 'AQ-SRV-2291' } },
  },
  {
    icon: 'truck-delivery',
    color: colors.green,
    title: 'Order shipped',
    body: 'Your Filter Change Kit (AQ-ORD-10587) has been shipped.',
    when: 'Yesterday',
    href: { pathname: '/order/[id]', params: { id: 'AQ-ORD-10587' } },
  },
  {
    icon: 'shield-alert',
    color: '#B26A00',
    title: 'AMC renewal due',
    body: 'AMC for your Kent Grand expires on 2 Nov. Renew now to stay covered.',
    when: '2 days ago',
    href: '/amc',
  },
];

export default function Notifications() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bgSoft }}>
      <ScreenHeader title="Notifications" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
        {ITEMS.map((n) => (
          <Pressable
            key={n.title}
            onPress={() => router.push(n.href)}
            style={{
              flexDirection: 'row',
              gap: 12,
              padding: 14,
              backgroundColor: colors.white,
              borderRadius: radius.lg,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                backgroundColor: colors.tile,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialCommunityIcons name={n.icon} size={22} color={n.color} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontWeight: '800', color: colors.text }}>{n.title}</Text>
                <Muted style={{ fontSize: 12 }}>{n.when}</Muted>
              </View>
              <Muted style={{ marginTop: 2, lineHeight: 19 }}>{n.body}</Muted>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
