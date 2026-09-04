import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Chip, Section, SectionHeading } from "@/components/ui/primitives";
import { Marquee } from "@/components/ui/marquee";
import { TerrainField } from "@/components/visuals/terrain-field";
import { HorizonRule, ScanBeam } from "@/components/visuals/atmosphere";
import { Process } from "@/components/home/process";
import { CallToAction } from "@/components/home/cta";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { coverage, team, timeline, values } from "@/content/company";
import { clients, credentials } from "@/content/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description:
    "Sky Lens is a nine-person aerial studio in Denver, Colorado. Part 107 licensed, $2M insured, 1,240 missions flown and zero safety incidents since 2019.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd trail={[{ name: "About", href: "/about" }]} />

      <PageHero
        eyebrow="About Sky Lens"
        crumbs={[{ name: "About", href: "/about" }]}
        title={
          <>
            Nine people, five aircraft, and a <span className="text-gradient">deeply boring safety record.</span>
          </>
        }
        lede="We started in 2019 shooting property listings at weekends. What changed since then was not the hardware. It was understanding that nobody buys flight time, they buy the decision the footage lets them make."
        seed={1188}
        meta={[
          { label: "Founded", value: "2019, Denver CO" },
          { label: "Crew", value: "9 full-time" },
          { label: "Missions", value: "1,240+ flown" },
          { label: "Incidents", value: "Zero" },
        ]}
      />

      {/* -------------------------------------------------------- narrative */}
      <Section tight>
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <Reveal>
              <div className="flex flex-col gap-6 text-pretty text-body leading-relaxed text-ink-muted md:text-body">
                <p className="font-display text-title leading-[1.4] tracking-[-0.02em] text-ink md:text-2xl">
                  The turning point was a quarry job in 2021 where the client did not want photographs.
                  They wanted to know whether the stockpile matched the invoice.
                </p>
                <p>
                  We had the aircraft, and we had a camera good enough to make the pile look
                  magnificent. What we did not have was any way to say how many tonnes were in it
                  with a number anyone would sign off on. We lost that job, bought an RTK airframe,
                  hired a licensed surveyor, and spent eight months learning why the accuracy figure
                  on a proposal is meaningless without the checkpoint residuals behind it.
                </p>
                <p>
                  That is the shape of the company now. Half of what we sell is still cinematic, and
                  we care enormously about it, because a resort film that does not move anyone is a
                  failed deliverable regardless of how sharp it is. The other half has to survive
                  scrutiny from an engineer who was not in the room, months later.
                </p>
                <p>
                  Both halves run on the same discipline: decide what the work has to prove, plan
                  backwards from that, and be honest at the quote stage when the answer is that a
                  drone is the wrong tool. We have talked several clients out of hiring us. Most of
                  them came back with a job that fit.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <figure className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-obsidian hairline">
                <TerrainField seed={2024} hue={196} rings={19} />
                <ScanBeam />
                <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-6">
                  <p className="font-mono text-micro uppercase tracking-[0.18em] text-signal">
                    Front Range operating area
                  </p>
                  <p className="mt-1 font-mono text-micro uppercase tracking-[0.18em] text-ink-dim">
                    39.7392 N · 104.9903 W
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ----------------------------------------------------------- values */}
      <Section tight className="border-y border-ink/[0.09] bg-obsidian">
        <div className="container-page">
          <SectionHeading eyebrow="How we operate" title="Four things we will not trade away." />
          <RevealGroup className="mt-12 grid gap-4 md:grid-cols-2">
            {values.map((v) => (
              <RevealItem
                key={v.title}
                className="card card-interactive group flex flex-col gap-3 rounded-2xl p-7"
              >
                <h3 className="text-title tracking-tight transition-colors group-hover:text-signal">
                  {v.title}
                </h3>
                <p className="text-body leading-relaxed text-ink-muted">{v.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ------------------------------------------------------------- team */}
      <Section tight>
        <div className="container-page">
          <SectionHeading
            eyebrow="The crew"
            title="Who actually shows up."
            lede="Four leads, plus five pilots and processing staff. On any given job you will be dealing with one named person from brief to handover."
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.07}>
                <article className="card card-interactive group flex h-full flex-col overflow-hidden rounded-2xl">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <TerrainField seed={m.hue * 71 + i * 137} hue={m.hue} rings={12} chrome={false} />
                    <div className="absolute inset-0 bg-gradient-to-t from-void via-void/50 to-transparent" />
                    <span
                      className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full font-display text-title tracking-tight backdrop-blur-md transition-transform duration-500 group-hover:scale-110"
                      style={{
                        background: `oklch(0.28 0.08 ${m.hue} / 0.75)`,
                        color: `oklch(0.9 0.13 ${m.hue})`,
                        boxShadow: `inset 0 0 0 1px oklch(0.7 0.12 ${m.hue} / 0.35)`,
                      }}
                      aria-hidden="true"
                    >
                      {m.initials}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <h3 className="text-lead tracking-tight">{m.name}</h3>
                    <p className="font-mono text-micro uppercase tracking-[0.16em] text-signal">{m.role}</p>
                    <p className="mt-1 text-meta leading-relaxed text-ink-muted">{m.bio}</p>
                    <div className="mt-auto pt-4">
                      <Chip>{m.focus}</Chip>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* --------------------------------------------------------- timeline */}
      <Section tight className="border-y border-ink/[0.09] bg-obsidian">
        <div className="container-page">
          <SectionHeading eyebrow="Trajectory" title="Seven years, in five moves." />

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-ink/[0.07] hairline md:grid-cols-5">
            {timeline.map((t, i) => (
              <Reveal key={t.year} delay={i * 0.06}>
                <div className="group flex h-full flex-col gap-3 bg-raised p-6 transition-colors duration-500 hover:bg-surface/50">
                  <span className="font-mono text-meta tracking-[0.16em] text-signal">{t.year}</span>
                  <h3 className="text-body leading-snug tracking-tight">{t.title}</h3>
                  <p className="text-meta leading-relaxed text-ink-muted">{t.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* --------------------------------------------------------- coverage */}
      <Section tight>
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
            <SectionHeading
              eyebrow="Where we fly"
              title="Based in Denver, deployed wherever the programme needs."
              lede={coverage.note}
            />

            <Reveal delay={0.1}>
              <ul className="flex flex-col gap-px overflow-hidden rounded-2xl bg-ink/[0.07] hairline">
                {coverage.regions.map((r) => (
                  <li
                    key={r.name}
                    className="flex items-center justify-between gap-4 bg-raised px-5 py-4 transition-colors hover:bg-surface/50"
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          r.status === "core" ? "bg-signal" : "bg-ink/25",
                        )}
                      />
                      <span className="text-body font-medium text-ink">{r.name}</span>
                    </span>
                    <span className="font-mono text-micro uppercase tracking-[0.16em] text-ink-dim">
                      {r.detail}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="mt-16">
            <HorizonRule />
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 py-8">
              {credentials.map((c) => (
                <div key={c.code} className="flex items-baseline gap-2.5">
                  <span className="font-mono text-meta font-medium tracking-wider text-signal">{c.code}</span>
                  <span className="text-meta text-ink-dim">{c.label}</span>
                </div>
              ))}
            </div>
            <HorizonRule />
            <Marquee items={clients} label="Selected clients" className="py-8" />
          </div>
        </div>
      </Section>

      <Process />
      <CallToAction />
    </>
  );
}
