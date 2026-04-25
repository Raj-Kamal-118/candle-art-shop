import { Flame, Leaf, Heart, Quote } from "lucide-react";
import SecondaryHeader from "@/components/layout/SecondaryHeader";

const values = [
  {
    Icon: Flame,
    title: "Small batches, always",
    body: "Six candles at a time. No factory line, no rush. Every vessel rests overnight before we trim the wick.",
  },
  {
    Icon: Leaf,
    title: "Grounded materials",
    body: "Soy wax, cotton wicks, fragrance oils from certified suppliers. Phthalate-free. Clean-burning.",
  },
  {
    Icon: Heart,
    title: "Made with intention",
    body: "Each candle leaves our studio wrapped in tissue, tucked into recycled kraft, with a hand-written note.",
  },
];

const stats: Array<[string, string]> = [
  ["2021", "Founded"],
  ["40,000+", "Candles poured"],
  ["12", "Artisans"],
  ["4.9★", "Rating"],
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] pb-20">
      <SecondaryHeader
        eyebrow="✦ Our Story ✦"
        titlePrefix="A little"
        titleHighlighted="warmth"
        titleSuffix="."
        description="Artisan House began in 2021 in a kitchen in Varanasi, with a single cotton wick and a borrowed melting pot. Today we ship candles and clay art across India — still hand-poured, still in small batches of six."
      />

      {/* Image */}
      <section className="px-4 sm:px-6 py-16 relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[21/9] relative bg-cream-100 dark:bg-[#1a1830]">
            <img
              src="https://loremflickr.com/1400/600/candle,workshop,craft?lock=601"
              alt="Our workshop"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 pt-10 pb-20">
        <div className="max-w-[1180px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {values.map(({ Icon, title, body }) => (
            <div key={title}>
              <div className="w-[52px] h-[52px] rounded-full bg-coral-100 text-coral-700 flex items-center justify-center mb-5">
                <Icon size={22} />
              </div>
              <h3 className="font-serif text-2xl font-bold text-brown-900 dark:text-amber-100 mb-2.5">
                {title}
              </h3>
              <p className="text-[15px] leading-[1.7] text-brown-700 dark:text-amber-100/70">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pull quote */}
      <section className="relative px-6 py-20 overflow-hidden bg-forest-900 text-forest-100">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 30% 50%, rgba(251,191,36,.15), transparent 60%), radial-gradient(circle at 80% 80%, rgba(215,110,96,.12), transparent 60%)",
          }}
        />
        <div className="relative max-w-[760px] mx-auto text-center">
          <Quote size={48} className="text-gold-400 mx-auto mb-6" />
          <blockquote
            className="font-serif text-2xl md:text-[36px] leading-[1.3] text-white font-normal"
            style={{ textShadow: "0 0 40px rgba(251,191,36,.15)" }}
          >
            &ldquo;A candle is just wax and wick — until someone lights it and
            waits. That waiting is where the story lives.&rdquo;
          </blockquote>
          <div className="mt-8 text-[13px] tracking-[0.2em] uppercase text-gold-400">
            Aanya &amp; Isha · Founders
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="px-6 py-20">
        <div className="max-w-[1180px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(([v, l]) => (
            <div key={l}>
              <div className="font-serif text-4xl md:text-[56px] font-bold text-brown-900 dark:text-amber-100 leading-none">
                {v}
              </div>
              <div className="text-[13px] text-brown-500 dark:text-amber-100/50 uppercase tracking-[0.15em] mt-2.5">
                {l}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
