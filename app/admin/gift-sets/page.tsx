"use client";

import { useState, useEffect } from "react";
import { Plus, Eye, Trash2, X, Check, Package } from "lucide-react";
import { GiftSet, Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { GS_OCCASIONS } from "@/components/gift-sets/OccasionFilter";

const ACCENT_OPTIONS = [
  { label: "Amber",  value: "#d97706" },
  { label: "Coral",  value: "#c2522a" },
  { label: "Forest", value: "#15803d" },
  { label: "Gold",   value: "#b45309" },
  { label: "Brown",  value: "#5c3d1e" },
];

const STATUS_STYLES: Record<string, string> = {
  live:     "bg-green-100 text-green-700",
  draft:    "bg-amber-100 text-amber-700",
  archived: "bg-gray-100 text-gray-600",
};

type EditableSet = Partial<GiftSet> & { productIds?: string[] };

export default function AdminGiftSetsPage() {
  const [sets, setSets]         = useState<GiftSet[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<GiftSet | null>(null);
  const [editing, setEditing]   = useState<EditableSet>({});
  const [showNew, setShowNew]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [productSearch, setProductSearch] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/gift-sets?all=true").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
    ]).then(([setsData, productsData]) => {
      setSets(setsData);
      setProducts(productsData);
    });
  }, []);

  const reload = () =>
    fetch("/api/gift-sets?all=true")
      .then((r) => r.json())
      .then(setSets);

  const selectSet = (s: GiftSet) => {
    setSelected(s);
    setEditing({
      name: s.name,
      tagline: s.tagline,
      description: s.description,
      occasions: [...s.occasions],
      price: s.price,
      saving: s.saving,
      image: s.image,
      accent: s.accent,
      status: s.status,
      productIds: (s.items ?? []).map((i) => i.id),
    });
    setShowNew(false);
  };

  const openNew = () => {
    setSelected(null);
    setEditing({ name: "", tagline: "", description: "", occasions: [], price: 0, saving: 0, image: "", accent: "#d97706", status: "draft", productIds: [] });
    setShowNew(true);
  };

  const toggleOccasion = (id: string) => {
    setEditing((e) => {
      const occ = e.occasions ?? [];
      return { ...e, occasions: occ.includes(id) ? occ.filter((o) => o !== id) : [...occ, id] };
    });
  };

  const toggleProduct = (productId: string) => {
    setEditing((e) => {
      const ids = e.productIds ?? [];
      return { ...e, productIds: ids.includes(productId) ? ids.filter((i) => i !== productId) : [...ids, productId] };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (showNew) {
        await fetch("/api/gift-sets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editing.name,
            tagline: editing.tagline,
            description: editing.description,
            occasions: editing.occasions ?? [],
            price: Number(editing.price),
            saving: Number(editing.saving),
            image: editing.image,
            accent: editing.accent,
            status: editing.status ?? "draft",
            productIds: editing.productIds ?? [],
          }),
        });
        setShowNew(false);
      } else if (selected) {
        await fetch(`/api/gift-sets/${selected.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editing.name,
            tagline: editing.tagline,
            description: editing.description,
            occasions: editing.occasions ?? [],
            price: Number(editing.price),
            saving: Number(editing.saving),
            image: editing.image,
            accent: editing.accent,
            status: editing.status,
            productIds: editing.productIds ?? [],
          }),
        });
      }
      await reload();
      setSelected(null);
      setEditing({});
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this gift set permanently?")) return;
    await fetch(`/api/gift-sets/${id}`, { method: "DELETE" });
    await reload();
    if (selected?.id === id) { setSelected(null); setEditing({}); }
  };

  const handleToggleStatus = async (s: GiftSet) => {
    const newStatus = s.status === "live" ? "draft" : "live";
    await fetch(`/api/gift-sets/${s.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    await reload();
  };

  const showInspector = showNew || !!selected;
  const editingProductIds = editing.productIds ?? [];
  const editingProducts = products.filter((p) => editingProductIds.includes(p.id));
  const individualSum = editingProducts.reduce((s, p) => s + p.price, 0);
  const filteredProducts = products.filter((p) =>
    !productSearch ||
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.tags?.some((t) => t.toLowerCase().includes(productSearch.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brown-900">Gift Sets</h1>
          <p className="text-brown-500 text-sm mt-1">Curated premade sets shown on /gift-sets</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-amber-700 hover:bg-amber-800 transition-colors"
        >
          <Plus size={16} /> New gift set
        </button>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: showInspector ? "1.4fr 1fr" : "1fr" }}>
        {/* Table */}
        <div className="bg-white rounded-2xl overflow-hidden border border-cream-200">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-cream-100 text-brown-600">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider">Set</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider">Occasions</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider">Products</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider">Price</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {sets.map((s) => {
                const isSelected = selected?.id === s.id;
                return (
                  <tr
                    key={s.id}
                    onClick={() => selectSet(s)}
                    className="cursor-pointer border-t border-cream-200 transition-colors"
                    style={{ background: isSelected ? "#fffbeb" : "#fff" }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-cream-100 flex-shrink-0">
                          {s.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg">🎁</div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-brown-900">{s.name}</div>
                          {s.tagline && <div className="text-xs text-brown-500 italic truncate max-w-xs">{s.tagline}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-brown-600 text-xs">{s.occasions.join(", ") || "—"}</td>
                    <td className="px-4 py-3 text-brown-700">{(s.items ?? []).length}</td>
                    <td className="px-4 py-3 text-right font-semibold text-brown-900">{formatPrice(s.price)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggleStatus(s); }}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[s.status] ?? ""}`}
                      >
                        {s.status}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <a
                          href={`/gift-sets/${s.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-lg text-brown-500 hover:text-brown-700 hover:bg-cream-100 transition-colors"
                          title="Preview"
                        >
                          <Eye size={14} />
                        </a>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {sets.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-brown-400">
                    <Package size={28} className="mx-auto mb-2 opacity-30" />
                    No gift sets yet. Create your first one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Inspector / Create panel */}
        {showInspector && (
          <div className="bg-white rounded-2xl border border-cream-200 p-5 sticky top-6 self-start max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-semibold uppercase tracking-widest text-brown-600">
                {showNew ? "New gift set" : "Edit set"}
              </div>
              <button
                onClick={() => { setSelected(null); setEditing({}); setShowNew(false); }}
                className="p-1.5 rounded-lg text-brown-400 hover:bg-cream-100"
              >
                <X size={16} />
              </button>
            </div>

            {/* Name */}
            <label className="block text-xs font-medium uppercase tracking-wider mb-1.5 text-brown-600">Name</label>
            <input
              value={editing.name ?? ""}
              onChange={(e) => setEditing((p) => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-cream-300 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />

            {/* Tagline */}
            <label className="block text-xs font-medium uppercase tracking-wider mb-1.5 text-brown-600">Tagline</label>
            <input
              value={editing.tagline ?? ""}
              onChange={(e) => setEditing((p) => ({ ...p, tagline: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-cream-300 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />

            {/* Description */}
            <label className="block text-xs font-medium uppercase tracking-wider mb-1.5 text-brown-600">Short description</label>
            <textarea
              value={editing.description ?? ""}
              onChange={(e) => setEditing((p) => ({ ...p, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-cream-300 text-sm mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
            />

            {/* Price + Saving */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1.5 text-brown-600">Price (paise)</label>
                <input
                  type="number"
                  value={editing.price ?? 0}
                  onChange={(e) => setEditing((p) => ({ ...p, price: Number(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-lg border border-cream-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                {editing.price ? <div className="text-xs text-brown-500 mt-1">{formatPrice(editing.price as number)}</div> : null}
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1.5 text-brown-600">Saving (paise)</label>
                <input
                  type="number"
                  value={editing.saving ?? 0}
                  onChange={(e) => setEditing((p) => ({ ...p, saving: Number(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-lg border border-cream-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            {/* Price helper */}
            {editingProducts.length > 0 && (
              <div className="mb-3 px-3 py-2 rounded-lg text-xs" style={{ background: "#f9f5ee", color: "#7c5c3a" }}>
                Individual total: <strong>{formatPrice(individualSum)}</strong>
                {editing.price ? (
                  <> · Saving: <strong>{formatPrice(individualSum - (editing.price as number))}</strong></>
                ) : null}
              </div>
            )}

            {/* Image URL */}
            <label className="block text-xs font-medium uppercase tracking-wider mb-1.5 text-brown-600">Image URL</label>
            <input
              value={editing.image ?? ""}
              onChange={(e) => setEditing((p) => ({ ...p, image: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-cream-300 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="https://..."
            />

            {/* Accent colour */}
            <label className="block text-xs font-medium uppercase tracking-wider mb-1.5 text-brown-600">Accent colour</label>
            <div className="flex gap-2 mb-3">
              {ACCENT_OPTIONS.map((a) => (
                <button
                  key={a.value}
                  onClick={() => setEditing((p) => ({ ...p, accent: a.value }))}
                  title={a.label}
                  className="w-7 h-7 rounded-full transition-all"
                  style={{
                    background: a.value,
                    border: editing.accent === a.value ? "2px solid #1c1209" : "2px solid transparent",
                    boxShadow: editing.accent === a.value ? "0 0 0 3px #fefdf8, 0 0 0 4px #1c1209" : "none",
                  }}
                />
              ))}
            </div>

            {/* Status */}
            <label className="block text-xs font-medium uppercase tracking-wider mb-1.5 text-brown-600">Status</label>
            <select
              value={editing.status ?? "draft"}
              onChange={(e) => setEditing((p) => ({ ...p, status: e.target.value as GiftSet["status"] }))}
              className="w-full px-3 py-2 rounded-lg border border-cream-300 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="live">Live</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            {/* Occasions */}
            <label className="block text-xs font-medium uppercase tracking-wider mb-2 text-brown-600">Occasions / Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {GS_OCCASIONS.map((o) => {
                const active = (editing.occasions ?? []).includes(o.id);
                return (
                  <button
                    key={o.id}
                    onClick={() => toggleOccasion(o.id)}
                    className="px-2.5 py-1 rounded-full text-xs font-medium transition-all"
                    style={{
                      background: active ? "#1c1209" : "transparent",
                      color: active ? "#fefdf8" : "#5c3d1e",
                      border: `1px solid ${active ? "#1c1209" : "#d4c9b4"}`,
                    }}
                  >
                    {active && <Check size={10} className="inline mr-1" />}{o.label}
                  </button>
                );
              })}
            </div>

            {/* Products in this set */}
            <label className="block text-xs font-medium uppercase tracking-wider mb-2 text-brown-600">
              Products ({editingProductIds.length})
            </label>

            {editingProducts.length > 0 && (
              <div className="flex flex-col gap-1.5 mb-3 max-h-40 overflow-y-auto">
                {editingProducts.map((product) => {
                  const image = product.images?.[0] ?? "";
                  return (
                    <div key={product.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-cream-50 border border-cream-200">
                      {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={image} alt={product.name} className="w-7 h-7 rounded object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-7 h-7 rounded bg-amber-50 flex items-center justify-center text-sm flex-shrink-0">🎁</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-brown-900 truncate">{product.name}</div>
                        <div className="text-xs text-brown-500">{formatPrice(product.price)}</div>
                      </div>
                      <button
                        onClick={() => toggleProduct(product.id)}
                        className="text-brown-400 hover:text-red-500"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Product search / add */}
            <input
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Search products to add…"
              className="w-full px-3 py-2 rounded-lg border border-cream-300 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto mb-4">
              {filteredProducts
                .filter((p) => !editingProductIds.includes(p.id))
                .map((product) => {
                  const image = product.images?.[0] ?? "";
                  return (
                    <button
                      key={product.id}
                      onClick={() => toggleProduct(product.id)}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-left hover:bg-cream-50 transition-colors w-full"
                    >
                      {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={image} alt={product.name} className="w-7 h-7 rounded object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-7 h-7 rounded bg-amber-50 flex items-center justify-center text-sm flex-shrink-0">🎁</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-brown-900 truncate">{product.name}</div>
                        <div className="text-xs text-brown-500">{product.tags?.[0] ?? ""} · {formatPrice(product.price)}</div>
                      </div>
                      <Plus size={14} className="text-brown-400 flex-shrink-0" />
                    </button>
                  );
                })}
            </div>

            <button
              onClick={handleSave}
              disabled={saving || !editing.name}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-amber-700 hover:bg-amber-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving…" : showNew ? "Create gift set" : "Save changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
