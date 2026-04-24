import type { Metadata } from "next";
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
  title: "Artisan House — Candles | Clays | Crafts",
  description:
    "Discover handcrafted candles, clay art, and creative crafts at Artisan House. Each piece is made with love and intention. Shop at artisanhouse.in",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${lora.variable} ${dancing.variable}`}
    >
      <body>
        <ThemeProvider>
          <Header />
          <main className="pt-28 md:pt-20">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
