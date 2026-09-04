import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/config";

/**
 * A sessionless anon client for reading published content.
 *
 * Distinct from `createServerSupabase()` on purpose: that one reads cookies,
 * and anything that touches cookies cannot run inside `unstable_cache`, which
 * is how the public pages avoid hitting the database on every request. There
 * is no session to read here anyway — visitors are not signed in, and the
 * "public reads live rows" policy is what decides what comes back.
 */
export function createPublicSupabase(): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
