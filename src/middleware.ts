import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/config";

/**
 * Keeps the admin session alive.
 *
 * Supabase access tokens are short-lived. Server Components cannot write
 * cookies, so without a middleware pass the refreshed token would be thrown
 * away and an admin would be bounced to the login screen roughly every hour,
 * mid-edit. This runs before the render, refreshes the token, and writes the
 * new cookies onto the outgoing response.
 *
 * It deliberately does not decide who is allowed in — `/admin` is guarded in
 * its layout, where the `admins` table can be consulted. Middleware runs on
 * the edge for every matched request, so it stays cheap.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return response;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
