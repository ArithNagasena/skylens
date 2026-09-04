import Image from "next/image";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/primitives";

/**
 * Replaces the two full-bleed banners that used to sit either side of the
 * carousel. They were structurally identical — a photograph, a centred
 * heading, a paragraph — so the page spent two full screens making one point.
 * This says both things in a single screen, and pairs each aircraft with the
 * specification a client actually asks about.
 */
const aircraft = [
  {
    image: "/images/dji-air-3.jpg",
    alt: "DJI Air 3S cinematic drone in flight against a mountain backdrop",
    klass: "Cinematic",
    name: "DJI Air 3S",
    body:
      "Our workhorse for film. A dual-camera system covering wide and medium framing on the same flight, so a sequence cuts together without a lens change costing you the light.",
    specs: [
      { label: "Video", value: "4K / 120 fps" },
      { label: "Sensor", value: "Dual camera" },
      { label: "Flight time", value: "45 min" },
    ],
  },
  {
    image: "/images/specialized-drone.jpg",
    alt: "Heavy-lift DJI Agras T50 drone over open ground",
    klass: "Heavy lift",
    name: "DJI Agras T50",
    body:
      "The airframe behind the flower drops, flag hoisting and payload work at religious festivals and large weddings. Rated to 50 kg, flown with a spotter and a cleared drop corridor every time.",
    specs: [
      { label: "Payload", value: "Up to 50 kg" },
      { label: "Use", value: "Drops & hoisting" },
      { label: "Crew", value: "Pilot + spotter" },
    ],
  },
];

export function FleetBand() {
  return (
    <Section id="fleet" tight className="border-t border-ink/[0.09]">
      <div className="container-page">
        <SectionHeading
          eyebrow="The fleet"
          title="Two aircraft, two very different jobs."
          lede="Most operators own one drone and quote every job as if it suits. We fly a cinema platform for film and a heavy-lift airframe for payload work, and we tell you which one your brief needs before you pay for it."
          action={
            <Button href="/fleet" variant="secondary" arrow>
              Full fleet & specs
            </Button>
          }
        />

        <RevealGroup className="mt-12 grid gap-5 md:grid-cols-2">
          {aircraft.map((a) => (
            <RevealItem key={a.name}>
              <article className="card card-interactive group flex h-full flex-col overflow-hidden rounded-2xl">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-obsidian">
                  <Image
                    src={a.image}
                    alt={a.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-deep/85 px-3 py-1 font-mono text-micro uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                    {a.klass}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-4 p-6">
                  <h3 className="font-display text-title tracking-tight text-ink">{a.name}</h3>
                  <p className="text-body leading-relaxed text-ink-muted">{a.body}</p>

                  <dl className="mt-auto grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-ink/[0.09] pt-px">
                    {a.specs.map((s) => (
                      <div key={s.label} className="flex flex-col gap-0.5 bg-raised px-3 py-3">
                        <dt className="font-mono text-micro uppercase tracking-[0.14em] text-ink-dim">
                          {s.label}
                        </dt>
                        <dd className="text-meta font-medium text-ink">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.15}>
          <p className="mt-8 text-center font-mono text-micro uppercase tracking-[0.18em] text-ink-dim">
            Every flight logged · Batteries rotated for continuous event coverage · Backup airframe on site
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
