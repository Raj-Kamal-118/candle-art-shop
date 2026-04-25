"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight } from "lucide-react";
import { GiftSet } from "@/lib/types";
import GiftSetCard from "@/components/gift-sets/GiftSetCard";
import OccasionFilter from "@/components/gift-sets/OccasionFilter";

export default function GiftSetsPage() {
  const [sets, setSets] = useState<GiftSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [occasion, setOccasion] = useState("all");

  useEffect(() => {
    fetch("/api/gift-sets")
      .then((r) => r.json())
      .then(setSets)
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    occasion === "all"
      ? sets
      : sets.filter((s) => s.occasions.includes(occasion));

  // Insert the "Build your own" CTA card after the 3rd premade set
  const first3 = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-20">
        <div className="animate-pulse space-y-8">
          <div className="h-64 bg-cream-200 rounded-2xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-cream-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] pb-20">
      {/* Development Banner */}
      <div className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 text-center py-2.5 px-4 text-sm font-medium border-b border-amber-200 dark:border-amber-800/50 relative z-20 shadow-sm">
        🚧 Page under development — you might see some unexpected issues.
      </div>

      {/* Editorial hero */}
      <section className="relative overflow-hidden text-center p-12 border-b border-cream-200 dark:border-amber-900/20 flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/misc/gift.png"
            alt="Gift Sets"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 z-0 bg-black/20 dark:bg-black/60" />

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-[0.24em] mb-5 drop-shadow-sm">
            ✦ Gift sets · Premade &amp; custom ✦
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8 drop-shadow-md">
            Small boxes,{" "}
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
                big feelings.
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
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.65,
              maxWidth: 520,
            }}
            className="mx-auto mb-10 drop-shadow-sm"
          >
            Pick from one of our curated sets — or build your own, one object at
            a time. Everything wrapped in tissue, tied with ribbon.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/gift-sets/build"
              className="inline-flex items-center justify-center gap-2 bg-coral-600 dark:bg-amber-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-coral-700 dark:hover:bg-amber-500 transition-all duration-200 shadow-lg shadow-coral-100 dark:shadow-amber-900/30 hover:-translate-y-0.5 text-sm"
            >
              Build your own set <Sparkles size={16} />
            </Link>
            <a
              href="#premade"
              className="inline-flex items-center justify-center gap-2 bg-white dark:bg-[#1a1830] dark:border dark:border-amber-700/30 text-forest-800 dark:text-amber-200 px-8 py-3.5 rounded-xl font-semibold hover:bg-cream-100 dark:hover:bg-amber-900/20 transition-all duration-200 shadow-md hover:shadow-lg border border-cream-200 text-sm"
            >
              Browse premade
            </a>
          </div>
        </div>
      </section>

      {/* Occasion filter */}
      <section
        className="max-w-[1440px] mx-auto px-6 pt-10"
        style={{ paddingBottom: 32 }}
      >
        <OccasionFilter active={occasion} onChange={setOccasion} />
      </section>

      {/* Grid: first 3 + build CTA card + rest */}
      <section id="premade" className="max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {first3.map((s) => (
            <GiftSetCard key={s.id} set={s} />
          ))}

          {/* "Build your own" inline card */}
          <Link
            href="/gift-sets/build"
            className="group relative bg-white dark:bg-[#1a1830] rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(28,18,9,0.05)] border border-amber-200 dark:border-amber-700/50 hover:shadow-[0_12px_32px_rgba(28,18,9,0.08)] transition-all duration-300 cursor-pointer flex flex-col"
          >
            <div className="relative flex-1 flex flex-col items-center justify-center p-8 text-center overflow-hidden bg-amber-50/50 dark:bg-amber-900/10 min-h-[300px]">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-transparent dark:from-amber-500/10 dark:to-transparent" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-14 h-14 bg-white dark:bg-[#0f0e1c] border border-amber-100 dark:border-amber-900/50 rounded-full flex items-center justify-center text-amber-500 shadow-sm mb-5 group-hover:scale-110 transition-transform">
                  <Sparkles size={24} />
                </div>
                <div className="text-[11px] font-semibold uppercase mb-3 tracking-[0.2em] text-amber-600 dark:text-amber-400">
                  Pick your own
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brown-900 dark:text-amber-100 mb-3 leading-tight">
                  Build a set, your way.
                </h3>
                <p className="text-sm text-brown-600 dark:text-amber-100/70 max-w-[240px] mx-auto">
                  Any items, any size. Candles, magnets, keyrings, clay pieces —
                  plus a card with your note.
                </p>
              </div>
            </div>
            <div className="p-3 sm:p-4 flex flex-col h-auto justify-center bg-white dark:bg-[#1a1830] border-t border-amber-100 dark:border-amber-900/30">
              <div className="w-full bg-coral-600 group-hover:bg-coral-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white text-sm font-semibold py-3 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm gap-2 group-hover:-translate-y-0.5">
                Start building <ArrowRight size={16} />
              </div>
            </div>
          </Link>

          {rest.map((s) => (
            <GiftSetCard key={s.id} set={s} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-brown-500 text-lg mb-4">
              No sets for that occasion yet.
            </p>
            <Link
              href="/gift-sets/build"
              className="inline-flex items-center gap-2 text-amber-700 font-medium"
            >
              Build a custom set instead <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
