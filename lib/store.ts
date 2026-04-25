"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartGiftSet, CartItem, Product, User } from "./types";
import { getVariantPrice } from "./utils";

interface CartStore {
  cartItems: CartItem[];
  favoriteItems: Product[];
  savedForLaterItems: CartItem[];
  currentUser: User | null;

  addToCart: (product: Product, quantity?: number, customizations?: Record<string, string>, giftSet?: CartGiftSet) => void;
  removeFromCart: (productId: string, customizations?: Record<string, string>, giftSet?: CartGiftSet) => void;
  updateQuantity: (productId: string, quantity: number, customizations?: Record<string, string>, giftSet?: CartGiftSet) => void;
  clearCart: () => void;

  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  saveForLater: (productId: string, customizations?: Record<string, string>, giftSet?: CartGiftSet) => void;
  moveToCart: (productId: string, customizations?: Record<string, string>, giftSet?: CartGiftSet) => void;
  removeSavedItem: (productId: string, customizations?: Record<string, string>, giftSet?: CartGiftSet) => void;

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

      addToCart: (product, quantity = 1, customizations, giftSet) => {
        const price = getVariantPrice(product, customizations);
        set((state) => {
          const existingIndex = state.cartItems.findIndex(
            (item) => 
              item.product.id === product.id && 
              JSON.stringify(item.customizations || {}) === JSON.stringify(customizations || {}) &&
              JSON.stringify(item.giftSet || null) === JSON.stringify(giftSet || null)
          );
          
          if (existingIndex >= 0 && !giftSet) {
            const updatedItems = [...state.cartItems];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + quantity,
              price
            };
            return {
              cartItems: updatedItems,
            };
          }
          return {
            cartItems: [
              ...state.cartItems,
              { product, quantity, customizations, price, giftSet },
            ],
          };
        });
      },

      removeFromCart: (productId, customizations, giftSet) => {
        set((state) => {
          const itemIndex = state.cartItems.findIndex(
            (i) => i.product.id === productId && JSON.stringify(i.customizations || {}) === JSON.stringify(customizations || {}) && JSON.stringify(i.giftSet || null) === JSON.stringify(giftSet || null)
          );
          if (itemIndex === -1) return state;
          const newCartItems = [...state.cartItems];
          newCartItems.splice(itemIndex, 1);
          return { cartItems: newCartItems };
        });
      },

      updateQuantity: (productId, quantity, customizations, giftSet) => {
        if (quantity <= 0) {
          get().removeFromCart(productId, customizations, giftSet);
          return;
        }
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            (item.product.id === productId && JSON.stringify(item.customizations || {}) === JSON.stringify(customizations || {}) && JSON.stringify(item.giftSet || null) === JSON.stringify(giftSet || null))
              ? { ...item, quantity }
              : item
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

      saveForLater: (productId, customizations, giftSet) => {
        set((state) => {
          const itemIndex = state.cartItems.findIndex(
            (i) => i.product.id === productId && JSON.stringify(i.customizations || {}) === JSON.stringify(customizations || {}) && JSON.stringify(i.giftSet || null) === JSON.stringify(giftSet || null)
          );
          if (itemIndex === -1) return state;
          const item = state.cartItems[itemIndex];
          const newCartItems = [...state.cartItems];
          newCartItems.splice(itemIndex, 1);
          return {
            cartItems: newCartItems,
            savedForLaterItems: [...state.savedForLaterItems, item],
          };
        });
      },

      moveToCart: (productId, customizations, giftSet) => {
        set((state) => {
          const itemIndex = state.savedForLaterItems.findIndex(
            (i) => i.product.id === productId && JSON.stringify(i.customizations || {}) === JSON.stringify(customizations || {}) && JSON.stringify(i.giftSet || null) === JSON.stringify(giftSet || null)
          );
          if (itemIndex === -1) return state;
          const item = state.savedForLaterItems[itemIndex];
          const newSavedItems = [...state.savedForLaterItems];
          newSavedItems.splice(itemIndex, 1);

          const existingInCartIndex = state.cartItems.findIndex(
            (i) => i.product.id === productId && JSON.stringify(i.customizations || {}) === JSON.stringify(customizations || {}) && JSON.stringify(i.giftSet || null) === JSON.stringify(giftSet || null)
          );
          
          if (existingInCartIndex >= 0 && !item.giftSet) {
            const newCartItems = [...state.cartItems];
            newCartItems[existingInCartIndex] = {
              ...newCartItems[existingInCartIndex],
              quantity: newCartItems[existingInCartIndex].quantity + item.quantity
            };
            return {
              savedForLaterItems: newSavedItems,
              cartItems: newCartItems
            };
          }

          return {
            savedForLaterItems: newSavedItems,
            cartItems: [...state.cartItems, item],
          };
        });
      },

      removeSavedItem: (productId, customizations, giftSet) => {
        set((state) => {
          const itemIndex = state.savedForLaterItems.findIndex(
            (i) => i.product.id === productId && JSON.stringify(i.customizations || {}) === JSON.stringify(customizations || {}) && JSON.stringify(i.giftSet || null) === JSON.stringify(giftSet || null)
          );
          if (itemIndex === -1) return state;
          const newSavedItems = [...state.savedForLaterItems];
          newSavedItems.splice(itemIndex, 1);
          return { savedForLaterItems: newSavedItems };
        });
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
