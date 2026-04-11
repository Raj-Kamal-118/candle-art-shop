import Link from "next/link";

export default function ArtisanLogo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-5 hover:opacity-90 transition-opacity"
    >
      <div className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0">
        <img
          src="https://pub-1f6a6fc4e92548b987db5dbea7cd456e.r2.dev/candle-art-shop-images/Asset/assets-03%20(2).png"
          alt="Artisan House logo"
        />
      </div>
      <div className="leading-none">
        <span className="block font-serif text-lg font-bold text-forest-900 dark:text-amber-100 tracking-wide">
          Artisan House
        </span>
        <span className="block text-[9px] font-medium text-gold-600 dark:text-amber-400 tracking-[0.15em] uppercase">
          Candles · Clays · Crafts
        </span>
      </div>
    </Link>
  );
}
