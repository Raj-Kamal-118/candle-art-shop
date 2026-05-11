import { Metadata } from "next";
import {
  Package,
  Zap,
  Check,
  Flame,
  Home,
  Ban,
  AlertCircle,
  CreditCard,
  ShieldAlert,
  Phone,
} from "lucide-react";
import SecondaryHeader from "@/components/layout/SecondaryHeader";

export const metadata: Metadata = {
  title: "Shipping, Returns & Refunds",
  description:
    "Artisan House shipping options, delivery zones, return policy, and refund information.",
};

const shippingOptions = [
  {
    Icon: Package,
    name: "Standard Delivery",
    time: "3–5 business days",
    price: "Free over ₹2,499 · ₹149 below",
    desc: "Our default. Hand-packed with a thank-you note.",
  },
  {
    Icon: Zap,
    name: "Express Delivery",
    time: "1–2 business days",
    price: "₹299 flat",
    desc: "For when the moment can't wait.",
  },
];

const journey = [
  {
    Icon: Check,
    label: "Order received",
    desc: "Confirmation within a minute, by email and WhatsApp.",
  },
  {
    Icon: Flame,
    label: "Hand-poured",
    desc: "We pour in batches of six, so customizable pieces take 2–5 days.",
  },
  {
    Icon: Package,
    label: "Wrapped & dispatched",
    desc: "Tissue, kraft, a thank-you note, and a tracking link.",
  },
  {
    Icon: Home,
    label: "Arrives at your door",
    desc: "Standard 3–5 days · Express 1–2 days. We'll WhatsApp you on delivery day.",
  },
];

const zones: Array<[string, string, string]> = [
  ["Varanasi (local)", "1–2 days", "Free over ₹1,499"],
  ["Metro cities", "2–3 days", "Free over ₹2,499"],
  ["Rest of India", "4–7 days", "Free over ₹2,999"],
  ["International", "Not available", "Coming 2026"],
];

const returnSections = [
  {
    Icon: Ban,
    heading: "No Returns, No Exchanges",
    body: `<p>We follow a strict no-return, no-exchange, no-replacement policy for all products. Once a product is purchased and delivered, it cannot be returned, exchanged, or replaced under any circumstances.</p>
<p>This includes but is not limited to: change of mind, personal preference, incorrect product selection, minor handmade variations, delay in delivery, or any other personal reason.</p>
<p>Customers are advised to carefully review product details, dimensions, and photos before placing an order.</p>`,
  },
  {
    Icon: Flame,
    heading: "Handmade Product Disclaimer",
    body: `<p>Our products are handmade and artisan-crafted. Minor variations in color, texture, size, finish, or design may naturally occur. Such variations are part of the handmade process and are <strong>not considered defects</strong> — they are what make each piece unique.</p>`,
  },
  {
    Icon: CreditCard,
    heading: "Refunds — Duplicate Transactions Only",
    body: `<p>Refunds are processed <strong>only</strong> in one case: if a customer is charged more than once for the same order due to a payment gateway error or technical issue.</p>
<p>In such cases, the duplicate transaction will be verified and the excess amount credited to the original payment method within <strong>7–10 business days</strong>. No other refund requests will be accepted.</p>
<p>To raise a duplicate payment refund, email <a href="mailto:artisanhouse.in@gmail.com" class="text-coral-700 dark:text-coral-400 font-semibold hover:underline">artisanhouse.in@gmail.com</a> with your Order ID, Transaction ID, and payment proof.</p>`,
  },
  {
    Icon: AlertCircle,
    heading: "Order Cancellation",
    body: `<p>Orders once placed <strong>cannot be cancelled</strong>. Please review your cart carefully before completing payment.</p>`,
  },
  {
    Icon: ShieldAlert,
    heading: "Limitation of Liability",
    body: `<p>Artisan House shall not be liable for:</p>
<ul class="list-disc pl-5 space-y-1 mt-2">
  <li>Incorrect product selection by the customer</li>
  <li>Handmade variations in products</li>
  <li>Delivery delays caused by logistics partners</li>
  <li>Product misuse</li>
  <li>Any indirect or consequential losses</li>
</ul>
<p>Our total liability shall not exceed the amount paid for the specific order.</p>`,
  },
  {
    Icon: Phone,
    heading: "Contact for Refund Requests",
    body: `<p>For duplicate payment refund requests only:</p>
<p>📞 <a href="tel:+919519486785" class="text-coral-700 dark:text-coral-400 font-semibold hover:underline">+91 95194 86785</a><br/>
📧 <a href="mailto:artisanhouse.in@gmail.com" class="text-coral-700 dark:text-coral-400 font-semibold hover:underline">artisanhouse.in@gmail.com</a></p>
<p>Please include the following in your email:</p>
<ul class="list-disc pl-5 space-y-1 mt-1">
  <li>Order ID</li>
  <li>Transaction ID</li>
  <li>Payment proof (screenshot or bank statement)</li>
</ul>`,
  },
];

