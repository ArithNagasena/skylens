export type Service = {
  slug: string;
  title: string;
  short: string;
  tagline: string;
  summary: string;
  /**
   * One short line for the services-page card — roughly ten words, plain.
   * Deliberately separate from `summary`, which is longer because it doubles
   * as the page meta description, the JSON-LD description and the lede on the
   * service's own page. A card is scanned, not read.
   */
  cardSummary: string;
  /** lucide-react icon name, resolved in components/ui/icon.tsx */
  icon: string;
  accent: "signal" | "beacon" | "horizon";
  /** "core" leads the site; "specialist" sits below it */
  tier: "core" | "specialist";
  heroLine: string;
  capabilities: string[];
  deliverables: string[];
  useCases: string[];
  specs: { label: string; value: string }[];
  startingAt: string;
  turnaround: string;
  relatedWork: string[];
};

export const services: Service[] = [
  /* ------------------------------------------------------------------ core */
  {
    slug: "aerial-photography",
    title: "Aerial Photography",
    short: "Photography",
    tagline: "The frame you cannot get from the ground.",
    summary:
      "Professional drone stills for brands, publications, hotels and property. High-resolution, properly graded, and delivered in the sizes your channels actually need rather than one oversized folder.",
    cardSummary: "High-resolution drone stills for brands, property and hospitality.",
    icon: "Camera",
    accent: "signal",
    tier: "core",
    heroLine:
      "A good aerial photograph is a composition decision, not an altitude decision. Height is only where we start.",
    capabilities: [
      "48 MP stills with HDR bracketing for high-contrast tropical light",
      "Golden hour and blue hour scheduling around monsoon patterns",
      "Top-down, oblique and low-level perspectives in one session",
      "Panoramic and multi-frame stitched captures",
      "Full colour grading and retouching, not straight-off-the-card files",
    ],
    deliverables: [
      "25 to 60 fully retouched high-resolution stills",
      "Web and social crops at 16:9, 4:5 and 1:1",
      "Original RAW files on request",
      "Commercial usage licence for the agreed channels",
    ],
    useCases: [
      "Hotel, villa and resort photography",
      "Brand and editorial commissions",
      "Property and land listings",
      "Tourism and destination marketing",
    ],
    specs: [
      { label: "Stills", value: "48 MP, HDR bracketed" },
      { label: "Format", value: "RAW + graded JPEG" },
      { label: "On-site", value: "2 to 4 hours" },
      { label: "Crew", value: "Pilot plus observer" },
    ],
    startingAt: "LKR 25,000+",
    turnaround: "24 to 48 hours",
    relatedWork: ["serendib-south-coast", "bluepine-kandy-release"],
  },
  {
    slug: "cinematic-videography",
    title: "Cinematic Drone Videography",
    short: "Videography",
    tagline: "Camera moves that reset the scale of a story.",
    summary:
      "Cinematic aerial film for brand campaigns, hotels, documentaries and music videos. We fly the shot list you storyboarded, and the one you did not know was possible until the drone was in the air.",
    cardSummary: "4K aerial film for campaigns, hotels and documentaries.",
    icon: "Clapperboard",
    accent: "signal",
    tier: "core",
    heroLine:
      "A reveal is only as good as the frame it opens on. We plan altitude, light and motion as one decision.",
    capabilities: [
      "6K capture with 10-bit log profiles for full grading latitude",
      "FPV chase and single-take proximity flying",
      "Dual-operator setups, pilot plus dedicated camera operator",
      "Sun-path planning around hill country cloud and coastal haze",
      "Motion-matched ground-to-air transitions",
    ],
    deliverables: [
      "Graded master in your delivery codec",
      "Full log rushes on an encrypted drive",
      "Social cutdowns at 16:9, 9:16 and 1:1",
      "Shot log with timecode and location reference",
    ],
    useCases: [
      "Brand films and television commercials",
      "Hotel, resort and destination reels",
      "Documentary and travel features",
      "Music videos and event openers",
    ],
    specs: [
      { label: "Sensor", value: "4/3 and 1-inch CMOS" },
      { label: "Max resolution", value: "6K / 60 fps" },
      { label: "Colour", value: "D-Log M, 10-bit" },
      { label: "Crew", value: "2 to 3 on location" },
    ],
    startingAt: "LKR 45,000+",
    turnaround: "5 to 10 working days",
    relatedWork: ["ella-ridge-resort", "serendib-south-coast"],
  },
  {
    slug: "real-estate-media",
    title: "Real Estate Media",
    short: "Real Estate",
    tagline: "Listings that sell the location, not just the layout.",
    summary:
      "A complete aerial and ground media package for agents, developers and villa owners. Context shots, sunset exteriors, boundary overlays and walkthrough video, captured in a single visit.",
    cardSummary: "Aerial and ground media for agents, developers and villa owners.",
    icon: "Building2",
    accent: "beacon",
    tier: "core",
    heroLine:
      "Buyers decide on setting before they ever read the floor plan. We give them the whole neighbourhood in one frame.",
    capabilities: [
      "Aerial stills, sunset exteriors and elevation sets",
      "Boundary and lot-line graphic overlays",
      "Interior and exterior video walkthroughs",
      "Beach access, road frontage and amenity context mapping",
      "Portal-ready sizing and compression",
    ],
    deliverables: [
      "25 to 60 retouched high-resolution stills",
      "60 to 120 second listing film with licensed audio",
      "Vertical cut for social and property portals",
      "Annotated boundary overlay image",
    ],
    useCases: [
      "Residential and luxury villa listings",
      "Land parcels and subdivisions",
      "Hotels and short-let portfolios",
      "Commercial and warehouse leasing",
    ],
    specs: [
      { label: "Stills", value: "48 MP, HDR bracketed" },
      { label: "Video", value: "4K / 60 fps" },
      { label: "On-site", value: "2 to 4 hours" },
      { label: "Coverage", value: "Up to 8 hectares" },
    ],
    startingAt: "LKR 32,000+",
    turnaround: "24 to 48 hours",
    relatedWork: ["bluepine-kandy-release"],
  },
  {
    slug: "weddings-events",
    title: "Wedding & Event Droneography",
    short: "Weddings",
    tagline: "The shot that shows how big the day actually was.",
    summary:
      "Aerial coverage for weddings, receptions, festivals and corporate events, flown discreetly and under an operations plan your venue will sign off on.",
    cardSummary: "Discreet aerial coverage of weddings, receptions and festivals.",
    icon: "PartyPopper",
    accent: "beacon",
    tier: "core",
    heroLine:
      "Aerial work over guests is a permissions problem before it is a camera problem. We solve both, quietly.",
    capabilities: [
      "Venue risk assessment and CAASL flight approval",
      "Discreet operation timed around ceremony and speeches",
      "Coordination with your ground photographer and videographer",
      "Coastal, hill country and heritage venue experience",
      "Same-day highlight clip where the schedule allows",
    ],
    deliverables: [
      "Edited highlight film with licensed music",
      "Vertical social cuts for the couple or organisers",
      "Full-resolution stills selection",
      "Raw footage handover to your main videographer",
    ],
    useCases: [
      "Beach and resort weddings",
      "Hill country and heritage venue ceremonies",
      "Festivals, perahera and cultural events",
      "Corporate launches and openings",
    ],
    specs: [
      { label: "Video", value: "4K / 60 fps" },
      { label: "Redundancy", value: "Second airframe on site" },
      { label: "Noise", value: "Low-noise props fitted" },
      { label: "Permits", value: "Handled in-house" },
    ],
    startingAt: "LKR 50,000+",
    turnaround: "Same day to 7 days",
    relatedWork: ["palm-tide-galle-wedding", "bolgoda-regatta"],
  },
  {
    slug: "tourism-hospitality",
    title: "Tourism & Hospitality Media",
    short: "Tourism",
    tagline: "Sri Lanka photographs extraordinarily well. We make that work for you.",
    summary:
      "Full media packages for hotels, villas, tour operators and destination marketing. One trip produces the stills, the film and the social library for a whole season.",
    cardSummary: "Complete media packages for hotels, resorts and tour operators.",
    icon: "Palmtree",
    accent: "horizon",
    tier: "core",
    heroLine:
      "Guests book a feeling. Our job is to get the feeling of the place into a frame before they have ever been there.",
    capabilities: [
      "Combined aerial and ground capture across a property",
      "Multi-location island itineraries in a single mobilisation",
      "Seasonal recapture so imagery matches the actual weather",
      "Heritage and national park permissions where required",
      "Content library structured for OTA, web and social use",
    ],
    deliverables: [
      "Property film, 90 to 180 seconds",
      "120+ stills across rooms, grounds and surroundings",
      "30+ vertical social clips",
      "Organised, tagged and licensed content library",
    ],
    useCases: [
      "Boutique hotels and resorts",
      "Private villas and short-let portfolios",
      "Tour operators and travel brands",
      "Destination and regional marketing",
    ],
    specs: [
      { label: "Locations", value: "Up to 4 per mobilisation" },
      { label: "Video", value: "6K / 10-bit" },
      { label: "On-site", value: "1 to 3 days" },
      { label: "Licence", value: "Perpetual commercial" },
    ],
    startingAt: "LKR 100,000+",
    turnaround: "7 to 14 working days",
    relatedWork: ["ella-ridge-resort", "serendib-south-coast"],
  },

  /* ------------------------------------------------------------ specialist */
  {
    slug: "survey-mapping",
    title: "Survey & Mapping",
    short: "Mapping",
    tagline: "Measured data, not just a nice picture of the ground.",
    summary:
      "RTK-corrected photogrammetry that turns a site into an orthomosaic, a 3D model and a volumetric report, geo-referenced and ready for your CAD or GIS stack.",
    cardSummary: "Centimetre-accurate maps, models and volume measurements.",
    icon: "Map",
    accent: "horizon",
    tier: "specialist",
    heroLine:
      "A survey is not a picture of the ground. It is a measurement you can defend in a planning meeting.",
    capabilities: [
      "RTK / PPK positioning for centimetre-level accuracy",
      "Digital surface and terrain models",
      "Stockpile and cut-fill volumetric analysis",
      "Ground control point establishment and validation",
      "Independent checkpoint residuals issued with every survey",
    ],
    deliverables: [
      "Geo-referenced orthomosaic (GeoTIFF)",
      "Point cloud and 3D mesh",
      "Contour lines and elevation model",
      "Accuracy statement with checkpoint residuals",
    ],
    useCases: [
      "Pre-construction topographic survey",
      "Quarry and stockpile measurement",
      "Land development and subdivision planning",
      "Drainage and flood modelling",
    ],
    specs: [
      { label: "Accuracy", value: "2 cm horizontal" },
      { label: "GSD", value: "0.8 cm / pixel" },
      { label: "Daily coverage", value: "Up to 200 hectares" },
      { label: "Output CRS", value: "SLD99 or any EPSG" },
    ],
    startingAt: "LKR 50,000+",
    turnaround: "3 to 7 working days",
    relatedWork: ["southern-expressway-survey", "northgate-rajagiriya"],
  },
  {
    slug: "construction-progress",
    title: "Construction Monitoring",
    short: "Construction",
    tagline: "One flight a month. A whole project on record.",
    summary:
      "Scheduled aerial documentation that keeps owners, lenders and site teams looking at the same version of reality, with as-built imagery captured from identical waypoints every visit.",
    cardSummary: "Monthly aerial records of site progress from fixed waypoints.",
    icon: "HardHat",
    accent: "beacon",
    tier: "specialist",
    heroLine:
      "Disputes are expensive. A time-stamped orthomosaic from the week in question is not.",
    capabilities: [
      "Fixed-interval capture from repeatable waypoints",
      "As-built versus design overlay",
      "Earthworks volume tracking between visits",
      "Site-wide safety and logistics review imagery",
      "Progress reels for board and investor updates",
    ],
    deliverables: [
      "Monthly orthomosaic and 3D site model",
      "Progress comparison image sets",
      "Executive summary reel, 60 to 90 seconds",
      "Cumulative archive with searchable dates",
    ],
    useCases: [
      "Commercial and residential development",
      "Infrastructure and civil works",
      "Hotel and resort construction",
      "Lender and insurer reporting",
    ],
    specs: [
      { label: "Cadence", value: "Weekly or monthly" },
      { label: "Waypoint repeat", value: "10 cm" },
      { label: "Archive", value: "Retained 7 years" },
      { label: "Access", value: "Shared client folder" },
    ],
    startingAt: "LKR 30,000+ / visit",
    turnaround: "72 hours per cycle",
    relatedWork: ["northgate-rajagiriya", "southern-expressway-survey"],
  },
  {
    slug: "asset-inspection",
    title: "Asset Inspection",
    short: "Inspection",
    tagline: "Find the fault before it becomes an outage.",
    summary:
      "Close-range visual inspection of roofs, towers, turbines, solar arrays and bridges, without scaffolding, rope access or a shutdown window.",
    cardSummary: "Close-range visual and thermal inspection, no scaffolding needed.",
    icon: "ScanSearch",
    accent: "signal",
    tier: "specialist",
    heroLine:
      "Every hour a structure is offline has a number attached. Our job is to make that number smaller.",
    capabilities: [
      "Zero-contact close-range visual capture",
      "Repeatable automated flight paths for trend data",
      "Defect tagging against asset identifiers",
      "Coastal corrosion and monsoon damage assessment",
      "Confined and obstructed-space navigation",
    ],
    deliverables: [
      "Annotated defect register with severity grading",
      "Full inspection image set, indexed by asset",
      "3D model for spatial reference",
      "Comparison set against the previous inspection",
    ],
    useCases: [
      "Roof, facade and building envelope surveys",
      "Solar array fault detection",
      "Wind turbine blade inspection",
      "Telecom tower and bridge audits",
    ],
    specs: [
      { label: "Zoom", value: "56x hybrid" },
      { label: "Standoff", value: "From 2 m" },
      { label: "Obstacle sensing", value: "Omnidirectional" },
      { label: "Output", value: "Indexed defect register" },
    ],
    startingAt: "LKR 35,000+",
    turnaround: "48 to 72 hours",
    relatedWork: ["mannar-wind-inspection"],
  },
  {
    slug: "flower-dropping",
    title: "Flower Dropping & Floral Aerial Services",
    short: "Floral drops",
    tagline: "The moment everyone films on their phones.",
    summary:
      "Precision aerial flower drops for weddings, perahera, temple ceremonies and civic events. Flown on the heavy-lift airframe with a cleared drop corridor, a spotter, and a rehearsal pass before anyone is under it.",
    cardSummary: "Precision aerial flower drops for weddings and ceremonies.",
    icon: "Flower2",
    accent: "beacon",
    tier: "core",
    heroLine:
      "A flower drop is a crowd-safety operation that happens to look beautiful. The planning is the product; the petals are the easy part.",
    capabilities: [
      "Heavy-lift airframe rated to a 50 kg payload",
      "Petal volume and release rate matched to the ceremony's timing",
      "Cleared drop corridor, cordon plan and dedicated spotter on every flight",
      "Rehearsal pass flown before the crowd is admitted",
      "Simultaneous aerial and ground capture of the drop itself",
    ],
    deliverables: [
      "The drop executed to the cue you specify",
      "Aerial and ground footage of the moment, graded",
      "Stills pulled from the sequence for same-day social use",
      "Risk assessment and permissions pack for the venue",
    ],
    useCases: [
      "Wedding processions and poruwa ceremonies",
      "Perahera and temple festivals",
      "Civic openings, memorials and school events",
      "Hotel and resort arrival moments",
    ],
    specs: [
      { label: "Payload", value: "Up to 50 kg" },
      { label: "Crew", value: "Pilot, spotter, ground marshal" },
      { label: "Lead time", value: "4 to 6 weeks" },
      { label: "Rehearsal", value: "Included" },
    ],
    startingAt: "LKR 100,000+",
    turnaround: "Footage in 48 to 72 hours",
    relatedWork: ["palm-tide-galle-wedding"],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const serviceSlugs = services.map((s) => s.slug);
export const coreServices = services.filter((s) => s.tier === "core");
export const specialistServices = services.filter((s) => s.tier === "specialist");
