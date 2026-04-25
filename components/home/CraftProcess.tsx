"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const STEPS = [
  {
    num: "01",
    title: "We melt.",
    note: "soy wax at 62°C",
    bgLight: "#fef3c7",
    bgDark: "rgba(253,235,180,.07)",
    emoji: "🕯️",
    image: "/images/process/01-melt.png",
  },
  {
    num: "02",
    title: "We scent.",
    note: "fragrance oils, weighed twice",
    bgLight: "#fee2e2",
    bgDark: "rgba(254,226,226,.06)",
    emoji: "🌸",
    image: "/images/process/02-scent.png",
  },
  {
    num: "03",
    title: "We pour.",
    note: "slow, patient, no bubbles",
    bgLight: "#f0fdf4",
    bgDark: "rgba(240,253,244,.05)",
    emoji: "🫙",
    image: "/images/process/03-pour.png",
  },
  {
    num: "04",
    title: "We wait.",
    note: "24 hours of silence",
    bgLight: "#fef9c3",
    bgDark: "rgba(254,249,195,.06)",
    emoji: "⏳",
    image: "/images/process/04-wait.png",
  },
  {
    num: "05",
    title: "We trim.",
    note: "wicks to exactly 6mm",
    bgLight: "#fff7ed",
    bgDark: "rgba(255,247,237,.05)",
    emoji: "✂️",
    image: "/images/process/05-trim.png",
  },
  {
    num: "06",
    title: "We wrap.",
    note: "tissue, twine, a note",
    bgLight: "#fdf4ff",
    bgDark: "rgba(253,244,255,.05)",
    emoji: "🎁",
    image: "/images/process/06-wrap.png",
  },
];

const LABEL_TILTS = [-2, 3, -1, 4, -2, 2];
const CARD_Y_OFFSETS = [16, -12, 20, -16, 12, -20];

