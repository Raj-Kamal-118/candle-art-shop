"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, RefreshCw } from "lucide-react";
import SecondaryHeader from "@/components/layout/SecondaryHeader";
import SupportChannelsGrid from "@/components/ui/SupportChannelsGrid";
import Button from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // This is a good place to log the error to a service like Sentry or LogRocket
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] pb-20">
          <SecondaryHeader
            eyebrow="✦ 500 Error ✦"
            titlePrefix="Something went"
            titleHighlighted="wrong"
            titleSuffix="."
            description="An unexpected error occurred on our end. We've been notified and are looking into it. Please try again in a moment."
          />

          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
            <div className="text-center mb-16 flex flex-wrap justify-center gap-4">
              <Button onClick={() => reset()} variant="secondary">
                <RefreshCw size={16} /> Try Again
              </Button>
              <Link href="/">
                <Button variant="primary">
                  Return to Homepage <ArrowRight size={16} />
                </Button>
              </Link>
            </div>

            <div className="bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 rounded-[20px] p-8 md:p-12 mb-10">
              <h2 className="ah-display-md text-center mb-8">
                Still having trouble? Get in touch.
              </h2>
              <SupportChannelsGrid />
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
