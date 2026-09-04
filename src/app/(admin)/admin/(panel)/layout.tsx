import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminNav } from "@/components/admin/admin-nav";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getAdminUser } from "@/lib/supabase/server";

/**
 * The gate on every page in the panel.
 *
 * Three states, and they are genuinely different problems:
 *
 *   · No Supabase project configured — nothing can work, and no form should be
 *     shown, so this says what is missing instead.
 *   · Signed out — off to the login screen.
 *   · Signed in but not in `public.admins` — an account exists, but nobody has
 *     granted it access. Saying so plainly is what stops that being debugged
 *     as a broken password.
 *
 * Checking here rather than in middleware is what lets the `admins` table be
 * consulted at all: middleware runs on the edge, before any of this is
 * reachable. The middleware's job is only to keep the session token fresh.
 */
export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) return <NotConfigured />;

  const { user, isAdmin } = await getAdminUser();

  if (!user) redirect("/admin/login");
  if (!isAdmin) return <NotPermitted email={user.email ?? ""} />;

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminNav email={user.email ?? ""} />
      <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

function NotConfigured() {
  return (
    <Notice title="The admin panel is not connected yet">
      <p>
        Set <Code>NEXT_PUBLIC_SUPABASE_URL</Code> and <Code>NEXT_PUBLIC_SUPABASE_ANON_KEY</Code> in{" "}
        <Code>.env.local</Code>, then restart the dev server. The full setup — creating the project,
        running the two SQL files and granting yourself access — is written up in{" "}
        <Code>supabase/README.md</Code>.
      </p>
      <p className="mt-3">
        Until then the public site keeps working: every section falls back to the content that
        ships in <Code>src/content</Code>.
      </p>
    </Notice>
  );
}

function NotPermitted({ email }: { email: string }) {
  return (
    <Notice title="This account has no admin access">
      <p>
        You are signed in as <strong className="text-ink">{email}</strong>, but that account is not
        listed in the <Code>admins</Code> table, so the panel has nothing it is allowed to show you.
      </p>
      <p className="mt-3">
        Someone with database access can grant it with the <Code>insert into public.admins</Code>{" "}
        statement at the end of <Code>supabase/README.md</Code>.
      </p>
      <p className="mt-5">
        <Link href="/admin/login" className="text-signal underline underline-offset-4">
          Sign in with a different account
        </Link>
      </p>
    </Notice>
  );
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="card w-full max-w-xl rounded-2xl p-7">
        <h1 className="font-display text-title tracking-tight text-ink md:text-2xl">{title}</h1>
        <div className="mt-4 text-body leading-relaxed text-ink-muted">{children}</div>
      </div>
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-ink/[0.07] px-1.5 py-0.5 font-mono text-meta text-ink">
      {children}
    </code>
  );
}
