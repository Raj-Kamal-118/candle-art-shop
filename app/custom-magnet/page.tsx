"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Image as ImageIcon,
  Upload,
  Info,
  Send,
  Move,
  Edit2,
} from "lucide-react";
import Button from "@/components/ui/Button";

const SHAPES = ["Square", "Circle", "Oval", "Heart", "Custom Outline"];

const MATERIALS = [
  {
    id: "Ceramic",
    desc: "Smooth, glossy finish. Classic fridge magnet look.",
    color: "#fdfcf9",
    texture: "url('https://www.transparenttextures.com/patterns/stucco.png')",
  },
  {
    id: "Wood",
    desc: "Natural, rustic charm with visible grain.",
    color: "#d4a373",
    texture:
      "url('https://www.transparenttextures.com/patterns/wood-pattern.png')",
  },
  {
    id: "Plaster",
    desc: "Matte, textured finish perfect for raw hand-painted art.",
    color: "#f5f5f4",
    texture:
      "url('https://www.transparenttextures.com/patterns/wall-4-light.png')",
  },
  {
    id: "Resin",
    desc: "Durable, glass-like finish that protects the artwork.",
    color: "#e0e7ff",
    texture: "none",
  },
];

const MAGNET_TYPES = [
  {
    id: "Neodymium",
    sub: "Extra Strong",
    desc: "Sleek silver disc. Holds up to 10 sheets of paper securely.",
    icon: "💿",
  },
  {
    id: "Ferrite",
    sub: "Standard",
    desc: "Classic dark grey magnet. Holds 2-3 sheets of paper.",
    icon: "⬛",
  },
];

