"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { billBalance, computeTotals, formatLongDate } from "@/lib/admin/documents";
import type { BillWithItems, QuotationWithItems } from "@/lib/supabase/types";
import {
  EmptyState,
  Input,
  Select,
  StatusBadge,
  StatusLine,
  formatMoney,
  type Status,
} from "@/components/admin/ui";

/**
 * Every quotation, or every bill, with its total worked out.
 *
 * The list loads each document's line items alongside it and totals them here
 * rather than reading a stored total, for the same reason the documents
 * themselves do not store one: a cached figure that disagrees with the lines
 * is worse than no figure. The row counts are small — a studio raises tens of
 * these a year, not thousands — so one query with a join is cheaper than the
 * bookkeeping a denormalised total would need.
 *
 * Search covers the number, the client and the project, because those are the
 * three things anyone actually has to hand when looking for a document: "the
 * Serendib one", "the villa job", or a reference off an email.
 */
export function DocumentList({ kind }: { kind: "quotation" | "bill" }) {
  const supabase = createClient();
  const isBill = kind === "bill";

  const [rows, setRows] = useState<(QuotationWithItems | BillWithItems)[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Status>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from(isBill ? "bills" : "quotations")
      .select(isBill ? "*, bill_items(*)" : "*, quotation_items(*)")
      .order("created_at", { ascending: false })
      .returns<(QuotationWithItems | BillWithItems)[]>();

    if (error) setStatus({ kind: "error", message: error.message });
    setRows(data ?? []);
    setLoading(false);
  }, [supabase, isBill]);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return rows.filter((row) => {
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      if (!needle) return true;

      const number = isBill
        ? (row as BillWithItems).bill_number
        : (row as QuotationWithItems).quote_number;

      return [number, row.client_name, row.client_company, row.project_title]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(needle));
    });
  }, [rows, query, statusFilter, isBill]);

  if (loading) return <EmptyState>Loading…</EmptyState>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by number, client or project"
          className="max-w-sm"
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="max-w-44"
        >
          <option value="all">Any status</option>
          {(isBill
            ? ["unpaid", "partial", "paid", "cancelled"]
            : ["draft", "sent", "accepted", "declined", "expired"]
          ).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <span className="ml-auto font-mono text-micro uppercase tracking-[0.16em] text-ink-dim">
          {visible.length} of {rows.length}
        </span>
      </div>

      <StatusLine status={status} />

      {visible.length === 0 ? (
        <EmptyState>
          {rows.length === 0
            ? `No ${isBill ? "bills" : "quotations"} yet.`
            : "Nothing matches that search."}
        </EmptyState>
      ) : (
        <ul className="flex flex-col gap-2">
          {visible.map((row) => {
            const items = isBill
              ? (row as BillWithItems).bill_items
              : (row as QuotationWithItems).quotation_items;
            const totals = computeTotals(items ?? [], Number(row.discount), Number(row.tax_rate));
            const number = isBill
              ? (row as BillWithItems).bill_number
              : (row as QuotationWithItems).quote_number;
            const balance = isBill
              ? billBalance(totals.total, Number((row as BillWithItems).amount_paid))
              : null;

            return (
              <li key={row.id}>
                <Link
                  href={`/admin/${isBill ? "bills" : "quotations"}/${row.id}`}
                  className="card card-interactive flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl p-4"
                >
                  <span className="w-36 shrink-0 font-mono text-meta uppercase tracking-[0.1em] text-signal">
                    {number}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-title tracking-tight text-ink">
                      {row.client_name}
                    </span>
                    <span className="block truncate text-meta text-ink-muted">
                      {row.project_title || "—"}
                      <span className="ml-3 text-ink-dim">{formatLongDate(row.issue_date)}</span>
                    </span>
                  </span>

                  <span className="text-right">
                    <span className="block font-mono text-body tabular-nums text-ink">
                      {formatMoney(totals.total, row.currency)}
                    </span>
                    {balance && balance.balance > 0 && (
                      <span className="block font-mono text-micro tabular-nums text-ink-dim">
                        {formatMoney(balance.balance, row.currency)} due
                      </span>
                    )}
                  </span>

                  <StatusBadge status={row.status} />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