export default function CraftProcess() {
  return (
    <section
      className="bg-[var(--home-bg)] dark:bg-[#100e0a] overflow-hidden"
      style={{ borderTop: "1px solid var(--home-border)", padding: "96px 0" }}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p
            style={{
              fontSize: 11,
              letterSpacing: ".24em",
              textTransform: "uppercase",
              color: "var(--home-amber)",
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            ✦ In the studio ✦
          </p>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 900,
              color: "var(--home-text)",
              margin: "0 0 14px",
              lineHeight: 1,
            }}
          >
            How it{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              <span
                className="dark:candle-text-glow"
                style={{
                  fontFamily: "var(--font-script)",
                  fontStyle: "normal",
                  color: "var(--home-coral)",
                  fontWeight: 700,
                  fontSize: "1.08em",
                }}
              >
                actually gets made
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
                  stroke="var(--home-coral)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: 17,
              color: "var(--home-muted)",
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
            A Tuesday in the Artisan House studio. Wax at 62°C. Tea on the side.
          </p>
        </motion.div>

        {/* Journey Grid Container */}
        <div className="relative mx-auto mt-8">
          {/* Global SVG Definitions */}
          <svg width="0" height="0" className="absolute pointer-events-none">
            <defs>
              <marker
                id="drawn-arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path
                  d="M 2 2 L 8 5 L 2 8"
                  fill="none"
                  stroke="var(--home-amber)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </marker>
            </defs>
          </svg>

          {/* Background Hand-Drawn Arrows (Desktop Only) */}
          <div
            className="hidden lg:block absolute inset-0 pointer-events-none z-0"
            style={{ filter: "drop-shadow(1px 2px 2px rgba(180,83,9,0.25))" }}
          >
            {/* 1 -> 2 */}
            <div className="absolute top-[20%] left-[29%] w-[9%] h-[8%] overflow-visible">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 100 100"
              >
                <mask id="mask-arrow-1">
                  <motion.path
                    d="M 0,70 Q 50,-20 100,30"
                    fill="none"
                    stroke="white"
                    strokeWidth="20"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeInOut", delay: 0.4 }}
                  />
                </mask>
                <path
                  d="M 0,70 Q 50,-20 100,30"
                  fill="none"
                  stroke="var(--home-amber)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  markerEnd="url(#drawn-arrow)"
                  mask="url(#mask-arrow-1)"
                />
                <motion.text
                  x="50"
                  y="10"
                  textAnchor="middle"
                  fill="var(--home-amber)"
                  style={{
                    fontFamily: "var(--font-script)",
                    fontSize: "24px",
                    fontWeight: 700,
                  }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  add scent
                </motion.text>
              </svg>
            </div>

            {/* 2 -> 3 */}
            <div className="absolute top-[20%] left-[62.5%] w-[9%] h-[8%] overflow-visible">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 100 100"
              >
                <mask id="mask-arrow-2">
                  <motion.path
                    d="M 0,30 Q 50,-20 100,70"
                    fill="none"
                    stroke="white"
                    strokeWidth="20"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeInOut", delay: 0.6 }}
                  />
                </mask>
                <path
                  d="M 0,30 Q 50,-20 100,70"
                  fill="none"
                  stroke="var(--home-amber)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  markerEnd="url(#drawn-arrow)"
                  mask="url(#mask-arrow-2)"
                />
                <motion.text
                  x="50"
                  y="10"
                  textAnchor="middle"
                  fill="var(--home-amber)"
                  style={{
                    fontFamily: "var(--font-script)",
                    fontSize: "24px",
                    fontWeight: 700,
                  }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  pour slow
                </motion.text>
              </svg>
            </div>

            {/* 3 -> 4 (S-Curve loop back) */}
            <div className="absolute top-[44%] left-[16.6%] w-[66.6%] h-[14%] overflow-visible">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 666 140"
              >
                <mask id="mask-arrow-3">
                  <motion.path
                    d="M 666,20 C 450,20 216,80 0,80"
                    fill="none"
                    stroke="white"
                    strokeWidth="20"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1.5,
                      ease: "easeInOut",
                      delay: 0.4,
                    }}
                  />
                </mask>
                {/* Smooth Bezier curve flowing right-to-left */}
                <path
                  d="M 666,20 C 450,20 216,80 0,80"
                  fill="none"
                  stroke="var(--home-amber)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  markerEnd="url(#drawn-arrow)"
                  mask="url(#mask-arrow-3)"
                />
                <motion.text
                  x="333"
                  y="40"
                  textAnchor="middle"
                  fill="var(--home-amber)"
                  style={{
                    fontFamily: "var(--font-script)",
                    fontSize: "24px",
                    fontWeight: 700,
                  }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  let it set...
                </motion.text>
              </svg>
            </div>

            {/* 4 -> 5 */}
            <div className="absolute top-[72%] left-[29%] w-[9%] h-[8%] overflow-visible">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 100 100"
              >
                <mask id="mask-arrow-4">
                  <motion.path
                    d="M 0,30 Q 50,-20 100,70"
                    fill="none"
                    stroke="white"
                    strokeWidth="20"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeInOut", delay: 0.4 }}
                  />
                </mask>
                <path
                  d="M 0,30 Q 50,-20 100,70"
                  fill="none"
                  stroke="var(--home-amber)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  markerEnd="url(#drawn-arrow)"
                  mask="url(#mask-arrow-4)"
                />
                <motion.text
                  x="50"
                  y="10"
                  textAnchor="middle"
                  fill="var(--home-amber)"
                  style={{
                    fontFamily: "var(--font-script)",
                    fontSize: "24px",
                    fontWeight: 700,
                  }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  trim wick
                </motion.text>
              </svg>
            </div>

            {/* 5 -> 6 */}
            <div className="absolute top-[72%] left-[62.5%] w-[9%] h-[8%] overflow-visible">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 100 100"
              >
                <mask id="mask-arrow-5">
                  <motion.path
                    d="M 0,70 Q 50,-20 100,30"
                    fill="none"
                    stroke="white"
                    strokeWidth="20"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeInOut", delay: 0.6 }}
                  />
                </mask>
                <path
                  d="M 0,70 Q 50,-20 100,30"
                  fill="none"
                  stroke="var(--home-amber)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  markerEnd="url(#drawn-arrow)"
                  mask="url(#mask-arrow-5)"
                />
                <motion.text
                  x="50"
                  y="10"
                  textAnchor="middle"
                  fill="var(--home-amber)"
                  style={{
                    fontFamily: "var(--font-script)",
                    fontSize: "24px",
                    fontWeight: 700,
                  }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  all yours
                </motion.text>
              </svg>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-x-12 lg:gap-y-24 relative z-10">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40, rotate: 0 }}
                whileInView={{
                  opacity: 1,
                  y: CARD_Y_OFFSETS[i],
                  rotate: LABEL_TILTS[i],
                }}
                viewport={{ once: true }}
                transition={{
                  delay: (i % 3) * 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                }}
                className="group relative hover:z-10 w-full max-w-[360px] mx-auto"
                style={{
                  background: "var(--home-card)",
                  padding: "16px 16px 32px",
                  borderRadius: 16,
                  border: "1px solid var(--home-border)",
                  boxShadow: "0 12px 32px rgba(28,18,9,.08)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* Zig-Zag Tape */}
                <div
                  style={{
                    position: "absolute",
                    top: -14,
                    left: "50%",
                    transform: `translateX(-50%) rotate(${i % 2 === 0 ? -3 : 4}deg)`,
                    width: 120,
                    height: 32,
                    background: "rgba(253, 230, 138, 0.4)",
                    backdropFilter: "blur(4px)",
                    boxShadow: "0 2px 4px rgba(28,18,9,0.05)",
                    zIndex: 20,
                    clipPath:
                      "polygon(0% 0%, 100% 0%, 95% 12.5%, 100% 25%, 95% 37.5%, 100% 50%, 95% 62.5%, 100% 75%, 95% 87.5%, 100% 100%, 0% 100%, 5% 87.5%, 0% 75%, 5% 62.5%, 0% 50%, 5% 37.5%, 0% 25%, 5% 12.5%)",
                  }}
                />

                {/* Image box */}
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "4/3",
                    borderRadius: 12,
                    overflow: "hidden",
                    background: "var(--home-accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 72,
                    marginBottom: 24,
                    position: "relative",
                  }}
                >
                  {step.image ? (
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  ) : (
                    step.emoji
                  )}
                </div>

                {/* Label block */}
                <div className="text-center w-full">
                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 48,
                      color: "var(--home-coral)",
                      lineHeight: 1,
                      marginBottom: 6,
                      fontWeight: 700,
                    }}
                  >
                    {step.num}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 22,
                      fontWeight: 600,
                      color: "var(--home-text)",
                      marginBottom: 4,
                      lineHeight: 1.2,
                    }}
                  >
                    {step.title}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontStyle: "italic",
                      fontSize: 14,
                      color: "var(--home-muted)",
                      lineHeight: 1.4,
                    }}
                  >
                    {step.note}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
