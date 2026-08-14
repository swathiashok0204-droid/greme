import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { useColors } from '@/hooks/useColors';
import { formatPrice } from '@/lib/catalog';
import { useShop } from '@/context/ShopContext';

export default function CartScreen() {
  const colors = useColors();
  const router = useRouter();
  const { cart, subtotal, updateQuantity, removeFromCart } = useShop();
  const delivery = subtotal > 1500 || subtotal === 0 ? 0 : 99;
  const total = subtotal + delivery;
  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 20, paddingTop: 18 }}
      style={{ backgroundColor: colors.background, flex: 1 }}
    >
      <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 30 }}>
        Your bag
      </Text>
      <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 14, marginTop: 6 }}>
        {cart.length ? `${cart.length} piece${cart.length === 1 ? '' : 's'} selected` : 'A beautiful edit starts here.'}
      </Text>
      {cart.length === 0 ? (
        <EmptyState
          title="Your bag is waiting"
          message="Add something beautiful from the shop to see it here."
          actionLabel="Continue shopping"
          onAction={() => router.push('/(tabs)/shop')}
        />
      ) : (
        <>
          <View style={{ gap: 12, marginTop: 24 }}>
            {cart.map((item) => (
              <View
                key={item.product.id}
                style={{
                  alignItems: 'center',
                  backgroundColor: colors.white,
                  borderRadius: 18,
                  flexDirection: 'row',
                  padding: 12,
                }}
              >
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: colors.secondary,
                    borderRadius: 14,
                    height: 76,
                    justifyContent: 'center',
                    width: 68,
                  }}
                >
                  <Feather name="shopping-bag" size={22} color={colors.forest} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text numberOfLines={1} style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 14 }}>
                    {item.product.name}
                  </Text>
                  <Text style={{ color: colors.forest, fontFamily: 'Inter_700Bold', fontSize: 14, marginTop: 6 }}>
                    {formatPrice(item.product.price)}
                  </Text>
                  <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 8 }}>
                    <Pressable
                      onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
                      style={{ alignItems: 'center', backgroundColor: colors.secondary, borderRadius: 12, height: 26, justifyContent: 'center', width: 26 }}
                    >
                      <Feather name="minus" size={13} color={colors.darkForest} />
                    </Pressable>
                    <Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 13, marginHorizontal: 12 }}>
                      {item.quantity}
                    </Text>
                    <Pressable
                      onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
                      style={{ alignItems: 'center', backgroundColor: colors.secondary, borderRadius: 12, height: 26, justifyContent: 'center', width: 26 }}
                    >
                      <Feather name="plus" size={13} color={colors.darkForest} />
                    </Pressable>
                  </View>
                </View>
                <Pressable onPress={() => removeFromCart(item.product.id)} style={{ padding: 8 }}>
                  <Feather name="trash-2" size={17} color={colors.mutedForeground} />
                </Pressable>
              </View>
            ))}
          </View>
          <View style={{ backgroundColor: colors.white, borderRadius: 20, marginTop: 26, padding: 18 }}>
            <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 18, marginBottom: 14 }}>
              Summary
            </Text>
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 14 }}>Subtotal</Text>
                <Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 14 }}>{formatPrice(subtotal)}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 14 }}>Delivery</Text>
                <Text style={{ color: delivery ? colors.foreground : colors.success, fontFamily: 'Inter_600SemiBold', fontSize: 14 }}>
                  {delivery ? formatPrice(delivery) : 'Free'}
                </Text>
              </View>
              <View style={{ backgroundColor: colors.line, height: 1 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 16 }}>Total</Text>
                <Text style={{ color: colors.forest, fontFamily: 'Inter_700Bold', fontSize: 18 }}>{formatPrice(total)}</Text>
              </View>
            </View>
            <Pressable
              onPress={() => router.push('/checkout')}
              style={({ pressed }) => ({
                alignItems: 'center',
                backgroundColor: colors.forest,
                borderRadius: 17,
                marginTop: 20,
                opacity: pressed ? 0.8 : 1,
                paddingVertical: 14,
              })}
            >
              <Text style={{ color: colors.white, fontFamily: 'Inter_700Bold', fontSize: 14 }}>Continue to checkout</Text>
            </Pressable>
          </View>
        </>
      )}
    </ScrollView>
  );
}