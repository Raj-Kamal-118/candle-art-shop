"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Gift,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShoppingCart,
  ArrowLeft,
  Bookmark,
  Trash2,
  MapPin,
  MessageCircle,
  Mail,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import CartItemComponent from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { formatPrice } from "@/lib/utils";
import { GS_BOXES, GS_RIBBONS } from "@/lib/stores/giftBuilderStore";
import { CartItem } from "@/lib/types";
import SecondaryHeader from "@/components/layout/SecondaryHeader";

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
              className="flex items-center gap-2 px-3 py-1.5"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 14,
                color: isHere ? "#362821" : "#8e6a4e",
              }}
            >
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
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
                  fontFamily: "var(--font-sans)",
                  fontSize: 11,
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

// ── Gift-set cart row ───────────────────────────────────────────
function GiftSetCartItem({
  item,
  index,
  onRemoved,
}: {
  item: CartItem;
  index: number;
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
  const rotate = index % 2 === 0 ? -2 : 2;

  return (
    <div className="craft-perf py-4 sm:py-6 pl-4 sm:pl-8 pr-4 sm:pr-6 border-b border-[rgba(122,80,40,0.18)] dark:border-amber-900/20 last:border-b-0 relative">
      <div className="flex items-start gap-3 sm:gap-6">
        {/* Polaroid gift box */}
        <div className="flex-shrink-0 self-start mt-1">
          <div
            className="craft-polaroid w-[84px] sm:w-[124px]"
            style={{ transform: `rotate(${rotate}deg)` }}
          >
            <div
              className="relative z-0 bg-gradient-to-br from-amber-100 to-coral-100 dark:from-amber-900/60 dark:to-coral-900/30 overflow-hidden w-[74px] h-[74px] sm:w-[114px] sm:h-[114px]"
            >
              <Image
                src="/images/misc/gift-box.png"
                alt="Gift Box"
                fill
                sizes="(max-width: 640px) 74px, 114px"
                className="object-contain scale-110 p-1 drop-shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div
                className="font-bold uppercase tracking-widest text-amber-700 dark:text-amber-500 mb-1"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                }}
              >
                {gs?.kind === "custom" ? "Custom Gift Set" : "Gift Set"}
              </div>
              <Link
                href="/custom/gift-set"
                className="font-bold leading-tight text-brown-900 dark:text-amber-50 hover:text-coral-600 dark:hover:text-amber-400 transition-colors"
                style={{ fontFamily: "var(--font-serif)", fontSize: 16 }}
              >
                {item.product.name}
              </Link>
              {gs?.card.recipient && (
                <p
                  className="mt-1 text-brown-500 dark:text-amber-100/50"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: 12,
                  }}
                >
                  For <span className="font-medium">{gs.card.recipient}</span>
                </p>
              )}

              {gs && (ribbonLabel || boxLabel) && (
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {boxLabel && (
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[rgba(122,80,40,0.07)] dark:bg-amber-900/20 text-brown-700 dark:text-amber-100/70 border border-[rgba(122,80,40,0.18)] dark:border-amber-900/30"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      📦 {boxLabel}
                    </span>
                  )}
                  {ribbonLabel && (
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[rgba(122,80,40,0.07)] dark:bg-amber-900/20 text-brown-700 dark:text-amber-100/70 border border-[rgba(122,80,40,0.18)] dark:border-amber-900/30"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      🎀 {ribbonLabel}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="text-right shrink-0">
              <div
                className="font-black text-brown-900 dark:text-amber-100 leading-none"
                style={{ fontFamily: "var(--font-serif)", fontSize: 20 }}
              >
                {formatPrice(price)}
              </div>
              {picks.length > 0 && (
                <div
                  className="text-brown-400 dark:text-amber-100/40 mt-1"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: 11,
                  }}
                >
                  {picks.reduce((s, p) => s + p.qty, 0)} items
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[rgba(122,80,40,0.12)] dark:border-amber-900/15">
            {picks.length > 0 ? (
              <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-1.5 text-sm font-medium text-amber-700 hover:text-amber-800 dark:text-amber-500 dark:hover:text-amber-400 transition-colors"
              >
                {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                <span className="hidden xs:inline">{open ? "Hide contents" : "View contents"}</span>
              </button>
            ) : (
              <div />
            )}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() =>
                  saveForLater(
                    item.product.id,
                    item.customizations,
                    item.giftSet,
                  )
                }
                className="flex items-center gap-1.5 text-sm font-medium text-brown-500 hover:text-coral-600 dark:text-amber-100/60 dark:hover:text-amber-400 transition-colors"
              >
                <Bookmark size={14} />
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
                className="flex items-center gap-1.5 text-sm font-medium text-brown-400 hover:text-red-500 dark:text-amber-100/50 dark:hover:text-red-400 transition-colors"
              >
                <Trash2 size={14} />
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded pick list */}
      {open && picks.length > 0 && (
        <div className="mt-5 ml-0 sm:ml-[116px] rounded-xl border border-[rgba(122,80,40,0.18)] dark:border-amber-900/30 overflow-hidden bg-cream-50 dark:bg-[#0f0e1c]">
          {picks.map((pick, i) => (
            <div
              key={`${pick.id}-${i}`}
              className="flex items-start sm:items-center gap-3 px-3 sm:px-4 py-3 border-b border-[rgba(122,80,40,0.10)] dark:border-amber-900/15 last:border-b-0"
            >
              {pick.image ? (
                <div className="relative w-10 h-10 mt-0.5 sm:mt-0 rounded-lg flex-shrink-0 border border-black/5 dark:border-white/5 overflow-hidden">
                  <Image
                    src={pick.image}
                    alt={pick.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 mt-0.5 sm:mt-0 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-lg flex-shrink-0">
                  🎁
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div
                  className="font-bold text-brown-900 dark:text-amber-100 leading-snug pr-2"
                  style={{ fontFamily: "var(--font-serif)", fontSize: 13 }}
                >
                  {pick.name}
                  {pick.qty > 1 && (
                    <span className="text-brown-400 dark:text-amber-100/50 font-medium ml-1.5">
                      × {pick.qty}
                    </span>
                  )}
                </div>
                {(pick as any).customization &&
                  Object.keys((pick as any).customization).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {Object.entries((pick as any).customization).map(
                        ([k, v]) => (
                          <span
                            key={k}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[rgba(122,80,40,0.07)] dark:bg-amber-900/20 text-brown-700 dark:text-amber-100/70 border border-[rgba(122,80,40,0.18)] dark:border-amber-900/30"
                            style={{ fontFamily: "var(--font-serif)" }}
                          >
                            <span className="opacity-60">{k}:</span>{" "}
                            <span
                              className="text-coral-700 dark:text-amber-400"
                              style={{ fontStyle: "italic" }}
                            >
                              {String(v)}
                            </span>
                          </span>
                        ),
                      )}
                    </div>
                  )}
                <div
                  className="text-brown-400 dark:text-amber-100/50 mt-0.5"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: 11,
                  }}
                >
                  {formatPrice(pick.price)}
                </div>
              </div>
              <div
                className="font-bold text-brown-900 dark:text-amber-100 shrink-0 mt-0.5 sm:mt-0"
                style={{ fontFamily: "var(--font-serif)", fontSize: 13 }}
              >
                {formatPrice(pick.price * pick.qty)}
              </div>
            </div>
          ))}
          {gs?.card.note && (
            <div className="px-5 py-4 bg-amber-50/80 dark:bg-[#1a1830] border-t border-amber-100 dark:border-amber-900/40">
              <div
                className="text-amber-900 dark:text-amber-200/90 leading-relaxed"
                style={{ fontFamily: "var(--font-hand)", fontSize: 18 }}
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

  // ── Empty state ──────────────────────────────────────────────
  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] flex flex-col items-center justify-center pb-20 pt-16">
        <div className="max-w-lg mx-auto px-6 py-20 text-center">
          <div className="text-7xl mb-6">🛒</div>
          <h1
            className="font-bold text-brown-900 dark:text-amber-50 mb-4 leading-tight"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(32px,5vw,48px)",
            }}
          >
            Your{" "}
            <span
              className="text-coral-600 dark:text-amber-400"
              style={{ fontFamily: "var(--font-script)" }}
            >
              basket
            </span>{" "}
            is empty
          </h1>
          <p
            className="text-brown-500 dark:text-amber-100/50 mb-10 leading-relaxed mx-auto max-w-xs"
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: 16,
            }}
          >
            Discover our handcrafted candles and artwork to fill it up.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-coral-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-coral-700 transition-all duration-200 shadow-lg shadow-coral-200/50 hover:-translate-y-0.5 text-sm w-full sm:w-auto"
            >
              Shop Now <ArrowRight size={16} />
            </Link>
            <Link
              href="/custom"
              className="inline-flex items-center justify-center gap-2 bg-white dark:bg-[#1a1830] text-brown-800 dark:text-amber-200 px-8 py-3.5 rounded-xl font-semibold hover:bg-cream-100 dark:hover:bg-amber-900/20 transition-all duration-200 shadow-md border border-cream-200 dark:border-amber-900/30 text-sm w-full sm:w-auto"
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
          <div className="craft-order-book overflow-hidden">
            {/* Pad head */}
            <div
              className="px-4 sm:px-8 py-4 sm:py-5 border-b border-dashed border-[rgba(122,80,40,0.22)] dark:border-amber-900/20 flex items-baseline justify-between gap-4 flex-wrap"
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
              <span
                className="text-brown-600 dark:text-amber-500 px-3 py-1.5 border border-dashed border-[rgba(122,80,40,0.35)] dark:border-amber-800/40 rounded-sm"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 11,
                  letterSpacing: "0.12em",
                }}
              >
                {totalQty} item{totalQty !== 1 ? "s" : ""}
              </span>
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
              className="px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between flex-wrap gap-4 border-t border-dashed border-[rgba(122,80,40,0.22)] dark:border-amber-900/20"
              style={{
                background:
                  "linear-gradient(0deg,rgba(245,236,218,0.5) 0%,transparent 100%)",
              }}
            >
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-brown-500 dark:text-amber-100/40 hover:text-coral-600 dark:hover:text-amber-400 transition-colors"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontSize: 14,
                }}
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
              <h2
                className="font-bold text-brown-900 dark:text-amber-50 mb-4"
                style={{ fontFamily: "var(--font-serif)", fontSize: 20 }}
              >
                <span
                  className="text-coral-600 dark:text-amber-400"
                  style={{ fontFamily: "var(--font-script)", fontSize: 26 }}
                >
                  Frequently
                </span>{" "}
                bought together
              </h2>
              <div className="craft-order-book p-4 sm:p-6 space-y-4">
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
                          <div
                            className="text-green-600 dark:text-green-400 mb-1 flex items-center gap-1.5"
                            style={{
                              fontFamily: "var(--font-sans)",
                              fontSize: 10,
                              fontWeight: 700,
                              letterSpacing: "0.14em",
                              textTransform: "uppercase",
                            }}
                          >
                            <Sparkles size={11} /> Free Gift Unlocked
                          </div>
                        )}
                        <Link href={`/products/${up.slug}`}>
                          <h4
                            className="font-bold text-brown-900 dark:text-amber-100 hover:text-coral-600 dark:hover:text-amber-400 transition-colors leading-tight"
                            style={{
                              fontFamily: "var(--font-serif)",
                              fontSize: 15,
                            }}
                          >
                            {up.name}
                          </h4>
                        </Link>
                        {up.upsellMessage && (
                          <p
                            className="text-brown-500 dark:text-amber-100/60 mt-1"
                            style={{
                              fontFamily: "var(--font-serif)",
                              fontStyle: "italic",
                              fontSize: 12,
                            }}
                          >
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
            <h2
              className="font-bold text-brown-900 dark:text-amber-50 mb-4"
              style={{ fontFamily: "var(--font-serif)", fontSize: 20 }}
            >
              <span
                className="text-coral-600 dark:text-amber-400"
                style={{ fontFamily: "var(--font-script)", fontSize: 24 }}
              >
                Saved
              </span>{" "}
              for later ({savedForLaterItems.length})
            </h2>

            {savedForLaterItems.length > 0 ? (
              <div className="craft-order-book">
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
                  className="text-brown-300 dark:text-amber-100/20 mb-1"
                  style={{ fontFamily: "var(--font-script)", fontSize: 36 }}
                >
                  nothing yet
                </div>
                <p
                  className="text-brown-400 dark:text-amber-100/40"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: 13,
                  }}
                >
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
                  href="https://wa.me/919519486785"
                  className="flex items-center gap-2 text-brown-600 dark:text-amber-100/60 hover:text-coral-600 dark:hover:text-amber-400 transition-colors group"
                >
                  <MessageCircle
                    size={15}
                    className="group-hover:scale-110 transition-transform"
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 13,
                      fontStyle: "italic",
                    }}
                  >
                    +91 95194 86785
                  </span>
                </a>
                <a
                  href="mailto:hi@artisanhouse.in"
                  className="flex items-center gap-2 text-brown-600 dark:text-amber-100/60 hover:text-coral-600 dark:hover:text-amber-400 transition-colors group"
                >
                  <Mail
                    size={15}
                    className="group-hover:scale-110 transition-transform"
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 13,
                      fontStyle: "italic",
                    }}
                  >
                    hi@artisanhouse.in
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
