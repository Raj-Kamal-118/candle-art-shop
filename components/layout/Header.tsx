"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingCart,
  Heart,
  Search,
  Menu,
  X,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import ArtisanLogo from "@/components/ui/ArtisanLogo";
import ThemeSwitch from "@/components/layout/ThemeSwitch";

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
    { href: "/categories/fridge-magnets", label: "Magnet" },
    { href: "/categories/gift-sets", label: "Gift Sets" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-[#0a0a16]/95 backdrop-blur-md shadow-sm dark:shadow-amber-900/10"
          : "bg-white/80 dark:bg-[#0a0a16]/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-24 md:h-20">
          <div className="scale-[0.85] md:scale-100 origin-left flex-shrink-0 -mt-4">
            <ArtisanLogo />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-coral-600 dark:hover:text-amber-400 ${
                  pathname === link.href
                    ? "text-coral-600 dark:text-amber-400 border-b-2 border-coral-500 dark:border-amber-500 pb-0.5"
                    : "text-forest-700 dark:text-amber-100/70"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1 lg:gap-2">
            {/* Theme flip-switch — visually separated from icon actions */}
            <ThemeSwitch />
            <span
              aria-hidden
              className="hidden lg:block mx-1 h-6 w-px bg-cream-300 dark:bg-amber-900/40"
            />

            {/* Search, Account, Favorites — desktop only; mobile uses the drawer */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden lg:inline-flex p-2 text-forest-600 dark:text-amber-100/70 hover:text-coral-600 dark:hover:text-amber-400 transition-colors rounded-full hover:bg-coral-50 dark:hover:bg-amber-900/30"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <Link
              href="/account"
              className="hidden lg:inline-flex p-2 text-forest-600 dark:text-amber-100/70 hover:text-coral-600 dark:hover:text-amber-400 transition-colors rounded-full hover:bg-coral-50 dark:hover:bg-amber-900/30"
              aria-label="My Account"
            >
              <User size={20} />
            </Link>

            <Link
              href="/favorites"
              className="hidden lg:inline-flex relative p-2 text-forest-600 dark:text-amber-100/70 hover:text-coral-600 dark:hover:text-amber-400 transition-colors rounded-full hover:bg-coral-50 dark:hover:bg-amber-900/30"
              aria-label="Favorites"
            >
              <Heart size={20} />
              {favCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-coral-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {favCount}
                </span>
              )}
            </Link>

            {/* Cart — always visible */}
            <Link
              href="/cart"
              className="relative p-2 text-forest-600 dark:text-amber-100/70 hover:text-coral-600 dark:hover:text-amber-400 transition-colors rounded-full hover:bg-coral-50 dark:hover:bg-amber-900/30"
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-coral-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-forest-600 dark:text-amber-100/70 hover:text-coral-600 dark:hover:text-amber-400 transition-colors rounded-full hover:bg-coral-50 dark:hover:bg-amber-900/30"
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
                    placeholder="Search candles, clay art, gift sets..."
                    autoFocus
                    className="w-full px-4 py-2.5 bg-forest-50 dark:bg-[#1a1830] border border-forest-200 dark:border-amber-900/40 rounded-lg text-sm dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-coral-400 dark:focus:ring-amber-500 focus:border-transparent placeholder:text-forest-400 dark:placeholder:text-amber-100/30"
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
            className="lg:hidden overflow-hidden bg-white dark:bg-[#0f0e1c] border-t border-forest-100 dark:border-amber-900/20"
          >
            <nav className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-coral-50 dark:bg-amber-900/30 text-coral-700 dark:text-amber-300"
                      : "text-forest-700 dark:text-amber-100/70 hover:bg-forest-50 dark:hover:bg-amber-900/20"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-2 pt-3 border-t border-cream-200 dark:border-amber-900/30 grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setSearchOpen(true);
                  }}
                  className="flex flex-col items-center gap-1 px-2 py-3 rounded-lg text-forest-700 dark:text-amber-100/70 hover:bg-forest-50 dark:hover:bg-amber-900/20"
                >
                  <Search size={18} />
                  <span className="text-xs font-medium">Search</span>
                </button>
                <Link
                  href="/account"
                  onClick={() => setMenuOpen(false)}
                  className="flex flex-col items-center gap-1 px-2 py-3 rounded-lg text-forest-700 dark:text-amber-100/70 hover:bg-forest-50 dark:hover:bg-amber-900/20"
                >
                  <User size={18} />
                  <span className="text-xs font-medium">Account</span>
                </Link>
                <Link
                  href="/favorites"
                  onClick={() => setMenuOpen(false)}
                  className="relative flex flex-col items-center gap-1 px-2 py-3 rounded-lg text-forest-700 dark:text-amber-100/70 hover:bg-forest-50 dark:hover:bg-amber-900/20"
                >
                  <Heart size={18} />
                  <span className="text-xs font-medium">Favorites</span>
                  {favCount > 0 && (
                    <span className="absolute top-1.5 right-4 w-4 h-4 bg-coral-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                      {favCount}
                    </span>
                  )}
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
