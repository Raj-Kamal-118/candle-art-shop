import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function generateId(prefix: string = "id"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + "...";
}

export function calculateDiscount(
  subtotal: number,
  discountType: "percentage" | "fixed",
  discountValue: number
): number {
  if (discountType === "percentage") {
    return (subtotal * discountValue) / 100;
  }
  return Math.min(discountValue, subtotal);
}

export function getShippingCost(subtotal: number): number {
  if (subtotal >= 999) return 0;
  return 99;
}
