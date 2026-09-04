import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { ServiceIcon } from "@/components/ui/icon";
import { Chip, Section, SectionHeading, SpecRow } from "@/components/ui/primitives";
import { ProjectCard } from "@/components/work/project-card";
import { CallToAction } from "@/components/home/cta";
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/components/seo/json-ld";
import { getService, services } from "@/content/services";
import { getProject } from "@/content/projects";

type Params = { params: Promise<{ slug: string }> };

const accentHue = { signal: 211, beacon: 203, horizon: 218 } as const;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Service not found" };

  return {
    title: service.title,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.title} — Sky Lens`,
      description: service.summary,
      url: `/services/${service.slug}`,
    },
  };
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = service.relatedWork.map(getProject).filter((p) => p !== undefined);
  const others = services.filter((s) => s.slug !== service.slug).slice(0, 4);

  return (
    <>
      <BreadcrumbJsonLd
        trail={[
          { name: "Services", href: "/services" },
          { name: service.title, href: `/services/${service.slug}` },
        ]}
      />
      <ServiceJsonLd name={service.title} description={service.summary} slug={service.slug} />

      <PageHero
        eyebrow={service.short}
        crumbs={[
          { name: "Services", href: "/services" },
          { name: service.title, href: `/services/${service.slug}` },
        ]}
        title={service.title}
        lede={service.summary}
        seed={service.slug.length * 811}
        hue={accentHue[service.accent]}
        meta={[
          { label: "Starting at", value: service.startingAt },
          { label: "Turnaround", value: service.turnaround },
          { label: "Discipline", value: service.short },
          { label: "Airspace", value: "Handled in-house" },
        ]}
      >
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button href={`/contact?service=${service.slug}`} arrow>
            Request a quote
          </Button>
          <Button href="/work" variant="secondary">
            See related work
          </Button>
        </div>
      </PageHero>

      {/* ------------------------------------------------------- pull quote */}
      <Section tight className="border-y border-ink/[0.09] bg-obsidian">
        <div className="container-page">
          <Reveal>
            <div className="flex items-start gap-5 md:gap-8">
              <span className="hidden size-14 shrink-0 place-items-center rounded-2xl bg-signal/10 text-signal md:grid">
                <ServiceIcon name={service.icon} className="size-6" />
              </span>
              <p className="max-w-4xl text-balance font-display text-2xl leading-[1.25] tracking-[-0.022em] text-ink md:text-[2.1rem]">
                {service.heroLine}
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ---------------------------------------------- capabilities + specs */}
      <Section>
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div className="flex flex-col gap-12">
              <Reveal>
                <div className="flex flex-col gap-6">
                  <h2 className="text-2xl tracking-tight md:text-3xl">What the engagement covers</h2>
                  <ul className="flex flex-col gap-px overflow-hidden rounded-2xl bg-ink/[0.07] hairline">
                    {service.capabilities.map((c) => (
                      <li key={c} className="flex items-start gap-3.5 bg-raised px-5 py-4">
                        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-signal/15 text-signal">
                          <Check className="size-3" strokeWidth={2.6} />
                        </span>
                        <span className="text-body leading-relaxed text-ink">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal>
                <div className="flex flex-col gap-6">
                  <h2 className="text-2xl tracking-tight md:text-3xl">What you receive</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {service.deliverables.map((d, i) => (
                      <div
                        key={d}
                        className="card card-interactive group relative flex flex-col gap-3 overflow-hidden rounded-2xl p-5"
                      >
                        <span className="font-mono text-micro tracking-[0.18em] text-signal">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p className="text-body leading-relaxed text-ink">{d}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <div className="flex flex-col gap-6">
                  <h2 className="text-2xl tracking-tight md:text-3xl">Where clients use it</h2>
                  <div className="flex flex-wrap gap-2.5">
                    {service.useCases.map((u) => (
                      <span
                        key={u}
                        className="rounded-full bg-ink/[0.06] px-4 py-2 text-meta text-ink-muted hairline transition-colors hover:bg-signal-soft hover:text-signal"
                      >
                        {u}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* ------------------------------------------------ sticky rail */}
            <aside className="lg:sticky lg:top-32 lg:self-start">
              <div className="flex flex-col gap-4">
                <div className="card rounded-2xl p-6">
                  <h2 className="font-mono text-micro uppercase tracking-[0.22em] text-signal">
                    Technical specification
                  </h2>
                  <div className="mt-3">
                    {service.specs.map((s) => (
                      <SpecRow key={s.label} label={s.label} value={s.value} />
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-b from-signal/[0.1] to-transparent p-6 hairline">
                  <h2 className="text-lead tracking-tight">Get a fixed quote</h2>
                  <p className="mt-2 text-meta leading-relaxed text-ink-muted">
                    Send the site location and the deadline. We check airspace feasibility before we
                    quote, so the number you get is the number you pay.
                  </p>
                  <Button href={`/contact?service=${service.slug}`} className="mt-5 w-full" arrow>
                    Request a quote
                  </Button>
                  <p className="mt-3 text-center font-mono text-micro uppercase tracking-[0.16em] text-ink-dim">
                    Answered within one business day
                  </p>
                </div>

                <div className="rounded-2xl bg-ink/[0.06] p-6 hairline">
                  <h2 className="font-mono text-micro uppercase tracking-[0.22em] text-signal">
                    Other disciplines
                  </h2>
                  <ul className="mt-3 flex flex-col">
                    {others.map((o) => (
                      <li key={o.slug} className="border-b border-ink/[0.09] last:border-0">
                        <Link
                          href={`/services/${o.slug}`}
                          className="group flex items-center justify-between gap-3 py-3 text-body text-ink-muted transition-colors hover:text-signal"
                        >
                          {o.title}
                          <ArrowUpRight
                            className="size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                            strokeWidth={2}
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </Section>

      {/* ----------------------------------------------------- related work */}
      {related.length > 0 && (
        <Section tight className="border-t border-ink/[0.09] bg-obsidian">
          <div className="container-page">
            <SectionHeading
              eyebrow="Proof"
              title="Where this has been flown before"
              action={
                <Button href="/work" variant="secondary" arrow>
                  All case studies
                </Button>
              }
            />
            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.08}>
                  <ProjectCard project={p} className="h-full" />
                </Reveal>
              ))}
            </div>
          </div>
        </Section>
      )}

      <Section tight>
        <div className="container-page">
          <div className="flex flex-wrap items-center gap-3">
            <Chip tone="signal">Explore</Chip>
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className={
                  s.slug === service.slug
                    ? "rounded-full bg-brand px-4 py-2 text-meta font-medium text-white"
                    : "rounded-full bg-ink/[0.06] px-4 py-2 text-meta text-ink-muted hairline transition-colors hover:bg-ink/[0.12] hover:text-ink"
                }
              >
                {s.short}
              </Link>
            ))}
          </div>
        </div>
      </Section>

      <CallToAction />
    </>
  );
}
