"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Banknote,
  FileText,
  Image as ImageIcon,
  LayoutGrid,
  LogOut,
  Menu,
  Receipt,
  Images,
  Wrench,
  X,
  Film,
} from "lucide-react";

import { brand } from "@/content/brand";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

/**
 * The panel's navigation.
 *
 * On a deep navy ground, matching the site's nav and footer: the light theme
 * is anchored by dark surfaces, and a white sidebar against a near-white page
 * would leave the whole screen without a fixed point. It also draws a hard
 * line between "you are editing the site" and the site itself.
 *
 * Sections are grouped by what the person came to do — change what the public
 * sees, raise a document, or look at the money — rather than by which table
 * each screen happens to write to.
 */

const groups: { label: string; items: { href: string; label: string; icon: typeof LayoutGrid }[] }[] = [
  {
    label: "Website",
    items: [
      { href: "/admin", label: "Overview", icon: LayoutGrid },
      { href: "/admin/hero", label: "Hero photos", icon: ImageIcon },
      { href: "/admin/latest-work", label: "Latest work strip", icon: Images },
      { href: "/admin/videos", label: "Recent projects", icon: Film },
      { href: "/admin/services", label: "Services & prices", icon: Wrench },
      { href: "/admin/projects", label: "Portfolio projects", icon: LayoutGrid },
    ],
  },
  {
    label: "Documents",
    items: [
      { href: "/admin/quotations", label: "Quotations", icon: FileText },
      { href: "/admin/bills", label: "Bills", icon: Receipt },
    ],
  },
  {
    label: "Accounts",
    items: [{ href: "/admin/finance", label: "Finance", icon: Banknote }],
  },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const signOut = async () => {
    setSigningOut(true);
    await createClient().auth.signOut();
    // `refresh()` as well as `push()`: the layout above is a Server Component
    // that read the session on the server, so without it the panel would keep
    // rendering from cache for a user who has just signed out.
    router.replace("/admin/login");
    router.refresh();
  };

  const nav = (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
      {groups.map((group) => (
        <div key={group.label} className="flex flex-col gap-1">
          <p className="px-3 pb-1 font-mono text-micro uppercase tracking-[0.2em] text-white/40">
            {group.label}
          </p>
          {group.items.map((item) => {
            // Exact match for the overview, prefix match for everything else —
            // otherwise "/admin" would light up on every page in the panel.
            const active =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-meta transition-colors duration-200",
                  active
                    ? "bg-white/[0.14] font-medium text-white"
                    : "text-white/70 hover:bg-white/[0.07] hover:text-white",
                )}
              >
                <Icon className="size-4 shrink-0" strokeWidth={1.9} />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );

  const footer = (
    <div className="border-t border-white/10 px-5 py-4">
      <p className="truncate text-micro text-white/50">{email}</p>
      <button
        type="button"
        onClick={signOut}
        disabled={signingOut}
        className="mt-2 inline-flex items-center gap-2 text-meta text-white/80 transition-colors hover:text-white disabled:opacity-50"
      >
        <LogOut className="size-4" strokeWidth={1.9} />
        {signingOut ? "Signing out…" : "Sign out"}
      </button>
    </div>
  );

  const header = (
    <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
      <Image
        src={brand.markLight.src}
        alt=""
        width={brand.markLight.width}
        height={brand.markLight.height}
        className="h-7 w-auto"
      />
      <span className="font-display text-meta font-semibold tracking-tight text-white">
        Sky Lens admin
      </span>
    </div>
  );

  return (
    <>
      {/* Mobile bar. The sidebar is a fixed 16rem column on desktop, which is
          more screen than a phone has to give — so below `lg` it collapses to
          a bar and a drawer. */}
      <div className="sticky top-0 z-40 flex items-center justify-between gap-3 bg-deep px-4 py-3 lg:hidden print:hidden">
        <span className="font-display text-meta font-semibold text-white">Sky Lens admin</span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid size-9 place-items-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 flex flex-col bg-deep pt-14 lg:hidden">
          {nav}
          {footer}
        </div>
      )}

      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-deep lg:flex print:hidden">
        {header}
        {nav}
        {footer}
      </aside>
    </>
  );
}
