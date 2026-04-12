"use client";

import { CreditCard, Truck, CheckCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

interface PaymentStepProps {
  total: number;
  method: "cod" | "online";
  onMethodChange: (method: "cod" | "online") => void;
  onSubmit: () => void;
  loading?: boolean;
}

export default function PaymentStep({
  total,
  method,
  onMethodChange,
  onSubmit,
  loading = false,
}: PaymentStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="font-serif text-xl font-bold text-brown-900">
        Select Payment Method
      </h3>

      {/* Payment options */}
      <div className="space-y-3">
        {/* PhonePe / Online Payment */}
        <label
          className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
            method === "online"
              ? "border-amber-500 bg-amber-50"
              : "border-cream-200 bg-white hover:border-amber-300"
          }`}
        >
          <input
            type="radio"
            name="payment"
            value="online"
            checked={method === "online"}
            onChange={() => onMethodChange("online")}
            className="mt-0.5 accent-amber-600"
          />
          <CreditCard className="text-amber-600 shrink-0 mt-0.5" size={22} />
          <div>
            <p className="font-semibold text-brown-900 text-sm">
              Pay Online (PhonePe)
            </p>
            <p className="text-brown-500 text-xs mt-0.5">
              Pay securely via UPI, Credit/Debit Cards, or Netbanking.
            </p>
          </div>
        </label>

        {/* Cash on Delivery */}
        <label
          className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
            method === "cod"
              ? "border-amber-500 bg-amber-50"
              : "border-cream-200 bg-white hover:border-amber-300"
          }`}
        >
          <input
            type="radio"
            name="payment"
            value="cod"
            checked={method === "cod"}
            onChange={() => onMethodChange("cod")}
            className="mt-0.5 accent-amber-600"
          />
          <Truck className="text-amber-600 shrink-0 mt-0.5" size={22} />
          <div>
            <p className="font-semibold text-brown-900 text-sm">
              Cash on Delivery
            </p>
            <p className="text-brown-500 text-xs mt-0.5">
              Pay when your order arrives at your door. An additional fee of ₹50
              applies.
            </p>
          </div>
        </label>
      </div>

      <Button size="lg" className="w-full" onClick={onSubmit} loading={loading}>
        <CheckCircle size={18} />
        Place Order · {formatPrice(total)}
      </Button>
    </div>
  );
}
