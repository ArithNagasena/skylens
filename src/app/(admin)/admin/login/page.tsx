import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getAdminUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * The way in.
 *
 * Sits outside the panel's guarded group, so a signed-out visitor lands here
 * rather than being bounced between the guard and itself. The reverse case is
 * handled below: an admin who is already signed in has no business on a login
 * form, so they go straight through.
 */
export default async function AdminLoginPage() {
  if (isSupabaseConfigured()) {
    const { isAdmin } = await getAdminUser();
    if (isAdmin) redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16">
      <LoginForm configured={isSupabaseConfigured()} />
    </div>
  );
}
