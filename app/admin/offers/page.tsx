"use client";

import { useState, useEffect } from "react";
import { Megaphone, Plus, Pencil, Trash2, Check, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    type: "",
    text: "",
    code: "",
    icon: "sparkles",
    bg_color: "#fef3c7",
    pin_color: "#d97706",
    is_active: true,
  });

  useEffect(() => {
    fetch("/api/admin/offers")
      .then((res) => res.json())
      .then((data) => {
        setOffers(data || []);
        setLoading(false);
      });
  }, []);

  const openModal = (offer: any = null) => {
    setEditingOffer(offer);
    setForm(
      offer || {
        type: "",
        text: "",
        code: "",
        icon: "sparkles",
        bg_color: "#fef3c7",
        pin_color: "#d97706",
        is_active: true,
      },
    );
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const method = editingOffer ? "PATCH" : "POST";
    const body = editingOffer ? { ...form, id: editingOffer.id } : form;

    const res = await fetch("/api/admin/offers", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const updated = await res.json();
      if (editingOffer) {
        setOffers((prev) =>
          prev.map((o) => (o.id === updated.id ? updated : o)),
        );
      } else {
        setOffers((prev) => [updated, ...prev]);
      }
      setModalOpen(false);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;
    await fetch(`/api/admin/offers?id=${id}`, { method: "DELETE" });
    setOffers((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <Megaphone size={20} className="text-amber-700" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-brown-900 dark:text-amber-100">
              Offers & Announcements
            </h1>
            <p className="text-sm text-brown-500">
              Manage the sliding offers board on the homepage.
            </p>
          </div>
        </div>
        <Button onClick={() => openModal()} size="sm">
          <Plus size={16} /> New Offer
        </Button>
      </div>

      <div className="bg-white dark:bg-[#1a1830] rounded-2xl shadow-sm border border-cream-200 dark:border-amber-900/30 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-brown-400">
            Loading offers...
          </div>
        ) : offers.length === 0 ? (
          <div className="p-12 text-center text-brown-500">
            No offers found. Create one to display it on the homepage.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-cream-50 dark:bg-[#12101e] border-b border-cream-200 dark:border-amber-900/30 text-left">
              <tr>
                <th className="px-5 py-3 font-semibold text-brown-500">
                  Event / Type
                </th>
                <th className="px-5 py-3 font-semibold text-brown-500">Text</th>
                <th className="px-5 py-3 font-semibold text-brown-500">Code</th>
                <th className="px-5 py-3 font-semibold text-brown-500 text-center">
                  Status
                </th>
                <th className="px-5 py-3 font-semibold text-brown-500 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => (
                <tr
                  key={offer.id}
                  className="border-b border-cream-100 dark:border-amber-900/20 last:border-0 hover:bg-cream-50/50 dark:hover:bg-amber-900/10"
                >
                  <td className="px-5 py-4 font-bold text-brown-900 dark:text-amber-100">
                    {offer.type}
                  </td>
                  <td className="px-5 py-4 text-brown-600 dark:text-amber-100/70 max-w-xs truncate">
                    {offer.text}
                  </td>
                  <td className="px-5 py-4">
                    {offer.code ? (
                      <code className="bg-cream-100 dark:bg-amber-900/40 px-2 py-1 rounded text-coral-600 font-bold">
                        {offer.code}
                      </code>
                    ) : (
                      <span className="text-brown-400">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center">
                    {offer.is_active ? (
                      <span className="inline-flex px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold uppercase tracking-wider">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-bold uppercase tracking-wider">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openModal(offer)}
                        className="p-2 text-brown-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(offer.id)}
                        className="p-2 text-brown-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingOffer ? "Edit Offer" : "Create Offer"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brown-500 uppercase tracking-widest mb-1">
                Type / Headline
              </label>
              <input
                required
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                placeholder="e.g. Launching, New Here?"
                className="w-full px-3 py-2 border rounded-lg bg-cream-50 dark:bg-[#12101e] border-cream-200 dark:border-amber-900/40 focus:ring-2 focus:ring-amber-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brown-500 uppercase tracking-widest mb-1">
                Discount Code (Optional)
              </label>
              <input
                value={form.code || ""}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="e.g. WELCOME10"
                className="w-full px-3 py-2 border rounded-lg bg-cream-50 dark:bg-[#12101e] border-cream-200 dark:border-amber-900/40 focus:ring-2 focus:ring-amber-400 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-brown-500 uppercase tracking-widest mb-1">
              Offer Details
            </label>
            <textarea
              required
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              rows={2}
              placeholder="Explain the offer here..."
              className="w-full px-3 py-2 border rounded-lg bg-cream-50 dark:bg-[#12101e] border-cream-200 dark:border-amber-900/40 focus:ring-2 focus:ring-amber-400 outline-none resize-none"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-brown-500 uppercase tracking-widest mb-1">
                Icon
              </label>
              <select
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-cream-50 dark:bg-[#12101e] border-cream-200 dark:border-amber-900/40 focus:ring-2 focus:ring-amber-400 outline-none"
              >
                <option value="sparkles">Sparkles</option>
                <option value="truck">Truck</option>
                <option value="gift">Gift</option>
                <option value="tag">Tag</option>
                <option value="rocket">Rocket</option>
                <option value="megaphone">Megaphone</option>
                <option value="star">Star</option>
                <option value="heart">Heart</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-brown-500 uppercase tracking-widest mb-1">
                Bg Color
              </label>
              <select
                value={form.bg_color}
                onChange={(e) => setForm({ ...form, bg_color: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-cream-50 dark:bg-[#12101e] border-cream-200 dark:border-amber-900/40 focus:ring-2 focus:ring-amber-400 outline-none"
              >
                <option value="#fef3c7">Amber Note</option>
                <option value="#e0f2fe">Sky Note</option>
                <option value="#f3e8ff">Purple Note</option>
                <option value="#fee2e2">Red Note</option>
                <option value="#dcfce7">Mint Note</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-brown-500 uppercase tracking-widest mb-1">
                Pin Color
              </label>
              <select
                value={form.pin_color}
                onChange={(e) =>
                  setForm({ ...form, pin_color: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg bg-cream-50 dark:bg-[#12101e] border-cream-200 dark:border-amber-900/40 focus:ring-2 focus:ring-amber-400 outline-none"
              >
                <option value="#d97706">Amber Pin</option>
                <option value="#0284c7">Sky Pin</option>
                <option value="#7c3aed">Purple Pin</option>
                <option value="#e85d4a">Coral Pin</option>
                <option value="#16a34a">Green Pin</option>
              </select>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer mt-2">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) =>
                setForm({ ...form, is_active: e.target.checked })
              }
              className="w-4 h-4 accent-amber-600"
            />
            <span className="text-sm font-semibold text-brown-800 dark:text-amber-100">
              Is Active
            </span>
          </label>
          <div className="flex justify-end gap-3 pt-4 border-t border-cream-200 dark:border-amber-900/30">
            <Button
              variant="outline"
              type="button"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Save Offer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
