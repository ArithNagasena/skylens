/**
 * The fleet, as it actually is: two aircraft.
 *
 * This file previously described five generic airframes — "Cinema platform",
 * "Survey airframe, RTK", "Inspection quadcopter", "Compact rapid-deploy" and
 * "Cinewhoop FPV" — with 6K, RTK and thermal specifications. None of it matched
 * the homepage, which named a DJI Air 3S and a heavy-lift T50, so a client
 * reading both pages saw two different companies. Rewritten to the real
 * aircraft, using the operator's own capability language.
 */

export type FeatureGroup = {
  /** lucide-react icon name, resolved in components/ui/icon.tsx */
  icon: string;
  title: string;
  body: string;
  items: string[];
};

export type Aircraft = {
  slug: string;
  /** Display order, shown as a large numeral. */
  order: string;
  name: string;
  category: string;
  summary: string;
  poster: string;
  /**
   * A silent clip shown full-width between the masthead and the feature cards.
   * Optional — omit it and the block simply runs masthead straight into cards.
   *
   * ⚠ Keep these small. The Air 3S banner is ~63 MB straight off the camera,
   * which is far heavier than a web banner should be; it is loaded lazily to
   * limit the damage, but it wants compressing to roughly 5–10 MB (H.264,
   * 1080p, ~2 Mbps) before launch.
   */
  bannerVideo?: string;
  /** Headline specs, shown as a strip under the name. */
  specs: { label: string; value: string }[];
  features: FeatureGroup[];
  /** What clients actually hire it for. */
  applications: { title: string; items: string[] }[];
};

export const fleet: Aircraft[] = [
  {
    slug: "dji-air-3s",
    order: "01",
    name: "DJI Air 3S",
    category: "Cinematic aerial imaging & smart mission drone",
    summary:
      "Our primary camera aircraft. Dual cameras, intelligent subject tracking, automated waypoint missions and omnidirectional obstacle sensing — the airframe behind most of the film, property and event work we deliver.",
    poster: "/images/dji-air-3.jpg",
    bannerVideo: "/Videos/dji-air-3s-banner.mp4",
    specs: [
      { label: "Video", value: "4K UHD" },
      { label: "Vertical", value: "2.7K portrait" },
      { label: "Tracking", value: "ActiveTrack" },
      { label: "Missions", value: "Waypoint" },
      { label: "Sensing", value: "Omnidirectional" },
      { label: "Controller", value: "DJI RC 2" },
    ],
    features: [
      {
        icon: "Clapperboard",
        title: "Cinematic video production",
        body: "4K ultra-high-definition capture, for work that has to hold up on a big screen.",
        items: [
          "Film and documentary production",
          "Commercial advertisements",
          "Tourism and corporate films",
          "Real estate presentations",
        ],
      },
      {
        icon: "Smartphone",
        title: "Vertical video, natively",
        body: "Portrait capture up to 2.7K — shot vertical, not cropped down from a landscape frame.",
        items: ["Instagram Reels", "YouTube Shorts", "TikTok", "Paid social campaigns"],
      },
      {
        icon: "Crosshair",
        title: "ActiveTrack subject following",
        body: "The aircraft locks onto a moving subject and holds the frame while it flies itself.",
        items: [
          "Athletes and sport",
          "Vehicles in motion",
          "Wedding couples",
          "Event and crowd coverage",
        ],
      },
      {
        icon: "Map",
        title: "Automated waypoint missions",
        body: "The same route flown identically every visit, which is what makes change measurable.",
        items: [
          "Land mapping and surveys",
          "Construction progress records",
          "Agricultural observation",
          "Repeat inspection flights",
        ],
      },
      {
        icon: "ShieldCheck",
        title: "Omnidirectional obstacle sensing",
        body: "Forward, rear, lateral, upward and downward detection for confident flying near structures.",
        items: [
          "Safer operation near buildings",
          "Reduced collision risk",
          "Reliable confined-site missions",
        ],
      },
      {
        icon: "ScanSearch",
        title: "LiDAR-assisted sensing",
        body: "Sharper environmental awareness and flight precision, including in failing light.",
        items: ["Obstacle recognition", "Flight-path precision", "Automated mission stability"],
      },
    ],
    applications: [
      {
        title: "Film & media",
        items: ["Cinematic aerials", "Music videos", "Documentary", "Television"],
      },
      {
        title: "Weddings & events",
        items: ["Ceremony highlights", "Venue reveals", "Festivals", "Outdoor events"],
      },
      {
        title: "Rescue & emergency",
        items: ["Search and rescue support", "Disaster observation", "Remote assessment"],
      },
      {
        title: "Inspection",
        items: ["Buildings and roofs", "Construction monitoring", "Infrastructure surveys"],
      },
      {
        title: "Commercial & marketing",
        items: ["Brand campaigns", "Tourism promotion", "Hotel and resort media"],
      },
      {
        title: "Monitoring",
        items: ["Traffic observation", "Crowd monitoring", "Event security support"],
      },
    ],
  },
  {
    slug: "dji-agras-t50",
    order: "02",
    name: "DJI Agras T50",
    category: "Heavy-lift transport, agricultural & event support drone",
    summary:
      "The industrial airframe. Rated to a 50 kg payload, it covers the work a camera drone physically cannot: aerial flower drops, flag and banner carrying, crop spraying and site logistics.",
    poster: "/images/specialized-drone.jpg",
    specs: [
      { label: "Payload", value: "Up to 50 kg" },
      { label: "Class", value: "Heavy lift" },
      { label: "Spraying", value: "Precision agri" },
      { label: "Crew", value: "Pilot + spotter" },
    ],
    features: [
      {
        icon: "Package",
        title: "Heavy payload transport",
        body: "Carries and delivers up to 50 kg, safely and repeatably.",
        items: [
          "Aerial transport operations",
          "Equipment delivery",
          "Remote area supply",
          "Event logistics",
        ],
      },
      {
        icon: "Flower2",
        title: "Flower dropping & ceremonies",
        body: "Timed aerial petal releases, flown with a cleared corridor and a rehearsal pass.",
        items: [
          "Wedding processions and entrances",
          "Perahera and temple festivals",
          "Opening ceremonies",
          "Cultural celebrations",
        ],
      },
      {
        icon: "Flag",
        title: "Flag & banner carrying",
        body: "Airborne displays for the moment everyone photographs.",
        items: [
          "Festival flag displays",
          "Sports ceremonies",
          "Brand activations",
          "Public celebrations",
        ],
      },
      {
        icon: "Sprout",
        title: "Agricultural operations",
        body: "Precision application across large areas, in a fraction of the time it takes on foot.",
        items: ["Crop spraying", "Fertiliser application", "Field management", "Estate coverage"],
      },
    ],
    applications: [
      {
        title: "Events & entertainment",
        items: ["Large-scale ceremonies", "Festival activities", "Aerial spectacle"],
      },
      {
        title: "Agriculture",
        items: ["Spraying programmes", "Estate management", "Precision application"],
      },
      {
        title: "Industrial & logistics",
        items: ["Remote transportation", "Site operations", "Specialised delivery"],
      },
    ],
  },
];

