export type LegalSection = { heading: string; paragraphs?: string[]; bullets?: string[] };

export const lastUpdated = "2026-08-01";

/**
 * Starting-point policies written to match how the studio actually operates.
 * Have them reviewed by a Sri Lankan lawyer before launch — particularly the
 * data-retention, licensing and liability clauses.
 */
export const privacySections: LegalSection[] = [
  {
    heading: "What this covers",
    paragraphs: [
      "This policy explains what Sky Lens Aerial (Pvt) Ltd collects when you use this website or engage us for aerial work, why we collect it, and what we do with it. It applies to the website, our enquiry forms and the imagery we capture during flight operations.",
    ],
  },
  {
    heading: "Information you give us",
    paragraphs: [
      "When you submit an enquiry we collect the name, email address, phone number, company, location and project description you provide. We use these solely to respond to the enquiry, prepare a quote and, if you engage us, deliver the work.",
      "We do not add enquiry contacts to a marketing list, and we do not sell or share your details with third parties for their own purposes.",
    ],
  },
  {
    heading: "Information captured during flights",
    bullets: [
      "Photographs, video and sensor data captured over the agreed subject location",
      "Positional and telemetry data logged by the aircraft for safety and regulatory records",
      "Flight logs, retained as required under Civil Aviation Authority of Sri Lanka record-keeping obligations",
    ],
    paragraphs: [
      "Cameras remain directed at the commissioned subject. Where neighbouring property or uninvolved people appear incidentally in a frame, that material is removed during processing unless it is integral to the deliverable and lawful to retain.",
    ],
  },
  {
    heading: "Website analytics and cookies",
    paragraphs: [
      "This site does not use advertising cookies or cross-site tracking. If privacy-respecting analytics are enabled, they record aggregate page views without profiling individual visitors, and analytics data is never combined with enquiry submissions.",
    ],
  },
  {
    heading: "How long we keep things",
    bullets: [
      "Enquiries that do not become projects: deleted after 12 months",
      "Project correspondence and contracts: retained 7 years for tax and liability purposes",
      "Captured imagery: archived for the term agreed in your contract, then deleted on request",
      "Flight logs and maintenance records: retained as long as aviation regulations require",
    ],
  },
  {
    heading: "Security",
    paragraphs: [
      "Captured material is handled on encrypted storage from capture through delivery. Access is limited to the crew working on your engagement. Deliverables are transferred over encrypted links or on encrypted physical media.",
    ],
  },
  {
    heading: "Your rights",
    paragraphs: [
      "You can ask us what personal information we hold about you, request a copy, ask us to correct it, or ask us to delete it where we are not legally required to keep it. Write to fly@skylens.lk and we will respond within 30 days.",
    ],
  },
  {
    heading: "Changes and contact",
    paragraphs: [
      "If this policy changes materially we will update the date at the top of this page. Questions about privacy, data handling or a specific shoot should go to fly@skylens.lk.",
    ],
  },
];

export const termsSections: LegalSection[] = [
  {
    heading: "Agreement",
    paragraphs: [
      "These terms govern engagements between Sky Lens Aerial (Pvt) Ltd and its clients. Where a signed contract or statement of work exists for a specific project, that document takes precedence over anything here that conflicts with it.",
    ],
  },
  {
    heading: "Quotes and scope",
    paragraphs: [
      "Quotes are fixed for 30 days from issue and are based on the scope described at enquiry. If the location, deliverables, coverage or deadline change after acceptance, we will re-quote before proceeding rather than adjust the invoice afterwards.",
      "Every quote includes the relevant CAASL flight approval and proof of insurance. Travel within 40 km of Colombo is included; beyond that, transport and accommodation are billed at cost.",
    ],
  },
  {
    heading: "Booking, deposits and cancellation",
    bullets: [
      "A 30% deposit confirms a date for production days and programme engagements",
      "Client cancellation more than 7 days out: deposit refunded in full",
      "Client cancellation within 7 days: deposit retained against crew and scheduling costs",
      "Cancellation by Sky Lens for weather or safety: rebooked at no charge, deposit carried over",
    ],
  },
  {
    heading: "Weather and operational limits",
    paragraphs: [
      "The decision to fly rests with the pilot in command. We will not fly outside safe operating limits, in unsafe conditions, or without the required approval, regardless of schedule pressure. A weather cancellation is rebooked at no charge and is never billed as an attended day.",
    ],
  },
  {
    heading: "Permissions and access",
    paragraphs: [
      "We obtain CAASL flight approval and any site-specific clearance required for the agreed location. Where a required permission is refused by the relevant authority, we will propose an alternative location or approach, and any deposit is refunded if no workable alternative exists.",
    ],
    bullets: [
      "Provide safe site access and notify us of hazards and restricted areas",
      "Confirm landowner permission where the subject property is not yours",
      "Nominate a point of contact who can approve decisions on the day",
      "Notify us of any event, works or restriction affecting the location",
    ],
  },
  {
    heading: "Deliverables, revisions and approval",
    paragraphs: [
      "Standard turnaround runs from 24 hours for stills up to 10 working days for full productions, from the date of capture. Revision rounds are as stated in your package; additional rounds are quoted separately.",
      "Survey and inspection deliverables are released only after internal validation. We will not shorten that step to meet a deadline; if the timeline is tight we will say so at the quote stage.",
    ],
  },
  {
    heading: "Licensing and ownership",
    paragraphs: [
      "On full payment you receive a perpetual, non-exclusive commercial licence to use the delivered material across the channels agreed in the quote. Copyright in the raw and finished material remains with Sky Lens unless a written assignment is purchased.",
      "Broadcast, resale and stock-licensing rights are available and quoted separately. We retain the right to display work in our portfolio and marketing; tell us at the outset if your project is confidential and we will exclude it.",
    ],
  },
  {
    heading: "Payment",
    paragraphs: [
      "Invoices are payable within 14 days of delivery unless your contract states otherwise, in Sri Lankan Rupees. Programme retainers are invoiced monthly in advance. Late payment may pause scheduled shoots on retained programmes.",
    ],
  },
  {
    heading: "Liability",
    paragraphs: [
      "We carry public liability insurance and provide proof of cover for each engagement. Our liability for any single engagement is limited to the fees paid for that engagement, except where liability cannot lawfully be limited. We are not liable for indirect or consequential loss, including lost profit or programme delay.",
      "Survey and inspection outputs are supplied with a stated accuracy and stated assumptions. They support professional judgement; they do not replace it, and they should be read alongside the accuracy statement issued with them.",
    ],
  },
  {
    heading: "Governing law",
    paragraphs: [
      "These terms are governed by the laws of Sri Lanka, and the courts of Colombo have jurisdiction. Disputes will first be raised directly and in good faith between the parties before any formal proceedings begin.",
    ],
  },
];
