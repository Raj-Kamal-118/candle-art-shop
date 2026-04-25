"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Sparkles,
  Share2,
  Heart,
  ArrowRight,
  Package,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CartGiftSet, Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useGiftBuilderStore, GS_CARDS } from "@/lib/stores/giftBuilderStore";
import { useStore } from "@/lib/store";
import SecondaryHeader from "@/components/layout/SecondaryHeader";
import Button from "@/components/ui/Button";

export default function ReviewPage() {
  const router = useRouter();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [wrapping, setWrapping] = useState(false);
  const [wrapped, setWrapped] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { picks, ribbon, box, recipient, note, cardStyle, reset } =
    useGiftBuilderStore();
  const addToCart = useStore((s) => s.addToCart);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setAllProducts);
  }, []);

  const resolvedProducts = picks.flatMap((p) =>
    Array(p.qty)
      .fill(allProducts.find((pr) => pr.id === p.id))
      .filter(Boolean),
  ) as Product[];

  const subtotal = picks.reduce((total, p) => {
    const product = allProducts.find((pr) => pr.id === p.id);
    return total + (product ? product.price * p.qty : 0);
  }, 0);

  const card = GS_CARDS.find((c) => c.id === cardStyle) ?? GS_CARDS[0];

  const doWrap = () => {
    setWrapping(true);
    setTimeout(() => setWrapped(true), 1500);
  };

  const handlePlaceOrder = () => {
    const setId = `custom-${Date.now()}`;
    const giftSetData: CartGiftSet = {
      kind: "custom",
      setId,
      picks: picks.map((p) => {
        const product = allProducts.find((pr) => pr.id === p.id);
        return {
          id: p.id,
          qty: p.qty,
          name: product?.name ?? p.id,
          image: product?.images?.[0] ?? "",
          price: product?.price ?? 0,
        };
      }),
      ribbon,
      box,
      card: { style: cardStyle, recipient, note },
    };

    const syntheticProduct = {
      id: `giftset-${setId}`,
      name: recipient ? `Gift set for ${recipient}` : "Your Custom Gift Set",
      slug: `custom-gift-set-${setId}`,
      description: note || "Custom gift set",
      price: subtotal,
      categoryId: "",
      images: [],
      tags: ["gift-set", "custom"],
      inStock: true,
      stockCount: 999,
      featured: false,
      customizable: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addToCart(syntheticProduct, 1, undefined, giftSetData);
    reset();
    router.push("/cart");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `https://artisanhouse.in/gift/preview/ah-${Math.random().toString(36).slice(2, 8)}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (picks.length === 0) {
    return (
      <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mb-6">
          <Package size={32} />
        </div>
        <h2 className="font-serif text-3xl font-bold text-brown-900 dark:text-amber-100 mb-3">
          Your box is empty
        </h2>
        <p className="text-brown-500 dark:text-amber-100/60 mb-8 max-w-md text-center">
          It looks like you haven't selected any items for your custom gift set
          yet.
        </p>
        <Button
          onClick={() => router.push("/custom/gift-set")}
          className="bg-coral-600 hover:bg-coral-700 text-white shadow-lg shadow-coral-200 dark:shadow-amber-900/30 hover:-translate-y-0.5 transition-all"
          size="lg"
        >
          Start Building <ArrowRight size={18} className="ml-2" />
        </Button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] pb-20">
      <SecondaryHeader
        eyebrow="✦ Almost Yours ✦"
        titlePrefix="Let's get this"
        titleHighlighted="wrapped"
        titleSuffix="."
        description="Review your selected items and the handwritten note before we tie it all together."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <button
          onClick={() => router.push("/custom/gift-set")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brown-500 hover:text-coral-600 dark:text-amber-100/60 dark:hover:text-amber-400 transition-colors"
        >
          <ChevronLeft size={16} /> Keep editing
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* LEFT: Visuals & Actions */}
          <div className="lg:col-span-6 flex flex-col items-center text-center lg:sticky lg:top-28">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-3">
                {wrapped
                  ? "Ready for gifting"
                  : wrapping
                    ? "Wrapping..."
                    : "Your Selection"}
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brown-900 dark:text-amber-100 mb-8 leading-tight">
                {wrapped ? (
                  "All tied up with love."
                ) : wrapping ? (
                  <span className="italic text-coral-600 dark:text-amber-400">
                    Hold still...
                  </span>
                ) : (
                  "Beautiful. Shall we wrap it?"
                )}
              </h1>
            </div>

            <div className="relative w-full min-h-[400px] flex items-center justify-center mb-10">
              <AnimatePresence mode="wait">
                {!wrapping && !wrapped ? (
                  <motion.div
                    key="polaroids"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                    transition={{ duration: 0.5 }}
                    className="w-full flex flex-col items-center"
                  >
                    <PickedItemsPhotoStack items={resolvedProducts} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="gift-box"
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      bounce: 0.4,
                      duration: 1.2,
                      delay: 0.2,
                    }}
                    className="relative w-full max-w-sm aspect-square rounded-3xl shadow-2xl border-4 border-white dark:border-[#1a1830] overflow-hidden bg-gradient-to-br from-amber-100 to-coral-100 dark:from-amber-900/60 dark:to-coral-900/30"
                  >
                    {/* Confetti looping inside the box background */}
                    {wrapped && <LoopingConfetti />}

                    <Image
                      src="/images/misc/gift-box.png"
                      alt="Gift Box"
                      fill
                      className="object-contain p-6 scale-150 drop-shadow-2xl dark:drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)] z-10"
                    />
                    <div className="absolute inset-0 shadow-inner z-10 pointer-events-none" />

                    {/* Hanging Gift Tag */}
                    {recipient && (
                      <motion.div
                        initial={{ opacity: 0, rotate: 20, x: -20 }}
                        animate={{ opacity: 1, rotate: -6, x: 0 }}
                        transition={{ type: "spring", bounce: 0.6, delay: 1 }}
                        className="absolute top-[55%] left-[12%] sm:left-[22%] bg-[#fdfcf9] text-[#5c3d1e] px-6 py-4 rounded-xl shadow-xl border border-[#e8dfc8] origin-top-left z-20"
                      >
                        {/* Tag Hole & String */}
                        <div className="absolute -top-2 left-6 w-3 h-3 rounded-full bg-[#3d2616] shadow-inner" />
                        <div className="absolute -top-16 left-7 w-0.5 h-16 bg-amber-700/60 rotate-[15deg] origin-bottom" />

                        <p className="text-[10px] uppercase tracking-widest text-[#b45309] mb-1 font-sans font-bold">
                          For
                        </p>
                        <p className="text-2xl font-bold font-serif italic max-w-[150px] truncate">
                          {recipient}
                        </p>
                      </motion.div>
                    )}

                    {/* Sparkles during wrap */}
                    {wrapping && !wrapped && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1.5] }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="absolute inset-0 flex items-center justify-center text-5xl z-20 pointer-events-none"
                      >
                        ✨
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Left Col Actions */}
            {!wrapping && !wrapped && (
              <Button
                onClick={doWrap}
                size="lg"
                className="w-full sm:w-auto min-w-[240px] flex justify-center bg-coral-600 hover:bg-coral-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white shadow-lg shadow-coral-200 dark:shadow-amber-900/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                Wrap my box <Sparkles size={18} className="ml-2" />
              </Button>
            )}

            {wrapped && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center w-full"
              >
                <Button
                  onClick={handlePlaceOrder}
                  size="lg"
                  className="w-full sm:w-auto bg-coral-600 hover:bg-coral-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white shadow-lg shadow-coral-200 dark:shadow-amber-900/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <CheckCircle size={18} className="mr-2" />
                  Place order — {formatPrice(subtotal)}
                </Button>
                <Button
                  onClick={() => setShareOpen(true)}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-2 border-brown-300 dark:border-amber-900/30 text-brown-900 dark:text-amber-100 hover:border-amber-400 dark:hover:border-amber-500"
                >
                  <Share2 size={18} className="mr-2" /> Share preview
                </Button>
              </motion.div>
            )}
          </div>

          {/* RIGHT: Summary Details */}
          <div className="lg:col-span-6 space-y-8">
            {/* Gift card preview */}
            <div
              className="relative rounded-2xl mb-6"
              style={{
                background: card.swatch,
                padding: "32px",
                boxShadow: "0 12px 32px rgba(45,31,20,.12)",
                minHeight: 200,
              }}
            >
              <div
                className="absolute top-4 right-4 text-[10px] uppercase tracking-widest opacity-60 font-bold"
                style={{ letterSpacing: ".25em", color: card.stroke }}
              >
                {card.label} card
              </div>
              <div
                className="text-xs uppercase tracking-widest mb-3 opacity-80 font-bold"
                style={{ letterSpacing: ".2em", color: card.stroke }}
              >
                For
              </div>
              <div
                className="font-serif text-3xl font-bold mb-5"
                style={{ color: card.stroke, letterSpacing: "-.01em" }}
              >
                {recipient || "…"}
              </div>
              <div
                className="text-2xl leading-relaxed opacity-90"
                style={{ color: card.stroke, fontFamily: "var(--font-hand)" }}
              >
                &ldquo;{note || "your kind words will go here"}&rdquo;
              </div>
              <div
                className="mt-6 text-xl opacity-60"
                style={{ color: card.stroke, fontFamily: "var(--font-hand)" }}
              >
                — written by hand
              </div>
            </div>

            {/* Itemised summary */}
            <div className="bg-white dark:bg-[#1a1830] rounded-3xl border border-cream-200 dark:border-amber-900/30 p-6 md:p-8 shadow-sm">
              <div className="flex justify-between items-end mb-6 border-b border-cream-100 dark:border-amber-900/20 pb-4">
                <h3 className="font-serif text-xl font-bold text-brown-900 dark:text-amber-100">
                  Inside the box
                </h3>
                <div className="text-sm font-medium text-brown-500 dark:text-amber-100/60">
                  {resolvedProducts.length} items
                </div>
              </div>

              <div className="flex flex-col gap-4 max-h-[340px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cream-300 dark:scrollbar-thumb-amber-900/50">
                {picks.map((p) => {
                  const product = allProducts.find((pr) => pr.id === p.id);
                  if (!product) return null;
                  const image = product.images?.[0] ?? "";
                  return (
                    <div
                      key={p.id}
                      className="flex items-start gap-4 p-3 rounded-2xl bg-cream-50 dark:bg-[#0f0e1c] border border-cream-100 dark:border-amber-900/30"
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
                          className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-black/5 dark:border-white/5"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-2xl flex-shrink-0">
                          🎁
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="text-base font-bold text-brown-900 dark:text-amber-100 mb-1">
                          {product.name}
                          {p.qty > 1 && (
                            <span className="font-medium text-sm ml-2 text-brown-500 dark:text-amber-100/60">
                              × {p.qty}
                            </span>
                          )}
                        </div>
                        <div
                          className="text-sm text-brown-600 dark:text-amber-100/70 line-clamp-2 [&>p]:mb-0 [&>p]:inline leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: product.description || "",
                          }}
                        />
                      </div>
                      <div className="text-base font-bold text-brown-900 dark:text-amber-100 flex-shrink-0 ml-2">
                        {formatPrice(product.price * p.qty)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-5 flex flex-col gap-2.5 border-t border-cream-200 dark:border-amber-900/30">
                <div className="flex justify-between text-[15px] text-brown-600 dark:text-amber-100/70">
                  <span>Items subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[15px] text-brown-600 dark:text-amber-100/70">
                  <span>Gift wrap</span>
                  <span className="text-green-600 dark:text-green-400 font-semibold">
                    Free
                  </span>
                </div>
                <div className="flex justify-between text-[15px] text-brown-600 dark:text-amber-100/70">
                  <span>Handwritten note</span>
                  <span className="text-green-600 dark:text-green-400 font-semibold">
                    Free
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 mt-2 border-t border-cream-200 dark:border-amber-900/30">
                  <span className="text-sm font-bold uppercase tracking-widest text-brown-900 dark:text-amber-100">
                    Total
                  </span>
                  <span className="font-serif text-3xl font-bold text-brown-900 dark:text-amber-100">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share modal */}
      {shareOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-6"
          style={{
            background: "rgba(45,31,20,.5)",
            backdropFilter: "blur(8px)",
          }}
          onClick={() => setShareOpen(false)}
        >
          <div
            className="bg-white dark:bg-[#1a1830] rounded-[32px] p-8 sm:p-12 max-w-md w-full text-center shadow-2xl border border-cream-200 dark:border-amber-900/30 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Share2 size={28} />
            </div>
            <h3 className="font-serif text-3xl font-bold text-brown-900 dark:text-amber-100 mb-3">
              Share preview
            </h3>
            <p className="text-brown-600 dark:text-amber-100/70 text-base mb-8">
              Send this preview link so everyone can chip in.
            </p>
            <div
              className="px-4 py-3.5 rounded-xl text-sm mb-8 break-all bg-cream-50 dark:bg-[#0f0e1c] text-brown-900 dark:text-amber-200 border border-cream-200 dark:border-amber-900/40"
              style={{ fontFamily: "ui-monospace, monospace" }}
            >
              artisanhouse.in/gift/preview/ah-
              {Math.random().toString(36).slice(2, 8)}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleCopyLink}
                className="w-full bg-coral-600 hover:bg-coral-700 text-white shadow-md shadow-coral-200 dark:shadow-amber-900/30 transition-all"
              >
                {copied ? "Copied!" : "Copy link"}
              </Button>
              <Button
                variant="outline"
                className="w-full border-2 border-brown-300 text-brown-900 dark:border-amber-900/40 dark:text-amber-100 hover:border-amber-400 dark:hover:border-amber-500"
              >
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

const PIN_COLORS = [
  "#ef4444", // Red
  "#3b82f6", // Blue
  "#eab308", // Yellow
  "#10b981", // Green
  "#a855f7", // Purple
  "#f97316", // Orange
];

function LoopingConfetti() {
  const pieces = Array.from({ length: 40 });
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {pieces.map((_, i) => {
        // Distribute pieces to the left (0-25%) and right (75-100%) sides
        const left = i % 2 === 0;
        const startX = left ? Math.random() * 25 : 75 + Math.random() * 25;
        const size = Math.random() * 8 + 6;
        const duration = Math.random() * 2 + 3;
        const delay = Math.random() * 4;
        const colors = [
          "#fcd34d",
          "#f87171",
          "#34d399",
          "#60a5fa",
          "#c084fc",
          "#fb923c",
        ];
        const color = colors[i % colors.length];

        return (
          <motion.div
            key={i}
            initial={{ y: -50, x: 0, opacity: 0, rotate: 0 }}
            animate={{
              y: 500, // Drop out of the box bounds
              rotate: Math.random() * 360 + 360,
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-0"
            style={{
              left: `${startX}%`,
              width: size,
              height: size,
              backgroundColor: color,
              borderRadius: i % 3 === 0 ? "50%" : "2px",
            }}
          />
        );
      })}
    </div>
  );
}

function PickedItemsPhotoStack({ items }: { items: Product[] }) {
  const [topIdx, setTopIdx] = useState(0);

  if (items.length === 0) return null;
  const displayItems = items.slice(0, 6);

  return (
    <div
      className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[3/4] flex items-center justify-center group cursor-pointer mb-6"
      onClick={() => setTopIdx((prev) => (prev + 1) % displayItems.length)}
    >
      {displayItems.map((product, idx) => {
        const img = product.images?.[0] || "";
        const offset =
          (idx - topIdx + displayItems.length) % displayItems.length;
        if (offset > 2) return null; // Show max 3 visually

        const isTop = offset === 0;
        const zIndex = displayItems.length - offset;

        const pinColor =
          PIN_COLORS[(product.id.charCodeAt(0) + idx) % PIN_COLORS.length];
        const rotate = offset === 0 ? -3 : offset === 1 ? 5 : -6;
        const xOffset = offset === 0 ? 0 : offset === 1 ? 20 : -20;
        const yOffset = offset === 0 ? 0 : offset === 1 ? -10 : 15;

        return (
          <motion.div
            key={`${product.id}-${idx}`}
            initial={false}
            animate={{
              x: xOffset,
              y: yOffset,
              rotate: rotate,
              zIndex: zIndex,
              scale: isTop ? 1 : 0.95 - offset * 0.02,
              opacity: offset > 2 ? 0 : 1,
            }}
            className="absolute inset-0 rounded-3xl shadow-[0_16px_40px_rgba(28,18,9,.15)] dark:shadow-amber-900/20"
          >
            {/* Thumb Pin (Classic Push Pin) */}
            <div
              style={{
                position: "absolute",
                top: 10,
                left: "50%",
                transform: "translateX(-50%)",
                width: 28,
                height: 28,
                zIndex: 10,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  left: 14,
                  width: 14,
                  height: 14,
                  backgroundColor: "rgba(0,0,0,0.25)",
                  borderRadius: "50%",
                  transform: "translate(4px, 4px)",
                  filter: "blur(2px)",
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 2,
                  left: 2,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: pinColor,
                  backgroundImage:
                    "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.2) 100%)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  zIndex: 2,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 6,
                  left: 6,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  backgroundColor: pinColor,
                  backgroundImage:
                    "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.4) 100%)",
                  boxShadow:
                    "0 3px 5px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.6)",
                  zIndex: 3,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 3,
                    left: 3,
                    width: 4,
                    height: 4,
                    backgroundColor: "#fff",
                    borderRadius: "50%",
                    filter: "blur(0.5px)",
                  }}
                />
              </div>
            </div>

            {/* Polaroid Photo Wrapper */}
            <div className="w-full h-full p-3.5 pb-14 sm:pb-16 bg-white dark:bg-[#1a1830] rounded-3xl border border-gray-100 dark:border-amber-900/30 flex flex-col">
              {img ? (
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-cream-50 dark:bg-black/20 mb-4 shadow-inner">
                  <img
                    src={img}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl bg-cream-50 dark:bg-black/20 rounded-2xl mb-4 shadow-inner">
                  🕯️
                </div>
              )}
              <p className="text-center font-serif font-bold text-lg text-brown-900 dark:text-amber-100 truncate px-2 shrink-0 mt-auto">
                {product.name}
              </p>
            </div>
          </motion.div>
        );
      })}

      {/* Hint Badge */}
      {displayItems.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setTopIdx((prev) => (prev + 1) % displayItems.length);
          }}
          className="absolute -bottom-8 right-0 sm:-right-4 z-50 backdrop-blur-md text-xs font-semibold px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform cursor-pointer"
          style={{
            background: "var(--home-bg)",
            color: "var(--home-amber)",
            border: "1px solid var(--home-border)",
          }}
        >
          Click to browse
        </button>
      )}
    </div>
  );
}
