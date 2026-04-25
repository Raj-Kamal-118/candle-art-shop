"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Sparkles,
  Send,
  Info,
  PaintBucket,
  Wind,
  Flame,
  Box,
  Droplets,
  Sun,
  Coffee,
  Leaf,
  Flower,
} from "lucide-react";
import SecondaryHeader from "@/components/layout/SecondaryHeader";
import Button from "@/components/ui/Button";
import QuoteRequestSuccess from "@/components/custom/QuoteRequestSuccess";

const SHAPES = [
  {
    id: "Pillar",
    desc: "A classic freestanding cylinder. Perfect for tablescapes and altars.",
    image: "/images/candle/pillar.png",
  },
  {
    id: "Jar",
    desc: "Cozy and contained in glass or ceramic. Ideal for maximum fragrance throw.",
    image: "/images/candle/jar.png",
  },
  {
    id: "Sphere",
    desc: "A perfect globe of wax. Elegant and modern.",
    image: "/images/candle/sphere.png",
  },
  {
    id: "Cube",
    desc: "Clean, sharp lines for a contemporary aesthetic.",
    image: "/images/candle/cube.png",
  },
  {
    id: "Star",
    desc: "A whimsical star-shaped design to brighten your space.",
    image: "/images/candle/star.png",
  },
  {
    id: "Heart",
    desc: "A romantic heart shape, perfect for gifting and special moments.",
    image: "/images/candle/heart.png",
  },
  {
    id: "Pyramid",
    desc: "A striking geometric pyramid shape that burns beautifully.",
    image: "/images/candle/pyramid.png",
  },
  {
    id: "Taper",
    desc: "Tall, elegant, and slender. Designed for candlesticks and romantic dinners.",
    image: "/images/candle/taper.png",
  },
];

const FRAGRANCES = [
  { id: "Vanilla Bourbon", icon: Coffee, desc: "Warm, sweet, and rich." },
  { id: "Lavender Dreams", icon: Flower, desc: "Calming and herbaceous." },
  { id: "Forest Pine", icon: Leaf, desc: "Fresh, woody, and grounding." },
  { id: "Citrus Burst", icon: Sun, desc: "Bright, zesty, and uplifting." },
  { id: "Ocean Breeze", icon: Droplets, desc: "Crisp, clean, and aquatic." },
  { id: "Amber Rose", icon: Sparkles, desc: "Romantic and musky." },
  { id: "Unscented", icon: Wind, desc: "Pure wax, no added fragrance." },
];

const WAX_TYPES = [
  {
    id: "100% Soy Wax",
    desc: "Eco-friendly, sustainable, and biodegradable.",
    pros: "Offers a very clean, long burn with an excellent scent throw. Washes away with soap and water.",
  },
  {
    id: "Beeswax",
    desc: "100% natural with a faint, sweet honey scent.",
    pros: "Purifies the air by releasing negative ions as it burns. Lasts significantly longer than other waxes.",
  },
  {
    id: "Coconut Blend",
    desc: "Luxurious, sustainable, and incredibly creamy.",
    pros: "Provides an unparalleled cold and hot fragrance throw. Burns very evenly.",
  },
];

const WICK_TYPES = [
  {
    id: "Cotton Wick",
    desc: "The classic choice. Braided cotton intertwined with paper threads.",
    pros: "Provides a steady, reliable flame and is largely self-trimming.",
  },
  {
    id: "Wooden Wick",
    desc: "A thin slab of natural wood that burns with a horizontal flame.",
    pros: "Creates a cozy, fireplace-like crackling sound and adds a rustic aesthetic.",
  },
];

const PRESET_COLORS = [
  { label: "Ivory", hex: "#fdfcf9" },
  { label: "Blush", hex: "#fbcfe8" },
  { label: "Sage", hex: "#bbf7d0" },
  { label: "Lavender", hex: "#e9d5ff" },
  { label: "Sky", hex: "#bae6fd" },
  { label: "Mustard", hex: "#fde047" },
];

