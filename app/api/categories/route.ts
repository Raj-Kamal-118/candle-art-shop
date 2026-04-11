import { NextRequest, NextResponse } from "next/server";
import { getCategories, createCategory } from "@/lib/data";
import { generateId, slugify } from "@/lib/utils";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const category = await createCategory({
      id: generateId("cat"),
      slug: slugify(body.name),
      createdAt: new Date().toISOString(),
      productCount: 0,
      ...body,
    });
    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
