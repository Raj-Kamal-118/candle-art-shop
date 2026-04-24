"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Star } from "lucide-react";

interface Review {
  id: string;
  customer_name: string;
  location: string;
  rating: number;
  text: string;
  product_name: string;
  image_url: string | null;
}

const CARD_ROTATIONS = [-3, 5, -2, 4, -4, 3];
const MARGIN_TOPS = [0, -16, 0, -12, 0, -8];

const PIN_COLORS = [
  "#ef4444", // Red
  "#3b82f6", // Blue
  "#eab308", // Yellow
  "#10b981", // Green
  "#a855f7", // Purple
  "#f97316", // Orange
];

export default function Testimonials({ reviews = [] }: { reviews?: Review[] }) {
  const displayReviews = reviews.slice(0, 6);

  if (displayReviews.length === 0) return null;

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
            ✦ Letters, notes, thank-yous ✦
          </p>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 900,
              color: "var(--home-text)",
              margin: "0 0 14px",
              letterSpacing: "-.025em",
              lineHeight: 1,
            }}
          >
            Stories of{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              <span
                className="dark:candle-text-glow"
                style={{
                  fontFamily: "var(--font-script)",
                  fontStyle: "normal",
                  color: "var(--home-coral)",
                  fontWeight: 700,
                  fontSize: "1.1em",
                }}
              >
                warmth
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
            From the people who let us into their homes, their mornings, and
            their Tuesdays.
          </p>
        </motion.div>

        {/* Pinned wall grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {displayReviews.map((review, i) => {
            const rot = CARD_ROTATIONS[i % CARD_ROTATIONS.length];
            const mt = MARGIN_TOPS[i % MARGIN_TOPS.length];
            const pinColor = PIN_COLORS[i % PIN_COLORS.length];

            return (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.12 }}
                style={{ marginTop: mt }}
              >
                {/* Card */}
                <div
                  style={{
                    background: "var(--home-card)",
                    border: "1px solid var(--home-border)",
                    borderRadius: 12,
                    boxShadow:
                      "0 4px 16px rgba(28,18,9,.07), 0 1px 4px rgba(28,18,9,.05)",
                    transform: `rotate(${rot}deg)`,
                    padding: "28px 24px 24px",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-quote text-amber-100 dark:text-amber-900/40 absolute top-6 right-6"
                    aria-hidden="true"
                  >
                    <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" />
                    <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" />
                  </svg>

                  {/* Thumb Pin */}
                  <div
                    style={{
                      position: "absolute",
                      top: -10,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 24,
                      height: 24,
                      zIndex: 10,
                    }}
                  >
                    {/* Shadow cast by the pin */}
                    <div
                      style={{
                        position: "absolute",
                        top: 14,
                        left: 12,
                        width: 12,
                        height: 12,
                        backgroundColor: "rgba(0,0,0,0.25)",
                        borderRadius: "50%",
                        transform: "translate(4px, 4px)",
                        filter: "blur(2px)",
                        zIndex: 1,
                      }}
                    />

                    {/* Pin Base Rim */}
                    <div
                      style={{
                        position: "absolute",
                        top: 2,
                        left: 2,
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        backgroundColor: pinColor,
                        backgroundImage:
                          "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.2) 100%)",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        zIndex: 2,
                      }}
                    />

                    {/* Pin Handle / Stem */}
                    <div
                      style={{
                        position: "absolute",
                        top: 5,
                        left: 5,
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        backgroundColor: pinColor,
                        backgroundImage:
                          "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.4) 100%)",
                        boxShadow:
                          "0 3px 5px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.6)",
                        zIndex: 3,
                      }}
                    >
                      {/* Specular Highlight */}
                      <div
                        style={{
                          position: "absolute",
                          top: 2,
                          left: 2,
                          width: 3,
                          height: 3,
                          backgroundColor: "#fff",
                          borderRadius: "50%",
                          filter: "blur(0.5px)",
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-1 mb-4 text-amber-400">
                    {[...Array(review.rating || 5)].map((_, index) => (
                      <Star key={index} size={14} className="fill-current" />
                    ))}
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontStyle: "italic",
                      fontSize: 15,
                      color: "var(--home-text)",
                      lineHeight: 1.65,
                      marginBottom: 20,
                    }}
                  >
                    <span
                      style={{
                        color: "var(--home-coral)",
                        fontSize: "1.4em",
                        fontWeight: 900,
                        marginRight: 2,
                      }}
                    >
                      &ldquo;
                    </span>
                    {review.text}
                    <span
                      style={{
                        color: "var(--home-coral)",
                        fontSize: "1.4em",
                        fontWeight: 900,
                        marginLeft: 2,
                      }}
                    >
                      &rdquo;
                    </span>
                  </p>
                  <div
                    style={{
                      borderTop: "1px solid var(--home-border)",
                      marginBottom: 16,
                    }}
                  />
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: 13,
                      color: "var(--home-amber)",
                      marginBottom: 3,
                    }}
                  >
                    {review.customer_name}
                  </p>
                  {(review.location || review.product_name) && (
                    <p
                      style={{
                        fontSize: 11,
                        color: "var(--home-muted)",
                        lineHeight: 1.4,
                      }}
                    >
                      {review.location && <span>{review.location}</span>}
                      {review.location && review.product_name && (
                        <span style={{ margin: "0 6px", opacity: 0.5 }}>·</span>
                      )}
                      {review.product_name && (
                        <span style={{ fontStyle: "italic" }}>
                          {review.product_name}
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Read all link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-14"
        >
          <Link
            href="/reviews"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              border: "1.5px solid var(--home-amber)",
              color: "var(--home-amber)",
              borderRadius: 999,
              padding: "10px 28px",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              letterSpacing: ".02em",
            }}
          >
            Read all reviews →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
