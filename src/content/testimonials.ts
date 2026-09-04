export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
  project?: string;
  hue: number;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Eleven villas along the whole south coast, shot in six days, and for the first time the portfolio actually looks like one brand. Guests can finally see how close each place is to the water, which is the only question anyone ever asked us.",
    name: "Ishara Gunasekera",
    role: "Marketing Director",
    company: "Serendib Villas",
    initials: "IG",
    project: "serendib-south-coast",
    hue: 196,
  },
  {
    quote:
      "They went back to Ella in a second season because the first trip did not give them the light they wanted. Nobody asked them to do that. The film is still the best thing we have ever published.",
    name: "Roshan de Silva",
    role: "General Manager",
    company: "Ceylon Harbour Resorts",
    initials: "RD",
    project: "ella-ridge-resort",
    hue: 148,
  },
  {
    quote:
      "The heritage permissions for Galle Fort were sorted six weeks out without us lifting a finger, and during the ceremony you genuinely could not hear the drone. The clip was on the couple's phones before the reception ended.",
    name: "Tharushi Bandara",
    role: "Founder",
    company: "Palm & Tide Weddings",
    initials: "TB",
    project: "palm-tide-galle-wedding",
    hue: 32,
  },
  {
    quote:
      "The accuracy statement is what sold our design team. Plenty of operators will hand you a nice-looking orthomosaic. Very few will hand you the checkpoint residuals next to it and let you check their working.",
    name: "Thilak Rajapaksha",
    role: "Principal Engineer",
    company: "Meridian Civil",
    initials: "TR",
    project: "southern-expressway-survey",
    hue: 232,
  },
  {
    quote:
      "Twenty-two months of monthly capture settled a forty-one million rupee earthworks argument in a single afternoon. The programme paid for itself several times over in that one meeting.",
    name: "Sanduni Alwis",
    role: "Development Director",
    company: "Northgate Developments",
    initials: "SA",
    project: "northgate-rajagiriya",
    hue: 42,
  },
  {
    quote:
      "They found the drainage fault three weeks before we would have seen anything walking the field. On a division that size, three weeks is the difference between a correction and a lost round.",
    name: "Mahesh Kumarasinghe",
    role: "Estate Manager",
    company: "Atlas Plantations",
    initials: "MK",
    project: "atlas-tea-estate",
    hue: 168,
  },
];
