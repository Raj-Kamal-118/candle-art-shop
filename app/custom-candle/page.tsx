"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Send } from "lucide-react";
import Button from "@/components/ui/Button";

// Replace these placeholder URLs with your actual R2 image links!
const SHAPES = [
  {
    name: "Pillar",
    image: "https://placehold.co/600x600/f5ede0/d9a87a?text=Pillar",
  },
  {
    name: "Cylinder",
    image: "https://placehold.co/600x600/f5ede0/d9a87a?text=Cylinder",
  },
  {
    name: "Sphere",
    image: "https://placehold.co/600x600/f5ede0/d9a87a?text=Sphere",
  },
  {
    name: "Cube",
    image: "https://placehold.co/600x600/f5ede0/d9a87a?text=Cube",
  },
  {
    name: "Hexagon",
    image: "https://placehold.co/600x600/f5ede0/d9a87a?text=Hexagon",
  },
  {
    name: "Star",
    image: "https://placehold.co/600x600/f5ede0/d9a87a?text=Star",
  },
  {
    name: "Heart",
    image: "https://placehold.co/600x600/f5ede0/d9a87a?text=Heart",
  },
  {
    name: "Pyramid",
    image: "https://placehold.co/600x600/f5ede0/d9a87a?text=Pyramid",
  },
  {
    name: "Taper",
    image: "https://placehold.co/600x600/f5ede0/d9a87a?text=Taper",
  },
  { name: "Jar", image: "https://placehold.co/600x600/f5ede0/d9a87a?text=Jar" },
];

const SCENTS = [
  "Unscented",
  "Vanilla Bourbon",
  "Amber Rose",
  "Lavender Dreams",
  "Forest Pine",
  "Citrus Burst",
];

const WAX_TYPES = ["100% Soy Wax", "Beeswax", "Paraffin", "Coconut Blend"];
const WICK_TYPES = ["Cotton Wick", "Wooden Wick (Crackling)"];

