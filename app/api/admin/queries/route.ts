import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth-guard";

export async function GET(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  const { data, error } = await supabase
    .from("order_issues")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  const body = await req.json();
  const { id, status, adminNotes } = body;

  if (!id || !status) {
    return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
  }

  const updatePayload: Record<string, unknown> = { status };
  if (adminNotes !== undefined) updatePayload.admin_notes = adminNotes;

  const { data, error } = await supabase
    .from("order_issues")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
