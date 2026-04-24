import { supabase } from "./supabase";
import { GiftSet, Product } from "./types";

// ─── Mappers ─────────────────────────────────────────────────────────────────

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: (row.description as string) || "",
    price: row.price as number,
    compareAtPrice: row.compare_at_price as number | null,
    categoryId: row.category_id as string,
    images: (row.images as string[]) || [],
    tags: (row.tags as string[]) || [],
    inStock: row.in_stock as boolean,
    stockCount: row.stock_count as number,
    featured: row.featured as boolean,
    customizable: row.customizable as boolean,
    customizationOptions: (row.customization_options as Product["customizationOptions"]) || [],
    variantPricing: (row.variant_pricing as Product["variantPricing"]) || {},
    additionalSections: (row.additional_sections as Product["additionalSections"]) || [],
    characteristics: (row.characteristics as Product["characteristics"]) || [],
    extraButtons: (row.extra_buttons as Product["extraButtons"]) || [],
    sortOrder: row.sort_order as number | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapGiftSet(row: Record<string, unknown>, items?: Product[]): GiftSet {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    tagline: row.tagline as string | undefined,
    description: row.description as string | undefined,
    occasions: (row.occasions as string[]) || [],
    price: row.price as number,
    saving: row.saving as number,
    image: row.image as string | undefined,
    accent: (row.accent as string) || "var(--amber-600)",
    status: row.status as GiftSet["status"],
    items,
    sortOrder: row.sort_order as number | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// ─── Fetch helpers ────────────────────────────────────────────────────────────

async function fetchItemsForSet(setId: string): Promise<Product[]> {
  const { data: junctionRows, error: jErr } = await supabase
    .from("gift_set_products")
    .select("product_id, sort_order")
    .eq("gift_set_id", setId)
    .order("sort_order");
  if (jErr || !junctionRows?.length) return [];

  const productIds = junctionRows.map((r: Record<string, unknown>) => r.product_id as string);

  const { data: productRows, error: pErr } = await supabase
    .from("products")
    .select("*")
    .in("id", productIds);
  if (pErr || !productRows) return [];

  // preserve junction sort_order
  return junctionRows
    .map((j: Record<string, unknown>) => {
      const row = productRows.find((p: Record<string, unknown>) => p.id === j.product_id);
      return row ? mapProduct(row) : null;
    })
    .filter(Boolean) as Product[];
}

// ─── Gift Sets ────────────────────────────────────────────────────────────────

export async function getGiftSets(liveOnly = true): Promise<GiftSet[]> {
  let query = supabase
    .from("gift_sets")
    .select("*")
    .order("sort_order")
    .order("created_at");
  if (liveOnly) query = query.eq("status", "live");

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map((row) => mapGiftSet(row));
}

export async function getGiftSetBySlug(slug: string): Promise<GiftSet | null> {
  const { data: setRow, error } = await supabase
    .from("gift_sets")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error || !setRow) return null;
  const items = await fetchItemsForSet(setRow.id as string);
  return mapGiftSet(setRow, items);
}

export async function getGiftSetById(id: string): Promise<GiftSet | null> {
  const { data: setRow, error } = await supabase
    .from("gift_sets")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !setRow) return null;
  const items = await fetchItemsForSet(id);
  return mapGiftSet(setRow, items);
}

export async function createGiftSet(
  set: Omit<GiftSet, "createdAt" | "updatedAt" | "items"> & { productIds: string[] }
): Promise<GiftSet> {
  const { data, error } = await supabase
    .from("gift_sets")
    .insert({
      id: set.id,
      slug: set.slug,
      name: set.name,
      tagline: set.tagline,
      description: set.description,
      occasions: set.occasions,
      price: set.price,
      saving: set.saving,
      image: set.image,
      accent: set.accent,
      status: set.status,
      sort_order: set.sortOrder ?? 0,
    })
    .select()
    .single();
  if (error) throw error;

  if (set.productIds.length > 0) {
    const rows = set.productIds.map((productId, i) => ({
      gift_set_id: data.id,
      product_id: productId,
      sort_order: i,
    }));
    await supabase.from("gift_set_products").insert(rows);
  }

  return mapGiftSet(data);
}

export async function updateGiftSet(
  id: string,
  updates: Partial<Omit<GiftSet, "id" | "createdAt" | "updatedAt" | "items">>,
  productIds?: string[]
): Promise<GiftSet> {
  const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
  if (updates.tagline !== undefined) dbUpdates.tagline = updates.tagline;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.occasions !== undefined) dbUpdates.occasions = updates.occasions;
  if (updates.price !== undefined) dbUpdates.price = updates.price;
  if (updates.saving !== undefined) dbUpdates.saving = updates.saving;
  if (updates.image !== undefined) dbUpdates.image = updates.image;
  if (updates.accent !== undefined) dbUpdates.accent = updates.accent;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.sortOrder !== undefined) dbUpdates.sort_order = updates.sortOrder;

  const { data, error } = await supabase
    .from("gift_sets")
    .update(dbUpdates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;

  if (productIds !== undefined) {
    await supabase.from("gift_set_products").delete().eq("gift_set_id", id);
    if (productIds.length > 0) {
      const rows = productIds.map((productId, i) => ({
        gift_set_id: id,
        product_id: productId,
        sort_order: i,
      }));
      await supabase.from("gift_set_products").insert(rows);
    }
  }

  return mapGiftSet(data);
}

export async function deleteGiftSet(id: string): Promise<void> {
  const { error } = await supabase.from("gift_sets").delete().eq("id", id);
  if (error) throw error;
}
