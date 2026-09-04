/**
 * Where the Supabase connection details live, and how the site behaves
 * without them.
 *
 * The public pages must keep rendering on a machine that has never seen a
 * Supabase project — a fresh clone, a preview build, a contributor who only
 * wants to change copy. So every read goes through `src/lib/cms/*`, which
 * checks this flag first and falls back to the static content in
 * `src/content/*` when it is false. Nothing on the customer side ever throws
 * because an environment variable is missing.
 *
 * The admin panel is the exception: it needs a real project, and says so
 * plainly rather than presenting forms that cannot save.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function isSupabaseConfigured(): boolean {
  return SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
}

/** The single public bucket every uploaded image goes into. */
export const MEDIA_BUCKET = "media";
