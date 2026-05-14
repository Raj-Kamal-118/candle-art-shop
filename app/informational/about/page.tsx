"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart,
  Sparkles,
  MessageCircle,
  Mail,
  Flame,
  Instagram,
  Youtube,
} from "lucide-react";
import SecondaryHeader from "@/components/layout/SecondaryHeader";
import CraftProcess from "@/components/home/CraftProcess";
import MaterialsStrip from "@/components/home/MaterialsStrip";
import FeaturedProducts from "@/components/home/FeaturedProducts";

const fallbackInsta = [
  {
    id: "1",
    link: "https://instagram.com/artisanhouse.in",
    img: "/images/custom/01-candle.png",
  },
  {
    id: "2",
    link: "https://instagram.com/artisanhouse.in",
    img: "/images/process/03-pour.png",
  },
  {
    id: "3",
    link: "https://instagram.com/artisanhouse.in",
    img: "/images/custom/03-gift.png",
  },
  {
    id: "4",
    link: "https://instagram.com/artisanhouse.in",
    img: "/images/custom/02-magnet.png",
  },
  {
    id: "5",
    link: "https://instagram.com/artisanhouse.in",
    img: "/images/process/06-wrap.png",
  },
];

const instaItemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 40 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  }),
};

export default function AboutPage() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [instaPosts, setInstaPosts] = useState(fallbackInsta);

  useEffect(() => {
    fetch("/api/products?featured=true")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFeaturedProducts(
            data.filter((p) => p.visibleOnStorefront !== false).slice(0, 10),
          );
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    // This simulates fetching your latest Instagram posts.
    // A real integration requires an Instagram Basic Display API token and backend endpoint.
    const fetchInstagramPosts = async () => {
      try {
        // const res = await fetch('/api/instagram-feed');
        // if (res.ok) {
        //   const data = await res.json();
        //   setInstaPosts(data.slice(0, 5)); // We need 5 images for the masonry layout
        // }
      } catch (error) {
        console.error(
          "Failed to fetch Instagram posts, using fallback images.",
          error,
        );
      }
    };
    fetchInstagramPosts();
  }, []);

  return (
    <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] pb-20">
      <SecondaryHeader
        eyebrow="✦ Behind the scenes ✦"
        titlePrefix="Our"
        titleHighlighted="Story"
        titleSuffix=" & Craft."
        description="From a small idea to a studio full of wax, clay, and love. Here is how everything gets made."
        backgroundImage="/images/misc/checkout.png"
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 xl:gap-20 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 md:order-1"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center border border-amber-200 dark:border-amber-800/40">
                <Sparkles
                  size={18}
                  className="text-amber-600 dark:text-amber-400"
                />
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-brown-900 dark:text-amber-100">
                How it all{" "}
                <span className="text-coral-600 dark:text-amber-400 font-script text-4xl md:text-5xl inline-block -rotate-2">
                  started
                </span>
              </h2>
            </div>
            <div className="prose dark:prose-invert font-serif text-[18px] text-brown-700 dark:text-amber-100/70 leading-[1.8] space-y-6">
              <p>
                Artisan House began with a simple desire: to make things that
                hold meaning. In a world of mass-produced goods, we wanted to
                create objects that feel personal, slow, and deeply intentional.
              </p>
              <p>
                It started with a single melting pot and a few jars of soy wax
                in a small room in Varanasi. We spent months testing wicks,
                blending fragrances, and learning the delicate, sometimes
                stubborn temperament of natural wax.
              </p>
              <p>
                Today, our studio has grown, but our process hasn't. We still
                pour every candle by hand, paint every magnet stroke by stroke,
                and wrap every box as if it were going to a dear friend.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 md:order-2 relative"
          >
            <div className="craft-polaroid p-4 max-w-sm mx-auto transform rotate-3 hover:rotate-1 transition-transform duration-500 shadow-xl">
              {/* Decorative Tape */}
              <div
                style={{
                  position: "absolute",
                  top: -12,
                  left: "50%",
                  transform: "translateX(-50%) rotate(-4deg)",
                  width: 110,
                  height: 28,
                  background: "rgba(253, 230, 138, 0.6)",
                  backdropFilter: "blur(4px)",
                  zIndex: 10,
                  clipPath:
                    "polygon(0% 0%, 100% 0%, 95% 12.5%, 100% 25%, 95% 37.5%, 100% 50%, 95% 62.5%, 100% 75%, 95% 87.5%, 100% 100%, 0% 100%, 5% 87.5%, 0% 75%, 5% 62.5%, 0% 50%, 5% 37.5%, 0% 25%, 5% 12.5%)",
                }}
              />
              <div className="relative aspect-[4/5] w-full bg-cream-100 dark:bg-amber-900/30 overflow-hidden rounded-sm border border-cream-200 dark:border-amber-900/50">
                <Image
                  src="/images/process/03-pour.png"
                  alt="Our Studio"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-center font-hand text-[26px] text-brown-800 dark:text-amber-100/80 mt-5 mb-2">
                The beginning.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Repurposed Home Components */}
      <div className="relative z-10">
        <CraftProcess />
        <MaterialsStrip />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-amber-50 dark:bg-amber-900/10 rounded-[32px] p-8 sm:p-12 md:p-16 border border-amber-200 dark:border-amber-900/30 shadow-sm relative overflow-hidden mb-24"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Flame size={180} className="text-amber-600" />
          </div>
          <div className="relative z-10 max-w-3xl">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brown-900 dark:text-amber-100 mb-8">
              The{" "}
              <span className="text-coral-600 dark:text-amber-400 font-script text-4xl md:text-5xl inline-block -rotate-2">
                art
              </span>{" "}
              of candles
            </h2>
            <div className="font-serif text-[18px] text-brown-700 dark:text-amber-100/70 leading-[1.8] space-y-6">
              <p>
                Candle-making is as much exact science as it is expressive art.
                It requires monitoring precise temperatures, calculating the
                perfect wick thickness for a vessel's diameter, and finding the
                exact golden ratio of fragrance oil to wax.
              </p>
              <p>
                But beyond the science, it's about the mood it sets. A
                flickering flame and a carefully crafted scent can transform a
                room, ground your thoughts, and bring warmth to the quietest
                moments of your day. We obsess over the details so you can
                simply light the wick and breathe.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <div className="relative z-10 w-full mb-24">
          <FeaturedProducts products={featuredProducts} />
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pb-12">
        {/* Socials / Community Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-cream-50 dark:bg-amber-900/10 rounded-[32px] p-8 sm:p-12 border border-cream-200 dark:border-amber-900/30 text-center shadow-sm mb-24 relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-coral-100 dark:bg-coral-900/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-100 dark:bg-amber-900/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
          <div className="relative z-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-500 mb-4 font-sans">
              ✦ Join our community ✦
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brown-900 dark:text-amber-100 mb-6">
              Follow our{" "}
              <span className="text-coral-600 dark:text-amber-400 font-script inline-block -rotate-2 text-4xl md:text-5xl">
                journey
              </span>
            </h2>
            <p className="text-brown-600 dark:text-amber-100/70 mb-10 max-w-xl mx-auto font-serif text-[18px] leading-[1.8]">
              We share studio updates, behind-the-scenes packing videos,
              aesthetic candle setups, and early access to new product drops on
              our social channels. Come say hi!
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a
                href="https://instagram.com/artisanhouse.in"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 bg-[length:200%_200%] text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-pink-500/30 hover:-translate-y-1 hover:bg-right-top transition-all duration-500 w-full sm:w-auto uppercase tracking-wide text-sm"
              >
                <Instagram
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />{" "}
                Instagram
              </a>
              <a
                href="https://youtube.com/@artisanhouse_in"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 bg-red-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-red-500 hover:shadow-xl hover:shadow-red-500/30 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto uppercase tracking-wide text-sm"
              >
                <Youtube
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />{" "}
                YouTube
              </a>
            </div>

            {/* Instagram Masonry Layout */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto"
            >
              <div className="flex flex-col gap-4 md:mt-8">
                <motion.a
                  custom={0}
                  variants={instaItemVariants}
                  href={
                    instaPosts[0]?.link ||
                    "https://instagram.com/artisanhouse.in"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 block"
                >
                  <Image
                    src={instaPosts[0]?.img || "/images/custom/01-candle.png"}
                    alt="Instagram feed 1"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <Instagram
                      size={28}
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100 duration-300"
                    />
                  </div>
                </motion.a>
              </div>
              <div className="flex flex-col gap-4">
                <motion.a
                  custom={1}
                  variants={instaItemVariants}
                  href={
                    instaPosts[1]?.link ||
                    "https://instagram.com/artisanhouse.in"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group aspect-[4/5] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 block"
                >
                  <Image
                    src={instaPosts[1]?.img || "/images/process/03-pour.png"}
                    alt="Instagram feed 2"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <Instagram
                      size={28}
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100 duration-300"
                    />
                  </div>
                </motion.a>
                <motion.a
                  custom={2}
                  variants={instaItemVariants}
                  href={
                    instaPosts[2]?.link ||
                    "https://instagram.com/artisanhouse.in"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 block"
                >
                  <Image
                    src={instaPosts[2]?.img || "/images/custom/03-gift.png"}
                    alt="Instagram feed 3"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <Instagram
                      size={28}
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100 duration-300"
                    />
                  </div>
                </motion.a>
              </div>
              <div className="flex flex-col gap-4 md:mt-12">
                <motion.a
                  custom={3}
                  variants={instaItemVariants}
                  href={
                    instaPosts[3]?.link ||
                    "https://instagram.com/artisanhouse.in"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group aspect-[4/5] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 block"
                >
                  <Image
                    src={instaPosts[3]?.img || "/images/custom/02-magnet.png"}
                    alt="Instagram feed 4"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <Instagram
                      size={28}
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100 duration-300"
                    />
                  </div>
                </motion.a>
              </div>
              <div className="flex flex-col gap-4 mt-4 md:mt-0 hidden md:flex">
                <motion.a
                  custom={4}
                  variants={instaItemVariants}
                  href={
                    instaPosts[4]?.link ||
                    "https://instagram.com/artisanhouse.in"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 block"
                >
                  <Image
                    src={instaPosts[4]?.img || "/images/process/06-wrap.png"}
                    alt="Instagram feed 5"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <Instagram
                      size={28}
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100 duration-300"
                    />
                  </div>
                </motion.a>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto px-4"
        >
          <div className="w-16 h-16 bg-coral-100 dark:bg-coral-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-coral-200 dark:border-coral-800/40">
            <Heart
              size={28}
              className="text-coral-600 dark:text-coral-400 fill-coral-200 dark:fill-coral-900/40"
            />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brown-900 dark:text-amber-100 mb-4">
            Get in touch
          </h2>
          <p className="font-serif text-[18px] text-brown-600 dark:text-amber-100/60 mb-10 italic">
            Whether you want to discuss a custom order, ask about our process,
            or just say hello — our inbox is always open.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/919519486785"
              className="inline-flex items-center gap-2 bg-forest-800 text-white px-8 py-4 rounded-xl font-bold hover:bg-forest-900 transition-all shadow-lg hover:-translate-y-0.5 w-full sm:w-auto justify-center text-sm tracking-wide uppercase"
            >
              <MessageCircle size={18} /> WhatsApp Us
            </a>
            <a
              href="mailto:artisanhouse.in@gmail.com"
              className="inline-flex items-center gap-2 bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 text-brown-800 dark:text-amber-100 px-8 py-4 rounded-xl font-bold hover:bg-cream-50 dark:hover:bg-amber-900/50 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 w-full sm:w-auto justify-center text-sm tracking-wide uppercase"
            >
              <Mail size={18} /> Email Us
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
