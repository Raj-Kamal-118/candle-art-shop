"use client";

import { useState } from "react";
import { QrCode, Truck, CheckCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

interface PaymentStepProps {
  total: number;
  onSubmit: (method: "cod" | "qr") => void;
  loading?: boolean;
}

export default function PaymentStep({
  total,
  onSubmit,
  loading = false,
}: PaymentStepProps) {
  const [method, setMethod] = useState<"cod" | "qr">("qr");

  return (
    <div className="space-y-6">
      <h3 className="font-serif text-xl font-bold text-brown-900">
        Select Payment Method
      </h3>

      {/* Payment options */}
      <div className="space-y-3">
        {/* QR Code */}
        <label
          className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
            method === "qr"
              ? "border-amber-500 bg-amber-50"
              : "border-cream-200 bg-white hover:border-amber-300"
          }`}
        >
          <input
            type="radio"
            name="payment"
            value="qr"
            checked={method === "qr"}
            onChange={() => setMethod("qr")}
            className="mt-0.5 accent-amber-600"
          />
          <QrCode className="text-amber-600 shrink-0 mt-0.5" size={22} />
          <div>
            <p className="font-semibold text-brown-900 text-sm">
              QR Code Payment
            </p>
            <p className="text-brown-500 text-xs mt-0.5">
              Scan the QR code to pay instantly via your preferred payment app.
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
            onChange={() => setMethod("cod")}
            className="mt-0.5 accent-amber-600"
          />
          <Truck className="text-amber-600 shrink-0 mt-0.5" size={22} />
          <div>
            <p className="font-semibold text-brown-900 text-sm">
              Cash on Delivery
            </p>
            <p className="text-brown-500 text-xs mt-0.5">
              Pay when your order arrives at your door. No upfront payment
              required.
            </p>
          </div>
        </label>
      </div>

      {/* QR Code display */}
      {method === "qr" && (
        <div className="bg-white rounded-xl border border-cream-200 p-6 text-center">
          <p className="text-sm font-medium text-brown-700 mb-4">
            Scan to pay {formatPrice(total)}
          </p>
          <div className="inline-block p-4 bg-cream-50 rounded-xl border border-cream-200">
            {/* Simulated QR code */}
            <div className="w-40 h-40 grid grid-cols-8 gap-0.5">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-sm ${
                    [
                      0, 1, 2, 3, 4, 5, 6, 7, 14, 21, 28, 35, 42, 49, 56, 57,
                      58, 59, 60, 61, 62, 63, 8, 15, 22, 29, 36, 43, 50,
                      9, 11, 13, 18, 20, 24, 26, 38, 40, 45, 47, 54, 53, 52, 51,
                    ].includes(i)
                      ? "bg-brown-900"
                      : "bg-white"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-brown-400 mt-3">
            Supported: UPI, Google Pay, PhonePe, Paytm
          </p>
        </div>
      )}

      <Button
        size="lg"
        className="w-full"
        onClick={() => onSubmit(method)}
        loading={loading}
      >
        <CheckCircle size={18} />
        Place Order · {formatPrice(total)}
      </Button>
    </div>
  );
}
