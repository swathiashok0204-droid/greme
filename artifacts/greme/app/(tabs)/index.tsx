import { Feather } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { GremeLogo } from '@/components/GremeLogo';
import { ProductCard } from '@/components/ProductCard';
import { useColors } from '@/hooks/useColors';
import { listProducts } from '@/lib/catalog';
import { useShop } from '@/context/ShopContext';

const categories = ['All', 'Fashion', 'Beauty', 'Home', 'Accessories'];

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { cartCount } = useShop();
  const [search, setSearch] = useState('');
  const productsQuery = useQuery({
    queryKey: ['products', 'home'],
    queryFn: () => listProducts({ sort: 'newest' }),
    staleTime: 300_000,
  });
  const products = productsQuery.data ?? [];

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 110 }}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: colors.background, flex: 1 }}
    >
      <View style={{ paddingHorizontal: 20, paddingTop: 18 }}>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <GremeLogo />
          <Pressable
            accessibilityLabel="Open cart"
            onPress={() => router.push('/(tabs)/cart')}
            style={{
              alignItems: 'center',
              backgroundColor: colors.white,
              borderRadius: 22,
              height: 44,
              justifyContent: 'center',
              width: 44,
            }}
          >
            <Feather name="shopping-bag" size={19} color={colors.forest} />
            {cartCount ? (
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: colors.forest,
                  borderRadius: 8,
                  height: 16,
                  justifyContent: 'center',
                  position: 'absolute',
                  right: -2,
                  top: -2,
                  width: 16,
                }}
              >
                <Text
                  style={{
                    color: colors.white,
                    fontFamily: 'Inter_700Bold',
                    fontSize: 9,
                  }}
                >
                  {cartCount}
                </Text>
              </View>
            ) : null}
          </Pressable>
        </View>

        <View
          style={{
            alignItems: 'center',
            backgroundColor: colors.white,
            borderColor: colors.line,
            borderRadius: 16,
            borderWidth: 1,
            flexDirection: 'row',
            marginTop: 22,
            paddingHorizontal: 15,
            paddingVertical: 13,
          }}
        >
          <Feather name="search" size={18} color={colors.mutedForeground} />
          <TextInput
            onChangeText={setSearch}
            onSubmitEditing={() =>
              router.push({ pathname: '/(tabs)/shop', params: { q: search } })
            }
            placeholder="Search something beautiful"
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

        <View
          style={{
            backgroundColor: colors.darkForest,
            borderRadius: 24,
            marginTop: 22,
            overflow: 'hidden',
            padding: 22,
          }}
        >
          <Text
            style={{
              color: colors.tan,
              fontFamily: 'Inter_600SemiBold',
              fontSize: 11,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            the new edit
          </Text>
          <Text
            style={{
              color: colors.white,
              fontFamily: 'Inter_700Bold',
              fontSize: 30,
              letterSpacing: -0.8,
              lineHeight: 35,
              marginTop: 12,
              maxWidth: 250,
            }}
          >
            Little luxuries, beautifully found.
          </Text>
          <Pressable
            onPress={() => router.push('/(tabs)/shop')}
            style={({ pressed }) => ({
              alignSelf: 'flex-start',
              backgroundColor: colors.tan,
              borderRadius: 18,
              marginTop: 20,
              opacity: pressed ? 0.8 : 1,
              paddingHorizontal: 16,
              paddingVertical: 11,
            })}
          >
            <Text
              style={{
                color: colors.darkForest,
                fontFamily: 'Inter_700Bold',
                fontSize: 12,
              }}
            >
              Explore the edit
            </Text>
          </Pressable>
          <View
            style={{
              borderColor: colors.green,
              borderRadius: 100,
              borderWidth: 1,
              height: 160,
              position: 'absolute',
              right: -35,
              top: -45,
              width: 160,
            }}
          />
          <View
            style={{
              borderColor: colors.green,
              borderRadius: 100,
              borderWidth: 1,
              bottom: -85,
              height: 190,
              position: 'absolute',
              right: 35,
              width: 190,
            }}
          />
        </View>

        <Text
          style={{
            color: colors.foreground,
            fontFamily: 'Inter_700Bold',
            fontSize: 20,
            marginTop: 30,
          }}
        >
          Shop by mood
        </Text>
        <ScrollView
          contentContainerStyle={{ gap: 9 }}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 14 }}
        >
          {categories.map((category) => (
            <Pressable
              key={category}
              onPress={() =>
                router.push({
                  pathname: '/(tabs)/shop',
                  params: { category: category === 'All' ? '' : category },
                })
              }
              style={({ pressed }) => ({
                backgroundColor:
                  category === 'All' ? colors.forest : colors.white,
                borderColor: category === 'All' ? colors.forest : colors.line,
                borderRadius: 20,
                borderWidth: 1,
                opacity: pressed ? 0.76 : 1,
                paddingHorizontal: 16,
                paddingVertical: 10,
              })}
            >
              <Text
                style={{
                  color:
                    category === 'All' ? colors.white : colors.darkForest,
                  fontFamily: 'Inter_600SemiBold',
                  fontSize: 12,
                }}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 30,
          }}
        >
          <Text
            style={{
              color: colors.foreground,
              fontFamily: 'Inter_700Bold',
              fontSize: 20,
            }}
          >
            New arrivals
          </Text>
          <Pressable onPress={() => router.push('/(tabs)/shop')}>
            <Text
              style={{
                color: colors.forest,
                fontFamily: 'Inter_600SemiBold',
                fontSize: 12,
              }}
            >
              View all
            </Text>
          </Pressable>
        </View>

        {productsQuery.isPending ? (
          <ActivityIndicator
            color={colors.forest}
            size="small"
            style={{ marginVertical: 40 }}
          />
        ) : productsQuery.isError ? (
          <EmptyState
            title="Your edit is loading"
            message={productsQuery.error.message}
            actionLabel="Try again"
            onAction={() => void productsQuery.refetch()}
          />
        ) : products.length === 0 ? (
          <EmptyState
            title="Your edit is almost here"
            message="Published products from your Supabase catalog will appear here."
            actionLabel="Refresh"
            onAction={() => void productsQuery.refetch()}
          />
        ) : (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 14,
              marginTop: 18,
            }}
          >
            {products.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                onPress={() => router.push(`/product/${product.id}`)}
                product={product}
                width="47%"
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}