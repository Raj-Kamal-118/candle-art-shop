"use client";

import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

export default function ThemeSwitch() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`relative inline-flex items-center h-8 w-[66px] rounded-full px-1 transition-colors duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 dark:focus-visible:ring-offset-[#0f0e1c] ${
        isDark
          ? "bg-gradient-to-r from-indigo-900 via-[#1a1830] to-[#0f0e1c] shadow-inner shadow-indigo-950/60"
          : "bg-gradient-to-r from-amber-200 via-amber-100 to-cream-100 shadow-inner shadow-amber-200/70"
      }`}
    >
      {/* Track icons */}
      <Sun
        size={14}
        className={`absolute left-2 transition-all duration-500 ${
          isDark
            ? "text-amber-200/30 scale-75"
            : "text-amber-500 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)] scale-100"
        }`}
      />
      <Moon
        size={14}
        className={`absolute right-2 transition-all duration-500 ${
          isDark
            ? "text-indigo-200 drop-shadow-[0_0_6px_rgba(199,210,254,0.7)] scale-100"
            : "text-brown-400/40 scale-75"
        }`}
      />

      {/* Twinkling stars in dark mode */}
      {isDark && (
        <>
          <motion.span
            className="absolute top-1.5 left-3 w-0.5 h-0.5 rounded-full bg-white"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: 0 }}
          />
          <motion.span
            className="absolute bottom-2 left-6 w-[1.5px] h-[1.5px] rounded-full bg-white"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: 0.6 }}
          />
          <motion.span
            className="absolute top-2.5 left-8 w-0.5 h-0.5 rounded-full bg-white"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: 1.1 }}
          />
        </>
      )}

      {/* Sliding knob */}
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`relative z-10 ml-auto inline-flex items-center justify-center w-6 h-6 rounded-full shadow-lg ${
          isDark
            ? "bg-gradient-to-br from-slate-100 to-slate-300"
            : "bg-gradient-to-br from-amber-300 to-coral-400"
        }`}
        style={{ marginLeft: isDark ? "auto" : 0 }}
      >
        <motion.span
          key={theme}
          initial={{ rotate: -180, scale: 0.5, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex"
        >
          {isDark ? (
            <Moon size={14} className="text-indigo-900" />
          ) : (
            <Sun size={14} className="text-white" />
          )}
        </motion.span>

        {/* Pulse halo */}
        <motion.span
          key={`halo-${theme}`}
          initial={{ scale: 0.6, opacity: 0.6 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={`absolute inset-0 rounded-full ${
            isDark ? "bg-indigo-300/40" : "bg-amber-300/60"
          }`}
        />
      </motion.span>
    </button>
  );
}