export default function ShippingPage() {
  const lastUpdated = new Date().toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] pb-20">
      <SecondaryHeader
        eyebrow="✦ Shipping · Returns · Refunds ✦"
        titlePrefix="Delivered with"
        titleHighlighted="care"
        titleSuffix="."
        description="Every order leaves our studio wrapped in tissue, tucked into recycled kraft, with a hand-written thank-you note. Here's everything about how it reaches you — and our policies."
      />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
        <div className="text-[13px] text-brown-500 dark:text-amber-100/50 mb-8 text-center md:text-left">
          Last updated · {lastUpdated}
        </div>

        {/* Shipping options */}
        <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-amber-700 dark:text-amber-400 mb-4">
          Shipping Options
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {shippingOptions.map(({ Icon, name, time, price, desc }) => (
            <div
              key={name}
              className="bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 rounded-2xl p-6"
            >
              <div className="w-10 h-10 rounded-full bg-coral-100 text-coral-700 flex items-center justify-center mb-4">
                <Icon size={18} />
              </div>
              <h3 className="font-serif text-[22px] font-bold text-brown-900 dark:text-amber-100 mb-1.5">
                {name}
              </h3>
              <div className="text-[13px] text-amber-700 dark:text-amber-400 font-semibold mb-3">
                {time}
              </div>
              <div className="text-sm font-semibold text-brown-900 dark:text-amber-100 mb-2">
                {price}
              </div>
              <p className="text-[13px] text-brown-600 dark:text-amber-100/60 leading-[1.5]">
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* Journey */}
        <div className="bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 rounded-2xl p-8 mb-10">
          <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-amber-700 dark:text-amber-400 mb-5">
            What happens after you order
          </div>
          {journey.map(({ Icon, label, desc }, i) => {
            const last = i === journey.length - 1;
            return (
              <div
                key={label}
                className={`flex gap-4 items-start relative ${last ? "" : "pb-5"}`}
              >
                {!last && (
                  <div className="absolute left-[15px] top-8 bottom-1 w-0.5 bg-cream-200 dark:bg-amber-900/30" />
                )}
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 flex items-center justify-center flex-none">
                  <Icon size={14} />
                </div>
                <div className="flex-1 pt-1.5">
                  <div className="text-[15px] font-semibold text-brown-900 dark:text-amber-100">
                    {label}
                  </div>
                  <div className="text-[13px] text-brown-600 dark:text-amber-100/60 mt-0.5 leading-[1.5]">
                    {desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Delivery zones */}
        <div className="bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 rounded-2xl overflow-hidden mb-12">
          <div className="px-6 py-[18px] border-b border-cream-200 dark:border-amber-900/30 text-[11px] font-semibold tracking-[0.2em] uppercase text-amber-700 dark:text-amber-400">
            Delivery zones
          </div>
          {zones.map((row, i) => {
            const isComing = row[2].startsWith("Coming");
            return (
              <div
                key={row[0]}
                className={`grid grid-cols-[1.5fr_1fr_1.5fr] px-6 py-4 text-sm items-center ${
                  i === 0
                    ? ""
                    : "border-t border-cream-100 dark:border-amber-900/20"
                }`}
              >
                <div className="font-medium text-brown-900 dark:text-amber-100">
                  {row[0]}
                </div>
                <div className="text-brown-600 dark:text-amber-100/60">
                  {row[1]}
                </div>
                <div
                  className={
                    isComing
                      ? "text-brown-400 dark:text-amber-100/40"
                      : "text-brown-700 dark:text-amber-100/80 font-medium"
                  }
                >
                  {row[2]}
                </div>
              </div>
            );
          })}
        </div>

        {/* Returns & Refunds */}
        <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-amber-700 dark:text-amber-400 mb-4">
          Returns &amp; Refunds Policy
        </div>
        <div className="space-y-4">
          {returnSections.map(({ Icon, heading, body }) => (
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
