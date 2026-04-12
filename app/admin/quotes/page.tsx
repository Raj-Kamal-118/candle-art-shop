"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Quote Requests
      </h1>

      <div className="bg-white dark:bg-[#1a1830] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
          <thead className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Details</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {quotes.map((quote) => (
              <tr
                key={quote.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td className="px-6 py-4">
                  {new Date(quote.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {quote.customer_name}
                  </div>
                  <div className="text-xs">{quote.customer_email}</div>
                  <div className="text-xs">{quote.customer_phone}</div>
                </td>
                <td className="px-6 py-4 capitalize font-medium">
                  {quote.type}
                </td>
                <td className="px-6 py-4 text-xs">
                  <div className="space-y-1">
                    {quote.details &&
                      Object.entries(quote.details).map(([key, value]) => (
                        <div key={key} className="flex gap-2">
                          <span className="font-medium text-gray-700 dark:text-gray-300 capitalize min-w-[70px]">
                            {key.replace(/([A-Z])/g, " $1").trim()}:
                          </span>
                          <span
                            className="text-gray-600 dark:text-gray-400 truncate max-w-[150px]"
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
                    className={`px-2 py-1 rounded-full text-xs font-medium ${quote.status === "pending" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}
                  >
                    {quote.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => updateStatus(quote.id, "contacted")}
                    className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600"
                  >
                    Mark Contacted
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
