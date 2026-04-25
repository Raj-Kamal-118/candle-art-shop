"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import StickyNote from "@/components/ui/StickyNote";

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

const HandDrawnStars = ({
  rating,
  color = "#b45309",
}: {
  rating: number;
  color?: string;
}) => (
  <div className="flex gap-1.5 mb-4" style={{ color }}>
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={i < rating ? color : "transparent"}
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
        style={{ transform: `rotate(${i % 2 === 0 ? -6 : 5}deg)` }}
      >
        <path d="M12 2 L 14.5 8.5 L 21.5 9 L 16 13.5 L 18 20.5 L 12 16.5 L 6 20.5 L 8 13.5 L 2.5 9 L 9.5 8.5 Z" />
      </svg>
    ))}
  </div>
);

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
                  fontSize: "1.08em",
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
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
                className="w-[92%] sm:w-[90%] mx-auto"
              >
                <div
                  style={{
                    transform: `rotate(${rot}deg)`,
                    zIndex: 1,
                  }}
                >
                  <StickyNote
                    isAbsolute={false}
                    pinColor={pinColor}
                    bgColor="#fef9c3"
                    positionClass="w-full h-full min-h-[220px] !p-6 sm:!p-8"
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
                      className="lucide lucide-quote text-brown-300/40 dark:text-brown-900/20 absolute top-6 right-6"
                      aria-hidden="true"
                    >
                      <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" />
                      <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" />
                    </svg>

                    <HandDrawnStars
                      rating={review.rating || 5}
                      color="#b45309"
                    />

                    <p
                      style={{
                        fontFamily: "var(--font-hand)",
                        fontSize: 22,
                        color: "#2d1f14",
                        lineHeight: 1.35,
                        marginBottom: 18,
                      }}
                    >
                      &ldquo;{review.text}&rdquo;
                    </p>

                    <div
                      style={{
                        borderTop: "1px dashed rgba(67, 44, 26, 0.25)",
                        marginBottom: 16,
                      }}
                    />
                    <p
                      style={{
                        fontSize: 13,
                        lineHeight: 1.4,
                      }}
                    >
                      <span style={{ fontWeight: 700, color: "#92400e" }}>
                        {review.customer_name}
                      </span>
                      {review.location && (
                        <span style={{ color: "rgba(67, 44, 26, 0.7)" }}>
                          <span style={{ margin: "0 6px", opacity: 0.5 }}>
                            ·
                          </span>
                          {review.location}
                        </span>
                      )}
                      {review.product_name && (
                        <span style={{ color: "rgba(67, 44, 26, 0.7)" }}>
                          <span style={{ margin: "0 6px", opacity: 0.5 }}>
                            ·
                          </span>
                          <Link
                            href={`/products/${review.product_name
                              .toLowerCase()
                              .replace(/[^\w\s-]/g, "")
                              .replace(/[\s_-]+/g, "-")
                              .replace(/^-+|-+$/g, "")}`}
                            className="italic underline underline-offset-2 font-medium text-amber-700 hover:text-coral-600 transition-colors"
                          >
                            {review.product_name}
                          </Link>
                        </span>
                      )}
                    </p>
                  </StickyNote>
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
            className="inline-flex items-center justify-center gap-2 bg-coral-600 dark:bg-amber-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-coral-700 dark:hover:bg-amber-500 transition-all duration-200 shadow-lg shadow-coral-200 dark:shadow-amber-900/30 hover:-translate-y-0.5 text-sm"
          >
            Read all reviews →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
