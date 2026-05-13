"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Heart,
  Upload,
  CheckCircle,
  AlertCircle,
  Package,
  Truck,
  Star,
  HelpCircle,
  RefreshCw,
  ChevronDown,
  Flame,
  Sparkles,
} from "lucide-react";
import { Order } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

const ISSUE_TYPES = [
  {
    value: "damaged_product",
    label: "Product arrived damaged",
    icon: AlertCircle,
  },
  { value: "wrong_item", label: "Received wrong item", icon: Package },
  { value: "missing_item", label: "Item missing from order", icon: RefreshCw },
  { value: "late_delivery", label: "Delivery is delayed", icon: Truck },
  { value: "quality_concern", label: "Quality not as expected", icon: Star },
  { value: "other", label: "Something else", icon: HelpCircle },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
}

type Step = "form" | "success";

export default function ReportIssueModal({
  isOpen,
  onClose,
  order,
  userName,
  userEmail,
  userPhone,
}: Props) {
  const [step, setStep] = useState<Step>("form");
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState(userEmail || "");
  const [contactPhone, setContactPhone] = useState(userPhone || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleClose = () => {
    if (submitting) return;
    setStep("form");
    setIssueType("");
    setDescription("");
    setImageFile(null);
    setImagePreview(null);
    setError(null);
    setContactEmail(userEmail || "");
    setContactPhone(userPhone || "");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueType) {
      setError("Please select an issue type.");
      return;
    }
    if (!description.trim()) {
      setError("Please describe your issue.");
      return;
    }
    if (!contactEmail.trim()) {
      setError("Please provide your email.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      let imageUrl: string | null = null;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          imageUrl = url;
        }
      }

      const res = await fetch(`/api/orders/${order.id}/report-issue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issueType,
          description,
          imageUrl,
          contactEmail,
          contactPhone,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");
      setStep("success");
    } catch {
      setError(
        "Something went wrong. Please try again or reach us on WhatsApp.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.97 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="relative w-full sm:max-w-lg bg-white dark:bg-[#1a1830] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] sm:max-h-[85vh] flex flex-col"
        >
          {/* Decorative header gradient */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-[#fdfbf7] via-amber-50/40 to-coral-50/30 dark:from-[#1a1830] dark:via-amber-900/10 dark:to-coral-900/10 pointer-events-none border-b border-amber-100/30 dark:border-amber-900/20" />

          {/* Close button */}
          <button
            onClick={handleClose}
            disabled={submitting}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 dark:bg-[#1a1830]/80 hover:bg-cream-100 dark:hover:bg-amber-900/30 text-brown-500 dark:text-amber-100/60 transition-colors shadow-sm border border-cream-200 dark:border-amber-900/30"
          >
            <X size={18} />
          </button>

          {step === "form" ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col overflow-hidden flex-1"
            >
              {/* Header */}
              <div className="relative px-6 pt-6 pb-4 flex-shrink-0">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/40 rounded-2xl flex items-center justify-center shadow-sm border border-amber-200 dark:border-amber-800/50">
                    <Heart
                      size={20}
                      className="text-amber-700 dark:text-amber-400 fill-amber-200 dark:fill-amber-900/60"
                    />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-brown-900 dark:text-amber-100">
                      Tell us what happened
                    </h2>
                    <p className="text-xs text-brown-500 dark:text-amber-100/50 font-medium">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="text-[14px] text-brown-600 dark:text-amber-100/70 leading-relaxed mt-3 flex items-start gap-2">
                  <Flame size={16} className="text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    Every piece we make is poured with care — so if something
                    isn&apos;t right, we genuinely want to know and make it
                    better for you.
                  </span>
                </div>
              </div>

              {/* Scrollable body */}
              <div className="overflow-y-auto flex-1 px-6 space-y-5 pb-2">
                {/* Issue type */}
                <div>
                  <label className="block text-[12px] font-bold text-brown-500 dark:text-amber-100/60 uppercase tracking-widest mb-3">
                    What&apos;s the issue?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {ISSUE_TYPES.map((type) => {
                      const Icon = type.icon;
                      const active = issueType === type.value;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setIssueType(type.value)}
                          className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left text-sm font-semibold transition-all ${
                            active
                              ? "bg-amber-50 dark:bg-amber-900/30 border-amber-400 dark:border-amber-600 text-amber-800 dark:text-amber-300 shadow-sm"
                              : "bg-cream-50/60 dark:bg-[#0f0e1c] border-cream-200 dark:border-amber-900/20 text-brown-700 dark:text-amber-100/70 hover:border-amber-300 dark:hover:border-amber-700/50"
                          }`}
                        >
                          <Icon
                            size={15}
                            className={
                              active
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-brown-400 dark:text-amber-100/40"
                            }
                          />
                          <span className="leading-tight text-[12.5px]">
                            {type.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Affected item */}
                {order.items.length > 1 && (
                  <div>
                    <label className="block text-[12px] font-bold text-brown-500 dark:text-amber-100/60 uppercase tracking-widest mb-2">
                      Which item? (optional)
                    </label>
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 bg-cream-50 dark:bg-[#0f0e1c] rounded-xl border border-cream-200 dark:border-amber-900/20"
                        >
                          {item.productImage && (
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-10 h-10 rounded-lg object-cover border border-cream-200 dark:border-amber-900/30 flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-brown-900 dark:text-amber-100 truncate">
                              {item.productName}
                            </p>
                            <p className="text-xs text-brown-500 dark:text-amber-100/50">
                              Qty {item.quantity} ·{" "}
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className="block text-[12px] font-bold text-brown-500 dark:text-amber-100/60 uppercase tracking-widest mb-2">
                    Describe what happened
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us in your own words — even a few sentences help us understand and fix things faster..."
                    rows={4}
                    className="w-full px-4 py-3 text-sm bg-cream-50 dark:bg-[#0f0e1c] border border-cream-200 dark:border-amber-900/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 dark:text-amber-100 text-brown-900 placeholder:text-brown-400 dark:placeholder:text-amber-100/30 resize-none"
                  />
                </div>

                {/* Image upload */}
                <div>
                  <label className="block text-[12px] font-bold text-brown-500 dark:text-amber-100/60 uppercase tracking-widest mb-2">
                    Add a photo (optional)
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Issue"
                        className="w-full h-40 object-cover rounded-xl border border-cream-200 dark:border-amber-900/30"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-[#1a1830]/90 rounded-full shadow-sm border border-cream-200 dark:border-amber-900/30 text-brown-500 hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex flex-col items-center gap-2 p-5 border-2 border-dashed border-cream-300 dark:border-amber-900/30 rounded-xl text-brown-400 dark:text-amber-100/30 hover:border-amber-300 dark:hover:border-amber-700/50 hover:text-amber-600 dark:hover:text-amber-500 transition-all bg-cream-50/40 dark:bg-[#0f0e1c]"
                    >
                      <Upload size={20} />
                      <span className="text-xs font-semibold">
                        Upload a photo of the issue
                      </span>
                    </button>
                  )}
                </div>

                {/* Contact details */}
                <div className="bg-amber-50/60 dark:bg-amber-900/10 rounded-2xl p-4 border border-amber-100 dark:border-amber-900/20 space-y-3">
                  <p className="text-[12px] font-bold text-brown-500 dark:text-amber-100/60 uppercase tracking-widest">
                    How should we reach you?
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-brown-500 dark:text-amber-100/50 mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#0f0e1c] border border-cream-200 dark:border-amber-900/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 dark:text-amber-100 text-brown-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-brown-500 dark:text-amber-100/50 mb-1.5">
                        Phone (optional)
                      </label>
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#0f0e1c] border border-cream-200 dark:border-amber-900/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 dark:text-amber-100 text-brown-900"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-xl border border-red-100 dark:border-red-900/30 font-medium">
                    {error}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-cream-100 dark:border-amber-900/20 flex-shrink-0 bg-white dark:bg-[#1a1830]">
                <Button type="submit" className="w-full" loading={submitting}>
                  Send my message
                </Button>
                <p className="text-center text-xs text-brown-400 dark:text-amber-100/40 mt-3 font-medium">
                  We usually get back within a few hours 💛
                </p>
              </div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center px-6 py-12 gap-6 relative z-10"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-coral-100/50 dark:bg-amber-900/20 rounded-full blur-xl animate-pulse" />
                <div className="w-24 h-24 bg-[#fdfbf7] dark:bg-[#1a1830] rounded-full flex items-center justify-center border border-dashed border-coral-200 dark:border-amber-700/50 shadow-sm relative z-10 transform -rotate-3">
                  <div className="w-20 h-20 bg-coral-50 dark:bg-amber-900/40 rounded-full flex flex-col items-center justify-center border border-coral-100 dark:border-amber-800/40">
                    <Heart
                      className="text-coral-500 dark:text-coral-400 fill-coral-200 dark:fill-coral-900/40 mb-1"
                      size={28}
                    />
                    <CheckCircle
                      size={14}
                      className="text-coral-600 dark:text-amber-500"
                      strokeWidth={3}
                    />
                  </div>
                </div>
              </div>
              <div>
                <h2 className="font-serif text-3xl font-bold text-brown-900 dark:text-amber-100 mb-3">
                  We heard you
                </h2>
                <p className="text-[15px] text-brown-600 dark:text-amber-100/70 leading-relaxed max-w-sm mx-auto">
                  Thank you for reaching out,{" "}
                  <span className="font-semibold text-brown-800 dark:text-amber-50">
                    {userName?.split(" ")[0] || "friend"}
                  </span>
                  . Someone from our small team will personally get in touch
                  with you soon to make this right.
                </p>
                <div className="flex items-center justify-center gap-2 mt-5 text-sm font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 py-2 px-4 rounded-full border border-amber-100 dark:border-amber-800/30 w-max mx-auto">
                  <Sparkles size={14} /> Your trust means everything to us.
                </div>
              </div>
              <button
                onClick={handleClose}
                className="mt-4 px-8 py-3 bg-white dark:bg-[#151326] border border-cream-200 dark:border-amber-800/50 text-brown-800 dark:text-amber-100 hover:bg-cream-50 dark:hover:bg-amber-900/30 hover:border-amber-300 dark:hover:border-amber-700 rounded-xl font-bold transition-all shadow-sm"
              >
                Close Window
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
