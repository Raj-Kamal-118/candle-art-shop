"use client";

import { useState, useEffect } from "react";
import {
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Phone,
  Mail,
  Image as ImageIcon,
  CheckCircle,
  RefreshCw,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

interface OrderIssue {
  id: string;
  order_id?: string;
  orderId?: string;
  customer_email?: string;
  customerEmail?: string;
  customer_phone?: string | null;
  customerPhone?: string | null;
  issue_type?: string;
  issueType?: string;
  description: string;
  image_url?: string | null;
  imageUrl?: string | null;
  status: "pending" | "contacted" | "resolving" | "resolved";
  admin_notes?: string | null;
  adminNotes?: string | null;
  created_at?: string;
  createdAt?: string;
}

const STATUS_CONFIG: Record<
  OrderIssue["status"],
  { label: string; color: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: <Clock size={13} />,
  },
  contacted: {
    label: "Contacted",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: <Phone size={13} />,
  },
  resolving: {
    label: "Resolving",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: <RefreshCw size={13} />,
  },
  resolved: {
    label: "Resolved",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: <CheckCircle size={13} />,
  },
};

const ISSUE_LABELS: Record<string, string> = {
  damaged_product: "Product arrived damaged",
  wrong_item: "Received wrong item",
  missing_item: "Item missing from order",
  late_delivery: "Delivery is delayed",
  quality_concern: "Quality not as expected",
  other: "Something else",
};

const STATUS_OPTIONS: OrderIssue["status"][] = [
  "pending",
  "contacted",
  "resolving",
  "resolved",
];

