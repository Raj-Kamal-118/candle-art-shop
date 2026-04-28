"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Tag,
  Upload,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Copy,
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
import { Category, BannerButton, MagazineItem } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import MultiImageUploader from "@/components/admin/MultiImageUploader";
import CategoryBannerSection from "@/components/home/CategoryBannerSection";

interface ExtendedMagazineItem extends MagazineItem {
  kicker?: string;
  offerText?: string;
  buttonText?: string;
}

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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cat.id });

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
      className="border-b border-cream-100 dark:border-amber-900/20 hover:bg-cream-50 dark:hover:bg-amber-900/10 transition-colors"
    >
      <td className="pl-3 pr-1 py-4 w-8">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-cream-300 dark:text-amber-900/40 hover:text-brown-400 dark:hover:text-amber-100/60 touch-none"
          title="Drag to reorder"
        >
          <GripVertical size={16} />
        </button>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <img
            src={cat.image}
            alt={cat.name}
            className="w-10 h-10 rounded-xl object-cover"
          />
          <div>
            <p className="font-medium text-brown-900 dark:text-amber-100">
              {cat.name}
            </p>
            <p className="text-xs text-brown-400 dark:text-amber-100/50 line-clamp-1 max-w-[200px]">
              {cat.description}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <code className="text-xs bg-cream-100 dark:bg-amber-900/30 text-brown-700 dark:text-amber-100/80 px-2 py-1 rounded">
          {cat.slug}
        </code>
      </td>
      <td className="px-4 py-4 text-brown-600 dark:text-amber-100/70">
        {cat.productCount}
      </td>
      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase ${cat.bannerTitle ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" : "bg-cream-100 text-brown-500 dark:bg-[#12101e] dark:text-amber-100/40"}`}
        >
          {cat.bannerTitle ? "Configured" : "None"}
        </span>
      </td>
      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase ${cat.showInHomepage !== false ? "bg-forest-100 text-forest-700 dark:bg-forest-900/40 dark:text-forest-300" : "bg-cream-100 text-brown-500 dark:bg-[#12101e] dark:text-amber-100/40"}`}
        >
          {cat.showInHomepage !== false ? "Shown" : "Hidden"}
        </span>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(cat)}
            className="p-2 text-brown-400 dark:text-amber-100/50 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(cat.id)}
            className="p-2 text-brown-400 dark:text-amber-100/50 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Sortable Magazine Item ───────────────────────────────────────────────────

function SortableMagazineItem({
  item,
  index,
  uploadingMagItem,
  handleMagazineImageUpload,
  updateMagazineItem,
  removeMagazineItem,
  categoryName,
  categorySlug,
  bannerBgColor,
  bannerButtons,
}: {
  item: ExtendedMagazineItem & { id: string };
  index: number;
  uploadingMagItem: number | null;
  handleMagazineImageUpload: (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  updateMagazineItem: (
    i: number,
    updates: Partial<ExtendedMagazineItem>,
  ) => void;
  removeMagazineItem: (i: number) => void;
  categoryName: string;
  categorySlug: string;
  bannerBgColor: string;
  bannerButtons: BannerButton[];
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };
  const inputCls =
    "w-full px-3 py-2 bg-white dark:bg-[#12101e] border border-brown-300 dark:border-amber-900/40 rounded-lg text-sm text-brown-900 dark:text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500/50 transition-colors placeholder:text-brown-400 dark:placeholder:text-amber-100/30";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-cream-200 dark:border-amber-900/30 rounded-xl p-3 space-y-3 bg-white dark:bg-[#1a1830] relative"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-brown-400 dark:text-amber-100/40 hover:text-brown-600 dark:hover:text-amber-100/80 touch-none"
          >
            <GripVertical size={16} />
          </button>
          <span className="text-xs font-semibold text-brown-600 dark:text-amber-100/70">
            Page {index + 1}
          </span>
        </div>
        <button
          type="button"
          onClick={() => removeMagazineItem(index)}
          className="text-red-400 hover:text-red-600 dark:hover:text-red-300"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <div className="flex gap-3">
        <div className="w-16 h-20 bg-cream-50 dark:bg-[#12101e] rounded-lg overflow-hidden shrink-0 border border-cream-200 dark:border-amber-900/40 relative flex items-center justify-center">
          {item.url ? (
            <img
              src={item.url}
              alt={`Page ${index + 1}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[10px] text-brown-400 dark:text-amber-100/40">
              No Img
            </span>
          )}
          {uploadingMagItem === index && (
            <div className="absolute inset-0 bg-white/70 dark:bg-black/50 flex items-center justify-center text-[10px] text-brown-900 dark:text-amber-100 font-medium">
              ...
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <input
              className={`${inputCls} text-xs flex-1 py-1.5`}
              placeholder="Image URL"
              value={item.url}
              onChange={(e) =>
                updateMagazineItem(index, { url: e.target.value })
              }
            />
            <label className="flex items-center justify-center px-2 py-1.5 bg-white dark:bg-[#1a1830] border border-brown-300 dark:border-amber-900/40 rounded-lg cursor-pointer hover:bg-cream-50 dark:hover:bg-[#12101e] shrink-0 transition-colors">
              <Upload
                size={14}
                className="text-brown-600 dark:text-amber-100/80"
              />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleMagazineImageUpload(index, e)}
              />
            </label>
          </div>
          <input
            className={`${inputCls} text-xs py-1.5`}
            placeholder="Product Name (Optional)"
            value={item.name || ""}
            onChange={(e) =>
              updateMagazineItem(index, { name: e.target.value })
            }
          />
          <input
            className={`${inputCls} text-xs py-1.5`}
            placeholder="Link (e.g. /products/candle)"
            value={item.link || ""}
            onChange={(e) =>
              updateMagazineItem(index, { link: e.target.value })
            }
          />
          <input
            className={`${inputCls} text-xs py-1.5`}
            placeholder="Kicker (e.g. In Focus)"
            value={item.kicker || ""}
            onChange={(e) =>
              updateMagazineItem(index, { kicker: e.target.value })
            }
          />
          <input
            className={`${inputCls} text-xs py-1.5`}
            placeholder="Offer Text (e.g. 10% OFF)"
            value={item.offerText || ""}
            onChange={(e) =>
              updateMagazineItem(index, { offerText: e.target.value })
            }
          />
          <input
            className={`${inputCls} text-xs py-1.5`}
            placeholder="Button Text (e.g. Shop Now)"
            value={item.buttonText || ""}
            onChange={(e) =>
              updateMagazineItem(index, { buttonText: e.target.value })
            }
          />
        </div>
      </div>
    </div>
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
  const [showMagazine, setShowMagazine] = useState(false);
  const [uploading, setUploading] = useState<"image" | "banner" | null>(null);
  const [uploadingMagItem, setUploadingMagItem] = useState<number | null>(null);
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
    magazineItems: [] as (ExtendedMagazineItem & { id: string })[],
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      });
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
          reordered.map((c, i) => ({ id: c.id, sortOrder: i + 1 })),
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
    magazineItems: [] as (ExtendedMagazineItem & { id: string })[],
  });

  const openAdd = () => {
    setEditCategory(null);
    setForm(resetForm());
    setShowBanner(false);
    setShowMagazine(false);
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
      magazineItems: (cat.magazineItems || []).map((i) => ({
        ...i,
        id: Math.random().toString(36).slice(2),
      })) as (ExtendedMagazineItem & { id: string })[],
    });
    setShowBanner(
      !!(cat.bannerTitle || cat.bannerDescription || cat.bannerImage),
    );
    setShowMagazine(!!(cat.magazineItems && cat.magazineItems.length > 0));
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      bannerTitle: form.bannerTitle || null,
      bannerDescription: form.bannerDescription || null,
      bannerImage: form.bannerImage || null,
      magazineItems: form.magazineItems.map(({ id, ...rest }) => rest),
    };

    if (editCategory) {
      const res = await fetch(`/api/categories/${editCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const updated = await res.json();
      setCategories((prev) =>
        prev.map((c) => (c.id === editCategory.id ? updated : c)),
      );
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

  const handleMagazineImageUpload = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMagItem(index);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const { url, error } = await res.json();
      if (error) {
        alert(error);
        return;
      }
      updateMagazineItem(index, { url });
    } finally {
      setUploadingMagItem(null);
      e.target.value = "";
    }
  };

  const addMagazineItem = () => {
    setForm((f) => ({
      ...f,
      magazineItems: [
        ...f.magazineItems,
        {
          id: Math.random().toString(36).slice(2),
          url: "",
          name: "",
          link: "",
        },
      ],
    }));
  };

  const updateMagazineItem = (
    i: number,
    updates: Partial<ExtendedMagazineItem>,
  ) => {
    setForm((f) => ({
      ...f,
      magazineItems: f.magazineItems.map((item, idx) =>
        idx === i ? { ...item, ...updates } : item,
      ),
    }));
  };

  const removeMagazineItem = (i: number) => {
    setForm((f) => ({
      ...f,
      magazineItems: f.magazineItems.filter((_, idx) => idx !== i),
    }));
  };

  const handleMagazineDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = form.magazineItems.findIndex((c) => c.id === active.id);
    const newIndex = form.magazineItems.findIndex((c) => c.id === over.id);
    setForm((f) => ({
      ...f,
      magazineItems: arrayMove(f.magazineItems, oldIndex, newIndex),
    }));
  };

  const uploadImage = async (file: File, type: "image" | "banner") => {
    setUploading(type);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const { url, error } = await res.json();
      if (error) {
        alert(error);
        return;
      }
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
        {
          text: "Shop Now",
          link: `/categories/${f.name.toLowerCase().replace(/\s+/g, "-")}`,
          variant: "primary",
        },
      ],
    }));
  };

  const updateBannerButton = (i: number, updates: Partial<BannerButton>) => {
    setForm((f) => ({
      ...f,
      bannerButtons: f.bannerButtons.map((b, idx) =>
        idx === i ? { ...b, ...updates } : b,
      ),
    }));
  };

  const removeBannerButton = (i: number) => {
    setForm((f) => ({
      ...f,
      bannerButtons: f.bannerButtons.filter((_, idx) => idx !== i),
    }));
  };

  const inputCls =
    "w-full px-3 py-2 bg-white dark:bg-[#12101e] border border-brown-300 dark:border-amber-900/40 rounded-lg text-sm text-brown-900 dark:text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500/50 transition-colors placeholder:text-brown-400 dark:placeholder:text-amber-100/30";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-brown-500 dark:text-amber-100/60 flex items-center gap-2">
          <GripVertical
            size={14}
            className="text-brown-400 dark:text-amber-100/40"
          />
          Drag rows to reorder — order is reflected on the homepage
          {saving && (
            <span className="text-amber-600 dark:text-amber-400 font-medium">
              Saving…
            </span>
          )}
        </p>
        <Button onClick={openAdd} size="sm">
          <Plus size={16} /> Add Category
        </Button>
      </div>

      <div className="bg-white dark:bg-[#1a1830] rounded-2xl shadow-sm border border-cream-200 dark:border-amber-900/30 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-brown-400 dark:text-amber-100/50">
            Loading...
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <Tag
              className="mx-auto text-cream-300 dark:text-amber-900/40 mb-3"
              size={40}
            />
            <p className="text-brown-400 dark:text-amber-100/50">
              No categories found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-50 dark:bg-[#12101e] border-b border-cream-200 dark:border-amber-900/30">
                <tr>
                  <th className="w-8 pl-3" />
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-brown-500 dark:text-amber-100/60 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-brown-500 dark:text-amber-100/60 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-brown-500 dark:text-amber-100/60 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-brown-500 dark:text-amber-100/60 uppercase tracking-wider">
                    Banner
                  </th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-brown-500 dark:text-amber-100/60 uppercase tracking-wider">
                    Homepage
                  </th>
                  <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-brown-500 dark:text-amber-100/60 uppercase tracking-wider">
                    Actions
                  </th>
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

      {/* Homepage Previews */}
      {categories.filter((c) => c.showInHomepage).length > 0 && (
        <div className="mt-10 space-y-6">
          <h2 className="text-xl font-serif font-bold text-brown-900 dark:text-amber-100">
            Homepage Previews
          </h2>
          {categories
            .filter((c) => c.showInHomepage)
            .map((cat) => (
              <div
                key={cat.id}
                className="relative group bg-white dark:bg-[#1a1830] rounded-2xl p-4 border border-cream-200 dark:border-amber-900/30 shadow-sm overflow-hidden"
              >
                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" onClick={() => openEdit(cat)}>
                    <Pencil size={14} className="mr-1.5" /> Edit Category
                  </Button>
                </div>
                <CategoryBannerSection category={cat} products={[]} />
              </div>
            ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editCategory ? "Edit Category" : "Add Category"}
        size="xl"
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-5 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar"
        >
          <div>
            <label className="block text-[13px] font-medium text-brown-800 dark:text-amber-100/80 mb-1.5">
              Name *
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-brown-800 dark:text-amber-100/80 mb-1.5">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className={`${inputCls} resize-none`}
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-brown-800 dark:text-amber-100/80 mb-1.5">
              Category Image
            </label>
            <div className="flex gap-2">
              <input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="URL or upload"
                className={`flex-1 ${inputCls}`}
              />
              <button
                type="button"
                onClick={() => imageRef.current?.click()}
                disabled={uploading === "image"}
                className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-[#1a1830] border border-brown-300 dark:border-amber-900/40 rounded-lg text-sm text-brown-600 dark:text-amber-100/80 hover:bg-cream-50 dark:hover:bg-[#12101e] transition-colors disabled:opacity-50"
              >
                <Upload size={14} /> {uploading === "image" ? "…" : "Upload"}
              </button>
              <input
                ref={imageRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadImage(f, "image");
                }}
              />
            </div>
            {form.image && (
              <img
                src={form.image}
                alt="Category preview"
                className="mt-3 object-cover rounded-xl border border-cream-200 dark:border-amber-900/40 shadow-sm"
              />
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.showInHomepage}
              onChange={(e) =>
                setForm({ ...form, showInHomepage: e.target.checked })
              }
              className="accent-amber-600 w-4 h-4"
            />
            <span className="text-sm text-brown-700 dark:text-amber-100/80">
              Show this category on homepage (banner + carousel)
            </span>
          </label>

          {/* Banner section */}
          <div className="border border-amber-200 dark:border-amber-900/30 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowBanner(!showBanner)}
              className="w-full flex items-center justify-between px-4 py-3 bg-amber-50 dark:bg-amber-900/20 text-sm font-medium text-amber-800 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
            >
              Category Banner Configuration
              {showBanner ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showBanner && (
              <div className="p-4 space-y-4 bg-white dark:bg-[#1a1830]">
                <p className="text-xs text-brown-500 dark:text-amber-100/60">
                  The banner appears at the top of the category section on the
                  homepage, above the product carousel.
                </p>

                <div>
                  <label className="block text-[13px] font-medium text-brown-800 dark:text-amber-100/80 mb-1.5">
                    Banner Title
                  </label>
                  <input
                    value={form.bannerTitle}
                    onChange={(e) =>
                      setForm({ ...form, bannerTitle: e.target.value })
                    }
                    placeholder="e.g. Freshly Scented Collections"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-brown-800 dark:text-amber-100/80 mb-1.5">
                    Banner Description
                  </label>
                  <textarea
                    rows={2}
                    value={form.bannerDescription}
                    onChange={(e) =>
                      setForm({ ...form, bannerDescription: e.target.value })
                    }
                    placeholder="Short description for the banner"
                    className={`${inputCls} resize-none`}
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-brown-800 dark:text-amber-100/80 mb-1.5">
                    Banner Images (optional — drag and drop multiple images)
                  </label>
                  <MultiImageUploader
                    value={form.bannerImage}
                    onChange={(newUrls) =>
                      setForm({ ...form, bannerImage: newUrls })
                    }
                    onUpload={async (files) => {
                      const uploadPromises = files.map(async (file) => {
                        const fd = new FormData();
                        fd.append("file", file);
                        const res = await fetch("/api/upload", {
                          method: "POST",
                          body: fd,
                        });
                        const { url, error } = await res.json();
                        return error ? null : url;
                      });
                      const results = await Promise.all(uploadPromises);
                      return results.filter(Boolean) as string[];
                    }}
                  />
                  {form.bannerImage && (
                    <div className="mt-3 space-y-2">
                      <label className="text-xs font-medium text-brown-500 dark:text-amber-100/60 block">
                        Uploaded Image URLs
                      </label>
                      {form.bannerImage
                        .split(",")
                        .filter(Boolean)
                        .map((url, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <input
                              readOnly
                              value={url.trim()}
                              className={`${inputCls} text-xs py-1.5 flex-1 bg-cream-50 dark:bg-[#12101e]`}
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                navigator.clipboard.writeText(url.trim());
                                const btn = e.currentTarget;
                                const originalHtml = btn.innerHTML;
                                btn.innerHTML = "Copied!";
                                setTimeout(() => {
                                  btn.innerHTML = originalHtml;
                                }, 2000);
                              }}
                              className="px-3 py-1.5 flex items-center gap-1.5 bg-white dark:bg-[#1a1830] hover:bg-cream-50 dark:hover:bg-[#12101e] border border-cream-300 dark:border-amber-900/40 rounded-lg text-xs font-medium text-brown-700 dark:text-amber-100/80 transition-colors shrink-0"
                            >
                              <Copy size={14} /> Copy
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-brown-800 dark:text-amber-100/80 mb-1.5">
                    Banner Background Colour
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={form.bannerBgColor}
                      onChange={(e) =>
                        setForm({ ...form, bannerBgColor: e.target.value })
                      }
                      className="w-10 h-10 rounded-lg border border-cream-300 dark:border-amber-900/40 cursor-pointer p-0.5 bg-transparent"
                    />
                    <input
                      className={`${inputCls} flex-1`}
                      value={form.bannerBgColor}
                      onChange={(e) =>
                        setForm({ ...form, bannerBgColor: e.target.value })
                      }
                      placeholder="#f5f0eb"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[13px] font-medium text-brown-800 dark:text-amber-100/80">
                      Banner Buttons
                    </label>
                    <button
                      type="button"
                      onClick={addBannerButton}
                      className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1 hover:text-amber-800 dark:hover:text-amber-300 font-medium"
                    >
                      <Plus size={12} /> Add Button
                    </button>
                  </div>
                  {form.bannerButtons.map((btn, i) => (
                    <div
                      key={i}
                      className="border border-cream-200 dark:border-amber-900/30 rounded-xl p-3 mb-2 space-y-2"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-brown-500 dark:text-amber-100/60 mb-1 block">
                            Text
                          </label>
                          <input
                            className={inputCls}
                            value={btn.text}
                            onChange={(e) =>
                              updateBannerButton(i, { text: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <label className="text-xs text-brown-500 dark:text-amber-100/60 mb-1 block">
                            Link
                          </label>
                          <input
                            className={inputCls}
                            value={btn.link}
                            onChange={(e) =>
                              updateBannerButton(i, { link: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <label className="text-xs text-brown-500 dark:text-amber-100/60 mb-1 block">
                            Variant
                          </label>
                          <select
                            className={inputCls}
                            value={btn.variant}
                            onChange={(e) =>
                              updateBannerButton(i, {
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
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => removeBannerButton(i)}
                            className="px-3 py-2 text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border border-red-200 dark:border-red-900/40 rounded-lg transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Magazine section */}
          <div className="border border-amber-200 dark:border-amber-900/30 rounded-xl overflow-hidden mt-4">
            <button
              type="button"
              onClick={() => setShowMagazine(!showMagazine)}
              className="w-full flex items-center justify-between px-4 py-3 bg-amber-50 dark:bg-amber-900/20 text-sm font-medium text-amber-800 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
            >
              Magazine Album Pages
              {showMagazine ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>

            {showMagazine && (
              <div className="p-4 space-y-4 bg-white dark:bg-[#1a1830]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-brown-500 dark:text-amber-100/60">
                    Add pages to the interactive flipbook album on the homepage.
                  </p>
                  <button
                    type="button"
                    onClick={addMagazineItem}
                    className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1 hover:text-amber-800 dark:hover:text-amber-300 font-medium"
                  >
                    <Plus size={12} /> Add Page
                  </button>
                </div>

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleMagazineDragEnd}
                >
                  <SortableContext
                    items={form.magazineItems.map((i) => i.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4">
                      {form.magazineItems.map((item, i) => (
                        <SortableMagazineItem
                          key={item.id}
                          item={item}
                          index={i}
                          uploadingMagItem={uploadingMagItem}
                          handleMagazineImageUpload={handleMagazineImageUpload}
                          updateMagazineItem={updateMagazineItem}
                          removeMagazineItem={removeMagazineItem}
                          categoryName={form.name}
                          categorySlug={form.name
                            .toLowerCase()
                            .replace(/\s+/g, "-")}
                          bannerBgColor={form.bannerBgColor}
                          bannerButtons={form.bannerButtons}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit">
              {editCategory ? "Save Changes" : "Create Category"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Category"
        size="sm"
      >
        <p className="text-brown-700 dark:text-amber-100/80 mb-5">
          Delete this category? Products will become uncategorized.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
