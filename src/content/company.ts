export const processSteps = [
  {
    n: "01",
    title: "Brief & airspace check",
    duration: "Day 0",
    body:
      "You tell us what the footage has to do. We check the location against restricted airspace, heritage and military zones, and the seasonal weather pattern before quoting, so nothing surfaces later that changes the number.",
    outputs: ["Scope and fixed quote", "Airspace feasibility", "Risk assessment"],
  },
  {
    n: "02",
    title: "Permissions & planning",
    duration: "Day 1–5",
    body:
      "CAASL flight approval, landowner consent and any site-specific permission are filed and confirmed before anyone travels. For film we build a shot list you sign off; for survey we plan ground control.",
    outputs: ["CAASL approval", "Shot list or GCP layout", "Landowner consent"],
  },
  {
    n: "03",
    title: "Capture",
    duration: "On site",
    body:
      "Pilot plus observer, every time. We fly the plan, then the opportunities the plan did not anticipate, and we verify the data on site before the vehicle leaves the location.",
    outputs: ["Capture verified", "On-site backup", "Flight log"],
  },
  {
    n: "04",
    title: "Post-production",
    duration: "Day 1–7",
    body:
      "Grading and retouching, or photogrammetric processing, depending on what you commissioned. Survey outputs are validated against independent checkpoints before anything is released.",
    outputs: ["Graded deliverables", "QA pass", "Accuracy validation"],
  },
  {
    n: "05",
    title: "Delivery & handover",
    duration: "Day 7–10",
    body:
      "Files land in the formats and sizes your channels actually use, organised rather than dumped. Everything is archived so next season's recapture has a baseline to match.",
    outputs: ["Final files", "Usage licence", "Archived originals"],
  },
];

export const values = [
  {
    title: "Composition over altitude",
    body:
      "Height is where a shot starts, not what makes it good. We plan light, weather and movement first, and the drone is simply how we get the camera there.",
  },
  {
    title: "Safety is not a section",
    body:
      "It is the reason a shoot gets rescheduled and the reason no client has had an incident on our watch. We would rather lose a flight window than earn a headline.",
  },
  {
    title: "Own the permissions",
    body:
      "CAASL approval, restricted zone clearance, heritage site permission and landowner consent. You should never have to become an aviation expert to commission a photograph.",
  },
  {
    title: "Deliver what gets used",
    body:
      "A folder of 900 unsorted RAW files is not a deliverable. We ship graded, organised, correctly sized, and we ask about your channels before we assume.",
  },
];

export const team = [
  {
    name: "Dilhara Wijesinghe",
    role: "Founder & Chief Pilot",
    initials: "DW",
    bio: "Started shooting property from a borrowed drone in 2019 and never stopped. Flies the hill country and coastal work personally.",
    focus: "Film, tourism",
    hue: 196,
  },
  {
    name: "Nuwan Perera",
    role: "Director of Photography",
    initials: "NP",
    bio: "Came from documentary camera work and brought the grading discipline with him. Owns every colour decision that leaves the studio.",
    focus: "Cinematography, FPV",
    hue: 32,
  },
  {
    name: "Amaya Fernando",
    role: "Post-production Lead",
    initials: "AF",
    bio: "Runs the edit, the retouch and the delivery pipeline. The reason files arrive organised rather than as a shared drive link and an apology.",
    focus: "Edit, retouch, delivery",
    hue: 268,
  },
  {
    name: "Rizwan Careem",
    role: "Operations & Permissions",
    initials: "RC",
    bio: "Handles CAASL approvals, restricted zone clearances and site risk assessments, and is the person who says no when the weather says no.",
    focus: "Airspace, compliance",
    hue: 148,
  },
];

export const timeline = [
  {
    year: "2019",
    title: "One drone, weekend shoots",
    body: "Sky Lens starts photographing property listings around Colombo at weekends.",
  },
  {
    year: "2021",
    title: "Villas and the south coast",
    body: "The first villa portfolio commission takes the crew down the coast and turns hospitality into the core of the business.",
  },
  {
    year: "2023",
    title: "Cinematic capability",
    body: "A cinema airframe and a dedicated DoP move the studio from stills-with-video into genuine aerial film work.",
  },
  {
    year: "2024",
    title: "Survey and estates",
    body: "RTK photogrammetry and multispectral payloads open up plantation, civil and construction clients.",
  },
  {
    year: "2026",
    title: "Island-wide, nine crew",
    body: "1,240 flights logged, work in all nine provinces, and a safety record we intend to keep boring.",
  },
];

export const coverage = {
  base: "Colombo, Sri Lanka",
  primary: "Western, Southern, Central and Uva Provinces",
  note: "Travel within 40 km of Colombo is included in every quote. Everywhere else on the island is quoted at cost, and multi-location itineraries are usually cheaper than separate visits.",
  regions: [
    { name: "Western Province", detail: "Same-week scheduling", status: "core" },
    { name: "Southern & coastal", detail: "48-hour mobilisation", status: "core" },
    { name: "Hill country", detail: "48-hour mobilisation", status: "core" },
    { name: "Cultural Triangle", detail: "Project-based, permits vary", status: "extended" },
    { name: "North & East", detail: "Project-based deployment", status: "extended" },
  ],
};
