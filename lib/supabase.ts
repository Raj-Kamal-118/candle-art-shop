import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// Check if we are running in the browser or on the server
const isBrowser = typeof window !== "undefined";

// Use the public anon key in the browser, and the service role key on the server
const supabaseKey = isBrowser ? process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY! : process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
