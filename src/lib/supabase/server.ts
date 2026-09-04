import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/config";

/**
 * A request-scoped client that reads the visitor's session from cookies.
 *
 * Used by the admin layout to decide whether someone is signed in and listed
 * in `public.admins`, and by the public pages to read content. On the public
 * side there is no session, so the anon key applies and only rows the
 * "public reads live rows" policy allows come back.
 */
export async function createServerSupabase(): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components cannot set cookies. The middleware refreshes the
          // session on every request, so a failure here is expected and safe
          // to swallow rather than crash the render.
        }
      },
    },
  });
}

/**
 * Whether the current request belongs to a signed-in administrator.
 *
 * `getUser()` rather than `getSession()`: the former re-validates the token
 * with Supabase, so a revoked or forged cookie cannot walk past the guard.
 * The `admins` row is then the second gate — having an account in the project
 * is not the same as being allowed into the panel.
 */
export async function getAdminUser() {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, isAdmin: false as const, supabase };

  const { data } = await supabase
    .from("admins")
    .select("user_id, email, full_name")
    .eq("user_id", user.id)
    .maybeSingle();

  return { user, isAdmin: Boolean(data), supabase };
}
