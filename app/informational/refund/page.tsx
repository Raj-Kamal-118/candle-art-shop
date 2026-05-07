import { Metadata } from "next";
import {
  RefreshCw,
  Ban,
  AlertCircle,
  EyeOff,
  ShieldCheck,
  Clock,
} from "lucide-react";
import SecondaryHeader from "@/components/layout/SecondaryHeader";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description:
    "Learn about our refund, cancellation, and exchange processes at Artisan House.",
};

const sections = [
  {
    Icon: RefreshCw,
    heading: "Refund and Cancellation Policy",
    body: "<p>This refund and cancellation policy outlines how you can cancel or seek a refund for a product / service that you have purchased through the Platform.</p><p>Under this policy: Cancellations will only be considered if the request is made 7 days of placing the order. However, cancellation requests may not be entertained if the orders have been communicated to such sellers / merchant(s) listed on the Platform and they have initiated the process of shipping them, or the product is out for delivery. In such an event, you may choose to reject the product at the doorstep.</p>",
  },
  {
    Icon: Ban,
    heading: "Perishable Items",
    body: "<p>Artisan House does not accept cancellation requests for perishable items like flowers, eatables, etc. However, the refund / replacement can be made if the user establishes that the quality of the product delivered is not good.</p>",
  },
  {
    Icon: AlertCircle,
    heading: "Damaged or Defective Items",
    body: "<p>In case of receipt of damaged or defective items, please report to our customer service team. The request would be entertained once the seller/ merchant listed on the Platform, has checked and determined the same at its own end. This should be reported within 7 days of receipt of products.</p>",
  },
  {
    Icon: EyeOff,
    heading: "Not As Expected",
    body: "<p>In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 7 days of receiving the product. The customer service team after looking into your complaint will take an appropriate decision.</p>",
  },
  {
    Icon: ShieldCheck,
    heading: "Warranties",
    body: "<p>In case of complaints regarding the products that come with a warranty from the manufacturers, please refer the issue to them.</p>",
  },
  {
    Icon: Clock,
    heading: "Refund Processing",
    body: "<p>In case of any refunds approved by Artisan House, it will take 4 days for the refund to be processed to you.</p>",
  },
];

export default function RefundPolicyPage() {
  const lastUpdated = new Date().toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] pb-20">
      <SecondaryHeader
        eyebrow="✦ Refund Policy ✦"
        titlePrefix="Fair and"
        titleHighlighted="transparent"
        titleSuffix="."
        description="Everything you need to know about processing cancellations, refunds, and timelines."
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
        <div className="text-[13px] text-brown-500 dark:text-amber-100/50 mb-6 text-center md:text-left">
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
              <div
                className="text-[15px] leading-[1.7] text-brown-700 dark:text-amber-100/70 [&>p]:mb-4 [&>p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: body }}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
