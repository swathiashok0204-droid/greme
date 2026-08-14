import { Stack, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { useColors } from '@/hooks/useColors';
import { formatPrice } from '@/lib/catalog';
import { supabase } from '@/lib/supabase';

type Order = {
  id: string;
  total: number;
  status: string;
  created_at: string;
};

export default function OrdersScreen() {
  const colors = useColors();
  const router = useRouter();
  const ordersQuery = useQuery({
    queryKey: ['orders'],
    enabled: Boolean(supabase),
    queryFn: async (): Promise<Order[]> => {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('orders')
        .select('id,total,status,created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Order[];
    },
  });

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 20 }}
        style={{ backgroundColor: colors.background, flex: 1 }}
      >
        <Pressable onPress={() => router.back()} style={{ alignSelf: 'flex-start', padding: 6 }}>
          <Text style={{ color: colors.forest, fontFamily: 'Inter_600SemiBold', fontSize: 14 }}>Back</Text>
        </Pressable>
        <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 30, marginTop: 24 }}>Order history</Text>
        {ordersQuery.isError ? (
          <EmptyState title="Orders need one last connection" message={ordersQuery.error.message} actionLabel="Back to account" onAction={() => router.back()} />
        ) : ordersQuery.data?.length ? (
          <View style={{ gap: 12, marginTop: 24 }}>
            {ordersQuery.data.map((order) => (
              <View key={order.id} style={{ backgroundColor: colors.white, borderRadius: 18, padding: 17 }}>
                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 15 }}>Order #{String(order.id).slice(0, 8)}</Text>
                  <Text style={{ color: colors.success, fontFamily: 'Inter_600SemiBold', fontSize: 12 }}>{order.status}</Text>
                </View>
                <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 8 }}>
                  {new Date(order.created_at).toLocaleDateString('en-IN')}
                </Text>
                <Text style={{ color: colors.forest, fontFamily: 'Inter_700Bold', fontSize: 16, marginTop: 12 }}>{formatPrice(Number(order.total) || 0)}</Text>
              </View>
            ))}
          </View>
        ) : (
          <EmptyState title="No orders yet" message="When you place your first order, its status and details will appear here." actionLabel="Continue shopping" onAction={() => router.replace('/(tabs)/shop')} />
        )}
      </ScrollView>
    </>
  );
}