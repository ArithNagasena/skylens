import type { DocumentItem } from "@/lib/supabase/types";

/**
 * The arithmetic behind a quotation or a bill.
 *
 * Totals are computed, never stored. A stored total is a second copy of the
 * truth that silently stops matching its line items the first time one is
 * edited — and on a document a client has in their hands, a total that does
 * not add up is worse than no total at all.
 *
 * The order is fixed and matches how the printed document reads: lines, then
 * the discount off the subtotal, then tax on what is left. Applying tax before
 * the discount would over-charge, so the sequence is not arbitrary.
 */

export type DocumentTotals = {
  subtotal: number;
  discount: number;
  taxable: number;
  tax: number;
  total: number;
};

export type LineLike = Pick<DocumentItem, "quantity" | "unit_price">;

export function lineTotal(item: LineLike): number {
  return round(Number(item.quantity || 0) * Number(item.unit_price || 0));
}

export function computeTotals(
  items: LineLike[],
  discount: number,
  taxRate: number,
): DocumentTotals {
  const subtotal = round(items.reduce((sum, item) => sum + lineTotal(item), 0));
  // A discount larger than the subtotal would produce a negative total and,
  // with tax on top, a document that owes the client money. Clamped instead.
  const applied = Math.min(Math.max(Number(discount) || 0, 0), subtotal);
  const taxable = round(subtotal - applied);
  const tax = round((taxable * (Number(taxRate) || 0)) / 100);

  return { subtotal, discount: applied, taxable, tax, total: round(taxable + tax) };
}

/** Two decimal places, without the drift of repeated float addition. */
export function round(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * How much of a bill is still outstanding, and the status that implies.
 *
 * The status is derived rather than left to whoever is editing the row: a bill
 * marked "paid" with a payment of half the total is the kind of inconsistency
 * that only surfaces at the end of the quarter.
 */
export function billBalance(total: number, amountPaid: number) {
  const paid = Math.max(Number(amountPaid) || 0, 0);
  const balance = round(total - paid);
  const status: "unpaid" | "partial" | "paid" =
    paid <= 0 ? "unpaid" : balance <= 0 ? "paid" : "partial";
  return { paid, balance, status };
}

/** An empty line, ready to append to a document being edited. */
export function blankItem(sortOrder: number): DocumentItem {
  return {
    id: crypto.randomUUID(),
    description: "",
    quantity: 1,
    unit_price: 0,
    sort_order: sortOrder,
  };
}

/** ISO `yyyy-mm-dd` for today, which is what a `<input type="date">` wants. */
export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** `yyyy-mm-dd` a number of days out — the default validity on a quotation. */
export function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** "3 September 2026" — how dates read on the printed documents. */
export function formatLongDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-LK", { day: "numeric", month: "long", year: "numeric" });
}

/**
 * A URL-safe slug from a title, used when adding a service or a project.
 *
 * Kept deterministic and visible in the form rather than generated behind the
 * scenes: the slug ends up in `/services/<slug>`, so someone naming a service
 * should be able to see and correct what the address will be.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/**
 * The video id out of any YouTube address a person is likely to paste — a
 * watch URL, a share link, an embed, a Short, or the bare id itself.
 *
 * Admins paste whatever is in the address bar, and a section that silently
 * shows nothing because the URL had `?si=` on the end is indistinguishable
 * from one that is broken.
 */
export function parseYouTubeId(input: string): string | null {
  const value = input.trim();
  if (!value) return null;

  if (/^[\w-]{11}$/.test(value)) return value;

  try {
    const url = new URL(value.startsWith("http") ? value : `https://${value}`);
    const fromQuery = url.searchParams.get("v");
    if (fromQuery && /^[\w-]{11}$/.test(fromQuery)) return fromQuery;

    const segments = url.pathname.split("/").filter(Boolean);
    const last = segments[segments.length - 1];
    if (last && /^[\w-]{11}$/.test(last)) return last;
  } catch {
    return null;
  }

  return null;
}
