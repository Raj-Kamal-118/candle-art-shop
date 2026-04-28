"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { X, Eye } from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const SHAPES = [
  { id: "Square", aspect: "1/1", radius: "0px" },
  { id: "Rounded Square", aspect: "1/1", radius: "16px" },
  { id: "Rectangle", aspect: "3/4", radius: "0px" },
  { id: "Circle", aspect: "1/1", radius: "50%" },
  { id: "Oval", aspect: "3/4", radius: "50%" },
];

const MATERIALS = [
  {
    id: "Wooden",
    color: "#d4a373",
    texture:
      "url('https://www.transparenttextures.com/patterns/wood-pattern.png')",
  },
  {
    id: "Clay",
    color: "#e6ccb2",
    texture:
      "url('https://www.transparenttextures.com/patterns/wall-4-light.png')",
  },
  { id: "POP", color: "#fdfcf9", texture: "none" },
];

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<any | null>(null);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setQuotes(data);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("quotes").update({ status }).eq("id", id);
    fetchQuotes(); // Refresh list
  };

  if (loading) return <div className="p-8 text-center">Loading Quotes...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold text-brown-900 dark:text-amber-100 mb-8">
        Quote Requests
      </h1>

      <div className="bg-white dark:bg-[#1a1830] rounded-2xl shadow-sm border border-cream-200 dark:border-amber-900/30 overflow-hidden">
        <table className="w-full text-left text-sm text-brown-600 dark:text-amber-100/70">
          <thead className="bg-cream-50 dark:bg-[#12101e] text-[11px] font-semibold text-brown-500 dark:text-amber-100/60 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Details</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-100 dark:divide-amber-900/20">
            {quotes.map((quote) => (
              <tr
                key={quote.id}
                className="hover:bg-cream-50 dark:hover:bg-amber-900/10 transition-colors"
              >
                <td className="px-6 py-4">
                  {new Date(quote.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-brown-900 dark:text-amber-100">
                    {quote.customer_name}
                  </div>
                  <div className="text-xs text-brown-500 dark:text-amber-100/60">
                    {quote.customer_email}
                  </div>
                  <div className="text-xs text-brown-500 dark:text-amber-100/60">
                    {quote.customer_phone}
                  </div>
                </td>
                <td className="px-6 py-4 capitalize font-medium">
                  {quote.type}
                </td>
                <td className="px-6 py-4 text-xs">
                  <div className="space-y-1">
                    {quote.details &&
                      Object.entries(quote.details)
                        .filter(
                          ([k]) => k !== "originalImage" && k !== "alignment",
                        )
                        .map(([key, value]) => (
                          <div key={key} className="flex gap-2">
                            <span className="font-medium text-brown-700 dark:text-amber-100/80 capitalize min-w-[70px]">
                              {key.replace(/([A-Z])/g, " $1").trim()}:
                            </span>
                            <span
                              className="text-brown-600 dark:text-amber-100/60 truncate max-w-[120px]"
                              title={String(value)}
                            >
                              {typeof value === "boolean"
                                ? value
                                  ? "Yes"
                                  : "No"
                                : String(value)}
                            </span>
                          </div>
                        ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase ${quote.status === "pending" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" : "bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-300"}`}
                  >
                    {quote.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => setSelectedQuote(quote)}
                    className="text-xs bg-amber-500 text-white px-3 py-1.5 rounded-lg hover:bg-amber-600 inline-flex items-center gap-1 mr-2 transition-colors"
                  >
                    <Eye size={14} /> View
                  </button>
                  <button
                    onClick={() => updateStatus(quote.id, "contacted")}
                    className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Mark Contacted
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quote Details Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1830] rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-cream-200 dark:border-amber-900/30 flex flex-col custom-scrollbar">
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white/95 dark:bg-[#1a1830]/95 backdrop-blur border-b border-cream-100 dark:border-amber-900/20">
              <h2 className="text-2xl font-serif font-bold text-brown-900 dark:text-amber-100 capitalize">
                {selectedQuote.type.replace("-", " ")} Request
              </h2>
              <button
                onClick={() => setSelectedQuote(null)}
                className="p-2 text-brown-400 hover:text-brown-900 dark:text-amber-100/50 dark:hover:text-amber-100 bg-cream-50 dark:bg-[#12101e] rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-8">
              {/* Left Column: Text Details */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-[11px] font-semibold text-brown-500 dark:text-amber-100/60 uppercase tracking-wider mb-3">
                    Customer Information
                  </h3>
                  <div className="bg-cream-50 dark:bg-[#12101e] rounded-2xl p-5 border border-cream-100 dark:border-amber-900/20">
                    <p className="text-lg font-medium text-brown-900 dark:text-amber-100 mb-1">
                      {selectedQuote.customer_name}
                    </p>
                    <p className="text-sm text-brown-600 dark:text-amber-100/70 mb-1">
                      {selectedQuote.customer_email}
                    </p>
                    <p className="text-sm text-brown-600 dark:text-amber-100/70">
                      {selectedQuote.customer_phone || "No phone provided"}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-[11px] font-semibold text-brown-500 dark:text-amber-100/60 uppercase tracking-wider mb-3">
                    Request Details
                  </h3>
                  <div className="bg-cream-50 dark:bg-[#12101e] rounded-2xl p-5 border border-cream-100 dark:border-amber-900/20 space-y-4">
                    {Object.entries(selectedQuote.details || {})
                      .filter(
                        ([k]) => k !== "originalImage" && k !== "alignment",
                      )
                      .map(([key, value]) => (
                        <div
                          key={key}
                          className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4"
                        >
                          <span className="font-medium text-brown-500 dark:text-amber-100/60 capitalize min-w-[100px] text-sm">
                            {key.replace(/([A-Z])/g, " $1").trim()}:
                          </span>
                          <span className="text-sm font-medium text-brown-900 dark:text-amber-100 break-words">
                            {typeof value === "boolean"
                              ? value
                                ? "Yes"
                                : "No"
                              : String(value)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Preview */}
              <div className="bg-cream-50 dark:bg-[#12101e] rounded-3xl p-6 flex flex-col items-center justify-center border border-cream-100 dark:border-amber-900/20 min-h-[400px]">
                {selectedQuote.type === "custom-magnet" &&
                selectedQuote.details?.style === "flat-painted" &&
                selectedQuote.details?.originalImage ? (
                  <div className="flex flex-col items-center w-full">
                    <p className="text-[11px] font-semibold text-brown-500 dark:text-amber-100/60 uppercase tracking-wider mb-6">
                      User Composition Preview
                    </p>
                    <div
                      className="relative overflow-hidden shadow-xl border-4 border-white dark:border-amber-900/30"
                      style={{
                        width: "256px",
                        height:
                          SHAPES.find(
                            (s) => s.id === selectedQuote.details.shape,
                          )?.aspect === "3/4"
                            ? "340px"
                            : "256px",
                        borderRadius:
                          SHAPES.find(
                            (s) => s.id === selectedQuote.details.shape,
                          )?.radius || "0px",
                        backgroundColor:
                          MATERIALS.find(
                            (m) => m.id === selectedQuote.details.material,
                          )?.color || "#fdfcf9",
                        backgroundImage:
                          MATERIALS.find(
                            (m) => m.id === selectedQuote.details.material,
                          )?.texture || "none",
                      }}
                    >
                      <img
                        src={selectedQuote.details.originalImage}
                        alt="Customer Upload"
                        className="max-w-none mix-blend-multiply opacity-90"
                        style={{
                          transform: `translate(calc(-50% + ${selectedQuote.details.alignment?.x || 0}px), calc(-50% + ${selectedQuote.details.alignment?.y || 0}px)) rotate(${selectedQuote.details.alignment?.rotation || 0}deg) scale(${selectedQuote.details.alignment?.scale || 1})`,
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transformOrigin: "center",
                        }}
                      />
                    </div>
                  </div>
                ) : selectedQuote.type === "custom-magnet" &&
                  selectedQuote.details?.style === "3d-clay" &&
                  selectedQuote.details?.originalImage ? (
                  <div className="flex flex-col items-center w-full">
                    <p className="text-[11px] font-semibold text-brown-500 dark:text-amber-100/60 uppercase tracking-wider mb-6">
                      Reference Photo
                    </p>
                    <img
                      src={selectedQuote.details.originalImage}
                      alt="Reference Upload"
                      className="w-64 h-64 object-cover rounded-2xl shadow-xl border-4 border-white dark:border-amber-900/30"
                    />
                  </div>
                ) : selectedQuote.type === "candle" &&
                  selectedQuote.details?.color ? (
                  <div className="flex flex-col items-center w-full">
                    <p className="text-[11px] font-semibold text-brown-500 dark:text-amber-100/60 uppercase tracking-wider mb-6">
                      Requested Color
                    </p>
                    <div
                      className="w-40 h-40 rounded-full shadow-inner border-8 border-white dark:border-amber-900/30"
                      style={{ backgroundColor: selectedQuote.details.color }}
                    />
                    <p className="mt-4 font-mono text-lg font-medium text-brown-700 dark:text-amber-100/80">
                      {selectedQuote.details.color}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Eye
                      size={48}
                      className="mx-auto opacity-20 text-brown-500 dark:text-amber-100/30 mb-4"
                    />
                    <p className="text-brown-500 dark:text-amber-100/50 font-medium">
                      No visual preview available
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
