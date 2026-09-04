import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/primitives";
import { TerrainField } from "@/components/visuals/terrain-field";
import { Aurora, GridBackdrop } from "@/components/visuals/atmosphere";
import { cn } from "@/lib/utils";

export type Crumb = { name: string; href: string };

export function PageHero({
  eyebrow,
  title,
  lede,
  crumbs,
  seed = 2200,
  hue = 196,
  children,
  meta,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: string;
  crumbs?: Crumb[];
  seed?: number;
  hue?: number;
  children?: React.ReactNode;
  meta?: { label: string; value: string }[];
  className?: string;
}) {
  return (
    <section className={cn("relative isolate overflow-hidden pb-16 pt-32 md:pb-20 md:pt-44", className)}>
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-40">
          <TerrainField seed={seed} hue={hue} rings={10} chrome={false} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-void/70 via-void/85 to-void" />
        <GridBackdrop />
        <Aurora />
      </div>

      <div className="container-page">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex flex-wrap items-center gap-1.5 font-mono text-micro uppercase tracking-[0.16em] text-ink-dim">
              <li>
                <Link href="/" className="transition-colors hover:text-signal">
                  Home
                </Link>
              </li>
              {crumbs.map((c, i) => (
                <li key={c.href} className="flex items-center gap-1.5">
                  <ChevronRight className="size-3 text-ink/20" strokeWidth={2} />
                  {i === crumbs.length - 1 ? (
                    <span aria-current="page" className="text-ink-muted">
                      {c.name}
                    </span>
                  ) : (
                    <Link href={c.href} className="transition-colors hover:text-signal">
                      {c.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="flex flex-col gap-6">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="max-w-4xl text-balance text-[2.4rem] leading-[1.02] tracking-[-0.028em] sm:text-5xl md:text-[3.6rem]">
            {title}
          </h1>
          {lede && (
            <p className="max-w-2xl text-pretty text-body leading-relaxed text-ink-muted md:text-lead">
              {lede}
            </p>
          )}
          {children}
        </div>

        {meta && meta.length > 0 && (
          <dl className="card elev-1 mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-ink/[0.1] md:grid-cols-4">
            {meta.map((m) => (
              <div key={m.label} className="flex flex-col gap-1.5 bg-raised px-5 py-5">
                <dt className="font-mono text-micro uppercase tracking-[0.18em] text-ink-dim">
                  {m.label}
                </dt>
                <dd className="text-body font-medium text-ink">{m.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
