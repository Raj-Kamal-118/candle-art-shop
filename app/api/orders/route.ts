import { NextRequest, NextResponse } from "next/server";
import { getOrders, createOrder, updateDiscount, getDiscountByCode } from "@/lib/data";
import { generateId } from "@/lib/utils";

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Pull userId from session cookie (if logged in)
    const userId = request.cookies.get("user_session")?.value || undefined;

    // Derive customerPhone from shipping address or explicit field
    const customerPhone =
      body.customerPhone ||
      body.shippingAddress?.phone ||
      undefined;

    const order = await createOrder({
      id: generateId("order"),
      createdAt: new Date().toISOString(),
      status: "pending",
      userId,
      customerPhone,
      ...body,
    });

    // Increment discount usage if a code was applied
    if (body.discountCode) {
      const discount = await getDiscountByCode(body.discountCode);
      if (discount) {
        await updateDiscount(discount.id, { usedCount: discount.usedCount + 1 });
      }
    }

    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
