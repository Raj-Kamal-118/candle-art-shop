"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { GiftSet } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface GiftSetCardProps {
  set: GiftSet;
}

export default function GiftSetCard({ set }: GiftSetCardProps) {
  const itemCount = set.items?.length ?? 0;

  return (
    <Link
      href={`/gift-sets/${set.slug}`}
      className="group relative craft-polaroid hover:bg-amber-50/60 dark:hover:bg-amber-900/20 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
      style={{ padding: "14px 14px 20px" }}
    >
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-cream-100 dark:bg-amber-900/20">
        {set.image ? (
          <Image
            src={set.image}
            alt={set.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            🎁
          </div>
        )}
        {/* Badges */}
        {set.saving > 0 && (
          <div className="absolute top-3 left-0 z-10">
            <div
              style={{
                background: "var(--home-coral, #e85d4a)",
                color: "white",
                fontFamily: "var(--font-hand)",
                fontSize: 18,
                letterSpacing: "0.05em",
                fontWeight: 700,
                padding: "0px 12px 0px 8px",
                clipPath:
                  "polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%)",
                boxShadow: "2px 2px 6px rgba(0,0,0,0.15)",
              }}
            >
              Save {formatPrice(set.saving)}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-1 mt-3 flex flex-col flex-1">
        <div className="text-[10px] sm:text-xs lg:text-sm text-amber-600 dark:text-amber-500 font-bold uppercase tracking-wide mb-1.5 truncate">
          {set.occasions.join(" · ")}
        </div>
        <h3 className="font-extrabold text-black dark:text-white font-serif text-sm sm:text-base lg:text-lg leading-tight mb-1 group-hover:text-coral-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
          {set.name}
        </h3>
        {set.tagline && (
          <p className="text-xs lg:text-sm italic font-serif mb-auto text-brown-500 dark:text-amber-100/60 line-clamp-2">
            {set.tagline}
          </p>
        )}

        <div className="flex items-end justify-between mt-auto pt-4 gap-2">
          <div className="flex flex-col">
            <div className="text-[10px] sm:text-xs lg:text-sm text-brown-400 dark:text-amber-100/50 mb-0.5 font-medium">
              {itemCount} item{itemCount !== 1 ? "s" : ""}
            </div>
            <div className="text-sm sm:text-base lg:text-lg font-bold text-brown-900 dark:text-amber-100 font-serif">
              {formatPrice(set.price)}
            </div>
          </div>
          <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-xs lg:text-sm font-semibold transition-colors shrink-0 text-white shadow-sm bg-coral-600 group-hover:bg-coral-700 dark:bg-amber-600 dark:group-hover:bg-amber-700">
            View set <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
}
