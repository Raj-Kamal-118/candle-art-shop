import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const userId = req.cookies.get("user_session")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { issueType, description, imageUrl, contactEmail, contactPhone } = body;

    if (!issueType || !description || !contactEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify order belongs to this user
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, user_id")
      .eq("id", params.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.user_id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error: insertError } = await supabase.from("order_issues").insert({
      order_id: params.id,
      customer_email: contactEmail,
      customer_phone: contactPhone || null,
      issue_type: issueType,
      description,
      image_url: imageUrl || null,
      status: "pending",
    });

    if (insertError) throw insertError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
