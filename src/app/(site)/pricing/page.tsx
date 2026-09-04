import type { Metadata } from "next";
import { Check, Info, Minus } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Chip, Section, SectionHeading } from "@/components/ui/primitives";
import { Accordion } from "@/components/ui/accordion";
import { CallToAction } from "@/components/home/cta";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld";
import { addOns, comparisonRows, pricingNotes, tiers } from "@/content/pricing";
import { faqs } from "@/content/faq";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent drone service pricing in Sri Lanka: single shoots from LKR 32,000, crewed production days from LKR 145,000, and custom retained programmes. Fixed quotes, free weather reschedules.",
  alternates: { canonical: "/pricing" },
};

const bookingFaqs = faqs.filter((f) => f.group === "Booking");

export default function PricingPage() {
  return (
    <>
      <BreadcrumbJsonLd trail={[{ name: "Pricing", href: "/pricing" }]} />
      <FaqJsonLd items={bookingFaqs.map((f) => ({ q: f.q, a: f.a }))} />

      <PageHero
        eyebrow="Pricing"
        crumbs={[{ name: "Pricing", href: "/pricing" }]}
        title={
          <>
            Published rates, <span className="text-gradient">fixed quotes.</span>
          </>
        }
        lede="Three ways to work with us. Every quote is fixed before we fly, includes the airspace authorisation, and is not adjusted afterwards unless you change the scope."
        seed={4404}
        hue={62}
      />

      {/* ----------------------------------------------------------- tiers */}
      <Section tight>
        <div className="container-page">
          <div className="grid items-start gap-4 lg:grid-cols-3">
            {tiers.map((t, i) => (
              <Reveal key={t.id} delay={i * 0.08}>
                <div
                  className={cn(
                    "relative flex h-full flex-col gap-6 overflow-hidden rounded-3xl p-7 transition-all duration-500",
                    t.featured
                      ? "bg-gradient-to-b from-signal-soft to-void shadow-[inset_0_0_0_1.5px_rgba(13,77,138,0.5),0_20px_44px_-24px_rgba(13,77,138,0.35)]"
                      : "card card-interactive",
                  )}
                >
                  {t.featured && (
                    <span className="absolute right-6 top-6">
                      <Chip tone="signal">Most booked</Chip>
                    </span>
                  )}

                  <div className="flex flex-col gap-2">
                    <h2 className="text-title tracking-tight">{t.name}</h2>
                    <p className="max-w-xs text-meta leading-relaxed text-ink-muted">{t.pitch}</p>
                  </div>

                  <div className="flex flex-col gap-1 border-y border-ink/[0.08] py-6">
                    <span className="font-display text-4xl tracking-[-0.028em] text-ink md:text-5xl">
                      {t.price}
                    </span>
                    <span className="font-mono text-micro uppercase tracking-[0.18em] text-ink-dim">
                      {t.unit}
                    </span>
                  </div>

                  <p className="text-meta leading-relaxed text-ink-dim">
                    <span className="font-medium text-ink-muted">Best for: </span>
                    {t.bestFor}
                  </p>

                  <ul className="flex flex-1 flex-col gap-2.5">
                    {t.includes.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-meta text-ink">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-signal" strokeWidth={2.4} />
                        {f}
                      </li>
                    ))}
                    {t.excludes?.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-meta text-ink-dim">
                        <Minus className="mt-0.5 size-3.5 shrink-0 text-ink/25" strokeWidth={2.4} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Button
                    href={t.cta.href}
                    variant={t.featured ? "primary" : "secondary"}
                    className="w-full"
                    arrow
                  >
                    {t.cta.label}
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {pricingNotes.map((n) => (
                <li
                  key={n}
                  className="flex items-start gap-2.5 rounded-xl bg-ink/[0.06] px-4 py-3 text-meta leading-relaxed text-ink-muted hairline"
                >
                  <Info className="mt-0.5 size-3.5 shrink-0 text-signal" strokeWidth={1.9} />
                  {n}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* ------------------------------------------------------ comparison */}
      <Section tight className="border-y border-ink/[0.09] bg-obsidian">
        <div className="container-page">
          <SectionHeading eyebrow="Side by side" title="What differs between the three." />

          <Reveal>
            <div className="mt-10 overflow-x-auto rounded-2xl hairline">
              <table className="w-full min-w-[42rem] border-collapse text-left">
                <caption className="sr-only">Comparison of Sky Lens service packages</caption>
                <thead>
                  <tr className="bg-ink/[0.06]">
                    <th scope="col" className="px-5 py-4 font-mono text-micro uppercase tracking-[0.18em] text-ink-dim">
                      Feature
                    </th>
                    {tiers.map((t) => (
                      <th
                        key={t.id}
                        scope="col"
                        className={cn(
                          "px-5 py-4 text-meta font-medium",
                          t.featured ? "text-signal" : "text-ink",
                        )}
                      >
                        {t.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.feature} className="border-t border-ink/[0.09]">
                      <th scope="row" className="px-5 py-3.5 text-meta font-normal text-ink-muted">
                        {row.feature}
                      </th>
                      <td className="px-5 py-3.5 text-meta text-ink">{row.shoot}</td>
                      <td className="bg-signal/[0.04] px-5 py-3.5 text-meta text-ink">{row.production}</td>
                      <td className="px-5 py-3.5 text-meta text-ink">{row.programme}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ---------------------------------------------------------- add-ons */}
      <Section tight>
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
            <SectionHeading
              eyebrow="Add-ons"
              title="Priced separately, because most jobs do not need them."
              lede="Bundling everything into one rate means the client who does not need LiDAR pays for it anyway. These are the extras, listed plainly."
            />
            <Reveal delay={0.1}>
              <dl className="grid gap-px overflow-hidden rounded-2xl bg-ink/[0.07] hairline sm:grid-cols-2">
                {addOns.map((a) => (
                  <div
                    key={a.name}
                    className="flex items-baseline justify-between gap-4 bg-raised px-5 py-4 transition-colors hover:bg-surface/50"
                  >
                    <dt className="text-meta text-ink">{a.name}</dt>
                    <dd className="shrink-0 font-mono text-meta font-medium text-signal">{a.price}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------------------- faq */}
      <Section tight className="border-t border-ink/[0.09]">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <SectionHeading
              eyebrow="Booking questions"
              title="Before you commit."
              lede="The four things clients ask most often about scheduling and money."
            />
            <Reveal delay={0.1}>
              <Accordion items={bookingFaqs.map((f) => ({ q: f.q, a: f.a }))} defaultOpen={0} />
              <div className="mt-8">
                <Button href="/faq" variant="secondary" arrow>
                  Read the full FAQ
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      <CallToAction />
    </>
  );
}
