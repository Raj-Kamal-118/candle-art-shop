"use client";

import Link from "next/link";
import {
  ShoppingCart,
  ArrowRight,
  Gift,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import CartItemComponent from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { formatPrice } from "@/lib/utils";
import { GS_BOXES, GS_RIBBONS } from "@/lib/stores/giftBuilderStore";
import SecondaryHeader from "@/components/layout/SecondaryHeader";

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
              onClick={() =>
                removeFromCart(
                  item.product.id,
                  item.customizations,
                  item.giftSet,
                )
              }
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
  const { cartItems, savedForLaterItems, addToCart } = useStore();
  const [upsellProducts, setUpsellProducts] = useState<any[]>([]);
  const [upsellInputs, setUpsellInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setUpsellProducts(data.filter((p: any) => p.isUpsell)))
      .catch(console.error);
  }, []);

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

  const eligibleUpsells = upsellProducts.filter((up) => {
    // Hide if it's already in the cart
    if (cartItems.some((item) => item.product.id === up.id)) return false;

    const rules = up.upsellRules || {};
    if (rules.always) return true;
    if (rules.minCartValue && subtotal >= rules.minCartValue) return true;
    if (
      rules.categoryId &&
      cartItems.some((i) => i.product.categoryId === rules.categoryId)
    )
      return true;

    return false;
  });

  return (
    <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] pb-20">
      {/* Editorial Header */}
      <SecondaryHeader
        eyebrow="✦ Ready for checkout ✦"
        titlePrefix="Your"
        titleHighlighted="basket"
        description={`(${cartItems.reduce((s, i) => s + i.quantity, 0)} items) Handpicked and almost yours.`}
        backgroundImage="/images/misc/checkout.png"
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12 grid lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#1a1830] rounded-2xl p-6 shadow-[0_4px_12px_rgba(28,18,9,0.05)] dark:shadow-none border border-cream-200 dark:border-amber-900/30">
            {cartItems.map((item, index) =>
              item.product.id.startsWith("giftset-") ? (
                <GiftSetCartItem
                  key={`${item.product.id}-${index}`}
                  item={item}
                />
              ) : (
                <CartItemComponent
                  key={`${item.product.id}-${index}`}
                  item={item}
                />
              ),
            )}
          </div>

          {/* Upsell Section */}
          {eligibleUpsells.length > 0 && (
            <div className="mt-8 bg-white dark:bg-[#1a1830] rounded-2xl p-6 shadow-[0_4px_12px_rgba(28,18,9,0.05)] border border-cream-200 dark:border-amber-900/30">
              <h3 className="font-serif text-lg font-bold text-brown-900 dark:text-amber-100 mb-4 flex items-center gap-2">
                <Sparkles
                  size={16}
                  className="text-amber-600 dark:text-amber-400"
                />
                Frequently bought together
              </h3>
              <div className="space-y-4">
                {eligibleUpsells.map((up) => {
                  const rules = up.upsellRules || {};
                  const isFree = Boolean(
                    rules.freeAtCartValue && subtotal >= rules.freeAtCartValue,
                  );
                  const priceToDisplay = isFree ? 0 : up.price;

                  return (
                    <div
                      key={up.id}
                      className={`flex gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl border shadow-sm transition-all duration-300 ${
                        isFree
                          ? "border-green-300 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10 shadow-[0_0_15px_rgba(74,222,128,0.15)]"
                          : "border-cream-200 dark:border-amber-900/30 bg-cream-50 dark:bg-[#151326]"
                      }`}
                    >
                      <Link href={`/products/${up.id}`}>
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-cream-100 dark:bg-[#0f0e1c] border border-cream-200 dark:border-amber-900/30 shrink-0 shadow-sm">
                          <img
                            src={up.images[0]}
                            alt={up.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </Link>

                      <div className="flex-1 min-w-0 flex flex-col">
                        {isFree && (
                          <div className="text-[11px] font-bold uppercase tracking-widest text-green-600 dark:text-green-400 mb-1.5 flex items-center gap-1.5">
                            <Sparkles size={12} />
                            Free Gift Unlocked
                          </div>
                        )}
                        <Link href={`/products/${up.id}`}>
                          <h4 className="font-serif text-lg font-bold text-brown-900 dark:text-amber-100 leading-tight hover:text-coral-600 dark:hover:text-amber-400 transition-colors">
                            {up.name}
                          </h4>
                        </Link>

                        {up.upsellMessage && (
                          <p className="text-xs sm:text-sm text-brown-600 dark:text-amber-100/70 mt-1">
                            {up.upsellMessage}
                          </p>
                        )}
                        <div className="mt-1.5 font-semibold text-coral-600 dark:text-amber-400 text-sm flex items-center gap-2">
                          {isFree ? "FREE" : formatPrice(priceToDisplay)}
                          {isFree && up.price > 0 && (
                            <span className="line-through text-xs font-medium text-brown-400 dark:text-amber-100/40">
                              {formatPrice(up.price)}
                            </span>
                          )}
                        </div>

                        {rules.needsTextInput && (
                          <input
                            type="text"
                            placeholder={
                              rules.textInputLabel || "Enter message..."
                            }
                            value={upsellInputs[up.id] || ""}
                            onChange={(e) =>
                              setUpsellInputs({
                                ...upsellInputs,
                                [up.id]: e.target.value,
                              })
                            }
                            className="mt-3 w-full px-3 py-2 text-sm border border-brown-300 dark:border-amber-900/40 rounded-xl bg-white dark:bg-[#1a1830] text-brown-900 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                          />
                        )}

                        <div className="mt-4 sm:mt-auto pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              const productToAdd = isFree
                                ? { ...up, price: 0 }
                                : up;
                              const customizations =
                                rules.needsTextInput && upsellInputs[up.id]
                                  ? {
                                      [rules.textInputLabel || "Message"]:
                                        upsellInputs[up.id],
                                    }
                                  : {};
                              addToCart(productToAdd as any, 1, customizations);
                              setUpsellInputs({ ...upsellInputs, [up.id]: "" });
                            }}
                            className={`text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 w-full sm:w-auto shadow-lg ${
                              isFree
                                ? "bg-green-600 hover:bg-green-700 text-white shadow-green-200 dark:shadow-green-900/20"
                                : "bg-coral-600 dark:bg-amber-600 text-white hover:bg-coral-700 dark:hover:bg-amber-500 shadow-coral-200 dark:shadow-amber-900/30"
                            }`}
                          >
                            {isFree ? (
                              <>
                                <Gift size={16} /> Claim Free Gift
                              </>
                            ) : (
                              <>
                                <ShoppingCart size={16} /> Add to Cart
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Saved for later */}
          {savedForLaterItems.length > 0 && (
            <div className="mt-8">
              <h2 className="font-serif text-xl font-bold text-brown-900 dark:text-amber-50 mb-4">
                Saved for Later ({savedForLaterItems.length})
              </h2>
              <div className="bg-white dark:bg-[#1a1830] rounded-2xl p-6 shadow-[0_4px_12px_rgba(28,18,9,0.05)] dark:shadow-none border border-cream-200 dark:border-amber-900/30">
                {savedForLaterItems.map((item, index) => (
                  <CartItemComponent
                    key={`${item.product.id}-${index}`}
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
