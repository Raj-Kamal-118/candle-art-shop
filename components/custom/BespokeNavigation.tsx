"use client";

import Link from "next/link";
import { Flame, Brush, Gift, ArrowRight } from "lucide-react";

const items = [
  {
    id: "candle",
    title: "Custom Candle",
    desc: "Pick your wax, wick, vessel, and signature scent.",
    href: "/custom/candle",
    icon: Flame,
  },
  {
    id: "magnet",
    title: "Custom Magnet",
    desc: "Hand-painted miniatures and 3D clay art.",
    href: "/custom/magnet",
    icon: Brush,
  },
  {
    id: "gift-set",
    title: "Curated Gift Sets",
    desc: "Build a beautiful box of handcrafted goods.",
    href: "/custom/gift-set",
    icon: Gift,
  },
];

export default function BespokeNavigation({
  active,
}: {
  active: "candle" | "magnet" | "gift-set";
}) {
  const otherItems = items.filter((item) => item.id !== active);

  return (
    <div className="mt-20 pt-16 border-t border-cream-200 dark:border-amber-900/30">
      <div className="text-center mb-10">
        <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-[0.2em] mb-3">
          ✦ More from the Atelier ✦
        </p>
        <h2 className="font-serif text-3xl font-bold text-brown-900 dark:text-amber-100">
          Continue crafting
        </h2>
      </div>
      <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {otherItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              className="group flex items-start gap-5 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 shadow-sm hover:shadow-[0_12px_32px_rgba(28,18,9,0.06)] dark:hover:shadow-amber-900/20 hover:border-amber-300 dark:hover:border-amber-700/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500 group-hover:bg-coral-50 dark:group-hover:bg-coral-900/20 group-hover:text-coral-600 dark:group-hover:text-coral-400">
                <Icon size={26} />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-brown-900 dark:text-amber-100 mb-2 group-hover:text-coral-600 dark:group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-brown-600 dark:text-amber-100/70 mb-4 leading-relaxed">
                  {item.desc}
                </p>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-500 flex items-center gap-1.5 group-hover:text-coral-600 dark:group-hover:text-amber-400 transition-colors">
                  Explore{" "}
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
