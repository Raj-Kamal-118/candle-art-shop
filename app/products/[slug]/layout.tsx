import { Metadata } from "next";
import { ProductProvider } from "./ProductProvider";

// Helper to safely resolve absolute URLs for server-side fetching
function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

// 1. Generate Metadata for the Browser Tab & Social Sharing
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/products/slug/${params.slug}`);
    if (!res.ok) return { title: "Product Not Found" };

    const product = await res.json();

    // Clean HTML tags out of the rich text description for SEO
    const cleanDescription = product.description
      ? product.description.replace(/<[^>]*>?/gm, "").slice(0, 160)
      : "";

    return {
      title: product.name, // " | Artisan House" is appended automatically by your root layout
      description: cleanDescription,
      openGraph: {
        title: product.name,
        description: cleanDescription,
        images:
          product.images && product.images.length > 0
            ? [product.images[0]]
            : [],
      },
    };
  } catch (error) {
    return { title: "Product" };
  }
}

// 2. Generate Structured JSON-LD Data for Google Rich Snippets
export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  let productSchema = null;
  let product = null;
  let category = null;

  try {
    const res = await fetch(
      `${getBaseUrl()}/api/products/slug/${params.slug}`,
      { next: { revalidate: 60 } },
    );
    if (res.ok) {
      product = await res.json();

      if (product?.categoryId) {
        const catRes = await fetch(
          `${getBaseUrl()}/api/categories/${product.categoryId}`,
          { next: { revalidate: 60 } },
        );
        if (catRes.ok) category = await catRes.json();
      }

      const cleanDescription = product.description
        ? product.description.replace(/<[^>]*>?/gm, "")
        : "";

      productSchema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: product.name,
        image: product.images,
        description: cleanDescription,
        sku: product.id,
        brand: {
          "@type": "Brand",
          name: "Artisan House",
        },
        offers: {
          "@type": "Offer",
          url: `${getBaseUrl()}/products/${product.slug}`,
          priceCurrency: "INR",
          price: product.price,
          availability: product.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
        },
      };
    }
  } catch (error) {
    // Silently continue if API is unreachable during build phase
  }

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <ProductProvider product={product} category={category}>
        {children}
      </ProductProvider>
    </>
  );
}
