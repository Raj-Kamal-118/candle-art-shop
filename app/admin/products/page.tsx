"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, Search, Package, Upload, ChevronDown, ChevronUp } from "lucide-react";
import { Product, Category, CustomizationOption, VariantPricing } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

// ─── Variant pricing helpers ──────────────────────────────────────────────────

function buildVariantKeys(options: CustomizationOption[]): string[][] {
  const pricingOptions = options.filter((o) => o.affectsPrice && o.type === "select" && o.options?.length);
  if (pricingOptions.length === 0) return [];
  // Cartesian product of all price-affecting option values
  const combos: string[][] = [[]];
  for (const opt of pricingOptions) {
    const next: string[][] = [];
    for (const combo of combos) {
      for (const val of opt.options!) {
        next.push([...combo, val]);
      }
    }
    combos.length = 0;
    combos.push(...next);
  }
  return combos;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    compareAtPrice: "",
    categoryId: "",
    images: "",
    tags: "",
    inStock: true,
    stockCount: "10",
    featured: false,
    customizable: false,
  });

  const [customOptions, setCustomOptions] = useState<CustomizationOption[]>([]);
  const [variantPricing, setVariantPricing] = useState<VariantPricing>({});
  // Stores the raw comma-separated string while the user is typing in an options field.
  // Keyed by option id. Only parsed into the array on blur to avoid stripping mid-type commas.
  const [rawOptionInputs, setRawOptionInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([prods, cats]) => {
      setProducts(prods);
      setCategories(cats);
      setLoading(false);
    });
  }, []);

  const openAdd = () => {
    setEditProduct(null);
    setForm({
      name: "",
      description: "",
      price: "",
      compareAtPrice: "",
      categoryId: categories[0]?.id || "",
      images: "",
      tags: "",
      inStock: true,
      stockCount: "10",
      featured: false,
      customizable: false,
    });
    setCustomOptions([]);
    setVariantPricing({});
    setRawOptionInputs({});
    setShowCustomization(false);
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      compareAtPrice: product.compareAtPrice?.toString() || "",
      categoryId: product.categoryId,
      images: product.images.join(", "),
      tags: product.tags.join(", "),
      inStock: product.inStock,
      stockCount: product.stockCount.toString(),
      featured: product.featured,
      customizable: product.customizable,
    });
    const opts = product.customizationOptions || [];
    setCustomOptions(opts);
    // Pre-populate raw inputs from saved options so the field shows correctly on edit
    setRawOptionInputs(
      Object.fromEntries(opts.map((o) => [o.id, o.options?.join(", ") || ""]))
    );
    setVariantPricing(product.variantPricing || {});
    setShowCustomization(!!product.customizable);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      compareAtPrice: form.compareAtPrice ? parseFloat(form.compareAtPrice) : null,
      categoryId: form.categoryId,
      images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
      tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
      inStock: form.inStock,
      stockCount: parseInt(form.stockCount),
      featured: form.featured,
      customizable: form.customizable,
      customizationOptions: customOptions,
      variantPricing,
    };

    if (editProduct) {
      const res = await fetch(`/api/products/${editProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const updated = await res.json();
      setProducts((prev) => prev.map((p) => (p.id === editProduct.id ? updated : p)));
    } else {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const created = await res.json();
      setProducts((prev) => [...prev, created]);
    }
    setModalOpen(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const { url, error } = await res.json();
      if (error) { alert(error); return; }
      setForm((prev) => ({ ...prev, images: prev.images ? `${prev.images}, ${url}` : url }));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await fetch(`/api/products/${deleteId}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== deleteId));
    setDeleteId(null);
  };

  // ── Customization option helpers ───────────────────────────────────────────

  const addOption = () => {
    const newOpt: CustomizationOption = {
      id: `opt-${Date.now()}`,
      label: "New Option",
      type: "select",
      options: ["Option A", "Option B"],
      affectsPrice: false,
    };
    setCustomOptions((prev) => [...prev, newOpt]);
    setRawOptionInputs((prev) => ({ ...prev, [newOpt.id]: "Option A, Option B" }));
  };

  const updateOption = (i: number, updates: Partial<CustomizationOption>) => {
    setCustomOptions((prev) =>
      prev.map((o, idx) => (idx === i ? { ...o, ...updates } : o))
    );
    // If affectsPrice changed, reset variant pricing
    if ("affectsPrice" in updates || "options" in updates) {
      setVariantPricing({});
    }
  };

  const removeOption = (i: number) => {
    setCustomOptions((prev) => prev.filter((_, idx) => idx !== i));
    setVariantPricing({});
  };

  // Regenerate variant pricing grid when options change
  const variantCombos = buildVariantKeys(customOptions);
  const pricingOptionLabels = customOptions
    .filter((o) => o.affectsPrice && o.type === "select")
    .map((o) => o.label);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  const inputCls = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 w-64"
          />
        </div>
        <Button onClick={openAdd} size="sm">
          <Plus size={16} /> Add Product
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="mx-auto text-gray-300 mb-3" size={40} />
            <p className="text-gray-400">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => {
                  const cat = categories.find((c) => c.id === product.categoryId);
                  return (
                    <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                            <p className="text-xs text-gray-400">
                              {product.featured ? "Featured · " : ""}
                              {product.customizable ? "Customizable" : ""}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-600">{cat?.name || "—"}</td>
                      <td className="px-4 py-4">
                        <span className="font-semibold text-gray-900">{formatPrice(product.price)}</span>
                        {product.compareAtPrice && (
                          <span className="text-xs text-gray-400 line-through ml-1">{formatPrice(product.compareAtPrice)}</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-gray-600">{product.stockCount}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(product)} className="p-2 text-gray-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => setDeleteId(product.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editProduct ? "Edit Product" : "Add Product"} size="xl">
        <form onSubmit={handleSubmit} className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">

          {/* Basic info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputCls} resize-none`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (₹) *</label>
              <input required type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compare At Price</label>
              <input type="number" step="0.01" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className={inputCls}>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Count</label>
              <input type="number" value={form.stockCount} onChange={(e) => setForm({ ...form, stockCount: e.target.value })} className={inputCls} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
              <div className="flex gap-2">
                <input value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} placeholder="Paste URL or upload" className={`flex-1 ${inputCls}`} />
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                  <Upload size={14} /> {uploading ? "…" : "Upload"}
                </button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <p className="text-xs text-gray-400 mt-1">Multiple URLs comma-separated.</p>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
              <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className={inputCls} />
            </div>
            <div className="flex items-center gap-6">
              {(["inStock", "featured", "customizable"] as const).map((key) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form[key]} onChange={(e) => {
                    setForm({ ...form, [key]: e.target.checked });
                    if (key === "customizable") setShowCustomization(e.target.checked);
                  }} className="accent-amber-600 w-4 h-4" />
                  <span className="text-sm text-gray-700 capitalize">{key === "inStock" ? "In Stock" : key}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Customization section */}
          {form.customizable && (
            <div className="border border-amber-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowCustomization(!showCustomization)}
                className="w-full flex items-center justify-between px-4 py-3 bg-amber-50 text-sm font-medium text-amber-800 hover:bg-amber-100 transition-colors"
              >
                Customization Options & Variant Pricing
                {showCustomization ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showCustomization && (
                <div className="p-4 space-y-4">
                  <p className="text-xs text-gray-500">
                    Define options customers can choose from. Mark options as &quot;Affects Price&quot; to set custom pricing per combination.
                  </p>

                  {/* Options list */}
                  {customOptions.map((opt, i) => (
                    <div key={opt.id} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-500">Option {i + 1}</span>
                        <button type="button" onClick={() => removeOption(i)} className="text-red-400 hover:text-red-600">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Label</label>
                          <input className={inputCls} value={opt.label} onChange={(e) => updateOption(i, { label: e.target.value })} />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Type</label>
                          <select className={inputCls} value={opt.type} onChange={(e) => updateOption(i, { type: e.target.value as CustomizationOption["type"] })}>
                            <option value="select">Select (dropdown)</option>
                            <option value="text">Text (free input)</option>
                            <option value="color">Colour picker</option>
                          </select>
                        </div>
                      </div>
                      {opt.type === "select" && (
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Options (comma-separated)</label>
                          <input
                            className={inputCls}
                            value={rawOptionInputs[opt.id] ?? opt.options?.join(", ") ?? ""}
                            onChange={(e) =>
                              // Only update the raw display string — don't parse yet so mid-type
                              // commas (e.g. "Normal,") are not stripped by filter(Boolean)
                              setRawOptionInputs((prev) => ({ ...prev, [opt.id]: e.target.value }))
                            }
                            onBlur={(e) => {
                              // Parse into an array only when the user leaves the field
                              const parsed = e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean);
                              updateOption(i, { options: parsed });
                              setRawOptionInputs((prev) => ({
                                ...prev,
                                [opt.id]: parsed.join(", "),
                              }));
                            }}
                            placeholder="Option A, Option B, Option C"
                          />
                        </div>
                      )}
                      {opt.type === "select" && (
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={opt.affectsPrice || false}
                            onChange={(e) => updateOption(i, { affectsPrice: e.target.checked })}
                            className="accent-amber-600 w-4 h-4"
                          />
                          <span className="text-xs text-gray-700">Affects Price (enable variant pricing for this option)</span>
                        </label>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addOption}
                    className="text-xs text-amber-700 hover:text-amber-800 flex items-center gap-1 font-medium"
                  >
                    <Plus size={12} /> Add Customization Option
                  </button>

                  {/* Variant pricing matrix */}
                  {variantCombos.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-gray-700">
                          Variant Pricing Matrix ({variantCombos.length} combinations)
                        </p>
                        <p className="text-xs text-gray-400">Leave 0 to use base price</p>
                      </div>
                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <table className="w-full text-xs">
                          <thead className="bg-gray-50">
                            <tr>
                              {pricingOptionLabels.map((l) => (
                                <th key={l} className="text-left px-3 py-2 font-medium text-gray-500">{l}</th>
                              ))}
                              <th className="text-left px-3 py-2 font-medium text-gray-500">Price (₹)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {variantCombos.map((combo) => {
                              const key = combo.join("|");
                              return (
                                <tr key={key} className="border-t border-gray-100">
                                  {combo.map((val, vi) => (
                                    <td key={vi} className="px-3 py-2 text-gray-700">{val}</td>
                                  ))}
                                  <td className="px-3 py-2">
                                    <input
                                      type="number"
                                      step="0.01"
                                      value={variantPricing[key] || ""}
                                      onChange={(e) => {
                                        const v = parseFloat(e.target.value);
                                        setVariantPricing((prev) => ({
                                          ...prev,
                                          [key]: isNaN(v) ? 0 : v,
                                        }));
                                      }}
                                      placeholder={form.price || "0"}
                                      className="w-24 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400"
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)} type="button">Cancel</Button>
            <Button type="submit">{editProduct ? "Save Changes" : "Create Product"}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Product" size="sm">
        <p className="text-gray-600 mb-5">Are you sure you want to delete this product? This cannot be undone.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
