"use client";

import { useState } from "react";
import {
  MessageCircle,
  Mail,
  Instagram,
  MapPin,
  ArrowRight,
  Check,
} from "lucide-react";
import SecondaryHeader from "@/components/layout/SecondaryHeader";

const channels = [
  {
    Icon: MessageCircle,
    label: "WhatsApp",
    value: "+91 95194 86785",
    note: "Replies within an hour",
    href: "https://wa.me/919519486785",
    hi: true,
  },
  {
    Icon: Mail,
    label: "Email",
    value: "artisanhouse.in@gmail.com",
    note: "Replies within a day",
    href: "mailto:artisanhouse.in@gmail.com",
  },
  {
    Icon: Instagram,
    label: "Instagram",
    value: "@artisanhouse.in",
    note: "DMs welcome",
    href: "https://instagram.com/artisanhouse.in",
  },
  {
    Icon: MapPin,
    label: "Studio",
    value: "Varanasi, India",
    note: "Visits by appointment",
    href: "#",
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          subject: formData.get("subject"),
          message: formData.get("message"),
        }),
      });
      if (res.ok) setSubmitted(true);
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] pb-20">
      <SecondaryHeader
        eyebrow="✦ Get in Touch ✦"
        titlePrefix="Say"
        titleHighlighted="hello"
        titleSuffix="."
        description="Whether it's a custom request, a care question, or just a story about where our candle lives now — we love hearing it."
      />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-10 items-start">
          <div className="flex flex-col gap-3.5">
            {channels.map(({ Icon, label, value, note, href, hi }) => (
              <a
                key={label}
                href={href}
                className={`flex items-start gap-3.5 p-[18px] rounded-2xl border transition-all hover:-translate-y-0.5 ${
                  hi
                    ? "bg-forest-50 dark:bg-forest-900/30 border-forest-100 dark:border-forest-800"
                    : "bg-white dark:bg-[#1a1830] border-cream-200 dark:border-amber-900/30"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-none ${
                    hi
                      ? "bg-forest-700 text-white"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                  }`}
                >
                  <Icon size={16} />
                </div>
                <div className="flex-1">
                  <div className="text-[11px] uppercase tracking-[0.1em] text-brown-500 dark:text-amber-100/50 mb-0.5">
                    {label}
                  </div>
                  <div className="text-[15px] font-semibold text-brown-900 dark:text-amber-100 mb-0.5">
                    {value}
                  </div>
                  <div className="text-xs text-brown-500 dark:text-amber-100/50">
                    {note}
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 rounded-[20px] p-8 md:p-9">
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-coral-100 text-coral-700 inline-flex items-center justify-center mb-5">
                  <Check size={28} />
                </div>
                <h3 className="font-serif text-[28px] font-bold text-brown-900 dark:text-amber-100 mb-2.5">
                  Message sent.
                </h3>
                <p className="text-[15px] text-brown-600 dark:text-amber-100/60">
                  We'll be in touch within a day — often sooner.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 className="font-serif text-[26px] font-bold text-brown-900 dark:text-amber-100 mb-6">
                  Send us a note
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-brown-800 dark:text-amber-100 mb-1.5">
                      Name
                    </label>
                    <input
                      name="name"
                      required
                      placeholder="Priya Menon"
                      className="w-full px-3.5 py-2.5 border border-brown-300 dark:border-amber-900/30 rounded-[10px] text-sm text-brown-900 dark:text-amber-100 bg-white dark:bg-[#0f0e1c] focus:ring-2 focus:ring-amber-300 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-800 dark:text-amber-100 mb-1.5">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="priya@example.com"
                      className="w-full px-3.5 py-2.5 border border-brown-300 dark:border-amber-900/30 rounded-[10px] text-sm text-brown-900 dark:text-amber-100 bg-white dark:bg-[#0f0e1c] focus:ring-2 focus:ring-amber-300 outline-none"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-brown-800 dark:text-amber-100 mb-1.5">
                    What's this about?
                  </label>
                  <select
                    name="subject"
                    className="w-full px-3.5 py-2.5 border border-brown-300 dark:border-amber-900/30 rounded-[10px] text-sm text-brown-900 dark:text-amber-100 bg-white dark:bg-[#0f0e1c] focus:ring-2 focus:ring-amber-300 outline-none"
                  >
                    <option>Custom candle inquiry</option>
                    <option>Custom magnet inquiry</option>
                    <option>Order question</option>
                    <option>Wholesale / bulk gifting</option>
                    <option>Press / collaboration</option>
                    <option>Something else</option>
                  </select>
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-brown-800 dark:text-amber-100 mb-1.5">
                    Your message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us the story..."
                    className="w-full px-3.5 py-2.5 border border-brown-300 dark:border-amber-900/30 rounded-[10px] text-sm text-brown-900 dark:text-amber-100 bg-white dark:bg-[#0f0e1c] focus:ring-2 focus:ring-amber-300 outline-none resize-y"
                  />
                </div>
                {status === "error" && (
                  <p className="text-coral-600 text-sm mb-4">
                    Something went wrong. Please try again or email us directly.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-coral-600 hover:bg-coral-700 text-white font-semibold rounded-xl shadow-lg shadow-coral-200 dark:shadow-coral-900/30 hover:-translate-y-0.5 transition-all disabled:opacity-60"
                >
                  {status === "submitting" ? "Sending..." : "Send message"}
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
