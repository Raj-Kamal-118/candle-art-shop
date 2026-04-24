"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Sparkles, Package, ArrowRight } from "lucide-react";
import { Product, Category } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import BoxPreview from "@/components/gift-sets/BoxPreview";
import ItemPick from "@/components/gift-sets/ItemPick";
import {
  useGiftBuilderStore,
  GS_RIBBONS,
  GS_BOXES,
  GS_CARDS,
} from "@/lib/stores/giftBuilderStore";

const MIN = 3;
const SWEET = 5;

export default function AtelierBuilderPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [activeCatId, setActiveCatId] = useState<string>("");

  const {
    picks, ribbon, box, recipient, note, cardStyle,
    add, remove, clear, setRibbon, setBox,
    setRecipient, setNote, setCardStyle,
    surpriseMe, itemCount,
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
    Array(p.qty).fill(allProducts.find((pr) => pr.id === p.id)).filter(Boolean)
  ) as Product[];

  const subtotal = picks.reduce((total, p) => {
    const product = allProducts.find((pr) => pr.id === p.id);
    return total + (product ? product.price * p.qty : 0);
  }, 0);

  const count = itemCount();
  const activeCat = categories.find((c) => c.id === activeCatId);
  const catProducts = allProducts.filter((p) => p.categoryId === activeCatId && p.inStock);
  const countFor = (id: string) => picks.find((p) => p.id === id)?.qty ?? 0;
  const countInCat = (catId: string) =>
    picks.reduce((s, p) => {
      const product = allProducts.find((pr) => pr.id === p.id);
      return s + (product?.categoryId === catId ? p.qty : 0);
    }, 0);

  const progressText =
    count === 0 ? "Pick your first item" :
    count < MIN  ? `Add ${MIN - count} more to go` :
    count < SWEET ? "Looking good · add 1–2 more" :
    "Beautifully curated 🎁";

  const handleSurpriseMe = () => {
    if (count > 0 && !window.confirm("Replace current picks with a random selection?")) return;
    surpriseMe(allProducts);
  };

  return (
    <main style={{ background: "#fefdf8", minHeight: "100vh" }}>
      {/* Sticky sub-header */}
      <div
        className="sticky top-0 z-20"
        style={{ background: "rgba(254,253,248,.9)", backdropFilter: "blur(10px)", borderBottom: "1px solid #e8dfc8", padding: "14px 24px" }}
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/gift-sets" className="flex items-center gap-1.5 text-sm" style={{ color: "#7c5c3a" }}>
              <ChevronLeft size={16} /> Back
            </Link>
            <div className="w-px h-4" style={{ background: "#d4c9b4" }} />
            <div>
              <div className="text-xs font-medium uppercase tracking-widest" style={{ letterSpacing: ".2em", color: "#b45309" }}>
                Atelier · Build your set
              </div>
              <div className="font-serif text-lg font-medium" style={{ color: "#1c1209" }}>
                Arrange your box
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSurpriseMe}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a" }}
            >
              <Sparkles size={14} /> Surprise me
            </button>
            <button
              disabled={count < MIN}
              onClick={() => router.push("/gift-sets/build/review")}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "#1c1209", color: "#fefdf8" }}
            >
              {count < MIN ? `Add ${MIN - count} more` : "Review set"} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid max-w-[1400px] mx-auto" style={{ gridTemplateColumns: "1fr 460px" }}>
        {/* LEFT: item picker */}
        <div className="p-8 pb-20">
          {/* Category tabs — real product categories */}
          <div className="flex gap-2 overflow-x-auto pb-1 mb-6" style={{ scrollbarWidth: "none" }}>
            {categories.map((cat) => {
              const isActive = activeCatId === cat.id;
              const catCount = countInCat(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCatId(cat.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0"
                  style={{
                    background: isActive ? "#1c1209" : "#fff",
                    color: isActive ? "#fefdf8" : "#5c3d1e",
                    border: isActive ? "none" : "1px solid #e8dfc8",
                    boxShadow: isActive ? "0 10px 24px -8px rgba(45,31,20,.4)" : "0 1px 3px rgba(45,31,20,.06)",
                  }}
                >
                  {cat.name}
                  {catCount > 0 && (
                    <span
                      className="text-xs font-bold px-1.5 rounded-full"
                      style={{ background: isActive ? "#f59e0b" : "#d97706", color: isActive ? "#1c1209" : "#fff", fontSize: 10 }}
                    >
                      {catCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {activeCat && (
            <div className="flex items-baseline justify-between mb-5">
              <div>
                <h2 className="font-serif text-2xl font-medium mb-1" style={{ color: "#1c1209", letterSpacing: "-.01em" }}>
                  {activeCat.name}
                </h2>
                {activeCat.description && (
                  <p className="text-sm italic font-serif" style={{ color: "#7c5c3a" }}>{activeCat.description}</p>
                )}
              </div>
              <div className="text-xs" style={{ color: "#9c7c5c" }}>{catProducts.length} items</div>
            </div>
          )}

          {catProducts.length === 0 && categories.length > 0 && (
            <div className="text-center py-12 text-brown-400">
              <Package size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No products in this category yet.</p>
            </div>
          )}

          <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))" }}>
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

          {/* Note + card section */}
          <div className="mt-12 p-6 rounded-2xl" style={{ background: "#fff", border: "1px solid #e8dfc8" }}>
            <h3 className="font-serif text-xl font-medium mb-1" style={{ color: "#1c1209" }}>A little note</h3>
            <p className="text-sm mb-5" style={{ color: "#7c5c3a" }}>
              We write your message by hand on the card of your choice.
            </p>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Note inputs */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest mb-2" style={{ letterSpacing: ".15em", color: "#7c5c3a" }}>
                  To
                </label>
                <input
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Recipient's name"
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  style={{ border: "1px solid #d4c9b4", background: "#fefdf8", fontFamily: "inherit" }}
                />

                <label className="block text-xs font-medium uppercase tracking-widest mb-2 mt-4" style={{ letterSpacing: ".15em", color: "#7c5c3a" }}>
                  Message (up to 140 chars)
                </label>
                <textarea
                  maxLength={140}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="A few warm words…"
                  className="w-full px-4 py-2.5 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
                  rows={3}
                  style={{ border: "1px solid #d4c9b4", background: "#fefdf8", fontFamily: "Georgia, serif", fontStyle: "italic" }}
                />
                <div className="text-xs text-right mt-1" style={{ color: "#9c7c5c" }}>{note.length}/140</div>
              </div>

              {/* Card styles */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest mb-2" style={{ letterSpacing: ".15em", color: "#7c5c3a" }}>
                  Card style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {GS_CARDS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCardStyle(c.id)}
                      className="relative p-2.5 rounded-xl text-left transition-all"
                      style={{
                        background: c.swatch, color: c.stroke,
                        border: cardStyle === c.id ? "2px solid #d97706" : "1px solid #e8dfc8",
                        cursor: "pointer", fontFamily: "Georgia, serif",
                      }}
                    >
                      <div className="text-sm font-semibold mb-0.5">{c.label}</div>
                      <div className="text-xs opacity-70" style={{ letterSpacing: ".03em" }}>{c.style}</div>
                      {cardStyle === c.id && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-xs text-white" style={{ background: "#d97706" }}>
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

        {/* RIGHT: live preview + summary */}
        <aside
          className="sticky overflow-y-auto"
          style={{ top: 66, height: "calc(100vh - 66px)", background: "#fff", borderLeft: "1px solid #e8dfc8", padding: "32px 28px" }}
        >
          <div className="text-xs font-medium uppercase tracking-widest text-center mb-5" style={{ letterSpacing: ".24em", color: "#b45309" }}>
            Your set · Live preview
          </div>

          <div className="mb-7">
            <BoxPreview items={pickedProducts} ribbon={ribbon} box={box} recipient={recipient} />
          </div>

          {/* Box + ribbon pickers */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-xs font-medium uppercase tracking-widest mb-2" style={{ letterSpacing: ".15em", color: "#7c5c3a" }}>Box</div>
              <div className="flex gap-2 flex-wrap">
                {GS_BOXES.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBox(b.id)}
                    title={b.label}
                    className="w-8 h-8 rounded-lg transition-all"
                    style={{
                      background: b.color,
                      border: box === b.id ? "2px solid #1c1209" : "1px solid #e8dfc8",
                      boxShadow: box === b.id ? "0 0 0 3px #fefdf8, 0 0 0 4px #1c1209" : "none",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-widest mb-2" style={{ letterSpacing: ".15em", color: "#7c5c3a" }}>Ribbon</div>
              <div className="flex gap-2 flex-wrap">
                {GS_RIBBONS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRibbon(r.id)}
                    title={r.label}
                    className="w-7 h-7 rounded-full transition-all"
                    style={{
                      background: r.color,
                      border: ribbon === r.id ? "2px solid #1c1209" : "1px solid #e8dfc8",
                      boxShadow: ribbon === r.id ? "0 0 0 3px #fefdf8, 0 0 0 4px #1c1209" : "none",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Picks list */}
          <div style={{ borderTop: "1px solid #e8dfc8", paddingTop: 20 }}>
            <div className="flex items-baseline justify-between mb-3">
              <div className="text-xs font-semibold uppercase tracking-widest" style={{ letterSpacing: ".2em", color: "#5c3d1e" }}>
                Inside the box
              </div>
              {picks.length > 0 && (
                <button
                  onClick={clear}
                  className="text-xs"
                  style={{ background: "transparent", border: 0, color: "#9c7c5c", cursor: "pointer" }}
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Progress bar */}
            <div className="p-3 rounded-xl mb-4" style={{ background: "#f9f5ee" }}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium" style={{ color: "#5c3d1e" }}>{progressText}</span>
                <span style={{ color: "#9c7c5c" }}>{count}/{SWEET}+</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#e8dfc8" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (count / SWEET) * 100)}%`, background: "linear-gradient(90deg,#f59e0b,#e07a5f)" }}
                />
              </div>
            </div>

            {picks.length === 0 ? (
              <div className="text-center py-6" style={{ color: "#9c7c5c" }}>
                <Package size={28} className="mx-auto mb-2 opacity-30" />
                <div className="text-sm">Your box is empty.</div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {picks.map((p) => {
                  const product = allProducts.find((pr) => pr.id === p.id);
                  if (!product) return null;
                  const img = product.images?.[0] ?? "";
                  return (
                    <div key={p.id} className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl" style={{ background: "#fefdf8", border: "1px solid #e8dfc8" }}>
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt={product.name} className="w-9 h-9 rounded-md object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-md bg-amber-50 flex items-center justify-center flex-shrink-0 text-lg">🎁</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate" style={{ color: "#1c1209" }}>{product.name}</div>
                        <div className="text-xs" style={{ color: "#7c5c3a" }}>{formatPrice(product.price)} × {p.qty}</div>
                      </div>
                      <div className="flex items-center gap-1 rounded-full px-0.5" style={{ background: "#fff", border: "1px solid #e8dfc8" }}>
                        <button onClick={() => remove(product.id)} className="w-6 h-6 flex items-center justify-center text-sm" style={{ background: "transparent", border: 0, color: "#5c3d1e", cursor: "pointer", lineHeight: 1 }}>–</button>
                        <span className="text-xs font-semibold w-4 text-center" style={{ color: "#1c1209" }}>{p.qty}</span>
                        <button onClick={() => add(product.id)} className="w-6 h-6 flex items-center justify-center text-sm" style={{ background: "transparent", border: 0, color: "#5c3d1e", cursor: "pointer", lineHeight: 1 }}>+</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Totals */}
          <div className="mt-5 pt-5" style={{ borderTop: "1px solid #e8dfc8" }}>
            <div className="flex justify-between text-sm mb-1.5" style={{ color: "#7c5c3a" }}>
              <span>Items subtotal</span><span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm mb-1.5" style={{ color: "#7c5c3a" }}>
              <span>Gift wrap</span><span style={{ color: "#15803d" }}>Free</span>
            </div>
            <div className="flex justify-between text-sm mb-4" style={{ color: "#7c5c3a" }}>
              <span>Handwritten card</span><span style={{ color: "#15803d" }}>Free</span>
            </div>
            <div className="flex justify-between items-baseline pt-4" style={{ borderTop: "1px solid #e8dfc8" }}>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ letterSpacing: ".15em", color: "#5c3d1e" }}>Total</span>
              <span className="font-serif text-3xl font-bold" style={{ color: "#1c1209" }}>{formatPrice(subtotal)}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
