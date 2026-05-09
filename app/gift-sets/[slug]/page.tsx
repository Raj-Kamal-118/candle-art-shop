"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Sparkles,
  Truck,
  ArrowRight,
  Wrench,
  RotateCcw,
  X,
  CheckCircle2,
  ChevronDown,
  Gift,
  Info,
} from "lucide-react";
import {
  CartGiftSet,
  GiftSet,
  Product,
  CustomizationOption,
} from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useGiftBuilderStore } from "@/lib/stores/giftBuilderStore";
import { useStore } from "@/lib/store";
import Tape, { tapeForIndex } from "@/components/craft/Tape";
import Breadcrumb from "@/components/ui/Breadcrumb";

/* ─── Types ─── */
type Customizations = Record<string, Record<string, string>>; // itemId → optionId → value

/* ─── Design tokens ─── */
const FLAG_COLORS: Record<string, string> = {
  coral: "#e85d4a",
  cream: "#f0dfc0",
  forest: "#2d6a4f",
  gold: "#d4a017",
};
const FLAG_SEQ = [
  "coral",
  "cream",
  "forest",
  "gold",
  "coral",
  "cream",
  "forest",
  "gold",
  "coral",
  "cream",
  "forest",
] as const;

const PIN_GRADIENTS: Record<string, string> = {
  red: "radial-gradient(circle at 30% 30%, #f87171, #dc2626 55%, #7f1d1d)",
  blue: "radial-gradient(circle at 30% 30%, #93c5fd, #3b82f6 55%, #1e40af)",
  yellow: "radial-gradient(circle at 30% 30%, #fde68a, #eab308 55%, #854d0e)",
  green: "radial-gradient(circle at 30% 30%, #86efac, #10b981 55%, #064e3b)",
  coral: "radial-gradient(circle at 30% 30%, #fca5a5, #e85d4a 55%, #991b1b)",
  mint: "radial-gradient(circle at 30% 30%, #a7f3d0, #34d399 55%, #065f46)",
  purple: "radial-gradient(circle at 30% 30%, #d8b4fe, #a855f7 55%, #581c87)",
};
const PIN_CYCLE = [
  "red",
  "blue",
  "yellow",
  "green",
  "coral",
  "mint",
  "purple",
] as const;
const ROTATIONS = [-3, 1.5, -1.5, 2.5, -2, 1, -2.5, 2, -0.5, 3];

