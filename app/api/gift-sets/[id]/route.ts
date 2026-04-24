import { NextRequest, NextResponse } from "next/server";
import { getGiftSetById, updateGiftSet, deleteGiftSet } from "@/lib/gift-data";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const set = await getGiftSetById(id);
    if (!set) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(set);
  } catch {
    return NextResponse.json({ error: "Failed to fetch gift set" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { productIds, itemIds, ...updates } = body;
    const set = await updateGiftSet(id, updates, productIds ?? itemIds);
    return NextResponse.json(set);
  } catch {
    return NextResponse.json({ error: "Failed to update gift set" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteGiftSet(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete gift set" }, { status: 500 });
  }
}
