import { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  sidebar?: ReactNode;
  children: ReactNode;
};

export default function InfoShell({ eyebrow, title, subtitle, sidebar, children }: Props) {
  return (
    <div className="bg-cream-50 dark:bg-[#0f0e1c] pt-10 pb-20">
      <div className="max-w-[1080px] mx-auto px-6">
        <div className="text-center mb-12">
          <div className="text-[13px] font-semibold tracking-[0.2em] uppercase text-amber-700 dark:text-amber-400 mb-3">
            {eyebrow}
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-[52px] font-bold text-brown-900 dark:text-amber-100 leading-[1.05] mb-3">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[17px] text-brown-700 dark:text-amber-100/70 max-w-[600px] mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={`grid gap-12 items-start ${
            sidebar ? "md:grid-cols-[240px_1fr]" : "grid-cols-1"
          }`}
        >
          {sidebar}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
