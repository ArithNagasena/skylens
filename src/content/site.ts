/**
 * Single source of truth for brand-level content.
 * Swap the CONTACT values for the real business details before launch.
 */

export const site = {
  name: "Sky Lens",
  legalName: "Sky Lens Aerial (Pvt) Ltd",
  tagline: "Capturing stunning moments from the sky.",
  domain: "https://skylens.lk",
  /** The positioning statement. Used verbatim in metadata and on the About page. */
  positioning:
    "Sky Lens provides professional drone photography and cinematic aerial videography services across Sri Lanka, capturing stunning moments from the sky.",
  description:
    "Sky Lens provides professional drone photography and cinematic aerial videography services across Sri Lanka. CAASL registered, fully insured, flying from Colombo to the hill country and both coasts.",
  founded: 2019,
} as const;

export const contact = {
  email: "fly@skylens.lk",
  phone: "+94 77 018 4420",
  phoneHref: "tel:+94770184420",
  address: {
    street: "No. 118/4, Nawala Road",
    city: "Rajagiriya",
    region: "Western Province",
    postal: "10100",
    country: "LK",
  },
  hours: "Mon–Sat · 8.00am – 6.00pm",
  responseTime: "Every enquiry answered within one business day.",
} as const;

/**
 * The real profiles, and the single source of truth for them: the footer, the
 * header icons and the `sameAs` array in the Organization JSON-LD all read
 * from here.
 *
 * Only add a platform once the account actually exists. The previous entries
 * pointed at the bare platform homepages (https://facebook.com/ and friends),
 * which sent the footer icons nowhere and — worse — told search engines in
 * `sameAs` that facebook.com itself was Sky Lens's official profile.
 */
export const socials = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/18vDo2cpWn/?mibextid=wwXIfr",
    handle: "/skylens.lk",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/skylens_lk",
    handle: "@skylens_lk",
  },
  {
    // ⚠ PLACEHOLDER — this is DJI's official channel, not Sky Lens's.
    // It was supplied to populate the projects banner, but that banner is
    // headed "Every project we fly ends up on our channels", so as it stands
    // the site presents the manufacturer's channel as the studio's own.
    // Replace with the real Sky Lens channel before launch; everything that
    // renders `socials` reads from here, so it is a one-line change.
    label: "YouTube",
    href: "https://www.youtube.com/@DJI",
    handle: "@DJI",
  },
] as const;

export const credentials = [
  { code: "CAASL", label: "Registered UAV operator" },
  { code: "INSURED", label: "Public liability cover" },
  { code: "PERMITS", label: "Flight approvals handled in-house" },
  { code: "2019", label: "Operating since" },
] as const;

export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

/**
 * `Pricing` is deliberately absent: starting prices now live on the services
 * page itself, so a visitor never has to cross-reference two pages to find
 * what a shoot costs. The label says "& Pricing" so that is discoverable from
 * the nav bar rather than being something you have to guess at.
 *
 * The standalone /pricing page still exists for detailed packages and day
 * rates, reached from the services page and the footer.
 */
export const primaryNav: NavItem[] = [
  { label: "Home", href: "/", description: "Back to the start" },
  { label: "Services & Pricing", href: "/services", description: "Every service, with starting prices" },
  { label: "Work", href: "/work", description: "Selected shoots and case studies" },
  { label: "Fleet", href: "/fleet", description: "Aircraft, cameras and payloads" },
  { label: "About Us", href: "/about", description: "The crew behind the lens" },
];

export const footerNav: { title: string; links: NavItem[] }[] = [
  {
    title: "Services",
    links: [
      { label: "Aerial Photography", href: "/services/aerial-photography" },
      { label: "Cinematic Videography", href: "/services/cinematic-videography" },
      { label: "Real Estate Media", href: "/services/real-estate-media" },
      { label: "Weddings & Events", href: "/services/weddings-events" },
      { label: "All services", href: "/services" },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "About", href: "/about" },
      { label: "Our fleet", href: "/fleet" },
      { label: "Selected work", href: "/work" },
    ],
  },
  {
    title: "Get started",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Request a quote", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of service", href: "/terms" },
    ],
  },
];

export const heroStats = [
  { value: "1,240+", label: "Flights logged", detail: "since 2019" },
  { value: "4K 120", label: "Video capture", detail: "up to 4K at 120 fps" },
  { value: "6 hr+", label: "Continuous coverage", detail: "full events, battery rotation" },
];

export const clients = [
  "CEYLON HARBOUR RESORTS",
  "SERENDIB VILLAS",
  "MERIDIAN CIVIL",
  "ATLAS PLANTATIONS",
  "NORTHGATE DEVELOPMENTS",
  "LANKA RENEWABLES",
  "BLUEPINE ESTATES",
  "PALM & TIDE WEDDINGS",
];
