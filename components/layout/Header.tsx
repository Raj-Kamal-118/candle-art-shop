"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, Heart, Search, Menu, X, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const cartCount = useStore((s) => s.cartCount());
  const favCount = useStore((s) => s.favoriteItems.length);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Shop" },
    { href: "/categories/scented-candles", label: "Candles" },
    { href: "/categories/custom-artwork", label: "Artwork" },
    { href: "/categories/gift-sets", label: "Gift Sets" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-serif text-xl font-bold text-brown-900 hover:text-amber-700 transition-colors"
          >
            <Flame className="text-amber-600" size={24} />
            <span>Lumière</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-amber-700 ${
                  pathname === link.href
                    ? "text-amber-700 border-b-2 border-amber-600 pb-0.5"
                    : "text-brown-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-brown-600 hover:text-amber-700 transition-colors rounded-full hover:bg-amber-50"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Favorites */}
            <Link
              href="/favorites"
              className="relative p-2 text-brown-600 hover:text-amber-700 transition-colors rounded-full hover:bg-amber-50"
              aria-label="Favorites"
            >
              <Heart size={20} />
              {favCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {favCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-brown-600 hover:text-amber-700 transition-colors rounded-full hover:bg-amber-50"
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-brown-600 hover:text-amber-700 transition-colors rounded-full hover:bg-amber-50"
              aria-label="Menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pb-3">
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search candles, artwork, gift sets..."
                    autoFocus
                    className="w-full px-4 py-2.5 bg-cream-100 border border-cream-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent placeholder:text-brown-400"
                  />
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-white border-t border-cream-200"
          >
            <nav className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-amber-50 text-amber-700"
                      : "text-brown-700 hover:bg-cream-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
