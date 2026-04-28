"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Trash2,
  Upload,
  Save,
  Eye,
  EyeOff,
  GripVertical,
  Layers,
  Pencil,
} from "lucide-react";
import {
  HeroSettings,
  HeroButton,
  HeroStat,
  HeroButtonIcon,
  HeroImage,
} from "@/lib/types";
import HeroSection from "@/components/home/HeroSection";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

const ICON_OPTIONS: { value: HeroButtonIcon; label: string }[] = [
  { value: "", label: "No icon" },
  { value: "arrow-right", label: "Arrow Right" },
  { value: "shopping-bag", label: "Shopping Bag" },
  { value: "sparkles", label: "Sparkles" },
  { value: "star", label: "Star" },
  { value: "gift", label: "Gift" },
  { value: "heart", label: "Heart" },
];

const defaultSettings: HeroSettings = {
  id: "main",
  badgeText: "Handcrafted with love",
  h1Text: "Light Your World",
  h1HighlightedText: "With Art",
  h1TextColor: "#e85d4a",
  description:
    "Discover our collection of handcrafted candles, clay art, and creative crafts.",
  buttons: [
    {
      text: "Shop Collection",
      link: "/products",
      icon: "arrow-right",
      variant: "primary",
    },
    {
      text: "Custom Orders",
      link: "/categories/custom-artwork",
      icon: "",
      variant: "secondary",
    },
  ],
  backgroundType: "gradient",
  backgroundValue: "",
  showImages: true,
  images: [
    {
      url: "https://picsum.photos/seed/hero1/400/550",
      name: "Hand-poured Candles",
      link: "/categories/scented-candles",
    },
    {
      url: "https://picsum.photos/seed/hero3/400/400",
      name: "Clay Art",
      link: "/categories/custom-artwork",
    },
    {
      url: "https://picsum.photos/seed/hero2/400/400",
      name: "Gift Sets",
      link: "/gift-sets",
    },
    {
      url: "https://picsum.photos/seed/hero4/400/550",
      name: "Home Decor",
      link: "/products",
    },
  ],
  showStats: true,
  stats: [
    { value: "500+", label: "Happy Customers" },
    { value: "100%", label: "Natural Ingredients" },
    { value: "11", label: "Signature Products" },
  ],
  floatingBadgeText: "Free shipping on Orders over ₹999",
  updatedAt: "",
};

function HeroPreview({ settings }: { settings: HeroSettings }) {
  return (
    <section className="bg-white dark:bg-[#1a1830] rounded-2xl p-6 shadow-sm border border-cream-200 dark:border-amber-900/30">
      <h2 className="font-semibold text-brown-800 dark:text-amber-100/80 text-[11px] uppercase tracking-wider mb-4">
        Live Preview
      </h2>
      <div className="relative w-full rounded-xl overflow-hidden border border-cream-200 dark:border-amber-900/30 pointer-events-none">
        <HeroSection settings={settings} />
      </div>
    </section>
  );
}

