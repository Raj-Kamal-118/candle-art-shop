"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Youtube, Mail, Phone, MessageCircle } from "lucide-react";
import ArtisanLogo from "@/components/ui/ArtisanLogo";

export default function Footer() {
  return (
    <footer className="text-forest-100 relative overflow-hidden">
      {/* Optimized Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/misc/footer.png"
          alt="Footer background"
          fill
          sizes="100vw"
          className="object-cover opacity-60"
        />
      </div>
      {/* Dark overlay so text stays readable */}
      <div className="absolute inset-0 bg-forest-950/80 z-0" />
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 py-4 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <ArtisanLogo variant="light" />
            <p className="text-sm text-forest-200/80 leading-relaxed mt-6 mb-8 max-w-sm">
              Handcrafted candles, clay art, and creative crafts made with
              intention and delivered with love. Each piece tells a story.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/artisanhouse.in"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-forest-200 hover:bg-coral-600 hover:border-coral-600 hover:text-white transition-all duration-300 hover:-translate-y-1"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://wa.me/919519486785"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-forest-200 hover:bg-coral-600 hover:border-coral-600 hover:text-white transition-all duration-300 hover:-translate-y-1"
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
              <a
                href="https://youtube.com/@artisanhouse_in"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-forest-200 hover:bg-coral-600 hover:border-coral-600 hover:text-white transition-all duration-300 hover:-translate-y-1"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-[11px] font-semibold text-gold-400 uppercase tracking-[0.2em] mb-6">
              Shop
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/products", label: "All Products" },
                {
                  href: "/categories/scented-candles",
                  label: "Scented Candles",
                },
                { href: "/categories/fridge-magnets", label: "Fridge Magnets" },
                { href: "/categories/key-chain", label: "Key chains" },
                { href: "/gift-sets", label: "Gift Sets" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[15px] text-forest-200 hover:text-white transition-colors inline-block hover:translate-x-1 duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-[11px] font-semibold text-gold-400 uppercase tracking-[0.2em] mb-6">
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
                    className="text-[15px] text-forest-200 hover:text-white transition-colors inline-block hover:translate-x-1 duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[11px] font-semibold text-gold-400 uppercase tracking-[0.2em] mb-6">
              Get in Touch
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://instagram.com/artisanhouse.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-[15px] text-forest-200 hover:text-white transition-colors"
                >
                  <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-coral-600 group-hover:border-coral-600 transition-colors flex-shrink-0">
                    <Instagram size={14} />
                  </span>
                  @artisanhouse.in
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919519486785"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-[15px] text-forest-200 hover:text-white transition-colors"
                >
                  <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-coral-600 group-hover:border-coral-600 transition-colors flex-shrink-0">
                    <MessageCircle size={14} />
                  </span>
                  +91 95194 86785
                </a>
              </li>
              <li>
                <a
                  href="mailto:artisanhouse.in@gmail.com"
                  className="group flex items-center gap-3 text-[15px] text-forest-200 hover:text-white transition-colors"
                >
                  <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-coral-600 group-hover:border-coral-600 transition-colors flex-shrink-0">
                    <Mail size={14} />
                  </span>
                  artisanhouse.in@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[13px] text-forest-300/60">
            © {new Date().getFullYear()} Artisan House. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
            <Link
              href="/informational/privacy"
              className="text-[13px] text-forest-300/60 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/informational/terms"
              className="text-[13px] text-forest-300/60 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/admin/login"
              className="text-[13px] text-forest-300/60 hover:text-white transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
