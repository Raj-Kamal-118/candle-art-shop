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
} from "lucide-react";
import { HeroSettings, HeroButton, HeroStat, HeroButtonIcon } from "@/lib/types";
import Button from "@/components/ui/Button";

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
    { text: "Shop Collection", link: "/products", icon: "arrow-right", variant: "primary" },
    { text: "Custom Orders", link: "/categories/custom-artwork", icon: "", variant: "secondary" },
  ],
  backgroundType: "gradient",
  backgroundValue: "",
  showImages: true,
  images: [
    "https://picsum.photos/seed/hero1/400/550",
    "https://picsum.photos/seed/hero3/400/400",
    "https://picsum.photos/seed/hero2/400/400",
    "https://picsum.photos/seed/hero4/400/550",
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

export default function AdminHeroPage() {
  const [settings, setSettings] = useState<HeroSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState<number | null>(null);
  const fileRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const bgFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/hero-settings")
      .then((r) => r.json())
      .then((data) => {
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
    if (error) { alert(error); return; }
    onUrl(url);
  };

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(index);
    try {
      await uploadImage(file, (url) => {
        const newImages = [...settings.images];
        newImages[index] = url;
        setSettings({ ...settings, images: newImages });
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
      idx === i ? { ...b, ...updates } : b
    );
    setSettings({ ...settings, buttons: newButtons });
  };

  const removeButton = (i: number) => {
    setSettings({ ...settings, buttons: settings.buttons.filter((_, idx) => idx !== i) });
  };

  const addStat = () => {
    setSettings({
      ...settings,
      stats: [...settings.stats, { value: "0+", label: "New Metric" }],
    });
  };

  const updateStat = (i: number, updates: Partial<HeroStat>) => {
    const newStats = settings.stats.map((s, idx) =>
      idx === i ? { ...s, ...updates } : s
    );
    setSettings({ ...settings, stats: newStats });
  };

  const removeStat = (i: number) => {
    setSettings({ ...settings, stats: settings.stats.filter((_, idx) => idx !== i) });
  };

  const field = (label: string, children: React.ReactNode) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );

  const inputCls = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">Loading hero settings…</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
            <Layers size={18} className="text-amber-700" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg">Hero Section</h1>
            <p className="text-xs text-gray-500">Customize the homepage hero banner</p>
          </div>
        </div>
        <Button onClick={handleSave} loading={saving} size="sm">
          <Save size={15} />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* ── Left column: Text & Content ─────────────────────────────── */}
        <div className="space-y-6">

          {/* Text content */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Text Content</h2>
            {field("Badge Text", <input className={inputCls} value={settings.badgeText} onChange={(e) => setSettings({ ...settings, badgeText: e.target.value })} />)}
            {field("Heading (H1)", <input className={inputCls} value={settings.h1Text} onChange={(e) => setSettings({ ...settings, h1Text: e.target.value })} />)}
            {field("Highlighted Text (coloured line)", <input className={inputCls} value={settings.h1HighlightedText} onChange={(e) => setSettings({ ...settings, h1HighlightedText: e.target.value })} />)}
            {field("Highlight Colour", (
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.h1TextColor}
                  onChange={(e) => setSettings({ ...settings, h1TextColor: e.target.value })}
                  className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer p-0.5"
                />
                <input
                  className={`${inputCls} flex-1`}
                  value={settings.h1TextColor}
                  onChange={(e) => setSettings({ ...settings, h1TextColor: e.target.value })}
                  placeholder="#e85d4a"
                />
              </div>
            ))}
            {field("Description", (
              <textarea
                className={`${inputCls} resize-none`}
                rows={3}
                value={settings.description}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
              />
            ))}
            {field("Floating Badge Text", (
              <input
                className={inputCls}
                value={settings.floatingBadgeText || ""}
                onChange={(e) => setSettings({ ...settings, floatingBadgeText: e.target.value })}
                placeholder="Free shipping on Orders over ₹999"
              />
            ))}
          </section>

          {/* Buttons */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Buttons (max 6, 2 per row)</h2>
              <button
                onClick={addButton}
                disabled={settings.buttons.length >= 6}
                className="text-xs text-amber-700 hover:text-amber-800 flex items-center gap-1 disabled:opacity-40"
              >
                <Plus size={12} /> Add
              </button>
            </div>
            {settings.buttons.map((btn, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <GripVertical size={12} /> Button {i + 1}
                  </div>
                  <button onClick={() => removeButton(i)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Text</label>
                    <input className={inputCls} value={btn.text} onChange={(e) => updateButton(i, { text: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Link</label>
                    <input className={inputCls} value={btn.link} onChange={(e) => updateButton(i, { link: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Variant</label>
                    <select className={inputCls} value={btn.variant} onChange={(e) => updateButton(i, { variant: e.target.value as "primary" | "secondary" })}>
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Icon</label>
                    <select className={inputCls} value={btn.icon} onChange={(e) => updateButton(i, { icon: e.target.value as HeroButtonIcon })}>
                      {ICON_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Stats */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Stats Bar</h2>
                <button
                  onClick={() => setSettings({ ...settings, showStats: !settings.showStats })}
                  className="text-xs text-gray-500 flex items-center gap-1 hover:text-gray-700"
                >
                  {settings.showStats ? <Eye size={12} /> : <EyeOff size={12} />}
                  {settings.showStats ? "Visible" : "Hidden"}
                </button>
              </div>
              <button onClick={addStat} className="text-xs text-amber-700 hover:text-amber-800 flex items-center gap-1">
                <Plus size={12} /> Add
              </button>
            </div>
            {settings.stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  className={`${inputCls} w-24`}
                  value={stat.value}
                  onChange={(e) => updateStat(i, { value: e.target.value })}
                  placeholder="500+"
                />
                <input
                  className={`${inputCls} flex-1`}
                  value={stat.label}
                  onChange={(e) => updateStat(i, { label: e.target.value })}
                  placeholder="Happy Customers"
                />
                <button onClick={() => removeStat(i)} className="text-red-400 hover:text-red-600 flex-none">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </section>
        </div>

        {/* ── Right column: Background & Images ──────────────────────── */}
        <div className="space-y-6">

          {/* Background */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Background</h2>
            {field("Background Type", (
              <div className="grid grid-cols-4 gap-2">
                {(["gradient", "color", "image", "video"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSettings({ ...settings, backgroundType: type })}
                    className={`py-2 text-xs font-medium rounded-lg border capitalize transition-colors ${
                      settings.backgroundType === type
                        ? "border-amber-500 bg-amber-50 text-amber-700"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            ))}

            {settings.backgroundType === "color" && (
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.backgroundValue || "#fdf6ec"}
                  onChange={(e) => setSettings({ ...settings, backgroundValue: e.target.value })}
                  className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer p-0.5"
                />
                <input
                  className={`${inputCls} flex-1`}
                  value={settings.backgroundValue || ""}
                  onChange={(e) => setSettings({ ...settings, backgroundValue: e.target.value })}
                  placeholder="#fdf6ec"
                />
              </div>
            )}

            {(settings.backgroundType === "image" || settings.backgroundType === "video") && (
              <div className="space-y-2">
                <input
                  className={inputCls}
                  value={settings.backgroundValue || ""}
                  onChange={(e) => setSettings({ ...settings, backgroundValue: e.target.value })}
                  placeholder={settings.backgroundType === "image" ? "https://... (image URL)" : "https://... (video URL)"}
                />
                {settings.backgroundType === "image" && (
                  <>
                    <button
                      type="button"
                      onClick={() => bgFileRef.current?.click()}
                      disabled={uploading === -1}
                      className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <Upload size={14} />
                      {uploading === -1 ? "Uploading…" : "Upload Image"}
                    </button>
                    <input ref={bgFileRef} type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />
                  </>
                )}
                {settings.backgroundValue && settings.backgroundType === "image" && (
                  <img src={settings.backgroundValue} alt="bg preview" className="w-full h-32 object-cover rounded-xl" />
                )}
              </div>
            )}
          </section>

          {/* Images */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">4-Image Grid</h2>
              <button
                onClick={() => setSettings({ ...settings, showImages: !settings.showImages })}
                className="text-xs text-gray-500 flex items-center gap-1 hover:text-gray-700"
              >
                {settings.showImages ? <Eye size={12} /> : <EyeOff size={12} />}
                {settings.showImages ? "Visible" : "Hidden"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <label className="text-xs text-gray-500">Image {i + 1}</label>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    {settings.images[i] ? (
                      <img
                        src={settings.images[i]}
                        alt={`Hero ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No image
                      </div>
                    )}
                    <button
                      onClick={() => fileRefs[i].current?.click()}
                      disabled={uploading === i}
                      className="absolute bottom-2 right-2 bg-white/90 text-gray-700 p-1.5 rounded-lg text-xs flex items-center gap-1 shadow hover:bg-white"
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
                    value={settings.images[i] || ""}
                    onChange={(e) => {
                      const newImages = [...settings.images];
                      newImages[i] = e.target.value;
                      setSettings({ ...settings, images: newImages });
                    }}
                    placeholder="Or paste URL"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Sticky save bar */}
      <div className="fixed bottom-6 right-6">
        <Button onClick={handleSave} loading={saving} size="lg" className="shadow-2xl">
          <Save size={16} />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
