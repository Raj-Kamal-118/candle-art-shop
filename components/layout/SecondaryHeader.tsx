import React from "react";
import Image from "next/image";

interface SecondaryHeaderProps {
  eyebrow: string;
  titlePrefix?: string;
  titleHighlighted: string;
  titleSuffix?: string;
  description: React.ReactNode;
  backgroundImage?: string;
}

export default function SecondaryHeader({
  eyebrow,
  titlePrefix,
  titleHighlighted,
  titleSuffix,
  description,
  backgroundImage = "/images/misc/checkout.png",
}: SecondaryHeaderProps) {
  return (
    <section className="relative overflow-hidden text-center p-8 border-b border-cream-200 dark:border-amber-900/20 flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Header Background"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-black/25 dark:bg-black/40" />
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6">
        <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-[0.24em] drop-shadow-sm">
          {eyebrow}
        </p>
        <h1 className="font-serif text-6xl font-bold leading-tight mb-3 drop-shadow-md text-white">
          {titlePrefix && `${titlePrefix} `}
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
                stroke="var(--home-coral)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
          {titleSuffix && ` ${titleSuffix}`}
        </h1>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: 18,
            color: "rgba(255,255,255)",
            lineHeight: 1.65,
            maxWidth: 520,
          }}
          className="mx-auto drop-shadow-sm"
        >
          {description}
        </p>
      </div>
    </section>
  );
}
