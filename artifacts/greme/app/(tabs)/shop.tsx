import { Feather } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
  DimensionValue,
} from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { ProductCard } from '@/components/ProductCard';
import { useColors } from '@/hooks/useColors';
import { listProducts, SortOption } from '@/lib/catalog';

const categories = ['All', 'Fashion', 'Beauty', 'Home', 'Accessories'];
const sortOptions: { label: string; value: SortOption }[] = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price low', value: 'low' },
  { label: 'Price high', value: 'high' },
  { label: 'Best rated', value: 'rated' },
];

export default function ShopScreen() {
  const colors = useColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string; category?: string }>();
  const { width } = useWindowDimensions();
  const [search, setSearch] = useState(params.q ?? '');
  const [category, setCategory] = useState(params.category || 'All');
  const [sort, setSort] = useState<SortOption>('newest');
  const productsQuery = useQuery({
    queryKey: ['products', search, category, sort],
    queryFn: () => listProducts({ search, category, sort }),
    staleTime: 120_000,
  });
  const columns = width >= 900 ? 4 : width >= 560 ? 3 : 2;
  const cardWidth = `${(100 - (columns - 1) * 2.6) / columns}%` as DimensionValue;

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 110, paddingHorizontal: 20, paddingTop: 18 }}
      style={{ backgroundColor: colors.background, flex: 1 }}
    >
      <Text
        style={{
          color: colors.foreground,
          fontFamily: 'Inter_700Bold',
          fontSize: 30,
          letterSpacing: -0.7,
        }}
      >
        The shop
      </Text>
      <Text
        style={{
          color: colors.mutedForeground,
          fontFamily: 'Inter_400Regular',
          fontSize: 14,
          marginTop: 6,
        }}
      >
        Find your next favorite thing.
      </Text>
      <View
        style={{
          alignItems: 'center',
          backgroundColor: colors.white,
          borderColor: colors.line,
          borderRadius: 16,
          borderWidth: 1,
          flexDirection: 'row',
          marginTop: 20,
          paddingHorizontal: 15,
          paddingVertical: 12,
        }}
      >
        <Feather name="search" size={18} color={colors.mutedForeground} />
        <TextInput
          onChangeText={setSearch}
          onSubmitEditing={() => void productsQuery.refetch()}
          placeholder="Search products"
          placeholderTextColor={colors.mutedForeground}
          returnKeyType="search"
          style={{
            color: colors.foreground,
            flex: 1,
            fontFamily: 'Inter_400Regular',
            fontSize: 14,
            marginLeft: 10,
          }}
          value={search}
        />
      </View>
      <ScrollView
        contentContainerStyle={{ gap: 8 }}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 16 }}
      >
        {categories.map((item) => (
          <Pressable
            key={item}
            onPress={() => setCategory(item)}
            style={{
              backgroundColor: category === item ? colors.forest : colors.white,
              borderColor: category === item ? colors.forest : colors.line,
              borderRadius: 18,
              borderWidth: 1,
              paddingHorizontal: 14,
              paddingVertical: 9,
            }}
          >
            <Text
              style={{
                color: category === item ? colors.white : colors.darkForest,
                fontFamily: 'Inter_600SemiBold',
                fontSize: 12,
              }}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <ScrollView
        contentContainerStyle={{ gap: 7 }}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 10 }}
      >
        {sortOptions.map((item) => (
          <Pressable
            key={item.value}
            onPress={() => setSort(item.value)}
            style={{ paddingVertical: 7, paddingRight: 12 }}
          >
            <Text
              style={{
                color: sort === item.value ? colors.forest : colors.mutedForeground,
                fontFamily: sort === item.value ? 'Inter_700Bold' : 'Inter_500Medium',
                fontSize: 12,
              }}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      {productsQuery.isPending ? (
        <ActivityIndicator color={colors.forest} style={{ marginTop: 70 }} />
      ) : productsQuery.isError ? (
        <EmptyState
          title="We couldn't load the shop"
          message={productsQuery.error.message}
          actionLabel="Try again"
          onAction={() => void productsQuery.refetch()}
        />
      ) : productsQuery.data?.length ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 18 }}>
          {productsQuery.data.map((product) => (
            <ProductCard
              key={product.id}
              onPress={() => router.push(`/product/${product.id}`)}
              product={product}
              width={cardWidth}
            />
          ))}
        </View>
      ) : (
        <EmptyState
          title="Nothing matched that search"
          message="Try another phrase or browse a different category."
          actionLabel="Clear filters"
          onAction={() => {
            setSearch('');
            setCategory('All');
          }}
        />
      )}
    </ScrollView>
  );
}