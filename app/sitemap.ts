import { MetadataRoute } from "next";
import { getProducts, getCategories } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.artisanhouse.in";

  // Fetch dynamic data
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  // Define your static routes
  const staticRoutes = [
    "",
    "/products",
    "/gift-sets",
    "/custom",
    "/custom/candle",
    "/custom/magnet",
    "/custom/gift-set",
    "/informational/about",
    "/informational/faq",
    "/informational/shipping",
    "/informational/returns",
    "/informational/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic Category routes
  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Dynamic Product routes
  const productRoutes = products
    .filter((product) => product.visibleOnStorefront !== false)
    .map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: new Date(product.updatedAt || product.createdAt || new Date()),
      changeFrequency: "daily" as const,
      priority: 0.9,
    }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}