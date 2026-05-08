import { NextRequest, NextResponse } from "next/server";
import { getDiscounts, createDiscount } from "@/lib/data";
import { generateId } from "@/lib/utils";
import { requireAdmin } from "@/lib/auth-guard";

export async function GET(request: NextRequest) {
  const deny = requireAdmin(request);
  if (deny) return deny;
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
  const deny = requireAdmin(request);
  if (deny) return deny;
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
