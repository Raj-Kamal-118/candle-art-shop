import { NextRequest, NextResponse } from "next/server";
import { getGiftSets, createGiftSet } from "@/lib/gift-data";
import { generateId, slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const all = req.nextUrl.searchParams.get("all") === "true";
    const sets = await getGiftSets(!all);
    return NextResponse.json(sets);
  } catch {
    return NextResponse.json({ error: "Failed to fetch gift sets" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const set = await createGiftSet({
      id: generateId("gs"),
      slug: body.slug || slugify(body.name),
      name: body.name,
      tagline: body.tagline,
      description: body.description,
      occasions: body.occasions || [],
      price: body.price,
      saving: body.saving || 0,
      image: body.image,
      accent: body.accent || "var(--amber-600)",
      status: body.status || "draft",
      sortOrder: body.sortOrder ?? 0,
      productIds: body.productIds ?? body.itemIds ?? [],
    });
    return NextResponse.json(set, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create gift set" }, { status: 500 });
  }
}
