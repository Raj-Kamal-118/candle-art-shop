import { supabase } from "./supabase";
import {
  Product,
  Category,
  DiscountCode,
  Order,
  HeroSettings,
  User,
  OTPSession,
} from "./types";

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
    variantPricing: (row.variant_pricing as Product["variantPricing"]) || {},
    sortOrder: row.sort_order as number | undefined,
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
    sortOrder: row.sort_order as number | undefined,
    bannerTitle: row.banner_title as string | undefined,
    bannerDescription: row.banner_description as string | undefined,
    bannerImage: row.banner_image as string | undefined,
    bannerBgColor: (row.banner_bg_color as string) || "#f5f0eb",
    bannerButtons:
      (row.banner_buttons as Category["bannerButtons"]) || [],
    showInHomepage:
      row.show_in_homepage === undefined ? true : (row.show_in_homepage as boolean),
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
    paymentReference: row.payment_reference as string | undefined,
    createdAt: row.created_at as string,
    userId: row.user_id as string | undefined,
    customerPhone: row.customer_phone as string | undefined,
  };
}

function mapHeroSettings(row: Record<string, unknown>): HeroSettings {
  return {
    id: row.id as string,
    badgeText: row.badge_text as string,
    h1Text: row.h1_text as string,
    h1HighlightedText: row.h1_highlighted_text as string,
    h1TextColor: row.h1_text_color as string,
    description: row.description as string,
    buttons: (row.buttons as HeroSettings["buttons"]) || [],
    backgroundType: row.background_type as HeroSettings["backgroundType"],
    backgroundValue: row.background_value as string | undefined,
    showImages: row.show_images as boolean,
    images: (row.images as string[]) || [],
    showStats: row.show_stats as boolean,
    stats: (row.stats as HeroSettings["stats"]) || [],
    floatingBadgeText: row.floating_badge_text as string | undefined,
    updatedAt: row.updated_at as string,
  };
}

function mapUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    phone: row.phone as string,
    name: row.name as string | undefined,
    email: row.email as string | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapOTPSession(row: Record<string, unknown>): OTPSession {
  return {
    id: row.id as string,
    phone: row.phone as string,
    otp: row.otp as string,
    expiresAt: row.expires_at as string,
    verified: row.verified as boolean,
    createdAt: row.created_at as string,
  };
}

// ─── Products ────────────────────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.map(mapProduct);
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", categoryId)
    .eq("in_stock", true)
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) return [];
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
      variant_pricing: product.variantPricing ?? {},
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
  if (updates.variantPricing !== undefined)
    dbUpdates.variant_pricing = updates.variantPricing;
  if (updates.updatedAt !== undefined)
    dbUpdates.updated_at = updates.updatedAt;
  if (updates.sortOrder !== undefined)
    dbUpdates.sort_order = updates.sortOrder;

  const { data, error } = await supabase
    .from("products")
    .update(dbUpdates)
    .eq("id", id)
    .select()
    .single();
  if (error) return null;
  return mapProduct(data);
}

export async function reorderProducts(
  items: { id: string; sortOrder: number }[]
): Promise<void> {
  await Promise.all(
    items.map(({ id, sortOrder }) =>
      supabase.from("products").update({ sort_order: sortOrder }).eq("id", id)
    )
  );
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
    .order("sort_order", { ascending: true, nullsFirst: false })
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
      banner_title: category.bannerTitle ?? null,
      banner_description: category.bannerDescription ?? null,
      banner_image: category.bannerImage ?? null,
      banner_bg_color: category.bannerBgColor ?? "#f5f0eb",
      banner_buttons: category.bannerButtons ?? [],
      show_in_homepage: category.showInHomepage ?? true,
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
  if (updates.bannerTitle !== undefined)
    dbUpdates.banner_title = updates.bannerTitle;
  if (updates.bannerDescription !== undefined)
    dbUpdates.banner_description = updates.bannerDescription;
  if (updates.bannerImage !== undefined)
    dbUpdates.banner_image = updates.bannerImage;
  if (updates.bannerBgColor !== undefined)
    dbUpdates.banner_bg_color = updates.bannerBgColor;
  if (updates.bannerButtons !== undefined)
    dbUpdates.banner_buttons = updates.bannerButtons;
  if (updates.showInHomepage !== undefined)
    dbUpdates.show_in_homepage = updates.showInHomepage;
  if (updates.sortOrder !== undefined)
    dbUpdates.sort_order = updates.sortOrder;

  const { data, error } = await supabase
    .from("categories")
    .update(dbUpdates)
    .eq("id", id)
    .select()
    .single();
  if (error) return null;
  return mapCategory(data);
}

export async function reorderCategories(
  items: { id: string; sortOrder: number }[]
): Promise<void> {
  await Promise.all(
    items.map(({ id, sortOrder }) =>
      supabase.from("categories").update({ sort_order: sortOrder }).eq("id", id)
    )
  );
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

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return data.map(mapOrder);
}

export async function getOrdersByPhone(phone: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_phone", phone)
    .order("created_at", { ascending: false });
  if (error) return [];
  return data.map(mapOrder);
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
      payment_reference: order.paymentReference ?? null,
      user_id: order.userId ?? null,
      customer_phone: order.customerPhone ?? null,
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
  if (updates.paymentReference !== undefined) dbUpdates.payment_reference = updates.paymentReference;

  const { data, error } = await supabase
    .from("orders")
    .update(dbUpdates)
    .eq("id", id)
    .select()
    .single();
  if (error) return null;
  return mapOrder(data);
}

