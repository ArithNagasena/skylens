import type { QuotableService } from "@/content/service-cards";

export type EstimateLine = { title: string; low: number; high: number };

export type Estimate = {
  lines: EstimateLine[];
  low: number;
  high: number;
};

/**
 * Pulls the leading number out of a `startingAt` string like "LKR 25,000+"
 * or "LKR 30,000+ / visit". Every entry in content/services.ts follows this
 * shape; if one ever doesn't, this returns 0 for that line rather than
 * throwing, so a malformed price degrades the estimate instead of crashing
 * the quotation.
 */
function parseStartingPrice(startingAt: string): number {
  const match = startingAt.match(/[\d,]+/);
  return match ? Number.parseInt(match[0].replace(/,/g, ""), 10) : 0;
}

/**
 * A same-day estimate from what the visitor picked, not a quote — the studio
 * still prices every job on the specifics (location, access, exact hours).
 * Each selected service's published starting price is the floor of its line;
 * the ceiling is that floor plus 35%, which is what turns a single fixed
 * number into the honest "could be higher" range the quotation shows in red.
 *
 * Deliberately not a function of the hours the visitor enters: `startingAt`
 * already represents a full booking for that service, and scaling it by an
 * arbitrary hourly rate nobody has actually priced would be inventing a
 * number, not estimating one.
 */
export function buildEstimate(selected: QuotableService[]): Estimate {
  const lines = selected.map((s) => {
    const low = parseStartingPrice(s.startingAt);
    const high = Math.ceil((low * 1.35) / 500) * 500;
    return { title: s.title, low, high };
  });

  return {
    lines,
    low: lines.reduce((sum, l) => sum + l.low, 0),
    high: lines.reduce((sum, l) => sum + l.high, 0),
  };
}

export function formatLkr(amount: number): string {
  return `LKR ${amount.toLocaleString("en-LK")}`;
}
