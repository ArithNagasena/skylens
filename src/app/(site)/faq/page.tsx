import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/primitives";
import { Accordion } from "@/components/ui/accordion";
import { CallToAction } from "@/components/home/cta";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld";
import { faqGroups, faqs } from "@/content/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Licensing, insurance, airspace permissions, turnaround times, file formats, survey accuracy and footage ownership — answered plainly.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <BreadcrumbJsonLd trail={[{ name: "FAQ", href: "/faq" }]} />
      <FaqJsonLd items={faqs.map((f) => ({ q: f.q, a: f.a }))} />

      <PageHero
        eyebrow="Frequently asked"
        crumbs={[{ name: "FAQ", href: "/faq" }]}
        title={
          <>
            The questions worth asking <span className="text-gradient">any drone operator.</span>
          </>
        }
        lede="Several of these are the ones we would ask if we were the ones buying. If a competitor cannot answer them as directly, that is useful information."
        seed={3737}
        hue={148}
        meta={[
          { label: "Questions", value: `${faqs.length} answered` },
          { label: "Topics", value: `${faqGroups.length} groups` },
          { label: "Still stuck?", value: "One business day" },
          { label: "Airspace", value: "Handled in-house" },
        ]}
      />

      <Section tight>
        <div className="container-page">
          <div className="flex flex-col gap-16">
            {faqGroups.map((group, gi) => {
              const items = faqs.filter((f) => f.group === group);
              return (
                <div key={group} className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
                  <div className="lg:sticky lg:top-32 lg:self-start">
                    <Reveal>
                      <div className="flex flex-col gap-3">
                        <span className="font-mono text-micro uppercase tracking-[0.22em] text-signal">
                          {String(gi + 1).padStart(2, "0")}
                        </span>
                        <h2 className="text-2xl tracking-tight md:text-3xl">{group}</h2>
                        <p className="font-mono text-micro uppercase tracking-[0.16em] text-ink-dim">
                          {items.length} question{items.length === 1 ? "" : "s"}
                        </p>
                      </div>
                    </Reveal>
                  </div>

                  <Reveal delay={0.08}>
                    <Accordion items={items.map((f) => ({ q: f.q, a: f.a }))} defaultOpen={gi === 0 ? 0 : undefined} />
                  </Reveal>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      <CallToAction />
    </>
  );
}
