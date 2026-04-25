"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const MATERIALS = [
  {
    emoji: "🌿",
    name: "Soy wax",
    origin: "Indiana, USA",
    note: "100% natural, GMO-free",
    color: "#15803d",
    image: "/images/ingredients/01-soy.png",
  },
  {
    emoji: "🪶",
    name: "Cotton wicks",
    origin: "Tamil Nadu",
    note: "lead & zinc free",
    color: "#b45309",
    image: "/images/ingredients/02-wicks.png",
  },
  {
    emoji: "💧",
    name: "Fragrance oils",
    origin: "Grasse, France",
    note: "IFRA certified, phthalate-free",
    color: "#c2522a",
    image: "/images/ingredients/03-oils.png",
  },
  {
    emoji: "🏺",
    name: "Ceramic clay",
    origin: "Khurja, UP",
    note: "food-safe, locally fired",
    color: "#7c5c3a",
    image: "/images/ingredients/04-clay.png",
  },
  {
    emoji: "🍶",
    name: "Magnets",
    origin: "Firozabad",
    note: "hand-blown vessels",
    color: "#166534",
    image: "/images/ingredients/05-magnet.png",
  },
];

const LABEL_TILTS = [-5, 7, -4, 6, -6];
const CARD_Y_OFFSETS = [12, -4, 16, -8, 10]; // Flattened slightly to track the string
const CARD_X_OFFSETS = [-12, 16, -12, 16, -12];
const PIN_X_OFFSETS = [-6, 8, 4, -8, 2];
const PIN_Y_OFFSETS = [0, -2, 4, -4, 2];
const PIN_ROTATIONS = [-8, 12, -6, 15, -10]; // Relaxed rotation (gravity pulling the clips)

