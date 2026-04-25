import Link from "next/link";
import {
  MessageCircle,
  Mail,
  Instagram,
  MapPin,
  ArrowRight,
} from "lucide-react";
import SecondaryHeader from "@/components/layout/SecondaryHeader";

const channels = [
  {
    Icon: MessageCircle,
    label: "WhatsApp",
    value: "+91 95194 86785",
    note: "Replies within an hour",
    href: "https://wa.me/919519486785",
    hi: true,
  },
  {
    Icon: Mail,
    label: "Email",
    value: "artisanhouse.in@gmail.com",
    note: "Replies within a day",
    href: "mailto:artisanhouse.in@gmail.com",
  },
  {
    Icon: Instagram,
    label: "Instagram",
    value: "@artisanhouse.in",
    note: "DMs welcome",
    href: "https://instagram.com/artisanhouse.in",
  },
  {
    Icon: MapPin,
    label: "Studio",
    value: "Varanasi, India",
    note: "Visits by appointment",
    href: "#",
  },
];

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] pb-20">
      <SecondaryHeader
        eyebrow="✦ 404 Error ✦"
        titlePrefix="Page not"
        titleHighlighted="found"
        titleSuffix="."
        description="We couldn't find the page you're looking for. It might have been moved or deleted, but we're here to help."
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-16">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-coral-600 hover:bg-coral-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-coral-200 dark:shadow-amber-900/30 hover:-translate-y-0.5 transition-all duration-200 text-sm"
          >
            Return to Homepage <ArrowRight size={16} />
          </Link>
        </div>

        <div className="bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 rounded-[20px] p-8 md:p-12 mb-10">
          <h2 className="font-serif text-[26px] font-bold text-brown-900 dark:text-amber-100 mb-8 text-center">
            Need help finding something? Get in touch.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {channels.map(({ Icon, label, value, note, href, hi }) => (
              <a
                key={label}
                href={href}
                className={`flex flex-col items-center text-center gap-3 p-[18px] rounded-2xl border transition-all hover:-translate-y-0.5 ${
                  hi
                    ? "bg-forest-50 dark:bg-forest-900/30 border-forest-100 dark:border-forest-800"
                    : "bg-white dark:bg-[#1a1830] border-cream-200 dark:border-amber-900/30"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-none ${
                    hi
                      ? "bg-forest-700 text-white"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                  }`}
                >
                  <Icon size={16} />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.1em] text-brown-500 dark:text-amber-100/50 mb-0.5">
                    {label}
                  </div>
                  <div className="text-[15px] font-semibold text-brown-900 dark:text-amber-100 mb-0.5">
                    {value}
                  </div>
                  <div className="text-xs text-brown-500 dark:text-amber-100/50">
                    {note}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
