import Link from "next/link";
import Image from "next/image";

export default function ArtisanLogo({
  variant = "default",
}: {
  variant?: "default" | "light";
} = {}) {
  return (
    <Link
      href="/"
      className="flex flex-col md:flex-row items-center gap-0 md:gap-5 hover:opacity-90 transition-opacity"
    >
      <div className="relative w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
        <Image
          src="https://pub-1f6a6fc4e92548b987db5dbea7cd456e.r2.dev/candle-art-shop-images/Asset/assets-03%20(2).png"
          alt="Artisan House logo"
          fill
          sizes="80px"
          className="object-contain"
        />
      </div>
      <div className="leading-none text-center md:text-left">
        <span
          className={`block font-serif text-lg font-bold tracking-wide ${variant === "light" ? "text-amber-100" : "text-forest-900 dark:text-amber-100"}`}
        >
          Artisan House
        </span>
        <span
          className={`block text-[9px] font-medium tracking-[0.15em] uppercase ${variant === "light" ? "text-amber-400" : "text-amber-700 dark:text-amber-400"}`}
        >
          Candles · Clays · Crafts
        </span>
      </div>
    </Link>
  );
}
