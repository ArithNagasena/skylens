import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { TrustBar } from "@/components/home/trust-bar";
import { WhatWeDo } from "@/components/home/what-we-do";
import { ServicesGrid } from "@/components/home/services-grid";
import { Capabilities } from "@/components/home/capabilities";
import { FleetBand } from "@/components/home/fleet-band";
import { LatestWorkCarousel } from "@/components/home/latest-work-carousel";
import { ProjectsInAction } from "@/components/home/projects-in-action";
import { ReviewsSection } from "@/components/home/reviews-section";
import { FaqTeaser } from "@/components/home/faq-teaser";
import { CallToAction } from "@/components/home/cta";
import {
  getHeroFrames,
  getLatestWorkFrames,
  getServiceCards,
  getShowreelFilms,
} from "@/lib/cms/site-content";

export const metadata: Metadata = {
  title: "Sky Lens | Professional Drone Photography & Aerial Videography in Sri Lanka",
  description:
    "CAASL registered, fully insured drone crew. Cinematic aerial film, property and wedding photography, heavy-lift event work. Fixed quotes, permissions handled, free weather reschedules.",
};

/**
 * The landing page runs one argument end to end: what we do, that we are
 * allowed and insured to do it, proof that we have, and then the ask.
 *
 * Section grounds alternate deliberately — page / band / page / band / deep —
 * so the eye gets a break without the page turning into a stack of
 * indistinguishable white blocks.
 */
export default async function HomePage() {
  // One await for the four admin-managed sections. They are independent
  // queries, so they go out together rather than in series — the page cannot
  // paint until the slowest of them lands either way.
  const [heroFrames, services, latestWork, films] = await Promise.all([
    getHeroFrames(),
    getServiceCards(),
    getLatestWorkFrames(),
    getShowreelFilms(),
  ]);

  return (
    <>
      {/* ── Attention ─────────────────────────────────────────────── */}
      <Hero frames={heroFrames} />
      <TrustBar />

      {/* ── What we do, and how ───────────────────────────────────── */}
      <WhatWeDo />
      <ServicesGrid services={services} />
      <Capabilities />
      <FleetBand />

      {/* ── Proof ─────────────────────────────────────────────────── */}
      <LatestWorkCarousel slides={latestWork} />
      <ProjectsInAction films={films} />
      <ReviewsSection />

      {/* ── Close ─────────────────────────────────────────────────── */}
      <FaqTeaser />
      <CallToAction />
    </>
  );
}
