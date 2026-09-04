"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/config";

/**
 * The browser client, used by every admin screen.
 *
 * Admin CRUD runs from the browser rather than through server actions on
 * purpose: image uploads go straight to Supabase Storage, which sidesteps the
 * request body limit a server action would impose on a multi-megabyte photo,
 * and every write is still checked by the same row-level security policies —
 * the panel has no privileges the signed-in user does not already have.
 *
 * One instance is memoised per tab. Creating a second would mean two copies of
 * the auth state listening to the same storage key.
 */
let cached: SupabaseClient | null = null;

export function createClient(): SupabaseClient {
  if (!cached) {
    cached = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return cached;
}
