"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Image as ImageIcon,
  Upload,
  Info,
  Send,
  Move,
  Lock,
  Brush,
  Box,
} from "lucide-react";
import SecondaryHeader from "@/components/layout/SecondaryHeader";
import Button from "@/components/ui/Button";
import QuoteRequestSuccess from "@/components/custom/QuoteRequestSuccess";

type MagnetStyle = "3d-clay" | "flat-painted" | null;

const SHAPES = [
  { id: "Square", aspect: "1/1", radius: "0px" },
  { id: "Rounded Square", aspect: "1/1", radius: "16px" },
  { id: "Rectangle", aspect: "3/4", radius: "0px" },
  { id: "Circle", aspect: "1/1", radius: "50%" },
  { id: "Oval", aspect: "3/4", radius: "50%" },
];

const MATERIALS = [
  {
    id: "Wooden",
    desc: "Natural, rustic charm with visible grain.",
    color: "#d4a373",
    texture:
      "url('https://www.transparenttextures.com/patterns/wood-pattern.png')",
  },
  {
    id: "Clay",
    desc: "Earthy, organic feel with a handcrafted texture.",
    color: "#e6ccb2",
    texture:
      "url('https://www.transparenttextures.com/patterns/wall-4-light.png')",
  },
  {
    id: "POP",
    desc: "Smooth plaster finish, bright base for vibrant paintings.",
    color: "#fdfcf9",
    texture: "none",
  },
];