/* ─── Pennants ─── */
function Pennants() {
  return (
    <div className="relative select-none" style={{ height: 64 }}>
      <div
        className="absolute"
        style={{
          left: "1%",
          right: "1%",
          top: 10,
          height: 3,
          background:
            "repeating-linear-gradient(90deg, #a87a4f 0 4px, #6b4523 4px 8px)",
          borderRadius: 999,
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
        }}
      />
      <div className="flex justify-center pt-1" style={{ gap: 10 }}>
        {FLAG_SEQ.map((c, i) => (
          <div
            key={i}
            style={{
              width: 36,
              height: 56,
              flexShrink: 0,
              background: FLAG_COLORS[c],
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              opacity: 0.92,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Push pin ─── */
function PushPin({ colorKey }: { colorKey: string }) {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 z-30"
      style={{ top: -18, width: 26, height: 26 }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: PIN_GRADIENTS[colorKey] ?? PIN_GRADIENTS.red,
          boxShadow:
            "0 5px 12px rgba(0,0,0,0.55), inset 0 1px 3px rgba(255,255,255,0.5)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 5,
          left: 5,
          width: 7,
          height: 7,
          background: "rgba(255,255,255,0.88)",
          borderRadius: "50%",
          filter: "blur(0.5px)",
        }}
      />
    </div>
  );
}

/* ─── Controlled option field ─── */
interface OptionFieldProps {
  opt: CustomizationOption;
  value: string;
  onChange: (value: string) => void;
}

function OptionField({ opt, value, onChange }: OptionFieldProps) {
  return (
    <div>
      <p
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#7c5c3a",
          marginBottom: 6,
        }}
      >
        {opt.label}
      </p>
      {opt.type === "select" && opt.options ? (
        <div className="flex flex-wrap gap-1.5">
          {opt.options.map((o) => (
            <button
              key={o}
              onClick={() => onChange(o)}
              className="text-[12px] px-2.5 py-1 border rounded-sm font-serif transition-all"
              style={{
                borderColor: value === o ? "#e85d4a" : "#d4b896",
                background: value === o ? "#fde8e4" : "#fffdf7",
                color: value === o ? "#c0392b" : "#7c5c3a",
                fontWeight: value === o ? 700 : 400,
              }}
            >
              {o}
            </button>
          ))}
        </div>
      ) : opt.type === "color" ? (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={value || "#d97706"}
            onChange={(e) => onChange(e.target.value)}
            className="w-7 h-7 rounded border border-amber-200 cursor-pointer"
          />
          <span
            style={{
              fontFamily: "var(--font-hand)",
              fontSize: 13,
              color: "#7c5c3a",
            }}
          >
            {value}
          </span>
        </div>
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`enter ${opt.label.toLowerCase()}…`}
          className="w-full border-b border-amber-300 bg-transparent text-[16px] text-brown-900 placeholder:text-brown-400 focus:outline-none focus:border-coral-400 py-1"
          style={{ fontFamily: "var(--font-hand)" }}
        />
      )}
    </div>
  );
}

/* ─── Item card on bulletin board ─── */
interface ItemCardProps {
  item: Product;
  idx: number;
  expanded: boolean;
  onToggle: () => void;
  customizations: Record<string, string>;
  onCustomize: (optionId: string, value: string) => void;
}

function ItemCard({
  item,
  idx,
  expanded,
  onToggle,
  customizations,
  onCustomize,
}: ItemCardProps) {
  const rotation = ROTATIONS[idx % ROTATIONS.length];
  const pinColor = PIN_CYCLE[idx % PIN_CYCLE.length];

  return (
    <div
      className="flex flex-col items-center"
      style={{
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "top center",
      }}
    >
      {/* Polaroid */}
      <div
        className="relative group"
        style={{ width: "100%", maxWidth: 280 }}
        onClick={item.customizable ? onToggle : undefined}
      >
        {/* Push pin — always used for photo polaroids */}
        <PushPin colorKey={pinColor} />

        {/* Polaroid frame */}
        <div
          className="craft-polaroid"
          style={{
            padding: "12px 12px 58px",
            cursor: item.customizable ? "pointer" : "default",
          }}
        >
          <div className="relative bg-[#f5ecda] dark:bg-amber-950/60 overflow-hidden w-full aspect-square">
            {/* Price tag moved to top left inside image */}
            <div className="absolute top-4 left-0 z-20">
              <span
                style={{
                  display: "inline-block",
                  background: "#e85d4a",
                  color: "white",
                  fontFamily: "var(--font-hand)",
                  fontSize: 16,
                  fontWeight: 700,
                  padding: "4px 14px 4px 10px",
                  clipPath:
                    "polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)",
                  boxShadow: "2px 2px 6px rgba(0,0,0,0.15)",
                }}
              >
                {formatPrice(item.price)}
              </span>
            </div>

            {item.images?.[0] ? (
              <Image
                src={item.images[0]}
                alt={item.name}
                fill
                sizes="280px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl">
                🕯️
              </div>
            )}

            {/* Close overlay when expanded */}
            {item.customizable && (
              <div
                className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
                style={{
                  background: "rgba(232,93,74,0.08)",
                  opacity: expanded ? 1 : 0,
                }}
              >
                <div className="w-9 h-9 rounded-full bg-white/80 flex items-center justify-center shadow-md">
                  <X size={15} className="text-coral-600" />
                </div>
              </div>
            )}
          </div>

          {/* Caption */}
          <p
            className="absolute left-0 right-0 text-center leading-tight px-2 line-clamp-1"
            style={{
              bottom: 16,
              fontFamily: "var(--font-hand)",
              fontSize: 18,
              color: "#3b1f0a",
            }}
          >
            {item.name}
          </p>

          {/* Customisable badge — small pill inside polaroid */}
          {item.customizable && (
            <div className="absolute bottom-12 right-2 z-20">
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 3,
                  background: expanded ? "#7c5c3a" : "#e85d4a",
                  color: "white",
                  fontFamily: "var(--font-serif)",
                  fontSize: 8.5,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "2px 6px",
                  borderRadius: 999,
                  transition: "background 0.2s",
                }}
              >
                {expanded ? <X size={7} /> : <Wrench size={7} />}
                {expanded ? "close" : "customise"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Options panel — tape-fastened index card (paper item = tape fastener) */}
      <AnimatePresence>
        {expanded && item.customizable && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full overflow-hidden"
            style={{ maxWidth: 320, marginTop: 14 }}
          >
            <div className="relative pt-6 pb-2 px-1">
              {/* Tape holding the options card (cellotape for paper/card items) */}
              <Tape
                color={tapeForIndex(idx)}
                width={90}
                height={28}
                rotate={-2}
                className="absolute top-2 left-1/2 -translate-x-1/2 z-20"
              />

              {/* Index card ruled background */}
              <div
                className="relative overflow-hidden rounded-md"
                style={{
                  background: "#fffdf7",
                  backgroundImage:
                    "repeating-linear-gradient(transparent 0 23px, rgba(30,64,175,0.14) 23px 24px)",
                  boxShadow: "2px 6px 16px rgba(0,0,0,0.28)",
                  padding: "16px 14px 14px",
                }}
              >
                {/* Red margin line */}
                <div
                  className="absolute top-0 bottom-0"
                  style={{
                    left: 30,
                    width: 1,
                    background: "rgba(232,93,74,0.4)",
                  }}
                />

                <p
                  className="mb-4 pl-6"
                  style={{
                    fontFamily: "var(--font-hand)",
                    fontSize: 24,
                    color: "#3b1f0a",
                  }}
                >
                  customise ✦
                </p>

                {item.customizationOptions &&
                item.customizationOptions.length > 0 ? (
                  <div className="flex flex-col gap-3 pl-6">
                    {item.customizationOptions.map((opt) => (
                      <OptionField
                        key={opt.id}
                        opt={opt}
                        value={customizations[opt.id] ?? ""}
                        onChange={(val) => onCustomize(opt.id, val)}
                      />
                    ))}
                  </div>
                ) : (
                  <p
                    className="pl-6 italic"
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 12,
                      color: "#7c5c3a",
                    }}
                  >
                    Visit product page to customise.
                  </p>
                )}

                <Link
                  href={`/products/${item.slug}`}
                  className="mt-5 ml-6 inline-flex items-center gap-1 text-[13px] font-bold text-coral-600 hover:text-coral-700 transition-colors"
                  style={{
                    fontFamily: "var(--font-serif)",
                    letterSpacing: "0.05em",
                  }}
                >
                  <ArrowRight size={10} /> Open product →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Notebook Description ─── */
interface NotebookDescriptionProps {
  set: GiftSet;
  items: Product[];
  customizations: Customizations;
  onCustomiseClick: () => void;
}

function NotebookDescription({
  set,
  items,
  customizations,
  onCustomiseClick,
}: NotebookDescriptionProps) {
  const hasAnyCustomizable = items.some((i) => i.customizable);
  const individualTotal = items.reduce((s, i) => s + i.price, 0);

  return (
    <div className="relative my-6 bg-[#fdfbf7] dark:bg-[#1c1710] rounded-lg shadow-lg border border-cream-200 dark:border-amber-900/30 overflow-hidden">
      <div
        className="notebook-page-container relative p-8 pl-12 sm:p-10 sm:pl-16"
        style={
          {
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0, transparent 31px, rgba(147, 197, 253, 0.2) 32px)",
            backgroundSize: "100% 32px",
            "--notebook-hole-color": "rgba(0,0,0,0.08)",
          } as React.CSSProperties
        }
      >
        <style>{`.dark .notebook-page-container { --notebook-hole-color: rgba(255,255,255,0.08); }`}</style>
        <div className="absolute top-0 left-10 bottom-0 w-px bg-red-200/70 dark:bg-red-500/20" />
        <div
          className="absolute top-0 left-4 bottom-0 w-2 bg-repeat-y"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, transparent 2px, var(--notebook-hole-color) 2px, var(--notebook-hole-color) 3px, transparent 3px)",
            backgroundSize: "100% 32px",
            backgroundPosition: "0px 16px",
          }}
        />

        {set.description && (
          <div
            className="prose dark:prose-invert max-w-none text-brown-800 dark:text-amber-100/80 [&>p]:mt-0 [&>p]:mb-[32px] relative z-10"
            style={{
              fontFamily: "var(--font-hand)",
              fontSize: "26px",
              lineHeight: "32px",
            }}
          >
            <p>{set.description}</p>
          </div>
        )}

        <div className="mt-10 relative z-10">
          <h3 className="font-serif font-bold text-brown-900 dark:text-amber-100 text-2xl mb-8">
            ✦ what&apos;s inside
          </h3>
          <div className="flex flex-col gap-8">
            {items.map((item, idx) => {
              const opts = item.customizationOptions ?? [];
              const vals = customizations[item.id] ?? {};
              return (
                <div key={item.id} className="flex gap-6 items-start">
                  <div
                    className="relative shrink-0 craft-polaroid"
                    style={{
                      width: 90,
                      padding: "6px 6px 18px",
                      transform: `rotate(${idx % 2 === 0 ? -3 : 4}deg)`,
                    }}
                  >
                    <Tape
                      color={tapeForIndex(idx)}
                      width={46}
                      height={16}
                      rotate={idx % 2 === 0 ? 2 : -2}
                      className="absolute -top-3 left-1/2 -translate-x-1/2 z-20"
                    />
                    <div className="relative z-0 bg-[#f5ecda] dark:bg-amber-950/60 w-full aspect-square overflow-hidden">
                      {item.images?.[0] ? (
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          fill
                          sizes="78px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          🕯️
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center flex-wrap gap-2 mb-1.5">
                      <span
                        style={{
                          fontFamily: "var(--font-hand)",
                          fontSize: 24,
                          lineHeight: 1,
                        }}
                        className="text-brown-900 dark:text-amber-100"
                      >
                        {item.name}
                      </span>
                      <span className="font-serif font-bold text-brown-700 dark:text-amber-100/80 text-[15px] ml-1">
                        {formatPrice(item.price)}
                      </span>
                      {item.customizable && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 2,
                            background: "#e85d4a",
                            color: "white",
                            fontFamily: "var(--font-serif)",
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            padding: "2px 6px",
                            borderRadius: 999,
                            transform: "translateY(-2px)",
                          }}
                        >
                          <Wrench size={8} /> customisable
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <div className="relative group cursor-default mb-2.5">
                        <div
                          className="text-[13px] text-brown-600 dark:text-amber-100/70 font-serif italic line-clamp-2 hover:line-clamp-none transition-all duration-300 hover:text-brown-800 dark:hover:text-amber-100/90 leading-relaxed pr-6"
                          dangerouslySetInnerHTML={{ __html: item.description }}
                        />
                        <Info
                          size={14}
                          className="absolute right-0 top-1 text-brown-400/50 dark:text-amber-100/30 opacity-60 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    )}
                    {opts.map((opt) => (
                      <p
                        key={opt.id}
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: 14,
                          fontStyle: "italic",
                        }}
                        className="text-brown-500 dark:text-amber-100/60 leading-snug mb-1"
                      >
                        {opt.label}:{" "}
                        <span className="text-coral-700 dark:text-amber-400">
                          {vals[opt.id] || (
                            <span className="opacity-50">default</span>
                          )}
                        </span>
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pricing Summary */}
          <div className="mt-8 pt-6 border-t border-dashed border-[rgba(122,80,40,0.2)] dark:border-amber-900/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-brown-500 dark:text-amber-100/60 font-serif italic text-[14px]">
                  Bought separately:
                </span>
                <span className="text-brown-400 dark:text-amber-100/50 line-through font-serif text-[15px]">
                  {formatPrice(individualTotal)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-brown-800 dark:text-amber-100 font-serif italic text-[16px] font-medium">
                  Set price:
                </span>
                <span className="text-brown-900 dark:text-amber-50 font-black font-serif text-[20px]">
                  {formatPrice(set.price)}
                </span>
              </div>
            </div>
            {set.saving > 0 && (
              <span
                style={{
                  display: "inline-block",
                  background: "var(--home-coral, #e85d4a)",
                  color: "white",
                  fontFamily: "var(--font-hand)",
                  fontSize: 18,
                  letterSpacing: "0.08em",
                  fontWeight: 700,
                  padding: "4px 18px 4px 10px",
                  clipPath:
                    "polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)",
                  lineHeight: 1.3,
                }}
              >
                You save {formatPrice(set.saving)}
              </span>
            )}
          </div>

          {hasAnyCustomizable && (
            <div className="mt-8">
              <button
                onClick={onCustomiseClick}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 border-2 border-amber-300 text-amber-800 dark:text-amber-300 bg-amber-50/50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 group shadow-sm hover:-translate-y-0.5"
              >
                <Wrench
                  size={16}
                  className="group-hover:rotate-12 transition-transform text-amber-600 dark:text-amber-400"
                />
                Tweak the whole set
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Customization summary ─── */
interface CustomizeSummaryProps {
  items: Product[];
  customizations: Customizations;
  onEdit: () => void;
}

function CustomizeSummary({
  items,
  customizations,
  onEdit,
}: CustomizeSummaryProps) {
  const customizableItems = items.filter(
    (i) => i.customizable && i.customizationOptions?.length,
  );
  if (!customizableItems.length) return null;

  return (
    <div className="relative mt-3 mb-1">
      <Tape
        color="mint"
        width={62}
        height={18}
        rotate={2}
        className="absolute -top-2 right-7 z-10"
      />
      <div
        style={{
          background: "#f0f8ee",
          border: "1.5px solid rgba(45,106,79,0.22)",
          boxShadow: "2px 4px 14px rgba(0,0,0,0.08)",
          padding: "14px 16px",
          transform: "rotate(0.3deg)",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-forest-600" />
            <p
              style={{
                fontFamily: "var(--font-hand)",
                fontSize: 16,
                color: "#2d6a4f",
              }}
            >
              your customisations
            </p>
          </div>
          <button
            onClick={onEdit}
            className="text-[10px] font-serif text-coral-500 hover:text-coral-700 underline transition-colors"
          >
            edit
          </button>
        </div>

        {customizableItems.map((item) => {
          const vals = customizations[item.id] ?? {};
          const opts = item.customizationOptions ?? [];
          return (
            <div key={item.id} className="mb-2 last:mb-0">
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#3b1f0a",
                  letterSpacing: "0.06em",
                }}
              >
                {item.name}
              </p>
              {opts.map((opt) => (
                <p
                  key={opt.id}
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 11,
                    color: "#7c5c3a",
                    fontStyle: "italic",
                  }}
                >
                  {opt.label}:{" "}
                  <span style={{ color: "#e85d4a", fontWeight: 600 }}>
                    {vals[opt.id] || "—"}
                  </span>
                </p>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Bulletin board ─── */
interface BulletinBoardProps {
  items: Product[];
  saving: number;
  individualTotal: number;
  customizations: Customizations;
  onCustomize: (itemId: string, optionId: string, value: string) => void;
  onDone: () => void;
}

function BulletinBoard({
  items,
  saving,
  individualTotal,
  customizations,
  onCustomize,
  onDone,
}: BulletinBoardProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const toggle = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mb-10 relative"
    >
      <div
        className="overflow-hidden rounded-lg relative"
        style={{
          border: "16px solid #8b5a2b",
          borderTopColor: "#9c6633",
          borderBottomColor: "#6b441f",
          borderLeftColor: "#7e5227",
          borderRightColor: "#7e5227",
          boxShadow:
            "inset 0 0 80px rgba(60,30,10,0.4), inset 0 0 10px rgba(0,0,0,0.5), 0 20px 50px rgba(0,0,0,0.3)",
          background: "#f3e1c9",
          backgroundImage: [
            "radial-gradient(circle 1.5px at 5px 7px,   rgba(120,80,40,0.15) 1.5px, transparent 1.5px)",
            "radial-gradient(circle 2px   at 14px 16px, rgba(120,80,40,0.1) 2px,   transparent 2px)",
            "radial-gradient(circle 1px   at 20px 5px,  rgba(120,80,40,0.2) 1px,   transparent 1px)",
            "radial-gradient(circle 1.5px at 24px 20px, rgba(120,80,40,0.12) 1.5px, transparent 1.5px)",
          ].join(", "),
          backgroundSize: "28px 28px, 28px 28px, 28px 28px, 28px 28px",
        }}
      >
        {/* Dark mode overlay */}
        <div
          className="hidden dark:block absolute inset-0 pointer-events-none"
          style={{ background: "rgba(30,15,5,0.65)", zIndex: 0 }}
        />

        {/* Pennants */}
        <div className="relative z-10">
          <Pennants />
        </div>

        {/* Board content */}
        <div className="relative z-10 px-6 pt-10 pb-10">
          {/* Title strip — paper slip */}
          <div className="flex justify-center mb-14">
            <div className="relative">
              <div
                style={{
                  background: "#fdfbf0",
                  padding: "8px 32px",
                  transform: "rotate(-0.8deg)",
                  boxShadow: "2px 4px 12px rgba(0,0,0,0.22)",
                  whiteSpace: "nowrap",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-hand)",
                    fontSize: 36,
                    color: "#2d1a08",
                    lineHeight: 1,
                  }}
                >
                  Customise your gift ✦
                </h3>
              </div>
            </div>
          </div>

          {/* Helper note */}
          <div className="flex justify-center mb-10">
            <div className="relative">
              <p
                style={{
                  background: "#fdfbf0",
                  padding: "8px 20px",
                  fontFamily: "var(--font-hand)",
                  fontSize: 20,
                  color: "#7c5c3a",
                  boxShadow: "1px 3px 8px rgba(0,0,0,0.15)",
                  transform: "rotate(0.5deg)",
                }}
              >
                Tap an item to personalise its details
              </p>
            </div>
          </div>

          {/* Items grid — larger polaroids */}
          <div
            className="grid gap-x-8 gap-y-18"
            style={{
              gridTemplateColumns: `repeat(${Math.min(items.length, 3)}, minmax(0, 1fr))`,
              gap: "2rem 2rem",
            }}
          >
            {items.map((it, idx) => (
              <ItemCard
                key={it.id}
                item={it}
                idx={idx}
                expanded={expandedId === it.id}
                onToggle={() => toggle(it.id)}
                customizations={customizations[it.id] ?? {}}
                onCustomize={(optId, val) => onCustomize(it.id, optId, val)}
              />
            ))}
          </div>

          {/* Savings receipt strip */}
          {saving > 0 && (
            <div className="flex justify-center mt-16 w-full px-4">
              <div className="relative w-full max-w-2xl">
                <div
                  style={{
                    background: "#fdfbf0",
                    padding: "12px 24px",
                    transform: "rotate(0.5deg)",
                    boxShadow: "2px 4px 12px rgba(0,0,0,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: "8px 14px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-hand)",
                      fontSize: 20,
                      color: "#7c5c3a",
                    }}
                  >
                    buy separately you would have paid{" "}
                    <span
                      style={{
                        textDecoration: "line-through",
                        color: "#b08060",
                        marginLeft: 4,
                      }}
                    >
                      {formatPrice(individualTotal)}
                    </span>
                  </span>
                  <span className="hidden sm:inline text-brown-300 dark:text-amber-900/30">
                    ·
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-hand)",
                      fontSize: 20,
                      color: "#7c5c3a",
                    }}
                  >
                    now you just need to pay{" "}
                    <span
                      style={{
                        fontWeight: 700,
                        color: "#e85d4a",
                        marginLeft: 4,
                        fontSize: 22,
                      }}
                    >
                      {formatPrice(individualTotal - saving)}
                    </span>
                  </span>
                  <span className="hidden md:inline text-brown-300 dark:text-amber-900/30">
                    ·
                  </span>
                  <span
                    style={{
                      display: "inline-block",
                      background: "#e85d4a",
                      color: "white",
                      fontFamily: "var(--font-hand)",
                      fontSize: 16,
                      fontWeight: 700,
                      padding: "3px 14px 3px 9px",
                      clipPath:
                        "polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%)",
                    }}
                  >
                    You save {formatPrice(saving)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Done button */}
          <div className="flex justify-center mt-10">
            <button
              onClick={onDone}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-lg active:scale-95 bg-coral-600 hover:bg-coral-700 text-white shadow-coral-200/50 dark:bg-amber-600 dark:hover:bg-amber-700 dark:shadow-amber-900/30"
              style={{
                fontFamily: "var(--font-serif)",
              }}
            >
              <CheckCircle2 size={16} />
              Save customisations &amp; continue
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main page ─── */
export default function GiftSetDetailPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();

  const [set, setSet] = useState<GiftSet | null>(null);
  const [loading, setLoading] = useState(true);
  const loadPremade = useGiftBuilderStore((s) => s.loadPremade);
  const { addToCart } = useStore();

  const [added, setAdded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showBoard, setShowBoard] = useState(false);
  const [customizeDone, setCustomizeDone] = useState(false);
  const [customizations, setCustomizations] = useState<Customizations>({});

  useEffect(() => {
    fetch("/api/gift-sets")
      .then((r) => r.json())
      .then(async (sets: GiftSet[]) => {
        const matched = sets.find((s) => s.slug === slug);
        if (!matched) return null;
        const detail = await fetch(`/api/gift-sets/${matched.id}`).then((r) =>
          r.json(),
        );
        return detail as GiftSet;
      })
      .then((s) => {
        setSet(s);
        if (s?.items) {
          const defaults: Customizations = {};
          (s.items as Product[]).forEach((item) => {
            if (item.customizable && item.customizationOptions?.length) {
              defaults[item.id] = {};
              item.customizationOptions.forEach((opt: CustomizationOption) => {
                defaults[item.id][opt.id] =
                  opt.type === "select" && opt.options?.length
                    ? opt.options[0]
                    : "";
              });
            }
          });
          setCustomizations(defaults);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleUpdateCustomization = useCallback(
    (itemId: string, optionId: string, value: string) => {
      setCustomizations((prev) => ({
        ...prev,
        [itemId]: { ...prev[itemId], [optionId]: value },
      }));
    },
    [],
  );

  const handleBoardDone = () => {
    setShowBoard(false);
    setCustomizeDone(true);
  };

  const handleOpenBoard = () => {
    setShowBoard(true);
    setCustomizeDone(false);
    // Scroll to board
    setTimeout(() => {
      document
        .getElementById("bulletin-board")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const syntheticProduct = set
    ? {
        id: `giftset-${set.id}`,
        name: set.name,
        slug: set.slug,
        description: set.description || set.tagline || "",
        price: set.price,
        compareAtPrice: set.price + set.saving,
        categoryId: "",
        images: set.image ? [set.image] : [],
        tags: set.occasions,
        inStock: true,
        stockCount: 999,
        featured: false,
        customizable: false,
        createdAt: set.createdAt,
        updatedAt: set.updatedAt,
      }
    : null;

  const handleAddToCart = () => {
    if (!set || !syntheticProduct) return;
    const items = set.items ?? [];
    const giftSetData: CartGiftSet = {
      kind: "premade",
      setId: set.id,
      picks: items.map((p) => {
        let mappedCustomizations: Record<string, string> | undefined =
          undefined;
        if (
          customizations[p.id] &&
          Object.keys(customizations[p.id]).length > 0
        ) {
          mappedCustomizations = {};
          for (const [optId, val] of Object.entries(customizations[p.id])) {
            const optLabel =
              p.customizationOptions?.find((o) => o.id === optId)?.label ||
              optId;
            mappedCustomizations[optLabel] = val;
          }
        }
        return {
          id: p.id,
          qty: 1,
          name: p.name,
          image: p.images?.[0] ?? "",
          price: p.price,
          customization: mappedCustomizations,
        };
      }),
      ribbon: "cream",
      box: "kraft",
      card: { style: "card-min", recipient: "", note: "" },
    };
    addToCart(syntheticProduct as any, 1, undefined, giftSetData);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleCustomise = () => {
    if (!set?.items) return;
    loadPremade(set.items.map((i) => i.id));
    router.push("/custom/gift-set");
  };

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="bg-[var(--home-bg-alt)] dark:bg-[#1a1612] min-h-screen pt-10 lg:pt-16 pb-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12">
          <div className="h-4 bg-cream-200 dark:bg-amber-900/20 rounded w-48 mb-14 animate-pulse" />
          <div className="animate-pulse grid lg:grid-cols-2 gap-12 xl:gap-16">
            <div className="aspect-square bg-cream-200 dark:bg-amber-900/20 rounded-3xl" />
            <div className="space-y-6 pt-4">
              <div className="h-6 bg-cream-200 dark:bg-amber-900/20 rounded w-1/4" />
              <div className="h-12 bg-cream-200 dark:bg-amber-900/20 rounded w-3/4" />
              <div className="h-8 bg-cream-200 dark:bg-amber-900/20 rounded w-1/4" />
              <div className="h-40 bg-cream-200 dark:bg-amber-900/20 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!set) {
    return (
      <div className="bg-[var(--home-bg-alt)] dark:bg-[#1a1612] max-w-[1440px] mx-auto px-4 py-20 text-center min-h-screen">
        <p className="text-brown-500 dark:text-amber-100/60 text-lg mb-4">
          Gift set not found.
        </p>
        <Link
          href="/gift-sets"
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 border border-brown-300 dark:border-amber-900/30 rounded-xl text-sm font-semibold text-brown-900 dark:text-amber-100 hover:border-amber-400"
        >
          Back to gift sets
        </Link>
      </div>
    );
  }

  const items = set.items ?? [];
  const individualTotal = items.reduce((s, i) => s + i.price, 0);
  const hasCustomizable = items.some((i) => i.customizable);

  const allImages = [
    { id: "set-main", url: set.image, alt: set.name, fallback: "🎁" },
    ...items.map((it) => ({
      id: it.id,
      url: it.images?.[0],
      alt: it.name,
      fallback: "🕯️",
    })),
  ];
  const currentView = allImages[activeIndex] || allImages[0];

  return (
    <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10 lg:py-16">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Gift Sets", href: "/gift-sets" },
              { label: set.name },
            ]}
          />
        </div>

        {/* ── Two-column hero ── */}
        <div className="grid lg:grid-cols-12 gap-12 xl:gap-16 mb-16">
          {/* ── Image column ── */}
          <div className="space-y-6 min-w-0 w-full lg:col-span-5">
            <div className="relative mt-6">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="craft-polaroid mx-auto lg:mx-0"
                style={{ padding: "14px", maxWidth: 520 }}
              >
                <Tape
                  color="amber"
                  width={140}
                  height={30}
                  rotate={45}
                  className="absolute -right-10 -top-0.5 z-20"
                />

                <div className="relative bg-[#f5ecda] dark:bg-amber-950/60 overflow-hidden w-full aspect-square">
                  {currentView.url ? (
                    <Image
                      src={currentView.url}
                      alt={currentView.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[80px]">
                      {currentView.fallback}
                    </div>
                  )}
                </div>

                <p
                  className="text-center text-brown-500 dark:text-amber-100/50 mt-3 px-2 leading-snug line-clamp-1"
                  style={{ fontFamily: "var(--font-hand)", fontSize: 30 }}
                >
                  {set.name}
                </p>
              </motion.div>
            </div>

            {/* Thumbnail strip */}
            {allImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pt-4 pb-4 px-2 scrollbar-hide justify-center lg:justify-start">
                {allImages.map((img, i) => (
                  <button
                    key={`${img.id}-${i}`}
                    onClick={() => setActiveIndex(i)}
                    className="relative shrink-0 craft-polaroid transition-all duration-200 hover:-translate-y-1"
                    style={{
                      padding: "6px 6px 16px",
                      width: 80,
                      opacity: activeIndex === i ? 1 : 0.5,
                      transform:
                        activeIndex === i
                          ? `scale(1.1) rotate(${i % 2 === 0 ? -1 : 2}deg)`
                          : `rotate(${i % 2 === 0 ? -3 : 3}deg)`,
                    }}
                    aria-label={`View image ${i + 1}`}
                  >
                    <svg
                      width="14"
                      height="28"
                      viewBox="0 0 32 64"
                      fill="none"
                      className="absolute top-[-10px] left-3 z-10 drop-shadow-sm"
                      style={{
                        transform: `rotate(${[-12, 15, -8, 6, -15, 10][i % 6]}deg)`,
                      }}
                    >
                      <path
                        d="M14 42 V 16 A 6 6 0 0 1 26 16 V 48 A 11 11 0 0 1 4 48 V 16"
                        stroke={
                          [
                            "#9ca3af",
                            "#d4b896",
                            "#e85d4a",
                            "#6b7280",
                            "#93c5fd",
                            "#a78bfa",
                          ][i % 6]
                        }
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div
                      className="relative bg-[#f5ecda] dark:bg-amber-950/60 overflow-hidden"
                      style={{ width: 64, height: 64 }}
                    >
                      {img.url ? (
                        <Image
                          src={img.url}
                          alt={img.alt}
                          fill
                          sizes="66px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          {img.fallback}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Details column ── */}
          <div className="lg:py-2 min-w-0 w-full flex flex-col gap-4 lg:col-span-7">
            {/* Occasion tags */}
            <div className="flex flex-wrap items-center gap-2">
              {set.occasions.map((occ) => (
                <span
                  key={occ}
                  className="inline-flex items-center bg-[#f5ecda] dark:bg-amber-950/40 text-brown-700 dark:text-amber-100/60 border border-[rgba(122,80,40,0.22)] dark:border-amber-900/25 text-[11px] font-semibold uppercase tracking-[0.18em]"
                  style={{
                    clipPath:
                      "polygon(10px 0, 100% 0, 100% 100%, 10px 100%, 0 50%)",
                    padding: "4px 12px 4px 18px",
                    fontFamily: "var(--font-serif)",
                  }}
                >
                  {occ}
                </span>
              ))}
            </div>

            <h1
              className="font-bold text-brown-900 dark:text-amber-100 leading-[1.08]"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(28px, 4vw, 46px)",
              }}
            >
              {set.name}
            </h1>

            {set.tagline && (
              <p className="font-serif italic text-xl text-coral-600 dark:text-amber-400">
                &ldquo;{set.tagline}&rdquo;
              </p>
            )}

            {/* Price block */}
            <div className="flex items-baseline gap-3">
              <span
                className="font-black text-brown-900 dark:text-amber-100"
                style={{ fontFamily: "var(--font-serif)", fontSize: 38 }}
              >
                {formatPrice(set.price)}
              </span>
              {set.saving > 0 && (
                <>
                  <span
                    className="text-brown-400 dark:text-amber-100/40 line-through"
                    style={{ fontFamily: "var(--font-serif)", fontSize: 18 }}
                  >
                    {formatPrice(individualTotal)}
                  </span>
                  <span
                    style={{
                      display: "inline-block",
                      background: "#e85d4a",
                      color: "white",
                      fontFamily: "var(--font-hand)",
                      fontSize: 20,
                      letterSpacing: "0.08em",
                      fontWeight: 700,
                      padding: "4px 18px 4px 10px",
                      clipPath:
                        "polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)",
                      lineHeight: 1.3,
                    }}
                  >
                    Save {formatPrice(set.saving)}
                  </span>
                </>
              )}
            </div>

            {/* Notebook Description replacing the simple description & peek inside card */}
            {items.length > 0 && (
              <NotebookDescription
                set={set}
                items={items}
                customizations={customizations}
                onCustomiseClick={handleOpenBoard}
              />
            )}

            {/* Customization summary (shown after board done) */}
            {customizeDone && (
              <CustomizeSummary
                items={items}
                customizations={customizations}
                onEdit={handleOpenBoard}
              />
            )}

            {/* CTAs */}
            <div className="flex flex-col gap-3 mt-2">
              <button
                onClick={handleAddToCart}
                className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-base transition-all duration-200 shadow-lg hover:-translate-y-0.5 ${
                  added
                    ? "bg-green-600 text-white shadow-green-200 dark:shadow-green-900/30"
                    : "bg-coral-600 hover:bg-coral-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white shadow-coral-200 dark:shadow-amber-900/30"
                }`}
              >
                {added ? (
                  "Added to Cart ✓"
                ) : (
                  <>
                    <Gift size={17} />
                    {customizeDone
                      ? "Add Customised Gift to Cart"
                      : "Add to Cart"}{" "}
                    — {formatPrice(set.price)}
                  </>
                )}
              </button>

              {hasCustomizable && !showBoard && (
                <button
                  onClick={handleOpenBoard}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 border-2 border-dashed border-amber-400 text-amber-800 dark:text-amber-300 bg-amber-50/40 dark:bg-amber-900/10 hover:bg-amber-50 dark:hover:bg-amber-900/20 group"
                >
                  <Wrench
                    size={15}
                    className="group-hover:rotate-12 transition-transform"
                  />
                  {customizeDone
                    ? "Edit customisations"
                    : "Customise this gift set"}
                  <ChevronDown size={14} />
                </button>
              )}

              {showBoard && (
                <button
                  onClick={handleCustomise}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 border border-amber-300/50 text-amber-700 dark:text-amber-400 bg-transparent hover:bg-amber-50/30"
                >
                  <Sparkles size={14} /> Build a fully custom set instead
                </button>
              )}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-10 pt-5 border-t border-dashed border-[rgba(122,80,40,0.2)] dark:border-amber-900/20 mt-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center shrink-0">
                  <Truck
                    size={16}
                    className="text-amber-700 dark:text-amber-400"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brown-900 dark:text-amber-100">
                    Free Shipping
                  </p>
                  <p className="text-xs text-brown-500 dark:text-amber-100/60">
                    Includes gift wrap &amp; note
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center shrink-0">
                  <RotateCcw
                    size={16}
                    className="text-amber-700 dark:text-amber-400"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brown-900 dark:text-amber-100">
                    Easy Returns
                  </p>
                  <p className="text-xs text-brown-500 dark:text-amber-100/60">
                    48-hour return policy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bulletin board — shown when customize clicked ── */}
        <div id="bulletin-board">
          <AnimatePresence>
            {showBoard && items.length > 0 && (
              <BulletinBoard
                items={items}
                saving={set.saving}
                individualTotal={individualTotal}
                customizations={customizations}
                onCustomize={handleUpdateCustomization}
                onDone={handleBoardDone}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
