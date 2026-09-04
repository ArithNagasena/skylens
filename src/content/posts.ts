export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Field notes" | "Regulation" | "Technical" | "Industry";
  date: string;
  readingMinutes: number;
  author: string;
  hue: number;
  body: Block[];
};

export const posts: Post[] = [
  {
    slug: "shooting-aerials-in-tropical-light",
    title: "Shooting aerials in tropical light",
    excerpt:
      "Sri Lanka gives you extraordinary scenery and brutally difficult exposure. The two arrive together.",
    category: "Field notes",
    date: "2026-08-12",
    readingMinutes: 6,
    author: "Nuwan Perera",
    hue: 204,
    body: [
      {
        type: "p",
        text: "The single hardest thing about aerial work here is not the flying. It is that at eleven in the morning the difference between a white sand beach and the shade under a coconut palm is six or seven stops, and a drone sensor is not a cinema camera with a fourteen-stop latitude to spend on the problem.",
      },
      {
        type: "p",
        text: "You can fight that with grading afterwards, badly. Or you can stop shooting at eleven in the morning.",
      },
      { type: "h2", text: "The window is narrower than people expect" },
      {
        type: "p",
        text: "Close to the equator the sun climbs fast and drops fast. There is no long European golden hour to relax into. From first light you get perhaps fifty usable minutes on the coast before contrast becomes unmanageable, and roughly the same again at the other end of the day.",
      },
      {
        type: "p",
        text: "In the hill country it is different and often better. Cloud builds through the morning and diffuses everything, which is punishing if you wanted a clear valley reveal and a gift if you wanted texture in a tea slope. We plan hill country shoots knowing we may get either, and we build a shot list for both outcomes rather than one that only works in sunshine.",
      },
      { type: "h2", text: "Expose for the highlight, always" },
      {
        type: "list",
        items: [
          "Protect the sky and the sand — once white is clipped there is nothing to recover, and in a wide aerial the sky is half your frame",
          "Shoot HDR brackets on stills as standard, not as a special case",
          "Use a fixed ND so shutter angle stays sensible and motion looks like motion rather than a slideshow",
          "Lock white balance for the sequence; auto will drift as you rotate past the sun and the cut will strobe",
          "Watch the water — wet sand and lagoon surfaces will spike well past what the histogram suggests",
        ],
      },
      { type: "h2", text: "Haze is a composition problem, not a filter problem" },
      {
        type: "p",
        text: "Coastal humidity puts a veil over anything more than a couple of kilometres away. Dehaze sliders exist and they make the image look like it has been through a dehaze slider. The better answer is to compose so the distance is not carrying the shot: bring a foreground element into frame, drop altitude, or turn so the haze becomes atmosphere rather than a flaw.",
      },
      {
        type: "quote",
        text: "Some of the best frames we have shot on the south coast work precisely because the horizon dissolves. Fighting that with software would have thrown away the reason the shot was good.",
      },
      { type: "h2", text: "Salt is the maintenance cost nobody budgets for" },
      {
        type: "p",
        text: "A morning over the reef puts salt spray on every surface of the airframe. We rinse and inspect after every coastal shoot, and we replace motors on a schedule rather than on failure. It is unglamorous and it is the reason our aircraft last. If you are commissioning an operator who works the coast, it is a fair thing to ask them about.",
      },
    ],
  },
  {
    slug: "drone-permissions-in-sri-lanka",
    title: "Drone permissions in Sri Lanka: what actually has to happen",
    excerpt:
      "Clients assume the camera is the hard part. On a restricted site, the camera is the easy part.",
    category: "Regulation",
    date: "2026-07-02",
    readingMinutes: 7,
    author: "Rizwan Careem",
    hue: 211,
    body: [
      {
        type: "p",
        text: "A client calls about a shoot at a site near an archaeological reserve, three weeks out. They want to know whether we can fly it. The answer is usually yes, and the reason it is sometimes no has nothing whatsoever to do with the drone.",
      },
      {
        type: "p",
        text: "Sri Lanka is a small island with a lot of sensitive airspace packed into it. Airport approaches, military and high-security installations, certain government areas, archaeological reserves and national parks all carry restrictions, and several of them overlap in exactly the places that photograph best.",
      },
      { type: "h2", text: "Registration and approval are two separate things" },
      {
        type: "p",
        text: "Operating a drone commercially means the aircraft and the operator are registered with the Civil Aviation Authority of Sri Lanka. That is a standing arrangement — it is not something obtained per shoot. What is obtained per shoot is flight approval for the specific location, altitude and dates.",
      },
      {
        type: "p",
        text: "Clients frequently conflate the two, and then assume that because their operator is registered, any location is available at short notice. It is not. Registration lets us apply. Approval is what lets us fly.",
      },
      { type: "h2", text: "Site-specific permission sits on top" },
      {
        type: "list",
        items: [
          "Archaeological reserves and heritage sites require permission from the relevant authority, and it is not always granted",
          "National parks and wildlife areas have their own rules, generally restrictive and generally for good reason",
          "Hotels and private estates need landowner consent, which is separate from aviation approval",
          "Events over guests need a documented risk assessment the venue and insurer can review",
          "Anywhere near an airport approach path requires coordination that takes real time",
        ],
      },
      {
        type: "p",
        text: "For a straightforward villa on the south coast, none of this is difficult and the whole thing takes days. For a heritage site, budget four to six weeks and accept that the answer might be no.",
      },
      { type: "h2", text: "Why we quote the permission honestly" },
      {
        type: "p",
        text: "It would be commercially easier to say yes to everything and sort it out later. We do not, because the failure mode is severe: a crew and a client on site, a shoot that cannot legally happen, and a day everybody has paid for. So we check the location before quoting, and occasionally we tell a client at the enquiry stage that their preferred spot is not available and propose one that is.",
      },
      {
        type: "quote",
        text: "The most useful thing an operator can tell you is which of the locations on your list will not happen. That conversation is cheaper before the shoot than during it.",
      },
      { type: "h2", text: "Book the permission, not the drone" },
      {
        type: "p",
        text: "If your shoot depends on a restricted or heritage location, the date you need to protect is the application date, not the shoot date. Approving authorities work to their own timeline and no amount of budget compresses it. Tell us early and it is a formality. Tell us late and it becomes the reason the shoot moves.",
      },
    ],
  },
  {
    slug: "planning-a-shoot-around-the-monsoon",
    title: "Planning a shoot around two monsoons",
    excerpt:
      "Sri Lanka does not have a rainy season. It has two, on opposite sides of the island, at opposite times.",
    category: "Field notes",
    date: "2026-05-20",
    readingMinutes: 6,
    author: "Dilhara Wijesinghe",
    hue: 218,
    body: [
      {
        type: "p",
        text: "Overseas clients often ask which months are good for shooting in Sri Lanka. The honest answer is all of them, provided you are willing to move where you shoot. The island's great scheduling advantage is that when one coast is unusable, the other generally is not.",
      },
      { type: "h2", text: "Two systems, two coasts" },
      {
        type: "p",
        text: "Broadly, the southwest monsoon works the west and south coasts and the hill country through the middle of the year. The northeast monsoon works the north and east around the turn of the year. The inter-monsoon periods between them are unsettled everywhere and produce dramatic afternoon build-ups that are either the best thing in your film or the reason you did not fly.",
      },
      {
        type: "p",
        text: "So a January shoot on the south coast is usually comfortable and a January shoot in Trincomalee usually is not. In July it reverses. A client who is flexible about location can shoot productively any week of the year. A client who must have Mirissa in June is buying a harder problem.",
      },
      { type: "h2", text: "What we actually watch" },
      {
        type: "list",
        items: [
          "Gust spread rather than mean wind — a steady 8 m/s is fine, a mean of 6 gusting 14 is not, and consumer apps show them almost identically",
          "Cloud base, because a hill country reveal into flat grey is not a shot",
          "Precipitation probability inside the flight window, not across the day",
          "Afternoon convective build-up, which in the hills is close to a daily certainty",
          "Sea breeze onset on the coast, which reliably ends the calm morning window",
        ],
      },
      { type: "h2", text: "Build slack into the schedule" },
      {
        type: "p",
        text: "For any shoot where the light is part of the brief, we quote a primary day and hold a contingency window within the same fortnight. It is not padding. Across a full year of aerial work here we lose roughly one day in six to conditions, and a schedule that assumes otherwise is a schedule that will eventually force a bad decision.",
      },
      {
        type: "quote",
        text: "The client is paying for a shot, not for our attendance. A day we drove to and did not fly costs us. A day we flew badly costs them.",
      },
      { type: "h2", text: "Who makes the call" },
      {
        type: "p",
        text: "We do, and we put that in writing at the quote stage, because the alternative is a pilot weighing airworthiness against a client's disappointment while standing in a field in Ella. A weather cancellation is rebooked at no charge, which removes the last incentive anyone has to fly a marginal day.",
      },
    ],
  },
  {
    slug: "what-hotels-need-from-an-aerial-shoot",
    title: "What hotels actually need from an aerial shoot",
    excerpt:
      "Most hospitality briefs ask for a film. What the property usually needs is a library.",
    category: "Industry",
    date: "2026-04-08",
    readingMinutes: 5,
    author: "Dilhara Wijesinghe",
    hue: 200,
    body: [
      {
        type: "p",
        text: "A hotel commissions a two-minute film. It gets made, it goes on the homepage, everyone is pleased, and eight months later the marketing team is cropping stills out of it at 1080p because they have nothing else to post.",
      },
      {
        type: "p",
        text: "The film was not the wrong deliverable. It was an incomplete one. What a property actually consumes across a year is dozens of individual assets across a dozen channels, and almost none of them are two minutes long.",
      },
      { type: "h2", text: "Count the destinations first" },
      {
        type: "list",
        items: [
          "Website hero, which wants motion and a wide safe area for overlaid text",
          "Booking platform galleries, which want stills at specific ratios and file sizes",
          "Instagram and TikTok, which want vertical, and want a lot of it",
          "Travel agent and operator packs, which want high-resolution stills with usage rights attached",
          "Paid media, which wants short cutdowns in several lengths",
          "Print and press, which occasionally wants something enormous with no compression",
        ],
      },
      {
        type: "p",
        text: "One shoot can serve all of those, but only if it was planned to. Deciding at the edit stage that you also needed forty vertical clips means going back for them.",
      },
      { type: "h2", text: "Shoot the season you are selling" },
      {
        type: "p",
        text: "A property photographed in perfect February light and then marketed year-round is quietly promising something it cannot always deliver. The hotels that get the most out of a programme are the ones that recapture seasonally, so the imagery on the site in July looks like July.",
      },
      {
        type: "quote",
        text: "Guests are unusually good at spotting imagery that does not match the season they are booking into. It reads as staged even when it is entirely genuine.",
      },
      { type: "h2", text: "Ask for it organised" },
      {
        type: "p",
        text: "The deliverable that saves a marketing team the most time is not the hero film. It is a tagged, correctly sized, clearly licensed library that someone can search when they need a lagoon shot at 4:5 by Thursday. We build that as standard, and it costs nothing extra because the sorting happens once, in our edit, rather than repeatedly in yours.",
      },
    ],
  },
  {
    slug: "what-survey-grade-actually-means",
    title: "What “survey-grade” actually means",
    excerpt:
      "The phrase appears on almost every drone operator's website. Very few of them will show you the residuals behind it.",
    category: "Technical",
    date: "2026-02-14",
    readingMinutes: 7,
    author: "Rizwan Careem",
    hue: 214,
    body: [
      {
        type: "p",
        text: "Survey-grade is not a certification. Nobody issues it, nobody audits it, and there is no threshold you cross to earn the right to print it on a proposal. It is a marketing phrase that happens to sit next to real numbers, which is exactly what makes it dangerous when you are procuring a topographic base for something that will be built.",
      },
      { type: "h2", text: "Ground sample distance is not accuracy" },
      {
        type: "p",
        text: "GSD describes how much ground each pixel covers. At 0.8 cm per pixel, a crack in a slab is visible. That tells you about resolution, not about whether the coordinate attached to that crack is correct. An operator can fly low, produce a beautifully detailed orthomosaic, and still hand you a model that is forty centimetres out of position because the positioning was never corrected.",
      },
      {
        type: "p",
        text: "Resolution sells the screenshot. Accuracy is what the design team is actually buying.",
      },
      { type: "h2", text: "Relative and absolute accuracy diverge" },
      {
        type: "p",
        text: "Relative accuracy is internal consistency: if two points in the model are twelve metres apart, are they twelve metres apart on the ground? Absolute accuracy asks whether those points sit at the right coordinates in your chosen reference system. A model can be excellent at the first and useless at the second.",
      },
      {
        type: "p",
        text: "For volumetric work, relative accuracy is often enough, because you are measuring a difference. For anything tying into an existing survey control network, absolute accuracy is the requirement, and it needs ground control or a verified RTK correction to achieve.",
      },
      { type: "h2", text: "Ask for the checkpoint residuals" },
      {
        type: "p",
        text: "This is the single question that separates operators. An independent checkpoint is a surveyed point deliberately excluded from the photogrammetric solution. After processing you compare where the model says it is against where it actually is. The difference is the residual, and the spread of residuals across a set of checkpoints is your accuracy statement.",
      },
      {
        type: "quote",
        text: "If nobody can tell you which points were withheld from the adjustment, the accuracy figure you were quoted is an estimate dressed as a measurement.",
      },
      { type: "h2", text: "A procurement checklist" },
      {
        type: "list",
        items: [
          "What is the ground sample distance, and separately, what is the expected horizontal and vertical accuracy?",
          "How many independent checkpoints will be withheld, and will I see the residuals?",
          "What is the correction source — RTK base, network RTK, PPK, or ground control alone?",
          "Which coordinate reference system and vertical datum will the outputs use?",
          "If vegetation is present, how is ground level being recovered, and what are the limits of that?",
        ],
      },
      {
        type: "p",
        text: "Any operator who treats those five questions as reasonable is one you can work with. Any operator who treats them as an obstacle has told you something useful for free.",
      },
    ],
  },
  {
    slug: "thermal-imaging-is-not-a-colour-palette",
    title: "Thermal imaging is not a colour palette",
    excerpt:
      "A radiometric survey and a pretty orange picture look identical on screen. Only one of them is evidence.",
    category: "Technical",
    date: "2026-01-19",
    readingMinutes: 5,
    author: "Nuwan Perera",
    hue: 208,
    body: [
      {
        type: "p",
        text: "Thermal deliverables have a credibility problem, and the industry earned it. A non-radiometric thermal camera produces an image where colour represents relative temperature within that frame, with the scale re-normalised shot to shot. It looks exactly like real data. It cannot be measured, compared between frames, or defended.",
      },
      { type: "h2", text: "Radiometric means every pixel carries a value" },
      {
        type: "p",
        text: "A radiometric sensor stores an absolute temperature reading per pixel. You can open the file months later, click any point and read a number. You can compare this year's survey against last year's. You can state a temperature delta across a solar array and have it mean something.",
      },
      {
        type: "p",
        text: "That is the difference between an image and a measurement, and it costs several times as much in sensor hardware, which is precisely why the distinction gets quietly skipped in proposals.",
      },
      { type: "h2", text: "Emissivity is where the errors live" },
      {
        type: "p",
        text: "A thermal sensor measures radiation, not temperature, and converts one to the other using an emissivity assumption. Weathered concrete, painted steel, polished aluminium and glass all radiate very differently at the same physical temperature. Get emissivity wrong on bare metal and you can be tens of degrees out with total confidence.",
      },
      {
        type: "list",
        items: [
          "Record ambient temperature, humidity and wind at capture time, because all three affect the result",
          "State the emissivity value used for each material class in the report",
          "Include a reference target of known emissivity in the scene where practical",
          "Avoid surfaces under direct solar load, or wait for the thermal mass to settle after sunset",
        ],
      },
      { type: "h2", text: "Fly before dawn" },
      {
        type: "p",
        text: "For envelope and array work the useful window is the hours before sunrise. Solar gain has dissipated, the differential is at its widest, and you are reading actual performance rather than the sun's fingerprints on a surface. In this climate that matters more than most places, because by nine in the morning everything outdoors is simply hot.",
      },
      {
        type: "quote",
        text: "If a thermal report does not state the capture time, the ambient conditions and the emissivity assumptions, it is an illustration.",
      },
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
export const postSlugs = posts.map((p) => p.slug);
export const sortedPosts = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
