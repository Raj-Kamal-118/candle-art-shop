"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GiftBuilderPick, Product } from "@/lib/types";

export const GS_RIBBONS = [
  { id: "cream",  label: "Cream silk", color: "#fef3c7" },
  { id: "coral",  label: "Coral",      color: "#d97757" },
  { id: "forest", label: "Forest",     color: "#1a3828" },
  { id: "gold",   label: "Gold",       color: "#d4a574" },
  { id: "blush",  label: "Blush",      color: "#f3c5c0" },
];

export const GS_BOXES = [
  { id: "kraft",  label: "Kraft",        color: "#c9a47a" },
  { id: "cream",  label: "Cream",        color: "#fef3c7" },
  { id: "forest", label: "Deep forest",  color: "#1a3828" },
  { id: "blush",  label: "Blush",        color: "#f6d4cf" },
];

export const GS_CARDS = [
  { id: "card-min",     label: "Minimalist", swatch: "#fefdf8", stroke: "#1c1209", style: "Typeset in serif, cream on cream." },
  { id: "card-floral",  label: "Floral",     swatch: "#fce7e2", stroke: "#c2523a", style: "Pressed watercolour botanicals." },
  { id: "card-festive", label: "Festive",    swatch: "#fef9e0", stroke: "#b45309", style: "Gold foil, warm and celebratory." },
  { id: "card-forest",  label: "Forest",     swatch: "#0d2b1d", stroke: "#f3c65c", style: "Dark-mode moody, gold ink." },
  { id: "card-kids",    label: "For Kids",   swatch: "#fff1ef", stroke: "#d45839", style: "Hand-drawn animals, playful." },
];

interface GiftBuilderState {
  picks: GiftBuilderPick[];
  ribbon: string;
  box: string;
  recipient: string;
  note: string;
  cardStyle: string;

  add: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
  setRibbon: (r: string) => void;
  setBox: (b: string) => void;
  setRecipient: (r: string) => void;
  setNote: (n: string) => void;
  setCardStyle: (s: string) => void;
  /** Pick 4 random products (one per category if possible) */
  surpriseMe: (allProducts: Product[]) => void;
  /** Load item IDs from a premade set */
  loadPremade: (productIds: string[]) => void;
  reset: () => void;
  itemCount: () => number;
  totalPrice: (allProducts: Product[]) => number;
}

const defaults = {
  picks: [] as GiftBuilderPick[],
  ribbon: "cream",
  box: "kraft",
  recipient: "",
  note: "",
  cardStyle: "card-min",
};

export const useGiftBuilderStore = create<GiftBuilderState>()(
  persist(
    (set, get) => ({
      ...defaults,

      add: (productId) => {
        set((s) => {
          const ex = s.picks.find((p) => p.id === productId);
          if (ex) return { picks: s.picks.map((p) => p.id === productId ? { ...p, qty: p.qty + 1 } : p) };
          return { picks: [...s.picks, { id: productId, qty: 1 }] };
        });
      },

      remove: (productId) => {
        set((s) => {
          const ex = s.picks.find((p) => p.id === productId);
          if (!ex) return s;
          if (ex.qty <= 1) return { picks: s.picks.filter((p) => p.id !== productId) };
          return { picks: s.picks.map((p) => p.id === productId ? { ...p, qty: p.qty - 1 } : p) };
        });
      },

      clear: () => set({ picks: [] }),

      setRibbon: (r) => set({ ribbon: r }),
      setBox: (b) => set({ box: b }),
      setRecipient: (r) => set({ recipient: r }),
      setNote: (n) => set({ note: n }),
      setCardStyle: (s) => set({ cardStyle: s }),

      surpriseMe: (allProducts) => {
        if (!allProducts.length) return;
        // Group by categoryId, pick one random product per category (up to 4 categories)
        const byCategory = allProducts.reduce<Record<string, Product[]>>((acc, p) => {
          if (!acc[p.categoryId]) acc[p.categoryId] = [];
          acc[p.categoryId].push(p);
          return acc;
        }, {});
        const categories = Object.values(byCategory);
        const shuffledCats = categories.sort(() => Math.random() - 0.5).slice(0, 4);
        const picked = shuffledCats.map((cat) => cat[Math.floor(Math.random() * cat.length)]);
        const ribbons = GS_RIBBONS.map((r) => r.id);
        const boxes = GS_BOXES.map((b) => b.id);
        set({
          picks: picked.map((p) => ({ id: p.id, qty: 1 })),
          ribbon: ribbons[Math.floor(Math.random() * ribbons.length)],
          box: boxes[Math.floor(Math.random() * boxes.length)],
        });
      },

      loadPremade: (productIds) => {
        const counts: Record<string, number> = {};
        productIds.forEach((id) => { counts[id] = (counts[id] || 0) + 1; });
        set({ picks: Object.entries(counts).map(([id, qty]) => ({ id, qty })) });
      },

      reset: () => set({ ...defaults }),

      itemCount: () => get().picks.reduce((s, p) => s + p.qty, 0),

      totalPrice: (allProducts) => {
        return get().picks.reduce((total, pick) => {
          const product = allProducts.find((p) => p.id === pick.id);
          return total + (product ? product.price * pick.qty : 0);
        }, 0);
      },
    }),
    { name: "artisan-gift-builder-v1" }
  )
);
