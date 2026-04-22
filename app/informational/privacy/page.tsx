import { Lock, Eye, Share2, UserCheck, Archive } from "lucide-react";
import InfoShell from "@/components/informational/InfoShell";

const sections = [
  {
    Icon: Eye,
    heading: "What we collect",
    body: "When you visit Artisan House we log basic device and session data — the pages you viewed, how you got here, and (if you buy something) the details needed to process your order: name, shipping address, phone, email, payment reference. If you WhatsApp or email us, we keep that conversation so we can help you later.",
  },
  {
    Icon: Lock,
    heading: "How we use it",
    body: "To pour, pack, and ship your candle. To send you an order confirmation and a dispatch note. To answer your questions. To spot fraudulent orders before they leave the studio. To make the site easier to use the next time you visit. That's it — we don't run ads on the back of your data.",
  },
  {
    Icon: Share2,
    heading: "Who we share it with",
    body: "Only the partners who help us deliver the order: our payment gateway (PhonePe), our courier, and the tools that run the shop (Supabase for data, Cloudflare for hosting and files). We do not sell your information. We do not pass your contact details to marketing lists.",
  },
  {
    Icon: UserCheck,
    heading: "Your rights",
    body: "You can ask us to show you what we hold about you, correct it, or delete it — just WhatsApp +91 80091 70754 or email artisanhouse.in@gmail.com and we'll sort it within a day. You can unsubscribe from any email we send with one click.",
  },
  {
    Icon: Archive,
    heading: "How long we keep it",
    body: "Order records stay with us for 7 years — that's the statutory requirement for GST invoices in India. Account and contact data is kept only for as long as you have an account with us, plus a short grace period after you ask us to delete it.",
  },
];

export default function PrivacyPage() {
  const lastUpdated = new Date().toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <InfoShell
      eyebrow="Privacy Policy"
      title={
        <>
          Handled with <span className="text-coral-600 italic">care.</span>
        </>
      }
      subtitle="Your data, plainly — what we collect, why we collect it, and what you can do about it."
    >
      <div className="text-[13px] text-brown-500 dark:text-amber-100/50 mb-6">
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
              <h2 className="font-serif text-xl md:text-2xl font-bold text-brown-900 dark:text-amber-100 leading-snug pt-1.5">
                {heading}
              </h2>
            </div>
            <p className="text-[15px] leading-[1.7] text-brown-700 dark:text-amber-100/70">
              {body}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-forest-50 dark:bg-forest-900/30 border border-forest-100 dark:border-forest-800 rounded-2xl p-6 text-[14px] leading-[1.7] text-brown-800 dark:text-amber-100/80">
        <b className="text-brown-900 dark:text-amber-100">Questions?</b>{" "}
        We&apos;d rather answer them than have you guess. WhatsApp us on{" "}
        <a
          href="https://wa.me/918009170754"
          className="text-coral-700 dark:text-coral-400 font-semibold hover:underline"
        >
          +91 80091 70754
        </a>{" "}
        or email{" "}
        <a
          href="mailto:artisanhouse.in@gmail.com"
          className="text-coral-700 dark:text-coral-400 font-semibold hover:underline"
        >
          artisanhouse.in@gmail.com
        </a>
        .
      </div>
    </InfoShell>
  );
}
