import { supabase } from "./supabase";
import { Product, Category, DiscountCode, Order } from "./types";

// ─── Mappers (DB snake_case → TypeScript camelCase) ─────────────────────────

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: row.description as string,
    price: row.price as number,
    compareAtPrice: row.compare_at_price as number | null,
    categoryId: row.category_id as string,
    images: (row.images as string[]) || [],
    tags: (row.tags as string[]) || [],
    inStock: row.in_stock as boolean,
    stockCount: row.stock_count as number,
    featured: row.featured as boolean,
    customizable: row.customizable as boolean,
    customizationOptions:
      (row.customization_options as Product["customizationOptions"]) || [],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapCategory(row: Record<string, unknown>): Category {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: row.description as string,
    image: row.image as string,
    productCount: row.product_count as number,
    createdAt: row.created_at as string,
  };
}

function mapDiscount(row: Record<string, unknown>): DiscountCode {
  return {
    id: row.id as string,
    code: row.code as string,
    type: row.type as "percentage" | "fixed",
    value: row.value as number,
    minOrderAmount: row.min_order_amount as number,
    maxUses: row.max_uses as number,
    usedCount: row.used_count as number,
    expiresAt: row.expires_at as string,
    active: row.active as boolean,
  };
}

function mapOrder(row: Record<string, unknown>): Order {
  return {
    id: row.id as string,
    items: row.items as Order["items"],
    subtotal: row.subtotal as number,
    discount: row.discount as number,
    shipping: row.shipping as number,
    total: row.total as number,
    discountCode: row.discount_code as string | undefined,
    shippingAddress: row.shipping_address as Order["shippingAddress"],
    billingAddress: row.billing_address as Order["billingAddress"],
    paymentMethod: row.payment_method as "cod" | "qr",
    status: row.status as string,
    createdAt: row.created_at as string,
  };
}

// ─── Products ────────────────────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.map(mapProduct);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return undefined;
  return mapProduct(data);
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return undefined;
  return mapProduct(data);
}

export async function createProduct(product: Product): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .insert({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      compare_at_price: product.compareAtPrice ?? null,
      category_id: product.categoryId,
      images: product.images,
      tags: product.tags,
      in_stock: product.inStock,
      stock_count: product.stockCount,
      featured: product.featured,
      customizable: product.customizable,
      customization_options: product.customizationOptions ?? [],
      created_at: product.createdAt,
      updated_at: product.updatedAt,
    })
    .select()
    .single();
  if (error) throw error;
  return mapProduct(data);
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product | null> {
  const dbUpdates: Record<string, unknown> = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
  if (updates.description !== undefined)
    dbUpdates.description = updates.description;
  if (updates.price !== undefined) dbUpdates.price = updates.price;
  if (updates.compareAtPrice !== undefined)
    dbUpdates.compare_at_price = updates.compareAtPrice;
  if (updates.categoryId !== undefined)
    dbUpdates.category_id = updates.categoryId;
  if (updates.images !== undefined) dbUpdates.images = updates.images;
  if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
  if (updates.inStock !== undefined) dbUpdates.in_stock = updates.inStock;
  if (updates.stockCount !== undefined)
    dbUpdates.stock_count = updates.stockCount;
  if (updates.featured !== undefined) dbUpdates.featured = updates.featured;
  if (updates.customizable !== undefined)
    dbUpdates.customizable = updates.customizable;
  if (updates.customizationOptions !== undefined)
    dbUpdates.customization_options = updates.customizationOptions;
  if (updates.updatedAt !== undefined)
    dbUpdates.updated_at = updates.updatedAt;

  const { data, error } = await supabase
    .from("products")
    .update(dbUpdates)
    .eq("id", id)
    .select()
    .single();
  if (error) return null;
  return mapProduct(data);
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  return !error;
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data.map(mapCategory);
}

export async function getCategoryById(
  id: string
): Promise<Category | undefined> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return undefined;
  return mapCategory(data);
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | undefined> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return undefined;
  return mapCategory(data);
}

export async function createCategory(category: Category): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .insert({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      product_count: category.productCount,
      created_at: category.createdAt,
    })
    .select()
    .single();
  if (error) throw error;
  return mapCategory(data);
}

