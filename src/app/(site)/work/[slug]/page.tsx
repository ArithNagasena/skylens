import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Chip, Section, SectionHeading } from "@/components/ui/primitives";
import { TerrainField } from "@/components/visuals/terrain-field";
import { ScanBeam } from "@/components/visuals/atmosphere";
import { CallToAction } from "@/components/home/cta";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { getProject, projects } from "@/content/projects";
import { getService } from "@/content/services";
import { testimonials } from "@/content/testimonials";
import { hudCoords } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Case study not found" };

  return {
    title: project.title,
    description: project.excerpt,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      title: `${project.title} — Sky Lens`,
      description: project.excerpt,
      url: `/work/${project.slug}`,
    },
  };
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const quote = testimonials.find((t) => t.project === project.slug);
  const usedServices = project.services.map(getService).filter((s) => s !== undefined);
  const hud = hudCoords(project.seed);

  return (
    <>
      <BreadcrumbJsonLd
        trail={[
          { name: "Work", href: "/work" },
          { name: project.title, href: `/work/${project.slug}` },
        ]}
      />

      <PageHero
        eyebrow={`${project.client} · ${project.category}`}
        crumbs={[
          { name: "Work", href: "/work" },
          { name: project.title, href: `/work/${project.slug}` },
        ]}
        title={project.title}
        lede={project.excerpt}
        seed={project.seed}
        hue={project.hue}
        meta={[
          { label: "Client", value: project.client },
          { label: "Location", value: project.location },
          { label: "Year", value: String(project.year) },
          { label: "Discipline", value: project.category },
        ]}
      />

      {/* ------------------------------------------------------ hero plate */}
      <div className="container-page">
        <Reveal>
          <figure className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-obsidian hairline md:aspect-[21/9]">
            <TerrainField seed={project.seed} hue={project.hue} rings={20} />
            <ScanBeam />
            <div className="pointer-events-none absolute inset-0 p-5 font-mono text-micro uppercase tracking-[0.18em] md:p-7">
              <div className="flex items-start justify-between">
                <span className="rounded-full bg-raised/70 px-2.5 py-1 text-signal backdrop-blur-sm">
                  {project.location}
                </span>
                <span className="rounded-full bg-raised/70 px-2.5 py-1 text-ink-muted backdrop-blur-sm">
                  Survey plate · {project.year}
                </span>
              </div>
              <div className="absolute bottom-5 left-5 flex flex-col gap-1 text-ink-muted md:bottom-7 md:left-7">
                <span>
                  {hud.lat} · {hud.lon}
                </span>
                <span className="text-signal">{hud.alt}</span>
              </div>
            </div>
            <figcaption className="sr-only">
              Generated survey plate representing the {project.title} site for {project.client}.
            </figcaption>
          </figure>
        </Reveal>
      </div>

      {/* --------------------------------------------------------- results */}
      <Section tight>
        <div className="container-page">
          <Reveal>
            <dl className="grid gap-px overflow-hidden rounded-2xl bg-ink/[0.07] hairline sm:grid-cols-3">
              {project.results.map((r) => (
                <div key={r.label} className="flex flex-col gap-2 bg-raised px-6 py-8">
                  <dd className="font-display text-4xl tracking-[-0.028em] text-signal md:text-5xl">
                    {r.metric}
                  </dd>
                  <dt className="text-body text-ink-muted">{r.label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Section>

      {/* ------------------------------------------------- challenge/approach */}
      <Section tight>
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <Reveal>
                <div className="flex flex-col gap-6">
                  <SectionHeading eyebrow="The brief" title="What they were up against" />
                  <p className="text-pretty text-body leading-relaxed text-ink-muted md:text-body">
                    {project.challenge}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {usedServices.map((s) => (
                      <Link key={s.slug} href={`/services/${s.slug}`}>
                        <Chip tone="signal">{s.short}</Chip>
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="flex flex-col gap-12">
              <Reveal>
                <div className="flex flex-col gap-6">
                  <h2 className="text-2xl tracking-tight md:text-3xl">How we flew it</h2>
                  <ol className="flex flex-col gap-px overflow-hidden rounded-2xl bg-ink/[0.07] hairline">
                    {project.approach.map((a, i) => (
                      <li key={a} className="flex gap-4 bg-raised px-5 py-5">
                        <span className="font-mono text-micro tracking-[0.16em] text-signal">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-body leading-relaxed text-ink">{a}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </Reveal>

              <Reveal>
                <div className="flex flex-col gap-6">
                  <h2 className="text-2xl tracking-tight md:text-3xl">What was delivered</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {project.deliverables.map((d) => (
                      <div
                        key={d}
                        className="card rounded-2xl p-5 text-body leading-relaxed text-ink"
                      >
                        {d}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </Section>

      {/* ----------------------------------------------------------- quote */}
      {quote && (
        <Section tight className="border-y border-ink/[0.09] bg-obsidian">
          <div className="container-page">
            <Reveal>
              <figure className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
                <blockquote className="text-balance font-display text-2xl leading-[1.3] tracking-[-0.022em] text-ink md:text-[2.1rem]">
                  &ldquo;{quote.quote}&rdquo;
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <span
                    className="grid size-11 place-items-center rounded-full font-mono text-meta"
                    style={{
                      background: `oklch(0.32 0.09 ${quote.hue})`,
                      color: `oklch(0.88 0.13 ${quote.hue})`,
                    }}
                    aria-hidden="true"
                  >
                    {quote.initials}
                  </span>
                  <span className="flex flex-col text-left">
                    <span className="text-body font-medium text-ink">{quote.name}</span>
                    <span className="text-meta text-ink-dim">
                      {quote.role}, {quote.company}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </Section>
      )}

      {/* ------------------------------------------------------- prev/next */}
      <Section tight>
        <div className="container-page">
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href={`/work/${prev.slug}`}
              className="card card-interactive group flex flex-col gap-2 rounded-2xl p-6"
            >
              <span className="inline-flex items-center gap-2 font-mono text-micro uppercase tracking-[0.18em] text-ink-dim">
                <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" strokeWidth={2} />
                Previous
              </span>
              <span className="text-lead tracking-tight transition-colors group-hover:text-signal">
                {prev.title}
              </span>
              <span className="text-meta text-ink-dim">{prev.client}</span>
            </Link>

            <Link
              href={`/work/${next.slug}`}
              className="card card-interactive group flex flex-col items-end gap-2 rounded-2xl p-6 text-right"
            >
              <span className="inline-flex items-center gap-2 font-mono text-micro uppercase tracking-[0.18em] text-ink-dim">
                Next
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" strokeWidth={2} />
              </span>
              <span className="text-lead tracking-tight transition-colors group-hover:text-signal">
                {next.title}
              </span>
              <span className="text-meta text-ink-dim">{next.client}</span>
            </Link>
          </div>

          <div className="mt-8 flex justify-center">
            <Button href="/work" variant="ghost">
              &larr; Back to all case studies
            </Button>
          </div>
        </div>
      </Section>

      <CallToAction />
    </>
  );
}
