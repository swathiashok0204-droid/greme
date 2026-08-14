import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { ProductCard } from '@/components/ProductCard';
import { useColors } from '@/hooks/useColors';
import { useShop } from '@/context/ShopContext';

export default function WishlistScreen() {
  const colors = useColors();
  const router = useRouter();
  const { wishlist } = useShop();
  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 110, paddingHorizontal: 20, paddingTop: 18 }}
      style={{ backgroundColor: colors.background, flex: 1 }}
    >
      <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 30 }}>
            Saved
          </Text>
          <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 14, marginTop: 6 }}>
            Pieces you want to remember.
          </Text>
        </View>
        <Feather name="heart" size={24} color={colors.forest} />
      </View>
      {wishlist.length === 0 ? (
        <EmptyState
          title="Your saved edit is empty"
          message="Tap the heart on anything you love and it will stay here."
          actionLabel="Browse the shop"
          onAction={() => router.push('/(tabs)/shop')}
        />
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 24 }}>
          {wishlist.map((product) => (
            <ProductCard
              key={product.id}
              onPress={() => router.push(`/product/${product.id}`)}
              product={product}
              width="47%"
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}