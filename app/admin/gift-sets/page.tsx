"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Eye,
  Trash2,
  X,
  Check,
  Package,
  Upload,
  GripVertical,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GiftSet, Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { GS_OCCASIONS } from "@/components/gift-sets/OccasionFilter";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const ACCENT_OPTIONS = [
  { label: "Amber", value: "#d97706" },
  { label: "Coral", value: "#c2522a" },
  { label: "Forest", value: "#15803d" },
  { label: "Gold", value: "#b45309" },
  { label: "Brown", value: "#5c3d1e" },
];

const STATUS_STYLES: Record<string, string> = {
  live: "bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-300",
  draft: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  archived:
    "bg-cream-100 text-brown-600 dark:bg-amber-900/30 dark:text-amber-100/70",
};

type EditableSet = Partial<GiftSet> & { productIds?: string[]; slug?: string };

function SortableGiftSetRow({
  s,
  isSelected,
  onSelect,
  onToggleStatus,
  onDelete,
}: {
  s: GiftSet;
  isSelected: boolean;
  onSelect: (s: GiftSet) => void;
  onToggleStatus: (s: GiftSet) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: s.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      onClick={() => onSelect(s)}
      className={`cursor-pointer border-t border-cream-100 dark:border-amber-900/20 transition-colors hover:bg-cream-50 dark:hover:bg-amber-900/10 ${isSelected ? "bg-amber-50/50 dark:bg-amber-900/20" : "bg-transparent"}`}
    >
      <td className="pl-3 pr-1 py-3 w-8" onClick={(e) => e.stopPropagation()}>
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-cream-300 dark:text-amber-900/40 hover:text-brown-400 dark:hover:text-amber-100/60 touch-none"
          title="Drag to reorder"
        >
          <GripVertical size={16} />
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-cream-100 dark:bg-[#12101e] flex-shrink-0">
            {s.image ? (
              <img
                src={s.image}
                alt={s.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg">
                🎁
              </div>
            )}
          </div>
          <div>
            <div className="font-semibold text-brown-900 dark:text-amber-100">
              {s.name}
            </div>
            {s.tagline && (
              <div className="text-xs text-brown-500 dark:text-amber-100/60 italic truncate max-w-xs">
                {s.tagline}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-brown-600 dark:text-amber-100/70 text-xs">
        {s.occasions?.join(", ") || "—"}
      </td>
      <td className="px-4 py-3 text-brown-700 dark:text-amber-100/80">
        {(s.items ?? []).length}
      </td>
      <td className="px-4 py-3 text-right font-semibold text-brown-900 dark:text-amber-100">
        {formatPrice(s.price)}
      </td>
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus(s);
          }}
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase ${STATUS_STYLES[s.status] ?? ""}`}
        >
          {s.status}
        </button>
      </td>
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-1 justify-end">
          <a
            href={`/gift-sets/${s.slug}`}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-lg text-brown-400 dark:text-amber-100/50 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
            title="Preview"
          >
            <Eye size={14} />
          </a>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(s.id);
            }}
            className="p-1.5 rounded-lg text-brown-400 dark:text-amber-100/50 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminGiftSetsPage() {
  const [sets, setSets] = useState<GiftSet[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<GiftSet | null>(null);
  const [editing, setEditing] = useState<EditableSet>({});
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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

  const selectSet = async (s: any) => {
    setSelected(s);

    let initialIds: string[] = [];
    if (Array.isArray(s.productIds)) initialIds = s.productIds;
    else if (Array.isArray(s.product_ids)) initialIds = s.product_ids;
    else if (Array.isArray(s.itemIds)) initialIds = s.itemIds;
    else if (Array.isArray(s.items)) {
      initialIds = s.items
        .map((i: any) => (typeof i === "string" ? i : i.id))
        .filter(Boolean);
    }

    setEditing({
      name: s.name,
      slug: s.slug,
      tagline: s.tagline,
      description: s.description,
      occasions: s.occasions ? [...s.occasions] : [],
      price: s.price,
      saving: s.saving,
      image: s.image,
      accent: s.accent,
      status: s.status,
      productIds: initialIds,
    });
    setShowNew(false);
    setModalOpen(true);

    // Fetch full set details to ensure we have the item mappings if they were omitted in the list view
    try {
      const res = await fetch(`/api/gift-sets/${s.id}`);
      if (res.ok) {
        const fullSet = await res.json();
        let fetchedIds: string[] = [];
        if (Array.isArray(fullSet.productIds)) fetchedIds = fullSet.productIds;
        else if (Array.isArray(fullSet.product_ids))
          fetchedIds = fullSet.product_ids;
        else if (Array.isArray(fullSet.itemIds)) fetchedIds = fullSet.itemIds;
        else if (Array.isArray(fullSet.items)) {
          fetchedIds = fullSet.items
            .map((i: any) => (typeof i === "string" ? i : i.id))
            .filter(Boolean);
        }
        if (fetchedIds.length > 0) {
          setEditing((prev) => ({ ...prev, productIds: fetchedIds }));
        }
      }
    } catch (err) {
      console.error("Failed to fetch full set details", err);
    }
  };

  const openNew = () => {
    setSelected(null);
    setEditing({
      name: "",
      slug: "",
      tagline: "",
      description: "",
      occasions: [],
      price: 0,
      saving: 0,
      image: "",
      accent: "#d97706",
      status: "draft",
      productIds: [],
    });
    setShowNew(true);
    setModalOpen(true);
  };

  const toggleOccasion = (id: string) => {
    setEditing((e) => {
      const occ = e.occasions ?? [];
      return {
        ...e,
        occasions: occ.includes(id)
          ? occ.filter((o) => o !== id)
          : [...occ, id],
      };
    });
  };

  const toggleProduct = (productId: string) => {
    setEditing((e) => {
      const ids = e.productIds ?? [];
      return {
        ...e,
        productIds: ids.includes(productId)
          ? ids.filter((i) => i !== productId)
          : [...ids, productId],
      };
    });
  };

  const moveProduct = (index: number, direction: "up" | "down") => {
    setEditing((e) => {
      const ids = [...(e.productIds ?? [])];
      if (direction === "up" && index > 0) {
        [ids[index - 1], ids[index]] = [ids[index], ids[index - 1]];
      } else if (direction === "down" && index < ids.length - 1) {
        [ids[index], ids[index + 1]] = [ids[index + 1], ids[index]];
      }
      return { ...e, productIds: ids };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payloadSlug =
        editing.slug ||
        editing.name
          ?.toLowerCase()
          .replace(/[\s_]+/g, "-")
          .replace(/[^\w-]+/g, "");
      if (showNew) {
        await fetch("/api/gift-sets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editing.name,
            slug: payloadSlug,
            tagline: editing.tagline,
            description: editing.description,
            occasions: editing.occasions ?? [],
            price: Number(editing.price),
            saving: Number(editing.saving),
            image: editing.image,
            accent: editing.accent,
            status: editing.status ?? "draft",
            productIds: editing.productIds ?? [],
            itemIds: editing.productIds ?? [], // Sent as a fallback in case API expects itemIds
          }),
        });
        setShowNew(false);
      } else if (selected) {
        await fetch(`/api/gift-sets/${selected.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editing.name,
            slug: payloadSlug,
            tagline: editing.tagline,
            description: editing.description,
            occasions: editing.occasions ?? [],
            price: Number(editing.price),
            saving: Number(editing.saving),
            image: editing.image,
            accent: editing.accent,
            status: editing.status,
            productIds: editing.productIds ?? [],
            itemIds: editing.productIds ?? [], // Sent as a fallback in case API expects itemIds
          }),
        });
      }
      await reload();
      setSelected(null);
      setEditing({});
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
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
      if (error) {
        alert(error);
        return;
      }
      setEditing((p) => ({ ...p, image: url }));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this gift set permanently?")) return;
    await fetch(`/api/gift-sets/${id}`, { method: "DELETE" });
    await reload();
    if (selected?.id === id) {
      setSelected(null);
      setEditing({});
    }
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sets.findIndex((s) => s.id === active.id);
    const newIndex = sets.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(sets, oldIndex, newIndex);

    setSets(reordered);
    try {
      await fetch("/api/gift-sets/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          reordered.map((s, i) => ({ id: s.id, sortOrder: i + 1 })),
        ),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const editingProductIds = editing.productIds ?? [];
  const editingProducts = editingProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[];
  const individualSum = editingProducts.reduce((s, p) => s + p.price, 0);
  const filteredProducts = products.filter(
    (p) =>
      !productSearch ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.tags?.some((t) =>
        t.toLowerCase().includes(productSearch.toLowerCase()),
      ),
  );

  const inputCls =
    "w-full px-3 py-2 bg-white dark:bg-[#12101e] border border-brown-300 dark:border-amber-900/40 rounded-lg text-sm text-brown-900 dark:text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500/50 transition-colors placeholder:text-brown-400 dark:placeholder:text-amber-100/30";
  const labelCls =
    "block text-[13px] font-medium text-brown-800 dark:text-amber-100/80 mb-1.5";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brown-900 dark:text-amber-100">
            Gift Sets
          </h1>
          <p className="text-brown-500 dark:text-amber-100/60 text-sm mt-1">
            Curated premade sets shown on /gift-sets
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-amber-700 hover:bg-amber-800 transition-colors"
        >
          <Plus size={16} /> New gift set
        </button>
      </div>

      <div className="space-y-6">
        {/* Table */}
        <div className="bg-white dark:bg-[#1a1830] rounded-2xl overflow-hidden shadow-sm border border-cream-200 dark:border-amber-900/30">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-cream-50 dark:bg-[#12101e] text-[11px] font-semibold text-brown-500 dark:text-amber-100/60 border-b border-cream-200 dark:border-amber-900/30 uppercase tracking-wider">
              <tr>
                <th className="w-8 pl-3" />
                <th className="text-left px-4 py-3">Set</th>
                <th className="text-left px-4 py-3">Occasions</th>
                <th className="text-left px-4 py-3">Products</th>
                <th className="text-right px-4 py-3">Price</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sets.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <tbody>
                  {sets.map((s) => (
                    <SortableGiftSetRow
                      key={s.id}
                      s={s}
                      isSelected={selected?.id === s.id}
                      onSelect={selectSet}
                      onToggleStatus={handleToggleStatus}
                      onDelete={handleDelete}
                    />
                  ))}
                  {sets.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-12 text-center text-brown-400 dark:text-amber-100/50"
                      >
                        <Package
                          size={28}
                          className="mx-auto mb-2 opacity-30"
                        />
                        No gift sets yet. Create your first one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </SortableContext>
            </DndContext>
          </table>
        </div>

        {/* Add/Edit Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelected(null);
            setEditing({});
            setShowNew(false);
          }}
          title={showNew ? "New Gift Set" : "Edit Gift Set"}
          size="xl"
        >
          <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className={labelCls}>Name *</label>
                <input
                  required
                  value={editing.name ?? ""}
                  onChange={(e) =>
                    setEditing((p) => ({ ...p, name: e.target.value }))
                  }
                  className={inputCls}
                />
              </div>

              {/* Slug */}
              <div>
                <label className={labelCls}>Slug</label>
                <input
                  value={editing.slug ?? ""}
                  onChange={(e) =>
                    setEditing((p) => ({ ...p, slug: e.target.value }))
                  }
                  className={inputCls}
                  placeholder="Auto-generated if empty"
                />
              </div>

              {/* Tagline */}
              <div className="col-span-2">
                <label className={labelCls}>Tagline</label>
                <input
                  value={editing.tagline ?? ""}
                  onChange={(e) =>
                    setEditing((p) => ({ ...p, tagline: e.target.value }))
                  }
                  className={inputCls}
                />
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label className={labelCls}>Short description</label>
                <textarea
                  value={editing.description ?? ""}
                  onChange={(e) =>
                    setEditing((p) => ({ ...p, description: e.target.value }))
                  }
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </div>

              {/* Price */}
              <div>
                <label className={labelCls}>Price (paise)</label>
                <input
                  type="number"
                  value={editing.price ?? 0}
                  onChange={(e) =>
                    setEditing((p) => ({ ...p, price: Number(e.target.value) }))
                  }
                  className={inputCls}
                />
                {editing.price ? (
                  <div className="text-xs text-brown-500 dark:text-amber-100/60 mt-1">
                    {formatPrice(editing.price as number)}
                  </div>
                ) : null}
              </div>

              {/* Saving */}
              <div>
                <label className={labelCls}>Saving (paise)</label>
                <input
                  type="number"
                  value={editing.saving ?? 0}
                  onChange={(e) =>
                    setEditing((p) => ({
                      ...p,
                      saving: Number(e.target.value),
                    }))
                  }
                  className={inputCls}
                />
              </div>

              {/* Price helper */}
              {editingProducts.length > 0 && (
                <div className="col-span-2 px-3 py-2 rounded-lg text-xs bg-cream-50 dark:bg-amber-900/20 text-brown-700 dark:text-amber-100/80 border border-cream-200 dark:border-amber-900/40">
                  Individual total:{" "}
                  <strong>{formatPrice(individualSum)}</strong>
                  {editing.price ? (
                    <>
                      {" "}
                      · Saving:{" "}
                      <strong>
                        {formatPrice(individualSum - (editing.price as number))}
                      </strong>
                    </>
                  ) : null}
                </div>
              )}

              {/* Image */}
              <div className="col-span-2">
                <label className={labelCls}>Image</label>
                <div className="flex gap-2 mb-3">
                  <input
                    value={editing.image ?? ""}
                    onChange={(e) =>
                      setEditing((p) => ({ ...p, image: e.target.value }))
                    }
                    className={`flex-1 ${inputCls}`}
                    placeholder="https://..."
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-[#1a1830] border border-brown-300 dark:border-amber-900/40 rounded-lg text-sm text-brown-600 dark:text-amber-100/80 hover:bg-cream-50 dark:hover:bg-[#12101e] transition-colors disabled:opacity-50"
                  >
                    <Upload size={14} /> {uploading ? "..." : "Upload"}
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                {editing.image && (
                  <img
                    src={editing.image}
                    className="w-32 h-32 object-cover rounded-xl border border-cream-200 dark:border-amber-900/40 shadow-sm"
                    alt="Set preview"
                  />
                )}
              </div>

              {/* Accent colour */}
              <div>
                <label className={labelCls}>Accent colour</label>
                <div className="flex gap-2">
                  {ACCENT_OPTIONS.map((a) => (
                    <button
                      key={a.value}
                      type="button"
                      onClick={() =>
                        setEditing((p) => ({ ...p, accent: a.value }))
                      }
                      title={a.label}
                      className="w-7 h-7 rounded-full transition-all"
                      style={{
                        background: a.value,
                        border:
                          editing.accent === a.value
                            ? "2px solid #1c1209"
                            : "2px solid transparent",
                        boxShadow:
                          editing.accent === a.value
                            ? "0 0 0 3px #fefdf8, 0 0 0 4px #1c1209"
                            : "none",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className={labelCls}>Status</label>
                <select
                  value={editing.status ?? "draft"}
                  onChange={(e) =>
                    setEditing((p) => ({
                      ...p,
                      status: e.target.value as GiftSet["status"],
                    }))
                  }
                  className={inputCls}
                >
                  <option value="live">Live</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Occasions */}
              <div className="col-span-2">
                <label className={labelCls}>Occasions / Tags</label>
                <div className="flex flex-wrap gap-1.5">
                  {GS_OCCASIONS.map((o) => {
                    const active = (editing.occasions ?? []).includes(o.id);
                    return (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => toggleOccasion(o.id)}
                        className="px-2.5 py-1 rounded-full text-xs font-medium transition-all"
                        style={{
                          background: active ? "#1c1209" : "transparent",
                          color: active ? "#fefdf8" : "#5c3d1e",
                          border: `1px solid ${active ? "#1c1209" : "#d4c9b4"}`,
                        }}
                      >
                        {active && <Check size={10} className="inline mr-1" />}
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Products */}
              <div className="col-span-2 mt-2">
                <label className={labelCls}>
                  Products ({editingProductIds.length})
                </label>

                {editingProducts.length > 0 && (
                  <div className="flex flex-col gap-1.5 mb-3 max-h-40 overflow-y-auto pr-1">
                    {editingProducts.map((product, index) => {
                      const image = product.images?.[0] ?? "";
                      return (
                        <div
                          key={`${product.id}-${index}`}
                          className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-cream-50 dark:bg-[#12101e] border border-cream-200 dark:border-amber-900/30"
                        >
                          {image ? (
                            <img
                              src={image}
                              alt={product.name}
                              className="w-7 h-7 rounded object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-sm flex-shrink-0">
                              🎁
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-brown-900 dark:text-amber-100 truncate">
                              {product.name}
                            </div>
                            <div className="text-xs text-brown-500 dark:text-amber-100/60">
                              {formatPrice(product.price)}
                            </div>
                          </div>
                          <div className="flex flex-col gap-0.5 mr-1">
                            <button
                              type="button"
                              onClick={() => moveProduct(index, "up")}
                              disabled={index === 0}
                              className="text-brown-400 hover:text-brown-700 dark:hover:text-amber-100/80 disabled:opacity-30"
                            >
                              <ChevronUp size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveProduct(index, "down")}
                              disabled={index === editingProducts.length - 1}
                              className="text-brown-400 hover:text-brown-700 dark:hover:text-amber-100/80 disabled:opacity-30"
                            >
                              <ChevronDown size={12} />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleProduct(product.id)}
                            className="text-brown-400 hover:text-red-500 dark:hover:text-red-400 p-1"
                          >
                            <X size={14} />
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
                  className={inputCls}
                />
                <div className="flex flex-col gap-1 max-h-48 overflow-y-auto mt-2 pr-1">
                  {filteredProducts
                    .filter((p) => !editingProductIds.includes(p.id))
                    .map((product) => {
                      const image = product.images?.[0] ?? "";
                      return (
                        <button
                          type="button"
                          key={product.id}
                          onClick={() => toggleProduct(product.id)}
                          className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-left hover:bg-cream-50 dark:hover:bg-amber-900/10 transition-colors w-full"
                        >
                          {image ? (
                            <img
                              src={image}
                              alt={product.name}
                              className="w-7 h-7 rounded object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-sm flex-shrink-0">
                              🎁
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-brown-900 dark:text-amber-100 truncate">
                              {product.name}
                            </div>
                            <div className="text-xs text-brown-500 dark:text-amber-100/60">
                              {product.tags?.[0] ?? ""} ·{" "}
                              {formatPrice(product.price)}
                            </div>
                          </div>
                          <Plus
                            size={14}
                            className="text-brown-400 dark:text-amber-100/40 flex-shrink-0"
                          />
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-4 pb-2 mt-4 border-t border-cream-100 dark:border-amber-900/20">
            <Button
              variant="outline"
              onClick={() => {
                setModalOpen(false);
                setSelected(null);
                setEditing({});
                setShowNew(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || !editing.name}>
              {saving
                ? "Saving…"
                : showNew
                  ? "Create gift set"
                  : "Save changes"}
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
