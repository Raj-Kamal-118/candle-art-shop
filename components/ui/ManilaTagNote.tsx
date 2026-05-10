"use client";

import React from "react";
import { motion } from "framer-motion";

interface ManilaTagNoteProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
}

export default function ManilaTagNote({
  title,
  icon,
  children,
  delay = 0,
}: ManilaTagNoteProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30, rotate: 0 }}
      whileInView={{ opacity: 1, x: 0, rotate: 0 }}
      whileHover={{ y: -4, rotate: 1.5 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay }}
      className="relative w-full group origin-left transition-all duration-300 drop-shadow-[2px_4px_8px_rgba(45,31,20,0.08)] hover:drop-shadow-[6px_12px_24px_rgba(45,31,20,0.15)] dark:drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] dark:hover:drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
    >
      <div
        className="relative flex items-stretch w-full bg-gradient-to-br from-white from-80% to-[#f0e8d5] dark:from-[#2e2823] dark:from-80% dark:to-[#1e1914] rounded-r-md overflow-hidden"
        style={{
          clipPath:
            "polygon(16px 0, 100% 0, 100% 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)",
        }}
      >
        <div className="w-10 flex flex-col justify-center items-center py-4 relative border-r border-dashed border-[rgba(122,80,40,0.15)] dark:border-amber-900/40">
          <div className="relative w-3.5 h-3.5 rounded-full bg-[var(--home-bg-alt)] dark:bg-[#1a1612] shadow-[inset_1px_2px_3px_rgba(67,44,26,0.3),0_1px_1px_rgba(255,255,255,0.6)] dark:shadow-[inset_1px_2px_3px_rgba(0,0,0,0.6),0_1px_1px_rgba(255,255,255,0.05)] border border-[rgba(122,80,40,0.15)] dark:border-amber-900/30 z-20">
            {/* Faux twine loop */}
            <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-[10px] w-6 h-6 border-2 border-transparent border-l-[#a87954] dark:border-l-[#8a6345] rounded-full opacity-80 -rotate-[20deg] pointer-events-none drop-shadow-[0_1px_1.5px_rgba(67,44,26,0.5)] dark:drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.8)]" />
          </div>
        </div>
        <div className="flex-1 p-5 relative overflow-hidden z-20">
          {/* Subtle paper texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                "url('https://www.transparenttextures.com/patterns/cream-paper.png')",
            }}
          />

          <div className="relative z-10 flex items-center gap-2 mb-2">
            {icon}
            <h4 className="font-serif font-bold text-brown-900 dark:text-amber-100 text-[14px] tracking-[0.1em] uppercase drop-shadow-sm">
              {title}
            </h4>
          </div>
          <div
            className="relative z-10 text-brown-800 dark:text-amber-100/90 leading-relaxed [&_strong]:text-coral-600 [&_strong]:dark:text-amber-400 [&_strong]:font-bold"
            style={{ fontFamily: "var(--font-hand)", fontSize: 19 }}
          >
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
