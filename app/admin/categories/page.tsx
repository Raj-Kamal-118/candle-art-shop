"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { Category } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      });
  }, []);

  const openAdd = () => {
    setEditCategory(null);
    setForm({ name: "", description: "", image: "" });
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditCategory(cat);
    setForm({ name: cat.name, description: cat.description, image: cat.image });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editCategory) {
      const res = await fetch(`/api/categories/${editCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const updated = await res.json();
      setCategories((prev) =>
        prev.map((c) => (c.id === editCategory.id ? updated : c))
      );
    } else {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button onClick={openAdd} size="sm">
          <Plus size={16} />
          Add Category
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
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Category
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Slug
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Products
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Created
                  </th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{cat.name}</p>
                          <p className="text-xs text-gray-400 line-clamp-1 max-w-[240px]">
                            {cat.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {cat.slug}
                      </code>
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {cat.productCount}
                    </td>
                    <td className="px-4 py-4 text-gray-500 text-xs">
                      {new Date(cat.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(cat)}
                          className="p-2 text-gray-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteId(cat.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editCategory ? "Edit Category" : "Add Category"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://picsum.photos/seed/name/600/400"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)} type="button">
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
        <p className="text-gray-600 mb-5">
          Are you sure you want to delete this category? Products in this
          category will not be deleted but will become uncategorized.
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
