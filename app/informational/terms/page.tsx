import {
  FileText,
  ShoppingBag,
  CreditCard,
  RefreshCw,
  Scale,
  AlertTriangle,
} from "lucide-react";
import InfoShell from "@/components/informational/InfoShell";

const sections = [
  {
    Icon: FileText,
    heading: "The short version",
    body: "This site is run by Artisan House (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By browsing or buying, you're agreeing to the terms below — we've tried to keep them honest and human. If something here doesn't feel right, WhatsApp us before you hit pay.",
  },
  {
    Icon: ShoppingBag,
    heading: "About the products",
    body: "Every candle and clay piece is hand-poured or hand-shaped in small batches. We photograph each one in natural light, but wax and colour are living materials — slight variations in tone, texture, and finish are part of what makes them handmade. These aren't defects.",
  },
  {
    Icon: CreditCard,
    heading: "Orders & payment",
    body: "When you place an order you're making an offer to buy; we confirm once the order ships. We can refuse or cancel an order (for stock, fraud, or pricing errors) and will contact you if we do. Prices are in INR and include GST where applicable. Prices can change without notice, but changes never apply to orders we've already confirmed.",
  },
  {
    Icon: RefreshCw,
    heading: "Returns & cancellations",
    body: "Damaged or wrong items: tell us within 48 hours of delivery, we'll make it right. Custom pieces and lit candles can't be returned. Full rules live on the Returns page — they override anything shorter said here.",
  },
  {
    Icon: AlertTriangle,
    heading: "Use of the site",
    body: "Don't scrape, copy, or resell anything from the site without asking. Don't try to break things. We run the studio; the brand, photography, and product designs are ours. Your reviews and photos stay yours — by posting them, you let us reshare them with credit.",
  },
  {
    Icon: Scale,
    heading: "Governing law",
    body: "These terms are governed by the laws of India. Any disputes will be resolved in the courts of Varanasi, Karnataka. If any one clause turns out to be unenforceable, the rest still stand.",
  },
];

export default function TermsPage() {
  const lastUpdated = new Date().toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <InfoShell
      eyebrow="Terms of Service"
      title={
        <>
          The <span className="text-coral-600 italic">fine</span> print.
        </>
      }
      subtitle="Not long, not lawyerly. The rules you're signing up to when you shop with us."
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
            <p
              className="text-[15px] leading-[1.7] text-brown-700 dark:text-amber-100/70"
              dangerouslySetInnerHTML={{ __html: body }}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 bg-cream-100 dark:bg-[#1a1830] border border-cream-300 dark:border-amber-900/30 rounded-2xl p-6 text-[14px] leading-[1.7] text-brown-800 dark:text-amber-100/80">
        <b className="text-brown-900 dark:text-amber-100">Changes.</b>{" "}
        We&apos;ll update this page if anything material shifts. Orders you
        already placed keep the terms that were in effect when you bought.
      </div>
    </InfoShell>
  );
}
