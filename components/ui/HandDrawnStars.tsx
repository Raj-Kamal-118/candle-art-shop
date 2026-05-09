import React, { useId } from "react";

export default function HandDrawnStars({
  rating = 5,
  size = 22,
  className = "",
}: {
  rating?: number;
  size?: number;
  className?: string;
}) {
  // Generate a unique ID prefix for SVG defs to avoid conflicts when multiple stars are rendered
  const idPrefix = useId().replace(/:/g, "");

  return (
    <div className={`flex gap-1.5 ${className}`}>
      {[...Array(5)].map((_, i) => {
        const isFilled = i < Math.round(rating);
        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
          >
            <defs>
              <pattern
                id={`hatch-${idPrefix}-${i}`}
                patternUnits="userSpaceOnUse"
                width="3.5"
                height="3.5"
                patternTransform="rotate(42)"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="3.5"
                  stroke="#b45309"
                  strokeWidth="1.1"
                  opacity="0.55"
                />
              </pattern>
              <clipPath id={`sclip-${idPrefix}-${i}`}>
                <path d="M12 2.5 L14.2 8.6 L20.8 9.2 L16.1 13.7 L17.6 20.3 L12 17.0 L6.4 20.3 L7.9 13.7 L3.2 9.2 L9.8 8.6 Z" />
              </clipPath>
            </defs>
            {isFilled && (
              <>
                <path
                  d="M12 2.5 L14.2 8.6 L20.8 9.2 L16.1 13.7 L17.6 20.3 L12 17.0 L6.4 20.3 L7.9 13.7 L3.2 9.2 L9.8 8.6 Z"
                  fill="#fde68a"
                />
                <rect
                  x="0"
                  y="0"
                  width="24"
                  height="24"
                  fill={`url(#hatch-${idPrefix}-${i})`}
                  clipPath={`url(#sclip-${idPrefix}-${i})`}
                />
              </>
            )}
            <path
              d="M12 2.5 L14.2 8.6 L20.8 9.2 L16.1 13.7 L17.6 20.3 L12 17.0 L6.4 20.3 L7.9 13.7 L3.2 9.2 L9.8 8.6 Z"
              fill="none"
              stroke={isFilled ? "#d97706" : "#c8b49a"}
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
        );
      })}
    </div>
  );
}
