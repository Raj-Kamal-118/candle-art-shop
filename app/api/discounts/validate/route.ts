import { NextRequest, NextResponse } from "next/server";
import { getDiscountByCode } from "@/lib/data";

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Discount code is required" },
        { status: 400 }
      );
    }

    const discount = await getDiscountByCode(code);

    if (!discount) {
      return NextResponse.json(
        { error: "Invalid discount code" },
        { status: 404 }
      );
    }

    if (!discount.active) {
      return NextResponse.json(
        { error: "This discount code is no longer active" },
        { status: 400 }
      );
    }

    if (new Date(discount.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: "This discount code has expired" },
        { status: 400 }
      );
    }

    if (discount.usedCount >= discount.maxUses) {
      return NextResponse.json(
        { error: "This discount code has reached its usage limit" },
        { status: 400 }
      );
    }

    if (subtotal < discount.minOrderAmount) {
      return NextResponse.json(
        {
          error: `Minimum order amount of ₹${discount.minOrderAmount} required for this code`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ discount });
  } catch {
    return NextResponse.json(
      { error: "Failed to validate discount code" },
      { status: 500 }
    );
  }
}
