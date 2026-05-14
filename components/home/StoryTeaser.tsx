"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";

export default function StoryTeaser() {
  return (
    <section className="py-8 bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 dark:from-[#2a1310] dark:via-[#24120a] dark:to-[#1a1612] border-y border-dashed border-red-200/60 dark:border-red-900/30 relative overflow-hidden z-10">
      {/* Subtle felt texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.02] mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/felt.png')",
        }}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="hidden md:flex w-14 h-14 bg-red-100 dark:bg-red-900/40 rounded-full items-center justify-center shrink-0 shadow-sm border border-red-200 dark:border-red-800/40">
              <Heart
                size={24}
                className="text-red-500 dark:text-red-400 fill-red-200 dark:fill-red-900/40"
              />
            </div>
            <div>
              <p
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-700 dark:text-red-400 mb-1"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                ✦ Behind the scenes ✦
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-brown-900 dark:text-amber-100 mb-1 leading-tight">
                Curious how the{" "}
                <span style={{ position: "relative", display: "inline-block" }}>
                  <span
                    className="text-coral-600 dark:text-amber-400 inline-block -rotate-2"
                    style={{
                      fontFamily: "var(--font-script)",
                      fontSize: "1.1em",
                    }}
                  >
                    magic
                  </span>
                  <svg
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: 0,
                      bottom: -4,
                      width: "100%",
                      height: 12,
                      overflow: "visible",
                    }}
                    viewBox="0 0 200 12"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,6 C30,0 60,12 100,6 C140,0 170,12 200,6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="text-coral-600 dark:text-amber-400"
                    />
                  </svg>
                </span>{" "}
                happens?
              </h2>
              <p className="font-serif italic text-sm text-brown-600 dark:text-amber-100/70 max-w-2xl leading-relaxed hidden md:block">
                From melting wax at 62°C to hand-painting clay magnets, every
                piece has a story before it even reaches you.
              </p>
            </div>
          </div>
          <div className="shrink-0 w-full md:w-auto">
            <Link
              href="/informational/about"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-white/80 dark:bg-[#1a1830]/80 backdrop-blur-sm border border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-200 px-6 py-3 rounded-xl font-bold hover:bg-white dark:hover:bg-[#242040] hover:text-red-600 dark:hover:text-red-400 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 text-sm uppercase tracking-wide"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Step into our studio <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
