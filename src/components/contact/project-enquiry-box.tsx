"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Check, FileText, Send } from "lucide-react";
import { ServiceIcon } from "@/components/ui/icon";
import { serviceCards, toQuotable, type QuotableService } from "@/content/service-cards";
import { sriLankanDistricts, sriLankaDistrictTowns } from "@/content/districts";
import { buildEstimate } from "@/lib/quote-estimate";
import { buildEnquiryMailtoUrl, buildEnquiryWhatsAppUrl, type EnquiryDetails } from "@/lib/enquiry";
import { cn } from "@/lib/utils";
import { QuotationDocument } from "@/components/contact/quotation-document";

const fieldBase =
  "w-full rounded-xl bg-void px-4 py-3 text-body text-ink placeholder:text-ink-dim shadow-[inset_0_0_0_1px_rgba(17,23,34,0.14)] transition-all duration-300 outline-none hover:shadow-[inset_0_0_0_1px_rgba(17,23,34,0.22)] focus:shadow-[inset_0_0_0_2px_rgba(13,77,138,0.65)]";

const OTHER_TOWN = "__other__";
const OTHER_SITE = "__other__";

const SITE_TYPES = [
  "Hotel / Resort",
  "Villa / Boutique property",
  "Private home / Residence",
  "Wedding venue",
  "Religious site (Temple / Church / Mosque / Kovil)",
  "Beach / Waterfront",
  "Sports ground / Stadium",
  "Agricultural land / Estate / Plantation",
  "Construction / Development site",
  "Government / Municipal site",
  "School / University",
  "National park / Nature reserve",
  "Lake / Reservoir",
  "Mountain / Hilltop",
  "Cultural / Historical site",
  "Industrial facility",
  "Event ground / Open ground",
  "Harbour / Marina",
  "Other",
] as const;

const emptyDetails: EnquiryDetails = {
  name: "",
  district: "",
  town: "",
  siteLocation: "",
  date: "",
  hours: "",
  message: "",
};

/**
 * The whole "Request a Quote" experience: pick categories, fill in the job,
 * generate a printable estimate, then send it. One client component rather
 * than a context spread across several — unlike the services-page selector,
 * nothing here needs to reach across a server/client boundary, so a single
 * `useState` tree is simpler and there is nothing to gain from splitting it.
 */
