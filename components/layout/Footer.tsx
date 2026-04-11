"use client";

import Link from "next/link";
import { Flame, Instagram, Facebook, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brown-900 text-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 font-serif text-2xl font-bold text-white mb-4"
            >
              <Flame className="text-amber-400" size={26} />
              Lumière
            </Link>
            <p className="text-sm text-cream-300 leading-relaxed mb-6">
              Handcrafted candles and bespoke artwork, made with intention and
              delivered with love. Each piece tells a story.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-brown-700 flex items-center justify-center text-cream-300 hover:bg-amber-700 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-brown-700 flex items-center justify-center text-cream-300 hover:bg-amber-700 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-brown-700 flex items-center justify-center text-cream-300 hover:bg-amber-700 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={16} />
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
                { href: "/categories/scented-candles", label: "Scented Candles" },
                { href: "/categories/pillar-candles", label: "Pillar Candles" },
                { href: "/categories/custom-artwork", label: "Custom Artwork" },
                { href: "/categories/gift-sets", label: "Gift Sets" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream-300 hover:text-amber-400 transition-colors"
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
                { href: "#", label: "About Us" },
                { href: "#", label: "Our Story" },
                { href: "#", label: "Sustainability" },
                { href: "#", label: "FAQ" },
                { href: "#", label: "Contact Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream-300 hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Newsletter
            </h3>
            <p className="text-sm text-cream-300 mb-4">
              Join our community for exclusive offers, new arrivals, and
              candle-making tips.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-2"
            >
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2.5 bg-brown-700 border border-brown-600 rounded-lg text-sm text-white placeholder:text-brown-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-700 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
              >
                <Mail size={16} />
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-brown-700 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream-400">
            © {new Date().getFullYear()} Lumière Candle & Art. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-xs text-cream-400 hover:text-amber-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-xs text-cream-400 hover:text-amber-400 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/admin/login"
              className="text-xs text-cream-400 hover:text-amber-400 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