export default function CustomCandlePage() {
  const [shape, setShape] = useState("Cylinder");
  const [color, setColor] = useState("#fde68a");
  const [scent, setScent] = useState("Vanilla Bourbon");
  const [wax, setWax] = useState("100% Soy Wax");
  const [wick, setWick] = useState("Cotton Wick");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the quote data to your backend
    setSubmitted(true);
  };

  const selectedShape = SHAPES.find((s) => s.name === shape) || SHAPES[1];

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={40} />
        </div>
        <h1 className="font-serif text-4xl font-bold text-brown-900 dark:text-amber-100 mb-4">
          Quote Requested!
        </h1>
        <p className="text-brown-600 dark:text-amber-100/70 text-lg mb-8">
          Thank you for designing your custom candle. Our artisans will review
          your requirements and get back to you with a quote shortly.
        </p>
        <Button onClick={() => setSubmitted(false)}>
          Design Another Candle
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl font-bold text-brown-900 dark:text-amber-100 mb-4">
          Build Your Custom Candle
        </h1>
        <p className="text-brown-600 dark:text-amber-100/70 max-w-2xl mx-auto">
          Design your perfect candle from scratch. Choose your shape, colour,
          and scent. We'll handcraft it just for you!
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-12 items-start">
        {/* Left: Configuration Wizard */}
        <div className="lg:col-span-7 space-y-10 bg-white dark:bg-[#1a1830] p-8 rounded-3xl shadow-sm border border-cream-200 dark:border-amber-900/30 transition-colors">
          <form
            id="custom-candle-form"
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* Shapes */}
            <div>
              <label className="block font-semibold text-brown-900 dark:text-amber-100 mb-3 flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" /> Choose Shape
              </label>
              <div className="flex flex-wrap gap-3">
                {SHAPES.map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => setShape(s.name)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      shape === s.name
                        ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                        : "bg-cream-50 dark:bg-[#0f0e1c] text-brown-600 dark:text-amber-100/70 hover:bg-cream-100 dark:hover:bg-amber-900/40 border border-cream-200 dark:border-amber-900/30"
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Colour */}
            <div>
              <label className="block font-semibold text-brown-900 dark:text-amber-100 mb-3">
                Select Colour
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-14 h-14 rounded-2xl cursor-pointer border-2 border-cream-200 dark:border-amber-900/50 dark:bg-transparent p-1"
                />
                <span className="text-sm text-brown-500 dark:text-amber-100/50 font-mono uppercase">
                  {color}
                </span>
              </div>
            </div>

            {/* Scent */}
            <div>
              <label className="block font-semibold text-brown-900 dark:text-amber-100 mb-3">
                Fragrance & Scent
              </label>
              <select
                value={scent}
                onChange={(e) => setScent(e.target.value)}
                className="w-full p-3 bg-cream-50 dark:bg-[#0f0e1c] border border-cream-200 dark:border-amber-900/30 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-brown-800 dark:text-amber-100"
              >
                {SCENTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Wax & Wick */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold text-brown-900 dark:text-amber-100 mb-3">
                  Wax Type
                </label>
                <div className="space-y-2">
                  {WAX_TYPES.map((w) => (
                    <label
                      key={w}
                      className="flex items-center gap-3 p-3 border border-cream-200 dark:border-amber-900/30 rounded-xl cursor-pointer hover:bg-cream-50 dark:hover:bg-amber-900/20 transition-colors"
                    >
                      <input
                        type="radio"
                        name="wax"
                        value={w}
                        checked={wax === w}
                        onChange={() => setWax(w)}
                        className="accent-amber-600 w-4 h-4"
                      />
                      <span className="text-sm text-brown-700 dark:text-amber-100/80">
                        {w}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-semibold text-brown-900 dark:text-amber-100 mb-3">
                  Wick Type
                </label>
                <div className="space-y-2">
                  {WICK_TYPES.map((w) => (
                    <label
                      key={w}
                      className="flex items-center gap-3 p-3 border border-cream-200 dark:border-amber-900/30 rounded-xl cursor-pointer hover:bg-cream-50 dark:hover:bg-amber-900/20 transition-colors"
                    >
                      <input
                        type="radio"
                        name="wick"
                        value={w}
                        checked={wick === w}
                        onChange={() => setWick(w)}
                        className="accent-amber-600 w-4 h-4"
                      />
                      <span className="text-sm text-brown-700 dark:text-amber-100/80">
                        {w}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Right: 3D Preview & Submission */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
          <div className="bg-cream-100/50 dark:bg-[#1a1830]/50 p-8 rounded-3xl border border-cream-200 dark:border-amber-900/30 overflow-hidden h-[450px] flex flex-col items-center justify-center relative transition-colors">
            <p className="absolute top-6 left-6 text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-widest">
              Shape Preview
            </p>

            {/* Image Preview */}
            <motion.div
              key={shape}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-64 h-64 mt-8 rounded-2xl overflow-hidden shadow-md bg-white dark:bg-[#0f0e1c] border border-cream-200 dark:border-amber-900/30 transition-colors"
            >
              <img
                src={selectedShape.image}
                alt={`${shape} shape preview`}
                className="w-full h-full object-cover"
              />

              {/* Dynamic Color Tint Overlay (Multiply blend mode) */}
              <div
                className="absolute inset-0 mix-blend-multiply opacity-40 transition-colors duration-300"
                style={{ backgroundColor: color }}
              />
            </motion.div>
          </div>

          {/* Summary Box */}
          <div className="bg-white dark:bg-[#1a1830] p-6 rounded-3xl border border-cream-200 dark:border-amber-900/30 shadow-sm transition-colors">
            <h3 className="font-semibold text-brown-900 dark:text-amber-100 mb-4 border-b border-cream-100 dark:border-amber-900/20 pb-3">
              Quote Summary
            </h3>
            <ul className="space-y-2 text-sm text-brown-600 dark:text-amber-100/70 mb-6">
              <li className="flex justify-between">
                <span>Shape:</span> <span className="font-medium">{shape}</span>
              </li>
              <li className="flex justify-between">
                <span>Scent:</span> <span className="font-medium">{scent}</span>
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
              className="w-full flex justify-center gap-2"
              size="lg"
            >
              <Send size={16} /> Request Custom Quote
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
