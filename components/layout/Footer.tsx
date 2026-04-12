"use client";

import Link from "next/link";
import { Instagram, Youtube, Mail, Phone, MessageCircle } from "lucide-react";
import ArtisanLogo from "@/components/ui/ArtisanLogo";

export default function Footer() {
  return (
    <footer
      className="text-forest-100 relative"
      style={{
        backgroundImage:
          "url('https://pub-1f6a6fc4e92548b987db5dbea7cd456e.r2.dev/candle-art-shop-images/Asset/Gemini_Generated_Image_wjh0jbwjh0jbwjh0.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay so text stays readable */}
      <div className="absolute inset-0 bg-forest-950/80" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <ArtisanLogo />
            <p className="text-sm text-forest-300 leading-relaxed my-4">
              Handcrafted candles, clay art, and creative crafts made with
              intention and delivered with love. Each piece tells a story.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/artisanhouse.in"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-forest-700 flex items-center justify-center text-forest-300 hover:bg-coral-600 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://wa.me/918009170754"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-forest-700 flex items-center justify-center text-forest-300 hover:bg-coral-600 hover:text-white transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={16} />
              </a>
              <a
                href="https://youtube.com/@artisanhouse_in"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-forest-700 flex items-center justify-center text-forest-300 hover:bg-coral-600 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Shop
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/products", label: "All Products" },
                {
                  href: "/categories/scented-candles",
                  label: "Scented Candles",
                },
                { href: "/categories/pillar-candles", label: "Pillar Candles" },
                { href: "/categories/custom-artwork", label: "Clay Art" },
                { href: "/categories/gift-sets", label: "Gift Sets" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-forest-300 hover:text-gold-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Information
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/informational/about", label: "About Us" },
                { href: "/informational/faq", label: "FAQ" },
                { href: "/informational/shipping", label: "Shipping Policy" },
                { href: "/informational/returns", label: "Returns & Refunds" },
                { href: "/informational/contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-forest-300 hover:text-gold-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Get in Touch
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://instagram.com/artisanhouse.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-forest-300 hover:text-gold-400 transition-colors"
                >
                  <Instagram size={14} className="flex-shrink-0" />
                  artisanhouse.in
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/918009170754"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-forest-300 hover:text-gold-400 transition-colors"
                >
                  <MessageCircle size={14} className="flex-shrink-0" />
                  8009170754
                </a>
              </li>
              <li>
                <a
                  href="tel:+918009170754"
                  className="flex items-center gap-2.5 text-sm text-forest-300 hover:text-gold-400 transition-colors"
                >
                  <Phone size={14} className="flex-shrink-0" />
                  8009170754
                </a>
              </li>
              <li>
                <a
                  href="mailto:artisanhouse.in@gmail.com"
                  className="flex items-center gap-2.5 text-sm text-forest-300 hover:text-gold-400 transition-colors"
                >
                  <Mail size={14} className="flex-shrink-0" />
                  artisanhouse.in@gmail.com
                </a>
              </li>
            </ul>

            <div className="mt-6 pt-6 border-t border-forest-700">
              <p className="text-xs text-forest-400 mb-1">
                Buy our products at
              </p>
              <a
                href="https://www.artisanhouse.in"
                className="text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors"
              >
                www.artisanhouse.in
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-forest-700 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-forest-400">
            © {new Date().getFullYear()} Artisan House. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/informational/privacy"
              className="text-xs text-forest-400 hover:text-gold-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/informational/terms"
              className="text-xs text-forest-400 hover:text-gold-400 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/admin/login"
              className="text-xs text-forest-400 hover:text-gold-400 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
