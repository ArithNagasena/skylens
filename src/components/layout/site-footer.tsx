import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { LogoLockup } from "@/components/ui/logo";
import { HorizonRule } from "@/components/visuals/atmosphere";
import { contact, footerNav, site, socials } from "@/content/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-deep relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-64 left-1/2 h-[32rem] w-[64rem] -translate-x-1/2 rounded-full blur-[120px]"
        style={{ background: "radial-gradient(closest-side, rgba(43,130,216,0.20), transparent 75%)" }}
      />

      <div className="container-page relative">
        {/* ── Main row: logo/contact + nav columns ── */}
        <div className="grid gap-8 py-8 md:py-10 lg:grid-cols-[1fr_2.4fr]">
          {/* Left: brand + contact */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="inline-flex self-start" aria-label="Sky Lens — home">
              <LogoLockup onDeep />
            </Link>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex items-center gap-1.5 text-meta text-ink-muted transition-colors hover:text-signal"
              >
                <Mail className="size-3.5 text-signal" strokeWidth={1.7} />
                {contact.email}
              </a>
              <a
                href={contact.phoneHref}
                className="inline-flex items-center gap-1.5 text-meta text-ink-muted transition-colors hover:text-signal"
              >
                <Phone className="size-3.5 text-signal" strokeWidth={1.7} />
                {contact.phone}
              </a>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {socials.filter((s) => s.href).map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hairline rounded-full bg-white/[0.06] px-3 py-1 font-mono text-micro uppercase tracking-[0.16em] text-ink-muted transition-colors hover:bg-signal-soft hover:text-signal"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right: all 4 nav columns */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {footerNav.map((col) => (
              <nav key={col.title} aria-label={col.title} className="flex flex-col gap-2.5">
                <h2 className="font-mono text-micro uppercase tracking-[0.22em] text-signal">{col.title}</h2>
                <ul className="flex flex-col gap-1.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-meta text-ink-muted transition-colors hover:text-ink"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <HorizonRule />

        {/* ── Bottom bar ── */}
        <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-micro uppercase tracking-[0.16em] text-ink-dim">
            &copy; {year} {site.legalName}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-meta text-ink-dim transition-colors hover:text-ink">
              Privacy
            </Link>
            <Link href="/terms" className="text-meta text-ink-dim transition-colors hover:text-ink">
              Terms
            </Link>
            <span className="flex items-center gap-1.5 font-mono text-micro uppercase tracking-[0.16em] text-ink-dim">
              <span className="animate-blink size-1.5 rounded-full bg-signal" />
              Cleared for operation
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
