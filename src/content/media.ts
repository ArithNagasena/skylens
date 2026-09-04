/**
 * The images the landing page ships with.
 *
 * These used to live inside the two components that render them. They were
 * lifted out when the hero and the latest-work strip became admin-managed:
 * both surfaces now read their frames from Supabase, and fall back to these
 * lists when the tables are empty or the project has no Supabase credentials
 * at all. Keeping the fallback in a content file rather than in the component
 * means the page renders identically on a fresh clone with no database.
 *
 * Files referenced here live in `public/images`. Anything added through the
 * admin panel is uploaded to the Supabase `media` bucket instead, so editing
 * this list is only ever about the out-of-the-box state.
 */

export type MediaFrame = {
  src: string;
  alt: string;
};

/** Frames that rotate inside the hero viewfinder, in order. */
export const heroFrames: MediaFrame[] = [
  {
    src: "/images/hero-aerial-sri-lanka.jpg",
    alt: "Cinematic drone aerial of Sri Lanka south coast at golden hour — palm trees, turquoise ocean and crescent beach",
  },
  { src: "/images/event-shoots.jpg", alt: "Aerial drone shot of a luxury outdoor event in Sri Lanka" },
  {
    src: "/images/2018-06-07-165309-c-Toh-Gouttenoire-Costa-Rica-wedding-Edit.jpg",
    alt: "Aerial photography of a destination wedding ceremony",
  },
  { src: "/images/5-848x566.jpg", alt: "Aerial drone perspective over a scenic Sri Lanka location" },
  { src: "/images/dji-banner.jpg", alt: "Aerial view of Sigiriya rock fortress at sunrise" },
];

/**
 * The "Our Latest Work" strip.
 *
 * Aerial results and crew-on-site, not product shots of the aircraft — those
 * belong in the fleet section above, and repeating them here made the strip
 * read as a catalogue rather than as work we have actually delivered.
 */
export const latestWorkFrames: MediaFrame[] = [
  { src: "/images/dji-banner.jpg", alt: "Aerial view of Sigiriya rock fortress at sunrise, Central Province" },
  { src: "/images/hero-feed.jpg", alt: "Aerial view of a south coast bay, beach road and villas" },
  {
    src: "/images/cinematic-drone-screen.jpg",
    alt: "Sky Lens pilot framing a coastal sunset shot on the controller",
  },
  {
    src: "/images/drone-mapping-route.jpg",
    alt: "Automated survey flight plan over farmland on a ground station",
  },
];
