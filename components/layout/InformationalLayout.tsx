import React from "react";
import { LucideIcon } from "lucide-react";
import SecondaryHeader from "@/components/layout/SecondaryHeader";
import { SITE_CONFIG } from "@/lib/config";

export interface InfoSection {
  Icon: LucideIcon;
  heading: string;
  body: string;
}

interface InformationalLayoutProps {
  eyebrow: string;
  titlePrefix: string;
  titleHighlighted: string;
  titleSuffix?: string;
  description: string;
  lastUpdated: string;
  sections: InfoSection[];
  showContactFooter?: boolean;
}

export default function InformationalLayout({
  eyebrow,
  titlePrefix,
  titleHighlighted,
  titleSuffix = ".",
  description,
  lastUpdated,
  sections,
  showContactFooter = false,
}: InformationalLayoutProps) {
  return (
    <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] pb-20">
      <SecondaryHeader
        eyebrow={eyebrow}
        titlePrefix={titlePrefix}
        titleHighlighted={titleHighlighted}
        titleSuffix={titleSuffix}
        description={description}
      />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
        <div className="ah-caption mb-6 text-center md:text-left">
          Last updated · {lastUpdated}
        </div>
        <div className="space-y-4">
          {sections.map(({ Icon, heading, body }) => (
            <div
              key={heading}
              className="bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 rounded-2xl p-6 md:p-7"
            >
              <div className="flex items-start gap-4 mb-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 flex items-center justify-center flex-none">
                  <Icon size={18} />
                </div>
                <h2 className="ah-display-md leading-snug pt-1.5">{heading}</h2>
              </div>
              <div
                className="ah-body [&>p]:mb-4 [&>p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: body }}
              />
            </div>
          ))}
        </div>
        {showContactFooter && (
          <div className="mt-8 bg-forest-50 dark:bg-forest-900/30 border border-forest-100 dark:border-forest-800 rounded-2xl p-6 text-[14px] leading-[1.7] text-brown-800 dark:text-amber-100/80">
            <b className="text-brown-900 dark:text-amber-100">Questions?</b>{" "}
            We&apos;d rather answer them than have you guess. WhatsApp us on{" "}
            <a
              href={SITE_CONFIG.contact.whatsappUrl}
              className="text-coral-700 dark:text-coral-400 font-semibold hover:underline"
            >
              {SITE_CONFIG.contact.phone}
            </a>{" "}
            or email{" "}
            <a
              href={`mailto:${SITE_CONFIG.contact.email}`}
              className="text-coral-700 dark:text-coral-400 font-semibold hover:underline"
            >
              {SITE_CONFIG.contact.email}
            </a>
            .
          </div>
        )}
      </div>
    </main>
  );
}
