import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { LegalBody } from "@/components/legal/legal-body";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { lastUpdated, termsSections } from "@/content/legal";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Quotes, booking, cancellation, weather policy, deliverables, licensing, payment and liability terms for Sky Lens engagements.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <BreadcrumbJsonLd trail={[{ name: "Terms", href: "/terms" }]} />
      <PageHero
        eyebrow="Legal"
        crumbs={[{ name: "Terms", href: "/terms" }]}
        title="Terms of service"
        lede="The commercial terms behind every engagement: what a quote covers, who decides whether we fly, what you can do with the footage, and where liability sits."
        seed={2323}
        hue={62}
        meta={[
          { label: "Last updated", value: formatDate(lastUpdated) },
          { label: "Governing law", value: "Sri Lanka" },
          { label: "Quote validity", value: "30 days" },
          { label: "Payment terms", value: "Net 14" },
        ]}
      />
      <LegalBody sections={termsSections} />
    </>
  );
}
