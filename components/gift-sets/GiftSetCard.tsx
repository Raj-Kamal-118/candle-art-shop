"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GiftSet } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface GiftSetCardProps {
  set: GiftSet;
}

export default function GiftSetCard({ set }: GiftSetCardProps) {
  const [hover, setHover] = useState(false);
  const itemCount = set.items?.length ?? 0;

  return (
    <Link
      href={`/gift-sets/${set.slug}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="block rounded-2xl overflow-hidden"
      style={{
        background: "#fff",
        border: "1px solid #e8dfc8",
        boxShadow: hover ? "0 20px 48px -12px rgba(45,31,20,.18)" : "0 2px 8px rgba(45,31,20,.07)",
        transform: hover ? "translateY(-4px)" : "translateY(0)",
        transition: "all .35s cubic-bezier(.22,1,.36,1)",
      }}
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1/1.1", background: "#f9f5ee" }}>
        {set.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={set.image}
            alt={set.name}
            className="w-full h-full object-cover"
            style={{ transform: hover ? "scale(1.04)" : "scale(1)", transition: "transform .6s" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: "#f9f5ee" }}>
            <span className="text-5xl">🎁</span>
          </div>
        )}
        {set.saving > 0 && (
          <div
            className="absolute top-3 right-3 px-2.5 py-1.5 rounded-full text-xs font-semibold text-white"
            style={{ background: set.accent || "#d97706" }}
          >
            Save {formatPrice(set.saving)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="text-xs tracking-widest uppercase mb-1.5 font-medium" style={{ color: "#b45309", letterSpacing: ".2em" }}>
          {set.occasions.join(" · ")}
        </div>
        <h3 className="font-serif text-xl font-medium mb-1.5 tracking-tight" style={{ color: "#1c1209" }}>
          {set.name}
        </h3>
        {set.tagline && (
          <p className="text-sm italic font-serif mb-3.5 leading-snug" style={{ color: "#7c5c3a" }}>
            {set.tagline}
          </p>
        )}
        <div className="flex items-end justify-between pt-3.5" style={{ borderTop: "1px solid #e8dfc8" }}>
          <div>
            <div className="text-xs mb-0.5" style={{ color: "#7c5c3a" }}>
              {itemCount} item{itemCount !== 1 ? "s" : ""}
            </div>
            <div className="text-xl font-bold" style={{ color: "#1c1209" }}>
              {formatPrice(set.price)}
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: "#b45309" }}>
            View set <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
}
