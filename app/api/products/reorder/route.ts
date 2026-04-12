import { NextRequest, NextResponse } from "next/server";
import { reorderProducts } from "@/lib/data";

export async function PATCH(request: NextRequest) {
  try {
    const body: { id: string; sortOrder: number }[] = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Expected an array" }, { status: 400 });
    }
    await reorderProducts(body);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to reorder products" },
      { status: 500 }
    );
  }
}