/**
 * Films of the fleet at work.
 *
 * Slot one is the DJI Air 3S introduction clip. The other two are reserved:
 * drop an .mp4 into public/Videos/, put its path in `src`, and the placeholder
 * becomes a player with no other change needed.
 *
 * Keep filenames lower-case and hyphenated — a space in the name has to be
 * percent-encoded in the URL and is an easy way to ship a broken video.
 */
export type FleetFilm = {
  title: string;
  caption: string;
  /** Empty string keeps the slot reserved and renders a placeholder. */
  src: string;
  poster: string;
};

export const fleetFilms: FleetFilm[] = [
  {
    title: "DJI Air 3S",
    caption: "Introduction clip",
    src: "/Videos/dji-air-3s.mp4",
    poster: "/images/dji-air-3.jpg",
  },
  {
    title: "DJI Agras T50",
    caption: "Heavy-lift operations",
    src: "",
    poster: "/images/specialized-drone.jpg",
  },
  {
    title: "In the field",
    caption: "Crew and mission planning",
    src: "",
    poster: "/images/drone-mapping-route.jpg",
  },
];

/** The closing checklist: what the two aircraft together let us take on. */
export const capabilities = [
  "Cinematic aerial filming",
  "Wedding drone coverage",
  "Event aerial production",
  "Commercial advertisements",
  "Film production support",
  "Tourism promotional videos",
  "Real estate aerial photography",
  "Mapping and surveying",
  "Inspection services",
  "Rescue and emergency support",
  "Traffic and crowd monitoring",
  "Heavy payload transportation",
  "Festival and ceremony operations",
];
