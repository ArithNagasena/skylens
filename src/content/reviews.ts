/**
 * Hand-picked real reviews.
 *
 * This is the fallback for the homepage reviews section, used whenever the
 * live Google integration is not configured yet (see src/lib/google-reviews.ts).
 * It ships EMPTY on purpose.
 *
 * ─── HOW TO USE IT ───────────────────────────────────────────────────────
 * Paste in reviews people have actually written about Sky Lens — from the
 * Facebook page, from WhatsApp, from an email — quoting them accurately and
 * with the reviewer's permission to use their name.
 *
 *      { source: "Facebook", author: "Nimal Perera", location: "Weligama",
 *        rating: 5, text: "..." }
 *
 * Do NOT invent entries. The six testimonials that used to sit here were
 * fabricated placeholder copy — invented people at invented companies — which
 * is deceptive advertising, not just weak marketing. An empty section that
 * links to the Facebook page is better than a convincing fake one.
 *
 * Once the Google Business Profile is live and configured, real Google reviews
 * take over automatically and this list stops being rendered.
 */

export type CuratedReview = {
  /** Where the review was originally left. Shown as a badge on the card. */
  source: "Facebook" | "Google" | "Direct";
  author: string;
  /** Town, company or role — whatever the reviewer is happy to be shown as. */
  location?: string;
  /** Out of 5. Omit if the source had no star rating. */
  rating?: number;
  text: string;
};

export const curatedReviews: CuratedReview[] = [];
