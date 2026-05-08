import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// Browser gets the anon (public) key — safe to expose, enforces RLS.
// Server gets the service role key — bypasses RLS, must never be sent to clients.
const isBrowser = typeof window !== "undefined";
const supabaseKey = isBrowser
  ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  : process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
