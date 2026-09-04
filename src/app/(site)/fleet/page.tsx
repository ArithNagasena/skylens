import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Section } from "@/components/ui/primitives";
import { ServiceIcon } from "@/components/ui/icon";
import { FleetHero } from "@/components/fleet/fleet-hero";
import { FleetFilms } from "@/components/fleet/fleet-films";
import { VideoBanner } from "@/components/fleet/video-banner";
import { CallToAction } from "@/components/home/cta";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { capabilities, fleet, type Aircraft } from "@/content/fleet";

export const metadata: Metadata = {
  title: "Our Drone Fleet",
  description:
    "The DJI Air 3S for 4K cinematic film, ActiveTrack and automated waypoint missions, and the DJI Agras T50 for 50 kg heavy-lift work — aerial flower drops, flag carrying, crop spraying and site logistics.",
  alternates: { canonical: "/fleet" },
};

/** A short topic name and a rule, in place of a full section heading block. */
function GroupHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-5">
      <h2 className="shrink-0 font-display text-title tracking-tight text-ink md:text-2xl">
        {children}
      </h2>
      <span aria-hidden="true" className="h-px flex-1 bg-ink/[0.13]" />
    </div>
  );
}

function AircraftBlock({ craft, index }: { craft: Aircraft; index: number }) {
  // Alternate the ground so the two aircraft read as distinct blocks rather
  // than one long scroll of cards.
  const banded = index % 2 === 1;

  return (
    <Section
      tight
      className={banded ? "border-y border-ink/[0.09] bg-obsidian" : undefined}
      id={index === 0 ? "aircraft" : undefined}
    >
      <div className="container-page scroll-mt-24">
        {/* ------------------------------------------------------- masthead */}
        <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14">
          <Reveal>
            <div className="flex flex-col gap-5">
              <span className="font-mono text-micro uppercase tracking-[0.3em] text-signal">
                {craft.order} — {craft.category}
              </span>
              <h3 className="font-display text-[2.1rem] leading-[1.05] tracking-[-0.025em] text-ink sm:text-5xl">
                {craft.name}
              </h3>
              <p className="max-w-xl text-pretty text-body leading-relaxed text-ink-muted">
                {craft.summary}
              </p>

              <dl className="mt-1 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-ink/[0.09] sm:grid-cols-3">
                {craft.specs.map((s) => (
                  <div key={s.label} className="flex flex-col gap-0.5 bg-raised px-4 py-3">
                    <dt className="font-mono text-micro uppercase tracking-[0.14em] text-ink-dim">
                      {s.label}
                    </dt>
                    <dd className="text-meta font-medium text-ink">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="card relative aspect-[16/11] w-full overflow-hidden rounded-2xl bg-obsidian">
              <Image
                src={craft.poster}
                alt={craft.name}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep/45 to-transparent" />
            </div>
          </Reveal>
        </div>

        {/* ---------------------------------------------------------- banner */}
        {craft.bannerVideo && (
          <div className="mt-12">
            <VideoBanner
              src={craft.bannerVideo}
              poster={craft.poster}
              label={`${craft.name} in flight`}
            />
          </div>
        )}

        {/* -------------------------------------------------------- features */}
        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {craft.features.map((f) => (
            <RevealItem key={f.title} className="h-full">
              <div className="card card-interactive flex h-full flex-col gap-3 rounded-2xl p-6">
                <span className="grid size-11 place-items-center rounded-xl bg-signal-soft text-signal">
                  <ServiceIcon name={f.icon} className="size-5" />
                </span>
                <h4 className="font-display text-title leading-snug tracking-tight text-ink">
                  {f.title}
                </h4>
                <p className="text-meta leading-relaxed text-ink-muted">{f.body}</p>
                <ul className="mt-auto flex flex-col gap-1.5 border-t border-ink/[0.1] pt-4">
                  {f.items.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-meta text-ink-dim">
                      <span className="mt-[0.45rem] size-1 shrink-0 rounded-full bg-signal/70" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* ---------------------------------------------------- applications */}
        <Reveal delay={0.1}>
          <div className="mt-10">
            <GroupHeading>What we fly it for</GroupHeading>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {craft.applications.map((a) => (
                <div key={a.title} className="flex flex-col gap-2">
                  <span className="font-mono text-micro uppercase tracking-[0.18em] text-signal">
                    {a.title}
                  </span>
                  <ul className="flex flex-wrap gap-1.5">
                    {a.items.map((it) => (
                      <li
                        key={it}
                        className="rounded-full bg-ink/[0.05] px-2.5 py-1 text-micro text-ink-muted ring-1 ring-inset ring-ink/[0.08]"
                      >
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

export default function FleetPage() {
  return (
    <>
      <BreadcrumbJsonLd trail={[{ name: "Fleet", href: "/fleet" }]} />

      <FleetHero />

      {fleet.map((craft, i) => (
        <AircraftBlock key={craft.slug} craft={craft} index={i} />
      ))}

      {/* --------------------------------------------------------- the films */}
      <Section id="films" tight className="scroll-mt-24">
        <div className="container-page">
          <GroupHeading>The fleet in action</GroupHeading>
          <div className="mt-8">
            <FleetFilms />
          </div>
        </div>
      </Section>

      {/* --------------------------------------------------- what this buys */}
      <Section tight className="border-t border-ink/[0.09] bg-obsidian">
        <div className="container-page">
          <GroupHeading>What the fleet lets us take on</GroupHeading>
          <RevealGroup className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((c) => (
              <RevealItem key={c}>
                <div className="flex items-center gap-3 rounded-xl bg-raised px-4 py-3 ring-1 ring-inset ring-ink/[0.09]">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-signal-soft text-signal">
                    <Check className="size-3.5" strokeWidth={2.4} />
                  </span>
                  <span className="text-meta text-ink">{c}</span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      <CallToAction />
    </>
  );
}
