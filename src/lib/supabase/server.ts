import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/proposal";

/**
 * Server-only Supabase client for the proposals API route. Uses the anon
 * key deliberately, not the service role key: RLS on `proposals` only
 * grants INSERT to anon/authenticated (see supabase/migrations), so even if
 * this key leaked it could not be used to read, edit, or delete existing
 * proposals. Reading/managing proposals happens exclusively through the
 * Supabase Dashboard Table Editor.
 */
export function createSupabaseServerClient(): SupabaseClient<Database> {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables. See .env.example.",
    );
  }

  return createClient<Database>(url, anonKey, {
    auth: { persistSession: false },
  });
}
