import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL as string | undefined;
const supabaseKey = process.env.SUPABASE_KEY as string | undefined;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase URL or Key in environment variables.");
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
