"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Percent, Copy, Check } from "lucide-react";
import { DiscountCode } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editDiscount, setEditDiscount] = useState<DiscountCode | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [form, setForm] = useState({
    code: "",
    type: "percentage" as "percentage" | "fixed",
    value: "",
    minOrderAmount: "0",
    maxUses: "100",
    expiresAt: "",
    active: true,
    oneUsePerCustomer: false,
  });

  useEffect(() => {
    fetch("/api/discounts")
      .then((r) => r.json())
      .then((data) => {
        setDiscounts(data);
        setLoading(false);
      });
  }, []);

  const openAdd = () => {
    setEditDiscount(null);
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    setForm({
      code: "",
      type: "percentage",
      value: "",
      minOrderAmount: "0",
      maxUses: "100",
      expiresAt: nextYear.toISOString().split("T")[0],
      active: true,
      oneUsePerCustomer: false,
    });
    setModalOpen(true);
  };

  const openEdit = (disc: DiscountCode) => {
    setEditDiscount(disc);
    setForm({
      code: disc.code,
      type: disc.type,
      value: disc.value.toString(),
      minOrderAmount: disc.minOrderAmount.toString(),
      maxUses: disc.maxUses.toString(),
      expiresAt: disc.expiresAt.split("T")[0],
      active: disc.active,
      oneUsePerCustomer: (disc as any).oneUsePerCustomer ?? false,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      code: form.code.toUpperCase(),
      type: form.type,
      value: parseFloat(form.value),
      minOrderAmount: parseFloat(form.minOrderAmount),
      maxUses: parseInt(form.maxUses),
      expiresAt: new Date(form.expiresAt).toISOString(),
      active: form.active,
      oneUsePerCustomer: form.oneUsePerCustomer,
    };

    if (editDiscount) {
      const res = await fetch(`/api/discounts/${editDiscount.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const updated = await res.json();
      setDiscounts((prev) =>
        prev.map((d) => (d.id === editDiscount.id ? updated : d)),
      );
    } else {
      const res = await fetch("/api/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const created = await res.json();
      setDiscounts((prev) => [...prev, created]);
    }
    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await fetch(`/api/discounts/${deleteId}`, { method: "DELETE" });
    setDiscounts((prev) => prev.filter((d) => d.id !== deleteId));
    setDeleteId(null);
  };

  const copyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button onClick={openAdd} size="sm">
          <Plus size={16} />
          Add Discount
        </Button>
      </div>

      <div className="bg-white dark:bg-[#1a1830] rounded-2xl shadow-sm border border-cream-200 dark:border-amber-900/30 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-brown-400 dark:text-amber-100/50">
            Loading...
          </div>
        ) : discounts.length === 0 ? (
          <div className="p-12 text-center">
            <Percent
              className="mx-auto text-cream-300 dark:text-amber-900/40 mb-3"
              size={40}
            />
            <p className="text-brown-400 dark:text-amber-100/50">
              No discount codes yet
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-50 dark:bg-[#12101e] border-b border-cream-200 dark:border-amber-900/30">
                <tr>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-brown-500 dark:text-amber-100/60 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-brown-500 dark:text-amber-100/60 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-brown-500 dark:text-amber-100/60 uppercase tracking-wider">
                    Min Order
                  </th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-brown-500 dark:text-amber-100/60 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="text-center px-4 py-3.5 text-[11px] font-semibold text-brown-500 dark:text-amber-100/60 uppercase tracking-wider">
                    1 / Cust
                  </th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-brown-500 dark:text-amber-100/60 uppercase tracking-wider">
                    Expires
                  </th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-brown-500 dark:text-amber-100/60 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-brown-500 dark:text-amber-100/60 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {discounts.map((disc) => (
                  <tr
                    key={disc.id}
                    className="border-b border-cream-100 dark:border-amber-900/20 hover:bg-cream-50 dark:hover:bg-amber-900/10 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <code className="bg-cream-100 dark:bg-amber-900/30 text-brown-900 dark:text-amber-100 px-2 py-1 rounded text-xs font-mono font-bold">
                          {disc.code}
                        </code>
                        <button
                          onClick={() => copyCode(disc.id, disc.code)}
                          className="text-brown-400 dark:text-amber-100/40 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                        >
                          {copiedId === disc.id ? (
                            <Check size={13} className="text-green-500" />
                          ) : (
                            <Copy size={13} />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-semibold text-brown-900 dark:text-amber-100">
                        {disc.type === "percentage"
                          ? `${disc.value}% off`
                          : `₹${disc.value} off`}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-brown-600 dark:text-amber-100/70">
                      {disc.minOrderAmount === 0
                        ? "None"
                        : `₹${disc.minOrderAmount}`}
                    </td>
                    <td className="px-4 py-4 text-brown-600 dark:text-amber-100/70">
                      <div className="flex items-center gap-1.5">
                        <span>{disc.usedCount}</span>
                        <span className="text-brown-400 dark:text-amber-100/40">
                          /
                        </span>
                        <span>{disc.maxUses}</span>
                      </div>
                      <div className="w-20 h-1 bg-cream-200 dark:bg-amber-900/30 rounded-full mt-1">
                        <div
                          className="h-full bg-amber-500 dark:bg-amber-500/80 rounded-full"
                          style={{
                            width: `${Math.min(100, (disc.usedCount / disc.maxUses) * 100)}%`,
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {(disc as any).oneUsePerCustomer ? (
                        <Check size={16} className="text-green-500 mx-auto" />
                      ) : (
                        <span className="text-cream-300 dark:text-amber-900/40">
                          -
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-xs text-brown-500 dark:text-amber-100/60">
                      {new Date(disc.expiresAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      {!disc.active ? (
                        <Badge variant="warning">Inactive</Badge>
                      ) : isExpired(disc.expiresAt) ? (
                        <Badge variant="danger">Expired</Badge>
                      ) : disc.usedCount >= disc.maxUses ? (
                        <Badge variant="danger">Exhausted</Badge>
                      ) : (
                        <Badge variant="success">Active</Badge>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(disc)}
                          className="p-2 text-brown-400 dark:text-amber-100/50 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteId(disc.id)}
                          className="p-2 text-brown-400 dark:text-amber-100/50 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
        title={editDiscount ? "Edit Discount Code" : "Add Discount Code"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-[13px] font-medium text-brown-800 dark:text-amber-100/80 mb-1.5">
                Code *
              </label>
              <input
                required
                value={form.code}
                onChange={(e) =>
                  setForm({ ...form, code: e.target.value.toUpperCase() })
                }
                placeholder="SUMMER20"
                className="w-full px-3 py-2 bg-white dark:bg-[#12101e] border border-brown-300 dark:border-amber-900/40 rounded-lg text-sm text-brown-900 dark:text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500/50 transition-colors placeholder:text-brown-400 dark:placeholder:text-amber-100/30 font-mono uppercase"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-brown-800 dark:text-amber-100/80 mb-1.5">
                Type *
              </label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value as "percentage" | "fixed",
                  })
                }
                className="w-full px-3 py-2 bg-white dark:bg-[#12101e] border border-brown-300 dark:border-amber-900/40 rounded-lg text-sm text-brown-900 dark:text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500/50 transition-colors"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-brown-800 dark:text-amber-100/80 mb-1.5">
                Value *
              </label>
              <input
                required
                type="number"
                step="0.01"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                placeholder={form.type === "percentage" ? "20" : "10.00"}
                className="w-full px-3 py-2 bg-white dark:bg-[#12101e] border border-brown-300 dark:border-amber-900/40 rounded-lg text-sm text-brown-900 dark:text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500/50 transition-colors placeholder:text-brown-400 dark:placeholder:text-amber-100/30"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-brown-800 dark:text-amber-100/80 mb-1.5">
                Min Order Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={form.minOrderAmount}
                onChange={(e) =>
                  setForm({ ...form, minOrderAmount: e.target.value })
                }
                className="w-full px-3 py-2 bg-white dark:bg-[#12101e] border border-brown-300 dark:border-amber-900/40 rounded-lg text-sm text-brown-900 dark:text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-brown-800 dark:text-amber-100/80 mb-1.5">
                Max Uses
              </label>
              <input
                type="number"
                value={form.maxUses}
                onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-[#12101e] border border-brown-300 dark:border-amber-900/40 rounded-lg text-sm text-brown-900 dark:text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-brown-800 dark:text-amber-100/80 mb-1.5">
                Expires At
              </label>
              <input
                type="date"
                value={form.expiresAt}
                onChange={(e) =>
                  setForm({ ...form, expiresAt: e.target.value })
                }
                className="w-full px-3 py-2 bg-white dark:bg-[#12101e] border border-brown-300 dark:border-amber-900/40 rounded-lg text-sm text-brown-900 dark:text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500/50 transition-colors"
              />
            </div>
            <div className="col-span-2 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active-check"
                  checked={form.active}
                  onChange={(e) =>
                    setForm({ ...form, active: e.target.checked })
                  }
                  className="accent-amber-600 w-4 h-4"
                />
                <label
                  htmlFor="active-check"
                  className="text-sm text-brown-700 dark:text-amber-100/80 cursor-pointer"
                >
                  Active
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="one-use-check"
                  checked={form.oneUsePerCustomer}
                  onChange={(e) =>
                    setForm({ ...form, oneUsePerCustomer: e.target.checked })
                  }
                  className="accent-amber-600 w-4 h-4"
                />
                <label
                  htmlFor="one-use-check"
                  className="text-sm text-brown-700 dark:text-amber-100/80 cursor-pointer"
                >
                  Limit to one use per customer
                </label>
              </div>
            </div>
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
              {editDiscount ? "Save Changes" : "Create Code"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Discount Code"
        size="sm"
      >
        <p className="text-brown-700 dark:text-amber-100/80 mb-5">
          Are you sure you want to delete this discount code? This cannot be
          undone.
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