export async function updateCategory(
  id: string,
  updates: Partial<Category>
): Promise<Category | null> {
  const dbUpdates: Record<string, unknown> = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
  if (updates.description !== undefined)
    dbUpdates.description = updates.description;
  if (updates.image !== undefined) dbUpdates.image = updates.image;
  if (updates.productCount !== undefined)
    dbUpdates.product_count = updates.productCount;

  const { data, error } = await supabase
    .from("categories")
    .update(dbUpdates)
    .eq("id", id)
    .select()
    .single();
  if (error) return null;
  return mapCategory(data);
}

export async function deleteCategory(id: string): Promise<boolean> {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  return !error;
}

// ─── Discounts ───────────────────────────────────────────────────────────────

export async function getDiscounts(): Promise<DiscountCode[]> {
  const { data, error } = await supabase
    .from("discounts")
    .select("*")
    .order("id", { ascending: true });
  if (error) throw error;
  return data.map(mapDiscount);
}

export async function getDiscountById(
  id: string
): Promise<DiscountCode | undefined> {
  const { data, error } = await supabase
    .from("discounts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return undefined;
  return mapDiscount(data);
}

export async function getDiscountByCode(
  code: string
): Promise<DiscountCode | undefined> {
  const { data, error } = await supabase
    .from("discounts")
    .select("*")
    .ilike("code", code)
    .single();
  if (error) return undefined;
  return mapDiscount(data);
}

export async function createDiscount(
  discount: DiscountCode
): Promise<DiscountCode> {
  const { data, error } = await supabase
    .from("discounts")
    .insert({
      id: discount.id,
      code: discount.code,
      type: discount.type,
      value: discount.value,
      min_order_amount: discount.minOrderAmount,
      max_uses: discount.maxUses,
      used_count: discount.usedCount,
      expires_at: discount.expiresAt,
      active: discount.active,
    })
    .select()
    .single();
  if (error) throw error;
  return mapDiscount(data);
}

export async function updateDiscount(
  id: string,
  updates: Partial<DiscountCode>
): Promise<DiscountCode | null> {
  const dbUpdates: Record<string, unknown> = {};
  if (updates.code !== undefined) dbUpdates.code = updates.code;
  if (updates.type !== undefined) dbUpdates.type = updates.type;
  if (updates.value !== undefined) dbUpdates.value = updates.value;
  if (updates.minOrderAmount !== undefined)
    dbUpdates.min_order_amount = updates.minOrderAmount;
  if (updates.maxUses !== undefined) dbUpdates.max_uses = updates.maxUses;
  if (updates.usedCount !== undefined)
    dbUpdates.used_count = updates.usedCount;
  if (updates.expiresAt !== undefined)
    dbUpdates.expires_at = updates.expiresAt;
  if (updates.active !== undefined) dbUpdates.active = updates.active;

  const { data, error } = await supabase
    .from("discounts")
    .update(dbUpdates)
    .eq("id", id)
    .select()
    .single();
  if (error) return null;
  return mapDiscount(data);
}

export async function deleteDiscount(id: string): Promise<boolean> {
  const { error } = await supabase.from("discounts").delete().eq("id", id);
  return !error;
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.map(mapOrder);
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return undefined;
  return mapOrder(data);
}

export async function createOrder(order: Order): Promise<Order> {
  const { data, error } = await supabase
    .from("orders")
    .insert({
      id: order.id,
      status: order.status,
      items: order.items,
      subtotal: order.subtotal,
      discount: order.discount,
      shipping: order.shipping,
      total: order.total,
      discount_code: order.discountCode ?? null,
      shipping_address: order.shippingAddress,
      billing_address: order.billingAddress,
      payment_method: order.paymentMethod,
      created_at: order.createdAt,
    })
    .select()
    .single();
  if (error) throw error;
  return mapOrder(data);
}

export async function updateOrder(
  id: string,
  updates: Partial<Order>
): Promise<Order | null> {
  const dbUpdates: Record<string, unknown> = {};
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.items !== undefined) dbUpdates.items = updates.items;

  const { data, error } = await supabase
    .from("orders")
    .update(dbUpdates)
    .eq("id", id)
    .select()
    .single();
  if (error) return null;
  return mapOrder(data);
}
