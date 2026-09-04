import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { LegalBody } from "@/components/legal/legal-body";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { lastUpdated, privacySections } from "@/content/legal";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Sky Lens collects, uses, stores and deletes personal information and captured aerial data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <BreadcrumbJsonLd trail={[{ name: "Privacy", href: "/privacy" }]} />
      <PageHero
        eyebrow="Legal"
        crumbs={[{ name: "Privacy", href: "/privacy" }]}
        title="Privacy policy"
        lede="What we collect, why we collect it, how long we keep it and how to get it deleted. Written to match how the studio actually operates rather than copied from a template."
        seed={1212}
        hue={268}
        meta={[
          { label: "Last updated", value: formatDate(lastUpdated) },
          { label: "Applies to", value: "Website and flight operations" },
          { label: "Data requests", value: "Answered within 30 days" },
          { label: "Contact", value: "fly@skylens.com" },
        ]}
      />
      <LegalBody sections={privacySections} />
    </>
  );
}
