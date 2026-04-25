import { Package, Zap, Check, Flame, Home } from "lucide-react";
import SecondaryHeader from "@/components/layout/SecondaryHeader";

const options = [
  {
    Icon: Package,
    name: "Standard",
    time: "3–5 business days",
    price: "Free over ₹2,499 · ₹149 below",
    desc: "Our default. Hand-packed with a thank-you note.",
  },
  {
    Icon: Zap,
    name: "Express",
    time: "1–2 business days",
    price: "₹299 flat",
    desc: "For when the moment can't wait.",
  },
];

const journey = [
  {
    Icon: Check,
    label: "Order received",
    desc: "Confirmation within a minute, by email and WhatsApp.",
  },
  {
    Icon: Flame,
    label: "Hand-poured",
    desc: "We pour in batches of six, so customizable pieces take 2–5 days.",
  },
  {
    Icon: Package,
    label: "Wrapped & dispatched",
    desc: "Tissue, kraft, a thank-you note, and a tracking link.",
  },
  {
    Icon: Home,
    label: "Arrives at your door",
    desc: "Standard 3–5 days · Express 1–2 days. We'll WhatsApp you on delivery day.",
  },
];

const zones: Array<[string, string, string]> = [
  ["Varanasi (local)", "1–2 days", "Free over ₹1,499"],
  ["Metro cities", "2–3 days", "Free over ₹2,499"],
  ["Rest of India", "4–7 days", "Free over ₹2,999"],
  ["International", "Not available", "Coming 2026"],
];

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] pb-20">
      <SecondaryHeader
        eyebrow="✦ Shipping & Delivery ✦"
        titlePrefix="On its way,"
        titleHighlighted="carefully"
        titleSuffix="."
        description="Every order leaves our studio wrapped in tissue, tucked into recycled kraft, with a hand-written thank-you note. Here's how it reaches you."
      />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {options.map(({ Icon, name, time, price, desc }) => (
            <div
              key={name}
              className="bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 rounded-2xl p-6"
            >
              <div className="w-10 h-10 rounded-full bg-coral-100 text-coral-700 flex items-center justify-center mb-4">
                <Icon size={18} />
              </div>
              <h3 className="font-serif text-[22px] font-bold text-brown-900 dark:text-amber-100 mb-1.5">
                {name}
              </h3>
              <div className="text-[13px] text-amber-700 dark:text-amber-400 font-semibold mb-3">
                {time}
              </div>
              <div className="text-sm font-semibold text-brown-900 dark:text-amber-100 mb-2">
                {price}
              </div>
              <p className="text-[13px] text-brown-600 dark:text-amber-100/60 leading-[1.5]">
                {desc}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 rounded-2xl p-8 mb-10">
          <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-amber-700 dark:text-amber-400 mb-5">
            What happens after you order
          </div>
          {journey.map(({ Icon, label, desc }, i) => {
            const last = i === journey.length - 1;
            return (
              <div
                key={label}
                className={`flex gap-4 items-start relative ${last ? "" : "pb-5"}`}
              >
                {!last && (
                  <div className="absolute left-[15px] top-8 bottom-1 w-0.5 bg-cream-200 dark:bg-amber-900/30" />
                )}
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 flex items-center justify-center flex-none">
                  <Icon size={14} />
                </div>
                <div className="flex-1 pt-1.5">
                  <div className="text-[15px] font-semibold text-brown-900 dark:text-amber-100">
                    {label}
                  </div>
                  <div className="text-[13px] text-brown-600 dark:text-amber-100/60 mt-0.5 leading-[1.5]">
                    {desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 rounded-2xl overflow-hidden">
          <div className="px-6 py-[18px] border-b border-cream-200 dark:border-amber-900/30 text-[11px] font-semibold tracking-[0.2em] uppercase text-amber-700 dark:text-amber-400">
            Delivery zones
          </div>
          {zones.map((row, i) => {
            const isComing = row[2].startsWith("Coming");
            return (
              <div
                key={row[0]}
                className={`grid grid-cols-[1.5fr_1fr_1.5fr] px-6 py-4 text-sm items-center ${
                  i === 0
                    ? ""
                    : "border-t border-cream-100 dark:border-amber-900/20"
                }`}
              >
                <div className="font-medium text-brown-900 dark:text-amber-100">
                  {row[0]}
                </div>
                <div className="text-brown-600 dark:text-amber-100/60">
                  {row[1]}
                </div>
                <div
                  className={
                    isComing
                      ? "text-brown-400 dark:text-amber-100/40"
                      : "text-brown-700 dark:text-amber-100/80 font-medium"
                  }
                >
                  {row[2]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
