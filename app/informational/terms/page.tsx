import { Metadata } from "next";
import {
  Building2,
  UserCheck,
  ShoppingBag,
  Tag,
  CreditCard,
  Truck,
  RefreshCw,
  ImageIcon,
  ShieldAlert,
  AlertTriangle,
  Scale,
  Phone,
} from "lucide-react";
import SecondaryHeader from "@/components/layout/SecondaryHeader";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and Conditions governing your use of artisanhouse.in and the products and services offered by Artisan House.",
};

const sections = [
  {
    Icon: Building2,
    heading: "Business Information",
    body: `<p><strong>Business Name:</strong> Artisan House<br/>
<strong>Managed By:</strong> Shreya Rastogi<br/>
<strong>Registered Address:</strong> K 7/20, Machodri, Shivpur, Lalasur Ki Galli, Varanasi, Uttar Pradesh – 221001, India<br/>
📞 <a href="tel:+919519486785" class="text-coral-700 dark:text-coral-400 font-semibold hover:underline">+91 95194 86785</a><br/>
📧 <a href="mailto:artisanhouse.in@gmail.com" class="text-coral-700 dark:text-coral-400 font-semibold hover:underline">artisanhouse.in@gmail.com</a><br/>
🌐 <a href="https://www.artisanhouse.in" class="text-coral-700 dark:text-coral-400 font-semibold hover:underline">www.artisanhouse.in</a></p>`,
  },
  {
    Icon: UserCheck,
    heading: "Eligibility",
    body: `<p>By using this Website, you confirm that:</p>
<ul class="list-disc pl-5 space-y-1 mt-2">
  <li>You are at least 18 years old</li>
  <li>You are legally capable of entering into a binding contract</li>
  <li>All information provided by you is accurate and complete</li>
</ul>`,
  },
  {
    Icon: ShoppingBag,
    heading: "Products & Services",
    body: `<p>We offer handcrafted and artisan-based products including handmade decor items, artisan crafts, home and lifestyle products, customized handmade products, gift items, and creative merchandise.</p>
<p>Handmade products may have slight variations in color, texture, size, or finish. Product images are for representation purposes only. Availability is subject to stock and artisan production capacity. We reserve the right to modify or discontinue products without prior notice.</p>`,
  },
  {
    Icon: Tag,
    heading: "Pricing",
    body: `<p>All prices are listed in INR (₹) and are subject to change without prior notice. In case of pricing errors, we reserve the right to cancel orders and process refunds if applicable.</p>`,
  },
  {
    Icon: CreditCard,
    heading: "Orders & Payments",
    body: `<p>Orders are confirmed only after successful payment. Payments are processed through secure third-party payment gateways. We do not store debit/credit card details, CVV, UPI PIN, or banking credentials.</p>
<p>We reserve the right to cancel orders due to product unavailability, pricing errors, suspected fraudulent activity, or violation of these Terms.</p>`,
  },
  {
    Icon: Truck,
    heading: "Shipping & Delivery",
    body: `<p>Orders are processed and shipped as per our Shipping Policy.</p>`,
  },
  {
    Icon: RefreshCw,
    heading: "Returns & Refunds",
    body: `<p>Returns and refunds are governed by our Return &amp; Refund Policy. We follow a strict no-return, no-exchange policy. Refunds are only issued for duplicate transactions.</p>`,
  },
  {
    Icon: ImageIcon,
    heading: "Intellectual Property",
    body: `<p>All Website content including logos, product images, artwork, designs, brand elements, and written content is the property of Artisan House and may not be copied or reused without prior written permission.</p>`,
  },
  {
    Icon: ShieldAlert,
    heading: "User Conduct",
    body: `<p>Users agree not to:</p>
<ul class="list-disc pl-5 space-y-1 mt-2">
  <li>Use the Website for unlawful purposes</li>
  <li>Provide false information</li>
  <li>Attempt unauthorized access to any part of the Website</li>
  <li>Interfere with Website functionality</li>
</ul>`,
  },
  {
    Icon: AlertTriangle,
    heading: "Limitation of Liability",
    body: `<p>Artisan House shall not be liable for minor handmade variations in products, delivery delays caused by logistics partners, product misuse, or indirect or consequential damages.</p>
<p>Our total liability shall not exceed the amount paid for the specific order in question.</p>`,
  },
  {
    Icon: Scale,
    heading: "Governing Law & Jurisdiction",
    body: `<p>These Terms shall be governed by the laws of India. All disputes shall be subject to the exclusive jurisdiction of courts in Varanasi, Uttar Pradesh.</p>
<p>We reserve the right to update these Terms at any time. Continued use of the Website after changes constitutes acceptance of the revised Terms.</p>`,
  },
  {
    Icon: Phone,
    heading: "Contact Information",
    body: `<p>For any queries regarding these Terms:<br/>
📞 <a href="tel:+919519486785" class="text-coral-700 dark:text-coral-400 font-semibold hover:underline">+91 95194 86785</a><br/>
📧 <a href="mailto:artisanhouse.in@gmail.com" class="text-coral-700 dark:text-coral-400 font-semibold hover:underline">artisanhouse.in@gmail.com</a></p>`,
  },
];

export default function TermsPage() {
  const lastUpdated = new Date().toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] pb-20">
      <SecondaryHeader
        eyebrow="✦ Terms & Conditions ✦"
        titlePrefix="The"
        titleHighlighted="fine"
        titleSuffix="print."
        description="This document governs your use of artisanhouse.in and the products and services offered by Artisan House. By accessing or using our Website, you agree to be bound by these Terms."
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
                className="text-[15px] leading-[1.7] text-brown-700 dark:text-amber-100/70 [&>p]:mb-4 [&>p:last-child]:mb-0 [&>ul]:text-brown-700 [&>ul]:dark:text-amber-100/70"
                dangerouslySetInnerHTML={{ __html: body }}
              />
            </div>
          ))}
        </div>

        <div className="mt-8 bg-cream-100 dark:bg-[#1a1830] border border-cream-300 dark:border-amber-900/30 rounded-2xl p-6 text-[14px] leading-[1.7] text-brown-800 dark:text-amber-100/80">
          This document is an electronic record in accordance with the
          Information Technology Act, 2000 and applicable rules thereunder, and
          does not require any physical or digital signature.
        </div>
      </div>
    </main>
  );
}
