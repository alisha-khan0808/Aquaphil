import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Sunburst } from '@/components/ui';
import { useScreen } from '@/hooks/useScreen';
import { useApp } from '@/store/AppContext';
import { colors, radius } from '@/theme';

type MCIName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const MENU: { icon: MCIName; label: string; href: Href }[] = [
  { icon: 'package-variant-closed', label: 'My Orders', href: { pathname: '/orders', params: { tab: 'Products' } } },
  { icon: 'history', label: 'Service History', href: { pathname: '/orders', params: { tab: 'Services' } } },
  { icon: 'shield-check-outline', label: 'AMC Plans', href: '/amc' },
  { icon: 'map-marker-outline', label: 'Addresses', href: '/addresses' },
  { icon: 'credit-card-outline', label: 'Payment Methods', href: '/payments' },
  { icon: 'lifebuoy', label: 'Help & Support', href: '/chat' },
  { icon: 'information-outline', label: 'About Us', href: '/about' },
];

export default function Profile() {
  const { width } = useScreen();
  const insets = useSafeAreaInsets();
  const { user, logout, notifications, setNotification, orders, services, amcs } = useApp();

  const doLogout = () => {
    const go = () => {
      logout();
      router.replace('/login');
    };
    if (Platform.OS === 'web') go();
    else
      Alert.alert('Log out?', 'You will need to verify your phone number again.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: go },
      ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgSoft }}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <LinearGradient colors={[colors.heroTop, colors.heroBottom]} style={[styles.hero, { paddingTop: insets.top + 20 }]}>
          <Sunburst width={width} height={260} />
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name.charAt(0).toUpperCase() ?? 'A'}</Text>
          </View>
          <Text style={styles.name}>{user?.name ?? 'Guest'}</Text>
          <Text style={styles.contact}>{user?.phone}</Text>
          {!!user?.email && <Text style={styles.contact}>{user.email}</Text>}
        </LinearGradient>

        <View style={styles.stats}>
          <Stat value={orders.length} label="Orders" />
          <View style={styles.divider} />
          <Stat value={services.length} label="Services" />
          <View style={styles.divider} />
          <Stat value={amcs.filter((a) => a.status === 'Active').length} label="Active AMC" />
        </View>

        <View style={styles.group}>
          {MENU.map((m, i) => (
            <Pressable key={m.label} onPress={() => router.push(m.href)} style={[styles.item, i > 0 && styles.itemBorder]}>
              <View style={styles.itemIcon}>
                <MaterialCommunityIcons name={m.icon} size={20} color={colors.primary} />
              </View>
              <Text style={styles.itemText}>{m.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          ))}
        </View>

        <Text style={styles.groupTitle}>Push notifications</Text>
        <View style={styles.group}>
          {(
            [
              ['orders', 'Order updates'],
              ['service', 'Service & technician updates'],
              ['amc', 'AMC & filter-change reminders'],
              ['offers', 'Offers & promotions'],
            ] as const
          ).map(([key, label], i) => (
            <View key={key} style={[styles.item, i > 0 && styles.itemBorder]}>
              <Text style={[styles.itemText, { marginLeft: 4 }]}>{label}</Text>
              <Switch
                value={notifications[key]}
                onValueChange={(v) => setNotification(key, v)}
                trackColor={{ true: colors.primary, false: colors.border }}
                thumbColor={colors.white}
              />
            </View>
          ))}
        </View>

        <Pressable onPress={doLogout} style={[styles.group, styles.item, { justifyContent: 'center' }]}>
          <Ionicons name="log-out-outline" size={20} color={colors.red} />
          <Text style={{ color: colors.red, fontWeight: '700', fontSize: 15 }}>Log Out</Text>
        </Pressable>
        <Text style={styles.version}>Aquaphil Water Care · v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text }}>{value}</Text>
      <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { height: 260, alignItems: 'center', overflow: 'hidden' },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#FFE7C2',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 34, fontWeight: '800', color: colors.primaryDark },
  name: { color: colors.white, fontSize: 22, fontWeight: '800', marginTop: 10 },
  contact: { color: 'rgba(255,255,255,0.9)', fontSize: 14, marginTop: 2 },
  stats: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: -30,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  divider: { width: 1, backgroundColor: colors.border },
  group: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  groupTitle: { marginHorizontal: 20, marginTop: 22, fontWeight: '800', color: colors.text, fontSize: 15 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 14 },
  itemBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  itemIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: colors.tile, alignItems: 'center', justifyContent: 'center' },
  itemText: { flex: 1, fontSize: 15, color: colors.text, fontWeight: '600' },
  version: { textAlign: 'center', color: colors.textMuted, fontSize: 12, marginTop: 20 },
});
