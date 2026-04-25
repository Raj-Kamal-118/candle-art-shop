"use client";

import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import SecondaryHeader from "@/components/layout/SecondaryHeader";
import Button from "@/components/ui/Button";

interface QuoteRequestSuccessProps {
  titlePrefix?: string;
  titleHighlighted: string;
  titleSuffix?: string;
  description: string;
  message: string;
  onReset: () => void;
  resetButtonText?: string;
  resetButtonIcon?: React.ElementType;
}

export default function QuoteRequestSuccess({
  titlePrefix,
  titleHighlighted,
  titleSuffix,
  description,
  message,
  onReset,
  resetButtonText = "Design Another",
  resetButtonIcon: ResetIcon,
}: QuoteRequestSuccessProps) {
  return (
    <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] pb-20">
      <SecondaryHeader
        eyebrow="✦ Request Received ✦"
        titlePrefix={titlePrefix}
        titleHighlighted={titleHighlighted}
        titleSuffix={titleSuffix}
        description={description}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 rounded-[32px] p-10 sm:p-16 shadow-sm">
          <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm border border-green-100 dark:border-green-800/30">
            <CheckCircle size={40} />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown-900 dark:text-amber-100 mb-4">
            We're on it!
          </h2>
          <p className="text-brown-600 dark:text-amber-100/70 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            {message}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={onReset}
              size="lg"
              className="w-full sm:w-auto bg-coral-600 hover:bg-coral-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white shadow-lg shadow-coral-200 dark:shadow-amber-900/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              {ResetIcon && <ResetIcon size={18} className="mr-2" />}
              {resetButtonText}
            </Button>
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 text-sm border-2 border-cream-200 dark:border-amber-900/30 text-brown-800 dark:text-amber-100 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-cream-50 dark:hover:bg-amber-900/20"
            >
              Explore Shop <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