export function ProjectEnquiryBox({
  defaultCategory,
  services = serviceCards.map(toQuotable),
}: {
  defaultCategory?: string;
  /**
   * The categories a visitor can pick from, and the starting prices the
   * estimate is built out of. Resolved by the page so a price changed in the
   * admin panel reaches this form; the default keeps the component usable on
   * its own, and on a build with no database behind it.
   */
  services?: QuotableService[];
}) {
  // Every service's own page links here as /contact?service=<slug> expecting
  // that category to already be picked on arrival, so the visitor isn't
  // asked to re-select the thing they just clicked "Request a quote" from.
  const [categories, setCategories] = useState<Set<string>>(
    () => new Set(defaultCategory ? [defaultCategory] : []),
  );
  const [details, setDetails] = useState<EnquiryDetails>(emptyDetails);
  const [townChoice, setTownChoice] = useState("");
  const [townOther, setTownOther] = useState("");
  const [siteLocationType, setSiteLocationType] = useState("");
  const [siteLocationOther, setSiteLocationOther] = useState("");
  const [noWhatsapp, setNoWhatsapp] = useState(false);
  const [replyEmail, setReplyEmail] = useState("");
  const [quotationVisible, setQuotationVisible] = useState(false);
  const [quoteNumber, setQuoteNumber] = useState("");

  const toggleCategory = (slug: string) => {
    setCategories((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
    // Selection changing invalidates any quotation already on screen — it
    // would otherwise show categories the client no longer has selected.
    setQuotationVisible(false);
  };

  const selectedServices = useMemo(
    () => services.filter((s) => categories.has(s.slug)),
    [services, categories],
  );

  const town = townChoice === OTHER_TOWN ? townOther.trim() : townChoice;
  const siteLocation =
    siteLocationType === OTHER_SITE
      ? siteLocationOther.trim()
      : siteLocationType === ""
      ? ""
      : siteLocationOther.trim()
      ? `${siteLocationType} — ${siteLocationOther.trim()}`
      : siteLocationType;
  const finalDetails: EnquiryDetails = { ...details, town, siteLocation, replyEmail: noWhatsapp ? replyEmail : undefined };

  const requiredFilled =
    finalDetails.name.trim().length > 0 &&
    finalDetails.district.length > 0 &&
    town.length > 0 &&
    siteLocation.length > 0 &&
    finalDetails.hours.trim().length > 0 &&
    selectedServices.length > 0;

  const canSend = requiredFilled && (!noWhatsapp || replyEmail.trim().length > 0);

  const estimate = useMemo(() => buildEstimate(selectedServices), [selectedServices]);

  const handleGenerate = () => {
    if (!requiredFilled) return;
    setQuoteNumber(makeQuoteNumber());
    setQuotationVisible(true);
  };

  const handleSend = () => {
    if (!canSend) return;
    const url = noWhatsapp
      ? buildEnquiryMailtoUrl(selectedServices, finalDetails, quotationVisible ? estimate : null)
      : buildEnquiryWhatsAppUrl(selectedServices, finalDetails, quotationVisible ? estimate : null);

    if (noWhatsapp) {
      // mailto: navigates the current tab to open the mail client — window.open
      // often just opens a second blank tab for mailto: links instead.
      window.location.href = url;
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div id="enquiry" className="card scroll-mt-24 rounded-3xl p-6 md:p-9">
      <h2 className="text-2xl tracking-tight md:text-[1.75rem]">Project enquiry</h2>
      <p className="mt-2 max-w-xl text-body leading-relaxed text-ink-muted">
        Select what you need, tell us the job, and get an instant estimate.
      </p>

      {/* ------------------------------------------------------- categories */}
      <div className="mt-8">
        <p className="text-meta font-medium text-ink">
          What do you need?<span className="text-signal"> *</span>
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {services.map((s) => (
            <CategoryTile
              key={s.slug}
              service={s}
              active={categories.has(s.slug)}
              onToggle={() => toggleCategory(s.slug)}
            />
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------- form */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Field label="Your name" required>
          <input
            type="text"
            required
            autoComplete="name"
            placeholder="Nimal Perera"
            value={details.name}
            onChange={(e) => setDetails((d) => ({ ...d, name: e.target.value }))}
            className={fieldBase}
          />
        </Field>

        <Field label="District" required>
          <select
            required
            value={details.district}
            onChange={(e) => {
              setDetails((d) => ({ ...d, district: e.target.value }));
              setTownChoice(""); // reset town when district changes
            }}
            className={cn(fieldBase, !details.district && "text-ink-dim")}
          >
            <option value="" disabled>
              Select a district
            </option>
            {sriLankanDistricts.map((d) => (
              <option key={d} value={d} className="text-ink">
                {d}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Town" required>
          <select
            required
            value={townChoice}
            disabled={!details.district}
            onChange={(e) => setTownChoice(e.target.value)}
            className={cn(fieldBase, !townChoice && "text-ink-dim", !details.district && "opacity-50 cursor-not-allowed")}
          >
            <option value="" disabled>
              {details.district ? "Select a town" : "Select a district first"}
            </option>
            {(sriLankaDistrictTowns[details.district] ?? []).map((t) => (
              <option key={t} value={t} className="text-ink">
                {t}
              </option>
            ))}
            <option value={OTHER_TOWN} className="text-ink">
              Other
            </option>
          </select>
        </Field>

        {townChoice === OTHER_TOWN && (
          <Field label="Town name" required>
            <input
              type="text"
              required
              placeholder="Enter your town"
              value={townOther}
              onChange={(e) => setTownOther(e.target.value)}
              className={fieldBase}
            />
          </Field>
        )}

        {/* Site location type */}
        <Field label="Site location type" required className={townChoice === OTHER_TOWN ? "sm:col-span-2" : undefined}>
          <select
            required
            value={siteLocationType}
            onChange={(e) => {
              setSiteLocationType(e.target.value);
              setSiteLocationOther("");
            }}
            className={cn(fieldBase, !siteLocationType && "text-ink-dim")}
          >
            <option value="" disabled>Select a location type</option>
            {SITE_TYPES.map((t) => (
              <option key={t} value={t === "Other" ? OTHER_SITE : t} className="text-ink">
                {t}
              </option>
            ))}
          </select>
        </Field>

        {/* Free-text detail — always shown so user can add address/landmark */}
        <Field
          label={siteLocationType === OTHER_SITE ? "Describe the location" : "Address / Landmark (optional)"}
          required={siteLocationType === OTHER_SITE}
          className="sm:col-span-2"
        >
          <input
            type="text"
            required={siteLocationType === OTHER_SITE}
            placeholder={
              siteLocationType === OTHER_SITE
                ? "Describe the site or paste an address"
                : "Hotel name, venue name, street address or nearest landmark"
            }
            value={siteLocationOther}
            onChange={(e) => setSiteLocationOther(e.target.value)}
            className={fieldBase}
          />
        </Field>

        <Field label="Date">
          <input
            type="date"
            min={new Date().toISOString().slice(0, 10)}
            value={details.date}
            onChange={(e) => setDetails((d) => ({ ...d, date: e.target.value }))}
            className={fieldBase}
          />
        </Field>

        <Field label="Hours needed" required>
          <input
            type="number"
            required
            min={1}
            max={24}
            inputMode="numeric"
            placeholder="4"
            value={details.hours}
            onChange={(e) => setDetails((d) => ({ ...d, hours: e.target.value }))}
            className={fieldBase}
          />
        </Field>

        <Field label="Message" className="sm:col-span-2" hint="Optional">
          <textarea
            rows={3}
            placeholder="Anything else that would help us quote accurately"
            value={details.message}
            onChange={(e) => setDetails((d) => ({ ...d, message: e.target.value }))}
            className={cn(fieldBase, "resize-none")}
          />
        </Field>
      </div>

      {/* -------------------------------------------------------- generate */}
      <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-ink/[0.1] pt-6">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!requiredFilled}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-ink/[0.06] px-6 text-meta font-medium text-ink transition-colors hover:bg-ink/[0.12] disabled:pointer-events-none disabled:opacity-50"
        >
          <FileText className="size-4" strokeWidth={2} />
          Generate the quotation
        </button>
        {!requiredFilled && (
          <span className="text-micro text-ink-dim">
            Fill in the required fields (*) and pick at least one category first.
          </span>
        )}
      </div>

      {quotationVisible && selectedServices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6"
        >
          <QuotationDocument
            categories={selectedServices}
            details={finalDetails}
            estimate={estimate}
            quoteNumber={quoteNumber}
          />
        </motion.div>
      )}

      {/* ------------------------------------------------------------ send */}
      <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-obsidian p-5">
        <label className="flex items-center gap-2.5 text-meta text-ink-muted">
          <input
            type="checkbox"
            checked={noWhatsapp}
            onChange={(e) => setNoWhatsapp(e.target.checked)}
            className="size-4 rounded border-ink/30 text-signal focus:ring-signal"
          />
          I don&apos;t have WhatsApp — email me instead
        </label>

        {noWhatsapp && (
          <Field label="Your email" required>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={replyEmail}
              onChange={(e) => setReplyEmail(e.target.value)}
              className={fieldBase}
            />
          </Field>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className={
              noWhatsapp
                ? "inline-flex h-14 items-center gap-2 rounded-full bg-[#1a6fc4] px-7 text-body font-medium text-white shadow-[0_8px_20px_-8px_rgba(26,111,196,0.55)] transition-all duration-300 hover:brightness-110 disabled:pointer-events-none disabled:opacity-50"
                : "inline-flex h-14 items-center gap-2 rounded-full bg-[#25D366] px-7 text-body font-medium text-white shadow-[0_8px_20px_-8px_rgba(37,211,102,0.5)] transition-all duration-300 hover:brightness-110 disabled:pointer-events-none disabled:opacity-50"
            }
          >
            {noWhatsapp ? (
              <Send className="size-4" strokeWidth={2} />
            ) : (
              /* WhatsApp logo SVG */
              <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            )}
            {noWhatsapp ? "Send email" : "Send via WhatsApp"}
          </button>
          <span className="flex items-center gap-1.5 text-micro text-ink-dim">
            <Check className="size-3.5 shrink-0 text-signal" strokeWidth={2.4} />
            {noWhatsapp ? "We\'ll reply to your email within 1 business day." : "Our agent will contact you within 1 hour."}
          </span>
        </div>
      </div>
    </div>
  );
}

function CategoryTile({
  service: s,
  active,
  onToggle,
}: {
  service: QuotableService;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={cn(
        "flex flex-col items-center gap-2 rounded-xl px-3 py-4 text-center transition-all duration-300",
        active
          ? "bg-signal-soft shadow-[0_0_0_2px_var(--color-signal)]"
          : "bg-void shadow-[inset_0_0_0_1px_rgba(17,23,34,0.1)] hover:shadow-[inset_0_0_0_1px_rgba(17,23,34,0.2)]",
      )}
    >
      <span
        className={cn(
          "grid size-10 place-items-center rounded-full transition-colors duration-300",
          active ? "bg-signal text-raised" : "bg-signal-soft text-signal",
        )}
      >
        {active ? <Check className="size-5" strokeWidth={2.6} /> : <ServiceIcon name={s.icon} className="size-5" />}
      </span>
      <span className="text-micro font-medium leading-tight text-ink">{s.title}</span>
    </button>
  );
}

function Field({
  label,
  required,
  hint,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-micro font-medium text-ink-muted">
        {label}
        {required && <span className="text-signal"> *</span>}
        {hint && <span className="text-ink-dim"> — {hint}</span>}
      </span>
      {children}
    </label>
  );
}

function makeQuoteNumber(): string {
  const now = new Date();
  const y = now.getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SL-${y}-${rand}`;
}
