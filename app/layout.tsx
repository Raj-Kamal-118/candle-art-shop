import type { Metadata } from "next";
// @ts-ignore - Next.js handles CSS bundling automatically
import "./globals.css";
import { Lora, Dancing_Script } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.artisanhouse.in",
  ),
  title: {
    default: "Artisan House — Candles | Clays | Crafts",
    template: "%s | Artisan House",
  },
  description:
    "Discover handcrafted candles, clay art, and creative crafts at Artisan House. Each piece is made with love and intention. Shop at artisanhouse.in",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Artisan House",
    title: "Artisan House — Candles | Clays | Crafts",
    description:
      "Discover handcrafted candles, clay art, and creative crafts at Artisan House.",
    images: [
      {
        url: "/og-image.jpg", // Create a 1200x630 image and place it in the /public folder
        width: 1200,
        height: 630,
        alt: "Artisan House - Handcrafted Candles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Artisan House — Candles | Clays | Crafts",
    description:
      "Discover handcrafted candles, clay art, and creative crafts at Artisan House.",
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Artisan House",
    url: "https://www.artisanhouse.in",
    logo: "https://www.artisanhouse.in/icon.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-95194-86785",
      contactType: "customer service",
      email: "artisanhouse.in@gmail.com",
      availableLanguage: "English",
    },
    sameAs: ["https://www.instagram.com/artisanhouse.in"],
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${lora.variable} ${dancing.variable}`}
    >
      <head></head>
      <body className="bg-cream-50 text-forest-700 dark:bg-[#0a0a16] dark:text-amber-100/70 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <ThemeProvider>
          <Header />
          <main className="pt-28 md:pt-20">{children}</main>
          <Footer />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