export default function AdminQueriesPage() {
  const [issues, setIssues] = useState<OrderIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [adminNotesDraft, setAdminNotesDraft] = useState<
    Record<string, string>
  >({});
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/admin/queries")
      .then((r) => r.json())
      .then((data) => {
        const parsedIssues = Array.isArray(data)
          ? data
          : data.queries || data.issues || data.data || [];
        setIssues(parsedIssues);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleStatusChange = async (
    issue: OrderIssue,
    newStatus: OrderIssue["status"],
  ) => {
    setSavingId(issue.id);
    const notes =
      adminNotesDraft[issue.id] ?? issue.admin_notes ?? issue.adminNotes ?? "";
    try {
      const res = await fetch("/api/admin/queries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: issue.id,
          status: newStatus,
          adminNotes: notes,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setIssues((prev) => prev.map((i) => (i.id === issue.id ? updated : i)));
      }
    } finally {
      setSavingId(null);
    }
  };

  const handleSaveNotes = async (issue: OrderIssue) => {
    setSavingId(issue.id);
    const notes =
      adminNotesDraft[issue.id] ?? issue.admin_notes ?? issue.adminNotes ?? "";
    try {
      const res = await fetch("/api/admin/queries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: issue.id,
          status: issue.status,
          adminNotes: notes,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setIssues((prev) => prev.map((i) => (i.id === issue.id ? updated : i)));
      }
    } finally {
      setSavingId(null);
    }
  };

  const filtered =
    statusFilter === "all"
      ? issues
      : issues.filter((i) => i.status === statusFilter);

  const counts = {
    all: issues.length,
    pending: issues.filter((i) => i.status === "pending").length,
    contacted: issues.filter((i) => i.status === "contacted").length,
    resolving: issues.filter((i) => i.status === "resolving").length,
    resolved: issues.filter((i) => i.status === "resolved").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
          <MessageCircle
            size={20}
            className="text-amber-700 dark:text-amber-400"
          />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-bold text-brown-900 dark:text-amber-100">
            Customer Queries
          </h1>
          <p className="text-sm text-brown-500 dark:text-amber-100/60">
            Issues and questions submitted by customers about their orders
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(
          ["all", "pending", "contacted", "resolving", "resolved"] as const
        ).map((s) => {
          const isActive = statusFilter === s;
          const count = counts[s];
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                isActive
                  ? "bg-coral-600 text-white border-coral-600 shadow-md"
                  : "bg-white dark:bg-[#1a1830] text-brown-700 dark:text-amber-100/70 border-cream-200 dark:border-amber-900/30 hover:border-amber-300"
              }`}
            >
              {s === "all"
                ? "All"
                : STATUS_CONFIG[s as OrderIssue["status"]].label}
              <span
                className={`ml-2 px-1.5 py-0.5 rounded-md text-[11px] font-bold ${isActive ? "bg-white/20 text-white" : "bg-cream-100 dark:bg-amber-900/30 text-brown-600 dark:text-amber-100/60"}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-white dark:bg-[#1a1830] rounded-2xl border border-cream-200 dark:border-amber-900/30 animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#1a1830] rounded-3xl border border-cream-200 dark:border-amber-900/30">
          <div className="w-16 h-16 bg-cream-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle
              size={24}
              className="text-brown-300 dark:text-amber-700/50"
            />
          </div>
          <p className="text-brown-600 dark:text-amber-100/70 font-semibold">
            No queries yet
          </p>
          <p className="text-sm text-brown-400 dark:text-amber-100/40 mt-1">
            Customer issue reports will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((issue) => {
            const isExpanded = expanded === issue.id;
            const statusCfg = STATUS_CONFIG[issue.status];
            const noteDraft =
              adminNotesDraft[issue.id] ??
              issue.admin_notes ??
              issue.adminNotes ??
              "";

            const orderId = issue.order_id || issue.orderId || "";
            const customerEmail =
              issue.customer_email || issue.customerEmail || "No Email";
            const customerPhone =
              issue.customer_phone || issue.customerPhone || "";
            const issueType = issue.issue_type || issue.issueType || "";
            const imageUrl = issue.image_url || issue.imageUrl || null;
            const createdAt =
              issue.created_at || issue.createdAt || new Date().toISOString();

            return (
              <div
                key={issue.id}
                className={`bg-white dark:bg-[#1a1830] rounded-2xl border overflow-hidden transition-all ${
                  isExpanded
                    ? "border-amber-300 dark:border-amber-700/50 shadow-md"
                    : "border-cream-200 dark:border-amber-900/30 shadow-sm"
                }`}
              >
                {/* Row */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : issue.id)}
                  className="w-full flex flex-wrap sm:flex-nowrap items-center gap-4 p-5 text-left hover:bg-cream-50/50 dark:hover:bg-amber-900/10 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusCfg.color}`}
                      >
                        {statusCfg.icon}
                        {statusCfg.label}
                      </span>
                      <span className="text-[11px] font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800/40">
                        {ISSUE_LABELS[issueType] || issueType}
                      </span>
                      {imageUrl && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-brown-400 dark:text-amber-100/40">
                          <ImageIcon size={12} /> Photo
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-brown-900 dark:text-amber-100 truncate">
                      Order #{orderId.slice(-8).toUpperCase()}
                      <span className="text-brown-400 dark:text-amber-100/40 font-normal ml-2">
                        · {customerEmail}
                      </span>
                    </p>
                    <p className="text-xs text-brown-400 dark:text-amber-100/40 mt-0.5">
                      {new Date(createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-brown-400 dark:text-amber-100/40">
                    {isExpanded ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </div>
                </button>

                {/* Expanded */}
                {isExpanded && (
                  <div className="border-t border-cream-200 dark:border-amber-900/30 p-5 space-y-5 bg-cream-50/30 dark:bg-[#151326]">
                    {/* Customer details */}
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div className="bg-white dark:bg-[#1a1830] rounded-xl p-4 border border-cream-200 dark:border-amber-900/30">
                        <p className="text-[10px] font-bold text-brown-400 dark:text-amber-100/40 uppercase tracking-widest mb-1">
                          Email
                        </p>
                        <div className="flex items-center gap-2">
                          <Mail
                            size={14}
                            className="text-amber-600 flex-shrink-0"
                          />
                          <a
                            href={`mailto:${customerEmail}`}
                            className="text-sm font-semibold text-brown-900 dark:text-amber-100 hover:text-coral-600 transition-colors truncate"
                          >
                            {customerEmail}
                          </a>
                        </div>
                      </div>
                      {customerPhone && (
                        <div className="bg-white dark:bg-[#1a1830] rounded-xl p-4 border border-cream-200 dark:border-amber-900/30">
                          <p className="text-[10px] font-bold text-brown-400 dark:text-amber-100/40 uppercase tracking-widest mb-1">
                            Phone
                          </p>
                          <div className="flex items-center gap-2">
                            <Phone
                              size={14}
                              className="text-amber-600 flex-shrink-0"
                            />
                            <a
                              href={`tel:${customerPhone}`}
                              className="text-sm font-semibold text-brown-900 dark:text-amber-100 hover:text-coral-600 transition-colors"
                            >
                              {customerPhone}
                            </a>
                          </div>
                        </div>
                      )}
                      <div className="bg-white dark:bg-[#1a1830] rounded-xl p-4 border border-cream-200 dark:border-amber-900/30">
                        <p className="text-[10px] font-bold text-brown-400 dark:text-amber-100/40 uppercase tracking-widest mb-1">
                          Order
                        </p>
                        <a
                          href={`/admin/orders`}
                          className="flex items-center gap-1.5 text-sm font-semibold text-amber-700 dark:text-amber-400 hover:text-coral-600 transition-colors"
                        >
                          #{orderId.slice(-8).toUpperCase()}
                          <ExternalLink size={13} />
                        </a>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white dark:bg-[#1a1830] rounded-xl p-4 border border-cream-200 dark:border-amber-900/30">
                      <p className="text-[10px] font-bold text-brown-400 dark:text-amber-100/40 uppercase tracking-widest mb-2">
                        Customer Message
                      </p>
                      <p className="text-sm text-brown-800 dark:text-amber-100/90 leading-relaxed whitespace-pre-wrap">
                        {issue.description}
                      </p>
                    </div>

                    {/* Image */}
                    {imageUrl && (
                      <div>
                        <p className="text-[10px] font-bold text-brown-400 dark:text-amber-100/40 uppercase tracking-widest mb-2">
                          Attached Photo
                        </p>
                        <a
                          href={imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={imageUrl}
                            alt="Issue photo"
                            className="max-w-xs rounded-xl border border-cream-200 dark:border-amber-900/30 shadow-sm hover:shadow-md transition-shadow"
                          />
                        </a>
                      </div>
                    )}

                    {/* Admin notes */}
                    <div>
                      <label className="block text-[10px] font-bold text-brown-400 dark:text-amber-100/40 uppercase tracking-widest mb-2">
                        Internal Notes
                      </label>
                      <textarea
                        rows={3}
                        value={noteDraft}
                        onChange={(e) =>
                          setAdminNotesDraft((prev) => ({
                            ...prev,
                            [issue.id]: e.target.value,
                          }))
                        }
                        placeholder="Add internal notes about this query..."
                        className="w-full px-4 py-3 text-sm bg-white dark:bg-[#0f0e1c] border border-cream-200 dark:border-amber-900/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 dark:text-amber-100 text-brown-900 placeholder:text-brown-300 dark:placeholder:text-amber-100/30 resize-none"
                      />
                    </div>

                    {/* Status + save */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-brown-500 dark:text-amber-100/60 uppercase tracking-wider">
                          Status:
                        </span>
                        <div className="flex gap-1.5">
                          {STATUS_OPTIONS.map((s) => {
                            const cfg = STATUS_CONFIG[s];
                            const active = issue.status === s;
                            return (
                              <button
                                key={s}
                                disabled={savingId === issue.id}
                                onClick={() => handleStatusChange(issue, s)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all disabled:opacity-50 ${
                                  active
                                    ? cfg.color + " shadow-sm"
                                    : "bg-cream-50 dark:bg-[#0f0e1c] text-brown-500 dark:text-amber-100/50 border-cream-200 dark:border-amber-900/20 hover:border-amber-300"
                                }`}
                              >
                                {cfg.icon}
                                {cfg.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <button
                        disabled={savingId === issue.id}
                        onClick={() => handleSaveNotes(issue)}
                        className="ml-auto px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50 shadow-sm"
                      >
                        {savingId === issue.id ? "Saving…" : "Save Notes"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
