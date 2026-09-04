import type { Metadata } from "next";
import { WorkHero } from "@/components/work/work-hero";
import { Section } from "@/components/ui/primitives";
import { WorkGallery } from "@/components/work/work-gallery";
import { SocialBanner } from "@/components/work/social-banner";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { getWorkCards } from "@/lib/cms/site-content";

export const metadata: Metadata = {
  title: "Selected Work",
  description:
    "Drone case studies across film, survey, inspection, real estate, agriculture and events — each one with the measured outcome the client was actually buying.",
  alternates: { canonical: "/work" },
};

export default async function WorkPage() {
  const cards = await getWorkCards();

  return (
    <>
      <BreadcrumbJsonLd trail={[{ name: "Work", href: "/work" }]} />

      <WorkHero />

      <Section id="projects" tight className="scroll-mt-20">
        <div className="container-page">
          <WorkGallery projects={cards} />
        </div>
      </Section>

      <SocialBanner />
    </>
  );
}
