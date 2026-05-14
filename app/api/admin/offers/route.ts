import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { revalidateTag } from "next/cache";

export async function GET() {
  const { data, error } = await supabase
    .from("store_offers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { data, error } = await supabase
    .from("store_offers")
    .insert([body])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidateTag("offers"); // Instantly update homepage cache
  return NextResponse.json(data);
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, ...updates } = body;
  const { data, error } = await supabase
    .from("store_offers")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidateTag("offers");
  return NextResponse.json(data);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const { error } = await supabase.from("store_offers").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidateTag("offers");
  return NextResponse.json({ success: true });
}