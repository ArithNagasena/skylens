import { BadgeCheck, CalendarClock, CloudRain, ShieldCheck } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { Reveal } from "@/components/ui/reveal";
import { clients } from "@/content/site";

/**
 * The reassurance strip, directly under the hero. A visitor who has just
 * landed is deciding whether this is a real operation or someone with a
 * hobby drone, and the four answers to that are regulatory, financial and
 * about what happens when something goes wrong — so they go here rather than
 * being buried on an About page nobody opens.
 *
 * Kept to a single band: four claims plus the client marquee, no headline.
 */
const guarantees = [
  {
    icon: BadgeCheck,
    title: "CAASL registered",
    body: "Civil Aviation Authority of Sri Lanka registered operator, proof supplied with every engagement.",
  },
  {
    icon: ShieldCheck,
    title: "Fully insured",
    body: "Public liability cover on every flight. We will name your organisation on the certificate.",
  },
  {
    icon: CalendarClock,
    title: "Permissions handled",
    body: "CAASL, Air Force, MoD and heritage clearances filed by us. You never touch aviation paperwork.",
  },
  {
    icon: CloudRain,
    title: "Weather reschedules free",
    body: "We make the call early, and you are never billed for a day we chose not to fly.",
  },
];

export function TrustBar() {
  return (
    <section aria-label="Why clients trust Sky Lens" className="relative border-y border-ink/[0.09] bg-obsidian">
      <div className="container-page">
        <dl className="grid gap-px overflow-hidden bg-ink/[0.08] sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map((g, i) => (
            <Reveal key={g.title} delay={Math.min(i * 0.06, 0.24)}>
              <div className="flex h-full flex-col gap-2.5 bg-obsidian px-1 py-8 sm:px-6">
                <span className="grid size-10 place-items-center rounded-xl bg-signal-soft text-signal">
                  <g.icon className="size-[1.15rem]" strokeWidth={1.7} />
                </span>
                <dt className="font-display text-body font-semibold tracking-tight text-ink">{g.title}</dt>
                <dd className="text-meta leading-relaxed text-ink-muted">{g.body}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>

      <div className="border-t border-ink/[0.09] py-5">
        <div className="container-page flex flex-col items-center gap-4 md:flex-row md:gap-8">
          <span className="shrink-0 font-mono text-micro uppercase tracking-[0.22em] text-ink-dim">
            Trusted by
          </span>
          <Marquee items={clients} className="w-full" label="Selected clients" />
        </div>
      </div>
    </section>
  );
}
