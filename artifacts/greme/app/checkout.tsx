import { Feather } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useColors } from '@/hooks/useColors';
import { formatPrice } from '@/lib/catalog';
import { supabase } from '@/lib/supabase';
import { useShop } from '@/context/ShopContext';

export default function CheckoutScreen() {
  const colors = useColors();
  const router = useRouter();
  const { cart, subtotal, clearCart } = useShop();
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [placing, setPlacing] = useState(false);
  const delivery = subtotal > 1500 ? 0 : 99;
  const total = subtotal + delivery;

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user.id ?? null);
      setName(
        typeof data.session?.user.user_metadata?.full_name === 'string'
          ? data.session.user.user_metadata.full_name
          : '',
      );
    });
  }, []);

  async function placeOrder() {
    if (!supabase) {
      Alert.alert(
        'Supabase is not configured',
        'Add the project URL and publishable key to the app environment.',
      );
      return;
    }
    if (!userId) {
      Alert.alert(
        'Log in to checkout',
        'Your order needs an account so you can follow its delivery status.',
      );
      router.push('/(tabs)/account');
      return;
    }
    if (!name.trim() || !phone.trim() || !address.trim() || !cart.length) {
      Alert.alert(
        'Complete your details',
        'Add your name, phone number, delivery address, and at least one item.',
      );
      return;
    }

    setPlacing(true);
    const orderResult = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        customer_name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        total,
        status: 'Pending',
      })
      .select('id')
      .single();

    if (orderResult.error || !orderResult.data) {
      setPlacing(false);
      Alert.alert(
        'We couldn’t place that order',
        orderResult.error?.message ??
          'Check that the grème Supabase setup policies have been applied.',
      );
      return;
    }

    const itemResult = await supabase.from('order_items').insert(
      cart.map((item) => ({
        order_id: orderResult.data.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      })),
    );

    setPlacing(false);
    if (itemResult.error) {
      Alert.alert(
        'Order created, items need attention',
        itemResult.error.message,
      );
      return;
    }
    clearCart();
    router.replace('/orders');
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 40,
          paddingHorizontal: 20,
          paddingTop: 18,
        }}
        style={{ backgroundColor: colors.background, flex: 1 }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{ alignItems: 'center', flexDirection: 'row', paddingVertical: 8 }}
        >
          <Feather name="arrow-left" size={18} color={colors.foreground} />
          <Text
            style={{
              color: colors.foreground,
              fontFamily: 'Inter_600SemiBold',
              fontSize: 14,
              marginLeft: 8,
            }}
          >
            Back to bag
          </Text>
        </Pressable>
        <Text
          style={{
            color: colors.foreground,
            fontFamily: 'Inter_700Bold',
            fontSize: 30,
            marginTop: 28,
          }}
        >
          Checkout
        </Text>
        <Text
          style={{
            color: colors.mutedForeground,
            fontFamily: 'Inter_400Regular',
            fontSize: 14,
            lineHeight: 21,
            marginTop: 8,
          }}
        >
          A few details, then your edit is on its way.
        </Text>
        <View
          style={{
            backgroundColor: colors.white,
            borderRadius: 20,
            marginTop: 24,
            padding: 18,
          }}
        >
          <Text
            style={{
              color: colors.foreground,
              fontFamily: 'Inter_700Bold',
              fontSize: 18,
            }}
          >
            Delivery details
          </Text>
          {[
            ['Full name', name, setName],
            ['Phone number', phone, setPhone],
            ['Delivery address', address, setAddress],
          ].map(([label, value, setter]) => (
            <TextInput
              key={label as string}
              onChangeText={setter as (value: string) => void}
              placeholder={label as string}
              placeholderTextColor={colors.mutedForeground}
              style={{
                backgroundColor: colors.secondary,
                borderColor: colors.line,
                borderRadius: 14,
                borderWidth: 1,
                color: colors.foreground,
                fontFamily: 'Inter_400Regular',
                fontSize: 14,
                marginTop: 12,
                minHeight: label === 'Delivery address' ? 82 : undefined,
                paddingHorizontal: 14,
                paddingVertical: 13,
                textAlignVertical:
                  label === 'Delivery address' ? 'top' : 'center',
              }}
              value={value as string}
              multiline={label === 'Delivery address'}
            />
          ))}
        </View>
        <View
          style={{
            backgroundColor: colors.white,
            borderRadius: 20,
            marginTop: 14,
            padding: 18,
          }}
        >
          <Text
            style={{
              color: colors.foreground,
              fontFamily: 'Inter_700Bold',
              fontSize: 18,
            }}
          >
            Order summary
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 }}>
            <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 14 }}>Subtotal</Text>
            <Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 14 }}>{formatPrice(subtotal)}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
            <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 14 }}>Delivery</Text>
            <Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 14 }}>{delivery ? formatPrice(delivery) : 'Free'}</Text>
          </View>
          <View style={{ backgroundColor: colors.line, height: 1, marginVertical: 18 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 16 }}>Total</Text>
            <Text style={{ color: colors.forest, fontFamily: 'Inter_700Bold', fontSize: 18 }}>{formatPrice(total)}</Text>
          </View>
        </View>
        <Pressable
          disabled={placing}
          onPress={() => void placeOrder()}
          style={({ pressed }) => ({
            alignItems: 'center',
            backgroundColor: colors.forest,
            borderRadius: 17,
            marginTop: 18,
            opacity: placing ? 0.55 : pressed ? 0.8 : 1,
            paddingVertical: 15,
          })}
        >
          {placing ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={{ color: colors.white, fontFamily: 'Inter_700Bold', fontSize: 14 }}>
              Place order
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </>
  );
}