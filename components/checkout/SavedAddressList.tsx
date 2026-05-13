"use client";

import { useState } from "react";
import { Address } from "@/lib/types";
import { Check, Plus, ChevronDown, ChevronUp, Home } from "lucide-react";

export default function SavedAddressList({
  savedAddresses,
  selectedSavedAddress,
  setSelectedSavedAddress,
}: {
  savedAddresses: Address[];
  selectedSavedAddress: Address | null;
  setSelectedSavedAddress: (a: Address | null) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const defaultAddr = savedAddresses.find((a) => a.isDefault) || savedAddresses[0];
  const displayAddr = selectedSavedAddress ?? defaultAddr;

  return (
    <div className="rounded-2xl border border-amber-200 dark:border-amber-900/40 overflow-hidden bg-gradient-to-br from-amber-50/80 to-cream-50 dark:from-amber-900/10 dark:to-[#151326] shadow-sm">
      {/* Collapsed header — always visible */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-amber-50/60 dark:hover:bg-amber-900/10 transition-colors"
      >
        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800/40">
          <Home size={18} className="text-amber-700 dark:text-amber-400" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest mb-0.5">
            {selectedSavedAddress ? "Delivering to" : "Saved addresses"}
          </p>
          {displayAddr ? (
            <p className="text-sm font-semibold text-brown-900 dark:text-amber-100 truncate">
              {displayAddr.fullName}
              <span className="font-normal text-brown-500 dark:text-amber-100/60 ml-2">
                · {displayAddr.city}, {displayAddr.state} {displayAddr.postalCode}
              </span>
            </p>
          ) : (
            <p className="text-sm text-brown-500 dark:text-amber-100/60">
              {savedAddresses.length} saved address{savedAddresses.length !== 1 ? "es" : ""}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-500 hidden sm:block">
            {expanded ? "Close" : "Change"}
          </span>
          {expanded ? (
            <ChevronUp size={16} className="text-brown-400 dark:text-amber-100/50" />
          ) : (
            <ChevronDown size={16} className="text-brown-400 dark:text-amber-100/50" />
          )}
        </div>
      </button>

      {/* Expandable address grid */}
      {expanded && (
        <div className="border-t border-amber-100 dark:border-amber-900/30 p-4 space-y-3 bg-white/60 dark:bg-[#0f0e1c]/60">
          <p className="text-[11px] font-bold text-brown-400 dark:text-amber-100/40 uppercase tracking-widest px-1">
            Select a delivery address
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {savedAddresses.map((addr, idx) => {
              const isSelected =
                selectedSavedAddress?.fullName === addr.fullName &&
                selectedSavedAddress?.address1 === addr.address1;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedSavedAddress(addr);
                    setExpanded(false);
                  }}
                  className={`relative text-left p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? "border-coral-500 bg-coral-50/60 dark:border-amber-500 dark:bg-amber-900/20 shadow-sm"
                      : "border-cream-200 bg-white dark:bg-[#1a1830] dark:border-amber-900/30 hover:border-amber-300 dark:hover:border-amber-700/50"
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-3 right-3 w-5 h-5 bg-coral-500 dark:bg-amber-500 rounded-full flex items-center justify-center shadow-sm">
                      <Check size={11} className="text-white" strokeWidth={3} />
                    </span>
                  )}
                  <div className="pr-6">
                    <p className="font-bold text-brown-900 dark:text-amber-100 text-sm flex items-center gap-2 mb-1">
                      {addr.fullName}
                      {addr.isDefault && (
                        <span className="text-[9px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-400 px-1.5 py-0.5 rounded-full uppercase tracking-widest">
                          Default
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-brown-500 dark:text-amber-100/60 leading-relaxed">
                      {addr.address1}
                      {addr.address2 ? `, ${addr.address2}` : ""}
                      <br />
                      {addr.city}, {addr.state} {addr.postalCode}
                    </p>
                  </div>
                </button>
              );
            })}

            {/* Enter new address card */}
            <button
              type="button"
              onClick={() => {
                setSelectedSavedAddress(null);
                setExpanded(false);
              }}
              className={`text-left p-4 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center gap-2 min-h-[88px] ${
                !selectedSavedAddress
                  ? "border-coral-400 bg-coral-50/40 dark:border-amber-600 dark:bg-amber-900/20"
                  : "border-cream-300 dark:border-amber-900/30 bg-white/50 dark:bg-[#1a1830]/50 hover:border-amber-300 dark:hover:border-amber-700/50"
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${!selectedSavedAddress ? "bg-coral-100 text-coral-600 dark:bg-amber-900/40 dark:text-amber-400" : "bg-cream-100 text-brown-400 dark:bg-amber-900/20 dark:text-amber-100/40"}`}>
                <Plus size={16} />
              </div>
              <span className={`text-xs font-semibold ${!selectedSavedAddress ? "text-coral-700 dark:text-amber-300" : "text-brown-500 dark:text-amber-100/60"}`}>
                Enter new address
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
