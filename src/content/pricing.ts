export type Tier = {
  id: string;
  name: string;
  price: string;
  unit: string;
  pitch: string;
  bestFor: string;
  includes: string[];
  excludes?: string[];
  featured?: boolean;
  cta: { label: string; href: string };
};

export const tiers: Tier[] = [
  {
    id: "shoot",
    name: "Single Shoot",
    price: "LKR 32,000",
    unit: "from, per visit",
    pitch: "One location, one flight window, one clean set of deliverables.",
    bestFor: "Property listings, a villa refresh, one-off promotional stills.",
    includes: [
      "Up to 3 hours on site",
      "Licensed pilot and observer",
      "25+ retouched stills or a 60-second edit",
      "CAASL flight approval handled",
      "48-hour delivery",
      "Commercial usage licence",
    ],
    excludes: ["Multi-day scheduling", "Survey-grade accuracy reporting"],
    cta: { label: "Book a shoot", href: "/contact?package=shoot" },
  },
  {
    id: "production",
    name: "Production Day",
    price: "LKR 145,000",
    unit: "per crewed day",
    pitch: "A full crewed day built around a shot list you approve before we fly.",
    bestFor: "Hotel and resort films, brand campaigns, multi-location shoots.",
    includes: [
      "Full day, two to three person crew",
      "Cinema airframe plus FPV rig",
      "Pre-production shot list and light planning",
      "Ground coverage to match the aerials",
      "Graded master plus social cutdowns",
      "All log rushes on an encrypted drive",
      "Two rounds of revisions",
    ],
    featured: true,
    cta: { label: "Plan a production", href: "/contact?package=production" },
  },
  {
    id: "programme",
    name: "Programme",
    price: "Custom",
    unit: "retained, monthly",
    pitch: "Recurring capture on a fixed cadence, with a library that compounds over time.",
    bestFor: "Hotel groups, construction records, plantation and inspection cycles.",
    includes: [
      "Scheduled shoots at your cadence",
      "Repeatable waypoint missions",
      "Seasonal recapture so imagery always matches the weather",
      "Shared client library and archive",
      "Named account lead",
      "Priority scheduling and monsoon rebooking",
      "Quarterly review with your team",
    ],
    cta: { label: "Scope a programme", href: "/contact?package=programme" },
  },
];

export const addOns = [
  { name: "Sunrise or blue-hour window", price: "+LKR 12,000" },
  { name: "Additional location, same day", price: "+LKR 18,000" },
  { name: "Same-day edit turnaround", price: "+LKR 35,000" },
  { name: "RTK survey payload", price: "+LKR 45,000 / day" },
  { name: "Multispectral payload", price: "+LKR 38,000 / day" },
  { name: "Live downlink to event screen", price: "+LKR 60,000 / day" },
  { name: "Restricted or heritage site permit", price: "From LKR 15,000" },
  { name: "Rush processing, 24 hours", price: "+35%" },
];

export const pricingNotes = [
  "Travel within 40 km of Colombo is included. Beyond that we bill transport and accommodation at cost, with no markup.",
  "Weather cancellations are rebooked at no charge, and we make that call, not you.",
  "Quotes hold for 30 days. Programme rates are fixed for the retainer term.",
  "Every engagement includes CAASL flight approval and proof of insurance.",
];

export const comparisonRows: { feature: string; shoot: string; production: string; programme: string }[] = [
  { feature: "On-site time", shoot: "3 hours", production: "Full day", programme: "Per schedule" },
  { feature: "Crew size", shoot: "1 pilot + observer", production: "2–3 crew", programme: "Scoped" },
  { feature: "Airframes deployed", shoot: "1", production: "2+", programme: "Scoped" },
  { feature: "Edited video", shoot: "60 sec", production: "Feature + cutdowns", programme: "Per cycle" },
  { feature: "Retouched stills", shoot: "25+", production: "80+", programme: "Per cycle" },
  { feature: "Survey accuracy statement", shoot: "No", production: "Optional", programme: "Included" },
  { feature: "Client library + archive", shoot: "No", production: "No", programme: "Included" },
  { feature: "Revision rounds", shoot: "1", production: "2", programme: "Unlimited" },
  { feature: "Standard turnaround", shoot: "48 hours", production: "5–10 days", programme: "72 hours" },
];
