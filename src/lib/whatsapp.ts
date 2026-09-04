import type { QuotableService } from "@/content/service-cards";

/**
 * The business WhatsApp number, in the international format `wa.me` requires:
 * country code, no leading zero, no punctuation. Sri Lankan mobile numbers
 * drop the leading 0 and take the +94 country code, so 0712974243 becomes
 * 94712974243.
 */
const WHATSAPP_NUMBER = "94712974243";

export type QuoteDetails = {
  name: string;
  district: string;
  venue: string;
  hours: string;
  date: string;
};

/**
 * Builds the pre-filled WhatsApp message and returns the `wa.me` link to open
 * it. Everything the studio needs to quote arrives in one message: which
 * package(s), and the who/where/when — nothing here requires the client to
 * type freeform detail the studio would otherwise have to ask for on the call.
 */
export function buildQuoteWhatsAppUrl(services: QuotableService[], details: QuoteDetails): string {
  const lines = [
    "Hello Sky Lens! I'd like to request a quote for the following:",
    "",
    ...services.map((s) => `• ${s.title} — ${s.startingAt}`),
    "",
    `*Name:* ${details.name}`,
    `*District:* ${details.district}`,
    `*Venue / Location:* ${details.venue}`,
    `*Date:* ${formatDateForMessage(details.date)}`,
    `*Duration:* ${details.hours} hour${details.hours === "1" ? "" : "s"}`,
    "",
    "Please send me a final quote. Thank you!",
  ];

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

function formatDateForMessage(iso: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-LK", { day: "numeric", month: "long", year: "numeric" });
}
