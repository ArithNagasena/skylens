export type Project = {
  slug: string;
  title: string;
  client: string;
  category:
    | "Religious Festivals"
    | "Real Estate"
    | "Weddings"
    | "Mapping"
    | "Inspection"
    | "Events"
    | "Tourism";
  year: number;
  location: string;
  /** One-line hook used on cards */
  excerpt: string;
  /**
   * Frames for the card's carousel, in order. Three each; the card's arrows
   * and dots are driven off the length, so more or fewer both work.
   */
  images: string[];
  /**
   * Full YouTube watch URL for the card's "Watch on YouTube" button. The
   * button is hidden when this is empty, so a project without a film simply
   * shows one fewer control rather than a dead link.
   */
  youtubeUrl: string;
  challenge: string;
  approach: string[];
  deliverables: string[];
  results: { metric: string; label: string }[];
  services: string[];
  /** Deterministic seed for the generated terrain artwork */
  seed: number;
  hue: number;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "ella-ridge-resort",
    title: "Ella Ridge Resort brand film",
    client: "Ceylon Harbour Resorts",
    category: "Tourism",
    year: 2025,
    location: "Ella, Uva Province",
    excerpt:
      "A three-minute film shot across two seasons to launch a hill country resort that had never been seen from the air.",
    images: [
      "/images/projects/ella-ridge-1.jpg",
      "/images/projects/ella-ridge-2.jpg",
      "/images/projects/ella-ridge-3.jpg",
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=EZOCHcZEvBw",
    challenge:
      "The resort sits on an escarpment above Ella at 1,040 m, where cloud rolls in most afternoons and the valley below is clear for perhaps ninety minutes after sunrise. Ceylon Harbour needed launch material eight months out, with no existing footage of the site at all.",
    approach: [
      "Modelled sunrise cloud behaviour across the site to fix a 90-minute daily flight window",
      "Returned in both the dry season and the inter-monsoon so the film shows the ridge in two entirely different moods",
      "Flew the Nine Arches viaduct and tea slopes as context, with landowner permission secured in advance",
      "Paired a cinema airframe for the hero reveals with an FPV rig for the descent through the tea terraces",
    ],
    deliverables: [
      "Three-minute brand film, fully graded",
      "Five 30-second cutdowns for paid media",
      "Vertical social set, 18 clips",
      "410 GB of catalogued log rushes",
    ],
    results: [
      { metric: "2.4M", label: "Views in first quarter" },
      { metric: "+58%", label: "Direct booking enquiries" },
      { metric: "2", label: "Seasons captured" },
    ],
    services: ["cinematic-videography", "tourism-hospitality"],
    seed: 1174,
    hue: 148,
    featured: true,
  },
  {
    slug: "serendib-south-coast",
    title: "South coast villa collection",
    client: "Serendib Villas",
    category: "Tourism",
    year: 2025,
    location: "Ahangama to Tangalle, Southern Province",
    excerpt:
      "Eleven villas along ninety kilometres of coast, photographed and filmed in a single six-day mobilisation.",
    images: [
      "/images/projects/serendib-coast-1.jpg",
      "/images/projects/serendib-coast-2.jpg",
      "/images/projects/serendib-coast-3.jpg",
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=nq5P6Fbzuok",
    challenge:
      "Serendib had eleven properties shot by eleven different photographers over four years. The imagery was inconsistent, mostly ground-level, and gave no sense of how close each villa actually sat to the beach, which was the thing guests asked about most.",
    approach: [
      "Built a single six-day route along the coast so all eleven properties were captured under comparable light",
      "Standardised a shot list per villa: approach, beach proximity, pool line, sunset, and one hero frame",
      "Flew each property at both sunrise and sunset to give the marketing team a choice of mood",
      "Delivered into a tagged library structured by property, orientation and channel",
    ],
    deliverables: [
      "1,340 retouched stills across eleven properties",
      "Eleven 90-second property films",
      "60 vertical clips for social and OTA listings",
      "Tagged, licensed content library",
    ],
    results: [
      { metric: "6 days", label: "For all 11 properties" },
      { metric: "+41%", label: "Direct booking share" },
      { metric: "1 look", label: "Across the whole portfolio" },
    ],
    services: ["aerial-photography", "tourism-hospitality", "cinematic-videography"],
    seed: 8265,
    hue: 196,
    featured: true,
  },
  {
    slug: "palm-tide-galle-wedding",
    title: "Galle Fort wedding coverage",
    client: "Palm & Tide Weddings",
    category: "Weddings",
    year: 2025,
    location: "Galle Fort, Southern Province",
    excerpt:
      "A heritage-site ceremony flown discreetly under permission, with the highlight clip delivered before the reception ended.",
    images: [
      "/images/projects/galle-wedding-1.jpg",
      "/images/projects/galle-wedding-2.jpg",
      "/images/projects/galle-wedding-3.jpg",
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=r6HTCiPwJr8",
    challenge:
      "A ceremony on the Galle Fort ramparts with 180 guests, a heritage site with its own restrictions, and a couple who wanted aerial coverage without a drone audibly hovering through their vows.",
    approach: [
      "Secured heritage site and CAASL flight approvals six weeks ahead of the date",
      "Fitted low-noise propellers and flew at height during the ceremony, descending only during the drinks reception",
      "Agreed a shot list with the ground videographer so aerial and ground coverage cut together",
      "Cut a 60-second clip on site from proxies while the reception was still running",
    ],
    deliverables: [
      "Four-minute aerial highlight film",
      "60-second clip delivered on the night",
      "Full-resolution stills selection",
      "Raw footage handed to the couple's main videographer",
    ],
    results: [
      { metric: "40 min", label: "From last shot to delivered clip" },
      { metric: "180", label: "Guests, no disruption" },
      { metric: "0", label: "Permission issues on the day" },
    ],
    services: ["weddings-events", "cinematic-videography"],
    seed: 2381,
    hue: 32,
    featured: true,
  },
  {
    slug: "bluepine-kandy-release",
    title: "Kandy hillside land release",
    client: "Bluepine Estates",
    category: "Real Estate",
    year: 2025,
    location: "Kandy District, Central Province",
    excerpt:
      "Thirty-two hillside plots photographed, mapped and released in one weekend. Sold out in twenty-four days.",
    images: [
      "/images/projects/bluepine-kandy-1.jpg",
      "/images/projects/bluepine-kandy-2.jpg",
      "/images/projects/bluepine-kandy-3.jpg",
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=EZOCHcZEvBw",
    challenge:
      "A land release with no built structures. Buyers had to understand aspect, gradient and valley outlook from a plot plan alone, which had stalled the previous phase for months.",
    approach: [
      "Captured a single high-altitude orthomosaic as the base layer for every plot graphic",
      "Composited surveyed boundaries onto per-plot aerial stills so buyers saw their exact parcel",
      "Shot late-afternoon frames to sell the valley outlook rather than the cleared ground",
      "Produced eye-level view simulations from each plot's likely building position",
    ],
    deliverables: [
      "32 per-plot boundary overlay images",
      "Site-wide orthomosaic and interactive map base",
      "90-second release film",
      "150 retouched stills across the estate",
    ],
    results: [
      { metric: "24 days", label: "To full sell-out" },
      { metric: "32/32", label: "Plots released with media" },
      { metric: "3.6x", label: "Enquiry rate over phase one" },
    ],
    services: ["real-estate-media", "aerial-photography", "survey-mapping"],
    seed: 6108,
    hue: 208,
  },
  {
    slug: "southern-expressway-survey",
    title: "Interchange topographic survey",
    client: "Meridian Civil",
    category: "Mapping",
    year: 2024,
    location: "Kottawa, Western Province",
    excerpt:
      "170 hectares of live expressway interchange surveyed to 2 cm without closing a single lane.",
    images: [
      "/images/projects/expressway-1.jpg",
      "/images/projects/expressway-2.jpg",
      "/images/projects/expressway-3.jpg",
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=nq5P6Fbzuok",
    challenge:
      "The design team needed a full topographic base for an interchange upgrade. Conventional ground survey would have required rolling lane closures on one of the busiest sections of the Southern Expressway.",
    approach: [
      "Established 18 ground control points on verges reachable without entering the carriageway",
      "Flew PPK-corrected photogrammetry at 95 m across four early-morning sorties",
      "Scheduled every flight before 7am, ahead of both traffic build-up and thermal turbulence",
      "Validated the model against 40 independent checkpoints before release",
    ],
    deliverables: [
      "Orthomosaic at 0.8 cm GSD",
      "Point cloud and 3D surface model",
      "0.25 m contour set delivered to the design team",
      "Accuracy statement with checkpoint residuals",
    ],
    results: [
      { metric: "2 cm", label: "Verified horizontal accuracy" },
      { metric: "0", label: "Lane closures required" },
      { metric: "4 wks", label: "Pulled out of programme" },
    ],
    services: ["survey-mapping", "construction-progress"],
    seed: 3092,
    hue: 232,
  },
  {
    slug: "northgate-rajagiriya",
    title: "Rajagiriya mixed-use, 22-month record",
    client: "Northgate Developments",
    category: "Mapping",
    year: 2025,
    location: "Rajagiriya, Western Province",
    excerpt:
      "Monthly capture across a 22-month build that settled a seven-figure earthworks dispute in an afternoon.",
    images: [
      "/images/projects/northgate-1.jpg",
      "/images/projects/northgate-2.jpg",
      "/images/projects/northgate-3.jpg",
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=r6HTCiPwJr8",
    challenge:
      "A mixed-use development with three contractors and monthly draw reporting to a lender. Nobody could agree on what had actually been completed in any given month.",
    approach: [
      "Locked a monthly flight slot with identical waypoints for the full programme",
      "Overlaid each capture against the design model to flag deviation early",
      "Tracked cut-and-fill volumes between visits to verify earthworks claims",
      "Published every cycle to a shared folder all three contractors could reference",
    ],
    deliverables: [
      "22 monthly orthomosaics and 3D site models",
      "Cumulative volumetric ledger",
      "Monthly 90-second reel for the lender pack",
      "Full time-lapse of the completed build",
    ],
    results: [
      { metric: "LKR 41M", label: "Earthworks claim resolved" },
      { metric: "22", label: "Consecutive capture cycles" },
      { metric: "1 day", label: "Draw-report prep, was 2 weeks" },
    ],
    services: ["construction-progress", "survey-mapping"],
    seed: 4517,
    hue: 42,
  },
  {
    slug: "mannar-wind-inspection",
    title: "Wind farm blade inspection",
    client: "Lanka Renewables",
    category: "Inspection",
    year: 2025,
    location: "Mannar, Northern Province",
    excerpt:
      "A full-fleet blade audit completed in six days, without taking the array offline.",
    images: [
      "/images/projects/mannar-wind-1.jpg",
      "/images/projects/mannar-wind-2.jpg",
      "/images/projects/mannar-wind-3.jpg",
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=EZOCHcZEvBw",
    challenge:
      "Rope-access inspection took four weeks and required curtailing generation on each turbine. Two late-stage blade failures in the prior year had made the board sceptical of the existing programme.",
    approach: [
      "Built automated orbit missions per turbine so every blade face is captured at an identical standoff",
      "Worked around the Mannar wind regime, flying in the calmer early-morning window",
      "Ran visual and thermal passes in a single sortie to catch delamination invisible in RGB",
      "Processed nightly so the site team had a triage list each morning",
    ],
    deliverables: [
      "4,180 inspection frames, indexed by turbine and blade face",
      "Defect register with 146 graded findings",
      "Thermal overlay set for 22 suspected delaminations",
      "Baseline archive for annual trend comparison",
    ],
    results: [
      { metric: "6 days", label: "Down from 4 weeks" },
      { metric: "146", label: "Defects catalogued" },
      { metric: "Zero", label: "Curtailment cost" },
    ],
    services: ["asset-inspection"],
    seed: 7741,
    hue: 20,
  },
  {
    slug: "atlas-tea-estate",
    title: "Tea estate canopy mapping",
    client: "Atlas Plantations",
    category: "Mapping",
    year: 2024,
    location: "Bogawantalawa, Central Province",
    excerpt:
      "Multispectral flights across 840 hectares of tea found a drainage fault three weeks before visual symptoms.",
    images: [
      "/images/projects/atlas-estate-1.jpg",
      "/images/projects/atlas-estate-2.jpg",
      "/images/projects/atlas-estate-3.jpg",
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=nq5P6Fbzuok",
    challenge:
      "Atlas suspected uneven performance across several divisions of a recently consolidated estate but had no way to see it until the plucking round came in short.",
    approach: [
      "Flew calibrated 5-band multispectral across all divisions at three-week intervals",
      "Used NDRE, which surfaces canopy stress earlier than NDVI in mature tea",
      "Cross-referenced stress zones against the drainage layout to isolate the failing section",
      "Issued zone reports the field officers could walk to directly",
    ],
    deliverables: [
      "Eight calibrated index maps per division",
      "Shapefiles for the estate GIS",
      "Drainage fault report with located zones",
      "Season-over-season comparison set",
    ],
    results: [
      { metric: "3 wks", label: "Earlier fault detection" },
      { metric: "+7%", label: "Division yield recovered" },
      { metric: "840 ha", label: "Mapped per cycle" },
    ],
    services: ["survey-mapping"],
    seed: 5233,
    hue: 168,
  },
  {
    slug: "bolgoda-regatta",
    title: "Bolgoda Lake regatta coverage",
    client: "Palm & Tide Weddings",
    category: "Events",
    year: 2025,
    location: "Bolgoda Lake, Western Province",
    excerpt:
      "Two days of racing, three airframes, and a highlight reel published before the prize-giving finished.",
    images: [
      "/images/projects/bolgoda-regatta-1.jpg",
      "/images/projects/bolgoda-regatta-2.jpg",
      "/images/projects/bolgoda-regatta-3.jpg",
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=r6HTCiPwJr8",
    challenge:
      "A two-day regatta with 4,000 spectators, an organiser expecting live aerial coverage for the big screen, and restricted airspace on the approach path to Ratmalana.",
    approach: [
      "Secured CAASL approval and coordinated with Ratmalana air traffic six weeks ahead",
      "Positioned three airframes with staggered battery cycles for uninterrupted coverage",
      "Ran a live downlink to the event screen throughout both days",
      "Cut the highlight reel on site from proxies as the racing finished",
    ],
    deliverables: [
      "Two days of live aerial feed to the event screen",
      "Three-minute highlight film, published same day",
      "35 vertical social clips across the weekend",
      "Full-resolution stills archive for the organisers",
    ],
    results: [
      { metric: "9 hrs", label: "Continuous live coverage" },
      { metric: "25 min", label: "From last race to published reel" },
      { metric: "4,000", label: "Spectators covered safely" },
    ],
    services: ["weddings-events", "cinematic-videography"],
    seed: 9412,
    hue: 188,
  },
  {
    slug: "kandy-esala-perahera",
    title: "Kandy Esala Perahera night coverage",
    client: "Sri Dalada Maligawa media office",
    category: "Religious Festivals",
    year: 2025,
    location: "Kandy, Central Province",
    excerpt:
      "Ten nights of the randoli perahera filmed from above without a single flight over the procession itself.",
    images: [
      "/images/projects/kandy-perahera-1.jpg",
      "/images/projects/kandy-perahera-2.jpg",
      "/images/projects/kandy-perahera-3.jpg",
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=EZOCHcZEvBw",
    challenge:
      "The most photographed procession in the country, at night, over dense crowds, around a site where the airspace is restricted and the temple's own protocols matter more than any shot we might want. Nobody had produced usable aerial coverage of the randoli perahera before.",
    approach: [
      "Six weeks of permissions: CAASL, the Diyawadana Nilame's office, Kandy police and the Air Force",
      "Flight lines fixed along rooftops and the lake so no flight ever crossed the procession or the crowd",
      "Low-light capture at 6400 ISO on the cinema airframe, no lighting of any kind added",
      "Silent approach profile agreed with the temple so the drone was never audible from the route",
    ],
    deliverables: [
      "Ten nights of graded aerial coverage",
      "Six-minute documentary cut for the temple archive",
      "Broadcast-ready feed supplied nightly to two networks",
      "Stills set released to press each morning",
    ],
    results: [
      { metric: "10", label: "Consecutive nights flown" },
      { metric: "0", label: "Flights over the procession" },
      { metric: "2", label: "Networks carrying the feed" },
    ],
    services: ["cinematic-videography", "weddings-events"],
    seed: 6120,
    hue: 208,
  },
  {
    slug: "kataragama-perahera",
    title: "Kataragama Esala festival",
    client: "Ruhunu Maha Kataragama Devalaya",
    category: "Religious Festivals",
    year: 2026,
    location: "Kataragama, Uva Province",
    excerpt:
      "Aerial flower drops over the devalaya on the final night, flown with a cleared corridor and a rehearsal pass.",
    images: [
      "/images/projects/kataragama-1.jpg",
      "/images/projects/kataragama-2.jpg",
      "/images/projects/kataragama-3.jpg",
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=nq5P6Fbzuok",
    challenge:
      "The devalaya wanted a floral drop over the final night's procession, in front of tens of thousands of pilgrims, at a site with no vehicle access to the release point and a hard cue window of about ninety seconds.",
    approach: [
      "Drop corridor surveyed and cordoned with the devalaya's own marshals",
      "Full rehearsal flown at dawn, before pilgrims were admitted to the grounds",
      "Heavy-lift airframe carrying 38 kg of petals across three passes",
      "Second airframe capturing the drop from altitude while the first flew it",
    ],
    deliverables: [
      "Three timed floral passes over the procession",
      "Aerial and ground coverage of the drop, graded",
      "Stills released to the devalaya the same night",
      "Risk assessment and permissions pack retained by the trustees",
    ],
    results: [
      { metric: "38 kg", label: "Petals released" },
      { metric: "90 s", label: "Cue window hit" },
      { metric: "0", label: "Incidents on site" },
    ],
    services: ["flower-dropping", "cinematic-videography"],
    seed: 7340,
    hue: 214,
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const projectSlugs = projects.map((p) => p.slug);
export const featuredProjects = projects.filter((p) => p.featured);
export const projectCategories = [
  "All",
  "Religious Festivals",
  "Real Estate",
  "Weddings",
  "Mapping",
  "Inspection",
  "Events",
  "Tourism",
] as const;
