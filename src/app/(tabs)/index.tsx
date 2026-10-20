import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton, ProductCard, SectionTitle, Sunburst, Tile, Waves } from '@/components/ui';
import { useScreen } from '@/hooks/useScreen';
import { products } from '@/data/mock';
import { useApp } from '@/store/AppContext';
import { colors, radius } from '@/theme';

const PROMOS = [
  {
    eyebrow: 'AMC Plans',
    line1: 'Cover from ₹208/month',
    line2: '1st year FREE',
    line2Suffix: ' with purchase*',
    icon: 'shield-check' as const,
    color: colors.green,
    bg: colors.greenLight,
    onPress: () => router.push('/amc'),
  },
  {
    eyebrow: 'Doorstep Service',
    line1: 'Repair, install, filters',
    line2: 'Technician in 24 hrs',
    line2Suffix: '*',
    icon: 'account-wrench' as const,
    color: colors.primary,
    bg: colors.primaryLight,
    onPress: () => router.push({ pathname: '/service', params: { type: 'Repair' } }),
  },
];

export default function Home() {
  const { width, compact } = useScreen();
  const insets = useSafeAreaInsets();
  const { user, cartCount, addToCart } = useApp();
  const [query, setQuery] = useState('');
  const firstName = user?.name.split(' ')[0] ?? 'there';
  const heroHeight = 600 + insets.top;
  const popular = products.filter((p) => p.category !== 'Spares').slice(0, 5);

  const search = () => router.push({ pathname: '/products', params: { q: query } });

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* ---------- Hero ---------- */}
        <LinearGradient colors={[colors.heroTop, colors.heroBottom]} style={[styles.hero, { height: heroHeight, paddingTop: insets.top + 10 }]}>
          <Sunburst width={width} height={heroHeight} />

          <View style={styles.topRow}>
            <Pressable onPress={() => router.push('/profile')} style={styles.avatarRing}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{firstName.charAt(0).toUpperCase()}</Text>
              </View>
            </Pressable>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.hello} numberOfLines={1}>
                {user?.name ?? 'Welcome'}
              </Text>
              <Text style={styles.helloSub} numberOfLines={1}>
                How have you been?
              </Text>
            </View>
            <Pressable onPress={() => router.push('/notifications')} hitSlop={8} style={{ marginHorizontal: 10 }} accessibilityLabel="Notifications">
              <Ionicons name="notifications" size={24} color={colors.white} />
              <View style={styles.bellDot} />
            </Pressable>
            <Pressable onPress={() => router.push('/chat')} style={styles.helpPill}>
              <MaterialCommunityIcons name="lifebuoy" size={18} color={colors.ink} />
              <Text style={styles.helpText}>{compact ? 'Help' : 'Help Center'}</Text>
            </Pressable>
          </View>

          <View style={{ alignItems: 'center', marginTop: 22 }}>
            <View style={styles.guaranteePill}>
              <Text style={styles.guaranteeText}>Free Installation*</Text>
            </View>
            <Text style={styles.headline}>PURE WATER</Text>
            <Text style={styles.subline}>RO Purifiers Starting at ₹7,999*</Text>
          </View>

          {/* Offer ticket tucked into a pocket, like the reference */}
          <View style={styles.pocketWrap}>
            <View style={styles.ticketBack}>
              <Text style={styles.ticketBackText}>+ Free TDS check</Text>
            </View>
            <View style={styles.pocket}>
              <View style={styles.ticket}>
                <View style={styles.ticketInner}>
                  <View style={styles.percent}>
                    <MaterialCommunityIcons name="percent" size={18} color={colors.accent} />
                  </View>
                  <Text style={styles.ticketText}>
                    Up to 30% Off{'\n'}+ Free 1st-year AMC
                  </Text>
                </View>
                <View style={[styles.notch, { left: -9 }]} />
                <View style={[styles.notch, { right: -9 }]} />
              </View>
              <View style={styles.pocketStripe} />
              <View style={[styles.pocketStripe, { top: 118, opacity: 0.5 }]} />
            </View>
          </View>

          <PrimaryButton title="Shop purifiers" icon="chevron-forward" onPress={() => router.push('/products')} style={styles.cta} />
          <Text style={styles.tnc}>*T&C apply · Offer valid on select domestic models</Text>
          <Waves width={width} height={80} />
        </LinearGradient>

        {/* ---------- Search ---------- */}
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={search}
            placeholder="Search purifiers, filters, services…"
            placeholderTextColor={colors.textMuted}
            returnKeyType="search"
            style={styles.searchInput}
          />
          <Pressable onPress={() => router.push('/cart')} hitSlop={8} accessibilityLabel="Cart">
            <Ionicons name="cart-outline" size={24} color={colors.text} />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* ---------- Promo cards ---------- */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={width * 0.86 + 14}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: 20, gap: 14, paddingVertical: 6 }}
        >
          {PROMOS.map((p) => (
            <Pressable key={p.eyebrow} onPress={p.onPress} style={[styles.promo, { width: width * 0.86, borderColor: p.color }]}>
              <View style={[styles.promoIcon, { borderColor: p.color, backgroundColor: p.bg }]}>
                <MaterialCommunityIcons name={p.icon} size={26} color={p.color} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.promoEyebrow, { color: p.color }]}>{p.eyebrow}</Text>
                <Text style={styles.promoLine} numberOfLines={1}>
                  {p.line1}
                </Text>
                <Text style={styles.promoLine} numberOfLines={1}>
                  <Text style={{ fontWeight: '800' }}>{p.line2}</Text>
                  {p.line2Suffix}
                </Text>
              </View>
              <View style={[styles.promoArrow, { backgroundColor: p.color }]}>
                <Ionicons name="arrow-forward" size={18} color={colors.white} />
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* ---------- Quick actions grid ---------- */}
        <View style={styles.grid}>
          <Tile icon="water-pump" label={'Buy\nPurifier'} onPress={() => router.push({ pathname: '/products', params: { category: 'Domestic' } })} />
          <Tile icon="tools" label={'Book\nService'} accent={colors.accent} onPress={() => router.push('/service')} />
          <Tile icon="shield-refresh" label={'AMC\nRenewal'} color={colors.green} accent={colors.green} onPress={() => router.push('/amc')} />
          <Tile icon="headset" label="Support" color="#5B3CC4" accent="#5B3CC4" onPress={() => router.push('/chat')} />
          <Tile icon="office-building" label={'Commercial\nRO'} onPress={() => router.push({ pathname: '/products', params: { category: 'Commercial' } })} />
          <Tile icon="filter" label={'Spare\nParts'} accent={colors.accent} onPress={() => router.push({ pathname: '/products', params: { category: 'Spares' } })} />
          <Tile icon="wrench" label={'Repair &\nInstall'} color="#E5484D" accent="#E5484D" onPress={() => router.push({ pathname: '/service', params: { type: 'Installation' } })} />
          <Tile icon="map-marker-path" label={'Track\nService'} color={colors.green} accent={colors.green} onPress={() => router.push({ pathname: '/orders', params: { tab: 'Services' } })} />
        </View>

        {/* ---------- Popular products ---------- */}
        <View style={{ paddingHorizontal: 20 }}>
          <SectionTitle title="Popular purifiers" action="View All" onAction={() => router.push('/products')} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 14, paddingBottom: 8 }}>
          {popular.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              width={168}
              onPress={() => router.push({ pathname: '/products/[id]', params: { id: p.id } })}
              onAdd={() => addToCart(p.id)}
            />
          ))}
        </ScrollView>

        {/* ---------- Why Aquaphil ---------- */}
        <View style={styles.why}>
          {[
            { icon: 'certificate' as const, label: 'Genuine\nparts' },
            { icon: 'clock-fast' as const, label: '24-hr\nservice' },
            { icon: 'account-hard-hat' as const, label: 'Certified\ntechnicians' },
            { icon: 'cash-check' as const, label: 'Transparent\npricing' },
          ].map((w) => (
            <View key={w.label} style={{ alignItems: 'center', flex: 1 }}>
              <MaterialCommunityIcons name={w.icon} size={26} color={colors.primary} />
              <Text style={styles.whyText}>{w.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { overflow: 'hidden', paddingHorizontal: 20 },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  avatarRing: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: 'rgba(255,255,255,0.7)', padding: 3 },
  avatar: { flex: 1, borderRadius: 30, backgroundColor: '#FFE7C2', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20, fontWeight: '800', color: colors.primaryDark },
  hello: { color: colors.white, fontSize: 18, fontWeight: '700' },
  helloSub: { color: 'rgba(255,255,255,0.92)', fontSize: 13, marginTop: 2 },
  bellDot: { position: 'absolute', top: 1, right: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent },
  helpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: radius.pill,
  },
  helpText: { fontWeight: '700', fontSize: 14, color: colors.ink },
  guaranteePill: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  guaranteeText: { color: colors.white, fontWeight: '700', fontSize: 15 },
  headline: {
    fontSize: 46,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 8,
    letterSpacing: 1,
    textShadowColor: '#003A99',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 0,
  },
  subline: { color: colors.white, fontSize: 18, fontWeight: '700', marginTop: 2 },
  pocketWrap: { alignItems: 'center', marginTop: 26, height: 200 },
  ticketBack: {
    position: 'absolute',
    top: 0,
    width: 230,
    height: 60,
    backgroundColor: '#FFF7E6',
    borderRadius: 6,
    alignItems: 'center',
    paddingTop: 6,
    transform: [{ rotate: '-2deg' }],
  },
  ticketBackText: { fontSize: 11, color: '#6B5A3A', fontWeight: '600' },
  pocket: {
    position: 'absolute',
    top: 24,
    width: 300,
    height: 170,
    borderRadius: 22,
    backgroundColor: '#0B4FC4',
    alignItems: 'center',
    overflow: 'hidden',
  },
  ticket: {
    marginTop: 14,
    width: 262,
    height: 92,
    backgroundColor: '#FFF7E6',
    borderRadius: 10,
    padding: 7,
    borderWidth: 3,
    borderColor: colors.accent,
  },
  ticketInner: {
    flex: 1,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#E0A13A',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 12,
  },
  percent: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketText: { fontSize: 17, fontWeight: '800', color: colors.ink, lineHeight: 22, flex: 1 },
  notch: { position: 'absolute', top: 34, width: 16, height: 16, borderRadius: 8, backgroundColor: '#0B4FC4' },
  pocketStripe: {
    position: 'absolute',
    top: 128,
    left: -20,
    right: -20,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 2,
  },
  cta: { marginTop: 8, marginHorizontal: 32, zIndex: 3 },
  tnc: { color: 'rgba(255,255,255,0.85)', fontSize: 10, textAlign: 'center', marginTop: 10, zIndex: 3 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 18,
    marginBottom: 18,
    paddingHorizontal: 14,
    height: 50,
    borderRadius: radius.md,
    backgroundColor: colors.bgSoft,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 15, color: colors.text, height: 50 },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: { color: colors.white, fontSize: 11, fontWeight: '800' },
  promo: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderBottomWidth: 5,
    borderRadius: radius.xl,
    padding: 14,
    backgroundColor: colors.white,
  },
  promoIcon: { width: 54, height: 54, borderRadius: 27, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  promoEyebrow: { fontSize: 14, fontWeight: '800', marginBottom: 4 },
  promoLine: { fontSize: 15, color: colors.text, lineHeight: 22 },
  promoArrow: { width: 40, height: 26, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, marginTop: 28 },
  why: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
  },
  whyText: { fontSize: 12, textAlign: 'center', marginTop: 6, color: colors.text, fontWeight: '600' },
});
