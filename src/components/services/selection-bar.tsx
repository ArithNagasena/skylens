"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, Trash2, X } from "lucide-react";
import { useServiceSelection } from "@/components/services/selection-context";
import { buildQuoteWhatsAppUrl, type QuoteDetails } from "@/lib/whatsapp";
import { sriLankanDistricts } from "@/content/districts";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-xl bg-void px-4 py-3 text-body text-ink placeholder:text-ink-dim shadow-[inset_0_0_0_1px_rgba(17,23,34,0.14)] transition-all duration-300 outline-none hover:shadow-[inset_0_0_0_1px_rgba(17,23,34,0.22)] focus:shadow-[inset_0_0_0_2px_rgba(13,77,138,0.65)]";

const emptyDetails: QuoteDetails = { name: "", district: "", venue: "", hours: "", date: "" };

/**
 * The sticky bar that appears once at least one service is picked, plus the
 * form it opens.
 *
 * Two steps by design, not one big form on the page: picking is a light,
 * exploratory action (click around, change your mind), while name/venue/date
 * is committing information the visitor should only be asked for once they
 * have actually decided what they want quoted.
 */
export function SelectionBar() {
  const selection = useServiceSelection();
  const [open, setOpen] = useState(false);

  const count = selection?.selected.length ?? 0;

  // `padding-bottom` on the body, not `scroll-padding-bottom` — the latter
  // only nudges scroll-anchor targets, it does not reserve real layout space.
  // Real padding is what keeps the fixed bar from overlapping the last row of
  // cards, and pushes the footer down to match rather than covering the top
  // of it.
  useEffect(() => {
    document.body.style.paddingBottom = count > 0 ? "88px" : "";
    return () => {
      document.body.style.paddingBottom = "";
    };
  }, [count]);

  if (!selection) return null;

  return (
    <>
      {/* Its own AnimatePresence, kept mounted regardless of `count`, so the
          bar plays an exit transition instead of vanishing the instant the
          selection empties out. */}
      <AnimatePresence>
        {count > 0 && (
          <motion.div
            key="selection-bar"
            aria-live="polite"
            initial={{ y: 32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 32, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4 md:px-6 md:pb-6"
          >
            <div className="glass elev-4 flex w-full max-w-2xl flex-wrap items-center justify-between gap-3 rounded-2xl px-5 py-3.5 ring-1 ring-inset ring-ink/[0.08]">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-signal text-raised">
                  <span className="font-display text-meta font-semibold">{count}</span>
                </span>
                <span className="truncate text-meta text-ink-muted">
                  {count === 1 ? "service" : "services"} selected
                  <span className="hidden sm:inline">
                    {" — "}
                    {selection.selected.map((s) => s.title).join(", ")}
                  </span>
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={selection.clear}
                  aria-label="Clear selection"
                  className="grid size-9 place-items-center rounded-full text-ink-dim transition-colors hover:bg-ink/[0.08] hover:text-ink"
                >
                  <Trash2 className="size-4" strokeWidth={1.9} />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-5 text-meta font-medium text-white shadow-[0_8px_20px_-8px_rgba(26,111,196,0.55)] transition-[filter] hover:brightness-110"
                >
                  <MessageCircle className="size-4" strokeWidth={2} />
                  Send via WhatsApp
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* A separate AnimatePresence for the modal, for the same reason. */}
      <AnimatePresence>{open && <QuoteRequestModal onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}

function QuoteRequestModal({ onClose }: { onClose: () => void }) {
  const selection = useServiceSelection();
  const [details, setDetails] = useState<QuoteDetails>(emptyDetails);
  const headingId = useId();

  // Every item can be removed from within this form (below); if that empties
  // the selection out entirely, close rather than leave an empty form up.
  useEffect(() => {
    if (selection && selection.selected.length === 0) onClose();
  }, [selection, onClose]);

  if (!selection || selection.selected.length === 0) return null;

  const set = (field: keyof QuoteDetails) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setDetails((d) => ({ ...d, [field]: e.target.value }));

  const valid =
    details.name.trim().length > 0 &&
    details.district.length > 0 &&
    details.venue.trim().length > 0 &&
    details.hours.trim().length > 0 &&
    details.date.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    // A synchronous window.open inside the click/submit handler is what keeps
    // this from being treated as a popup by the browser — nothing async runs
    // before it.
    window.open(buildQuoteWhatsAppUrl(selection.selected, details), "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-deep/70 backdrop-blur-sm"
      />

      <motion.div
        initial={{ y: 24, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 24, opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="card elev-4 relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-ink/[0.09] px-6 py-5">
          <div className="flex flex-col gap-1">
            <h2 id={headingId} className="font-display text-title tracking-tight text-ink">
              A few details
            </h2>
            <p className="text-meta text-ink-dim">
              {selection.selected.length === 1 ? "1 service" : `${selection.selected.length} services`}{" "}
              selected — this opens WhatsApp with everything filled in.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-9 shrink-0 place-items-center rounded-full text-ink-dim transition-colors hover:bg-ink/[0.08] hover:text-ink"
          >
            <X className="size-4" strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 overflow-y-auto px-6 py-6">
          {/* Selected services, editable from here too — removing the last one
              closes the modal (see the effect above). */}
          <ul className="flex flex-col gap-1.5">
            {selection.selected.map((s) => (
              <li
                key={s.slug}
                className="flex items-center justify-between gap-3 rounded-xl bg-obsidian px-3.5 py-2.5"
              >
                <span className="truncate text-meta text-ink">{s.title}</span>
                <span className="flex shrink-0 items-center gap-2">
                  <span className="font-mono text-micro text-ink-dim">{s.startingAt}</span>
                  <button
                    type="button"
                    onClick={() => selection.toggle(s)}
                    aria-label={`Remove ${s.title}`}
                    className="grid size-6 place-items-center rounded-full text-ink-dim transition-colors hover:bg-ink/[0.1] hover:text-ink"
                  >
                    <X className="size-3.5" strokeWidth={2} />
                  </button>
                </span>
              </li>
            ))}
          </ul>

          <Field label="Your name" htmlFor="q-name">
            <input
              id="q-name"
              type="text"
              required
              autoComplete="name"
              placeholder="Nimal Perera"
              value={details.name}
              onChange={set("name")}
              className={fieldBase}
            />
          </Field>

          <Field label="District" htmlFor="q-district">
            <select
              id="q-district"
              required
              value={details.district}
              onChange={set("district")}
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

          <Field label="Venue / location" htmlFor="q-venue">
            <input
              id="q-venue"
              type="text"
              required
              placeholder="Cinnamon Grand, Colombo"
              value={details.venue}
              onChange={set("venue")}
              className={fieldBase}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Date" htmlFor="q-date">
              <input
                id="q-date"
                type="date"
                required
                min={new Date().toISOString().slice(0, 10)}
                value={details.date}
                onChange={set("date")}
                className={fieldBase}
              />
            </Field>
            <Field label="Duration (hours)" htmlFor="q-hours">
              <input
                id="q-hours"
                type="number"
                required
                min={1}
                max={24}
                inputMode="numeric"
                placeholder="4"
                value={details.hours}
                onChange={set("hours")}
                className={fieldBase}
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={!valid}
            className="mt-1 inline-flex h-14 items-center justify-center gap-2 rounded-full bg-brand text-body font-medium text-white shadow-[0_8px_20px_-8px_rgba(26,111,196,0.55)] transition-[filter,opacity] hover:brightness-110 disabled:pointer-events-none disabled:opacity-50"
          >
            <MessageCircle className="size-4" strokeWidth={2} />
            Send to WhatsApp
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-micro font-medium text-ink-muted">
        {label}
      </label>
      {children}
    </div>
  );
}
