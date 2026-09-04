"use client";

import { useRef } from "react";
import Image from "next/image";
import { Printer } from "lucide-react";
import { brand } from "@/content/brand";
import { site, contact } from "@/content/site";
import type { QuotableService } from "@/content/service-cards";
import { formatLkr, type Estimate } from "@/lib/quote-estimate";
import type { EnquiryDetails } from "@/lib/enquiry";

/**
 * The formatted quotation: company letterhead, the client's own details, one
 * line per selected category with its estimated range, a total, and the
 * disclaimer in red the client asked for verbatim.
 *
 * Print strategy — isolated window approach:
 *   Rather than hiding the rest of the page with CSS (which leaves every
 *   element occupying layout space and generating blank pages), we copy the
 *   quotation's outerHTML into a new window that carries only the site's own
 *   stylesheets, call print() on it, then close it. The result is always
 *   exactly one A4 page.
 */
export function QuotationDocument({
  categories,
  details,
  estimate,
  quoteNumber,
}: {
  categories: QuotableService[];
  details: EnquiryDetails;
  estimate: Estimate;
  quoteNumber: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  const today = new Date().toLocaleDateString("en-LK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  function handlePrint() {
    const el = rootRef.current;
    if (!el) { window.print(); return; }

    // Collect every <link rel="stylesheet"> from the current page so Tailwind
    // utilities and custom fonts are available in the print window.
    const styleLinks = Array.from(
      document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'),
    )
      .map((l) => l.outerHTML)
      .join("\n");

    // Fix relative image src paths so they resolve correctly from the new window.
    const origin = window.location.origin;
    const html = el.outerHTML
      .replace(/src="\/([^"]+)"/g, `src="${origin}/$1"`)
      // Remove the print button from the cloned HTML
      .replace(/<div[^>]*data-print-hide[^>]*>[\s\S]*?<\/div>/, "");

    const printWin = window.open("", "_blank", "width=900,height=1200");
    if (!printWin) { window.print(); return; }

    printWin.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Sky Lens — Quotation ${quoteNumber}</title>
  ${styleLinks}
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 14mm;
    }
    html, body {
      margin: 0;
      padding: 0;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    /* Strip card shadow and borders for print */
    [data-print-root] {
      box-shadow: none !important;
      border: none !important;
      border-radius: 0 !important;
      background: #fff !important;
      font-size: 10.5pt !important;
      color: #111 !important;
    }
    /* Tighten spacing */
    [data-print-root] .p-5,
    [data-print-root] .md\\:p-7 {
      padding: 0 !important;
    }
    /* Keep rows together */
    tr, p, li { page-break-inside: avoid; break-inside: avoid; }
  </style>
</head>
<body>
  ${html}
  <script>
    // Auto-print once fonts and images have loaded.
    window.addEventListener('load', function () {
      setTimeout(function () {
        window.focus();
        window.print();
        window.close();
      }, 600);
    });
  </script>
</body>
</html>`);

    printWin.document.close();
  }

  return (
    <div
      ref={rootRef}
      data-print-root
      className="card overflow-hidden rounded-2xl bg-raised"
    >
      <div className="p-5 md:p-7">

        {/* ── Letterhead ─────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink/[0.12] pb-4">
          <Image
            src={brand.lockup.src}
            alt={site.name}
            width={brand.lockup.width}
            height={brand.lockup.height}
            className="h-12 w-auto"
          />
          <div className="text-right">
            <p className="font-display text-title tracking-tight text-ink">
              Quotation estimate
            </p>
            <p className="font-mono text-micro uppercase tracking-[0.14em] text-ink-dim">
              Ref {quoteNumber} · {today}
            </p>
          </div>
        </div>

        {/* ── Parties ────────────────────────────────────────────────── */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="min-w-0">
            <p className="font-mono text-micro uppercase tracking-[0.16em] text-ink-dim">
              Prepared by
            </p>
            <p className="mt-0.5 truncate text-meta text-ink">{site.legalName}</p>
            <p className="truncate text-meta text-ink-dim">{contact.email}</p>
            <p className="text-meta text-ink-dim">{contact.phone}</p>
          </div>
          <div className="min-w-0">
            <p className="font-mono text-micro uppercase tracking-[0.16em] text-ink-dim">
              Prepared for
            </p>
            <p className="mt-0.5 truncate text-meta font-medium text-ink">
              {details.name}
            </p>
            <p className="truncate text-meta text-ink-dim">
              {[details.town, details.district].filter(Boolean).join(", ")}
            </p>
            {details.siteLocation && (
              <p className="truncate text-meta text-ink-dim">
                {details.siteLocation}
              </p>
            )}
          </div>
        </div>

        {/* ── Job summary cells ──────────────────────────────────────── */}
        <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-ink/[0.09] sm:grid-cols-4">
          <SummaryCell
            label="Date requested"
            value={details.date ? formatDate(details.date) : "Flexible"}
          />
          <SummaryCell
            label="Duration"
            value={`${details.hours} hr${details.hours === "1" ? "" : "s"}`}
          />
          <SummaryCell label="Categories" value={String(categories.length)} />
          <SummaryCell label="Valid for" value="14 days" />
        </div>

        {/* ── Line items ─────────────────────────────────────────────── */}
        <table className="mt-4 w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-ink/[0.12]">
              <th className="pb-2 font-mono text-micro font-medium uppercase tracking-[0.14em] text-ink-dim">
                Category
              </th>
              <th className="pb-2 text-right font-mono text-micro font-medium uppercase tracking-[0.14em] text-ink-dim">
                Estimated
              </th>
            </tr>
          </thead>
          <tbody>
            {estimate.lines.map((line) => (
              <tr key={line.title} className="border-b border-ink/[0.07]">
                <td className="py-2 text-meta text-ink">{line.title}</td>
                <td className="py-2 text-right font-mono text-meta text-ink">
                  {formatLkr(line.low)} – {formatLkr(line.high)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="pt-3 font-display text-title tracking-tight text-ink">
                Estimated total
              </td>
              <td className="pt-3 text-right font-display text-title font-semibold tracking-tight text-signal">
                {formatLkr(estimate.low)} – {formatLkr(estimate.high)}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* ── Client notes (optional) ─────────────────────────────────── */}
        {details.message.trim() && (
          <div className="mt-4 rounded-xl bg-obsidian px-4 py-3">
            <p className="font-mono text-micro uppercase tracking-[0.14em] text-ink-dim">
              Additional notes
            </p>
            <p className="mt-1 line-clamp-4 text-meta text-ink-muted">
              {details.message}
            </p>
          </div>
        )}

        {/* ── Disclaimer ─────────────────────────────────────────────── */}
        <p className="mt-4 text-meta font-medium leading-snug text-red-600">
          This is an estimated price. The final price may be higher or lower
          depending on the exact requirements of the job.
        </p>

        {/* ── Print button — excluded from the printed copy ───────────── */}
        <div
          data-print-hide
          className="mt-5 flex justify-end border-t border-ink/[0.1] pt-5"
        >
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-full bg-ink/[0.06] px-5 py-2.5 text-meta font-medium text-ink transition-colors hover:bg-ink/[0.12]"
          >
            <Printer className="size-4" strokeWidth={2} />
            Print / Save as PDF
          </button>
        </div>

      </div>
    </div>
  );
}

function SummaryCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 bg-void px-3 py-2.5">
      <span className="font-mono text-micro uppercase tracking-[0.12em] text-ink-dim">
        {label}
      </span>
      <span className="text-meta font-medium text-ink">{value}</span>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-LK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