// ─── Hero Settings (Feature 1) ────────────────────────────────────────────────

export async function getHeroSettings(): Promise<HeroSettings> {
  const { data, error } = await supabase
    .from("hero_settings")
    .select("*")
    .eq("id", "main")
    .single();

  if (error || !data) {
    // Return sensible defaults if table doesn't exist yet
    return {
      id: "main",
      badgeText: "Handcrafted with love",
      h1Text: "Light Your World",
      h1HighlightedText: "With Art",
      h1TextColor: "#e85d4a",
      description:
        "Discover our collection of handcrafted candles, clay art, and creative crafts. Each piece is made with intention, using the finest natural ingredients and artistic craftsmanship.",
      buttons: [
        { text: "Shop Collection", link: "/products", icon: "arrow-right", variant: "primary" },
        { text: "Custom Orders", link: "/categories/custom-artwork", icon: "", variant: "secondary" },
      ],
      backgroundType: "gradient",
      backgroundValue: undefined,
      showImages: true,
      images: [
        "https://picsum.photos/seed/hero1/400/550",
        "https://picsum.photos/seed/hero3/400/400",
        "https://picsum.photos/seed/hero2/400/400",
        "https://picsum.photos/seed/hero4/400/550",
      ],
      showStats: true,
      stats: [
        { value: "500+", label: "Happy Customers" },
        { value: "100%", label: "Natural Ingredients" },
        { value: "11", label: "Signature Products" },
      ],
      floatingBadgeText: "Free shipping on Orders over ₹999",
      updatedAt: new Date().toISOString(),
    };
  }

  return mapHeroSettings(data);
}

export async function updateHeroSettings(
  updates: Partial<Omit<HeroSettings, "id">>
): Promise<HeroSettings | null> {
  const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.badgeText !== undefined) dbUpdates.badge_text = updates.badgeText;
  if (updates.h1Text !== undefined) dbUpdates.h1_text = updates.h1Text;
  if (updates.h1HighlightedText !== undefined) dbUpdates.h1_highlighted_text = updates.h1HighlightedText;
  if (updates.h1TextColor !== undefined) dbUpdates.h1_text_color = updates.h1TextColor;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.buttons !== undefined) dbUpdates.buttons = updates.buttons;
  if (updates.backgroundType !== undefined) dbUpdates.background_type = updates.backgroundType;
  if (updates.backgroundValue !== undefined) dbUpdates.background_value = updates.backgroundValue;
  if (updates.showImages !== undefined) dbUpdates.show_images = updates.showImages;
  if (updates.images !== undefined) dbUpdates.images = updates.images;
  if (updates.showStats !== undefined) dbUpdates.show_stats = updates.showStats;
  if (updates.stats !== undefined) dbUpdates.stats = updates.stats;
  if (updates.floatingBadgeText !== undefined) dbUpdates.floating_badge_text = updates.floatingBadgeText;

  const { data, error } = await supabase
    .from("hero_settings")
    .update(dbUpdates)
    .eq("id", "main")
    .select()
    .single();
  if (error) return null;
  return mapHeroSettings(data);
}

// ─── Users & OTP (Feature 4) ──────────────────────────────────────────────────

export async function getUserByPhone(phone: string): Promise<User | undefined> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("phone", phone)
    .single();
  if (error) return undefined;
  return mapUser(data);
}

export async function getUserById(id: string): Promise<User | undefined> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return undefined;
  return mapUser(data);
}

export async function createUser(user: {
  id: string;
  phone: string;
  name?: string;
  email?: string;
}): Promise<User> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("users")
    .insert({
      id: user.id,
      phone: user.phone,
      name: user.name ?? null,
      email: user.email ?? null,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();
  if (error) throw error;
  return mapUser(data);
}

export async function updateUser(
  id: string,
  updates: { name?: string; email?: string }
): Promise<User | null> {
  const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.email !== undefined) dbUpdates.email = updates.email;

  const { data, error } = await supabase
    .from("users")
    .update(dbUpdates)
    .eq("id", id)
    .select()
    .single();
  if (error) return null;
  return mapUser(data);
}

export async function createOTPSession(session: {
  id: string;
  phone: string;
  otp: string;
  expiresAt: string;
}): Promise<OTPSession> {
  // Invalidate any old sessions for this phone first
  await supabase.from("otp_sessions").delete().eq("phone", session.phone);

  const { data, error } = await supabase
    .from("otp_sessions")
    .insert({
      id: session.id,
      phone: session.phone,
      otp: session.otp,
      expires_at: session.expiresAt,
      verified: false,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (error) throw error;
  return mapOTPSession(data);
}

export async function getLatestOTPSession(
  phone: string
): Promise<OTPSession | undefined> {
  const { data, error } = await supabase
    .from("otp_sessions")
    .select("*")
    .eq("phone", phone)
    .eq("verified", false)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (error) return undefined;
  return mapOTPSession(data);
}

export async function markOTPVerified(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("otp_sessions")
    .update({ verified: true })
    .eq("id", id);
  return !error;
}
