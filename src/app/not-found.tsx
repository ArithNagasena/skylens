import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/primitives";
import { TerrainField } from "@/components/visuals/terrain-field";
import { Aurora, Grain, GridBackdrop, ScanBeam } from "@/components/visuals/atmosphere";
import { primaryNav } from "@/content/site";

/**
 * The global 404.
 *
 * It renders the header and footer itself rather than inheriting them: an
 * unmatched URL falls outside every route group, so it gets the bare document
 * shell from the root layout and would otherwise arrive with no navigation at
 * all — the one page where a visitor most needs a way out.
 */
export default function NotFound() {
  return (
    <>
      <Grain />
      <SiteHeader />
      <section className="relative isolate flex min-h-screen items-center overflow-hidden py-32">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-40">
          <TerrainField seed={40404} hue={196} rings={20} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-void/80 via-void/90 to-void" />
        <GridBackdrop />
        <Aurora />
        <ScanBeam />
      </div>

      <div className="container-page">
        <div className="flex max-w-2xl flex-col gap-7">
          <Eyebrow>Signal lost</Eyebrow>

          <p className="font-mono text-micro uppercase tracking-[0.24em] text-ink-dim">
            Error 404 · No return from this coordinate
          </p>

          <h1 className="text-balance text-5xl leading-[0.95] tracking-[-0.022em] md:text-7xl">
            This page is <span className="text-gradient">outside our airspace.</span>
          </h1>

          <p className="max-w-lg text-pretty text-body leading-relaxed text-ink-muted md:text-lead">
            The link is broken, the page moved, or it never existed. Nothing has crashed — the flight
            controller simply has nowhere to navigate to.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <Button href="/" size="lg" arrow>
              Return to base
            </Button>
            <Button href="/contact" size="lg" variant="secondary">
              Request a quote
            </Button>
          </div>

          <nav aria-label="Site sections" className="mt-6 border-t border-ink/[0.08] pt-6">
            <p className="font-mono text-micro uppercase tracking-[0.22em] text-signal">
              Try one of these
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {primaryNav.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="inline-flex rounded-full bg-ink/[0.06] px-4 py-2 text-meta text-ink-muted hairline transition-colors hover:bg-ink/[0.12] hover:text-ink"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      </section>
      <SiteFooter />
    </>
  );
}