export default function CustomCandlePage() {
  const [shape, setShape] = useState("Pillar");
  const [color, setColor] = useState("#fdfcf9");
  const [scent, setScent] = useState("Vanilla Bourbon");
  const [wax, setWax] = useState("100% Soy Wax");
  const [wick, setWick] = useState("Cotton Wick");

  // Contact Details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [comments, setComments] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "candle",
          name,
          email,
          phone,
          details: { shape, color, scent, wax, wick, comments },
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Failed to submit quote", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedShape = SHAPES.find((s) => s.id === shape) || SHAPES[0];

  if (submitted) {
    return (
      <QuoteRequestSuccess
        titlePrefix="Your vision is in"
        titleHighlighted="our hands"
        titleSuffix="."
        description="Thank you for sharing your custom candle design with us."
        message="Our artisans are reviewing your custom shape, wax, and fragrance selections. We'll be in touch via WhatsApp or email shortly to confirm the details and share a personalized quote before we begin pouring."
        onReset={() => setSubmitted(false)}
        resetButtonIcon={Sparkles}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] pb-20">
      <SecondaryHeader
        eyebrow="✦ The Atelier ✦"
        titlePrefix="Craft your custom"
        titleHighlighted="candle"
        titleSuffix="."
        description="Design your perfect candle from scratch. Choose your shape, wax, colour, and scent. We'll hand-pour it just for you in our studio."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left: Configuration Wizard */}
          <div className="lg:col-span-7 space-y-10 bg-white dark:bg-[#1a1830] p-8 rounded-3xl shadow-sm border border-cream-200 dark:border-amber-900/30 transition-colors">
            <form
              id="custom-candle-form"
              onSubmit={handleSubmit}
              className="space-y-12"
            >
              {/* Shapes */}
              <div>
                <label className="flex items-center gap-2 font-serif text-2xl font-bold text-brown-900 dark:text-amber-100 mb-5">
                  <Box
                    size={24}
                    className="text-amber-600 dark:text-amber-500"
                  />{" "}
                  1. Choose a Shape
                </label>
                <div className="grid sm:grid-cols-2 gap-4">
                  {SHAPES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setShape(s.id)}
                      className={`text-left p-4 rounded-2xl border-2 transition-all duration-300 ${
                        shape === s.id
                          ? "border-amber-500 bg-amber-50 dark:border-amber-600 dark:bg-amber-900/30 shadow-md"
                          : "border-cream-200 bg-cream-50 hover:bg-cream-100 dark:border-amber-900/30 dark:bg-[#0f0e1c]"
                      }`}
                    >
                      <div className="aspect-video rounded-xl bg-white dark:bg-black/20 mb-4 overflow-hidden relative flex items-center justify-center">
                        <img
                          src={s.image}
                          alt={s.id}
                          className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal opacity-80"
                          onError={(e) => {
                            // Fallback if image doesn't exist
                            (e.target as HTMLImageElement).src =
                              "https://placehold.co/400x300/fdfcf9/d4a373?text=" +
                              s.id;
                          }}
                        />
                      </div>
                      <h4 className="font-bold text-lg text-brown-900 dark:text-amber-100 mb-1">
                        {s.id}
                      </h4>
                      <p className="text-sm text-brown-600 dark:text-amber-100/70 leading-relaxed">
                        {s.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Colour */}
              <div>
                <label className="flex items-center gap-2 font-serif text-2xl font-bold text-brown-900 dark:text-amber-100 mb-5">
                  <PaintBucket
                    size={24}
                    className="text-amber-600 dark:text-amber-500"
                  />{" "}
                  2. Select a Colour
                </label>

                <div className="flex flex-wrap gap-4 items-center mb-4">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c.label}
                      type="button"
                      onClick={() => setColor(c.hex)}
                      className={`w-12 h-12 rounded-full border-2 transition-all ${
                        color === c.hex
                          ? "border-brown-900 dark:border-white scale-110 shadow-md"
                          : "border-cream-300 dark:border-amber-900/50 hover:scale-105"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.label}
                    />
                  ))}
                  <div className="w-px h-8 bg-cream-200 dark:bg-amber-900/30 mx-2" />
                  <div className="flex items-center gap-3">
                    <span className="text-base font-medium text-brown-600 dark:text-amber-100/70">
                      Custom:
                    </span>
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer border border-cream-300 dark:border-amber-900/50 bg-transparent p-0.5"
                    />
                  </div>
                </div>

                <div className="mt-5 flex gap-3 bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-200 p-4 rounded-2xl border border-amber-200 dark:border-amber-800/30">
                  <Info size={20} className="shrink-0 mt-0.5" />
                  <p className="text-[15px] leading-relaxed">
                    We'll try our best to match your exact shade. Because we mix
                    our dyes by hand into natural waxes, please allow for
                    beautiful, slight variations in the final colour.
                  </p>
                </div>
              </div>

              {/* Scent */}
              <div>
                <label className="flex items-center gap-2 font-serif text-2xl font-bold text-brown-900 dark:text-amber-100 mb-5">
                  <Wind
                    size={24}
                    className="text-amber-600 dark:text-amber-500"
                  />{" "}
                  3. Fragrance & Scent
                </label>
                <div className="grid sm:grid-cols-2 gap-3">
                  {FRAGRANCES.map((f) => {
                    const Icon = f.icon;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setScent(f.id)}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                          scent === f.id
                            ? "border-amber-500 bg-amber-50 dark:border-amber-600 dark:bg-amber-900/30 shadow-sm"
                            : "border-cream-200 bg-cream-50 hover:bg-cream-100 dark:border-amber-900/30 dark:bg-[#0f0e1c]"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center flex-none ${
                            scent === f.id
                              ? "bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200"
                              : "bg-white text-brown-500 dark:bg-[#1a1830] dark:text-amber-100/60"
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                        <div>
                          <h4 className="font-bold text-base text-brown-900 dark:text-amber-100">
                            {f.id}
                          </h4>
                          <p className="text-sm text-brown-500 dark:text-amber-100/60 mt-0.5">
                            {f.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Wax */}
              <div>
                <label className="flex items-center gap-2 font-serif text-2xl font-bold text-brown-900 dark:text-amber-100 mb-5">
                  <Droplets
                    size={24}
                    className="text-amber-600 dark:text-amber-500"
                  />{" "}
                  4. Wax Base
                </label>
                <div className="space-y-3">
                  {WAX_TYPES.map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setWax(w.id)}
                      className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                        wax === w.id
                          ? "border-amber-500 bg-amber-50 dark:border-amber-600 dark:bg-amber-900/30 shadow-md"
                          : "border-cream-200 bg-cream-50 hover:bg-cream-100 dark:border-amber-900/30 dark:bg-[#0f0e1c]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-lg text-brown-900 dark:text-amber-100">
                          {w.id}
                        </h4>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            wax === w.id
                              ? "border-amber-500 bg-amber-500"
                              : "border-cream-300 dark:border-amber-900/50"
                          }`}
                        >
                          {wax === w.id && (
                            <Check size={12} className="text-white" />
                          )}
                        </div>
                      </div>
                      <p className="text-base text-brown-700 dark:text-amber-100/80 mb-1">
                        {w.desc}
                      </p>
                      <p className="text-sm text-brown-500 dark:text-amber-100/60 mt-1">
                        <strong>Why choose this:</strong> {w.pros}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Wick */}
              <div>
                <label className="flex items-center gap-2 font-serif text-2xl font-bold text-brown-900 dark:text-amber-100 mb-5">
                  <Flame
                    size={24}
                    className="text-amber-600 dark:text-amber-500"
                  />{" "}
                  5. Wick Type
                </label>
                <div className="grid sm:grid-cols-2 gap-4">
                  {WICK_TYPES.map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setWick(w.id)}
                      className={`text-left p-5 rounded-2xl border-2 transition-all ${
                        wick === w.id
                          ? "border-amber-500 bg-amber-50 dark:border-amber-600 dark:bg-amber-900/30 shadow-md"
                          : "border-cream-200 bg-cream-50 hover:bg-cream-100 dark:border-amber-900/30 dark:bg-[#0f0e1c]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-lg text-brown-900 dark:text-amber-100">
                          {w.id}
                        </h4>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            wick === w.id
                              ? "border-amber-500 bg-amber-500"
                              : "border-cream-300 dark:border-amber-900/50"
                          }`}
                        >
                          {wick === w.id && (
                            <Check size={12} className="text-white" />
                          )}
                        </div>
                      </div>
                      <p className="text-base text-brown-700 dark:text-amber-100/80 mb-2">
                        {w.desc}
                      </p>
                      <p className="text-sm text-brown-500 dark:text-amber-100/60 mt-1">
                        <strong>Experience:</strong> {w.pros}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="pt-6 border-t border-cream-100 dark:border-amber-900/20">
                <h3 className="font-serif text-2xl font-bold text-brown-900 dark:text-amber-100 mb-6">
                  Your Contact Details
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[15px] font-medium text-brown-700 dark:text-amber-100/80 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-cream-50 dark:bg-[#0f0e1c] border border-cream-200 dark:border-amber-900/30 rounded-xl shadow-sm focus:bg-white dark:focus:bg-[#1a1830] focus:ring-2 focus:ring-amber-300 dark:focus:ring-amber-600 focus:border-amber-400 dark:focus:border-amber-500 focus:outline-none text-brown-900 dark:text-amber-100 transition-all placeholder:text-brown-400 dark:placeholder:text-amber-100/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[15px] font-medium text-brown-700 dark:text-amber-100/80 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-cream-50 dark:bg-[#0f0e1c] border border-cream-200 dark:border-amber-900/30 rounded-xl shadow-sm focus:bg-white dark:focus:bg-[#1a1830] focus:ring-2 focus:ring-amber-300 dark:focus:ring-amber-600 focus:border-amber-400 dark:focus:border-amber-500 focus:outline-none text-brown-900 dark:text-amber-100 transition-all placeholder:text-brown-400 dark:placeholder:text-amber-100/40"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[15px] font-medium text-brown-700 dark:text-amber-100/80 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-cream-50 dark:bg-[#0f0e1c] border border-cream-200 dark:border-amber-900/30 rounded-xl shadow-sm focus:bg-white dark:focus:bg-[#1a1830] focus:ring-2 focus:ring-amber-300 dark:focus:ring-amber-600 focus:border-amber-400 dark:focus:border-amber-500 focus:outline-none text-brown-900 dark:text-amber-100 transition-all placeholder:text-brown-400 dark:placeholder:text-amber-100/40"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[15px] font-medium text-brown-700 dark:text-amber-100/80 mb-1.5">
                      Additional Comments or Inspiration
                    </label>
                    <textarea
                      rows={3}
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Tell us any specific details, sizes, or vibes you're going for..."
                      className="w-full px-4 py-3 bg-cream-50 dark:bg-[#0f0e1c] border border-cream-200 dark:border-amber-900/30 rounded-xl shadow-sm focus:bg-white dark:focus:bg-[#1a1830] focus:ring-2 focus:ring-amber-300 dark:focus:ring-amber-600 focus:border-amber-400 dark:focus:border-amber-500 focus:outline-none text-brown-900 dark:text-amber-100 transition-all placeholder:text-brown-400 dark:placeholder:text-amber-100/40 resize-none"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Right: 3D Preview & Submission */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div className="bg-white dark:bg-[#1a1830] p-8 rounded-3xl border border-cream-200 dark:border-amber-900/30 shadow-sm transition-colors">
              <div className="mb-8 flex flex-col items-center justify-center">
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-4">
                  Your Creation
                </p>
                <motion.div
                  key={shape}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-48 h-48 rounded-2xl overflow-hidden bg-cream-50 dark:bg-[#0f0e1c] border border-cream-200 dark:border-amber-900/30 shadow-inner flex items-center justify-center"
                >
                  <img
                    src={selectedShape.image}
                    alt={`${shape} shape preview`}
                    className="w-[80%] h-[80%] object-contain opacity-90"
                    style={{ mixBlendMode: "multiply" }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/400x300/fdfcf9/d4a373?text=" +
                        selectedShape.id;
                    }}
                  />
                  <div
                    className="absolute inset-0 mix-blend-multiply opacity-30 transition-colors duration-500"
                    style={{ backgroundColor: color }}
                  />
                </motion.div>
              </div>

              <h3 className="font-serif text-xl font-bold text-brown-900 dark:text-amber-100 mb-4 border-b border-cream-100 dark:border-amber-900/20 pb-3">
                Quote Summary
              </h3>
              <ul className="space-y-3 text-[15px] text-brown-600 dark:text-amber-100/70 mb-6">
                <li className="flex justify-between">
                  <span>Shape:</span>{" "}
                  <span className="font-medium">{shape}</span>
                </li>
                <li className="flex justify-between">
                  <span>Scent:</span>{" "}
                  <span className="font-medium">{scent}</span>
                </li>
                <li className="flex justify-between">
                  <span>Color:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium uppercase text-sm">
                      {color}
                    </span>
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 dark:border-white/10"
                      style={{ backgroundColor: color }}
                    ></span>
                  </div>
                </li>
                <li className="flex justify-between">
                  <span>Wax:</span> <span className="font-medium">{wax}</span>
                </li>
                <li className="flex justify-between">
                  <span>Wick:</span> <span className="font-medium">{wick}</span>
                </li>
              </ul>

              <Button
                type="submit"
                form="custom-candle-form"
                className="w-full flex justify-center gap-2 bg-coral-600 hover:bg-coral-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white shadow-lg shadow-coral-200 dark:shadow-amber-900/30 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:hover:translate-y-0"
                size="lg"
                disabled={isSubmitting}
              >
                <Send size={16} />{" "}
                {isSubmitting ? "Submitting..." : "Request Custom Quote"}
              </Button>

              <div className="mt-6 pt-5 border-t border-cream-100 dark:border-amber-900/20 text-center">
                <p className="text-sm text-brown-500 dark:text-amber-100/60 leading-relaxed">
                  <strong>Our Process:</strong> Custom handcrafted candles
                  typically range from <strong>₹200 to ₹1,000</strong> depending
                  on the size, complexity, and materials selected.
                  <br />
                  <br />
                  Once you submit this request, one of our artisans will reach
                  out to understand your exact needs and provide a final
                  quotation before we begin pouring.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
