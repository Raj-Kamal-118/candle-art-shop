import { getProducts } from "@/lib/data";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.artisanhouse.in";
  
  // Fetch your products from the database
  const products = await getProducts();

  // Build individual item XML blocks
  const items = products
    .filter((product) => product.visibleOnStorefront !== false)
    .map((product) => {
      // Google requires clean text without HTML tags for the description
      const cleanDescription = product.description
        ? product.description.replace(/<[^>]*>?/gm, "").trim()
        : `${product.name} by Artisan House`;

      return `
    <item>
      <g:id>${product.id}</g:id>
      <g:title><![CDATA[${product.name}]]></g:title>
      <g:description><![CDATA[${cleanDescription}]]></g:description>
      <g:link>${baseUrl}/products/${product.slug}</g:link>
      <g:image_link>${product.images?.[0] || ""}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>${product.inStock ? "in_stock" : "out_of_stock"}</g:availability>
      <g:price>${product.price}.00 INR</g:price>
      <g:brand>Artisan House</g:brand>
    </item>`;
    })
    .join("");

  // Wrap the items in the standard RSS 2.0 structure required by Google Merchant Center
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Artisan House</title>
    <link>${baseUrl}</link>
    <description>Handcrafted candles, clay art, and creative crafts from Artisan House.</description>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}