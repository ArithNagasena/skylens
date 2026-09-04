import type { Metadata } from "next";
import { RevealGroup } from "@/components/ui/reveal";
import { Section } from "@/components/ui/primitives";
import { ServicesHero } from "@/components/services/services-hero";
import { ServicePriceCard } from "@/components/services/service-price-card";
import { ServiceSelectionProvider } from "@/components/services/selection-context";
import { SelectionBar } from "@/components/services/selection-bar";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { getServiceCards } from "@/lib/cms/site-content";

export const metadata: Metadata = {
  title: "Drone Services & Pricing",
  description:
    "Every drone service Sky Lens provides across Sri Lanka, with starting prices: aerial photography from LKR 25,000, cinematic videography from LKR 45,000, weddings, tourism, flower drops, survey and mapping, construction monitoring and inspection.",
  alternates: { canonical: "/services" },
};

/**
 * A topic divider.
 *
 * The two groups used to be introduced by a full `SectionHeading` — eyebrow,
 * display-size title and a three-line lede each. That was more words than the
 * cards underneath them, and a visitor scanning for "what do you do and what
 * does it cost" had to read past it twice. A name and a rule separates the
 * groups just as clearly and gets out of the way.
 */
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

export default async function ServicesPage() {
  const cards = await getServiceCards();
  const core = cards.filter((c) => c.tier === "core");
  const specialist = cards.filter((c) => c.tier === "specialist");

  return (
    <ServiceSelectionProvider>
      <BreadcrumbJsonLd trail={[{ name: "Services", href: "/services" }]} />

      <ServicesHero />

      {/* ------------------------------------------------- photography & film */}
      <Section id="services-pricing" tight className="scroll-mt-24">
        <div className="container-page">
          <GroupHeading>Photography, Film &amp; Events</GroupHeading>
          <p className="mt-3 text-meta text-ink-dim">
            Tap the circle on a card to add it to your request, then send it straight to our
            WhatsApp.
          </p>

          <RevealGroup className="mt-8 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {core.map((s) => (
              <ServicePriceCard key={s.key} service={s} />
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ------------------------------------------------ survey & inspection */}
      {/* Dropped entirely rather than left as a heading over nothing, in case
          every specialist service is switched off in the admin panel. */}
      {specialist.length > 0 && (
        <Section tight className="border-t border-ink/[0.09] bg-obsidian">
          <div className="container-page">
            <GroupHeading>Survey, Mapping &amp; Inspection</GroupHeading>

            <RevealGroup className="mt-8 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {specialist.map((s) => (
                <ServicePriceCard key={s.key} service={s} />
              ))}
            </RevealGroup>
          </div>
        </Section>
      )}

      {/* Fixed to the viewport, so it belongs outside the page's document flow
          but still needs the provider above it in the tree. */}
      <SelectionBar />
    </ServiceSelectionProvider>
  );
}
