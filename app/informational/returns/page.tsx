import { Metadata } from "next";
import { Clock, CheckCircle2, PackageCheck } from "lucide-react";
import SecondaryHeader from "@/components/layout/SecondaryHeader";

export const metadata: Metadata = {
  title: "Return Policy",
  description: "Read the return and exchange policy for Artisan House.",
};

const sections = [
  {
    Icon: Clock,
    heading: "Return & Exchange Window",
    body: "<p>We offer refund / exchange within first 3 days from the date of your purchase. If 3 days have passed since your purchase, you will not be offered a return, exchange or refund of any kind.</p>",
  },
  {
    Icon: CheckCircle2,
    heading: "Eligibility Criteria",
    body: "<p>In order to become eligible for a return or an exchange, (i) the purchased item should be unused and in the same condition as you received it, (ii) the item must have original packaging, (iii) if the item that you purchased on a sale, then the item may not be eligible for a return / exchange.</p><p>Further, only such items are replaced by us (based on an exchange request), if such items are found defective or damaged.</p>",
  },
  {
    Icon: PackageCheck,
    heading: "Inspection & Processing",
    body: "<p>You agree that there may be a certain category of products / items that are exempted from returns or refunds. Such categories of the products would be identified to you at the item of purchase.</p><p>For exchange / return accepted request(s) (as applicable), once your returned product / item is received and inspected by us, we will send you an email to notify you about receipt of the returned / exchanged product. Further. If the same has been approved after the quality check at our end, your request (i.e. return / exchange) will be processed in accordance with our policies.</p>",
  },
];

export default function ReturnPolicyPage() {
  const lastUpdated = new Date().toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] pb-20">
      <SecondaryHeader
        eyebrow="✦ Return Policy ✦"
        titlePrefix="Returns &"
        titleHighlighted="exchanges"
        titleSuffix="."
        description="How to process a return within the approved 3-day window."
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
