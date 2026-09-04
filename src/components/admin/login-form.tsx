"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { brand } from "@/content/brand";
import { createClient } from "@/lib/supabase/client";
import { Button, Field, Input, StatusLine, type Status } from "@/components/admin/ui";

/**
 * Email and password against Supabase Auth.
 *
 * There is no sign-up here on purpose. Accounts are created in the Supabase
 * dashboard and then granted access by a row in `public.admins`; a public
 * registration form on an admin panel would let anyone create the account half
 * of that pair, which is one dashboard mistake away from being enough.
 *
 * The error message is deliberately the one Supabase returns rather than
 * something friendlier: "Invalid login credentials" is the same answer for a
 * wrong password and an unknown address, and keeping it that way is what stops
 * the form confirming which addresses have accounts.
 */
export function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setStatus(null);

    const { error } = await createClient().auth.signInWithPassword({ email, password });

    if (error) {
      setStatus({ kind: "error", message: error.message });
      setBusy(false);
      return;
    }

    // `refresh()` before navigating: the panel's layout reads the session on
    // the server, and without a refresh it would still be working from the
    // signed-out render it produced a moment ago.
    router.refresh();
    router.replace("/admin");
  };

  return (
    <div className="card w-full max-w-sm rounded-2xl p-7">
      <Image
        src={brand.lockup.src}
        alt="Sky Lens"
        width={brand.lockup.width}
        height={brand.lockup.height}
        className="h-12 w-auto"
      />

      <h1 className="mt-5 font-display text-title tracking-tight text-ink">Admin sign in</h1>
      <p className="mt-1 text-meta text-ink-muted">
        Manage the website, quotations, bills and accounts.
      </p>

      {!configured ? (
        <p className="mt-5 rounded-xl bg-amber-500/10 px-3.5 py-3 text-meta text-amber-800">
          No Supabase project is configured, so there is nothing to sign in to yet. See{" "}
          <code className="font-mono">supabase/README.md</code>.
        </p>
      ) : (
        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          <Field label="Email" required>
            <Input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@skylens.lk"
            />
          </Field>

          <Field label="Password" required>
            <Input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          <StatusLine status={status} />

          <Button type="submit" busy={busy} className="mt-1 h-11 w-full">
            Sign in
          </Button>
        </form>
      )}

      <p className="mt-6 text-micro text-ink-dim">
        <Link href="/" className="underline underline-offset-4 hover:text-ink">
          Back to the website
        </Link>
      </p>
    </div>
  );
}
