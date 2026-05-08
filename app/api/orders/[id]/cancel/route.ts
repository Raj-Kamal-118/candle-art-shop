import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isAdmin, unauthorized } from "@/lib/auth-guard";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("id, user_id, status")
      .eq("id", params.id)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    if (!isAdmin(req)) {
      const userId = req.cookies.get("user_session")?.value;
      if (!userId || order.user_id !== userId) return unauthorized();
    }

    const { error } = await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