export default function MaterialsStrip() {
  return (
    <section
      className="bg-[var(--home-bg-alt)] dark:bg-[#1a1612] overflow-hidden"
      style={{
        borderTop: "1px solid var(--home-border)",
        borderBottom: "1px solid var(--home-border)",
        padding: "96px 0",
      }}
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
            ✦ What goes in ✦
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
            Our{" "}
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
                ingredients list
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
            We read the back of the label so you don&rsquo;t have to. Full
            transparency, always.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="relative">
          {/* The Clothesline Thread (Desktop only) */}
          <svg
            className="absolute hidden lg:block w-full h-40 pointer-events-none z-0"
            style={{ top: -20, left: 0 }}
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 1440 160"
          >
            {/* Left hanging string */}
            <path
              d="M 20,10 Q 15,80 25,130"
              fill="none"
              stroke="#6b4423"
              strokeWidth="2.5"
            />
            <path
              d="M 20,10 Q 30,60 10,100"
              fill="none"
              stroke="#6b4423"
              strokeWidth="2.5"
            />

            {/* Right hanging string */}
            <path
              d="M 1420,10 Q 1425,80 1415,130"
              fill="none"
              stroke="#6b4423"
              strokeWidth="2.5"
            />
            <path
              d="M 1420,10 Q 1410,60 1430,100"
              fill="none"
              stroke="#6b4423"
              strokeWidth="2.5"
            />

            {/* Main twine */}
            <path
              d="M 20,10 Q 720,110 1420,10"
              fill="none"
              stroke="#6b4423"
              strokeWidth="3.5"
            />
            {/* Twine twist detail */}
            <path
              d="M 20,10 Q 720,110 1420,10"
              fill="none"
              stroke="#b5835a"
              strokeWidth="2"
              strokeDasharray="6 6"
            />

            {/* Left Pin / Tack */}
            <circle
              cx="20"
              cy="10"
              r="7"
              fill="#cbd5e1"
              stroke="#374151"
              strokeWidth="2"
            />
            <circle cx="18" cy="8" r="2" fill="#ffffff" opacity="0.9" />
            <line
              x1="20"
              y1="10"
              x2="20"
              y2="15"
              stroke="#374151"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Right Pin / Tack */}
            <circle
              cx="1420"
              cy="10"
              r="7"
              fill="#cbd5e1"
              stroke="#374151"
              strokeWidth="2"
            />
            <circle cx="1418" cy="8" r="2" fill="#ffffff" opacity="0.9" />
            <line
              x1="1420"
              y1="10"
              x2="1420"
              y2="15"
              stroke="#374151"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 relative z-10">
            {MATERIALS.map((mat, i) => (
              <motion.div
                key={mat.name}
                initial={{ opacity: 0, y: 40, rotate: 0 }}
                whileInView={{
                  opacity: 1,
                  y: CARD_Y_OFFSETS[i % CARD_Y_OFFSETS.length],
                  x: CARD_X_OFFSETS[i % CARD_X_OFFSETS.length],
                  rotate: LABEL_TILTS[i % LABEL_TILTS.length],
                }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.08,
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                }}
                className="group relative hover:z-10"
                style={{
                  background: "var(--home-card)",
                  borderRadius: 16,
                  padding: "12px 12px 24px",
                  textAlign: "center",
                  border: "1px solid var(--home-border)",
                  boxShadow: "0 12px 32px rgba(28,18,9,.08)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* Cloth Clip (Wooden Clothespin) */}
                <div
                  style={{
                    position: "absolute",
                    top: -20,
                    left: "calc(50% - 8px)",
                    transform: `translate(${PIN_X_OFFSETS[i % PIN_X_OFFSETS.length]}px, ${PIN_Y_OFFSETS[i % PIN_Y_OFFSETS.length]}px) rotate(${PIN_ROTATIONS[i % PIN_ROTATIONS.length]}deg)`,
                    width: 16,
                    height: 42,
                    zIndex: 10,
                  }}
                >
                  {/* Shadow cast by the clip */}
                  <div
                    style={{
                      position: "absolute",
                      top: 14,
                      left: 4,
                      width: 14,
                      height: 40,
                      backgroundColor: "rgba(0,0,0,0.2)",
                      borderRadius: 4,
                      filter: "blur(2px)",
                      transform: "rotate(-2deg)",
                      zIndex: 1,
                    }}
                  />

                  {/* Left Wood Piece */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      width: 7,
                      height: 42,
                      backgroundColor: "#d4a373",
                      backgroundImage:
                        "linear-gradient(to bottom, #e2b98e, #c49052)",
                      borderRadius: "3px 3px 2px 4px",
                      border: "1px solid #a6723e",
                      boxShadow: "inset 1px 1px 1px rgba(255,255,255,0.3)",
                      transform: "rotate(-1deg)",
                      transformOrigin: "center 40%",
                      zIndex: 2,
                    }}
                  />

                  {/* Right Wood Piece */}
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      width: 7,
                      height: 42,
                      backgroundColor: "#d4a373",
                      backgroundImage:
                        "linear-gradient(to bottom, #e2b98e, #c49052)",
                      borderRadius: "3px 3px 4px 2px",
                      border: "1px solid #a6723e",
                      boxShadow: "inset -1px 1px 1px rgba(255,255,255,0.3)",
                      transform: "rotate(1deg)",
                      transformOrigin: "center 40%",
                      zIndex: 2,
                    }}
                  />

                  {/* Metal Spring Wire (Top) */}
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 4,
                      width: 8,
                      height: 8,
                      borderLeft: "2px solid #6b7280",
                      borderTop: "2px solid #6b7280",
                      borderRadius: "4px 0 0 0",
                      zIndex: 3,
                    }}
                  />
                  {/* Metal Spring Coil */}
                  <div
                    style={{
                      position: "absolute",
                      top: 18,
                      left: -3,
                      width: 22,
                      height: 6,
                      backgroundColor: "#9ca3af",
                      borderRadius: 3,
                      border: "1px solid #4b5563",
                      backgroundImage:
                        "linear-gradient(to bottom, #f3f4f6 0%, #9ca3af 40%, #6b7280 100%)",
                      boxShadow:
                        "0 2px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.8)",
                      zIndex: 3,
                    }}
                  />
                </div>

                {/* Polaroid Photo */}
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "1/1",
                    borderRadius: 8,
                    overflow: "hidden",
                    background: "var(--home-accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 48,
                    marginBottom: 12,
                    position: "relative",
                  }}
                >
                  {mat.image ? (
                    <Image
                      src={mat.image}
                      alt={mat.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    mat.emoji
                  )}
                </div>

                <div className="text-center w-full px-1">
                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 18,
                      fontWeight: 700,
                      color: "var(--home-text)",
                      lineHeight: 1.2,
                      marginBottom: 2,
                    }}
                  >
                    {mat.name}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 13,
                      color: "var(--home-amber)",
                      lineHeight: 1.3,
                      marginBottom: 4,
                    }}
                  >
                    {mat.origin}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--home-muted)",
                      lineHeight: 1.4,
                    }}
                  >
                    {mat.note}
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
