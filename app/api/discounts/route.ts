import { NextRequest, NextResponse } from "next/server";
import { getDiscounts, createDiscount } from "@/lib/data";
import { generateId } from "@/lib/utils";

export async function GET() {
  try {
    const discounts = await getDiscounts();
    return NextResponse.json(discounts);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch discounts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const discount = await createDiscount({
      id: generateId("disc"),
      usedCount: 0,
      ...body,
      code: body.code.toUpperCase(),
    });
    return NextResponse.json(discount, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create discount" },
      { status: 500 }
    );
  }
}
