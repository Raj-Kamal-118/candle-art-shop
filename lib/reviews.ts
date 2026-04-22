import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getApprovedReviews() {
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false });
  return data || [];
}

export async function getReviewById(id: string) {
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("id", id)
    .eq("approved", true)
    .maybeSingle();
  return data;
}