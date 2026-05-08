import { MessageCircle, Mail, Instagram, MapPin } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

const channels = [
  {
    Icon: MessageCircle,
    label: "WhatsApp",
    value: SITE_CONFIG.contact.phone,
    note: "Replies within an hour",
    href: SITE_CONFIG.contact.whatsappUrl,
    hi: true,
  },
  {
    Icon: Mail,
    label: "Email",
    value: SITE_CONFIG.contact.email,
    note: "Replies within a day",
    href: `mailto:${SITE_CONFIG.contact.email}`,
  },
  {
    Icon: Instagram,
    label: "Instagram",
    value: SITE_CONFIG.contact.instagram,
    note: "DMs welcome",
    href: SITE_CONFIG.contact.instagramUrl,
  },
  {
    Icon: MapPin,
    label: "Studio",
    value: SITE_CONFIG.contact.studio,
    note: "Visits by appointment",
    href: "#",
  },
];

export default function SupportChannelsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {channels.map(({ Icon, label, value, note, href, hi }) => (
        <a
          key={label}
          href={href}
          className={`flex flex-col items-center text-center gap-3 p-[18px] rounded-2xl border transition-all hover:-translate-y-0.5 ${hi ? "bg-forest-50 dark:bg-forest-900/30 border-forest-100 dark:border-forest-800" : "bg-white dark:bg-[#1a1830] border-cream-200 dark:border-amber-900/30"}`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-none ${hi ? "bg-forest-700 text-white" : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"}`}
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
  );
}
