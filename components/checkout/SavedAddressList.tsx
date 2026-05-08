"use client";
import { Address } from "@/lib/types";
import { Check } from "lucide-react";

export default function SavedAddressList({
  savedAddresses,
  selectedSavedAddress,
  setSelectedSavedAddress,
  showSavedAddresses,
  setShowSavedAddresses,
  setSaveAddress,
  setPaymentError,
}: {
  savedAddresses: Address[];
  selectedSavedAddress: Address | null;
  setSelectedSavedAddress: (a: Address | null) => void;
  showSavedAddresses: boolean;
  setShowSavedAddresses: (b: boolean) => void;
  setSaveAddress: (b: boolean) => void;
  setPaymentError: (e: string) => void;
}) {
  if (!showSavedAddresses) {
    return selectedSavedAddress ? (
      <div className="flex items-center justify-between px-4 py-3 bg-forest-50 dark:bg-forest-900/10 border border-forest-200 dark:border-forest-800/40 rounded-xl">
        <div className="flex items-center gap-2 min-w-0">
          <Check
            size={14}
            className="text-forest-600 dark:text-forest-400 shrink-0"
          />
          <span className="text-sm font-medium text-forest-800 dark:text-forest-300 truncate">
            {selectedSavedAddress.fullName} · {selectedSavedAddress.address1},{" "}
            {selectedSavedAddress.city}
          </span>
        </div>
        <button
          onClick={() => setShowSavedAddresses(true)}
          className="text-xs text-coral-600 dark:text-amber-400 font-semibold uppercase tracking-wide hover:underline shrink-0 ml-3"
        >
          Change
        </button>
      </div>
    ) : (
      <button
        onClick={() => setShowSavedAddresses(true)}
        className="ah-body font-serif w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-brown-300 dark:border-amber-900/40 rounded-xl text-sm font-medium text-brown-600 dark:text-amber-100/60 hover:border-coral-400 hover:text-coral-600 dark:hover:border-amber-600 dark:hover:text-amber-400 transition-colors"
      >
        Use a saved address
      </button>
    );
  }

  return (
    <div className="border border-cream-200 dark:border-amber-900/30 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 bg-cream-50 dark:bg-[#12101e] border-b border-cream-200 dark:border-amber-900/30 flex items-center justify-between">
        <span className="text-xs font-semibold text-brown-500 dark:text-amber-100/60 uppercase tracking-wider">
          Your saved addresses
        </span>
        <button
          onClick={() => setShowSavedAddresses(false)}
          className="text-xs text-brown-400 dark:text-amber-100/40 hover:text-brown-600 dark:hover:text-amber-100/70 transition-colors"
        >
          ✕ Close
        </button>
      </div>
      <div className="p-3 grid gap-2 sm:grid-cols-2">
        {savedAddresses.map((addr, idx) => (
          <div
            key={idx}
            onClick={() => {
              setSelectedSavedAddress(addr);
              setShowSavedAddresses(false);
              setPaymentError("");
            }}
            className="p-3 rounded-xl border-2 border-cream-200 dark:border-amber-900/20 bg-white dark:bg-[#1a1830] cursor-pointer hover:border-coral-400 dark:hover:border-amber-600 transition-all"
          >
            <p className="font-semibold text-sm text-brown-900 dark:text-amber-100">
              {addr.fullName}
              {addr.isDefault && (
                <span className="ml-2 text-[10px] font-bold text-forest-700 dark:text-forest-400 uppercase tracking-wide">
                  Default
                </span>
              )}
            </p>
            <p className="text-xs mt-1 text-brown-500 dark:text-amber-100/60">
              {addr.address1}
              {addr.address2 ? `, ${addr.address2}` : ""}
            </p>
            <p className="text-xs text-brown-500 dark:text-amber-100/60">
              {addr.city}, {addr.state} {addr.postalCode}
            </p>
          </div>
        ))}
      </div>
      <div className="px-4 py-3 border-t border-cream-200 dark:border-amber-900/30">
        <button
          onClick={() => {
            setSelectedSavedAddress(null);
            setShowSavedAddresses(false);
            setSaveAddress(true);
          }}
          className="text-xs text-coral-600 dark:text-amber-400 font-semibold uppercase tracking-wide hover:underline"
        >
          + Enter a new address
        </button>
      </div>
    </div>
  );
}
