export type FaqItem = {
  q: string;
  a: string;
  group: "Booking" | "Permissions & safety" | "Deliverables" | "Technical";
};

export const faqs: FaqItem[] = [
  {
    group: "Booking",
    q: "How far ahead do I need to book?",
    a: "Two weeks is comfortable for most work around Colombo and the south coast. A single shoot can often happen inside 72 hours if the location is unrestricted. Anything needing clearance for a restricted zone, a heritage site or an event over guests needs four to six weeks, because the approving authority sets that timeline, not us.",
  },
  {
    group: "Booking",
    q: "What happens if the weather turns?",
    a: "We make the call, not you, and we make it early. Sri Lanka gives you two monsoons and a lot of afternoon cloud, so we plan around it rather than hope. If wind, rain or cloud puts the flight outside safe or usable limits we reschedule at no charge. You are never billed for a day we chose not to fly.",
  },
  {
    group: "Booking",
    q: "Which parts of the island do you cover?",
    a: "All of it. Travel within 40 km of Colombo is included in the quote; beyond that we bill transport and accommodation at cost. The south coast and hill country we reach within 48 hours. The Cultural Triangle, the north and the east are project-based, mostly because the permissions take longer, not the driving.",
  },
  {
    group: "Booking",
    q: "Can you shoot several properties in one trip?",
    a: "That is usually the cheapest way to do it. Mobilisation is the expensive part of any shoot, so a route covering four villas over three days costs far less than four separate visits. Tell us everything you want captured this season and we will plan an itinerary around it.",
  },
  {
    group: "Permissions & safety",
    q: "Are you registered and insured?",
    a: "Yes. Sky Lens operates as a registered UAV operator with the Civil Aviation Authority of Sri Lanka, and we carry public liability insurance. We provide proof of both with every engagement, and we will name your organisation on the certificate where your contract requires it.",
  },
  {
    group: "Permissions & safety",
    q: "Who handles the flight permissions?",
    a: "We do, in full. That covers CAASL flight approval, clearance for restricted and high-security areas, archaeological and heritage site permission, and landowner consent. You should not need to learn aviation regulation to commission a photograph.",
  },
  {
    group: "Permissions & safety",
    q: "Are there places you simply cannot fly?",
    a: "Yes, and we will tell you at the quote stage rather than on the day. Airport approaches, military and high-security installations and certain government areas are off limits. Some archaeological sites need Department of Archaeology permission and a few will not grant it at all. National parks have their own rules. We check every location before quoting.",
  },
  {
    group: "Permissions & safety",
    q: "Can you fly at a wedding or over a crowd?",
    a: "Yes, under an operations plan. Flight over people requires a documented risk assessment your venue can review, plus the relevant approval. We fit low-noise propellers and time the flying around the parts of the day that matter, so the coverage does not come at the cost of the ceremony.",
  },
  {
    group: "Permissions & safety",
    q: "What about privacy and neighbouring properties?",
    a: "We fly to the brief and nothing else. Cameras stay on the subject property, incidental capture of neighbouring land is removed in post, and we will not fly a site where landowner consent is unclear.",
  },
  {
    group: "Deliverables",
    q: "How quickly do I get the files?",
    a: "Stills and short-form edits land in 24 to 48 hours. Full productions take five to ten working days depending on the grade. Survey and inspection outputs run three to seven days because the validation step is not something we shorten. Rush processing is available at a premium.",
  },
  {
    group: "Deliverables",
    q: "Who owns the photographs and footage?",
    a: "You receive a perpetual commercial usage licence for the agreed channels on delivery. Full copyright assignment and broadcast or resale licensing are available and quoted separately. We retain the right to show work in our portfolio unless you ask us not to, and some clients do.",
  },
  {
    group: "Deliverables",
    q: "Can I get the raw files?",
    a: "Yes. RAW stills and log video rushes are included on every production day and available on request otherwise, delivered on an encrypted drive with a manifest. Most clients do not want them, but the ones who do usually have a reason.",
  },
  {
    group: "Deliverables",
    q: "Do you deliver in sizes ready for our channels?",
    a: "Always. Tell us where the work is going and you get correctly sized, correctly compressed files for each destination, organised into folders. A single oversized export you then have to crop yourself is not a finished job.",
  },
  {
    group: "Technical",
    q: "What camera and resolution do you shoot?",
    a: "Stills at 48 MP with HDR bracketing, which matters in tropical light where the sky and the shade are several stops apart. Video up to 6K in 10-bit log, so there is real latitude in the grade rather than a baked-in look you cannot change.",
  },
  {
    group: "Technical",
    q: "How accurate is your survey data?",
    a: "Two centimetres horizontal on RTK-corrected photogrammetry with adequate ground control, at 0.8 cm ground sample distance. Every survey ships with an accuracy statement listing the independent checkpoint residuals, so you are not taking our word for it.",
  },
  {
    group: "Technical",
    q: "What file formats do you deliver?",
    a: "Photography as graded JPEG plus RAW on request. Video in whatever codec your edit suite is cutting in. Survey work as GeoTIFF orthomosaics, point clouds, and contours into your CAD environment. Tell us the coordinate reference system and we deliver in it.",
  },
];

export const faqGroups = Array.from(new Set(faqs.map((f) => f.group)));
