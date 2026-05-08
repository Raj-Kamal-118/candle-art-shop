import React from "react";
import { cn } from "@/lib/utils";

interface PrimarySectionHeaderProps {
  eyebrow?: string;
  titlePrefix?: string;
  titleHighlighted: string;
  titleSuffix?: string;
  description?: React.ReactNode;
  highlightColor?: string;
  as?: "h1" | "h2";
  align?: "center" | "left";
  className?: string;
}

export default function PrimarySectionHeader({
  eyebrow,
  titlePrefix,
  titleHighlighted,
  titleSuffix,
  description,
  highlightColor = "var(--home-coral, #d76e60)",
  as: Component = "h2",
  align = "center",
  className,
}: PrimarySectionHeaderProps) {
  const isH1 = Component === "h1";

  return (
    <div
      className={cn(
        "flex flex-col",
        align === "center"
          ? "items-center text-center"
          : "items-start text-left",
        className,
      )}
    >
      {eyebrow && (
        <p
          className="text-[11px] tracking-[0.26em] uppercase dark:text-amber-500 font-semibold mb-3"
          style={{ color: "var(--home-amber, #b45309)" }}
        >
          {eyebrow}
        </p>
      )}
      <Component
        className={cn(
          "font-serif font-black dark:text-amber-50",
          isH1
            ? "text-5xl sm:text-6xl lg:text-7xl leading-tight mb-6"
            : "leading-none mb-4",
        )}
        style={{
          color: isH1
            ? "var(--forest-900, #1a3828)"
            : "var(--home-text, #2d1f14)",
          fontSize: isH1 ? undefined : "clamp(36px, 5vw, 60px)",
        }}
      >
        {titlePrefix && `${titlePrefix} `}
        <span className="relative inline-block">
          <span
            className="dark:candle-text-glow"
            style={{
              fontFamily: "var(--font-script)",
              color: highlightColor,
              fontSize: "1.08em",
              fontWeight: 700,
              fontStyle: "normal",
            }}
          >
            {titleHighlighted}
          </span>
          <svg
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 0,
              bottom: "-2px",
              width: "100%",
              height: "10px",
              overflow: "visible",
            }}
            viewBox="0 0 200 10"
            preserveAspectRatio="none"
          >
            <path
              d="M0,5 C40,0 80,10 120,5 C160,0 190,10 200,5"
              fill="none"
              stroke={highlightColor}
              strokeWidth={isH1 ? "3" : "2.5"}
              strokeLinecap="round"
            />
          </svg>
        </span>
        {titleSuffix && ` ${titleSuffix}`}
      </Component>

      {description && (
        <p
          className={cn(
            "font-serif italic text-[17px] dark:text-amber-100/60 max-w-[520px]",
            align === "center" ? "mx-auto" : "",
            isH1 ? "mb-6" : "",
          )}
          style={{ color: "var(--home-muted, #8a7461)" }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
