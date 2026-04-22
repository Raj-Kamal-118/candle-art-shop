import { Camera, Mail, Heart, CheckCircle, Check, Info, X } from "lucide-react";
import InfoShell from "@/components/informational/InfoShell";

const steps = [
  { n: "1", Icon: Camera, title: "Take a photo", desc: "Within 48 hours of delivery, snap a clear picture of the issue." },
  { n: "2", Icon: Mail, title: "Email us", desc: "Send it to artisanhouse.in@gmail.com with your order number." },
  { n: "3", Icon: Heart, title: "We make it right", desc: "Replacement, refund, or store credit — your call." },
];

const canReplace = [
  "Broken or cracked vessels on arrival",
  "Wicks that don't light properly",
  "Incorrect item shipped",
  "Missing items from a gift set",
  "A fragrance that's clearly off",
];

const cannotAccept = [
  "Candles that have been lit or burnt",
  "Custom-made pieces (unless defective)",
  "Items reported after 48 hours",
  "Change-of-mind returns on hygiene items",
  "Dew or minor surface texture — this is natural",
];

export default function ReturnsPage() {
  return (
    <InfoShell
      eyebrow="Returns & Refunds"
      title={
        <>
          A <span className="text-coral-600 italic">kept</span> promise.
        </>
      }
      subtitle="If something arrives less than perfect, we make it right. No forms, no guilt-trips, no fuss."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {steps.map(({ n, Icon, title, desc }) => (
          <div
            key={n}
            className="relative bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 rounded-2xl p-6"
          >
            <div className="absolute top-5 right-5 font-serif text-[40px] font-bold text-cream-200 dark:text-amber-900/30 leading-none">
              {n}
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 flex items-center justify-center mb-4">
              <Icon size={18} />
            </div>
            <h3 className="font-serif text-xl font-bold text-brown-900 dark:text-amber-100 mb-2">
              {title}
            </h3>
            <p className="text-sm text-brown-600 dark:text-amber-100/60 leading-[1.6]">
              {desc}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        <div className="bg-forest-50 dark:bg-forest-900/30 border border-forest-100 dark:border-forest-800 rounded-2xl p-7">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-forest-800 dark:text-forest-200 mb-4">
            <CheckCircle size={14} /> We can replace
          </div>
          <ul className="flex flex-col gap-2.5 text-sm text-brown-800 dark:text-amber-100/80 leading-[1.5]">
            {canReplace.map((i) => (
              <li key={i} className="flex gap-2">
                <Check size={14} className="text-forest-700 dark:text-forest-400 mt-[3px] flex-none" />
                {i}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-cream-100 dark:bg-[#1a1830] border border-cream-300 dark:border-amber-900/30 rounded-2xl p-7">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-brown-700 dark:text-amber-200 mb-4">
            <Info size={14} /> We can't accept
          </div>
          <ul className="flex flex-col gap-2.5 text-sm text-brown-800 dark:text-amber-100/80 leading-[1.5]">
            {cannotAccept.map((i) => (
              <li key={i} className="flex gap-2">
                <X size={14} className="text-brown-500 dark:text-amber-100/50 mt-[3px] flex-none" />
                {i}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 rounded-2xl p-6 text-sm leading-[1.7] text-brown-700 dark:text-amber-100/70">
        <b className="text-brown-900 dark:text-amber-100">Refund timeline.</b> Approved refunds land back on your original payment method within 5–7 business days. COD orders are refunded via UPI — we'll reach out for your handle.
      </div>
    </InfoShell>
  );
}
