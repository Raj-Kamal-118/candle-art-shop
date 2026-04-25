import { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fallback to production URL if env var is missing
  const rawBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.artisanhouse.in";
  const baseUrl = rawBaseUrl.replace(/\/$/, ""); // strips accidental trailing slashes

  // 1. Core Static Pages
  const staticRoutes = [
    "",
    "/products",
    "/gift-sets",
    "/gift-sets/build",
    "/custom-candle",
    "/custom-magnet",
    "/reviews",
    "/informational/about",
    "/informational/faq",
    "/informational/shipping",
    "/informational/returns",
    "/informational/contact",
    "/informational/privacy",
    "/informational/terms",
  ];

  const now = new Date();

  const staticPages = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // 2. Hardcoded Categories
  const categories = [
    "scented-candles",
    "fridge-magnets",
    "key-chain",
    "greeting-cards",
  ];

  const categoryPages = categories.map((slug) => ({
    url: `${baseUrl}/categories/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 3. Hardcoded Products (using slug instead of id)
  const products = [
    "pillar-candle",
    "the-aurora-glass-candle-autumn-collection",
    "charcoal-ruffle-pot-candle",
    "the-aura-pure-scented-tealight-candles-pack-of-20",
    "the-royal-orchid-artisan-collection",
    "the-brew-tiful-cup",
    "the-star-beam-cloud",
    "the-bumble-blossom",
    "the-hoot-heart-owl",
    "the-sunny-rainbow",
    "the-little-potted-cactus",
    "the-swirl-shell-snail",
    "the-happy-toadstool",
    "the-sleepy-foxy",
    "the-sprinkle-sweetie",
    "the-happy-octopus",
    "the-dots-spots-mushroom",
    "find-your-fragrance-mini-set",
    "handwritten-card",
  ];

  const productPages = products.map((slug) => ({
    url: `${baseUrl}/products/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // 4. Hardcoded Gift Sets
  const giftSets = [
    "the-quiet-evening",
    "housewarming",
    "reader",
    "diwali-glow",
    "desk-companion",
    "luxe",
  ];

  const giftSetPages = giftSets.map((slug) => ({
    url: `${baseUrl}/gift-sets/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Combine and return all routes
  return [
    ...staticPages,
    ...categoryPages,
    ...productPages,
    ...giftSetPages,
  ];
}