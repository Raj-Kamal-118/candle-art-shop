"use client";

import { useState } from "react";
import { X, Phone, ShieldCheck, Loader2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { User } from "@/lib/types";
import Button from "@/components/ui/Button";

interface OTPLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: User) => void;
  /** Pre-fill the phone field (e.g. from checkout address) */
  prefilledPhone?: string;
  title?: string;
  subtitle?: string;
}

type Step = "phone" | "otp";

export default function OTPLoginModal({
  isOpen,
  onClose,
  onSuccess,
  prefilledPhone = "",
  title = "Login / Sign Up",
  subtitle = "We'll send a 6-digit OTP to verify your number.",
}: OTPLoginModalProps) {
  const { setCurrentUser } = useStore();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState(prefilledPhone);
  const [normalizedPhone, setNormalizedPhone] = useState("");
  const [devOTP, setDevOTP] = useState<string | undefined>(); // shown only in dev
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send OTP");
        return;
      }
      setNormalizedPhone(data.phone);
      setDevOTP(data.otp); // undefined in production
      setStep("otp");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizedPhone, otp, name, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Verification failed");
        return;
      }
      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: data.user.id }),
      });
      setCurrentUser(data.user);
      onSuccess?.(data.user);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const resetToPhone = () => {
    setStep("phone");
    setOtp("");
    setDevOTP(undefined);
    setError("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white dark:bg-[#1a1830] rounded-2xl shadow-2xl w-full max-w-md p-6 dark:border dark:border-amber-900/30">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-amber-300 rounded-lg transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 rounded-2xl flex items-center justify-center mb-4">
            {step === "phone" ? (
              <Phone size={22} className="text-amber-700 dark:text-amber-300" />
            ) : (
              <ShieldCheck size={22} className="text-amber-700 dark:text-amber-300" />
            )}
          </div>
          <h2 className="font-serif text-2xl font-bold text-brown-900 dark:text-amber-100">
            {step === "phone" ? title : "Enter OTP"}
          </h2>
          <p className="text-sm text-brown-500 dark:text-amber-100/60 mt-1">
            {step === "phone"
              ? subtitle
              : `We sent a 6-digit code to ${normalizedPhone}`}
          </p>
        </div>

        {/* Step: Phone */}
        {step === "phone" && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brown-800 dark:text-amber-200 mb-1.5">
                Mobile Number
              </label>
              <div className="flex gap-2 items-center border border-brown-300 dark:border-amber-900/50 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-amber-400">
                <span className="pl-3 text-sm text-brown-500 dark:text-amber-300 font-medium select-none">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  value={phone.replace(/^\+91/, "").replace(/\D/g, "")}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  placeholder="98765 43210"
                  maxLength={10}
                  required
                  className="flex-1 px-2 py-3 text-sm bg-transparent focus:outline-none dark:text-amber-100 dark:placeholder:text-amber-100/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-800 dark:text-amber-200 mb-1.5">
                Your Name <span className="text-brown-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-4 py-3 text-sm border border-brown-300 dark:border-amber-900/50 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-400 dark:text-amber-100 dark:placeholder:text-amber-100/30"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" size="lg" className="w-full" loading={loading}>
              Send OTP
            </Button>
          </form>
        )}

        {/* Step: OTP */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            {/* Dev-mode OTP hint */}
            {devOTP && (
              <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/40 rounded-xl px-4 py-3">
                <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                  Development mode — OTP:{" "}
                  <span
                    className="font-mono text-lg tracking-widest cursor-pointer select-all"
                    onClick={() => setOtp(devOTP)}
                  >
                    {devOTP}
                  </span>
                  <span className="text-amber-500"> (click to fill)</span>
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-brown-800 dark:text-amber-200 mb-1.5">
                6-digit OTP
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="• • • • • •"
                maxLength={6}
                required
                autoFocus
                className="w-full px-4 py-3 text-center text-xl font-mono tracking-widest border border-brown-300 dark:border-amber-900/50 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-400 dark:text-amber-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-800 dark:text-amber-200 mb-1.5">
                Email <span className="text-brown-400 font-normal">(optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full px-4 py-3 text-sm border border-brown-300 dark:border-amber-900/50 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-400 dark:text-amber-100 dark:placeholder:text-amber-100/30"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" size="lg" className="w-full" loading={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> Verifying…
                </span>
              ) : (
                "Verify & Continue"
              )}
            </Button>

            <button
              type="button"
              onClick={resetToPhone}
              className="w-full text-sm text-amber-700 dark:text-amber-400 hover:underline"
            >
              ← Change number / Resend OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
