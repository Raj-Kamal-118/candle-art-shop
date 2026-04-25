import { Metadata } from "next";
import { CategoryProvider } from "./CategoryProvider";

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
    const res = await fetch(`${getBaseUrl()}/api/categories`);
    if (!res.ok) return { title: "Category Not Found" };

    const cats = await res.json();
    const category = cats.find((c: any) => c.slug === params.slug);
    if (!category) return { title: "Category Not Found" };

    const cleanDescription = category.description
      ? category.description.replace(/<[^>]*>?/gm, "").slice(0, 160)
      : "";

    return {
      title: category.bannerTitle || category.name,
      description: cleanDescription,
      openGraph: {
        title: category.bannerTitle || category.name,
        description: cleanDescription,
        images: category.image ? [category.image] : [],
      },
    };
  } catch (error) {
    return { title: "Category" };
  }
}

// 2. Generate Structured JSON-LD Data for Google Rich Snippets & Fetch Data
export default async function CategoryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  let category = null;
  let products = [];
  let schema = null;

  try {
    const res = await fetch(`${getBaseUrl()}/api/categories`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const cats = await res.json();
      category = cats.find((c: any) => c.slug === params.slug);

      if (category) {
        const pRes = await fetch(
          `${getBaseUrl()}/api/products?categoryId=${category.id}`,
          { next: { revalidate: 60 } },
        );
        if (pRes.ok) {
          products = await pRes.json();
        }

        schema = {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: category.name,
          description: category.description?.replace(/<[^>]*>?/gm, ""),
          url: `${getBaseUrl()}/categories/${category.slug}`,
          image: category.image,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: products.map((p: any, index: number) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `${getBaseUrl()}/products/${p.slug}`,
            })),
          },
        };
      }
    }
  } catch (error) {
    // Silently continue if API is unreachable during build phase
  }

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <CategoryProvider category={category} products={products}>
        {children}
      </CategoryProvider>
    </>
  );
}
