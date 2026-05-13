"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, ShieldCheck, Package, RotateCcw, Tag } from "lucide-react";
import { formatPrice, getShippingCost, calculateDiscount } from "@/lib/utils";
import { DiscountCode } from "@/lib/types";
import { useStore } from "@/lib/store";

const FREE_SHIPPING_THRESHOLD = 999;
const FREE_CARD_THRESHOLD = 1500;

interface CartSummaryProps {
  subtotal: number;
  showCheckoutButton?: boolean;
}

export default function CartSummary({
  subtotal,
  showCheckoutButton = true,
}: CartSummaryProps) {
  const { currentUser } = useStore();
  const [discountInput, setDiscountInput] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(
    null,
  );
  const [discountError, setDiscountError] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    try {
      const savedDiscount = sessionStorage.getItem("appliedDiscount");
      if (savedDiscount) {
        const parsed = JSON.parse(savedDiscount);
        setAppliedDiscount(parsed.discount);
        setAppliedCode(parsed.code);
      }
    } catch (e) {}
  }, []);

  const discountAmount = appliedDiscount
    ? calculateDiscount(subtotal, appliedDiscount.type, appliedDiscount.value)
    : 0;

  const netSubtotal = subtotal - discountAmount;
  const shipping = getShippingCost(netSubtotal);
  const total = netSubtotal + shipping;

  // Progress towards free shipping (0→999)
  const shippingPct = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const shippingUnlocked = subtotal >= FREE_SHIPPING_THRESHOLD;

  // Progress towards free greeting card (0→1500)
  const cardPct = Math.min((subtotal / FREE_CARD_THRESHOLD) * 100, 100);
  const cardUnlocked = subtotal >= FREE_CARD_THRESHOLD;

  async function handleApply() {
    if (!discountInput.trim()) return;
    setApplying(true);
    setDiscountError("");
    try {
      const res = await fetch("/api/discounts/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: discountInput,
          subtotal,
          userId: currentUser?.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setDiscountError(data.error || "Invalid code");
      } else {
        setAppliedDiscount(data.discount);
        setAppliedCode(discountInput.toUpperCase());
        setDiscountInput("");
        sessionStorage.setItem(
          "appliedDiscount",
          JSON.stringify({
            discount: data.discount,
            code: discountInput.toUpperCase(),
          }),
        );
      }
    } catch {
      setDiscountError("Could not apply code. Please try again.");
    } finally {
      setApplying(false);
    }
  }

  function handleRemoveDiscount() {
    setAppliedCode("");
    setAppliedDiscount(null);
    setDiscountError("");
    sessionStorage.removeItem("appliedDiscount");
  }

  return (
    /* Summary card */
    <div className="bg-white dark:bg-[#1a1830] rounded-lg shadow-[0_14px_30px_rgba(67,44,26,0.12),0_2px_6px_rgba(0,0,0,0.04)] dark:shadow-[0_14px_30px_rgba(0,0,0,0.3)] border border-[rgba(122,80,40,0.15)] dark:border-amber-900/20 relative pt-8 pb-6 px-6">
      {/* Heading */}
      <h3 className="ah-display-md text-[20px] text-brown-900 dark:text-amber-50 font-bold mb-1">
        The{" "}
        <span
          className="text-[26px] text-coral-600 dark:text-amber-400"
          style={{ fontFamily: "var(--font-script)" }}
        >
          total
        </span>
      </h3>
      <p className="font-serif italic text-[13px] text-brown-400 dark:text-amber-100/40 mb-5">
        all in, including any applicable tax
      </p>

      {/* ── Progress bars ── */}
      <div className="space-y-3 mb-5">
        {/* Free shipping */}
        <div className="p-3 rounded-lg border border-forest-300/60 dark:border-forest-700/40 bg-forest-50/50 dark:bg-forest-900/10">
          <div className="flex items-center justify-between mb-1.5">
            <p className="font-serif text-[12px] text-forest-700 dark:text-forest-400">
              {shippingUnlocked ? (
                <span className="font-bold">✓ Free shipping unlocked!</span>
              ) : (
                <>
                  Add{" "}
                  <strong className="text-forest-800 dark:text-forest-300">
                    {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)}
                  </strong>{" "}
                  more for free shipping
                </>
              )}
            </p>
            {shippingUnlocked && (
              <span
                className="text-[15px] text-forest-600 dark:text-forest-400"
                style={{ fontFamily: "var(--font-hand)" }}
              >
                free!
              </span>
            )}
          </div>
          <div className="craft-progress-track">
            <div
              className="craft-progress-fill"
              style={{ width: `${shippingPct}%` }}
            />
          </div>
        </div>

        {/* Free greeting card */}
        <div className="p-3 rounded-lg border  border-amber-300/60 dark:border-amber-700/30 bg-amber-50/50 dark:bg-amber-900/10">
          <div className="flex items-center justify-between mb-1.5">
            <p className="font-serif text-[12px] text-amber-700 dark:text-amber-400">
              {cardUnlocked ? (
                <span className="font-bold">
                  ✓ Free handwritten card included!
                </span>
              ) : (
                <>
                  Add{" "}
                  <strong className="text-amber-800 dark:text-amber-300">
                    {formatPrice(FREE_CARD_THRESHOLD - subtotal)}
                  </strong>{" "}
                  more for a free greeting card
                </>
              )}
            </p>
            {cardUnlocked && (
              <span
                className="text-[15px] text-amber-600 dark:text-amber-400"
                style={{ fontFamily: "var(--font-hand)" }}
              >
                🎴 free!
              </span>
            )}
          </div>
          <div
            className="craft-progress-track"
            style={{ background: "rgba(217,119,6,0.15)" }}
          >
            <div
              className="craft-progress-fill"
              style={{ width: `${cardPct}%`, background: "#d97706" }}
            />
          </div>
        </div>
      </div>

      {/* ── Totals (dotted line style) ── */}
      <div className=" py-4 space-y-2.5">
        <div className="font-serif text-[14px] text-brown-800 flex items-baseline">
          <span className="text-brown-700 dark:text-amber-100/70">
            Subtotal · <span className="italic">items</span>
          </span>
          <span className="craft-dot-line" />
          <span className="font-bold text-brown-900 dark:text-amber-100">
            {formatPrice(subtotal)}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="font-serif text-[14px] flex items-baseline">
            <span className="text-coral-700 dark:text-coral-400">
              {appliedCode} <span className="italic text-[12px]">applied</span>
            </span>
            <span
              className="craft-dot-line"
              style={{ borderColor: "rgba(232,93,74,0.3)" }}
            />
            <span className="font-bold text-coral-700 dark:text-coral-400">
              −{formatPrice(discountAmount)}
            </span>
          </div>
        )}

        <div className="font-serif text-[14px] flex items-baseline">
          <span className="text-brown-700 dark:text-amber-100/70">
            Shipping
          </span>
          <span className="craft-dot-line" />
          {shipping === 0 ? (
            <span
              className="text-[16px] text-forest-600 dark:text-forest-400 font-semibold"
              style={{ fontFamily: "var(--font-hand)" }}
            >
              free!
            </span>
          ) : (
            <span className="font-bold text-brown-900 dark:text-amber-100">
              {formatPrice(shipping)}
            </span>
          )}
        </div>

        <div
          className="flex items-baseline"
          style={{ fontFamily: "var(--font-serif)", fontSize: 14 }}
        >
          <span
            className="text-brown-500 dark:text-amber-100/40"
            style={{ fontStyle: "italic" }}
          >
            Tax (GST · incl.)
          </span>
          <span className="craft-dot-line" />
          <span className="text-brown-400 dark:text-amber-100/40">—</span>
        </div>
      </div>

      {/* Grand total */}
      <div className="flex items-baseline justify-between pt-4 pb-2">
        <span
          className="text-gold-600 dark:text-amber-500 font-bold tracking-widest uppercase"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            letterSpacing: "0.2em",
          }}
        >
          to pay
        </span>
        <div className="text-right">
          <span
            className="font-black text-brown-900 dark:text-amber-50 leading-none"
            style={{ fontFamily: "var(--font-serif)", fontSize: 34 }}
          >
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* ── Discount code ── */}
      <div className="mt-5 mb-2 bg-cream-50 dark:bg-amber-900/10 p-4 sm:p-5 rounded-2xl border border-[rgba(122,80,40,0.15)] dark:border-amber-900/30">
        <h3 className="font-serif text-[18px] font-bold text-brown-900 dark:text-amber-100 mb-1 flex items-center gap-2">
          <Tag size={16} className="text-amber-600 dark:text-amber-400" />
          Got a{" "}
          <span
            className="text-[22px] text-coral-600 dark:text-amber-400"
            style={{ fontFamily: "var(--font-script)" }}
          >
            code?
          </span>
        </h3>
        <p className="font-serif italic text-[12px] text-brown-400 dark:text-amber-100/40 mb-4">
          enter it below — we'll apply it to your order
        </p>

        {appliedDiscount ? (
          <div className="flex items-center justify-between px-4 py-3 bg-coral-50 dark:bg-coral-900/10 border border-dashed border-coral-300 dark:border-coral-700/40 rounded-xl">
            <div>
              <p className="font-sans text-[14px] tracking-[0.06em] font-bold text-coral-800 dark:text-coral-300">
                {appliedCode}
              </p>
              <p className="font-serif italic text-[13px] text-coral-600 dark:text-coral-400 mt-0.5">
                −{formatPrice(discountAmount)} saved ✓
              </p>
            </div>
            <button
              onClick={handleRemoveDiscount}
              className="text-coral-700 dark:text-coral-400 hover:text-coral-800 transition-colors text-xl leading-none ml-3"
              aria-label="Remove discount code"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={discountInput}
              onChange={(e) => setDiscountInput(e.target.value.toUpperCase())}
              placeholder="your code here…"
              className="w-full px-3 py-2 text-sm border border-[rgba(122,80,40,0.3)] dark:border-amber-900/40 rounded-lg bg-white dark:bg-[#1a1830] text-brown-900 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
              onKeyDown={(e) => e.key === "Enter" && handleApply()}
            />
            <button
              onClick={handleApply}
              disabled={applying || !discountInput.trim()}
              className="font-serif text-[13px] px-4 py-2 border border-dashed border-[rgba(122,80,40,0.4)] dark:border-amber-900/40 rounded-lg text-brown-800 dark:text-amber-200 hover:border-coral-500 hover:text-coral-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {applying ? "…" : "apply"}
            </button>
          </div>
        )}
        {discountError && (
          <p className="font-serif italic text-[13px] mt-2 text-coral-600 dark:text-coral-400">
            {discountError}
          </p>
        )}
      </div>

      {/* CTA */}
      {showCheckoutButton && (
        <Link
          href="/checkout"
          className="font-sans text-[15px] tracking-[0.03em] mt-5 flex items-center justify-center gap-3 w-full py-4 rounded-xl font-bold text-white bg-coral-600 hover:bg-coral-700 transition-all duration-200 shadow-[0_10px_24px_rgba(232,93,74,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(232,93,74,0.45)]"
        >
          Take me to checkout
          <ArrowRight size={16} />
        </Link>
      )}

      {/* Trust grid */}
      <div className="mt-5 pt-5 border-t  border-[rgba(122,80,40,0.2)] dark:border-amber-900/20 grid grid-cols-2 gap-2.5">
        {[
          { icon: ShieldCheck, label: "Secure checkout · 256-bit" },
          { icon: RotateCcw, label: "30-day returns, no questions" },
          { icon: Package, label: "Hand-wrapped in cotton" },
          { icon: null, label: "Ships across India" },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="font-serif italic text-[11px] leading-[1.4] flex items-start gap-1.5 text-brown-500 dark:text-amber-100/40"
          >
            {Icon && (
              <Icon
                size={12}
                className="text-coral-600 dark:text-coral-400 shrink-0 mt-0.5"
              />
            )}
            {!Icon && (
              <span className="text-coral-600 dark:text-coral-400 shrink-0 leading-none">
                ❀
              </span>
            )}
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
