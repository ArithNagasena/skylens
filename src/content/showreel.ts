/**
 * The films embedded on the landing page, under "Recently completed projects".
 *
 * ─── ⚠ THESE THREE ARE OTHER PEOPLE'S VIDEOS ─────────────────────────────
 * They were supplied as layout samples and MUST be replaced before launch:
 *
 *     EZOCHcZEvBw  "DJI Air 3S | Welcome to Sri Lanka"        — DJI
 *     nq5P6Fbzuok  "DJI Air 3S | Sri Lanka: Part 2"           — DJI
 *     r6HTCiPwJr8  "Sri Lanka Travel Video | Cinematic..."    — Tadas Travel
 *
 * Two are DJI's own marketing films and one belongs to a travel channel. The
 * section they sit in is headed "Recently completed projects" and its lede
 * says the work was flown, graded and delivered by our own crew — so shipping
 * these would claim someone else's footage as Sky Lens client work. That is
 * the same problem as the fabricated testimonials that were removed earlier,
 * and it carries a copyright exposure on top of it.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * To swap one in, take the part after `v=` in the watch URL:
 *
 *     https://www.youtube.com/watch?v=dQw4w9WgXcQ   →   youtubeId: "dQw4w9WgXcQ"
 *
 * Keep the list to the three most recent jobs and re-order it as new work
 * lands — the heading makes the top of this list a claim about currency, not
 * just a selection. Three also fills exactly one desktop row. An entry with an
 * empty `youtubeId` is skipped rather than rendered as an empty tile.
 */

export type ShowreelFilm = {
  /** YouTube video ID — the part after `v=` in the watch URL. */
  youtubeId: string;
  /**
   * The video's title. Not shown on the page — the YouTube player draws its
   * own title overlay — but it names the <iframe> for screen readers, which
   * otherwise announce three indistinguishable "video" frames.
   */
  title: string;
};

export const showreel: ShowreelFilm[] = [
  { youtubeId: "EZOCHcZEvBw", title: "DJI Air 3S | Welcome to Sri Lanka" },
  { youtubeId: "nq5P6Fbzuok", title: "DJI Air 3S | Sri Lanka: Part 2 | SkyPixel" },
  {
    youtubeId: "r6HTCiPwJr8",
    title: "Sri Lanka Travel Video | Cinematic Drone Footage From Above",
  },
];
