import { serviceSlugs } from "@/content/services";

/**
 * The service cards the site ships with — the fallback for the admin-managed
 * `services` table, and the exact set seeded into it by
 * supabase/migrations/0002_seed.sql.
 *
 * Two lists used to exist: the nine detailed entries in `services.ts`, which
 * carry prices and have their own pages, and a separate hard-coded ten on the
 * landing page, which carried neither. A card claiming to be a service the
 * studio sells but with no price and no page behind it is the sort of gap that
 * only shows up when a customer clicks it, so the two were merged here.
 *
 * `slug` is the join back to `services.ts`: a card whose slug matches an entry
 * there links to that service's page, and one that does not simply renders
 * without a link rather than pointing at a 404. The same rule applies to cards
 * coming from the database, so an admin can add a service without having to
 * write a page for it first.
 *
 * `startingPrice` is a number of rupees, or null for "On request".
 */

export type ServiceCard = {
  key: string;
  slug: string;
  title: string;
  description: string;
  startingPrice: number | null;
  /** Qualifier printed after the price, e.g. "per visit". */
  priceNote: string;
  /** lucide-react icon name, resolved in components/ui/icon.tsx. */
  icon: string;
  tier: "core" | "specialist";
};

export const serviceCards: ServiceCard[] = [
  {
    key: "aerial-photography",
    slug: "aerial-photography",
    title: "Aerial Photography",
    description: "High-resolution drone stills for brands, property and hospitality.",
    startingPrice: 25000,
    priceNote: "",
    icon: "Camera",
    tier: "core",
  },
  {
    key: "cinematic-videography",
    slug: "cinematic-videography",
    title: "Cinematic Drone Videography",
    description: "4K aerial film for campaigns, hotels and documentaries.",
    startingPrice: 45000,
    priceNote: "",
    icon: "Clapperboard",
    tier: "core",
  },
  {
    key: "weddings-events",
    slug: "weddings-events",
    title: "Wedding & Event Droneography",
    description: "Discreet aerial coverage of weddings, receptions and festivals.",
    startingPrice: 50000,
    priceNote: "",
    icon: "PartyPopper",
    tier: "core",
  },
  {
    key: "religious-festivals",
    slug: "religious-festivals",
    title: "Religious Places & Festivals",
    description: "Respectful aerial coverage of cultural and religious events.",
    startingPrice: null,
    priceNote: "",
    icon: "Landmark",
    tier: "core",
  },
  {
    key: "real-estate-media",
    slug: "real-estate-media",
    title: "Real Estate Media",
    description: "Aerial and ground media for agents, developers and villa owners.",
    startingPrice: 32000,
    priceNote: "",
    icon: "Building2",
    tier: "core",
  },
  {
    key: "tourism-hospitality",
    slug: "tourism-hospitality",
    title: "Tourism & Hospitality Media",
    description: "Complete media packages for hotels, resorts and tour operators.",
    startingPrice: 100000,
    priceNote: "",
    icon: "Palmtree",
    tier: "core",
  },
  {
    key: "commercial-promotional",
    slug: "commercial-promotional",
    title: "Commercial & Promotional",
    description: "Dynamic aerial visuals for brands and campaigns.",
    startingPrice: null,
    priceNote: "",
    icon: "Megaphone",
    tier: "core",
  },
  {
    key: "flower-dropping",
    slug: "flower-dropping",
    title: "Flower Dropping & Floral Aerial Services",
    description: "Precision aerial flower drops for weddings and ceremonies.",
    startingPrice: 100000,
    priceNote: "",
    icon: "Flower2",
    tier: "core",
  },
  {
    key: "heavy-lift",
    slug: "heavy-lift",
    title: "Heavy Lift & Flag Hoisting",
    description: "Industrial payload lifting up to 50 kg for flags and equipment.",
    startingPrice: null,
    priceNote: "",
    icon: "Flag",
    tier: "core",
  },
  {
    key: "landscape-environmental",
    slug: "landscape-environmental",
    title: "Landscape & Environmental",
    description: "Wide captures of natural environments and coastline.",
    startingPrice: null,
    priceNote: "",
    icon: "Mountain",
    tier: "core",
  },
  {
    key: "survey-mapping",
    slug: "survey-mapping",
    title: "Survey & Mapping",
    description: "Centimetre-accurate maps, models and volume measurements.",
    startingPrice: 50000,
    priceNote: "",
    icon: "Map",
    tier: "specialist",
  },
  {
    key: "construction-progress",
    slug: "construction-progress",
    title: "Construction Monitoring",
    description: "Monthly aerial records of site progress from fixed waypoints.",
    startingPrice: 30000,
    priceNote: "per visit",
    icon: "HardHat",
    tier: "specialist",
  },
  {
    key: "asset-inspection",
    slug: "asset-inspection",
    title: "Asset Inspection",
    description: "Close-range visual and thermal inspection, no scaffolding needed.",
    startingPrice: 35000,
    priceNote: "",
    icon: "ScanSearch",
    tier: "specialist",
  },
];

/**
 * "LKR 25,000+", "LKR 30,000+ / visit", or "On request".
 *
 * The plus sign is not decoration: these are mobilisation-dependent jobs, and
 * a number presented as fixed either loses work or has to be walked back on
 * the call. Every surface that shows a price goes through this function so
 * that framing cannot drift between the landing page and /services.
 */
export function formatStartingPrice(amount: number | null, note = ""): string {
  if (amount === null || Number.isNaN(amount)) return "On request";
  const base = `LKR ${Math.round(amount).toLocaleString("en-LK")}+`;
  return note ? `${base} / ${note.replace(/^per\s+/i, "")}` : base;
}

/**
 * The subset of a service the quote flow actually needs: what it is called,
 * what it costs from, and an icon to draw beside it.
 *
 * It exists so the estimate builder, the WhatsApp message and the printable
 * quotation are not tied to either source of services. They accept anything of
 * this shape, which is satisfied both by the editorial entries in
 * `services.ts` and by the admin-managed rows coming out of the database — so
 * a price changed in the admin panel reaches the customer's estimate without
 * any of those three having to know where it came from.
 */
export type QuotableService = {
  slug: string;
  title: string;
  /** The price already formatted for display, e.g. "LKR 25,000+". */
  startingAt: string;
  icon: string;
};

export function toQuotable(card: ServiceCard): QuotableService {
  return {
    slug: card.slug,
    title: card.title,
    startingAt: formatStartingPrice(card.startingPrice, card.priceNote),
    icon: card.icon,
  };
}

/**
 * Whether a service card has an editorial page behind it at
 * /services/<slug>.
 *
 * Only the nine entries written up in `services.ts` do. A card added through
 * the admin panel, or one of the four that never had a write-up, renders its
 * title as plain text instead of linking into a 404.
 */
export function serviceHasPage(slug: string): boolean {
  return serviceSlugs.includes(slug);
}
