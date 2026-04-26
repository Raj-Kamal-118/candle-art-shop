"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  ArrowRight,
  Gift,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Trash2,
  Bookmark,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import CartItemComponent from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { formatPrice } from "@/lib/utils";
import { GS_BOXES, GS_RIBBONS } from "@/lib/stores/giftBuilderStore";
import SecondaryHeader from "@/components/layout/SecondaryHeader";
import { CartItem } from "@/lib/types";

function GiftSetCartItem({
  item,
  onRemoved,
}: {
  item: CartItem;
  onRemoved?: (item: CartItem) => void;
}) {
  const [open, setOpen] = useState(false);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const saveForLater = useStore((s) => s.saveForLater);
  const price = item.price ?? item.product.price;
  const gs = item.giftSet;
  const picks = gs?.picks ?? [];
  const ribbonLabel =
    GS_RIBBONS.find((r) => r.id === gs?.ribbon)?.label ?? gs?.ribbon ?? "";
  const boxLabel =
    GS_BOXES.find((b) => b.id === gs?.box)?.label ?? gs?.box ?? "";

  return (
    <div className="py-6 border-b border-cream-200 dark:border-amber-900/20 last:border-b-0">
      <div className="flex items-start gap-4 sm:gap-6">
        {/* Gift box icon / cover image */}
        <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-amber-100 to-coral-100 dark:from-amber-900/60 dark:to-coral-900/30 flex items-center justify-center flex-shrink-0 border border-cream-200 dark:border-amber-900/30 overflow-hidden shadow-sm">
          <Image
            src="/images/misc/gift-box.png"
            alt="Gift Box"
            fill
            sizes="(max-width: 640px) 80px, 112px"
            className="object-contain scale-125 p-3 drop-shadow-md z-10"
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col h-full justify-between">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-500 mb-1.5">
                {gs?.kind === "custom" ? "Custom Gift Set" : "Gift Set"}
              </div>
              <Link
                href={`/custom/gift-set`}
                className="font-serif text-lg sm:text-xl font-bold text-brown-900 dark:text-amber-50 leading-tight hover:text-coral-600 transition-colors"
              >
                {item.product.name}
              </Link>
              {gs?.card.recipient && (
                <div className="text-sm text-brown-600 dark:text-amber-100/70 mt-1">
                  For{" "}
                  <span className="font-medium italic">
                    {gs.card.recipient}
                  </span>
                </div>
              )}

              {/* Wrap details pill row */}
              {gs && (ribbonLabel || boxLabel) && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {boxLabel && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-cream-100 dark:bg-amber-900/30 text-brown-700 dark:text-amber-100/80 border border-cream-200 dark:border-amber-900/40 shadow-sm">
                      📦 {boxLabel}
                    </span>
                  )}
                  {ribbonLabel && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-cream-100 dark:bg-amber-900/30 text-brown-700 dark:text-amber-100/80 border border-cream-200 dark:border-amber-900/40 shadow-sm">
                      🎀 {ribbonLabel}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="text-right shrink-0">
              <div className="font-bold text-lg text-brown-900 dark:text-amber-100">
                {formatPrice(price)}
              </div>
              {picks.length > 0 && (
                <div className="text-xs font-medium text-brown-500 dark:text-amber-100/50 mt-1">
                  {picks.reduce((s, p) => s + p.qty, 0)} items
                </div>
              )}
            </div>
          </div>

          {/* Actions Footer */}
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-cream-100 dark:border-amber-900/20">
            {picks.length > 0 ? (
              <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-800 dark:text-amber-500 dark:hover:text-amber-400 transition-colors"
              >
                {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {open ? "Hide contents" : "View contents"}
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-4 sm:gap-6">
              <button
                onClick={() =>
                  saveForLater(
                    item.product.id,
                    item.customizations,
                    item.giftSet,
                  )
                }
                className="group flex items-center gap-1.5 text-sm font-medium text-brown-500 hover:text-coral-600 dark:text-amber-100/60 dark:hover:text-amber-400 transition-all"
              >
                <Bookmark
                  size={18}
                  className="transition-transform group-hover:scale-110"
                />
                <span className="hidden sm:inline">Save for later</span>
              </button>
              <button
                onClick={() => {
                  removeFromCart(
                    item.product.id,
                    item.customizations,
                    item.giftSet,
                  );
                  onRemoved?.(item);
                }}
                className="group flex items-center justify-center p-2 text-brown-400 hover:text-red-600 dark:text-amber-100/40 dark:hover:text-red-400 transition-all hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                aria-label="Remove item"
                title="Remove from cart"
              >
                <Trash2
                  size={22}
                  className="transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-12"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded product list */}
      {open && picks.length > 0 && (
        <div className="mt-5 ml-0 sm:ml-[136px] rounded-2xl border border-cream-200 dark:border-amber-900/30 overflow-hidden bg-cream-50 dark:bg-[#0f0e1c] shadow-inner">
          {picks.map((pick, i) => (
            <div
              key={`${pick.id}-${i}`}
              className="flex items-center gap-3 px-4 py-3 border-b border-cream-100 dark:border-amber-900/20 last:border-b-0"
            >
              {pick.image ? (
                <div className="relative w-12 h-12 rounded-xl flex-shrink-0 border border-black/5 dark:border-white/5 overflow-hidden shadow-sm">
                  <Image
                    src={pick.image}
                    alt={pick.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-xl flex-shrink-0 border border-black/5 dark:border-white/5 shadow-sm">
                  🎁
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-brown-900 dark:text-amber-100 truncate">
                  {pick.name}
                  {pick.qty > 1 && (
                    <span className="text-brown-500 dark:text-amber-100/60 font-medium ml-1.5">
                      × {pick.qty}
                    </span>
                  )}
                </div>
                <div className="text-xs text-brown-500 dark:text-amber-100/60 mt-0.5">
                  {formatPrice(pick.price)}
                </div>
              </div>
              <div className="text-sm font-bold text-brown-900 dark:text-amber-100 flex-shrink-0">
                {formatPrice(pick.price * pick.qty)}
              </div>
            </div>
          ))}
          {gs?.card.note && (
            <div className="px-5 py-4 bg-amber-50/80 dark:bg-[#1a1830] border-t border-amber-100 dark:border-amber-900/40">
              <div
                className="text-xl text-amber-900 dark:text-amber-200/90 leading-relaxed"
                style={{ fontFamily: "var(--font-hand)" }}
              >
                &ldquo;{gs.card.note}&rdquo;
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CartPage() {
  const { cartItems, savedForLaterItems, addToCart } = useStore();
  const [upsellProducts, setUpsellProducts] = useState<any[]>([]);
  const [upsellInputs, setUpsellInputs] = useState<Record<string, string>>({});
  const [recentlyRemoved, setRecentlyRemoved] = useState<CartItem | null>(null);

  useEffect(() => {
    if (recentlyRemoved) {
      const timer = setTimeout(() => setRecentlyRemoved(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [recentlyRemoved]);

  const handleUndo = () => {
    if (recentlyRemoved) {
      addToCart(
        recentlyRemoved.product,
        recentlyRemoved.quantity,
        recentlyRemoved.customizations,
        recentlyRemoved.giftSet,
      );
      setRecentlyRemoved(null);
    }
  };

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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-coral-600 dark:bg-amber-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-coral-700 dark:hover:bg-amber-500 transition-all duration-200 shadow-lg shadow-coral-200 dark:shadow-amber-900/30 hover:-translate-y-0.5 text-sm w-full sm:w-auto"
            >
              Shop Now
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/custom"
              className="inline-flex items-center justify-center gap-2 bg-white dark:bg-[#1a1830] dark:border dark:border-amber-700/30 text-forest-800 dark:text-amber-200 px-8 py-3.5 rounded-xl font-semibold hover:bg-cream-100 dark:hover:bg-amber-900/20 transition-all duration-200 shadow-md hover:shadow-lg border border-cream-200 text-sm w-full sm:w-auto"
            >
              Explore Bespoke Creations
            </Link>
          </div>
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
                  onRemoved={(removedItem) => setRecentlyRemoved(removedItem)}
                />
              ) : (
                <CartItemComponent
                  key={`${item.product.id}-${index}`}
                  item={item}
                  onRemoved={(removedItem) => setRecentlyRemoved(removedItem)}
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
                      <Link href={`/products/${up.slug}`}>
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-cream-100 dark:bg-[#0f0e1c] border border-cream-200 dark:border-amber-900/30 shrink-0 shadow-sm">
                          {up.images?.[0] ? (
                            <Image
                              src={up.images[0]}
                              alt={up.name}
                              fill
                              sizes="(max-width: 640px) 96px, 128px"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl">
                              🎁
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="flex-1 min-w-0 flex flex-col">
                        {isFree && (
                          <div className="text-[11px] font-bold uppercase tracking-widest text-green-600 dark:text-green-400 mb-1.5 flex items-center gap-1.5">
                            <Sparkles size={12} />
                            Free Gift Unlocked
                          </div>
                        )}
                        <Link href={`/products/${up.slug}`}>
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
          <div className="mt-8">
            <h2 className="font-serif text-xl font-bold text-brown-900 dark:text-amber-50 mb-4">
              Saved for Later ({savedForLaterItems.length})
            </h2>
            {savedForLaterItems.length > 0 ? (
              <div className="bg-white dark:bg-[#1a1830] rounded-2xl p-6 shadow-[0_4px_12px_rgba(28,18,9,0.05)] dark:shadow-none border border-cream-200 dark:border-amber-900/30">
                {savedForLaterItems.map((item, index) => (
                  <CartItemComponent
                    key={`${item.product.id}-${index}`}
                    item={item}
                    isSaved
                  />
                ))}
              </div>
            ) : (
              <div className="bg-cream-50 dark:bg-[#1a1830]/50 rounded-2xl p-8 border border-dashed border-cream-300 dark:border-amber-900/30 flex flex-col items-center justify-center text-center">
                <Bookmark
                  size={32}
                  className="text-brown-300 dark:text-amber-100/30 mb-3"
                />
                <h3 className="text-sm font-semibold text-brown-700 dark:text-amber-100/70 mb-1">
                  No items saved
                </h3>
                <p className="text-sm text-brown-500 dark:text-amber-100/50">
                  Tap the save icon on any cart item to move it here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div>
          <CartSummary subtotal={subtotal} />
        </div>
      </div>

      {/* Undo Toast Notification */}
      <AnimatePresence>
        {recentlyRemoved && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-forest-900 dark:bg-amber-100 text-white dark:text-brown-900 px-5 py-3 rounded-full shadow-2xl flex items-center gap-4"
          >
            <span className="text-sm font-medium">Item removed from cart</span>
            <div className="w-px h-4 bg-forest-700 dark:bg-amber-200" />
            <button
              onClick={handleUndo}
              className="text-amber-400 dark:text-amber-700 font-bold text-sm uppercase tracking-wider hover:text-amber-300 dark:hover:text-amber-600 transition-colors"
            >
              Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
