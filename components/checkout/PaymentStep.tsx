"use client";

import { useState } from "react";
import {
  CreditCard,
  Truck,
  CheckCircle,
  QrCode,
  ShieldAlert,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

interface PaymentStepProps {
  total: number;
  method: "cod" | "online" | "upi";
  onMethodChange: (method: "cod" | "online" | "upi") => void;
  onSubmit: (paymentData?: {
    transactionId?: string;
    screenshot?: string;
  }) => void;
  loading?: boolean;
  email?: string;
}

export default function PaymentStep({
  total,
  method,
  onMethodChange,
  onSubmit,
  loading = false,
  email,
}: PaymentStepProps) {
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);

  // Using a placeholder UPI ID - update to your actual merchant UPI ID
  const upiId = "9504536836@ybl";
  const upiString = encodeURIComponent(
    `upi://pay?pa=${upiId}&pn=Artisan House&am=${total}&cu=INR`,
  );
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${upiString}`;

  return (
    <div className="space-y-6">
      <h3 className="font-serif text-xl font-bold text-brown-900 dark:text-amber-100">
        Select Payment Method
      </h3>

      {/* Payment options */}
      <div className="space-y-3">
        {/* Disabled Online Payment */}
        <label className="flex items-start gap-4 p-4 rounded-xl border-2 border-cream-200 dark:border-amber-900/30 bg-gray-50 dark:bg-[#12101e] opacity-60 cursor-not-allowed">
          <input
            type="radio"
            name="payment"
            value="online"
            disabled
            className="mt-0.5"
          />
          <CreditCard className="text-gray-400 shrink-0 mt-0.5" size={22} />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-700 dark:text-gray-400 text-sm">
                Pay Online (PhonePe)
              </p>
              <span className="text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Temporarily Down
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-500 text-xs mt-1 leading-relaxed">
              Our payment gateway is facing technical issues. Please use manual
              UPI or COD.
            </p>
          </div>
        </label>

        {/* UPI Payment */}
        <label
          className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
            method === "upi"
              ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-500"
              : "border-cream-200 bg-white dark:bg-[#151326] dark:border-amber-900/30 hover:border-amber-300 dark:hover:border-amber-700/50"
          }`}
        >
          <input
            type="radio"
            name="payment"
            value="upi"
            checked={method === "upi"}
            onChange={() => onMethodChange("upi")}
            className="mt-0.5 accent-amber-600"
          />
          <QrCode className="text-amber-600 shrink-0 mt-0.5" size={22} />
          <div className="flex-1 w-full min-w-0">
            <p className="font-semibold text-brown-900 dark:text-amber-100 text-sm">
              Pay via UPI (QR Code)
            </p>
            <p className="text-brown-500 dark:text-amber-100/60 text-xs mt-0.5">
              Scan and pay using GPay, PhonePe, Paytm, or any UPI app.
            </p>

            {method === "upi" && (
              <div className="mt-4 pt-4 border-t border-amber-200/60 dark:border-amber-800/40">
                <div className="bg-amber-100/50 dark:bg-amber-950/40 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center gap-5">
                  <div className="shrink-0 bg-white p-2 rounded-xl shadow-sm border border-amber-200 dark:border-amber-800/50 self-center">
                    <img
                      src={qrUrl}
                      alt="UPI QR Code"
                      className="w-28 h-28 md:w-32 md:h-32 object-contain"
                    />
                  </div>
                  <div className="flex-1 w-full space-y-3">
                    <p className="text-sm font-medium text-brown-800 dark:text-amber-100/90 leading-snug">
                      1. Scan the QR code to pay{" "}
                      <strong className="font-bold text-brown-900 dark:text-amber-50">
                        {formatPrice(total)}
                      </strong>
                      .
                      <br />
                      <span className="text-xs text-brown-500 dark:text-amber-100/60 mt-1 block">
                        UPI ID:{" "}
                        <span className="font-mono bg-white/60 dark:bg-black/20 px-1 py-0.5 rounded">
                          {upiId}
                        </span>
                      </span>
                    </p>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-brown-700 dark:text-amber-100/70 uppercase tracking-wide">
                        2. Provide Payment Proof
                      </label>
                      <p className="text-xs text-brown-500 dark:text-amber-100/60 mb-2 leading-relaxed">
                        Enter the UTR/Transaction ID <strong>OR</strong> upload
                        a screenshot of your payment.
                      </p>
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g. 312345678901"
                        className="w-full px-3 py-2 text-sm border border-amber-300 dark:border-amber-700/50 rounded-lg bg-white dark:bg-[#1a1830] text-brown-900 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-brown-400/50 dark:placeholder:text-amber-100/30"
                      />
                      <div className="flex items-center gap-3 my-3">
                        <div className="h-px bg-amber-200 dark:bg-amber-800/40 flex-1"></div>
                        <span className="text-[10px] font-bold text-brown-400 dark:text-amber-100/40 uppercase tracking-widest">
                          OR
                        </span>
                        <div className="h-px bg-amber-200 dark:bg-amber-800/40 flex-1"></div>
                      </div>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () =>
                                setScreenshot(reader.result as string);
                              reader.readAsDataURL(file);
                            } else {
                              setScreenshot(null);
                            }
                          }}
                          className="w-full text-sm text-brown-600 dark:text-amber-100/70 file:mr-3 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-white hover:file:bg-amber-600 dark:file:bg-amber-600 dark:file:text-white dark:hover:file:bg-amber-500 file:cursor-pointer transition-colors cursor-pointer file:shadow-sm"
                        />
                        {screenshot && (
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium mt-2 flex items-center gap-1">
                            <CheckCircle size={12} /> Screenshot attached
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-start gap-2.5 p-3 bg-blue-50 dark:bg-blue-900/10 text-blue-800 dark:text-blue-200 rounded-lg text-xs font-medium border border-blue-100 dark:border-blue-800/30 leading-relaxed">
                  <ShieldAlert
                    size={16}
                    className="shrink-0 mt-0.5 text-blue-600 dark:text-blue-400"
                  />
                  <p>
                    <strong>Manual Verification:</strong> Because our payment
                    gateway is down, your order will remain in a pending state
                    until we manually verify this transaction. We will send you
                    an order confirmation email once verified. Sorry for the
                    inconvenience!
                  </p>
                </div>
              </div>
            )}
          </div>
        </label>

        {/* Cash on Delivery */}
        <label
          className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
            method === "cod"
              ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-500"
              : "border-cream-200 bg-white dark:bg-[#151326] dark:border-amber-900/30 hover:border-amber-300 dark:hover:border-amber-700/50"
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
            <p className="font-semibold text-brown-900 dark:text-amber-100 text-sm">
              Cash on Delivery
            </p>
            <p className="text-brown-500 dark:text-amber-100/60 text-xs mt-0.5">
              Pay when your order arrives at your door. An additional fee of ₹50
              applies.
            </p>
          </div>
        </label>
      </div>

      <div className="space-y-2">
        <Button
          size="lg"
          className="w-full"
          onClick={() =>
            onSubmit(
              method === "upi"
                ? { transactionId, screenshot: screenshot || undefined }
                : undefined,
            )
          }
          loading={loading}
          disabled={
            method === "upi" && transactionId.trim().length < 6 && !screenshot
          }
        >
          <CheckCircle size={18} />
          Place Order · {formatPrice(total)}
        </Button>
        <p className="text-center text-[11px] text-brown-400 dark:text-amber-100/40 leading-relaxed px-2">
          By tapping Place Order, you agree to our{" "}
          <a
            href="/informational/terms"
            className="underline underline-offset-2 hover:text-brown-600 dark:hover:text-amber-100/70 transition-colors"
          >
            terms
          </a>
          .
          {email && (
            <>
              {" "}
              We'll send a confirmation to{" "}
              <span className="font-medium text-brown-500 dark:text-amber-100/60">
                {email}
              </span>
              .
            </>
          )}
        </p>
      </div>
    </div>
  );
}
