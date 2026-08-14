import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Product } from '@/lib/catalog';

export type CartItem = {
  product: Product;
  quantity: number;
};

type ShopContextValue = {
  cart: CartItem[];
  wishlist: Product[];
  cartCount: number;
  subtotal: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  moveWishlistToCart: (product: Product) => void;
  clearCart: () => void;
  hydrated: boolean;
};

const ShopContext = createContext<ShopContextValue | null>(null);
const CART_KEY = 'greme-cart';
const WISHLIST_KEY = 'greme-wishlist';

export function ShopProvider({ children }: PropsWithChildren) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    void Promise.all([
      AsyncStorage.getItem(CART_KEY),
      AsyncStorage.getItem(WISHLIST_KEY),
    ]).then(([storedCart, storedWishlist]) => {
      if (storedCart) setCart(JSON.parse(storedCart) as CartItem[]);
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist) as Product[]);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (hydrated) void AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated)
      void AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const value = useMemo<ShopContextValue>(
    () => ({
      cart,
      wishlist,
      hydrated,
      cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      ),
      addToCart: (product) =>
        setCart((current) => {
          const existing = current.find(
            (item) => item.product.id === product.id,
          );
          if (existing) {
            return current.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            );
          }
          return [...current, { product, quantity: 1 }];
        }),
      removeFromCart: (productId) =>
        setCart((current) =>
          current.filter((item) => item.product.id !== productId),
        ),
      updateQuantity: (productId, quantity) =>
        setCart((current) =>
          quantity <= 0
            ? current.filter((item) => item.product.id !== productId)
            : current.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item,
              ),
        ),
      toggleWishlist: (product) =>
        setWishlist((current) =>
          current.some((item) => item.id === product.id)
            ? current.filter((item) => item.id !== product.id)
            : [...current, product],
        ),
      isWishlisted: (productId) =>
        wishlist.some((product) => product.id === productId),
      moveWishlistToCart: (product) => {
        setCart((current) => {
          const existing = current.find(
            (item) => item.product.id === product.id,
          );
          return existing
            ? current.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              )
            : [...current, { product, quantity: 1 }];
        });
        setWishlist((current) =>
          current.filter((item) => item.id !== product.id),
        );
      },
      clearCart: () => setCart([]),
    }),
    [cart, hydrated, wishlist],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used inside ShopProvider');
  return context;
}