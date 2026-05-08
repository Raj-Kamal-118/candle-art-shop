import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SecondaryHeader from "@/components/layout/SecondaryHeader";
import SupportChannelsGrid from "@/components/ui/SupportChannelsGrid";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] pb-20">
      <SecondaryHeader
        eyebrow="✦ 404 Error ✦"
        titlePrefix="Page not"
        titleHighlighted="found"
        titleSuffix="."
        description="We couldn't find the page you're looking for. It might have been moved or deleted, but we're here to help."
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-16">
          <Link href="/">
            <Button variant="primary">
              Return to Homepage <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        <div className="bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 rounded-[20px] p-8 md:p-12 mb-10">
          <h2 className="ah-display-md text-center mb-8">
            Need help finding something? Get in touch.
          </h2>
          <SupportChannelsGrid />
        </div>
      </div>
    </main>
  );
}
