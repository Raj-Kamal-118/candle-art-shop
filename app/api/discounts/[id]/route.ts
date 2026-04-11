import { NextRequest, NextResponse } from "next/server";
import { getDiscountById, updateDiscount, deleteDiscount } from "@/lib/data";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const discount = await getDiscountById(params.id);
    if (!discount) {
      return NextResponse.json(
        { error: "Discount not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(discount);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch discount" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const discount = await updateDiscount(params.id, body);
    if (!discount) {
      return NextResponse.json(
        { error: "Discount not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(discount);
  } catch {
    return NextResponse.json(
      { error: "Failed to update discount" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteDiscount(params.id);
    if (!success) {
      return NextResponse.json(
        { error: "Discount not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete discount" },
      { status: 500 }
    );
  }
}
