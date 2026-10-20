import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Alert, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card, Muted, PrimaryButton, ScreenHeader, StatusBadge } from '@/components/ui';
import { AMC, formatDate } from '@/data/mock';
import { useApp } from '@/store/AppContext';
import { colors, formatINR, radius } from '@/theme';

const BENEFITS = [
  '2 preventive maintenance visits a year',
  'Free filter & membrane replacement*',
  'Unlimited breakdown visits',
  'Priority technician within 24 hours',
];

const daysUntil = (iso: string) => Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);

export default function AMCPlans() {
  const { amcs, renewAMC } = useApp();

  const renew = (a: AMC) => {
    const go = () => renewAMC(a.id);
    if (Platform.OS === 'web') go();
    else
      Alert.alert('Renew AMC', `Renew ${a.productName} for 1 year at ${formatINR(a.price)}?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Renew', onPress: go },
      ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgSoft }}>
      <ScreenHeader title="AMC Plans" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        <LinearGradient colors={[colors.green, '#25C17A']} style={styles.banner}>
          <MaterialCommunityIcons name="shield-check" size={40} color={colors.white} />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Aquaphil Care AMC</Text>
            <Text style={styles.bannerText}>Worry-free pure water from ₹208/month</Text>
          </View>
        </LinearGradient>

        <Card style={{ gap: 10 }}>
          {BENEFITS.map((b) => (
            <View key={b} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <MaterialCommunityIcons name="check-circle" size={18} color={colors.green} />
              <Text style={{ color: colors.text, fontSize: 14 }}>{b}</Text>
            </View>
          ))}
        </Card>

        <Text style={styles.section}>Your AMCs</Text>
        {amcs.map((a) => {
          const days = daysUntil(a.renewalDueDate);
          return (
            <Card key={a.id}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{a.productName}</Text>
                  <Muted>{a.id}</Muted>
                </View>
                <StatusBadge status={a.status} />
              </View>
              <View style={styles.grid}>
                <Info label="Start date" value={formatDate(a.startDate)} />
                <Info label="Renewal due" value={formatDate(a.renewalDueDate)} />
                <Info label="Plan" value={a.isFreeYear ? 'Free 1st year' : 'Paid'} />
                <Info label="Renewal price" value={formatINR(a.price)} />
              </View>
              {a.status !== 'Active' ? (
                <>
                  <View style={styles.warn}>
                    <MaterialCommunityIcons name="bell-ring" size={16} color="#B26A00" />
                    <Text style={{ color: '#B26A00', fontWeight: '600', flex: 1 }}>
                      {days > 0 ? `Expires in ${days} days — renew to stay covered` : 'Expired — renew to restore coverage'}
                    </Text>
                  </View>
                  <PrimaryButton title={`Renew for ${formatINR(a.price)}`} onPress={() => renew(a)} style={{ marginTop: 12 }} />
                </>
              ) : (
                <PrimaryButton
                  title="Book AMC visit"
                  variant="outline"
                  onPress={() => router.push({ pathname: '/service', params: { type: 'AMC' } })}
                  style={{ marginTop: 14 }}
                />
              )}
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ width: '50%', marginTop: 12 }}>
      <Muted style={{ fontSize: 12 }}>{label}</Muted>
      <Text style={{ fontWeight: '700', color: colors.text, marginTop: 2 }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, borderRadius: radius.lg },
  bannerTitle: { color: colors.white, fontSize: 18, fontWeight: '800' },
  bannerText: { color: 'rgba(255,255,255,0.95)', marginTop: 2 },
  section: { fontSize: 17, fontWeight: '800', color: colors.text, marginTop: 6 },
  name: { fontSize: 16, fontWeight: '800', color: colors.text },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 2 },
  warn: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 14, padding: 10, borderRadius: radius.sm, backgroundColor: '#FFF4E0' },
});
