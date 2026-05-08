"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ShieldCheck, Package, RotateCcw } from "lucide-react";
import { formatPrice, getShippingCost } from "@/lib/utils";

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
  const [discountInput, setDiscountInput] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountError, setDiscountError] = useState("");
  const [applying, setApplying] = useState(false);

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
        body: JSON.stringify({ code: discountInput, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        setDiscountError(data.error || "Invalid code");
      } else {
        const { discount } = data;
        const amount =
          discount.type === "percentage"
            ? Math.round((subtotal * discount.value) / 100)
            : discount.value;
        setDiscountAmount(amount);
        setAppliedCode(discountInput.toUpperCase());
        setDiscountInput("");
      }
    } catch {
      setDiscountError("Could not apply code. Please try again.");
    } finally {
      setApplying(false);
    }
  }

  function handleRemoveDiscount() {
    setAppliedCode("");
    setDiscountAmount(0);
    setDiscountError("");
  }

  return (
    /* Summary card */
    <div className="bg-white dark:bg-[#1a1830] rounded-lg shadow-[0_14px_30px_rgba(67,44,26,0.12),0_2px_6px_rgba(0,0,0,0.04)] dark:shadow-[0_14px_30px_rgba(0,0,0,0.3)] border border-[rgba(122,80,40,0.15)] dark:border-amber-900/20 relative pt-8 pb-6 px-6">
      {/* Heading */}
      <h3
        className="text-brown-900 dark:text-amber-50 font-bold mb-1"
        style={{ fontFamily: "var(--font-serif)", fontSize: 20 }}
      >
        The{" "}
        <span
          className="text-coral-600 dark:text-amber-400"
          style={{ fontFamily: "var(--font-script)", fontSize: 26 }}
        >
          total
        </span>
      </h3>
      <p
        className="text-brown-400 dark:text-amber-100/40 mb-5"
        style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontSize: 13,
        }}
      >
        all in, including any applicable tax
      </p>

      {/* ── Progress bars ── */}
      <div className="space-y-3 mb-5">
        {/* Free shipping */}
        <div className="p-3 rounded-lg border border-forest-300/60 dark:border-forest-700/40 bg-forest-50/50 dark:bg-forest-900/10">
          <div className="flex items-center justify-between mb-1.5">
            <p
              className="text-forest-700 dark:text-forest-400"
              style={{ fontFamily: "var(--font-serif)", fontSize: 12 }}
            >
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
                className="text-forest-600 dark:text-forest-400"
                style={{ fontFamily: "var(--font-hand)", fontSize: 15 }}
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
            <p
              className="text-amber-700 dark:text-amber-400"
              style={{ fontFamily: "var(--font-serif)", fontSize: 12 }}
            >
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
                className="text-amber-600 dark:text-amber-400"
                style={{ fontFamily: "var(--font-hand)", fontSize: 15 }}
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
        <div
          className="flex items-baseline"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 14,
            color: "var(--brown-800)",
          }}
        >
          <span className="text-brown-700 dark:text-amber-100/70">
            Subtotal · <span style={{ fontStyle: "italic" }}>items</span>
          </span>
          <span className="craft-dot-line" />
          <span className="font-bold text-brown-900 dark:text-amber-100">
            {formatPrice(subtotal)}
          </span>
        </div>

        {discountAmount > 0 && (
          <div
            className="flex items-baseline"
            style={{ fontFamily: "var(--font-serif)", fontSize: 14 }}
          >
            <span className="text-coral-700 dark:text-coral-400">
              {appliedCode}{" "}
              <span style={{ fontStyle: "italic", fontSize: 12 }}>applied</span>
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

        <div
          className="flex items-baseline"
          style={{ fontFamily: "var(--font-serif)", fontSize: 14 }}
        >
          <span className="text-brown-700 dark:text-amber-100/70">
            Shipping
          </span>
          <span className="craft-dot-line" />
          {shipping === 0 ? (
            <span
              className="text-forest-600 dark:text-forest-400 font-semibold"
              style={{ fontFamily: "var(--font-hand)", fontSize: 16 }}
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
      <div className="mt-4">
        {appliedCode ? (
          <div className="flex items-center justify-between px-4 py-2.5 bg-coral-50 dark:bg-coral-900/10 border border-dashed border-coral-300 dark:border-coral-700/40 rounded-full">
            <span style={{ fontFamily: "var(--font-serif)", fontSize: 13 }}>
              <strong className="font-mono text-coral-800 dark:text-coral-300">
                {appliedCode}
              </strong>
              <span
                className="text-coral-700 dark:text-coral-400 ml-2"
                style={{ fontStyle: "italic" }}
              >
                · {formatPrice(discountAmount)} saved
              </span>
            </span>
            <button
              onClick={handleRemoveDiscount}
              className="text-coral-700 dark:text-coral-400 hover:text-coral-800 transition-colors ml-3 text-lg leading-none"
              aria-label="Remove discount"
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
              onKeyDown={(e) => e.key === "Enter" && handleApply()}
              placeholder="got a code?"
              className="craft-code-input"
            />
            <button
              onClick={handleApply}
              disabled={applying || !discountInput.trim()}
              className="px-4 py-2 border border-dashed border-[rgba(122,80,40,0.4)] dark:border-amber-900/40 rounded-lg text-brown-800 dark:text-amber-200 hover:border-coral-500 dark:hover:border-amber-400 hover:text-coral-700 dark:hover:text-amber-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontFamily: "var(--font-serif)", fontSize: 13 }}
            >
              {applying ? "…" : "apply"}
            </button>
          </div>
        )}
        {discountError && (
          <p
            className="mt-2 text-xs font-medium text-coral-600 dark:text-coral-400"
            style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
          >
            {discountError}
          </p>
        )}
      </div>

      {/* CTA */}
      {showCheckoutButton && (
        <Link
          href="/checkout"
          className="mt-5 flex items-center justify-center gap-3 w-full py-4 rounded-xl font-bold text-white bg-coral-600 hover:bg-coral-700 transition-all duration-200 shadow-[0_10px_24px_rgba(232,93,74,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(232,93,74,0.45)]"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 15,
            letterSpacing: "0.03em",
          }}
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
            className="flex items-start gap-1.5 text-brown-500 dark:text-amber-100/40"
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: 11,
              lineHeight: 1.4,
            }}
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
