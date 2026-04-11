"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product, User } from "./types";
import { getVariantPrice } from "./utils";

interface CartStore {
  cartItems: CartItem[];
  favoriteItems: Product[];
  savedForLaterItems: CartItem[];
  currentUser: User | null;

  addToCart: (product: Product, quantity?: number, customizations?: Record<string, string>) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  removeSavedItem: (productId: string) => void;

  cartTotal: () => number;
  cartCount: () => number;

  setCurrentUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      favoriteItems: [],
      savedForLaterItems: [],
      currentUser: null,

      addToCart: (product, quantity = 1, customizations) => {
        const price = getVariantPrice(product, customizations);
        set((state) => {
          const existing = state.cartItems.find(
            (item) => item.product.id === product.id
          );
          if (existing) {
            return {
              cartItems: state.cartItems.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity, price }
                  : item
              ),
            };
          }
          return {
            cartItems: [
              ...state.cartItems,
              { product, quantity, customizations, price },
            ],
          };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cartItems: state.cartItems.filter(
            (item) => item.product.id !== productId
          ),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ cartItems: [] }),

      addToFavorites: (product) => {
        set((state) => {
          if (state.favoriteItems.find((p) => p.id === product.id)) {
            return state;
          }
          return { favoriteItems: [...state.favoriteItems, product] };
        });
      },

      removeFromFavorites: (productId) => {
        set((state) => ({
          favoriteItems: state.favoriteItems.filter((p) => p.id !== productId),
        }));
      },

      isFavorite: (productId) => {
        return get().favoriteItems.some((p) => p.id === productId);
      },

      saveForLater: (productId) => {
        set((state) => {
          const item = state.cartItems.find(
            (i) => i.product.id === productId
          );
          if (!item) return state;
          return {
            cartItems: state.cartItems.filter(
              (i) => i.product.id !== productId
            ),
            savedForLaterItems: [...state.savedForLaterItems, item],
          };
        });
      },

      moveToCart: (productId) => {
        set((state) => {
          const item = state.savedForLaterItems.find(
            (i) => i.product.id === productId
          );
          if (!item) return state;
          return {
            savedForLaterItems: state.savedForLaterItems.filter(
              (i) => i.product.id !== productId
            ),
            cartItems: [...state.cartItems, item],
          };
        });
      },

      removeSavedItem: (productId) => {
        set((state) => ({
          savedForLaterItems: state.savedForLaterItems.filter(
            (i) => i.product.id !== productId
          ),
        }));
      },

      cartTotal: () => {
        return get().cartItems.reduce(
          (total, item) => total + (item.price ?? item.product.price) * item.quantity,
          0
        );
      },

      cartCount: () => {
        return get().cartItems.reduce((count, item) => count + item.quantity, 0);
      },

      setCurrentUser: (user) => set({ currentUser: user }),
      clearUser: () => set({ currentUser: null }),
    }),
    {
      name: "candle-art-shop-store",
    }
  )
);
