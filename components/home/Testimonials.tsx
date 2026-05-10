"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MessageSquare, ArrowRight } from "lucide-react";
import StickyNote from "@/components/ui/StickyNote";
import PrimarySectionHeader from "@/components/ui/PrimarySectionHeader";
import HandDrawnStars from "@/components/ui/HandDrawnStars";

export interface Review {
  id?: string;
  customer_name?: string;
  name?: string;
  location?: string;
  rating?: number;
  text?: string;
  product_name?: string;
  image_url?: string | null;
  date?: string;
  tilt?: number;
  color?: string;
  pinColor?: string;
}

const CARD_ROTATIONS = [-3, 5, -2, 4, -4, 3];
const MARGIN_TOPS = [0, -16, 0, -12, 0, -8];

const NOTE_ROTATIONS = [-4, 3, -2, 5, -1, 4, -3, 2, -5, 1];
const BG_COLORS = [
  "#fef3c7",
  "#e0f2fe",
  "#dcfce7",
  "#fee2e2",
  "#f3e8ff",
  "#ffedd5",
];
const PIN_COLORS = [
  "#d97706",
  "#0284c7",
  "#16a34a",
  "#e85d4a",
  "#7c3aed",
  "#f97316",
];

export default function Testimonials({
  reviews = [],
  titlePrefix = "Stories of",
  titleHighlighted = "warmth",
  eyebrow = "✦ Letters, notes, thank-yous ✦",
  description = "From the people who let us into their homes, their mornings, and their Tuesdays.",
  className = "bg-[var(--home-bg)] dark:bg-[#100e0a] overflow-hidden",
  style = { borderTop: "1px solid var(--home-border)", padding: "96px 0" },
  averageRating = 4.8,
  totalReviews = 10,
  showHeaderDetails = false,
  limit = 6,
}: {
  reviews?: Review[];
  titlePrefix?: string;
  titleHighlighted?: string;
  eyebrow?: string;
  description?: string;
  className?: string;
  style?: React.CSSProperties;
  averageRating?: number;
  totalReviews?: number;
  showHeaderDetails?: boolean;
  limit?: number;
}) {
  const displayReviews = reviews.slice(0, limit);

  if (displayReviews.length === 0) return null;

  return (
    <section className={className} style={style}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        {/* Header */}
        {showHeaderDetails ? (
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-10">
            <div>
              <p
                className="text-coral-600 dark:text-amber-400 uppercase tracking-[0.18em] text-[11px] font-bold mb-1"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {eyebrow}
              </p>
              <h2
                className="text-brown-900 dark:text-amber-100 leading-tight font-bold"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(28px,3.5vw,42px)",
                }}
              >
                {titlePrefix}{" "}
                <span style={{ position: "relative", display: "inline-block" }}>
                  <span
                    className="text-coral-600 dark:text-amber-400"
                    style={{
                      fontFamily: "var(--font-script)",
                      fontSize: "clamp(34px,4.5vw,52px)",
                    }}
                  >
                    {titleHighlighted}
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
                </span>
              </h2>
            </div>
            <div className="sm:ml-auto flex items-center gap-3 pb-1">
              <HandDrawnStars rating={averageRating} size={18} />
              <span
                className="text-brown-500 dark:text-amber-100/70"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontSize: 13,
                }}
              >
                {averageRating} average · {totalReviews} reviews
              </span>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <PrimarySectionHeader
              eyebrow={eyebrow}
              titlePrefix={titlePrefix}
              titleHighlighted={titleHighlighted}
              description={description}
              className="mb-16"
            />
          </motion.div>
        )}

        {/* Pinned wall grid */}
        <div
          className={
            showHeaderDetails
              ? "grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 pt-6"
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 items-start"
          }
        >
          {displayReviews.map((review, i) => {
            const hashStr =
              review.id ||
              review.name ||
              review.customer_name ||
              review.text ||
              String(i);
            const hash = Math.abs(
              hashStr
                .split("")
                .reduce((a, c) => c.charCodeAt(0) + ((a << 5) - a), 0),
            );
            const colorIdx = hash % BG_COLORS.length;

            const rot =
              review.tilt ??
              (showHeaderDetails
                ? NOTE_ROTATIONS[i % NOTE_ROTATIONS.length]
                : CARD_ROTATIONS[i % CARD_ROTATIONS.length]);
            const mt = showHeaderDetails
              ? 0
              : MARGIN_TOPS[i % MARGIN_TOPS.length];
            const color = review.color ?? BG_COLORS[colorIdx];
            const pinColor = review.pinColor ?? PIN_COLORS[colorIdx];
            const name = review.name ?? review.customer_name;
            const rating = review.rating || 5;

            return (
              <motion.div
                key={review.id || i}
                initial={{ opacity: 0, y: showHeaderDetails ? 16 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.35,
                  delay: showHeaderDetails ? i * 0.08 : (i % 3) * 0.12,
                }}
                style={{
                  marginTop: mt,
                  transform: `rotate(${rot}deg)`,
                  transformOrigin: "center top",
                  zIndex: showHeaderDetails ? undefined : 1,
                }}
                className={
                  showHeaderDetails ? "" : "w-[92%] sm:w-[90%] mx-auto"
                }
              >
                <StickyNote
                  isAbsolute={false}
                  showPin={true}
                  pinColor={pinColor}
                  bgColor={color}
                  positionClass={
                    showHeaderDetails
                      ? "w-full"
                      : "w-full h-full min-h-[220px] !p-6 sm:!p-8"
                  }
                >
                  {!showHeaderDetails && (
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
                  )}

                  {/* Stars */}
                  {showHeaderDetails ? (
                    <div className="mb-2 mt-1">
                      <HandDrawnStars rating={rating} size={14} />
                    </div>
                  ) : (
                    <HandDrawnStars
                      rating={rating}
                      size={18}
                      className="mb-4"
                    />
                  )}

                  <p
                    className={
                      showHeaderDetails
                        ? ""
                        : "text-[22px] text-[#2d1f14] leading-[1.35] mb-[18px]"
                    }
                    style={{
                      fontFamily: "var(--font-hand)",
                      fontSize: showHeaderDetails ? 17 : undefined,
                      color: showHeaderDetails ? "#451a03" : undefined,
                      lineHeight: showHeaderDetails ? 1.5 : undefined,
                    }}
                  >
                    {showHeaderDetails ? review.text : `“${review.text}”`}
                  </p>

                  {/* Footer */}
                  {showHeaderDetails ? (
                    <div className="mt-3 pt-2.5 border-t border-amber-300/40 flex items-end justify-between">
                      <div>
                        <p
                          style={{
                            fontFamily: "var(--font-hand)",
                            fontSize: 18,
                            color: "#78350f",
                            fontWeight: 700,
                          }}
                        >
                          {name}
                        </p>
                        {review.location && (
                          <p
                            style={{
                              fontFamily: "var(--font-hand)",
                              fontSize: 16,
                              color: "#92400e",
                              opacity: 0.7,
                            }}
                          >
                            {review.location}
                          </p>
                        )}
                      </div>
                      {review.date && (
                        <span
                          style={{
                            fontFamily: "var(--font-hand)",
                            fontSize: 16,
                            color: "#92400e",
                            opacity: 0.6,
                          }}
                        >
                          {review.date}
                        </span>
                      )}
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          borderTop: "1px dashed rgba(67, 44, 26, 0.25)",
                          marginBottom: 16,
                        }}
                      />
                      <p
                        className="text-[18px] leading-[1.4]"
                        style={{ fontFamily: "var(--font-hand)" }}
                      >
                        <span style={{ fontWeight: 700, color: "#92400e" }}>
                          {name}
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
                                ?.toLowerCase()
                                .replace(/[^\w\s-]/g, "")
                                .replace(/[\s_-]+/g, "-")
                                .replace(/^-+|-+$/g, "")}`}
                              className="underline underline-offset-2 font-bold text-amber-700 hover:text-coral-600 transition-colors"
                            >
                              {review.product_name}
                            </Link>
                          </span>
                        )}
                      </p>
                    </>
                  )}
                </StickyNote>
              </motion.div>
            );
          })}
        </div>

        {/* Read all link */}
        {showHeaderDetails ? (
          <div className="mt-10 flex items-center gap-4">
            <Link
              href="/reviews"
              className="inline-flex items-center gap-2 text-sm font-semibold text-coral-600 dark:text-amber-400 hover:underline"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              <MessageSquare size={14} />
              Read all {totalReviews} reviews
              <ArrowRight size={13} />
            </Link>
          </div>
        ) : (
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
        )}
      </div>
    </section>
  );
}
