"use client";

import Link from "next/link";
import {
  ShoppingCart,
  ArrowRight,
  Gift,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import CartItemComponent from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { formatPrice } from "@/lib/utils";
import { GS_BOXES, GS_RIBBONS } from "@/lib/stores/giftBuilderStore";

function GiftSetCartItem({ item }: { item: import("@/lib/types").CartItem }) {
  const [open, setOpen] = useState(false);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const price = item.price ?? item.product.price;
  const gs = item.giftSet;
  const picks = gs?.picks ?? [];
  const ribbonLabel =
    GS_RIBBONS.find((r) => r.id === gs?.ribbon)?.label ?? gs?.ribbon ?? "";
  const boxLabel =
    GS_BOXES.find((b) => b.id === gs?.box)?.label ?? gs?.box ?? "";

  return (
    <div className="py-5 border-b border-cream-200 dark:border-amber-900/20 last:border-b-0">
      <div className="flex items-start gap-4">
        {/* Gift box icon / cover image */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-cream-50 dark:bg-[#0f0e1c] flex items-center justify-center flex-shrink-0 border border-cream-200 dark:border-amber-900/30 overflow-hidden shadow-sm">
          {item.product.images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.product.images[0]}
              alt={item.product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Gift size={24} className="text-amber-700 dark:text-amber-500" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-500 mb-1">
                {gs?.kind === "custom" ? "Custom Gift Set" : "Gift Set"}
              </div>
              <div className="font-serif text-lg font-bold text-brown-900 dark:text-amber-50 leading-tight">
                {item.product.name}
              </div>
              {gs?.card.recipient && (
                <div className="text-xs text-brown-500 dark:text-amber-100/60 mt-1 italic">
                  For {gs.card.recipient}
                </div>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-bold text-brown-900 dark:text-amber-100">
                {formatPrice(price)}
              </div>
              {picks.length > 0 && (
                <div className="text-xs text-brown-400 dark:text-amber-100/40 mt-0.5">
                  {picks.reduce((s, p) => s + p.qty, 0)} items
                </div>
              )}
            </div>
          </div>

          {/* Wrap details pill row */}
          {gs && (ribbonLabel || boxLabel) && (
            <div className="flex gap-2 mt-1.5 flex-wrap">
              {boxLabel && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-cream-100 dark:bg-amber-900/30 text-brown-600 dark:text-amber-100/70 border border-cream-200 dark:border-amber-900/40">
                  📦 {boxLabel}
                </span>
              )}
              {ribbonLabel && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-cream-100 dark:bg-amber-900/30 text-brown-600 dark:text-amber-100/70 border border-cream-200 dark:border-amber-900/40">
                  🎀 {ribbonLabel}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center gap-4 mt-2">
            {picks.length > 0 && (
              <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-1 text-xs font-medium text-brown-500 dark:text-amber-100/60 hover:text-brown-800 dark:hover:text-amber-100 transition-colors"
              >
                {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                {open ? "Hide" : "See"} what&apos;s inside
              </button>
            )}
            <button
              onClick={() => removeFromCart(item.product.id)}
              className="text-xs font-medium text-red-400 hover:text-red-600 transition-colors"
            >
              Remove
            </button>
          </div>

          {/* Expanded product list */}
          {open && picks.length > 0 && (
            <div className="mt-4 rounded-xl border border-cream-200 dark:border-amber-900/30 overflow-hidden">
              {picks.map((pick, i) => (
                <div
                  key={`${pick.id}-${i}`}
                  className="flex items-center gap-3 px-3 py-2.5 border-b border-cream-100 dark:border-amber-900/20 last:border-b-0 bg-cream-50 dark:bg-amber-900/10"
                >
                  {pick.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={pick.image}
                      alt={pick.name}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-black/5 dark:border-white/5"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-base flex-shrink-0 border border-black/5 dark:border-white/5">
                      🎁
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-brown-900 dark:text-amber-100 truncate">
                      {pick.name}
                      {pick.qty > 1 && (
                        <span className="text-brown-400 dark:text-amber-100/40 font-normal ml-1">
                          × {pick.qty}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-brown-500 dark:text-amber-100/60 mt-0.5">
                      {formatPrice(pick.price)}
                    </div>
                  </div>
                  <div className="text-xs font-bold text-brown-700 dark:text-amber-200 flex-shrink-0">
                    {formatPrice(pick.price * pick.qty)}
                  </div>
                </div>
              ))}
              {gs?.card.note && (
                <div className="px-4 py-3 bg-amber-50 dark:bg-[#201a14] border-t border-amber-100 dark:border-amber-900/40">
                  <div className="text-xs text-amber-800 dark:text-amber-200/80 italic font-serif leading-relaxed">
                    &ldquo;{gs.card.note}&rdquo;
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { cartItems, savedForLaterItems } = useStore();

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] pb-20 flex flex-col items-center justify-center pt-16">
        <div className="max-w-[1440px] mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest-900 dark:text-amber-50 mb-4">
            Your basket is empty
          </h1>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: 18,
              color: "var(--home-muted)",
              lineHeight: 1.65,
              maxWidth: 520,
            }}
            className="mx-auto mb-8"
          >
            Discover our handcrafted candles and artwork to fill it up.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 bg-coral-600 dark:bg-amber-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-coral-700 dark:hover:bg-amber-500 transition-all duration-200 shadow-lg shadow-coral-200 dark:shadow-amber-900/30 hover:-translate-y-0.5 text-sm"
          >
            Shop Now
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    );
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price ?? item.product.price) * item.quantity,
    0,
  );

  return (
    <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] pb-20">
      {/* Editorial Header */}
      <section className="relative overflow-hidden text-center p-12 border-b border-cream-200 dark:border-amber-900/20 bg-[var(--home-bg)] dark:bg-[#100e0a]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-500 uppercase tracking-[0.24em] mb-5">
            ✦ Ready for checkout ✦
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-forest-900 dark:text-amber-50 leading-tight mb-6">
            Your{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              <span
                className="dark:candle-text-glow"
                style={{
                  fontFamily: "var(--font-script)",
                  fontStyle: "normal",
                  color: "var(--home-coral)",
                  fontWeight: 700,
                  fontSize: "1.08em",
                }}
              >
                basket
              </span>
              <svg
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: -4,
                  width: "100%",
                  height: 12,
                  overflow: "visible",
                }}
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,6 C30,0 60,12 100,6 C140,0 170,12 200,6"
                  fill="none"
                  stroke="var(--home-coral)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: 18,
              color: "var(--home-muted)",
              lineHeight: 1.65,
              maxWidth: 520,
            }}
            className="mx-auto"
          >
            ({cartItems.reduce((s, i) => s + i.quantity, 0)} items) Handpicked
            and almost yours.
          </p>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12 grid lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#1a1830] rounded-2xl p-6 shadow-[0_4px_12px_rgba(28,18,9,0.05)] dark:shadow-none border border-cream-200 dark:border-amber-900/30">
            {cartItems.map((item) =>
              item.product.id.startsWith("giftset-") ? (
                <GiftSetCartItem key={item.product.id} item={item} />
              ) : (
                <CartItemComponent key={item.product.id} item={item} />
              ),
            )}
          </div>

          {/* Saved for later */}
          {savedForLaterItems.length > 0 && (
            <div className="mt-8">
              <h2 className="font-serif text-xl font-bold text-brown-900 dark:text-amber-50 mb-4">
                Saved for Later ({savedForLaterItems.length})
              </h2>
              <div className="bg-white dark:bg-[#1a1830] rounded-2xl p-6 shadow-[0_4px_12px_rgba(28,18,9,0.05)] dark:shadow-none border border-cream-200 dark:border-amber-900/30">
                {savedForLaterItems.map((item) => (
                  <CartItemComponent
                    key={item.product.id}
                    item={item}
                    isSaved
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div>
          <CartSummary subtotal={subtotal} />
        </div>
      </div>
    </main>
  );
}
