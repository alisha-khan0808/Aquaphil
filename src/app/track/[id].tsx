import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card, Muted, PrimaryButton, ScreenHeader, StatusBadge } from '@/components/ui';
import { formatDate, formatTime, SERVICE_STEPS, technicianById } from '@/data/mock';
import { useApp } from '@/store/AppContext';
import { colors, radius } from '@/theme';

export default function TrackService() {
  const { id, fresh } = useLocalSearchParams<{ id: string; fresh?: string }>();
  const { services, rateService } = useApp();
  const [stars, setStars] = useState(0);
  const req = services.find((s) => s.id === id);

  if (!req) {
    return (
      <View style={{ flex: 1 }}>
        <ScreenHeader title="Track Service" />
        <Muted style={{ textAlign: 'center', marginTop: 40 }}>Service request not found.</Muted>
      </View>
    );
  }

  const tech = technicianById(req.technicianId);
  const currentIndex = SERVICE_STEPS.indexOf(req.status);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgSoft }}>
      <ScreenHeader title="Track Service" onBack={fresh ? () => router.replace('/orders') : undefined} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {fresh === '1' && (
          <View style={styles.success}>
            <Ionicons name="checkmark-circle" size={22} color={colors.green} />
            <Text style={{ flex: 1, color: colors.green, fontWeight: '700' }}>
              Service booked! We'll assign a technician within 2 hours.
            </Text>
          </View>
        )}

        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.type}>{req.type}</Text>
              <Muted>{req.id}</Muted>
            </View>
            <StatusBadge status={req.status} />
          </View>
          <View style={styles.meta}>
            <Meta icon="water-pump" text={req.productName} />
            <Meta icon="calendar" text={`${formatDate(req.preferredDate)} · ${req.slot}`} />
            {!!req.description && <Meta icon="text" text={req.description} />}
          </View>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>Status</Text>
          {SERVICE_STEPS.map((step, i) => {
            const entry = req.timeline.find((t) => t.status === step);
            const done = i <= currentIndex;
            const last = i === SERVICE_STEPS.length - 1;
            return (
              <View key={step} style={{ flexDirection: 'row' }}>
                <View style={{ alignItems: 'center', width: 28 }}>
                  <View style={[styles.node, done && styles.nodeDone, i === currentIndex && styles.nodeCurrent]}>
                    {done && <Ionicons name="checkmark" size={14} color={colors.white} />}
                  </View>
                  {!last && <View style={[styles.lineV, i < currentIndex && { backgroundColor: colors.green }]} />}
                </View>
                <View style={{ flex: 1, paddingLeft: 10, paddingBottom: last ? 0 : 20 }}>
                  <Text style={[styles.step, !done && { color: colors.textMuted }]}>{step}</Text>
                  {entry ? (
                    <Muted style={{ fontSize: 12 }}>
                      {formatDate(entry.at)}, {formatTime(entry.at)}
                      {entry.note ? ` · ${entry.note}` : ''}
                    </Muted>
                  ) : (
                    <Muted style={{ fontSize: 12 }}>Pending</Muted>
                  )}
                </View>
              </View>
            );
          })}
        </Card>

        {tech ? (
          <Card>
            <Text style={styles.cardTitle}>Your technician</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={styles.techAvatar}>
                <Text style={{ color: colors.white, fontWeight: '800', fontSize: 18 }}>{tech.initials}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: colors.text }}>{tech.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                  <Ionicons name="star" size={13} color={colors.accent} />
                  <Muted>
                    {tech.rating} · {tech.jobs} jobs · Certified
                  </Muted>
                </View>
              </View>
              <Pressable onPress={() => Linking.openURL(`tel:${tech.phone}`)} style={styles.round} accessibilityLabel="Call technician">
                <Ionicons name="call" size={18} color={colors.white} />
              </Pressable>
              <Pressable onPress={() => router.push('/chat')} style={[styles.round, { backgroundColor: colors.primary }]} accessibilityLabel="Chat">
                <Ionicons name="chatbubble-ellipses" size={18} color={colors.white} />
              </Pressable>
            </View>
          </Card>
        ) : (
          <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <MaterialCommunityIcons name="account-search" size={30} color={colors.primary} />
            <Muted style={{ flex: 1, fontSize: 14 }}>Finding the nearest available technician for you…</Muted>
          </Card>
        )}

        {req.status === 'Completed' && (
          <Card>
            <Text style={styles.cardTitle}>Rate your service</Text>
            <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center', marginVertical: 8 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Pressable key={n} onPress={() => setStars(n)} hitSlop={4} accessibilityLabel={`${n} stars`}>
                  <Ionicons name={n <= stars ? 'star' : 'star-outline'} size={34} color={colors.accent} />
                </Pressable>
              ))}
            </View>
            <PrimaryButton title="Submit Feedback" disabled={stars === 0} onPress={() => rateService(req.id, stars)} />
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

function Meta({ icon, text }: { icon: React.ComponentProps<typeof MaterialCommunityIcons>['name']; text: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
      <MaterialCommunityIcons name={icon} size={16} color={colors.textMuted} style={{ marginTop: 2 }} />
      <Text style={{ flex: 1, color: colors.text, fontSize: 14, lineHeight: 20 }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  success: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: radius.md, backgroundColor: colors.greenLight },
  type: { fontSize: 20, fontWeight: '800', color: colors.text },
  meta: { gap: 8, marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.border },
  cardTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 14 },
  node: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeDone: { backgroundColor: colors.green, borderColor: colors.green },
  nodeCurrent: { shadowColor: colors.green, shadowOpacity: 0.5, shadowRadius: 6, elevation: 4 },
  lineV: { width: 2, flex: 1, backgroundColor: colors.border, marginVertical: 2 },
  step: { fontSize: 15, fontWeight: '700', color: colors.text },
  techAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#5B3CC4', alignItems: 'center', justifyContent: 'center' },
  round: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
});
