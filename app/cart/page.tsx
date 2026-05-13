"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Gift,
  Sparkles,
  ShoppingCart,
  ArrowLeft,
  MapPin,
  MessageCircle,
  Mail,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import CartItemComponent from "@/components/cart/CartItem";
import GiftSetCartItem from "@/components/cart/GiftSetCartItem";
import CartSummary from "@/components/cart/CartSummary";
import { formatPrice } from "@/lib/utils";
import { CartItem } from "@/lib/types";
import SecondaryHeader from "@/components/layout/SecondaryHeader";
import { SITE_CONFIG } from "@/lib/config";
import Button from "@/components/ui/Button";

// ── Step indicator ──────────────────────────────────────────────
function CheckoutSteps({
  current,
}: {
  current: "basket" | "address" | "done";
}) {
  const steps = [
    { id: "basket", label: "Basket", num: "1" },
    { id: "address", label: "Address & pay", num: "2" },
    { id: "done", label: "Done", num: "3" },
  ];
  return (
    <div className="flex items-center justify-center gap-0 mt-8">
      {steps.map((s, i) => {
        const isHere = s.id === current;
        const isDone = steps.findIndex((x) => x.id === current) > i;
        return (
          <div key={s.id} className="flex items-center">
            <div
              className={`font-serif flex items-center gap-2 px-3 py-1.5 text-[14px] ${
                isHere
                  ? "text-[#362821] dark:text-amber-50"
                  : "text-[#8e6a4e] dark:text-amber-100/40"
              }`}
            >
              <span
                className="font-sans text-[11px] w-6 h-6 rounded-full flex items-center justify-center font-bold"
                style={{
                  background: isDone
                    ? "#3d8a72"
                    : isHere
                      ? "#e85d4a"
                      : "rgba(122,80,40,0.12)",
                  color: isHere || isDone ? "#fff" : "#8e6a4e",
                  boxShadow: isHere
                    ? "0 0 0 4px rgba(232,93,74,0.18)"
                    : undefined,
                }}
              >
                {isDone ? "✓" : s.num}
              </span>
              <span
                className={
                  isHere
                    ? "font-bold text-brown-900 dark:text-amber-50"
                    : "dark:text-amber-100/40"
                }
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span
                style={{
                  width: 40,
                  height: 1,
                  borderBottom: "1px dashed rgba(122,80,40,0.3)",
                  display: "block",
                  margin: "0 2px",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────
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

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setUpsellProducts(data.filter((p: any) => p.isUpsell)))
      .catch(console.error);
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price ?? item.product.price) * item.quantity,
    0,
  );

  // ── Empty state ──────────────────────────────────────────────
  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] flex flex-col items-center justify-center pb-20 pt-16">
        <div className="max-w-lg mx-auto px-6 py-20 text-center">
          <div className="text-7xl mb-6">🛒</div>
          <h1 className="ah-display-lg leading-tight mb-4">
            Your{" "}
            <span
              className="text-coral-600 dark:text-amber-400 text-2xl"
              style={{ fontFamily: "var(--font-script)" }}
            >
              basket
            </span>{" "}
            is empty
          </h1>
          <p className="font-serif italic text-[16px] text-brown-500 dark:text-amber-100/50 mb-10 leading-relaxed mx-auto max-w-xs">
            Discover our handcrafted candles and artwork to fill it up.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products">
              <Button variant="primary" className="w-full sm:w-auto">
                Shop Now <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/custom">
              <Button variant="secondary" className="w-full sm:w-auto">
                Explore Bespoke Creations
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const totalQty = cartItems.reduce((s, i) => s + i.quantity, 0);

  const eligibleUpsells = upsellProducts.filter((up) => {
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

  const qtyWord = [
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
  ];

  return (
    <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] pb-24">
      {/* ── Crafty page hero ── */}
      <SecondaryHeader
        eyebrow="✦ Ready for checkout ✦"
        titlePrefix="Your"
        titleHighlighted="basket"
        description={`(${cartItems.reduce((s, i) => s + i.quantity, 0)} items) Handpicked and almost yours.`}
        backgroundImage="/images/misc/checkout.png"
      />

      {/* ── Main grid ── */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 py-6 sm:py-10 grid lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
        {/* Left: order book */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          {/* Order book */}
          <div className="craft-order-book craft-perf overflow-hidden relative border-r-[3px] border-dotted border-[rgba(122,80,40,0.25)] dark:border-amber-900/40">
            {/* Pad head */}
            <div
              className="px-4 sm:px-8 py-4 sm:py-5  dark:border-amber-900/20 flex items-baseline justify-between gap-4 flex-wrap"
              style={{
                background:
                  "linear-gradient(180deg,rgba(245,236,218,0.7) 0%,transparent 100%)",
              }}
            >
              <div>
                <h2
                  className="font-bold text-brown-900 dark:text-amber-50"
                  style={{ fontFamily: "var(--font-serif)", fontSize: 20 }}
                >
                  <span
                    className="text-coral-600 dark:text-amber-400"
                    style={{ fontFamily: "var(--font-script)", fontSize: 26 }}
                  >
                    {qtyWord[totalQty - 1] ?? totalQty}
                  </span>{" "}
                  {totalQty === 1 ? "thing" : "things"}, hand-picked
                </h2>
                <p
                  className="text-brown-400 dark:text-amber-100/40 mt-0.5"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: 13,
                  }}
                >
                  we'll wrap them carefully before they leave the studio
                </p>
              </div>
            </div>

            {/* Line items */}
            <div>
              {cartItems.map((item, index) =>
                item.product.id.startsWith("giftset-") ? (
                  <GiftSetCartItem
                    key={`${item.product.id}-${index}`}
                    item={item}
                    index={index}
                    onRemoved={(removedItem) => setRecentlyRemoved(removedItem)}
                  />
                ) : (
                  <CartItemComponent
                    key={`${item.product.id}-${index}`}
                    item={item}
                    index={index}
                    onRemoved={(removedItem) => setRecentlyRemoved(removedItem)}
                  />
                ),
              )}
            </div>

            {/* Pad foot */}
            <div
              className="px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between flex-wrap gap-4  border-[rgba(122,80,40,0.22)] dark:border-amber-900/20"
              style={{
                background:
                  "linear-gradient(0deg,rgba(245,236,218,0.5) 0%,transparent 100%)",
              }}
            >
              <Link
                href="/products"
                className="inline-flex items-center gap-2 font-serif italic text-[14px] text-brown-500 dark:text-amber-100/40 hover:text-coral-600 dark:hover:text-amber-400 transition-colors"
              >
                <ArrowLeft size={13} />
                keep looking around the shop
              </Link>
              <div className="text-right">
                <div
                  className="text-brown-400 dark:text-amber-100/40"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: 12,
                  }}
                >
                  subtotal · {totalQty} {totalQty === 1 ? "thing" : "things"}
                </div>
                <div
                  className="font-black text-brown-900 dark:text-amber-50"
                  style={{ fontFamily: "var(--font-serif)", fontSize: 22 }}
                >
                  {formatPrice(subtotal)}
                </div>
              </div>
            </div>
          </div>

          {/* Upsell */}
          {eligibleUpsells.length > 0 && (
            <div>
              <h2 className="ah-display-md text-xl mb-4">
                <span
                  className="text-coral-600 dark:text-amber-400 text-2xl"
                  style={{ fontFamily: "var(--font-script)" }}
                >
                  Frequently
                </span>{" "}
                bought together
              </h2>
              <div className="craft-order-book craft-perf p-4 sm:p-6 space-y-4">
                {eligibleUpsells.map((up) => {
                  const rules = up.upsellRules || {};
                  const isFree = Boolean(
                    rules.freeAtCartValue && subtotal >= rules.freeAtCartValue,
                  );
                  const priceToDisplay = isFree ? 0 : up.price;

                  return (
                    <div
                      key={up.id}
                      className={`flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all duration-300 ${
                        isFree
                          ? "border-green-300 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10"
                          : "border-[rgba(122,80,40,0.18)] dark:border-amber-900/30 bg-white dark:bg-[#151326]"
                      }`}
                    >
                      <Link href={`/products/${up.slug}`} className="shrink-0">
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden border border-[rgba(122,80,40,0.15)] dark:border-amber-900/30">
                          {up.images?.[0] ? (
                            <Image
                              src={up.images[0]}
                              alt={up.name}
                              fill
                              sizes="(max-width: 640px) 96px, 128px"
                              className="object-cover hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl bg-cream-100 dark:bg-amber-900/30">
                              🎁
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="flex-1 min-w-0">
                        {isFree && (
                          <div className="ah-eyebrow text-green-600 dark:text-green-400 mb-1 flex items-center gap-1.5 text-[10px]">
                            <Sparkles size={11} /> Free Gift Unlocked
                          </div>
                        )}
                        <Link href={`/products/${up.slug}`}>
                          <h4 className="ah-body font-serif font-bold text-[15px] hover:text-coral-600 dark:hover:text-amber-400 transition-colors leading-tight">
                            {up.name}
                          </h4>
                        </Link>
                        {up.upsellMessage && (
                          <p className="font-serif italic text-[12px] mt-1 text-brown-500 dark:text-amber-100/60">
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
                            className="mt-2 w-full px-3 py-2 text-sm border border-[rgba(122,80,40,0.3)] dark:border-amber-900/40 rounded-xl bg-white dark:bg-[#1a1830] text-brown-900 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                          />
                        )}

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
                          className={`mt-3 text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 hover:-translate-y-0.5 shadow-md ${
                            isFree
                              ? "bg-green-600 hover:bg-green-700 text-white shadow-green-200"
                              : "bg-coral-600 hover:bg-coral-700 text-white shadow-coral-200/50"
                          }`}
                        >
                          {isFree ? (
                            <>
                              <Gift size={14} /> Claim Free Gift
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={14} /> Add to Cart
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Saved for later */}
          <div>
            <h2 className="ah-display-md text-xl mb-4">
              <span
                className="text-coral-600 dark:text-amber-400 text-2xl"
                style={{ fontFamily: "var(--font-script)" }}
              >
                Saved
              </span>{" "}
              for later ({savedForLaterItems.length})
            </h2>

            {savedForLaterItems.length > 0 ? (
              <div className="craft-order-book craft-perf relative border-r-[3px] border-dotted border-[rgba(122,80,40,0.25)] dark:border-amber-900/40">
                {savedForLaterItems.map((item, index) => (
                  <CartItemComponent
                    key={`${item.product.id}-${index}`}
                    item={item}
                    index={index}
                    isSaved
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl p-8 border border-dashed border-[rgba(122,80,40,0.22)] dark:border-amber-900/20 flex flex-col items-center justify-center text-center bg-white dark:bg-[#1a1830]">
                <div
                  className="text-[36px] text-brown-300 dark:text-amber-100/20 mb-1 leading-none"
                  style={{ fontFamily: "var(--font-script)" }}
                >
                  nothing yet
                </div>
                <p className="font-serif italic text-[13px] text-brown-400 dark:text-amber-100/40">
                  tap "save for later" on any item to keep it here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: sticky summary */}
        <div className="lg:sticky lg:top-6 h-fit space-y-4">
          {/* Varanasi Local Notice */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4 shadow-sm flex items-start gap-3">
            <MapPin
              size={18}
              className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
            />
            <p className="text-[13px] text-amber-900 dark:text-amber-100 leading-relaxed font-serif">
              <strong className="font-bold">Local to Varanasi?</strong> Free
              &amp; same-day delivery applies automatically at checkout!
            </p>
          </div>

          <CartSummary subtotal={subtotal} />

          {/* Crafty Contact Note */}
          <div className="relative mt-8">
            <div className="bg-white dark:bg-[#1c1710] border border-[rgba(122,80,40,0.15)] dark:border-amber-900/30 rounded-xl p-5 shadow-sm">
              <p
                className="text-brown-900 dark:text-amber-100 mb-3"
                style={{ fontFamily: "var(--font-hand)", fontSize: 20 }}
              >
                questions about your order?
              </p>
              <div className="space-y-2">
                <a
                  href={SITE_CONFIG.contact.whatsappUrl}
                  className="flex items-center gap-2 text-brown-600 dark:text-amber-100/60 hover:text-coral-600 dark:hover:text-amber-400 transition-colors group"
                >
                  <MessageCircle
                    size={15}
                    className="group-hover:scale-110 transition-transform"
                  />
                  <span className="font-serif italic text-[13px] text-brown-600 dark:text-amber-100/60">
                    {SITE_CONFIG.contact.phone}
                  </span>
                </a>
                <a
                  href={`mailto:${SITE_CONFIG.contact.email}`}
                  className="flex items-center gap-2 text-brown-600 dark:text-amber-100/60 hover:text-coral-600 dark:hover:text-amber-400 transition-colors group"
                >
                  <Mail
                    size={15}
                    className="group-hover:scale-110 transition-transform"
                  />
                  <span className="font-serif italic text-[13px] text-brown-600 dark:text-amber-100/60">
                    {SITE_CONFIG.contact.email}
                  </span>
                </a>
              </div>
              <p
                className="text-brown-400 dark:text-amber-100/40 mt-3 pt-3 border-t border-dashed border-[rgba(122,80,40,0.15)] dark:border-amber-900/30"
                style={{ fontFamily: "var(--font-hand)", fontSize: 16 }}
              >
                we read every one.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Undo toast */}
      <AnimatePresence>
        {recentlyRemoved && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-forest-900 dark:bg-amber-100 text-white dark:text-brown-900 px-5 py-3 rounded-full shadow-2xl flex items-center gap-4"
          >
            <span
              className="text-sm font-medium"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Item removed from cart
            </span>
            <div className="w-px h-4 bg-forest-700 dark:bg-amber-200" />
            <button
              onClick={() => {
                if (recentlyRemoved) {
                  addToCart(
                    recentlyRemoved.product,
                    recentlyRemoved.quantity,
                    recentlyRemoved.customizations,
                    recentlyRemoved.giftSet,
                  );
                  setRecentlyRemoved(null);
                }
              }}
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