export default function CustomMagnetPage() {
  const [shape, setShape] = useState("Square");
  const [material, setMaterial] = useState("Ceramic");
  const [magnetType, setMagnetType] = useState("Neodymium");
  const [image, setImage] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3D rotation state
  const [rotX, setRotX] = useState(15);
  const [rotY, setRotY] = useState(-15);
  const [isDragging, setIsDragging] = useState(false);

  // 2D Editor state
  const [isEditing, setIsEditing] = useState(false);
  const [imgScale, setImgScale] = useState(1);
  const [imgPos, setImgPos] = useState({ x: 0, y: 0 });
  const [cornerRadius, setCornerRadius] = useState(12);
  const [customPoints, setCustomPoints] = useState([
    { x: 15, y: 15 },
    { x: 50, y: 5 },
    { x: 85, y: 15 },
    { x: 95, y: 50 },
    { x: 85, y: 85 },
    { x: 50, y: 95 },
    { x: 15, y: 85 },
    { x: 5, y: 50 },
  ]);

  const activePoint = useRef<number | null>(null);
  const isDraggingImg = useRef(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
      setIsEditing(true);
      setImgScale(1);
      setImgPos({ x: 0, y: 0 });
    }
  };

  const handleShapeChange = (s: string) => {
    setShape(s);
    if (image && !isEditing) {
      setIsEditing(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "magnet",
          name,
          email,
          phone,
          details: {
            shape,
            material,
            magnetType,
            alignment: { scale: imgScale, x: imgPos.x, y: imgPos.y },
            customShape:
              shape === "Custom Outline" ? customPoints : { cornerRadius },
          },
        }),
      });
      if (response.ok) setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit quote", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMagnetShapeStyles = () => {
    switch (shape) {
      case "Square":
        return { borderRadius: `${cornerRadius}px` };
      case "Circle":
        return { borderRadius: "50%" };
      case "Oval":
        return { borderRadius: "50% / 30%" };
      case "Heart":
        return { borderRadius: "12px" }; // Simplified for CSS preview
      case "Custom Outline":
        const polygon = customPoints
          .map((p) => `${Math.round(p.x)}% ${Math.round(p.y)}%`)
          .join(", ");
        return { clipPath: `polygon(${polygon})` };
      default:
        return { borderRadius: "12px" }; // Square/Rectangle
    }
  };

  const getShapeTransform = () => {
    return "";
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 3D Preview Drag
  const handle3DMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setRotX((prev) => Math.max(-85, Math.min(85, prev - e.movementY * 0.5)));
    setRotY((prev) => prev + e.movementX * 0.5);
  };

  // 2D Editor Drag
  const handleEditorPointerDownPoint = (
    e: React.PointerEvent,
    index: number,
  ) => {
    e.stopPropagation();
    activePoint.current = index;
  };
  const handleEditorPointerDownImg = (e: React.PointerEvent) => {
    isDraggingImg.current = true;
  };
  const handleEditorPointerMove = (e: React.PointerEvent) => {
    if (activePoint.current !== null) {
      setCustomPoints((prev) => {
        const newPts = [...prev];
        newPts[activePoint.current!] = {
          x: Math.max(
            0,
            Math.min(
              100,
              prev[activePoint.current!].x + (e.movementX / 256) * 100,
            ),
          ),
          y: Math.max(
            0,
            Math.min(
              100,
              prev[activePoint.current!].y + (e.movementY / 256) * 100,
            ),
          ),
        };
        return newPts;
      });
    } else if (isDraggingImg.current) {
      setImgPos((p) => ({ x: p.x + e.movementX, y: p.y + e.movementY }));
    }
  };
  const handleEditorPointerUp = () => {
    activePoint.current = null;
    isDraggingImg.current = false;
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setRotX(15);
    setRotY(-15);
  };

  const activeMaterial = MATERIALS.find((m) => m.id === material);

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
        <h1 className="font-serif text-4xl font-bold text-brown-900 dark:text-amber-100 mb-4">
          Build Your Custom Magnet
        </h1>
        <p className="text-brown-600 dark:text-amber-100/70 max-w-2xl mx-auto">
          Upload an image and we'll hand-draw it onto a beautiful fridge magnet.
          Customize the shape, base material, and magnet strength.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-12 items-start">
        {/* Left: Configuration Wizard */}
        <div className="lg:col-span-7 space-y-10 bg-white dark:bg-[#1a1830] p-8 rounded-3xl shadow-sm border border-cream-200 dark:border-amber-900/30 transition-colors">
          <form
            id="custom-magnet-form"
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* Image Upload */}
            <div>
              <label className="block font-semibold text-brown-900 dark:text-amber-100 mb-3 flex items-center gap-2">
                <ImageIcon size={16} className="text-amber-500" /> Upload
                Reference Image
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
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

              {/* Artisan Disclaimer */}
              <div className="mt-4 flex gap-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 transition-colors">
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
              <label className="block font-semibold text-brown-900 dark:text-amber-100 mb-3">
                Magnet Shape
              </label>
              <div className="flex flex-wrap gap-3">
                {SHAPES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleShapeChange(s)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      shape === s
                        ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                        : "bg-cream-50 dark:bg-[#0f0e1c] text-brown-600 dark:text-amber-100/70 hover:bg-cream-100 dark:hover:bg-amber-900/40 border border-cream-200 dark:border-amber-900/30"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {isEditing ? (
              <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-2xl border border-amber-200 dark:border-amber-900/30 space-y-6">
                <div>
                  <h3 className="font-bold text-amber-900 dark:text-amber-100 flex items-center gap-2 mb-1">
                    <Move size={18} /> Alignment & Shape Tools
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-200/70">
                    {shape === "Custom Outline"
                      ? "Drag the image to position it. Then, drag the dots to freely shape your custom magnet."
                      : "Drag the image to position it. Adjust the settings below to fit perfectly."}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 flex justify-between text-amber-800 dark:text-amber-200">
                    Image Zoom <span>{imgScale.toFixed(1)}x</span>
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={imgScale}
                    onChange={(e) => setImgScale(parseFloat(e.target.value))}
                    className="w-full accent-amber-600 cursor-ew-resize"
                  />
                </div>

                {shape === "Square" && (
                  <div>
                    <label className="text-sm font-semibold mb-2 flex justify-between text-amber-800 dark:text-amber-200">
                      Corner Radius <span>{cornerRadius}px</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="64"
                      step="1"
                      value={cornerRadius}
                      onChange={(e) =>
                        setCornerRadius(parseInt(e.target.value))
                      }
                      className="w-full accent-amber-600 cursor-ew-resize"
                    />
                  </div>
                )}

                <Button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-full mt-2"
                >
                  Confirm Design & Material Setup
                </Button>
              </div>
            ) : (
              image && (
                <>
                  {/* Base Material */}
                  <div>
                    <label className="block font-semibold text-brown-900 dark:text-amber-100 mb-3">
                      Base Material
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {MATERIALS.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setMaterial(m.id)}
                          className={`p-4 rounded-2xl border-2 text-left transition-all ${
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
                            className="h-10 w-full rounded-lg mb-3 border border-black/10 dark:border-white/10 shadow-inner"
                          />
                          <p className="font-bold text-brown-900 dark:text-amber-100 mb-1">
                            {m.id}
                          </p>
                          <p className="text-xs text-brown-600 dark:text-amber-100/70 leading-relaxed">
                            {m.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Magnet Strength */}
                  <div>
                    <label className="block font-semibold text-brown-900 dark:text-amber-100 mb-3">
                      Magnet Strength
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {MAGNET_TYPES.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setMagnetType(m.id)}
                          className={`p-4 rounded-2xl border-2 text-left transition-all ${
                            magnetType === m.id
                              ? "border-amber-500 bg-amber-50 dark:border-amber-600 dark:bg-amber-900/30 shadow-md"
                              : "border-cream-200 bg-cream-50 hover:bg-cream-100 dark:border-amber-900/30 dark:bg-[#0f0e1c]"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{m.icon}</span>
                            <div>
                              <p className="font-bold text-brown-900 dark:text-amber-100">
                                {m.id}
                              </p>
                              <p className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-500">
                                {m.sub}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-brown-600 dark:text-amber-100/70 leading-relaxed">
                            {m.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="pt-6 border-t border-cream-100 dark:border-amber-900/20">
                    <h3 className="font-semibold text-brown-900 dark:text-amber-100 mb-4">
                      Your Contact Details
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-brown-700 dark:text-amber-100/80 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full p-3 bg-cream-50 dark:bg-[#0f0e1c] border border-cream-200 dark:border-amber-900/30 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-brown-800 dark:text-amber-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-brown-700 dark:text-amber-100/80 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-3 bg-cream-50 dark:bg-[#0f0e1c] border border-cream-200 dark:border-amber-900/30 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-brown-800 dark:text-amber-100"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm text-brown-700 dark:text-amber-100/80 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full p-3 bg-cream-50 dark:bg-[#0f0e1c] border border-cream-200 dark:border-amber-900/30 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-brown-800 dark:text-amber-100"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )
            )}
          </form>
        </div>

        {/* Right: 3D Preview & Submission */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
          <div
            className={`bg-cream-100/50 dark:bg-[#1a1830]/50 p-8 rounded-3xl border border-cream-200 dark:border-amber-900/30 overflow-hidden h-[450px] flex flex-col items-center justify-center relative transition-colors select-none ${
              isEditing
                ? "touch-none"
                : "cursor-grab active:cursor-grabbing group"
            }`}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handle3DMouseMove}
            onMouseLeave={handleMouseLeave}
            onPointerMove={isEditing ? handleEditorPointerMove : undefined}
            onPointerUp={isEditing ? handleEditorPointerUp : undefined}
            onPointerLeave={isEditing ? handleEditorPointerUp : undefined}
          >
            <p className="absolute top-6 left-6 text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-widest">
              {isEditing ? "2D Alignment Editor" : "Interactive 3D Preview"}
            </p>
            {!isEditing && (
              <p className="absolute bottom-6 left-0 right-0 text-center text-xs text-brown-500 dark:text-amber-100/50 opacity-100 group-active:opacity-0 transition-opacity">
                Click & drag to rotate
              </p>
            )}

            {isEditing ? (
              <div className="relative w-64 h-64 mt-8 bg-white/50 dark:bg-white/5 shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] border-2 border-dashed border-amber-300 dark:border-amber-700/50 rounded-xl">
                <div
                  className="absolute inset-0 overflow-hidden shadow-[0_0_0_2px_#d97706]"
                  style={{
                    ...getMagnetShapeStyles(),
                    backgroundColor: activeMaterial?.color,
                    backgroundImage: activeMaterial?.texture,
                  }}
                >
                  {image && (
                    <div
                      className="w-full h-full cursor-move mix-blend-multiply opacity-85"
                      onPointerDown={handleEditorPointerDownImg}
                      style={{
                        transform: `translate(${imgPos.x}px, ${imgPos.y}px) scale(${imgScale})`,
                      }}
                    >
                      <img
                        src={image}
                        className="w-full h-full object-cover pointer-events-none"
                        alt="Editor Image"
                      />
                    </div>
                  )}
                </div>

                {shape === "Custom Outline" &&
                  customPoints.map((pt, i) => (
                    <div
                      key={i}
                      onPointerDown={(e) => handleEditorPointerDownPoint(e, i)}
                      className="absolute w-5 h-5 bg-amber-500 rounded-full border-[3px] border-white shadow-md cursor-grab active:cursor-grabbing z-10 hover:scale-125 transition-transform"
                      style={{
                        top: `calc(${pt.y}% - 10px)`,
                        left: `calc(${pt.x}% - 10px)`,
                      }}
                    />
                  ))}
              </div>
            ) : (
              <div style={{ perspective: "1000px" }} className="mt-8 w-64 h-64">
                <motion.div
                  animate={{ rotateX: rotX, rotateY: rotY, rotateZ: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  className="w-full h-full relative"
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((depth) => (
                    <div
                      key={depth}
                      className="absolute inset-0 bg-stone-300 dark:bg-stone-700"
                      style={{
                        ...getMagnetShapeStyles(),
                        transform: `${getShapeTransform()}translateZ(-${depth}px)`,
                      }}
                    />
                  ))}
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-stone-200 dark:bg-stone-800 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]"
                    style={{
                      ...getMagnetShapeStyles(),
                      transform: `${getShapeTransform()}translateZ(-8px) rotateY(180deg)`,
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <div
                      className={`rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.3)] ${
                        magnetType === "Neodymium"
                          ? "w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-400 border border-gray-400"
                          : "w-32 h-32 bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-950"
                      }`}
                      style={{ transform: "translateZ(2px)" }}
                    />
                  </div>
                  <div
                    className="absolute inset-0 overflow-hidden border border-black/5 shadow-inner"
                    style={{
                      ...getMagnetShapeStyles(),
                      backgroundColor: activeMaterial?.color || "#fdfcf9",
                      backgroundImage: activeMaterial?.texture || "none",
                      transform: `${getShapeTransform()}translateZ(0px)`,
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    {image ? (
                      <div
                        className="w-full h-full opacity-85 mix-blend-multiply scale-[0.98]"
                        style={{
                          transform: `translate(${imgPos.x}px, ${imgPos.y}px) scale(${imgScale})`,
                        }}
                      >
                        <img
                          src={image}
                          alt="Artwork Preview"
                          className="w-full h-full object-cover"
                          style={{ pointerEvents: "none" }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brown-400/50 dark:text-amber-900/50 text-sm font-medium">
                        Upload Image
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </div>

          {/* Summary Box */}
          {!isEditing && image && (
            <div className="bg-white dark:bg-[#1a1830] p-6 rounded-3xl border border-cream-200 dark:border-amber-900/30 shadow-sm transition-colors">
              <div className="flex justify-between items-center mb-4 border-b border-cream-100 dark:border-amber-900/20 pb-3">
                <h3 className="font-semibold text-brown-900 dark:text-amber-100">
                  Quote Summary
                </h3>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-amber-600 hover:text-amber-700 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
                >
                  <Edit2 size={13} /> Edit Design
                </button>
              </div>
              <ul className="space-y-2 text-sm text-brown-600 dark:text-amber-100/70 mb-6">
                <li className="flex justify-between">
                  <span>Shape:</span>{" "}
                  <span className="font-medium">{shape}</span>
                </li>
                <li className="flex justify-between">
                  <span>Material:</span>{" "}
                  <span className="font-medium">{material}</span>
                </li>
                <li className="flex justify-between">
                  <span>Magnet:</span>{" "}
                  <span className="font-medium">{magnetType}</span>
                </li>
              </ul>

              <Button
                type="submit"
                form="custom-magnet-form"
                className="w-full flex justify-center gap-2"
                size="lg"
                disabled={!image || isSubmitting}
              >
                <Send size={16} />{" "}
                {isSubmitting
                  ? "Submitting..."
                  : image
                    ? "Request Custom Quote"
                    : "Upload Image to Continue"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
