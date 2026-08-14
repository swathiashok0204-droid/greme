import { Feather } from '@expo/vector-icons';
import { DimensionValue, Image, Pressable, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import {
  discountPercent,
  formatPrice,
  Product,
} from '@/lib/catalog';
import { useShop } from '@/context/ShopContext';

export function ProductCard({
  product,
  width,
  onPress,
}: {
  product: Product;
  width?: DimensionValue;
  onPress: () => void;
}) {
  const colors = useColors();
  const { addToCart, isWishlisted, toggleWishlist } = useShop();
  const discount = discountPercent(product);
  const wishlisted = isWishlisted(product.id);

  return (
    <View style={{ marginBottom: 18, width }}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          backgroundColor: colors.secondary,
          borderRadius: 18,
          opacity: pressed ? 0.88 : 1,
          overflow: 'hidden',
        })}
      >
        {product.imageUrl ? (
          <Image
            source={{ uri: product.imageUrl }}
            style={{ aspectRatio: 0.86, width: '100%' }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{
              alignItems: 'center',
              aspectRatio: 0.86,
              backgroundColor: colors.tan,
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <Feather name="shopping-bag" size={30} color={colors.darkForest} />
          </View>
        )}
        {discount ? (
          <View
            style={{
              backgroundColor: colors.forest,
              borderRadius: 10,
              left: 10,
              paddingHorizontal: 8,
              paddingVertical: 5,
              position: 'absolute',
              top: 10,
            }}
          >
            <Text
              style={{
                color: colors.white,
                fontFamily: 'Inter_700Bold',
                fontSize: 10,
              }}
            >
              {discount}% off
            </Text>
          </View>
        ) : null}
        <Pressable
          accessibilityLabel={
            wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`
          }
          onPress={() => toggleWishlist(product)}
          style={{
            alignItems: 'center',
            backgroundColor: colors.white,
            borderRadius: 18,
            height: 36,
            justifyContent: 'center',
            position: 'absolute',
            right: 10,
            top: 10,
            width: 36,
          }}
        >
          <Feather
            name={wishlisted ? 'heart' : 'heart'}
            size={17}
            color={wishlisted ? colors.forest : colors.mutedForeground}
          />
        </Pressable>
      </Pressable>
      <Text
        numberOfLines={1}
        style={{
          color: colors.foreground,
          fontFamily: 'Inter_600SemiBold',
          fontSize: 14,
          marginTop: 10,
        }}
      >
        {product.name}
      </Text>
      <View style={{ alignItems: 'center', flexDirection: 'row', gap: 7, marginTop: 5 }}>
        <Text
          style={{
            color: colors.forest,
            fontFamily: 'Inter_700Bold',
            fontSize: 14,
          }}
        >
          {formatPrice(product.price)}
        </Text>
        {product.oldPrice ? (
          <Text
            style={{
              color: colors.mutedForeground,
              fontFamily: 'Inter_400Regular',
              fontSize: 12,
              textDecorationLine: 'line-through',
            }}
          >
            {formatPrice(product.oldPrice)}
          </Text>
        ) : null}
      </View>
      <Pressable
        onPress={() => addToCart(product)}
        style={({ pressed }) => ({
          alignItems: 'center',
          backgroundColor: colors.forest,
          borderRadius: 14,
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 9,
          opacity: pressed ? 0.78 : 1,
          paddingVertical: 10,
        })}
      >
        <Feather name="plus" size={15} color={colors.white} />
        <Text
          style={{
            color: colors.white,
            fontFamily: 'Inter_600SemiBold',
            fontSize: 12,
            marginLeft: 5,
          }}
        >
          Add to cart
        </Text>
      </Pressable>
    </View>
  );
}