import { Mail, Phone } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/primitives";
import { TerrainField } from "@/components/visuals/terrain-field";
import { Aurora, ScanBeam } from "@/components/visuals/atmosphere";
import { contact, credentials } from "@/content/site";

export function CallToAction() {
  return (
    <section className="relative py-20 md:py-24">
      <div className="container-page">
        <Reveal>
          <div className="on-deep relative overflow-hidden rounded-3xl px-6 py-16 shadow-[0_36px_80px_-36px_rgba(11,37,64,0.55)] md:px-14 md:py-20">
            <div aria-hidden="true" className="absolute inset-0 opacity-45">
              <TerrainField seed={7777} hue={211} rings={12} chrome tone="deep" />
            </div>
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-void via-void/85 to-void/55" />
            <Aurora />
            <ScanBeam />

            <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-7 text-center">
              <Eyebrow>Next step</Eyebrow>

              <h2 className="text-balance text-3xl leading-[1.05] sm:text-5xl md:text-[3.4rem]">
                Tell us what the footage
                <br className="hidden sm:block" /> has to <span className="text-gradient">prove.</span>
              </h2>

              <p className="max-w-xl text-pretty text-body leading-relaxed text-ink-muted md:text-lead">
                Send us the site, the deadline and the decision the work has to support. You will get
                a fixed quote, an airspace feasibility check and an honest answer about whether we are
                the right crew for it.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <Button href="/contact" size="lg" arrow>
                  Request a quote
                </Button>
                <Button href="/pricing" size="lg" variant="secondary">
                  See pricing
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 pt-3">
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-2 text-meta text-ink-muted transition-colors hover:text-signal"
                >
                  <Mail className="size-4 text-signal" strokeWidth={1.7} />
                  {contact.email}
                </a>
                <a
                  href={contact.phoneHref}
                  className="inline-flex items-center gap-2 text-meta text-ink-muted transition-colors hover:text-signal"
                >
                  <Phone className="size-4 text-signal" strokeWidth={1.7} />
                  {contact.phone}
                </a>
              </div>

              <p className="font-mono text-micro uppercase tracking-[0.2em] text-ink-dim">
                {contact.responseTime}
              </p>

              <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-ink/[0.11] pt-7">
                {credentials.map((c) => (
                  <li key={c.code} className="flex items-baseline gap-2">
                    <span className="font-mono text-meta font-medium tracking-wider text-signal">
                      {c.code}
                    </span>
                    <span className="text-meta text-ink-dim">{c.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
