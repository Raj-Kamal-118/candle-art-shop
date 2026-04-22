"use client";

import { useState } from "react";
import { Plus, Minus, ArrowRight } from "lucide-react";
import InfoShell from "@/components/informational/InfoShell";

const faqs = [
  { c: "orders", q: "How long does it take to ship an order?", a: "Every candle is hand-poured in our Bengaluru studio, so we take 2–3 business days to prepare your order before it dispatches. Ready-to-ship items move faster; customizable pieces take a little longer." },
  { c: "orders", q: "Can I change my order after placing it?", a: "If your order hasn't entered the pouring stage yet, we can usually make changes. Email us at artisanhouse.in@gmail.com with your order number and we'll see what we can do." },
  { c: "candles", q: "How do I get the longest burn time?", a: "Trim the wick to 5mm before every use, and on the first burn let the wax pool reach the edges of the vessel. This prevents tunnelling and gives you the full 50 hours." },
  { c: "candles", q: "Are your candles safe around pets?", a: "Yes. We use 100% soy wax, cotton wicks, and phthalate-free fragrance oils. Keep the flame away from curious noses and never leave a lit candle unattended." },
  { c: "candles", q: "Why is my candle 'sweating' droplets on top?", a: "Soy wax is sensitive to temperature swings. A light dew on the surface is harmless — gently wipe with a soft cloth before lighting." },
  { c: "custom", q: "How does the custom candle process work?", a: "Start with our Custom Candle designer: pick a vessel, blend up to 3 scents, choose your wick, and add a personal note. We confirm your blend over WhatsApp, pour within 5 business days, and ship with a thank-you card." },
  { c: "custom", q: "Can I send you a photo for a custom magnet?", a: "Absolutely — that's most of our custom-magnet orders. Upload a clear photo during design, we'll preview the crop, and you approve before we print." },
  { c: "shipping", q: "Do you ship internationally?", a: "Not yet. We ship across India via trusted courier partners. International shipping is on our 2026 roadmap — join our list to hear first." },
  { c: "returns", q: "What if my candle arrives damaged?", a: "Send a photo to artisanhouse.in@gmail.com within 48 hours of delivery and we'll ship a replacement. No need to return the damaged piece." },
];

const cats = [
  { id: "all", l: "All" },
  { id: "orders", l: "Orders" },
  { id: "candles", l: "Candle care" },
  { id: "custom", l: "Custom" },
  { id: "shipping", l: "Shipping" },
  { id: "returns", l: "Returns" },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number>(0);
  const [category, setCategory] = useState<string>("all");

  const filtered = category === "all" ? faqs : faqs.filter((f) => f.c === category);

  const sidebar = (
    <aside className="md:sticky md:top-24">
      <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-amber-700 dark:text-amber-400 mb-3">
        Topics
      </div>
      <nav className="flex flex-col gap-0.5">
        {cats.map((c) => {
          const active = category === c.id;
          return (
            <button
              key={c.id}
              onClick={() => {
                setCategory(c.id);
                setOpen(-1);
              }}
              className={`px-3.5 py-2.5 text-sm rounded-lg text-left transition-colors ${
                active
                  ? "bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 font-semibold"
                  : "text-brown-700 dark:text-amber-100/70 hover:bg-cream-100 dark:hover:bg-amber-900/10"
              }`}
            >
              {c.l}
            </button>
          );
        })}
      </nav>
      <div className="relative mt-8 p-5 bg-forest-900 text-white rounded-xl overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 30% 50%, rgba(251,191,36,.2), transparent 60%)",
          }}
        />
        <div className="relative">
          <div className="font-serif text-lg font-bold mb-1.5">Still wondering?</div>
          <div className="text-[13px] text-forest-300 mb-3 leading-snug">
            WhatsApp us — we reply within an hour.
          </div>
          <a
            href="https://wa.me/918009170754"
            className="text-[13px] font-semibold text-gold-400 inline-flex items-center gap-1.5 hover:text-gold-300 transition-colors"
          >
            Start a chat <ArrowRight size={12} />
          </a>
        </div>
      </div>
    </aside>
  );

  return (
    <InfoShell
      eyebrow="Frequently Asked"
      title={
        <>
          Your questions,{" "}
          <span className="text-coral-600 italic">answered</span>
        </>
      }
      subtitle="Most of what you'd like to know, plus a few things we wish everyone asked sooner."
      sidebar={sidebar}
    >
      <div className="flex flex-col gap-2">
        {filtered.map((f, i) => {
          const isOpen = open === i;
          return (
            <div
              key={`${category}-${i}`}
              className="bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                className="w-full px-6 py-[18px] flex items-center justify-between text-left"
              >
                <span className="text-[15px] font-semibold text-brown-900 dark:text-amber-100 pr-5">
                  {f.q}
                </span>
                {isOpen ? (
                  <Minus size={18} className="text-amber-700 dark:text-amber-400 flex-none" />
                ) : (
                  <Plus size={18} className="text-amber-700 dark:text-amber-400 flex-none" />
                )}
              </button>
              {isOpen && (
                <div className="px-6 pb-5 pt-4 text-[15px] leading-[1.7] text-brown-700 dark:text-amber-100/70 border-t border-cream-100 dark:border-amber-900/20">
                  {f.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </InfoShell>
  );
}
