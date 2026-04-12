"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Check, Image as ImageIcon, Upload, Info, Send } from "lucide-react";
import Button from "@/components/ui/Button";

const SHAPES = ["Square", "Circle", "Oval", "Heart", "Custom Outline"];
const MATERIALS = ["Ceramic", "Wood", "Plaster", "Resin"];
const MAGNET_TYPES = ["Neodymium (Extra Strong)", "Ferrite (Standard)"];

export default function CustomMagnetPage() {
  const [shape, setShape] = useState("Square");
  const [material, setMaterial] = useState("Ceramic");
  const [magnetType, setMagnetType] = useState("Neodymium (Extra Strong)");
  const [image, setImage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const getMagnetShapeStyles = () => {
    switch (shape) {
      case "Circle":
        return { borderRadius: "50%" };
      case "Oval":
        return { borderRadius: "50% / 30%" };
      case "Heart":
        return { borderRadius: "12px" }; // Simplified for CSS preview
      case "Custom Outline":
        return { borderRadius: "24px", transform: "scale(0.9) rotate(-5deg)" };
      default:
        return { borderRadius: "12px" }; // Square/Rectangle
    }
  };

  const getMaterialBackground = () => {
    switch (material) {
      case "Wood":
        return "#d4a373";
      case "Ceramic":
        return "#fdfcf9";
      case "Plaster":
        return "#f5f5f4";
      case "Resin":
        return "#e0e7ff";
      default:
        return "#fdfcf9";
    }
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={40} />
        </div>
        <h1 className="font-serif text-4xl font-bold text-brown-900 mb-4">
          Quote Requested!
        </h1>
        <p className="text-brown-600 text-lg mb-8">
          Thank you for submitting your custom magnet design. Our artists will
          review your artwork and send you a final quote shortly.
        </p>
        <Button onClick={() => setSubmitted(false)}>
          Design Another Magnet
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl font-bold text-brown-900 mb-4">
          Build Your Custom Magnet
        </h1>
        <p className="text-brown-600 max-w-2xl mx-auto">
          Upload an image and we'll hand-draw it onto a beautiful fridge magnet.
          Customize the shape, base material, and magnet strength.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-12 items-start">
        {/* Left: Configuration Wizard */}
        <div className="lg:col-span-7 space-y-10 bg-white p-8 rounded-3xl shadow-sm border border-cream-200">
          <form
            id="custom-magnet-form"
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* Image Upload */}
            <div>
              <label className="block font-semibold text-brown-900 mb-3 flex items-center gap-2">
                <ImageIcon size={16} className="text-amber-500" /> Upload
                Reference Image
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                  image
                    ? "border-amber-400 bg-amber-50"
                    : "border-cream-300 bg-cream-50 hover:bg-cream-100"
                }`}
              >
                {image ? (
                  <div className="flex flex-col items-center">
                    <Check size={32} className="text-amber-500 mb-2" />
                    <p className="text-sm font-medium text-amber-800">
                      Image Uploaded Successfully
                    </p>
                    <p className="text-xs text-amber-600 mt-1">
                      Click to replace
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload size={32} className="text-brown-400 mb-3" />
                    <p className="text-sm font-medium text-brown-700">
                      Click to upload your artwork or photo
                    </p>
                    <p className="text-xs text-brown-500 mt-1">
                      JPG, PNG up to 5MB
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              {/* Artisan Disclaimer */}
              <div className="mt-4 flex gap-3 bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100">
                <Info size={20} className="shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">
                  <strong>Artisan Notice:</strong> The uploaded image serves as
                  a reference. Our artists will hand-draw the design directly
                  onto the magnet material. It may not match exactly, giving
                  your piece a beautiful, unique artisan charm!
                </p>
              </div>
            </div>

            {/* Shapes */}
            <div>
              <label className="block font-semibold text-brown-900 mb-3">
                Magnet Shape
              </label>
              <div className="flex flex-wrap gap-3">
                {SHAPES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setShape(s)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      shape === s
                        ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                        : "bg-cream-50 text-brown-600 hover:bg-cream-100 border border-cream-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Material & Magnet Type */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold text-brown-900 mb-3">
                  Base Material
                </label>
                <div className="space-y-2">
                  {MATERIALS.map((m) => (
                    <label
                      key={m}
                      className="flex items-center gap-3 p-3 border border-cream-200 rounded-xl cursor-pointer hover:bg-cream-50 transition-colors"
                    >
                      <input
                        type="radio"
                        name="material"
                        value={m}
                        checked={material === m}
                        onChange={() => setMaterial(m)}
                        className="accent-amber-600 w-4 h-4"
                      />
                      <span className="text-sm text-brown-700">{m}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-semibold text-brown-900 mb-3">
                  Magnet Strength
                </label>
                <div className="space-y-2">
                  {MAGNET_TYPES.map((m) => (
                    <label
                      key={m}
                      className="flex items-center gap-3 p-3 border border-cream-200 rounded-xl cursor-pointer hover:bg-cream-50 transition-colors"
                    >
                      <input
                        type="radio"
                        name="magnetType"
                        value={m}
                        checked={magnetType === m}
                        onChange={() => setMagnetType(m)}
                        className="accent-amber-600 w-4 h-4"
                      />
                      <span className="text-sm text-brown-700">{m}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Right: 3D Preview & Submission */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
          <div className="bg-cream-100/50 p-8 rounded-3xl border border-cream-200 overflow-hidden h-[450px] flex flex-col items-center justify-center relative">
            <p className="absolute top-6 left-6 text-xs font-semibold text-amber-700 uppercase tracking-widest">
              3D Preview
            </p>

            {/* 3D CSS Canvas for Magnet */}
            <div style={{ perspective: "1000px" }} className="mt-8 w-64 h-64">
              <motion.div
                key={shape + material}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="w-full h-full relative"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "rotateX(25deg) rotateY(-20deg) rotateZ(5deg)",
                }}
              >
                {/* Magnet Thickness Layer (Drop Shadow effect) */}
                <div
                  className="absolute inset-0 bg-stone-300 shadow-[20px_20px_40px_rgba(0,0,0,0.15)]"
                  style={{
                    ...getMagnetShapeStyles(),
                    transform: "translateZ(-8px)",
                  }}
                />

                {/* Top Surface Layer */}
                <div
                  className="absolute inset-0 overflow-hidden border border-black/5 shadow-inner"
                  style={{
                    ...getMagnetShapeStyles(),
                    backgroundColor: getMaterialBackground(),
                    transform: "translateZ(0px)",
                  }}
                >
                  {/* Drawing Texture Overlay */}
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stucco.png')]" />

                  {image ? (
                    <img
                      src={image}
                      alt="Artwork Preview"
                      className="w-full h-full object-cover opacity-85 mix-blend-multiply scale-90"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brown-400/50 text-sm font-medium">
                      Upload Image
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Summary Box */}
          <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-sm">
            <h3 className="font-semibold text-brown-900 mb-4 border-b border-cream-100 pb-3">
              Quote Summary
            </h3>
            <ul className="space-y-2 text-sm text-brown-600 mb-6">
              <li className="flex justify-between">
                <span>Shape:</span> <span className="font-medium">{shape}</span>
              </li>
              <li className="flex justify-between">
                <span>Material:</span>{" "}
                <span className="font-medium">{material}</span>
              </li>
              <li className="flex justify-between">
                <span>Magnet:</span>{" "}
                <span className="font-medium">{magnetType.split(" ")[0]}</span>
              </li>
            </ul>

            <Button
              type="submit"
              form="custom-magnet-form"
              className="w-full flex justify-center gap-2"
              size="lg"
              disabled={!image}
            >
              <Send size={16} />{" "}
              {image ? "Request Custom Quote" : "Upload Image to Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
