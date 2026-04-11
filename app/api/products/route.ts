import { NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/data";
import { generateId, slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");

    let products = await getProducts();

    if (categoryId) {
      products = products.filter((p) => p.categoryId === categoryId);
    }

    if (featured === "true") {
      products = products.filter((p) => p.featured);
    }

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const product = await createProduct({
      id: generateId("prod"),
      slug: slugify(body.name),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...body,
    });
    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
