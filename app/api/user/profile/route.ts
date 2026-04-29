import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { userId, name, phone } = body;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update the custom public.users table (Database level)
    const { data: userRecord, error: dbError } = await supabase
      .from("users")
      .update({ name: name, phone: phone }) // adjust to full_name if your custom schema uses that
      .eq("id", userId)
      .select()
      .single();

    if (dbError && dbError.code !== 'PGRST116') throw dbError; // Ignore error if custom user record isn't explicitly found

    return NextResponse.json({ user: { id: userId, name, phone } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}