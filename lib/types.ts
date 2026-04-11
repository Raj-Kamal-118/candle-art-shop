export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  createdAt: string;
}

export interface CustomizationOption {
  label: string;
  type: "text" | "color" | "select";
  options?: string[];
}

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
  createdAt: string;
  updatedAt: string;
}

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
}

export interface CartItem {
  product: Product;
  quantity: number;
  customizations?: Record<string, string>;
}

export interface AdminCredentials {
  username: string;
  password: string;
}
