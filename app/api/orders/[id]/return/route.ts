import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = req.cookies.get("user_session")?.value;
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { itemsToReturn } = body; // Array of item indices [0, 2] etc.

    // Fetch the existing order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", params.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    let items = order.items || [];
    let allReturned = true;

    items = items.map((item: any, idx: number) => {
      if (itemsToReturn.includes(idx)) {
        item.return_status = "returning";
      }
      if (item.return_status !== "returning" && item.return_status !== "returned") {
        allReturned = false;
      }
      return item;
    });

    // If every item is returning/returned, mark the whole order as returning. Otherwise, partially returning.
    const newStatus = allReturned ? "returning" : "partially_returning";

    // Update the order in the database
    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update({ status: newStatus, items: items, refund_status: "pending" })
      .eq("id", params.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}