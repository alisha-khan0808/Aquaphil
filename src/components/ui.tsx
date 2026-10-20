import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Polygon } from 'react-native-svg';

import { Product } from '@/data/mock';
import { colors, formatINR, radius, shadow } from '@/theme';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

/** Radiating rays behind the hero, like the reference design's sunburst. */
export function Sunburst({ width, height, color = 'rgba(255,255,255,0.09)' }: { width: number; height: number; color?: string }) {
  const cx = width / 2;
  const cy = height * 0.42;
  const r = Math.max(width, height) * 1.2;
  const rays = 18;
  const polys = [];
  for (let i = 0; i < rays; i++) {
    const a1 = (i / rays) * Math.PI * 2;
    const a2 = a1 + Math.PI / rays;
    const p = `${cx},${cy} ${cx + r * Math.cos(a1)},${cy + r * Math.sin(a1)} ${cx + r * Math.cos(a2)},${cy + r * Math.sin(a2)}`;
    polys.push(<Polygon key={i} points={p} fill={color} />);
  }
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
      {polys}
    </Svg>
  );
}

/** Soft water waves at the bottom of the hero (stand-in for the reference's clouds). */
export function Waves({ width, height = 90 }: { width: number; height?: number }) {
  const w = width;
  const h = height;
  return (
    <Svg width={w} height={h} style={{ position: 'absolute', bottom: 0, left: 0 }} pointerEvents="none">
      <Path
        d={`M0 ${h * 0.45} C ${w * 0.2} ${h * 0.1}, ${w * 0.35} ${h * 0.75}, ${w * 0.55} ${h * 0.4} S ${w * 0.85} ${h * 0.05}, ${w} ${h * 0.35} L ${w} ${h} L 0 ${h} Z`}
        fill="rgba(255,255,255,0.35)"
      />
      <Path
        d={`M0 ${h * 0.7} C ${w * 0.25} ${h * 0.45}, ${w * 0.45} ${h * 0.95}, ${w * 0.7} ${h * 0.6} S ${w * 0.92} ${h * 0.45}, ${w} ${h * 0.6} L ${w} ${h} L 0 ${h} Z`}
        fill="rgba(255,255,255,0.7)"
      />
    </Svg>
  );
}

export function Logo({ size = 28, light = false }: { size?: number; light?: boolean }) {
  const c = light ? colors.white : colors.primary;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <MaterialCommunityIcons name="water" size={size} color={light ? colors.white : colors.aqua} />
      <Text style={{ fontSize: size * 0.8, fontWeight: '800', color: c, letterSpacing: 0.3 }}>
        Aqua<Text style={{ color: light ? '#BDE9FF' : colors.aqua }}>phil</Text>
      </Text>
    </View>
  );
}

export function PrimaryButton({
  title,
  onPress,
  disabled,
  style,
  variant = 'dark',
  icon,
}: {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  variant?: 'dark' | 'blue' | 'outline';
  icon?: React.ComponentProps<typeof Ionicons>['name'];
}) {
  const bg = variant === 'dark' ? colors.ink : variant === 'blue' ? colors.primary : colors.white;
  const fg = variant === 'outline' ? colors.primary : colors.white;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, opacity: disabled ? 0.45 : pressed ? 0.85 : 1 },
        variant === 'outline' && { borderWidth: 1.5, borderColor: colors.primary },
        style,
      ]}
    >
      <Text style={[styles.btnText, { color: fg }]}>{title}</Text>
      {icon && <Ionicons name={icon} size={16} color={fg} style={{ marginLeft: 6 }} />}
    </Pressable>
  );
}

export function ScreenHeader({ title, right, onBack }: { title: string; right?: React.ReactNode; onBack?: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <Pressable
        hitSlop={12}
        accessibilityLabel="Back"
        onPress={onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')))}
        style={styles.headerBtn}
      >
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </Pressable>
      <Text style={styles.headerTitle} numberOfLines={1}>
        {title}
      </Text>
      <View style={{ minWidth: 40, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}

export function TabHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + 8, paddingLeft: 20 }]}>
      <Text style={[styles.headerTitle, { textAlign: 'left', fontSize: 22 }]}>{title}</Text>
      {right}
    </View>
  );
}

export function ProductArt({ product, size = 120 }: { product: Product; size?: number }) {
  return (
    <View style={[styles.art, { backgroundColor: product.tint, height: size }]}>
      <View style={[styles.artCircle, { width: size * 0.72, height: size * 0.72, borderRadius: size }]}>
        <MaterialCommunityIcons name={product.icon as IconName} size={size * 0.42} color={colors.primary} />
      </View>
      {product.uv && (
        <View style={styles.artBadge}>
          <Text style={styles.artBadgeText}>UV</Text>
        </View>
      )}
    </View>
  );
}