export default function CustomMagnetPage() {
  const [magnetStyle, setMagnetStyle] = useState<MagnetStyle>(null);

  const [shape, setShape] = useState("Square");
  const [material, setMaterial] = useState("Wooden");
  const [image, setImage] = useState<string | null>(null);
  const [comments, setComments] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2D Editor state
  const [isEditing, setIsEditing] = useState(false);
  const [finalized, setFinalized] = useState(false);
  const [imgScale, setImgScale] = useState(1);
  const [imgPos, setImgPos] = useState({ x: 0, y: 0 });
  const [imgRotation, setImgRotation] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setIsEditing(true);
        setImgScale(1);
        setImgPos({ x: 0, y: 0 });
        setImgRotation(0);
        setFinalized(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        type: "custom-magnet",
        name,
        email,
        phone,
        details: {
          style: magnetStyle,
          comments,
          // Send the base64 image in the quote request
          originalImage: image,
          ...(magnetStyle === "flat-painted"
            ? {
                shape,
                material,
                // This alignment payload allows the admin dashboard to perfectly recreate
                // the "screenshot" view the user designed using CSS transform parameters.
                alignment: {
                  scale: imgScale,
                  x: imgPos.x,
                  y: imgPos.y,
                  rotation: imgRotation,
                },
              }
            : {}),
        },
      };

      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit quote", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeMaterial = MATERIALS.find((m) => m.id === material);
  const activeShape = SHAPES.find((s) => s.id === shape) || SHAPES[0];

  // Drag handlers for the 2D editor
  const [isDraggingImg, setIsDraggingImg] = useState(false);
  const handlePointerDown = (e: React.PointerEvent) => {
    if (finalized) return;
    setIsDraggingImg(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingImg || finalized) return;
    setImgPos((prev) => ({
      x: prev.x + e.movementX,
      y: prev.y + e.movementY,
    }));
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDraggingImg(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  if (submitted) {
    return (
      <QuoteRequestSuccess
        titlePrefix="Your artwork is in"
        titleHighlighted="our hands"
        titleSuffix="."
        description="Thank you for sharing your custom magnet design with us."
        message="Our artists are reviewing your uploaded reference and style preferences. We'll reach out via WhatsApp or email shortly with a personalized quote before we begin crafting your miniature masterpiece."
        onReset={() => setSubmitted(false)}
        resetButtonIcon={Brush}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] pb-20">
      <SecondaryHeader
        eyebrow="✦ Bespoke Creations ✦"
        titlePrefix="Have a design in"
        titleHighlighted="mind"
        titleSuffix="?"
        description="Let us craft a beautiful, handcrafted magnet just for you. Choose between a realistic 3D miniature sculpture or a beautifully painted flat magnet."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Step 1: Select Style */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="grid sm:grid-cols-2 gap-6">
            <button
              onClick={() => {
                setMagnetStyle("3d-clay");
                setImage(null);
                setFinalized(false);
              }}
              className={`p-6 md:p-8 rounded-3xl border-2 text-left transition-all duration-300 ${
                magnetStyle === "3d-clay"
                  ? "border-amber-500 bg-amber-50 shadow-lg dark:bg-amber-900/20"
                  : "border-cream-200 bg-white hover:border-amber-300 hover:shadow-md dark:bg-[#1a1830] dark:border-amber-900/30"
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${
                  magnetStyle === "3d-clay"
                    ? "bg-amber-500 text-white"
                    : "bg-cream-100 text-brown-500 dark:bg-amber-900/40 dark:text-amber-300"
                }`}
              >
                <Box size={28} />
              </div>
              <h3 className="font-serif text-2xl font-bold text-brown-900 dark:text-amber-100 mb-2">
                3D Miniature Sculpture
              </h3>
              <p className="text-brown-600 dark:text-amber-100/70 text-sm leading-relaxed">
                Upload a photo of your pet, a loved one, or any object. Our
                artisans will hand-sculpt a realistic 3D miniature out of clay
                just for you.
              </p>
            </button>

            <button
              onClick={() => {
                setMagnetStyle("flat-painted");
                setImage(null);
                setFinalized(false);
              }}
              className={`p-6 md:p-8 rounded-3xl border-2 text-left transition-all duration-300 ${
                magnetStyle === "flat-painted"
                  ? "border-coral-500 bg-coral-50 shadow-lg dark:bg-amber-900/20 dark:border-amber-500"
                  : "border-cream-200 bg-white hover:border-coral-300 hover:shadow-md dark:bg-[#1a1830] dark:border-amber-900/30"
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${
                  magnetStyle === "flat-painted"
                    ? "bg-coral-500 text-white dark:bg-amber-500"
                    : "bg-cream-100 text-brown-500 dark:bg-amber-900/40 dark:text-amber-300"
                }`}
              >
                <Brush size={28} />
              </div>
              <h3 className="font-serif text-2xl font-bold text-brown-900 dark:text-amber-100 mb-2">
                Flat Painted Magnet
              </h3>
              <p className="text-brown-600 dark:text-amber-100/70 text-sm leading-relaxed">
                Pick a shape and base material (Wood, Clay, or POP). We'll
                hand-paint your chosen picture onto a beautifully crafted flat
                canvas.
              </p>
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {magnetStyle && (
            <motion.div
              key={magnetStyle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-12 gap-12 items-start"
            >
              {/* Left: Configuration Wizard */}
              <div className="lg:col-span-7 space-y-10 bg-white dark:bg-[#1a1830] p-8 rounded-3xl shadow-sm border border-cream-200 dark:border-amber-900/30">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
                    image
                      ? "border-amber-400 bg-amber-50 dark:border-amber-500/50 dark:bg-amber-900/20"
                      : "border-cream-300 bg-cream-50 hover:bg-cream-100 dark:border-amber-900/40 dark:bg-[#0f0e1c] dark:hover:bg-[#1a1830]"
                  }`}
                >
                  {image ? (
                    <div className="flex flex-col items-center">
                      <Check size={32} className="text-amber-500 mb-2" />
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                        Image Uploaded Successfully
                      </p>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                        Click to replace
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload
                        size={32}
                        className="text-brown-400 dark:text-amber-100/40 mb-3"
                      />
                      <p className="text-sm font-medium text-brown-700 dark:text-amber-100/80">
                        Click to upload your artwork or photo
                      </p>
                      <p className="text-xs text-brown-500 dark:text-amber-100/50 mt-1">
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

                {magnetStyle === "flat-painted" && image && !finalized && (
                  <div>
                    <label className="block font-semibold text-brown-900 dark:text-amber-100 mb-3">
                      Choose Magnet Shape
                    </label>
                    <div className="flex flex-wrap gap-3 mb-8">
                      {SHAPES.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setShape(s.id);
                            setImgPos({ x: 0, y: 0 });
                          }}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            shape === s.id
                              ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                              : "bg-cream-50 dark:bg-[#0f0e1c] text-brown-600 dark:text-amber-100/70 hover:bg-cream-100 dark:hover:bg-amber-900/40 border border-cream-200 dark:border-amber-900/30"
                          }`}
                        >
                          {s.id}
                        </button>
                      ))}
                    </div>

                    {/* Base Material */}
                    <div>
                      <label className="block font-semibold text-brown-900 dark:text-amber-100 mb-3">
                        Base Material for Painting
                      </label>
                      <div className="grid sm:grid-cols-3 gap-4 mb-8">
                        {MATERIALS.map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setMaterial(m.id)}
                            className={`p-4 rounded-2xl border-2 text-center transition-all ${
                              material === m.id
                                ? "border-amber-500 bg-amber-50 dark:border-amber-600 dark:bg-amber-900/30 shadow-md"
                                : "border-cream-200 bg-cream-50 hover:bg-cream-100 dark:border-amber-900/30 dark:bg-[#0f0e1c]"
                            }`}
                          >
                            <div
                              style={{
                                backgroundColor: m.color,
                                backgroundImage: m.texture,
                              }}
                              className="h-12 w-full rounded-lg mb-3 border border-black/10 dark:border-white/10 shadow-inner"
                            />
                            <p className="font-bold text-brown-900 dark:text-amber-100 mb-1">
                              {m.id}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {((magnetStyle === "flat-painted" && finalized) ||
                  (magnetStyle === "3d-clay" && image)) && (
                  <form id="custom-magnet-form" onSubmit={handleSubmit}>
                    {magnetStyle === "3d-clay" && (
                      <div className="mb-8 flex gap-3 bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-200 p-5 rounded-2xl border border-amber-200 dark:border-amber-800/30 transition-colors">
                        <Info size={24} className="shrink-0 mt-0.5" />
                        <p className="text-[15px] leading-relaxed">
                          <strong>Our Handcrafting Process:</strong> Our minimum
                          price for 3D miniature clay magnets is{" "}
                          <strong>₹300</strong>. Final cost depends on the size
                          and level of detail required for your sculpture. We
                          aim to craft pieces as realistic and beautiful as
                          humanly possible!
                        </p>
                      </div>
                    )}

                    <div className="pt-6 border-t border-cream-100 dark:border-amber-900/20">
                      <h3 className="font-serif text-2xl font-bold text-brown-900 dark:text-amber-100 mb-6">
                        Your Details
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-brown-700 dark:text-amber-100/80 mb-1.5">
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
                          <label className="block text-sm font-medium text-brown-700 dark:text-amber-100/80 mb-1.5">
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
                          <label className="block text-sm font-medium text-brown-700 dark:text-amber-100/80 mb-1.5">
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
                          <label className="block text-sm font-medium text-brown-700 dark:text-amber-100/80 mb-1.5">
                            Additional Comments / Special Requests
                          </label>
                          <textarea
                            rows={3}
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="Tell us any specific details you want our artisan team to know..."
                            className="w-full px-4 py-3 bg-cream-50 dark:bg-[#0f0e1c] border border-cream-200 dark:border-amber-900/30 rounded-xl shadow-sm focus:bg-white dark:focus:bg-[#1a1830] focus:ring-2 focus:ring-amber-300 dark:focus:ring-amber-600 focus:border-amber-400 dark:focus:border-amber-500 focus:outline-none text-brown-900 dark:text-amber-100 transition-all placeholder:text-brown-400 dark:placeholder:text-amber-100/40 resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </div>

              {/* Right: Live Preview / Editor */}
              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
                <div className="bg-cream-100/50 dark:bg-[#1a1830]/50 p-8 rounded-3xl border border-cream-200 dark:border-amber-900/30 min-h-[450px] flex flex-col items-center justify-center relative transition-colors">
                  {magnetStyle === "flat-painted" && image ? (
                    <div className="flex flex-col items-center w-full">
                      <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-6">
                        {finalized
                          ? "Final Composition"
                          : "Arrange Your Artwork"}
                      </p>

                      <div
                        className="relative overflow-hidden border-4 border-amber-200/50 dark:border-amber-900/50 shadow-xl touch-none select-none"
                        style={{
                          width: "256px",
                          height:
                            activeShape.aspect === "3/4" ? "340px" : "256px",
                          borderRadius: activeShape.radius,
                          backgroundColor: activeMaterial?.color,
                          backgroundImage: activeMaterial?.texture,
                        }}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                      >
                        <img
                          src={image}
                          alt="Artwork Preview"
                          className="max-w-none mix-blend-multiply opacity-90"
                          draggable={false}
                          style={{
                            transform: `translate(calc(-50% + ${imgPos.x}px), calc(-50% + ${imgPos.y}px)) rotate(${imgRotation}deg) scale(${imgScale})`,
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            cursor: finalized ? "default" : "move",
                            transformOrigin: "center",
                          }}
                        />
                      </div>

                      {!finalized && (
                        <div className="w-full max-w-[256px] mt-8 bg-white dark:bg-[#0f0e1c] p-4 rounded-xl border border-cream-200 dark:border-amber-900/30">
                          <label className="text-xs font-semibold mb-2 flex justify-between text-amber-800 dark:text-amber-200 uppercase tracking-wide">
                            Zoom <span>{imgScale.toFixed(1)}x</span>
                          </label>
                          <input
                            type="range"
                            min="0.1"
                            max="3"
                            step="0.05"
                            value={imgScale}
                            onChange={(e) =>
                              setImgScale(parseFloat(e.target.value))
                            }
                            className="w-full accent-amber-600 cursor-ew-resize"
                          />

                          <label className="text-xs font-semibold mt-5 mb-2 flex justify-between text-amber-800 dark:text-amber-200 uppercase tracking-wide">
                            Rotation <span>{imgRotation}°</span>
                          </label>
                          <input
                            type="range"
                            min="-180"
                            max="180"
                            step="1"
                            value={imgRotation}
                            onChange={(e) =>
                              setImgRotation(parseInt(e.target.value))
                            }
                            className="w-full accent-amber-600 cursor-ew-resize mb-2"
                          />

                          <Button
                            onClick={() => setFinalized(true)}
                            className="w-full mt-5 flex justify-center gap-2 bg-coral-600 hover:bg-coral-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white shadow-lg shadow-coral-200 dark:shadow-amber-900/30 hover:-translate-y-0.5 transition-all duration-200"
                          >
                            <Check size={16} /> Finalize Shape & Position
                          </Button>
                        </div>
                      )}
                      {finalized && (
                        <button
                          onClick={() => setFinalized(false)}
                          className="mt-6 text-amber-600 hover:text-amber-700 text-sm font-semibold underline underline-offset-4"
                        >
                          Adjust Positioning
                        </button>
                      )}
                    </div>
                  ) : magnetStyle === "3d-clay" && image ? (
                    <div className="flex flex-col items-center">
                      <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-6">
                        Reference Photo
                      </p>
                      <div className="w-64 h-64 rounded-2xl overflow-hidden shadow-xl border-4 border-amber-200/50 dark:border-amber-900/50 relative">
                        <img
                          src={image}
                          alt="Reference Upload"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="mt-6 flex items-center gap-2 text-sm text-forest-700 dark:text-amber-100/70 font-medium">
                        <Lock size={16} className="text-forest-400" />
                        Photo attached securely
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center opacity-50">
                      <ImageIcon size={48} className="text-brown-300 mb-4" />
                      <p className="text-sm font-medium text-brown-600">
                        Your artwork preview will appear here
                      </p>
                    </div>
                  )}
                </div>

                {((magnetStyle === "flat-painted" && finalized) ||
                  (magnetStyle === "3d-clay" && image)) && (
                  <div className="bg-white dark:bg-[#1a1830] p-6 rounded-3xl border border-cream-200 dark:border-amber-900/30 shadow-sm">
                    <h3 className="font-semibold text-brown-900 dark:text-amber-100 mb-4 border-b border-cream-100 dark:border-amber-900/20 pb-3">
                      Request Summary
                    </h3>
                    <ul className="space-y-2 text-sm text-brown-600 dark:text-amber-100/70 mb-6">
                      <li className="flex justify-between">
                        <span>Style:</span>{" "}
                        <span className="font-medium">
                          {magnetStyle === "3d-clay"
                            ? "3D Miniature Sculpture"
                            : "Flat Painted"}
                        </span>
                      </li>
                      {magnetStyle === "flat-painted" && (
                        <>
                          <li className="flex justify-between">
                            <span>Shape:</span>{" "}
                            <span className="font-medium">{shape}</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Material:</span>{" "}
                            <span className="font-medium">{material}</span>
                          </li>
                        </>
                      )}
                    </ul>

                    <Button
                      type="submit"
                      form="custom-magnet-form"
                      className="w-full flex justify-center gap-2 bg-coral-600 hover:bg-coral-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white shadow-lg shadow-coral-200 dark:shadow-amber-900/30 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:hover:translate-y-0"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      <Send size={16} />{" "}
                      {isSubmitting ? "Submitting..." : "Submit Quote Request"}
                    </Button>
                    <p className="text-center text-xs text-brown-400 mt-3">
                      Our artisans will contact you shortly to confirm the
                      details and exact cost.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
