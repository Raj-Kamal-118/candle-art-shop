// ── Categories ────────────────────────────────────────────────────────────────

export interface BannerButton {
  text: string;
  link: string;
  variant: "primary" | "secondary";
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  createdAt: string;
  // Banner fields (Feature 2)
  bannerTitle?: string;
  bannerDescription?: string;
  bannerImage?: string;
  bannerBgColor?: string;
  bannerButtons?: BannerButton[];
  showInHomepage?: boolean;
}

// ── Products ──────────────────────────────────────────────────────────────────

export interface CustomizationOption {
  id: string;
  label: string;
  type: "text" | "color" | "select";
  options?: string[];
  affectsPrice?: boolean; // When true this option participates in variant pricing
}

// variant_pricing key = price-affecting option values joined by "|"
// e.g. { "Normal|Yes": 2999, "Soy|Yes": 3999 }
export type VariantPricing = Record<string, number>;

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  categoryId: string;
  images: string[];
  tags: string[];
  inStock: boolean;
  stockCount: number;
  featured: boolean;
  customizable: boolean;
  customizationOptions?: CustomizationOption[];
  variantPricing?: VariantPricing; // Feature 3
  createdAt: string;
  updatedAt: string;
}

// ── Discounts ─────────────────────────────────────────────────────────────────

export interface DiscountCode {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrderAmount: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  active: boolean;
}

// ── Addresses & Orders ────────────────────────────────────────────────────────

export interface Address {
  fullName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  customizations?: Record<string, string>;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  discountCode?: string;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: "cod" | "qr";
  status: string;
  createdAt: string;
  userId?: string;
  customerPhone?: string;
}

export interface AdminCredentials {
  username: string;
  password: string;
}

// ── Cart ──────────────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
  customizations?: Record<string, string>;
  /** Resolved variant price — may differ from product.price when variantPricing applies */
  price?: number;
}

// ── Hero Section (Feature 1) ──────────────────────────────────────────────────

export type HeroButtonIcon =
  | "arrow-right"
  | "shopping-bag"
  | "sparkles"
  | "star"
  | "gift"
  | "heart"
  | "";

export interface HeroButton {
  text: string;
  link: string;
  icon: HeroButtonIcon;
  variant: "primary" | "secondary";
}

export interface HeroStat {
  value: string;
  label: string;
}

export type HeroBackgroundType = "gradient" | "color" | "image" | "video";

export interface HeroSettings {
  id: string;
  badgeText: string;
  h1Text: string;
  h1HighlightedText: string;
  h1TextColor: string;
  description: string;
  buttons: HeroButton[];
  backgroundType: HeroBackgroundType;
  backgroundValue?: string;
  showImages: boolean;
  images: string[];
  showStats: boolean;
  stats: HeroStat[];
  floatingBadgeText?: string;
  updatedAt: string;
}

// ── Users & OTP (Feature 4) ───────────────────────────────────────────────────

export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OTPSession {
  id: string;
  phone: string;
  otp: string;
  expiresAt: string;
  verified: boolean;
  createdAt: string;
}
