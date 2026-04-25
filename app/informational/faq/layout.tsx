import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Got questions about our handcrafted candles, custom orders, shipping, or returns? Find all the answers you need about Artisan House products.",
};

// Mirroring the questions from your page to generate Google FAQ structured data
const faqs = [
  {
    q: "How long does it take to ship an order?",
    a: "Every candle is hand-poured in our Varanasi studio, so we take 2–3 business days to prepare your order before it dispatches. Ready-to-ship items move faster; customizable pieces take a little longer.",
  },
  {
    q: "Can I change my order after placing it?",
    a: "If your order hasn't entered the pouring stage yet, we can usually make changes. Email us at artisanhouse.in@gmail.com with your order number and we'll see what we can do.",
  },
  {
    q: "How do I get the longest burn time?",
    a: "Trim the wick to 5mm before every use, and on the first burn let the wax pool reach the edges of the vessel. This prevents tunnelling and gives you the full 50 hours.",
  },
  {
    q: "Are your candles safe around pets?",
    a: "Yes. We use 100% soy wax, cotton wicks, and phthalate-free fragrance oils. Keep the flame away from curious noses and never leave a lit candle unattended.",
  },
  {
    q: "Why is my candle 'sweating' droplets on top?",
    a: "Soy wax is sensitive to temperature swings. A light dew on the surface is harmless — gently wipe with a soft cloth before lighting.",
  },
  {
    q: "How does the custom candle process work?",
    a: "Start with our Custom Candle designer: pick a vessel, blend up to 3 scents, choose your wick, and add a personal note. We confirm your blend over WhatsApp, pour within 5 business days, and ship with a thank-you card.",
  },
  {
    q: "Can I send you a photo for a custom magnet?",
    a: "Absolutely — that's most of our custom-magnet orders. Upload a clear photo during design, we'll preview the crop, and you approve before we print.",
  },
  {
    q: "Do you ship internationally?",
    a: "Not yet. We ship across India via trusted courier partners. International shipping is on our 2026 roadmap — join our list to hear first.",
  },
  {
    q: "What if my candle arrives damaged?",
    a: "Send a photo to artisanhouse.in@gmail.com within 48 hours of delivery and we'll ship a replacement. No need to return the damaged piece.",
  },
];

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
