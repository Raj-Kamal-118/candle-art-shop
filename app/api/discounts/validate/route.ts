import { NextRequest, NextResponse } from "next/server";
import { getDiscountByCode, hasUserUsedDiscount } from "@/lib/data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, subtotal } = body;

    // Pull userId from session cookie (if logged in) or body fallback
    const userId =
      request.cookies.get("user_session")?.value || body.userId || undefined;
    // Get phone from body if available (from shipping address)
    const phone = body.phone || undefined;

    if (!code || subtotal === undefined) {
      return NextResponse.json(
        { error: "Missing code or subtotal" },
        { status: 400 },
      );
    }

    const discount = await getDiscountByCode(code);

    if (!discount) {
      return NextResponse.json(
        { error: "Invalid discount code" },
        { status: 404 },
      );
    }

    if (!discount.active) {
      return NextResponse.json(
        { error: "This discount code is no longer active" },
        { status: 400 },
      );
    }

    if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: "This discount code has expired" },
        { status: 400 },
      );
    }

    if (discount.usedCount >= discount.maxUses) {
      return NextResponse.json(
        { error: "This discount code has reached its usage limit" },
        { status: 400 },
      );
    }

    if (subtotal < discount.minOrderAmount) {
      return NextResponse.json(
        { error: `Minimum order amount of ₹${discount.minOrderAmount} not met` },
        { status: 400 },
      );
    }

    // Enforce one-time use per customer if we have their identity
    if (discount.oneUsePerCustomer && (userId || phone)) {
      const alreadyUsed = await hasUserUsedDiscount(code, userId, phone);
      if (alreadyUsed) {
        return NextResponse.json(
          { error: "You have already used this discount code" },
          { status: 400 },
        );
      }
    }

    return NextResponse.json({ discount });
  } catch (error) {
    console.error("Discount validation error:", error);
    return NextResponse.json(
      { error: "Failed to validate discount" },
      { status: 500 },
    );
  }
}