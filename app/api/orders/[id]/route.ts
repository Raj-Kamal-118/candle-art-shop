import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, paymentReference } = body;

    const updates: any = {};
    if (status) updates.status = status;
    if (paymentReference) updates.payment_reference = paymentReference;

    const { data, error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", params.id)
      .select();

    if (error) throw error;
    return NextResponse.json({ success: true, order: data[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update order" }, { status: 500 });
  }
}
