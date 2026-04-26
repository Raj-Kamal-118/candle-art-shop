"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Package, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Product, Category } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import ItemPick from "@/components/gift-sets/ItemPick";
import SecondaryHeader from "@/components/layout/SecondaryHeader";
import Button from "@/components/ui/Button";
import { useGiftBuilderStore, GS_CARDS } from "@/lib/stores/giftBuilderStore";
import BespokeNavigation from "@/components/custom/BespokeNavigation";

const MIN = 3;
const SWEET = 5;

export default function AtelierBuilderPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [activeCatId, setActiveCatId] = useState<string>("");

  const {
    picks,
    recipient,
    note,
    cardStyle,
    add,
    remove,
    clear,
    setRecipient,
    setNote,
    setCardStyle,
    surpriseMe,
    itemCount,
  } = useGiftBuilderStore();

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
    ]).then(([cats, prods]: [Category[], Product[]]) => {
      // Only show categories that have products
      const catIdsWithProducts = new Set(prods.map((p) => p.categoryId));
      const filtered = cats.filter((c) => catIdsWithProducts.has(c.id));
      setCategories(filtered);
      setAllProducts(prods);
      if (filtered.length > 0) setActiveCatId(filtered[0].id);
    });
  }, []);

  const pickedProducts = picks.flatMap((p) =>
    Array(p.qty)
      .fill(allProducts.find((pr) => pr.id === p.id))
      .filter(Boolean),
  ) as Product[];

  const subtotal = picks.reduce((total, p) => {
    const product = allProducts.find((pr) => pr.id === p.id);
    return total + (product ? product.price * p.qty : 0);
  }, 0);

  const count = itemCount();
  const activeCat = categories.find((c) => c.id === activeCatId);
  const catProducts = allProducts.filter(
    (p) => p.categoryId === activeCatId && p.inStock,
  );
  const countFor = (id: string) => picks.find((p) => p.id === id)?.qty ?? 0;
  const countInCat = (catId: string) =>
    picks.reduce((s, p) => {
      const product = allProducts.find((pr) => pr.id === p.id);
      return s + (product?.categoryId === catId ? p.qty : 0);
    }, 0);

  const progressText =
    count === 0
      ? "Pick your first item"
      : count < MIN
        ? `Add ${MIN - count} more to go`
        : count < SWEET
          ? "Looking good · add 1–2 more"
          : "Beautifully curated 🎁";

  const handleSurpriseMe = () => {
    if (
      count > 0 &&
      !window.confirm("Replace current picks with a random selection?")
    )
      return;
    surpriseMe(allProducts);
  };

  return (
    <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] pb-20">
      <SecondaryHeader
        eyebrow="✦ The Atelier ✦"
        titlePrefix="Build your"
        titleHighlighted="gift set"
        titleSuffix="."
        description="Curate your perfect box. Choose the items, select the ribbon, and add a handwritten note."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left: Configuration Wizard */}
          <div className="lg:col-span-7 space-y-10 bg-white dark:bg-[#1a1830] p-8 rounded-3xl shadow-sm border border-cream-200 dark:border-amber-900/30 transition-colors">
            {/* Header Row w/ Surprise Me */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-100 dark:border-amber-900/20 pb-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-brown-900 dark:text-amber-100 mb-1">
                  1. Choose Items
                </h2>
                <p className="text-sm text-brown-500 dark:text-amber-100/60">
                  Mix and match candles, crafts, and extras.
                </p>
              </div>
              <button
                onClick={handleSurpriseMe}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-700/50 dark:hover:bg-amber-900/50"
              >
                <Sparkles size={16} /> Surprise me
              </button>
            </div>

            {/* Category Tabs */}
            <div>
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-2">
                {categories.map((cat) => {
                  const isActive = activeCatId === cat.id;
                  const catCount = countInCat(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCatId(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border-2 ${
                        isActive
                          ? "border-amber-500 bg-amber-50 text-brown-900 dark:border-amber-600 dark:bg-amber-900/30 dark:text-amber-100 shadow-sm"
                          : "border-cream-200 bg-cream-50 text-brown-600 hover:bg-cream-100 dark:border-amber-900/30 dark:bg-[#0f0e1c] dark:text-amber-100/70 dark:hover:bg-amber-900/40"
                      }`}
                    >
                      {cat.name}
                      {catCount > 0 && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isActive
                              ? "bg-amber-500 text-white"
                              : "bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200"
                          }`}
                        >
                          {catCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Products Grid */}
              <div className="mt-6">
                {catProducts.length === 0 && categories.length > 0 ? (
                  <div className="text-center py-12 text-brown-400 dark:text-amber-100/40 bg-cream-50 dark:bg-[#0f0e1c] rounded-2xl border border-dashed border-cream-200 dark:border-amber-900/30">
                    <Package size={28} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No products in this category yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {catProducts.map((product) => (
                      <ItemPick
                        key={product.id}
                        product={product}
                        count={countFor(product.id)}
                        onAdd={() => add(product.id)}
                        onRemove={() => remove(product.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Note + Card Section */}
            <div className="pt-8 border-t border-cream-100 dark:border-amber-900/20">
              <h2 className="font-serif text-2xl font-bold text-brown-900 dark:text-amber-100 mb-1">
                2. Add a Little Note
              </h2>
              <p className="text-sm text-brown-500 dark:text-amber-100/60 mb-6">
                We write your message by hand on the card of your choice.
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[15px] font-medium text-brown-700 dark:text-amber-100/80 mb-1.5">
                      To
                    </label>
                    <input
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="Recipient's name"
                      className="w-full px-4 py-3 text-base sm:text-sm bg-cream-50 dark:bg-[#0f0e1c] border border-cream-200 dark:border-amber-900/30 rounded-xl shadow-sm focus:bg-white dark:focus:bg-[#1a1830] focus:ring-2 focus:ring-amber-300 dark:focus:ring-amber-600 focus:border-amber-400 dark:focus:border-amber-500 focus:outline-none text-brown-900 dark:text-amber-100 transition-all placeholder:text-brown-400 dark:placeholder:text-amber-100/40"
                    />
                  </div>
                  <div>
                    <label className="flex justify-between items-center text-[15px] font-medium text-brown-700 dark:text-amber-100/80 mb-1.5">
                      <span>Message</span>
                      <span className="text-xs font-normal text-brown-400 dark:text-amber-100/50">
                        {note.length}/140
                      </span>
                    </label>
                    <textarea
                      maxLength={140}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="A few warm words…"
                      className="w-full px-4 py-3 text-base sm:text-sm bg-cream-50 dark:bg-[#0f0e1c] border border-cream-200 dark:border-amber-900/30 rounded-xl shadow-sm focus:bg-white dark:focus:bg-[#1a1830] focus:ring-2 focus:ring-amber-300 dark:focus:ring-amber-600 focus:border-amber-400 dark:focus:border-amber-500 focus:outline-none text-brown-900 dark:text-amber-100 transition-all placeholder:text-brown-400 dark:placeholder:text-amber-100/40 resize-none"
                      rows={3}
                      style={{
                        fontFamily: "var(--font-hand)",
                        fontSize: "1.25rem",
                      }}
                    />
                  </div>
                </div>

                {/* Card Styles */}
                <div>
                  <label className="block text-[15px] font-medium text-brown-700 dark:text-amber-100/80 mb-3">
                    Card style
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {GS_CARDS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setCardStyle(c.id)}
                        className={`relative p-3 rounded-xl text-left transition-all border-2 ${cardStyle === c.id ? "border-amber-500 shadow-md scale-[1.02]" : "border-transparent hover:scale-105"}`}
                        style={{
                          backgroundColor: c.swatch,
                          color: c.stroke,
                          fontFamily: "var(--font-serif)",
                        }}
                      >
                        <div className="text-sm font-bold mb-1">{c.label}</div>
                        <div className="text-xs opacity-80 leading-snug">
                          {c.style}
                        </div>
                        {cardStyle === c.id && (
                          <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white bg-amber-500 shadow-sm">
                            ✓
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Preview & Summary */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div className="bg-white dark:bg-[#1a1830] p-8 rounded-3xl border border-cream-200 dark:border-amber-900/30 shadow-sm transition-colors">
              {/* Picked Items Photo Stack Preview */}
              <div className="mb-8 flex flex-col items-center justify-center pt-4">
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-8">
                  Your Selected Items
                </p>
                <PickedItemsPhotoStack items={pickedProducts} />
              </div>

              {/* Premium Packaging Message */}
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6 mb-8 border border-amber-200 dark:border-amber-800/30 text-center">
                <div className="w-12 h-12 bg-white dark:bg-[#1a1830] shadow-sm text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-3 border border-amber-100 dark:border-amber-700/30">
                  <Package size={20} />
                </div>
                <h4 className="font-serif text-lg font-bold text-brown-900 dark:text-amber-100 mb-2">
                  Premium Packaging Included
                </h4>
                <p className="text-sm text-brown-600 dark:text-amber-100/70 leading-relaxed">
                  We'll carefully arrange your items in our premium signature
                  box, elegantly wrapped with tissue and a beautiful ribbon to
                  give it a luxurious gift feel.
                </p>
              </div>

              {/* Progress & Inside the Box */}
              <div className="pt-6 border-t border-cream-100 dark:border-amber-900/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-xl font-bold text-brown-900 dark:text-amber-100">
                    Inside the box
                  </h3>
                  {picks.length > 0 && (
                    <button
                      onClick={clear}
                      className="text-sm text-brown-500 hover:text-coral-600 dark:text-amber-100/50 dark:hover:text-amber-400 transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Progress bar */}
                <div className="p-4 rounded-2xl mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30">
                  <div className="flex justify-between text-sm mb-2 text-brown-900 dark:text-amber-100">
                    <span className="font-medium">{progressText}</span>
                    <span className="text-brown-500 dark:text-amber-100/60 font-medium">
                      {count}/{SWEET}+
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden bg-cream-200 dark:bg-amber-900/40">
                    <div
                      className="h-full rounded-full transition-all duration-500 bg-amber-500 dark:bg-amber-600"
                      style={{
                        width: `${Math.min(100, (count / SWEET) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Picked Items List */}
                <div className="space-y-3 mb-6 max-h-[240px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cream-300 dark:scrollbar-thumb-amber-900/50">
                  {picks.length === 0 ? (
                    <div className="text-center py-8 text-brown-400 dark:text-amber-100/40">
                      <Package size={32} className="mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Your box is empty.</p>
                    </div>
                  ) : (
                    picks.map((p) => {
                      const product = allProducts.find((pr) => pr.id === p.id);
                      if (!product) return null;
                      const img = product.images?.[0] ?? "";
                      return (
                        <div
                          key={p.id}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-[#0f0e1c] border border-cream-200 dark:border-amber-900/30"
                        >
                          {img ? (
                            <img
                              src={img}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-black/5 dark:border-white/5"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0 text-lg">
                              🎁
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate text-brown-900 dark:text-amber-100">
                              {product.name}
                            </div>
                            <div className="text-xs text-brown-500 dark:text-amber-100/60">
                              {formatPrice(product.price)} × {p.qty}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 rounded-full px-1 py-0.5 bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 shadow-sm">
                            <button
                              onClick={() => remove(product.id)}
                              className="w-6 h-6 flex items-center justify-center text-sm text-brown-600 dark:text-amber-100/80 hover:bg-cream-100 dark:hover:bg-amber-900/40 rounded-full transition-colors"
                            >
                              –
                            </button>
                            <span className="text-xs font-bold w-4 text-center text-brown-900 dark:text-amber-100">
                              {p.qty}
                            </span>
                            <button
                              onClick={() => add(product.id)}
                              className="w-6 h-6 flex items-center justify-center text-sm text-brown-600 dark:text-amber-100/80 hover:bg-cream-100 dark:hover:bg-amber-900/40 rounded-full transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Totals */}
                <div className="pt-5 border-t border-cream-100 dark:border-amber-900/20 space-y-2">
                  <div className="flex justify-between text-sm text-brown-600 dark:text-amber-100/70">
                    <span>Items subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-brown-600 dark:text-amber-100/70">
                    <span>Gift wrap & box</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      Included
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-brown-600 dark:text-amber-100/70">
                    <span>Handwritten card</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      Included
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 mt-1 border-t border-cream-100 dark:border-amber-900/20">
                    <span className="text-sm font-semibold uppercase tracking-widest text-brown-900 dark:text-amber-100">
                      Total
                    </span>
                    <span className="font-serif text-2xl font-bold text-brown-900 dark:text-amber-100">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  onClick={() => router.push("/custom/gift-set/review")}
                  disabled={count < MIN || !recipient.trim() || !note.trim()}
                  className="w-full mt-8 flex justify-center gap-2 bg-coral-600 hover:bg-coral-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white shadow-lg shadow-coral-200 dark:shadow-amber-900/30 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:hover:translate-y-0"
                  size="lg"
                >
                  {count < MIN
                    ? `Add ${MIN - count} more items`
                    : !recipient.trim() || !note.trim()
                      ? "Add recipient & message"
                      : "Review your set"}{" "}
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <BespokeNavigation active="gift-set" />
      </div>
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

function PickedItemsPhotoStack({ items }: { items: Product[] }) {
  const [topIdx, setTopIdx] = useState(0);

  if (items.length === 0) {
    return (
      <div className="relative w-full max-w-[260px] aspect-[3/4] flex items-center justify-center bg-cream-50 dark:bg-[#0f0e1c] rounded-3xl border-2 border-dashed border-cream-200 dark:border-amber-900/30">
        <div className="text-center opacity-40">
          <div className="text-5xl mb-3">🎁</div>
          <p className="text-sm font-medium text-brown-600 dark:text-amber-100">
            Box is empty
          </p>
        </div>
      </div>
    );
  }

  const displayItems = items.slice(0, 6);

  return (
    <div
      className="relative w-full max-w-[260px] aspect-[3/4] flex items-center justify-center group cursor-pointer mb-6"
      onClick={() => setTopIdx((prev) => (prev + 1) % displayItems.length)}
    >
      {displayItems.map((product, idx) => {
        const img = product.images?.[0] || "";
        const offset =
          (idx - topIdx + displayItems.length) % displayItems.length;
        if (offset > 2) return null; // Show max 3 visually

        const isTop = offset === 0;
        const zIndex = displayItems.length - offset;

        // Pseudo-randomize pin color based on product ID
        const pinColor =
          PIN_COLORS[(product.id.charCodeAt(0) + idx) % PIN_COLORS.length];
        const rotate = offset === 0 ? -2 : offset === 1 ? 4 : -5;
        const xOffset = offset === 0 ? 0 : offset === 1 ? 16 : -16;
        const yOffset = offset === 0 ? 0 : offset === 1 ? -8 : 12;

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
            className="absolute inset-0 rounded-2xl shadow-[0_16px_40px_rgba(28,18,9,.12)] dark:shadow-amber-900/20"
          >
            {/* Thumb Pin (Classic Push Pin) */}
            <div
              style={{
                position: "absolute",
                top: 8,
                left: "50%",
                transform: "translateX(-50%)",
                width: 24,
                height: 24,
                zIndex: 10,
              }}
            >
              {/* Shadow cast by the pin */}
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  left: 12,
                  width: 12,
                  height: 12,
                  backgroundColor: "rgba(0,0,0,0.25)",
                  borderRadius: "50%",
                  transform: "translate(4px, 4px)",
                  filter: "blur(2px)",
                  zIndex: 1,
                }}
              />

              {/* Pin Base Rim */}
              <div
                style={{
                  position: "absolute",
                  top: 2,
                  left: 2,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: pinColor,
                  backgroundImage:
                    "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.2) 100%)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  zIndex: 2,
                }}
              />

              {/* Pin Handle / Stem */}
              <div
                style={{
                  position: "absolute",
                  top: 5,
                  left: 5,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  backgroundColor: pinColor,
                  backgroundImage:
                    "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.4) 100%)",
                  boxShadow:
                    "0 3px 5px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.6)",
                  zIndex: 3,
                }}
              >
                {/* Specular Highlight */}
                <div
                  style={{
                    position: "absolute",
                    top: 2,
                    left: 2,
                    width: 3,
                    height: 3,
                    backgroundColor: "#fff",
                    borderRadius: "50%",
                    filter: "blur(0.5px)",
                  }}
                />
              </div>
            </div>

            {/* Polaroid Photo Wrapper */}
            <div className="w-full h-full p-3 pb-12 bg-white dark:bg-[#1a1830] rounded-2xl border border-gray-100 dark:border-amber-900/30 flex flex-col">
              {img ? (
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-cream-50 dark:bg-black/20 mb-3">
                  <img
                    src={img}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl bg-cream-50 dark:bg-black/20 rounded-xl mb-3">
                  🕯️
                </div>
              )}
              <p className="text-center font-serif font-bold text-sm text-brown-900 dark:text-amber-100 truncate px-1 shrink-0 mt-auto">
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
          className="absolute -bottom-6 right-2 z-50 backdrop-blur-md text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-md hover:scale-105 transition-transform cursor-pointer"
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
