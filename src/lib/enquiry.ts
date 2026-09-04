import type { QuotableService } from "@/content/service-cards";
import { formatLkr, type Estimate } from "@/lib/quote-estimate";

/** Same business number the services-page quote flow uses — see whatsapp.ts. */
const WHATSAPP_NUMBER = "94712974243";

/** Where the enquiry goes when a visitor has no WhatsApp. */
const ENQUIRY_EMAIL = "arithcola@gmail.com";

export type EnquiryDetails = {
  name: string;
  district: string;
  town: string;
  siteLocation: string;
  date: string;
  hours: string;
  message: string;
  /** The visitor's own address, collected only on the email fallback path. */
  replyEmail?: string;
};

/**
 * The enquiry as plain text, shared by both delivery channels below. WhatsApp
 * gets it verbatim (with `*bold*` markers, which WhatsApp renders); the email
 * body strips those, since a plain-text mail client would otherwise show the
 * literal asterisks.
 */
function buildLines(
  categories: QuotableService[],
  details: EnquiryDetails,
  estimate: Estimate | null,
  forEmail: boolean,
): string[] {
  const b = (s: string) => (forEmail ? s : `*${s}*`);

  const lines = [
    "New project enquiry — Sky Lens",
    "",
    `${b("Categories:")}`,
    ...categories.map((c) => `• ${c.title}`),
    "",
    `${b("Name:")} ${details.name}`,
    `${b("District:")} ${details.district}`,
    `${b("Town:")} ${details.town}`,
    `${b("Site location:")} ${details.siteLocation}`,
  ];

  if (details.date) lines.push(`${b("Date:")} ${formatDateForMessage(details.date)}`);
  lines.push(`${b("Hours needed:")} ${details.hours}`);
  if (details.message.trim()) lines.push(`${b("Message:")} ${details.message.trim()}`);

  if (estimate) {
    lines.push(
      "",
      `${b("Estimated price:")} ${formatLkr(estimate.low)} – ${formatLkr(estimate.high)}`,
      "(Estimate only — the final price may be higher or lower.)",
    );
  }

  if (forEmail && details.replyEmail) {
    lines.push("", `Visitor's email (reply to this address): ${details.replyEmail}`);
  }

  lines.push("", "Please contact me to confirm. Thank you!");
  return lines;
}

function formatDateForMessage(iso: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-LK", { day: "numeric", month: "long", year: "numeric" });
}

/** Opens WhatsApp with the enquiry pre-filled — the primary send path. */
export function buildEnquiryWhatsAppUrl(
  categories: QuotableService[],
  details: EnquiryDetails,
  estimate: Estimate | null,
): string {
  const text = buildLines(categories, details, estimate, false).join("\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * The fallback for a visitor with no WhatsApp: opens their own mail client
 * addressed to the studio inbox, with the enquiry as the body and their
 * address included so the studio knows where to reply.
 *
 * This needs a mail client configured on the visitor's device to actually
 * work — there is no server-side send behind it. A guaranteed delivery,
 * independent of the visitor's own setup, needs an email API (Resend,
 * Postmark, …) wired into a server action, which needs credentials this site
 * does not have yet. `mailto:` is the honest, fully-working option without
 * them.
 */
export function buildEnquiryMailtoUrl(
  categories: QuotableService[],
  details: EnquiryDetails,
  estimate: Estimate | null,
): string {
  const subject = `Project enquiry — ${details.name || "New enquiry"}`;
  const body = buildLines(categories, details, estimate, true).join("\n");
  return `mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
