import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Fallback to production URL if env var is missing
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.artisanhouse.in";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/account/",
        "/checkout/",
        "/cart/",
        "/api/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}