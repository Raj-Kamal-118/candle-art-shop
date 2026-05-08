import React from "react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="inline-flex items-stretch flex-wrap gap-1 font-sans">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;

          const clipPath = isFirst
            ? "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%)"
            : "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%, 14px 50%)";

          if (item.href && !isLast) {
            return (
              <li key={index} className="flex">
                <Link
                  href={item.href}
                  className="relative flex items-center justify-center bg-[#f5ecda] dark:bg-amber-950/40 text-brown-800 dark:text-amber-100/70 text-[13px] font-semibold transition-colors duration-200 hover:bg-[#eaddc1] dark:hover:bg-amber-900/60"
                  style={{
                    padding: isFirst
                      ? "8px 20px 8px 20px"
                      : "8px 20px 8px 28px",
                    clipPath,
                  }}
                >
                  {item.label}
                </Link>
              </li>
            );
          }

          return (
            <li key={index} className="flex">
              <span
                className="relative flex items-center justify-center bg-coral-500 dark:bg-coral-600 text-white text-[17px] font-bold transition-colors duration-200"
                style={{
                  padding: isFirst ? "5px 20px 5px 20px" : "5px 20px 5px 28px",
                  clipPath,
                  fontFamily: "var(--font-script)",
                }}
                aria-current="page"
              >
                {item.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
