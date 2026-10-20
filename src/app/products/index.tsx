import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Chip, Muted, ProductCard, ScreenHeader } from '@/components/ui';
import { Category, products } from '@/data/mock';
import { useApp } from '@/store/AppContext';
import { colors, radius } from '@/theme';

const CATEGORIES: ('All' | Category)[] = ['All', 'Domestic', 'Commercial', 'Spares'];
const SORTS = [
  { key: 'popular', label: 'Popular' },
  { key: 'low', label: 'Price: Low–High' },
  { key: 'high', label: 'Price: High–Low' },
  { key: 'rating', label: 'Top Rated' },
] as const;
const STAGES = [0, 5, 7] as const;

export default function ProductListing() {
  const params = useLocalSearchParams<{ category?: string; q?: string }>();
  const { addToCart, cartCount } = useApp();
  const [category, setCategory] = useState<'All' | Category>(
    CATEGORIES.includes(params.category as Category) ? (params.category as Category) : 'All'
  );
  const [query, setQuery] = useState(params.q ?? '');
  const [sort, setSort] = useState<(typeof SORTS)[number]['key']>('popular');
  const [minStages, setMinStages] = useState<number>(0);
  const [uvOnly, setUvOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out = products.filter(
      (p) =>
        (category === 'All' || p.category === category) &&
        (!q || `${p.name} ${p.spec} ${p.brand} ${p.category}`.toLowerCase().includes(q)) &&
        p.stages >= minStages &&
        (!uvOnly || p.uv)
    );
    if (sort === 'low') out.sort((a, b) => a.price - b.price);
    if (sort === 'high') out.sort((a, b) => b.price - a.price);
    if (sort === 'rating') out.sort((a, b) => b.rating - a.rating);
    if (sort === 'popular') out.sort((a, b) => b.reviews - a.reviews);
    return out;
  }, [category, query, sort, minStages, uvOnly]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgSoft }}>
      <ScreenHeader
        title="Shop"
        right={
          <Pressable onPress={() => router.push('/cart')} hitSlop={8} accessibilityLabel="Cart">
            <Ionicons name="cart-outline" size={24} color={colors.text} />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </Pressable>
        }
      />
      <View style={{ backgroundColor: colors.white, paddingBottom: 12 }}>
        <View style={styles.searchRow}>
          <View style={styles.search}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search products"
              placeholderTextColor={colors.textMuted}
              style={styles.searchInput}
            />
            {!!query && (
              <Pressable onPress={() => setQuery('')} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </Pressable>
            )}
          </View>
          <Pressable
            onPress={() => setShowFilters((v) => !v)}
            style={[styles.filterBtn, showFilters && { backgroundColor: colors.primary, borderColor: colors.primary }]}
            accessibilityLabel="Filters"
          >
            <Ionicons name="options-outline" size={20} color={showFilters ? colors.white : colors.text} />
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
          {CATEGORIES.map((c) => (
            <Chip key={c} label={c} active={category === c} onPress={() => setCategory(c)} />
          ))}
        </ScrollView>
        {showFilters && (
          <View style={{ paddingHorizontal: 16, marginTop: 12, gap: 10 }}>
            <Text style={styles.filterLabel}>Sort by</Text>
            <View style={styles.wrap}>
              {SORTS.map((s) => (
                <Chip key={s.key} label={s.label} active={sort === s.key} onPress={() => setSort(s.key)} />
              ))}
            </View>
            <Text style={styles.filterLabel}>Purification stages</Text>
            <View style={styles.wrap}>
              {STAGES.map((n) => (
                <Chip key={n} label={n === 0 ? 'Any' : `${n}+ stages`} active={minStages === n} onPress={() => setMinStages(n)} />
              ))}
              <Chip label="UV protection" active={uvOnly} onPress={() => setUvOnly((v) => !v)} />
            </View>
          </View>
        )}
      </View>
      <FlatList
        data={list}
        keyExtractor={(p) => p.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}
        ListHeaderComponent={<Muted>{list.length} products</Muted>}
        ListEmptyComponent={<Muted style={{ textAlign: 'center', marginTop: 40 }}>No products match your filters.</Muted>}
        renderItem={({ item, index }) => (
          <View style={{ flex: 1, maxWidth: '50%', paddingRight: index % 2 === 0 && index === list.length - 1 ? 6 : 0 }}>
            <ProductCard
              product={item}
              onPress={() => router.push({ pathname: '/products/[id]', params: { id: item.id } })}
              onAdd={() => addToCart(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12 },
  search: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.bgSoft,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, fontSize: 15, color: colors.text, height: 44 },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterLabel: { fontWeight: '700', color: colors.text },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badge: {
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
  badgeText: { color: colors.white, fontSize: 11, fontWeight: '800' },
});