export function ProductCard({
  product,
  onPress,
  onAdd,
  width,
}: {
  product: Product;
  onPress: () => void;
  onAdd: () => void;
  width?: number;
}) {
  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  return (
    <Pressable onPress={onPress} style={[styles.card, width ? { width } : { flex: 1 }]}>
      <ProductArt product={product} size={110} />
      <View style={{ padding: 12, gap: 3, flex: 1 }}>
        <Text style={styles.cardName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.cardSpec} numberOfLines={1}>
          {product.spec}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
          <Text style={styles.cardPrice}>{formatINR(product.price)}</Text>
          <Text style={styles.cardOff}>{off}% off</Text>
        </View>
        <Pressable onPress={onAdd} style={styles.addBtn} accessibilityLabel={`Add ${product.name} to cart`}>
          <Ionicons name="add" size={16} color={colors.primary} />
          <Text style={styles.addText}>Add to Cart</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const BADGE: Record<string, { bg: string; fg: string }> = {
  Delivered: { bg: colors.greenLight, fg: colors.green },
  Completed: { bg: colors.greenLight, fg: colors.green },
  Feedback: { bg: colors.greenLight, fg: colors.green },
  Active: { bg: colors.greenLight, fg: colors.green },
  Shipped: { bg: '#E8F1FF', fg: colors.primary },
  Placed: { bg: '#E8F1FF', fg: colors.primary },
  Requested: { bg: '#FFF4E0', fg: '#B26A00' },
  'Technician Assigned': { bg: '#EEE9FF', fg: '#5B3CC4' },
  'In Progress': { bg: '#FFF4E0', fg: '#B26A00' },
  'Renewal Due': { bg: '#FFF4E0', fg: '#B26A00' },
  Expired: { bg: '#FDECEC', fg: colors.red },
};

export function StatusBadge({ status }: { status: string }) {
  const c = BADGE[status] ?? { bg: colors.bgSoft, fg: colors.textMuted };
  const label = status === 'Feedback' ? 'Completed' : status;
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.badgeText, { color: c.fg }]}>{label}</Text>
    </View>
  );
}

/** Grid tile: illustration on a soft square with a two-line label below. */
export function Tile({
  icon,
  label,
  onPress,
  color = colors.primary,
  accent = colors.aqua,
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
  color?: string;
  accent?: string;
}) {
  return (
    <Pressable onPress={onPress} style={styles.tile} accessibilityRole="button" accessibilityLabel={label}>
      {({ pressed }) => (
        <>
          <View style={[styles.tileBox, pressed && { transform: [{ scale: 0.95 }] }]}>
            <View style={[styles.tileDot, { backgroundColor: accent }]} />
            <MaterialCommunityIcons name={icon} size={36} color={color} />
          </View>
          <Text style={styles.tileLabel} numberOfLines={2}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}

export function Chip({
  label,
  active,
  onPress,
  style,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && { backgroundColor: colors.primary, borderColor: colors.primary }, style]}
    >
      <Text style={[styles.chipText, active && { color: colors.white }]}>{label}</Text>
    </Pressable>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.box, style]}>{children}</View>;
}

export function Muted({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[{ color: colors.textMuted, fontSize: 13 }, style]}>{children}</Text>;
}

export function Line({ label, value, color, bold }: { label: string; value: string; color?: string; bold?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
      <Text style={{ color: bold ? colors.text : colors.textMuted, fontWeight: bold ? '800' : '500', fontSize: bold ? 16 : 14 }}>{label}</Text>
      <Text style={{ color: color ?? colors.text, fontWeight: bold ? '800' : '600', fontSize: bold ? 16 : 14 }}>{value}</Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  btn: {
    height: 52,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  btnText: { fontSize: 16, fontWeight: '700' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 12,
    backgroundColor: colors.bg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: colors.text, textAlign: 'center' },
  art: { alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg },
  artCircle: { backgroundColor: 'rgba(255,255,255,0.75)', alignItems: 'center', justifyContent: 'center' },
  artBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#5B3CC4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  artBadgeText: { color: colors.white, fontSize: 10, fontWeight: '800' },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, ...shadow },
  cardName: { fontSize: 14, fontWeight: '700', color: colors.text, minHeight: 36 },
  cardSpec: { fontSize: 12, color: colors.textMuted },
  cardPrice: { fontSize: 16, fontWeight: '800', color: colors.text },
  cardOff: { fontSize: 12, fontWeight: '700', color: colors.green },
  addBtn: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: 7,
    gap: 2,
  },
  addText: { color: colors.primary, fontWeight: '700', fontSize: 13 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill, alignSelf: 'flex-start' },
  badgeText: { fontSize: 12, fontWeight: '700' },
  tile: { width: '25%', alignItems: 'center', marginBottom: 22 },
  tileBox: {
    width: 74,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.tile,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tileDot: { position: 'absolute', width: 26, height: 26, borderRadius: 13, opacity: 0.25, right: 8, top: 6 },
  tileLabel: { marginTop: 10, fontSize: 14, lineHeight: 20, textAlign: 'center', color: colors.text, paddingHorizontal: 2 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  sectionAction: { fontSize: 14, fontWeight: '700', color: colors.primary },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  chipText: { fontSize: 14, fontWeight: '600', color: colors.text },
  box: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: colors.border },
});
