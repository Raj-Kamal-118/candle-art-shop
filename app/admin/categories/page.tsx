"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus, Pencil, Trash2, Tag, Upload, ChevronDown, ChevronUp, GripVertical,
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
import { Category, BannerButton } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

// ─── Sortable row ─────────────────────────────────────────────────────────────

function SortableCategoryRow({
  cat,
  onEdit,
  onDelete,
}: {
  cat: Category;
  onEdit: (cat: Category) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: cat.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
    >
      <td className="pl-3 pr-1 py-4 w-8">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 touch-none"
          title="Drag to reorder"
        >
          <GripVertical size={16} />
        </button>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <img src={cat.image} alt={cat.name} className="w-10 h-10 rounded-xl object-cover" />
          <div>
            <p className="font-medium text-gray-900">{cat.name}</p>
            <p className="text-xs text-gray-400 line-clamp-1 max-w-[200px]">{cat.description}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{cat.slug}</code>
      </td>
      <td className="px-4 py-4 text-gray-600">{cat.productCount}</td>
      <td className="px-4 py-4">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cat.bannerTitle ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-500"}`}>
          {cat.bannerTitle ? "Configured" : "None"}
        </span>
      </td>
      <td className="px-4 py-4">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cat.showInHomepage !== false ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
          {cat.showInHomepage !== false ? "Shown" : "Hidden"}
        </span>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => onEdit(cat)} className="p-2 text-gray-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors">
            <Pencil size={15} />
          </button>
          <button onClick={() => onDelete(cat.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [uploading, setUploading] = useState<"image" | "banner" | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    showInHomepage: true,
    bannerTitle: "",
    bannerDescription: "",
    bannerImage: "",
    bannerBgColor: "#f5f0eb",
    bannerButtons: [] as BannerButton[],
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => { setCategories(data); setLoading(false); });
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(categories, oldIndex, newIndex);

    // Optimistic update
    setCategories(reordered);

    // Persist new order
    setSaving(true);
    try {
      await fetch("/api/categories/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          reordered.map((c, i) => ({ id: c.id, sortOrder: i + 1 }))
        ),
      });
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => ({
    name: "",
    description: "",
    image: "",
    showInHomepage: true,
    bannerTitle: "",
    bannerDescription: "",
    bannerImage: "",
    bannerBgColor: "#f5f0eb",
    bannerButtons: [] as BannerButton[],
  });

  const openAdd = () => {
    setEditCategory(null);
    setForm(resetForm());
    setShowBanner(false);
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditCategory(cat);
    setForm({
      name: cat.name,
      description: cat.description,
      image: cat.image,
      showInHomepage: cat.showInHomepage ?? true,
      bannerTitle: cat.bannerTitle || "",
      bannerDescription: cat.bannerDescription || "",
      bannerImage: cat.bannerImage || "",
      bannerBgColor: cat.bannerBgColor || "#f5f0eb",
      bannerButtons: cat.bannerButtons || [],
    });
    setShowBanner(!!(cat.bannerTitle || cat.bannerDescription || cat.bannerImage));
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      bannerTitle: form.bannerTitle || null,
      bannerDescription: form.bannerDescription || null,
      bannerImage: form.bannerImage || null,
    };

    if (editCategory) {
      const res = await fetch(`/api/categories/${editCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const updated = await res.json();
      setCategories((prev) => prev.map((c) => (c.id === editCategory.id ? updated : c)));
    } else {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const created = await res.json();
      setCategories((prev) => [...prev, created]);
    }
    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await fetch(`/api/categories/${deleteId}`, { method: "DELETE" });
    setCategories((prev) => prev.filter((c) => c.id !== deleteId));
    setDeleteId(null);
  };

  const uploadImage = async (file: File, type: "image" | "banner") => {
    setUploading(type);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const { url, error } = await res.json();
      if (error) { alert(error); return; }
      if (type === "image") setForm((f) => ({ ...f, image: url }));
      else setForm((f) => ({ ...f, bannerImage: url }));
    } finally {
      setUploading(null);
    }
  };

  const addBannerButton = () => {
    setForm((f) => ({
      ...f,
      bannerButtons: [
        ...f.bannerButtons,
        { text: "Shop Now", link: `/categories/${f.name.toLowerCase().replace(/\s+/g, "-")}`, variant: "primary" },
      ],
    }));
  };

  const updateBannerButton = (i: number, updates: Partial<BannerButton>) => {
    setForm((f) => ({
      ...f,
      bannerButtons: f.bannerButtons.map((b, idx) => (idx === i ? { ...b, ...updates } : b)),
    }));
  };

  const removeBannerButton = (i: number) => {
    setForm((f) => ({ ...f, bannerButtons: f.bannerButtons.filter((_, idx) => idx !== i) }));
  };

  const inputCls = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 flex items-center gap-2">
          <GripVertical size={14} className="text-gray-400" />
          Drag rows to reorder — order is reflected on the homepage
          {saving && <span className="text-amber-600 font-medium">Saving…</span>}
        </p>
        <Button onClick={openAdd} size="sm">
          <Plus size={16} /> Add Category
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <Tag className="mx-auto text-gray-300 mb-3" size={40} />
            <p className="text-gray-400">No categories found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="w-8 pl-3" />
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Slug</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Products</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Banner</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Homepage</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={categories.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <tbody>
                    {categories.map((cat) => (
                      <SortableCategoryRow
                        key={cat.id}
                        cat={cat}
                        onEdit={openEdit}
                        onDelete={setDeleteId}
                      />
                    ))}
                  </tbody>
                </SortableContext>
              </DndContext>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editCategory ? "Edit Category" : "Add Category"} size="xl">
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputCls} resize-none`} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
            <div className="flex gap-2">
              <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="URL or upload" className={`flex-1 ${inputCls}`} />
              <button type="button" onClick={() => imageRef.current?.click()} disabled={uploading === "image"} className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                <Upload size={14} /> {uploading === "image" ? "…" : "Upload"}
              </button>
              <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f, "image"); }} />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.showInHomepage} onChange={(e) => setForm({ ...form, showInHomepage: e.target.checked })} className="accent-amber-600 w-4 h-4" />
            <span className="text-sm text-gray-700">Show this category on homepage (banner + carousel)</span>
          </label>

          {/* Banner section */}
          <div className="border border-amber-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowBanner(!showBanner)}
              className="w-full flex items-center justify-between px-4 py-3 bg-amber-50 text-sm font-medium text-amber-800 hover:bg-amber-100 transition-colors"
            >
              Category Banner Configuration
              {showBanner ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showBanner && (
              <div className="p-4 space-y-4">
                <p className="text-xs text-gray-500">
                  The banner appears at the top of the category section on the homepage, above the product carousel.
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banner Title</label>
                  <input value={form.bannerTitle} onChange={(e) => setForm({ ...form, bannerTitle: e.target.value })} placeholder="e.g. Freshly Scented Collections" className={inputCls} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banner Description</label>
                  <textarea rows={2} value={form.bannerDescription} onChange={(e) => setForm({ ...form, bannerDescription: e.target.value })} placeholder="Short description for the banner" className={`${inputCls} resize-none`} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image (optional — will use bg colour if omitted)</label>
                  <div className="flex gap-2">
                    <input value={form.bannerImage} onChange={(e) => setForm({ ...form, bannerImage: e.target.value })} placeholder="Image URL or upload" className={`flex-1 ${inputCls}`} />
                    <button type="button" onClick={() => bannerRef.current?.click()} disabled={uploading === "banner"} className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                      <Upload size={14} /> {uploading === "banner" ? "…" : "Upload"}
                    </button>
                    <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f, "banner"); }} />
                  </div>
                  {form.bannerImage && (
                    <img src={form.bannerImage} alt="Banner preview" className="mt-2 w-full h-28 object-cover rounded-xl" />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banner Background Colour</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={form.bannerBgColor} onChange={(e) => setForm({ ...form, bannerBgColor: e.target.value })} className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer p-0.5" />
                    <input className={`${inputCls} flex-1`} value={form.bannerBgColor} onChange={(e) => setForm({ ...form, bannerBgColor: e.target.value })} placeholder="#f5f0eb" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Banner Buttons</label>
                    <button type="button" onClick={addBannerButton} className="text-xs text-amber-700 flex items-center gap-1 hover:text-amber-800">
                      <Plus size={12} /> Add Button
                    </button>
                  </div>
                  {form.bannerButtons.map((btn, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl p-3 mb-2 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Text</label>
                          <input className={inputCls} value={btn.text} onChange={(e) => updateBannerButton(i, { text: e.target.value })} />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Link</label>
                          <input className={inputCls} value={btn.link} onChange={(e) => updateBannerButton(i, { link: e.target.value })} />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Variant</label>
                          <select className={inputCls} value={btn.variant} onChange={(e) => updateBannerButton(i, { variant: e.target.value as "primary" | "secondary" })}>
                            <option value="primary">Primary</option>
                            <option value="secondary">Secondary</option>
                          </select>
                        </div>
                        <div className="flex items-end">
                          <button type="button" onClick={() => removeBannerButton(i)} className="px-3 py-2 text-xs text-red-500 hover:text-red-700 border border-red-200 rounded-lg">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)} type="button">Cancel</Button>
            <Button type="submit">{editCategory ? "Save Changes" : "Create Category"}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Category" size="sm">
        <p className="text-gray-600 mb-5">Delete this category? Products will become uncategorized.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