export default function AdminHeroPage() {
  const [settings, setSettings] = useState<HeroSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState<number | null>(null);
  const fileRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const bgFileRef = useRef<HTMLInputElement>(null);

  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    fetch("/api/hero-settings")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.images) {
          data.images = data.images.map((img: any) =>
            typeof img === "string" ? { url: img, name: "", link: "" } : img,
          );
        }
        setSettings({ ...defaultSettings, ...data });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/hero-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        const updated = await res.json();
        setSettings(updated);
        setSaved(true);
        setModalOpen(false);
        setTimeout(() => setSaved(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (file: File, onUrl: (url: string) => void) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const { url, error } = await res.json();
    if (error) {
      alert(error);
      return;
    }
    onUrl(url);
  };

  const updateImage = (index: number, updates: Partial<HeroImage>) => {
    const newImages = [...(settings.images as HeroImage[])];
    newImages[index] = { ...newImages[index], ...updates };
    setSettings({ ...settings, images: newImages });
  };

  const handleImageUpload = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(index);
    try {
      await uploadImage(file, (url) => {
        updateImage(index, { url });
      });
    } finally {
      setUploading(null);
      if (fileRefs[index].current) fileRefs[index].current!.value = "";
    }
  };

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(-1);
    try {
      await uploadImage(file, (url) => {
        setSettings({ ...settings, backgroundValue: url });
      });
    } finally {
      setUploading(null);
      if (bgFileRef.current) bgFileRef.current.value = "";
    }
  };

  const addButton = () => {
    if (settings.buttons.length >= 6) return;
    setSettings({
      ...settings,
      buttons: [
        ...settings.buttons,
        { text: "New Button", link: "/", icon: "", variant: "secondary" },
      ],
    });
  };

  const updateButton = (i: number, updates: Partial<HeroButton>) => {
    const newButtons = settings.buttons.map((b, idx) =>
      idx === i ? { ...b, ...updates } : b,
    );
    setSettings({ ...settings, buttons: newButtons });
  };

  const removeButton = (i: number) => {
    setSettings({
      ...settings,
      buttons: settings.buttons.filter((_, idx) => idx !== i),
    });
  };

  const addStat = () => {
    setSettings({
      ...settings,
      stats: [...settings.stats, { value: "0+", label: "New Metric" }],
    });
  };

  const updateStat = (i: number, updates: Partial<HeroStat>) => {
    const newStats = settings.stats.map((s, idx) =>
      idx === i ? { ...s, ...updates } : s,
    );
    setSettings({ ...settings, stats: newStats });
  };

  const removeStat = (i: number) => {
    setSettings({
      ...settings,
      stats: settings.stats.filter((_, idx) => idx !== i),
    });
  };

  const field = (label: string, children: React.ReactNode) => (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {children}
    </div>
  );

  const inputCls =
    "w-full px-3 py-2 bg-white dark:bg-[#12101e] border border-brown-300 dark:border-amber-900/40 rounded-lg text-sm text-brown-900 dark:text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500/50 transition-colors placeholder:text-brown-400 dark:placeholder:text-amber-100/30";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-brown-400 dark:text-amber-100/50 text-sm">
          Loading hero settings…
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-100 dark:bg-amber-900/40 rounded-xl flex items-center justify-center">
            <Layers size={18} className="text-amber-700" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-brown-900 dark:text-amber-100 text-2xl">
              Hero Section
            </h1>
            <p className="text-sm text-brown-500 dark:text-amber-100/60 mt-0.5">
              Customize the homepage hero banner
            </p>
          </div>
        </div>
        <Button onClick={() => setModalOpen(true)} size="sm">
          <Pencil size={15} />
          Edit Hero Section
        </Button>
      </div>

      <HeroPreview settings={settings} />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit Hero Section"
        size="4xl"
      >
        <div className="max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar -mr-2">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* ── Left column: Text & Content ─────────────────────────────── */}
            <div className="space-y-6">
              {/* Text content */}
              <section className="bg-white dark:bg-[#1a1830] rounded-2xl p-6 shadow-sm border border-cream-200 dark:border-amber-900/30 space-y-4">
                <h2 className="font-semibold text-brown-800 dark:text-amber-100/80 text-[11px] uppercase tracking-wider">
                  Text Content
                </h2>
                {field(
                  "Badge Text",
                  <input
                    className={inputCls}
                    value={settings.badgeText}
                    onChange={(e) =>
                      setSettings({ ...settings, badgeText: e.target.value })
                    }
                  />,
                )}
                {field(
                  "Heading (H1)",
                  <input
                    className={inputCls}
                    value={settings.h1Text}
                    onChange={(e) =>
                      setSettings({ ...settings, h1Text: e.target.value })
                    }
                  />,
                )}
                {field(
                  "Highlighted Text (coloured line)",
                  <input
                    className={inputCls}
                    value={settings.h1HighlightedText}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        h1HighlightedText: e.target.value,
                      })
                    }
                  />,
                )}
                {field(
                  "Highlight Colour",
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.h1TextColor}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          h1TextColor: e.target.value,
                        })
                      }
                      className="w-10 h-10 rounded-lg border border-brown-300 dark:border-amber-900/40 cursor-pointer p-0.5 bg-transparent"
                    />
                    <input
                      className={`${inputCls} flex-1`}
                      value={settings.h1TextColor}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          h1TextColor: e.target.value,
                        })
                      }
                      placeholder="#e85d4a"
                    />
                  </div>,
                )}
                {field(
                  "Description",
                  <textarea
                    className={`${inputCls} resize-none`}
                    rows={3}
                    value={settings.description}
                    onChange={(e) =>
                      setSettings({ ...settings, description: e.target.value })
                    }
                  />,
                )}
                {field(
                  "Floating Badge Text",
                  <input
                    className={inputCls}
                    value={settings.floatingBadgeText || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        floatingBadgeText: e.target.value,
                      })
                    }
                    placeholder="Free shipping on Orders over ₹999"
                  />,
                )}
              </section>

              {/* Buttons */}
              <section className="bg-white dark:bg-[#1a1830] rounded-2xl p-6 shadow-sm border border-cream-200 dark:border-amber-900/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-brown-800 dark:text-amber-100/80 text-[11px] uppercase tracking-wider">
                    Buttons (max 6, 2 per row)
                  </h2>
                  <button
                    onClick={addButton}
                    disabled={settings.buttons.length >= 6}
                    className="text-xs text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 flex items-center gap-1 disabled:opacity-40 font-medium"
                  >
                    <Plus size={12} /> Add
                  </button>
                </div>
                {settings.buttons.map((btn, i) => (
                  <div
                    key={i}
                    className="border border-cream-200 dark:border-amber-900/30 rounded-xl p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-brown-400 dark:text-amber-100/50">
                        <GripVertical size={12} /> Button {i + 1}
                      </div>
                      <button
                        onClick={() => removeButton(i)}
                        className="text-red-400 hover:text-red-600 dark:hover:text-red-300"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-brown-500 dark:text-amber-100/60 mb-1">
                          Text
                        </label>
                        <input
                          className={inputCls}
                          value={btn.text}
                          onChange={(e) =>
                            updateButton(i, { text: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-brown-500 dark:text-amber-100/60 mb-1">
                          Link
                        </label>
                        <input
                          className={inputCls}
                          value={btn.link}
                          onChange={(e) =>
                            updateButton(i, { link: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-brown-500 dark:text-amber-100/60 mb-1">
                          Variant
                        </label>
                        <select
                          className={inputCls}
                          value={btn.variant}
                          onChange={(e) =>
                            updateButton(i, {
                              variant: e.target.value as
                                | "primary"
                                | "secondary",
                            })
                          }
                        >
                          <option value="primary">Primary</option>
                          <option value="secondary">Secondary</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-brown-500 dark:text-amber-100/60 mb-1">
                          Icon
                        </label>
                        <select
                          className={inputCls}
                          value={btn.icon}
                          onChange={(e) =>
                            updateButton(i, {
                              icon: e.target.value as HeroButtonIcon,
                            })
                          }
                        >
                          {ICON_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </section>

              {/* Stats */}
              <section className="bg-white dark:bg-[#1a1830] rounded-2xl p-6 shadow-sm border border-cream-200 dark:border-amber-900/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="font-semibold text-brown-800 dark:text-amber-100/80 text-[11px] uppercase tracking-wider">
                      Stats Bar
                    </h2>
                    <button
                      onClick={() =>
                        setSettings({
                          ...settings,
                          showStats: !settings.showStats,
                        })
                      }
                      className="text-xs text-brown-500 dark:text-amber-100/60 flex items-center gap-1 hover:text-brown-700 dark:hover:text-amber-100/80"
                    >
                      {settings.showStats ? (
                        <Eye size={12} />
                      ) : (
                        <EyeOff size={12} />
                      )}
                      {settings.showStats ? "Visible" : "Hidden"}
                    </button>
                  </div>
                  <button
                    onClick={addStat}
                    className="text-xs text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 flex items-center gap-1 font-medium"
                  >
                    <Plus size={12} /> Add
                  </button>
                </div>
                {settings.stats.map((stat, i) => (
                  <div key={i} className="flex items-start gap-3 mb-2">
                    <div className="w-24">
                      <label className="block text-xs text-brown-500 dark:text-amber-100/60 mb-1">
                        Value
                      </label>
                      <input
                        className={inputCls}
                        value={stat.value}
                        onChange={(e) =>
                          updateStat(i, { value: e.target.value })
                        }
                        placeholder="500+"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-brown-500 dark:text-amber-100/60 mb-1">
                        Label
                      </label>
                      <input
                        className={inputCls}
                        value={stat.label}
                        onChange={(e) =>
                          updateStat(i, { label: e.target.value })
                        }
                        placeholder="Happy Customers"
                      />
                    </div>
                    <div className="flex-none pt-6">
                      <button
                        onClick={() => removeStat(i)}
                        className="text-red-400 hover:text-red-600 dark:hover:text-red-300"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </section>
            </div>

            {/* ── Right column: Background & Images ──────────────────────── */}
            <div className="space-y-6">
              {/* Background */}
              <section className="bg-white dark:bg-[#1a1830] rounded-2xl p-6 shadow-sm border border-cream-200 dark:border-amber-900/30 space-y-4">
                <h2 className="font-semibold text-brown-800 dark:text-amber-100/80 text-[11px] uppercase tracking-wider">
                  Background
                </h2>
                {field(
                  "Background Type",
                  <div className="grid grid-cols-4 gap-2">
                    {(["gradient", "color", "image", "video"] as const).map(
                      (type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() =>
                            setSettings({ ...settings, backgroundType: type })
                          }
                          className={`py-2 text-xs font-medium rounded-lg border capitalize transition-colors ${
                            settings.backgroundType === type
                              ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                              : "border-cream-300 dark:border-amber-900/40 text-brown-600 dark:text-amber-100/60 hover:bg-cream-50 dark:hover:bg-[#12101e]"
                          }`}
                        >
                          {type}
                        </button>
                      ),
                    )}
                  </div>,
                )}

                {settings.backgroundType === "color" && (
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.backgroundValue || "#fdf6ec"}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          backgroundValue: e.target.value,
                        })
                      }
                      className="w-10 h-10 rounded-lg border border-brown-300 dark:border-amber-900/40 cursor-pointer p-0.5 bg-transparent"
                    />
                    <input
                      className={`${inputCls} flex-1`}
                      value={settings.backgroundValue || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          backgroundValue: e.target.value,
                        })
                      }
                      placeholder="#fdf6ec"
                    />
                  </div>
                )}

                {(settings.backgroundType === "image" ||
                  settings.backgroundType === "video") && (
                  <div className="space-y-2">
                    <input
                      className={inputCls}
                      value={settings.backgroundValue || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          backgroundValue: e.target.value,
                        })
                      }
                      placeholder={
                        settings.backgroundType === "image"
                          ? "https://... (image URL)"
                          : "https://... (video URL)"
                      }
                    />
                    {settings.backgroundType === "image" && (
                      <>
                        <button
                          type="button"
                          onClick={() => bgFileRef.current?.click()}
                          disabled={uploading === -1}
                          className="flex items-center gap-1.5 px-3 py-2 border border-brown-300 dark:border-amber-900/40 rounded-lg text-sm text-brown-600 dark:text-amber-100/80 hover:bg-cream-50 dark:hover:bg-[#12101e] transition-colors disabled:opacity-50"
                        >
                          <Upload size={14} />
                          {uploading === -1 ? "Uploading…" : "Upload Image"}
                        </button>
                        <input
                          ref={bgFileRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleBgUpload}
                        />
                      </>
                    )}
                    {settings.backgroundValue &&
                      settings.backgroundType === "image" && (
                        <img
                          src={settings.backgroundValue}
                          alt="bg preview"
                          className="w-full h-32 object-cover rounded-xl"
                        />
                      )}
                  </div>
                )}
              </section>

              {/* Images */}
              <section className="bg-white dark:bg-[#1a1830] rounded-2xl p-6 shadow-sm border border-cream-200 dark:border-amber-900/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-brown-800 dark:text-amber-100/80 text-[11px] uppercase tracking-wider">
                    4-Image Grid
                  </h2>
                  <button
                    onClick={() =>
                      setSettings({
                        ...settings,
                        showImages: !settings.showImages,
                      })
                    }
                    className="text-xs text-brown-500 dark:text-amber-100/60 flex items-center gap-1 hover:text-brown-700 dark:hover:text-amber-100/80"
                  >
                    {settings.showImages ? (
                      <Eye size={12} />
                    ) : (
                      <EyeOff size={12} />
                    )}
                    {settings.showImages ? "Visible" : "Hidden"}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[0, 1, 2, 3].map((i) => {
                    const img = (settings.images[i] as HeroImage) || {
                      url: "",
                      name: "",
                      link: "",
                    };
                    return (
                      <div key={i} className="space-y-2">
                        <label className="text-xs text-brown-500 dark:text-amber-100/60">
                          Image {i + 1}
                        </label>
                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-cream-50 dark:bg-[#12101e] border border-cream-200 dark:border-amber-900/40">
                          {img.url ? (
                            <img
                              src={img.url}
                              alt={`Hero ${i + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-brown-400 dark:text-amber-100/40 text-xs">
                              No image
                            </div>
                          )}
                          <button
                            onClick={() => fileRefs[i].current?.click()}
                            disabled={uploading === i}
                            className="absolute bottom-2 right-2 bg-white/90 dark:bg-black/60 text-brown-700 dark:text-amber-100 p-1.5 rounded-lg text-xs flex items-center gap-1 shadow hover:bg-white dark:hover:bg-black/80 transition-colors"
                          >
                            <Upload size={12} />
                            {uploading === i ? "…" : "Upload"}
                          </button>
                          <input
                            ref={fileRefs[i]}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(i, e)}
                          />
                        </div>
                        <input
                          className={`${inputCls} text-xs`}
                          value={img.url || ""}
                          onChange={(e) =>
                            updateImage(i, { url: e.target.value })
                          }
                          placeholder="Image URL"
                        />
                        <input
                          className={`${inputCls} text-xs`}
                          value={img.name || ""}
                          onChange={(e) =>
                            updateImage(i, { name: e.target.value })
                          }
                          placeholder="Title (e.g. Candles)"
                        />
                        <input
                          className={`${inputCls} text-xs`}
                          value={img.link || ""}
                          onChange={(e) =>
                            updateImage(i, { link: e.target.value })
                          }
                          placeholder="Link (e.g. /categories/scented-candles)"
                        />
                        <div className="pt-3 border-t border-cream-100 dark:border-amber-900/20 mt-3 space-y-2">
                          <label className="text-xs text-brown-500 dark:text-amber-100/60 font-medium block">
                            Offer Badge (Optional)
                          </label>
                          <input
                            className={`${inputCls} text-xs`}
                            value={img.offerType || ""}
                            onChange={(e) =>
                              updateImage(i, { offerType: e.target.value })
                            }
                            placeholder="Type (e.g. Special Offer)"
                          />
                          <input
                            className={`${inputCls} text-xs`}
                            value={img.offerText || ""}
                            onChange={(e) =>
                              updateImage(i, { offerText: e.target.value })
                            }
                            placeholder="Text (e.g. Free shipping on orders...)"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        </div>
        <div className="flex gap-3 justify-end pt-4 mt-4 border-t border-cream-100 dark:border-amber-900/20">
          <Button
            variant="outline"
            onClick={() => setModalOpen(false)}
            type="button"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} loading={saving}>
            <Save size={15} />
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
