"use client";

import Image from "next/image";
import { Printer } from "lucide-react";

import { brand } from "@/content/brand";
import { contact, site } from "@/content/site";
import { billBalance, computeTotals, formatLongDate, lineTotal } from "@/lib/admin/documents";
import type { BillWithItems, DocumentItem, QuotationWithItems } from "@/lib/supabase/types";
import { Button, formatMoney } from "@/components/admin/ui";

/**
 * The document as the client receives it: letterhead, both parties, the lines,
 * the total, the terms.
 *
 * Printing is a plain `window.print()` against print styles on this page,
 * rather than the copy-into-a-new-window trick the public quote estimate uses.
 * That trick exists because the estimate sits inside a long marketing page
 * whose other sections would otherwise generate blank sheets; here the
 * document is the page, so hiding the panel chrome with `print:hidden` is
 * enough — and it keeps a single rendering of the document, which is the thing
 * that matters when the printed copy is the one a client pays against.
 *
 * "Save as PDF" in the browser's print dialogue is how a copy gets emailed.
 * Generating one server-side would mean a PDF library and a second layout to
 * keep in step with this one, for a file the browser already produces.
 */
export function DocumentPrint({
  kind,
  doc,
}: {
  kind: "quotation" | "bill";
  doc: QuotationWithItems | BillWithItems;
}) {
  const isBill = kind === "bill";
  const bill = isBill ? (doc as BillWithItems) : null;
  const quote = !isBill ? (doc as QuotationWithItems) : null;

  const items: DocumentItem[] = [
    ...((isBill ? bill?.bill_items : quote?.quotation_items) ?? []),
  ].sort((a, b) => a.sort_order - b.sort_order);

  const totals = computeTotals(items, Number(doc.discount), Number(doc.tax_rate));
  const balance = billBalance(totals.total, Number(bill?.amount_paid ?? 0));

  const number = isBill ? bill!.bill_number : quote!.quote_number;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end print:hidden">
        <Button variant="secondary" onClick={() => window.print()}>
          <Printer className="size-4" strokeWidth={1.9} />
          Print or save as PDF
        </Button>
      </div>

      <article className="card rounded-2xl bg-raised p-6 md:p-9 print:rounded-none print:p-0 print:shadow-none">
        {/* ── Letterhead ──────────────────────────────────────────────── */}
        <header className="flex flex-wrap items-start justify-between gap-5 border-b border-ink/[0.14] pb-5">
          <div className="flex flex-col gap-2">
            <Image
              src={brand.lockup.src}
              alt={site.name}
              width={brand.lockup.width}
              height={brand.lockup.height}
              className="h-14 w-auto"
            />
            <address className="text-meta not-italic leading-relaxed text-ink-muted">
              {site.legalName}
              <br />
              {contact.address.street}, {contact.address.city}
              <br />
              {contact.address.region} {contact.address.postal}, Sri Lanka
              <br />
              {contact.phone} · {contact.email}
            </address>
          </div>

          <div className="text-right">
            <h1 className="font-display text-2xl tracking-tight text-ink">
              {isBill ? "Invoice" : "Quotation"}
            </h1>
            <p className="mt-1 font-mono text-meta uppercase tracking-[0.14em] text-signal">
              {number}
            </p>
            <dl className="mt-3 flex flex-col gap-1 text-meta text-ink-muted">
              <MetaRow label="Issued" value={formatLongDate(doc.issue_date)} />
              {isBill ? (
                <MetaRow label="Due" value={formatLongDate(bill!.due_date)} />
              ) : (
                <MetaRow label="Valid until" value={formatLongDate(quote!.valid_until)} />
              )}
              {isBill && bill!.quote_reference && (
                <MetaRow label="Quotation" value={bill!.quote_reference} />
              )}
            </dl>
          </div>
        </header>

        {/* ── Parties and job ─────────────────────────────────────────── */}
        <section className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="font-mono text-micro uppercase tracking-[0.18em] text-ink-dim">
              Billed to
            </h2>
            <p className="mt-2 font-display text-title tracking-tight text-ink">
              {doc.client_name}
            </p>
            <p className="mt-1 whitespace-pre-line text-meta leading-relaxed text-ink-muted">
              {[doc.client_company, doc.client_address, doc.client_phone, doc.client_email]
                .filter(Boolean)
                .join("\n")}
            </p>
          </div>

          {(doc.project_title || doc.location) && (
            <div>
              <h2 className="font-mono text-micro uppercase tracking-[0.18em] text-ink-dim">
                Project
              </h2>
              <p className="mt-2 font-display text-title tracking-tight text-ink">
                {doc.project_title || "—"}
              </p>
              {doc.location && <p className="mt-1 text-meta text-ink-muted">{doc.location}</p>}
            </div>
          )}
        </section>

        {/* ── Lines ───────────────────────────────────────────────────── */}
        <div className="mt-7 overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-meta">
            <thead>
              <tr className="border-b border-ink/[0.14] text-left">
                <th className="pb-2 font-mono text-micro font-normal uppercase tracking-[0.16em] text-ink-dim">
                  Description
                </th>
                <th className="pb-2 text-right font-mono text-micro font-normal uppercase tracking-[0.16em] text-ink-dim">
                  Qty
                </th>
                <th className="pb-2 text-right font-mono text-micro font-normal uppercase tracking-[0.16em] text-ink-dim">
                  Unit
                </th>
                <th className="pb-2 text-right font-mono text-micro font-normal uppercase tracking-[0.16em] text-ink-dim">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-ink/[0.08]">
                  <td className="py-2.5 pr-4 text-ink">{item.description}</td>
                  <td className="py-2.5 text-right font-mono tabular-nums text-ink-muted">
                    {Number(item.quantity)}
                  </td>
                  <td className="py-2.5 text-right font-mono tabular-nums text-ink-muted">
                    {formatMoney(Number(item.unit_price), doc.currency)}
                  </td>
                  <td className="py-2.5 text-right font-mono tabular-nums text-ink">
                    {formatMoney(lineTotal(item), doc.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Totals ──────────────────────────────────────────────────── */}
        <div className="mt-5 flex justify-end">
          <dl className="w-full max-w-xs text-meta">
            <Total label="Subtotal" value={formatMoney(totals.subtotal, doc.currency)} />
            {totals.discount > 0 && (
              <Total label="Discount" value={`− ${formatMoney(totals.discount, doc.currency)}`} />
            )}
            {totals.tax > 0 && (
              <Total
                label={`Tax at ${Number(doc.tax_rate)}%`}
                value={formatMoney(totals.tax, doc.currency)}
              />
            )}
            <div className="mt-2 border-t border-ink/[0.16] pt-2">
              <Total label="Total" value={formatMoney(totals.total, doc.currency)} strong />
            </div>
            {isBill && (
              <>
                <Total label="Received" value={formatMoney(balance.paid, doc.currency)} />
                <div className="mt-1 border-t border-ink/[0.16] pt-2">
                  <Total
                    label="Balance due"
                    value={formatMoney(balance.balance, doc.currency)}
                    strong
                  />
                </div>
              </>
            )}
          </dl>
        </div>

        {/* ── Notes and terms ─────────────────────────────────────────── */}
        {(doc.notes || doc.terms) && (
          <footer className="mt-8 flex flex-col gap-5 border-t border-ink/[0.12] pt-5">
            {doc.notes && (
              <div>
                <h2 className="font-mono text-micro uppercase tracking-[0.18em] text-ink-dim">
                  Notes
                </h2>
                <p className="mt-2 whitespace-pre-line text-meta leading-relaxed text-ink-muted">
                  {doc.notes}
                </p>
              </div>
            )}

            {doc.terms && (
              <div>
                <h2 className="font-mono text-micro uppercase tracking-[0.18em] text-ink-dim">
                  Terms
                </h2>
                <p className="mt-2 whitespace-pre-line text-meta leading-relaxed text-ink-muted">
                  {doc.terms}
                </p>
              </div>
            )}
          </footer>
        )}

        {!isBill && (
          <p className="mt-6 text-meta leading-relaxed text-rose-700">
            This is an estimate, not a fixed price. The final figure depends on location, access and
            the hours actually flown, and may be higher or lower than the total above.
          </p>
        )}

        <p className="mt-6 border-t border-ink/[0.1] pt-4 text-center font-mono text-micro uppercase tracking-[0.16em] text-ink-dim">
          {site.name} · CAASL registered UAV operator · {site.domain.replace("https://", "")}
        </p>
      </article>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-end gap-3">
      <dt className="text-ink-dim">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}

function Total({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-1">
      <dt className={strong ? "font-medium text-ink" : "text-ink-muted"}>{label}</dt>
      <dd
        className={`font-mono tabular-nums ${strong ? "text-body font-medium text-ink" : "text-ink-muted"}`}
      >
        {value}
      </dd>
    </div>
  );
}
