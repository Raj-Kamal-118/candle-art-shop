"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Package,
  Upload,
  ChevronDown,
  ChevronUp,
  GripVertical,
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
import {
  Product,
  Category,
  CustomizationOption,
  VariantPricing,
  AdditionalSection,
  ProductCharacteristic,
  ExtraButton,
} from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// ─── Variant pricing helpers ──────────────────────────────────────────────────

function buildVariantKeys(options: CustomizationOption[]): string[][] {
  const pricingOptions = options.filter(
    (o) => o.affectsPrice && o.type === "select" && o.options?.length,
  );
  if (pricingOptions.length === 0) return [];
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

// ─── Sortable product row ─────────────────────────────────────────────────────

function SortableProductRow({
  product,
  categoryName,
  onEdit,
  onDelete,
}: {
  product: Product;
  categoryName: string;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
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
          title="Drag to reorder within category"
        >
          <GripVertical size={16} />
        </button>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-10 h-10 rounded-xl object-cover"
          />
          <div>
            <p className="font-medium text-gray-900 line-clamp-1">
              {product.name}
            </p>
            <p className="text-xs text-gray-400">
              {product.featured ? "Featured · " : ""}
              {product.customizable ? "Customizable" : ""}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-gray-600">{categoryName}</td>
      <td className="px-4 py-4">
        <span className="font-semibold text-gray-900">
          {formatPrice(product.price)}
        </span>
        {product.compareAtPrice && (
          <span className="text-xs text-gray-400 line-through ml-1">
            {formatPrice(product.compareAtPrice)}
          </span>
        )}
      </td>
      <td className="px-4 py-4 text-gray-600">{product.stockCount}</td>
      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {product.inStock ? "In Stock" : "Out of Stock"}
        </span>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(product)}
            className="p-2 text-gray-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Category group with its own DnD context ─────────────────────────────────

function CategoryGroup({
  category,
  products,
  search,
  onEdit,
  onDelete,
  onReorder,
}: {
  category: Category;
  products: Product[];
  search: string;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
  onReorder: (categoryId: string, reordered: Product[]) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const filtered = search
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()),
      )
    : products;

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = products.findIndex((p) => p.id === active.id);
    const newIndex = products.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(products, oldIndex, newIndex);

    onReorder(category.id, reordered);

    setSaving(true);
    try {
      await fetch("/api/products/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          reordered.map((p, i) => ({ id: p.id, sortOrder: i + 1 })),
        ),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Category header */}
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-amber-50 border-b border-amber-100 hover:bg-amber-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          {category.image && (
            <img
              src={category.image}
              alt={category.name}
              className="w-7 h-7 rounded-lg object-cover"
            />
          )}
          <span className="font-semibold text-amber-900 text-sm">
            {category.name}
          </span>
          <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </span>
          {saving && <span className="text-xs text-amber-600">Saving…</span>}
        </div>
        {collapsed ? (
          <ChevronDown size={16} className="text-amber-700" />
        ) : (
          <ChevronUp size={16} className="text-amber-700" />
        )}
      </button>

      {!collapsed &&
        (filtered.length === 0 ? (
          <div className="p-6 text-center text-gray-400 text-sm">
            {search
              ? "No products match your search"
              : "No products in this category"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="w-8 pl-3" />
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Product
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Category
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Price
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Stock
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
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
                  items={filtered.map((p) => p.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <tbody>
                    {filtered.map((product) => (
                      <SortableProductRow
                        key={product.id}
                        product={product}
                        categoryName={category.name}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    ))}
                  </tbody>
                </SortableContext>
              </DndContext>
            </table>
          </div>
        ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

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
  const [rawOptionInputs, setRawOptionInputs] = useState<
    Record<string, string>
  >({});
  const [additionalSections, setAdditionalSections] = useState<
    AdditionalSection[]
  >([]);
  const [characteristics, setCharacteristics] = useState<
    ProductCharacteristic[]
  >([]);
  const [extraButtons, setExtraButtons] = useState<ExtraButton[]>([]);
  const sectionFileInputs = useRef<Record<string, HTMLInputElement | null>>({});

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

  // Group products by category, preserving category sort order
  const productsByCategory: Record<string, Product[]> = {};
  for (const cat of categories) {
    productsByCategory[cat.id] = products.filter(
      (p) => p.categoryId === cat.id,
    );
  }
  // Uncategorized
  const uncategorized = products.filter(
    (p) => !categories.find((c) => c.id === p.categoryId),
  );

  const handleReorder = (categoryId: string, reordered: Product[]) => {
    setProducts((prev) => {
      const others = prev.filter((p) => p.categoryId !== categoryId);
      return [...others, ...reordered];
    });
  };

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
    setAdditionalSections([]);
    setCharacteristics([]);
    setExtraButtons([]);
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
    setRawOptionInputs(
      Object.fromEntries(opts.map((o) => [o.id, o.options?.join(", ") || ""])),
    );
    setVariantPricing(product.variantPricing || {});
    setAdditionalSections(product.additionalSections || []);
    setCharacteristics(product.characteristics || []);
    setExtraButtons(product.extraButtons || []);
    setShowCustomization(!!product.customizable);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      compareAtPrice: form.compareAtPrice
        ? parseFloat(form.compareAtPrice)
        : null,
      categoryId: form.categoryId,
      images: form.images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tags: form.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      inStock: form.inStock,
      stockCount: parseInt(form.stockCount),
      featured: form.featured,
      customizable: form.customizable,
      customizationOptions: customOptions,
      variantPricing,
      additionalSections,
      characteristics,
      extraButtons,
    };

    if (editProduct) {
      const res = await fetch(`/api/products/${editProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const updated = await res.json();
      setProducts((prev) =>
        prev.map((p) => (p.id === editProduct.id ? updated : p)),
      );
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
      if (error) {
        alert(error);
        return;
      }
      setForm((prev) => ({
        ...prev,
        images: prev.images ? `${prev.images}, ${url}` : url,
      }));
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

  const addOption = () => {
    const newOpt: CustomizationOption = {
      id: `opt-${Date.now()}`,
      label: "New Option",
      type: "select",
      options: ["Option A", "Option B"],
      affectsPrice: false,
    };
    setCustomOptions((prev) => [...prev, newOpt]);
    setRawOptionInputs((prev) => ({
      ...prev,
      [newOpt.id]: "Option A, Option B",
    }));
  };

  const updateOption = (i: number, updates: Partial<CustomizationOption>) => {
    setCustomOptions((prev) =>
      prev.map((o, idx) => (idx === i ? { ...o, ...updates } : o)),
    );
    if ("affectsPrice" in updates || "options" in updates) {
      setVariantPricing({});
    }
  };

  const removeOption = (i: number) => {
    setCustomOptions((prev) => prev.filter((_, idx) => idx !== i));
    setVariantPricing({});
  };

  const variantCombos = buildVariantKeys(customOptions);
  const pricingOptionLabels = customOptions
    .filter((o) => o.affectsPrice && o.type === "select")
    .map((o) => o.label);

  const inputCls =
    "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400";

  const hasAnyProducts = products.length > 0;
  const matchesSearch = (p: Product) =>
    !search ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase());

  return (
    <div className="space-y-6">
      <link
        rel="stylesheet"
        href="https://unpkg.com/react-quill@1.3.3/dist/quill.snow.css"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 w-64"
            />
          </div>
          <p className="text-sm text-gray-500 flex items-center gap-1.5">
            <GripVertical size={14} className="text-gray-400" />
            Drag to reorder products within each category
          </p>
        </div>
        <Button onClick={openAdd} size="sm">
          <Plus size={16} /> Add Product
        </Button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
          Loading...
        </div>
      ) : !hasAnyProducts ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Package className="mx-auto text-gray-300 mb-3" size={40} />
          <p className="text-gray-400">No products found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => {
            const catProducts = productsByCategory[cat.id] || [];
            if (catProducts.length === 0 && !search) return null;
            const visibleCount = catProducts.filter(matchesSearch).length;
            if (search && visibleCount === 0) return null;
            return (
              <CategoryGroup
                key={cat.id}
                category={cat}
                products={catProducts}
                search={search}
                onEdit={openEdit}
                onDelete={setDeleteId}
                onReorder={handleReorder}
              />
            );
          })}

          {uncategorized.filter(matchesSearch).length > 0 && (
            <CategoryGroup
              key="uncategorized"
              category={{
                id: "uncategorized",
                name: "Uncategorized",
                slug: "",
                description: "",
                image: "",
                productCount: uncategorized.length,
                createdAt: "",
              }}
              products={uncategorized}
              search={search}
              onEdit={openEdit}
              onDelete={setDeleteId}
              onReorder={handleReorder}
            />
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editProduct ? "Edit Product" : "Add Product"}
        size="xl"
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-5 max-h-[75vh] overflow-y-auto pr-1"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputCls}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <div className="bg-white rounded-lg">
                <ReactQuill
                  theme="snow"
                  value={form.description}
                  onChange={(val) => setForm({ ...form, description: val })}
                  className="h-40 mb-12"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Price (₹) *
              </label>
              <input
                required
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Compare At Price
              </label>
              <input
                type="number"
                step="0.01"
                value={form.compareAtPrice}
                onChange={(e) =>
                  setForm({ ...form, compareAtPrice: e.target.value })
                }
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                required
                value={form.categoryId}
                onChange={(e) =>
                  setForm({ ...form, categoryId: e.target.value })
                }
                className={inputCls}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Count
              </label>
              <input
                type="number"
                value={form.stockCount}
                onChange={(e) =>
                  setForm({ ...form, stockCount: e.target.value })
                }
                className={inputCls}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Images
              </label>
              <div className="flex gap-2">
                <input
                  value={form.images}
                  onChange={(e) => setForm({ ...form, images: e.target.value })}
                  placeholder="Paste URL or upload"
                  className={`flex-1 ${inputCls}`}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  <Upload size={14} /> {uploading ? "…" : "Upload"}
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <p className="text-xs text-gray-400 mt-1">
                Multiple URLs comma-separated.
              </p>
              {form.images && (
                <div className="flex flex-wrap gap-3 mt-3">
                  {form.images
                    .split(",")
                    .map((i) => i.trim())
                    .filter(Boolean)
                    .map((imgUrl, idx) => (
                      <img
                        key={idx}
                        src={imgUrl}
                        alt={`Product preview ${idx + 1}`}
                        className="w-24 h-24 object-cover rounded-xl border border-gray-200 shadow-sm"
                      />
                    ))}
                </div>
              )}
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma-separated)
              </label>
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className={inputCls}
              />
            </div>
            <div className="flex items-center gap-6">
              {(["inStock", "featured", "customizable"] as const).map((key) => (
                <label
                  key={key}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={(e) => {
                      setForm({ ...form, [key]: e.target.checked });
                      if (key === "customizable")
                        setShowCustomization(e.target.checked);
                    }}
                    className="accent-amber-600 w-4 h-4"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {key === "inStock" ? "In Stock" : key}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {form.customizable && (
            <div className="border border-amber-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowCustomization(!showCustomization)}
                className="w-full flex items-center justify-between px-4 py-3 bg-amber-50 text-sm font-medium text-amber-800 hover:bg-amber-100 transition-colors"
              >
                Customization Options & Variant Pricing
                {showCustomization ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>

              {showCustomization && (
                <div className="p-4 space-y-4">
                  <p className="text-xs text-gray-500">
                    Define options customers can choose from. Mark options as
                    &quot;Affects Price&quot; to set custom pricing per
                    combination.
                  </p>

                  {customOptions.map((opt, i) => (
                    <div
                      key={opt.id}
                      className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-500">
                          Option {i + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeOption(i)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">
                            Label
                          </label>
                          <input
                            className={inputCls}
                            value={opt.label}
                            onChange={(e) =>
                              updateOption(i, { label: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">
                            Type
                          </label>
                          <select
                            className={inputCls}
                            value={opt.type}
                            onChange={(e) =>
                              updateOption(i, {
                                type: e.target
                                  .value as CustomizationOption["type"],
                              })
                            }
                          >
                            <option value="select">Select (dropdown)</option>
                            <option value="text">Text (free input)</option>
                            <option value="color">Colour picker</option>
                          </select>
                        </div>
                      </div>
                      {opt.type === "select" && (
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">
                            Options (comma-separated)
                          </label>
                          <input
                            className={inputCls}
                            value={
                              rawOptionInputs[opt.id] ??
                              opt.options?.join(", ") ??
                              ""
                            }
                            onChange={(e) =>
                              setRawOptionInputs((prev) => ({
                                ...prev,
                                [opt.id]: e.target.value,
                              }))
                            }
                            onBlur={(e) => {
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
                            onChange={(e) =>
                              updateOption(i, {
                                affectsPrice: e.target.checked,
                              })
                            }
                            className="accent-amber-600 w-4 h-4"
                          />
                          <span className="text-xs text-gray-700">
                            Affects Price (enable variant pricing for this
                            option)
                          </span>
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

                  {variantCombos.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-gray-700">
                          Variant Pricing Matrix ({variantCombos.length}{" "}
                          combinations)
                        </p>
                        <p className="text-xs text-gray-400">
                          Leave 0 to use base price
                        </p>
                      </div>
                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <table className="w-full text-xs">
                          <thead className="bg-gray-50">
                            <tr>
                              {pricingOptionLabels.map((l) => (
                                <th
                                  key={l}
                                  className="text-left px-3 py-2 font-medium text-gray-500"
                                >
                                  {l}
                                </th>
                              ))}
                              <th className="text-left px-3 py-2 font-medium text-gray-500">
                                Price (₹)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {variantCombos.map((combo) => {
                              const key = combo.join("|");
                              return (
                                <tr
                                  key={key}
                                  className="border-t border-gray-100"
                                >
                                  {combo.map((val, vi) => (
                                    <td
                                      key={vi}
                                      className="px-3 py-2 text-gray-700"
                                    >
                                      {val}
                                    </td>
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

          {/* ── Characteristics ───────────────────────────────────────── */}
          <div className="border border-cream-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-cream-50 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-brown-900">
                  Product characteristics
                </div>
                <div className="text-xs text-brown-500">
                  Short specs shown under description (e.g. Burn time · Wick · Wax)
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setCharacteristics((prev) => [
                    ...prev,
                    {
                      id: `ch-${Date.now()}`,
                      label: "",
                      value: "",
                      icon: "",
                    },
                  ])
                }
                className="text-xs text-amber-700 hover:text-amber-800 flex items-center gap-1 font-medium"
              >
                <Plus size={12} /> Add
              </button>
            </div>
            {characteristics.length > 0 && (
              <div className="p-4 space-y-3">
                {characteristics.map((c, i) => (
                  <div
                    key={c.id}
                    className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-start"
                  >
                    <input
                      placeholder="Label (e.g. Burn time)"
                      value={c.label}
                      onChange={(e) =>
                        setCharacteristics((prev) =>
                          prev.map((x, idx) =>
                            idx === i ? { ...x, label: e.target.value } : x,
                          ),
                        )
                      }
                      className={inputCls}
                    />
                    <input
                      placeholder="Value (e.g. 50 hours)"
                      value={c.value}
                      onChange={(e) =>
                        setCharacteristics((prev) =>
                          prev.map((x, idx) =>
                            idx === i ? { ...x, value: e.target.value } : x,
                          ),
                        )
                      }
                      className={inputCls}
                    />
                    <input
                      placeholder="Icon (lucide name, optional)"
                      value={c.icon || ""}
                      onChange={(e) =>
                        setCharacteristics((prev) =>
                          prev.map((x, idx) =>
                            idx === i ? { ...x, icon: e.target.value } : x,
                          ),
                        )
                      }
                      className={inputCls}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setCharacteristics((prev) =>
                          prev.filter((_, idx) => idx !== i),
                        )
                      }
                      className="p-2 text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Extra buttons ─────────────────────────────────────────── */}
          <div className="border border-cream-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-cream-50 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-brown-900">
                  Extra action buttons
                </div>
                <div className="text-xs text-brown-500">
                  Shown under the Add to Cart button (e.g. &ldquo;Design your
                  own&rdquo; → /custom-candle)
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setExtraButtons((prev) => [
                    ...prev,
                    {
                      id: `btn-${Date.now()}`,
                      label: "",
                      href: "",
                      variant: "dashed",
                    },
                  ])
                }
                className="text-xs text-amber-700 hover:text-amber-800 flex items-center gap-1 font-medium"
              >
                <Plus size={12} /> Add
              </button>
            </div>
            {extraButtons.length > 0 && (
              <div className="p-4 space-y-3">
                {extraButtons.map((b, i) => (
                  <div
                    key={b.id}
                    className="grid grid-cols-[1fr_1.2fr_140px_auto] gap-2 items-start"
                  >
                    <input
                      placeholder="Label"
                      value={b.label}
                      onChange={(e) =>
                        setExtraButtons((prev) =>
                          prev.map((x, idx) =>
                            idx === i ? { ...x, label: e.target.value } : x,
                          ),
                        )
                      }
                      className={inputCls}
                    />
                    <input
                      placeholder="/custom-candle or https://..."
                      value={b.href}
                      onChange={(e) =>
                        setExtraButtons((prev) =>
                          prev.map((x, idx) =>
                            idx === i ? { ...x, href: e.target.value } : x,
                          ),
                        )
                      }
                      className={inputCls}
                    />
                    <select
                      value={b.variant || "dashed"}
                      onChange={(e) =>
                        setExtraButtons((prev) =>
                          prev.map((x, idx) =>
                            idx === i
                              ? {
                                  ...x,
                                  variant: e.target
                                    .value as ExtraButton["variant"],
                                }
                              : x,
                          ),
                        )
                      }
                      className={inputCls}
                    >
                      <option value="dashed">Dashed (handoff style)</option>
                      <option value="outline">Outline</option>
                      <option value="primary">Primary coral</option>
                    </select>
                    <button
                      type="button"
                      onClick={() =>
                        setExtraButtons((prev) =>
                          prev.filter((_, idx) => idx !== i),
                        )
                      }
                      className="p-2 text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Additional rich-text sections ─────────────────────────── */}
          <div className="border border-cream-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-cream-50 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-brown-900">
                  Additional sections
                </div>
                <div className="text-xs text-brown-500">
                  Rendered at the bottom of the product page. Each has a
                  heading, rich-text body, and optional image.
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setAdditionalSections((prev) => [
                    ...prev,
                    {
                      id: `sec-${Date.now()}`,
                      heading: "",
                      body: "",
                      image: "",
                    },
                  ])
                }
                className="text-xs text-amber-700 hover:text-amber-800 flex items-center gap-1 font-medium"
              >
                <Plus size={12} /> Add section
              </button>
            </div>
            {additionalSections.length > 0 && (
              <div className="p-4 space-y-5">
                {additionalSections.map((s, i) => (
                  <div
                    key={s.id}
                    className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500">
                        Section {i + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setAdditionalSections((prev) =>
                            prev.filter((_, idx) => idx !== i),
                          )
                        }
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <input
                      placeholder="Heading"
                      value={s.heading}
                      onChange={(e) =>
                        setAdditionalSections((prev) =>
                          prev.map((x, idx) =>
                            idx === i ? { ...x, heading: e.target.value } : x,
                          ),
                        )
                      }
                      className={inputCls}
                    />
                    <div className="bg-white rounded-lg">
                      <ReactQuill
                        theme="snow"
                        value={s.body}
                        onChange={(val) =>
                          setAdditionalSections((prev) =>
                            prev.map((x, idx) =>
                              idx === i ? { ...x, body: val } : x,
                            ),
                          )
                        }
                        className="h-32 mb-12"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">
                        Image (optional)
                      </label>
                      <div className="flex gap-2">
                        <input
                          placeholder="Image URL"
                          value={s.image || ""}
                          onChange={(e) =>
                            setAdditionalSections((prev) =>
                              prev.map((x, idx) =>
                                idx === i
                                  ? { ...x, image: e.target.value }
                                  : x,
                              ),
                            )
                          }
                          className={`flex-1 ${inputCls}`}
                        />
                        <button
                          type="button"
                          onClick={() => sectionFileInputs.current[s.id]?.click()}
                          className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                        >
                          <Upload size={14} /> Upload
                        </button>
                        <input
                          ref={(el) => {
                            sectionFileInputs.current[s.id] = el;
                          }}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const fd = new FormData();
                            fd.append("file", file);
                            const res = await fetch("/api/upload", {
                              method: "POST",
                              body: fd,
                            });
                            const { url, error } = await res.json();
                            if (error) {
                              alert(error);
                              return;
                            }
                            setAdditionalSections((prev) =>
                              prev.map((x, idx) =>
                                idx === i ? { ...x, image: url } : x,
                              ),
                            );
                          }}
                        />
                      </div>
                      {s.image && (
                        <img
                          src={s.image}
                          alt=""
                          className="mt-2 w-32 h-20 object-cover rounded-lg border border-gray-200"
                        />
                      )}
                    </div>
                  </div>
                ))}
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
              {editProduct ? "Save Changes" : "Create Product"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Product"
        size="sm"
      >
        <p className="text-gray-600 mb-5">
          Are you sure you want to delete this product? This cannot be undone.
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
