import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Muted, PrimaryButton, ProductArt, ScreenHeader } from '@/components/ui';
import { useScreen } from '@/hooks/useScreen';
import { productById } from '@/data/mock';
import { useApp } from '@/store/AppContext';
import { colors, formatINR, radius } from '@/theme';

export default function ProductDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width, height } = useScreen();
  const artSize = Math.min(260, Math.round(height * 0.32));
  const insets = useSafeAreaInsets();
  const { addToCart, wishlist, toggleWishlist } = useApp();
  const [qty, setQty] = useState(1);
  const [slide, setSlide] = useState(0);
  const [added, setAdded] = useState(false);
  const product = productById(id ?? '');

  if (!product) {
    return (
      <View style={{ flex: 1 }}>
        <ScreenHeader title="Product" />
        <Muted style={{ textAlign: 'center', marginTop: 40 }}>Product not found.</Muted>
      </View>
    );
  }

  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const liked = wishlist.includes(product.id);
  // Gallery placeholders until real product photography is supplied.
  const gallery = [product, { ...product, tint: '#F3F7FB' }, { ...product, tint: '#EAF8F1' }];

  const chips = [
    { icon: 'layers-triple' as const, label: `${product.stages}-stage` },
    ...(product.uv ? [{ icon: 'white-balance-sunny' as const, label: 'UV protection' }] : []),
    ...(product.warrantyYears ? [{ icon: 'shield-check' as const, label: `${product.warrantyYears}-yr warranty` }] : []),
    { icon: 'truck-fast' as const, label: 'Free delivery' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title=""
        right={
          <View style={{ flexDirection: 'row', gap: 18 }}>
            <Pressable onPress={() => toggleWishlist(product.id)} hitSlop={8} accessibilityLabel="Wishlist">
              <Ionicons name={liked ? 'heart' : 'heart-outline'} size={24} color={liked ? colors.red : colors.text} />
            </Pressable>
            <Pressable
              onPress={() => Share.share({ message: `${product.name} — ${formatINR(product.price)} on Aquaphil Water Care` })}
              hitSlop={8}
              accessibilityLabel="Share"
            >
              <Ionicons name="share-social-outline" size={24} color={colors.text} />
            </Pressable>
          </View>
        }
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <FlatList
          data={gallery}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => String(i)}
          onScroll={(e) => setSlide(Math.round(e.nativeEvent.contentOffset.x / width))}
          scrollEventThrottle={32}
          renderItem={({ item }) => (
            <View style={{ width, padding: 16 }}>
              <View style={{ borderRadius: radius.xl, overflow: 'hidden' }}>
                <ProductArt product={item} size={artSize} />
              </View>
            </View>
          )}
        />
        <View style={styles.dots}>
          {gallery.map((_, i) => (
            <View key={i} style={[styles.dot, slide === i && styles.dotActive]} />
          ))}
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <Text style={styles.name}>{product.name}</Text>
          <Muted style={{ fontSize: 14, marginTop: 4 }}>{product.spec}</Muted>
          <View style={styles.ratingRow}>
            <View style={styles.rating}>
              <Text style={styles.ratingText}>{product.rating}</Text>
              <Ionicons name="star" size={12} color={colors.white} />
            </View>
            <Muted>{product.reviews.toLocaleString('en-IN')} reviews</Muted>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatINR(product.price)}</Text>
            <Text style={styles.mrp}>{formatINR(product.mrp)}</Text>
            <Text style={styles.off}>{off}% off</Text>
          </View>
          <Muted>Inclusive of all taxes</Muted>

          <View style={styles.chips}>
            {chips.map((c) => (
              <View key={c.label} style={styles.chip}>
                <MaterialCommunityIcons name={c.icon} size={16} color={colors.primary} />
                <Text style={styles.chipText}>{c.label}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.section}>Description</Text>
          <Text style={styles.desc}>{product.description}</Text>

          <Text style={styles.section}>Quantity</Text>
          <View style={styles.stepper}>
            <Pressable onPress={() => setQty((q) => Math.max(1, q - 1))} style={styles.stepBtn} accessibilityLabel="Decrease quantity">
              <Ionicons name="remove" size={20} color={colors.primary} />
            </Pressable>
            <Text style={styles.qty}>{qty}</Text>
            <Pressable onPress={() => setQty((q) => Math.min(10, q + 1))} style={styles.stepBtn} accessibilityLabel="Increase quantity">
              <Ionicons name="add" size={20} color={colors.primary} />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bar, { paddingBottom: insets.bottom + 12 }]}>
        <PrimaryButton
          title={added ? 'Added ✓' : 'Add to Cart'}
          variant="outline"
          style={{ flex: 1 }}
          onPress={() => {
            addToCart(product.id, qty);
            setAdded(true);
            setTimeout(() => setAdded(false), 1500);
          }}
        />
        <PrimaryButton
          title="Buy Now"
          style={{ flex: 1 }}
          onPress={() => {
            addToCart(product.id, qty);
            router.push('/cart');
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  dotActive: { width: 18, backgroundColor: colors.primary },
  name: { fontSize: 22, fontWeight: '800', color: colors.text },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: colors.green, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  ratingText: { color: colors.white, fontWeight: '800', fontSize: 13 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10, marginTop: 14 },
  price: { fontSize: 28, fontWeight: '900', color: colors.text },
  mrp: { fontSize: 16, color: colors.textMuted, textDecorationLine: 'line-through' },
  off: { fontSize: 16, fontWeight: '800', color: colors.green },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 18 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
  },
  chipText: { color: colors.primaryDark, fontWeight: '700', fontSize: 13 },
  section: { fontSize: 17, fontWeight: '800', color: colors.text, marginTop: 24, marginBottom: 8 },
  desc: { fontSize: 15, lineHeight: 23, color: colors.textMuted },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  stepBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  qty: { minWidth: 36, textAlign: 'center', fontSize: 17, fontWeight: '800', color: colors.text },
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
