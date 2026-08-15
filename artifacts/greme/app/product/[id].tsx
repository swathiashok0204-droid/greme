import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { EmptyState } from "@/components/EmptyState";
import { useColors } from "@/hooks/useColors";
import { discountPercent, formatPrice, getProduct } from "@/lib/catalog";
import { useShop } from "@/context/ShopContext";

export default function ProductDetailsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addToCart, isWishlisted, toggleWishlist } = useShop();

  const query = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(String(id)),
    enabled: Boolean(id),
  });

  const product = query.data;

  if (query.isPending) {
    return (
      <View
        style={{
          alignItems: "center",
          backgroundColor: colors.background,
          flex: 1,
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color={colors.forest} />
      </View>
    );
  }

  if (query.isError || !product) {
    return (
      <View
        style={{
          backgroundColor: colors.background,
          flex: 1,
          justifyContent: "center",
        }}
      >
        <EmptyState
          title="This piece went missing"
          message={
            query.error?.message ?? "The product is no longer available."
          }
          actionLabel="Back to shop"
          onAction={() => router.back()}
        />
      </View>
    );
  }

  const discount = discountPercent(product);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        style={{
          backgroundColor: colors.background,
          flex: 1,
        }}
      >
        {/* PRODUCT IMAGE */}
        <View
          style={{
            alignItems: "center",
            backgroundColor: colors.secondary,
            height: 360,
            justifyContent: "center",
          }}
        >
          {product.imageUrl ? (
            <Image
              source={{ uri: product.imageUrl }}
              resizeMode="contain"
              style={{
                height: "100%",
                width: "100%",
              }}
              onError={(event) => {
                alert(`Image failed to load:\n\n${event.nativeEvent.error}`);
              }}
            />
          ) : (
            <View
              style={{
                alignItems: "center",
                flex: 1,
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Feather name="shopping-bag" size={48} color={colors.forest} />
            </View>
          )}

          {/* BACK BUTTON */}
          <Pressable
            onPress={() => router.back()}
            style={{
              alignItems: "center",
              backgroundColor: colors.white,
              borderRadius: 22,
              height: 44,
              justifyContent: "center",
              left: 18,
              position: "absolute",
              top: 18,
              width: 44,
            }}
          >
            <Feather name="arrow-left" size={19} color={colors.foreground} />
          </Pressable>

          {/* WISHLIST BUTTON */}
          <Pressable
            onPress={() => toggleWishlist(product)}
            style={{
              alignItems: "center",
              backgroundColor: colors.white,
              borderRadius: 22,
              height: 44,
              justifyContent: "center",
              position: "absolute",
              right: 18,
              top: 18,
              width: 44,
            }}
          >
            <Feather
              name="heart"
              size={19}
              color={
                isWishlisted(product.id) ? colors.forest : colors.foreground
              }
            />
          </Pressable>
        </View>

        {/* PRODUCT INFORMATION */}
        <View style={{ padding: 20 }}>
          <Text
            style={{
              color: colors.mutedForeground,
              fontFamily: "Inter_600SemiBold",
              fontSize: 11,
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            {product.category ?? "the edit"}
          </Text>

          <Text
            style={{
              color: colors.foreground,
              fontFamily: "Inter_700Bold",
              fontSize: 28,
              letterSpacing: -0.6,
              lineHeight: 34,
              marginTop: 10,
            }}
          >
            {product.name}
          </Text>

          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              marginTop: 14,
            }}
          >
            <Text
              style={{
                color: colors.forest,
                fontFamily: "Inter_700Bold",
                fontSize: 20,
              }}
            >
              {formatPrice(product.price)}
            </Text>

            {product.oldPrice ? (
              <Text
                style={{
                  color: colors.mutedForeground,
                  fontFamily: "Inter_400Regular",
                  fontSize: 14,
                  marginLeft: 9,
                  textDecorationLine: "line-through",
                }}
              >
                {formatPrice(product.oldPrice)}
              </Text>
            ) : null}

            {discount ? (
              <Text
                style={{
                  color: colors.success,
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 12,
                  marginLeft: 10,
                }}
              >
                {discount}% off
              </Text>
            ) : null}
          </View>

          <Text
            style={{
              color: colors.mutedForeground,
              fontFamily: "Inter_400Regular",
              fontSize: 15,
              lineHeight: 23,
              marginTop: 18,
            }}
          >
            {product.description ??
              "A considered piece, selected for the grème edit."}
          </Text>

          {/* ADD TO CART */}
          <Pressable
            onPress={() => {
              addToCart(product);
              router.push("/(tabs)/cart");
            }}
            style={({ pressed }) => ({
              alignItems: "center",
              backgroundColor: colors.forest,
              borderRadius: 17,
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 28,
              opacity: pressed ? 0.8 : 1,
              paddingVertical: 15,
            })}
          >
            <Feather name="shopping-bag" size={17} color={colors.white} />

            <Text
              style={{
                color: colors.white,
                fontFamily: "Inter_700Bold",
                fontSize: 14,
                marginLeft: 9,
              }}
            >
              Add to cart
            </Text>
          </Pressable>

          {/* SAVE TO WISHLIST */}
          <Pressable
            onPress={() => toggleWishlist(product)}
            style={{
              alignItems: "center",
              borderColor: colors.line,
              borderRadius: 17,
              borderWidth: 1,
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 10,
              paddingVertical: 14,
            }}
          >
            <Feather name="heart" size={16} color={colors.forest} />

            <Text
              style={{
                color: colors.forest,
                fontFamily: "Inter_600SemiBold",
                fontSize: 13,
                marginLeft: 8,
              }}
            >
              {isWishlisted(product.id)
                ? "Saved to wishlist"
                : "Save to wishlist"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}
