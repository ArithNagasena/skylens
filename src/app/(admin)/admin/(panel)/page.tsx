import Link from "next/link";
import {
  Banknote,
  FileText,
  Image as ImageIcon,
  Images,
  LayoutGrid,
  Receipt,
  Wrench,
  Film,
} from "lucide-react";

import { PageHeader, formatMoney } from "@/components/admin/ui";
import { billBalance, computeTotals } from "@/lib/admin/documents";
import { summariseCompany } from "@/lib/admin/finance";
import { createServerSupabase } from "@/lib/supabase/server";
import type { BillWithItems, FinanceEntryRow } from "@/lib/supabase/types";

export const metadata = { title: "Overview" };

/**
 * The landing screen of the panel.
 *
 * It answers two questions before anything else: how much money is owed to the
 * studio right now, and what the business is actually making. Everything else
 * is a way through to the section that changes it.
 *
 * Counts come from `head: true` queries, which return the row count without
 * transferring a single row — the numbers here are navigation, not data.
 */
export default async function AdminOverviewPage() {
  const supabase = await createServerSupabase();

  const countOf = async (table: string) => {
    const { count } = await supabase.from(table).select("id", { count: "exact", head: true });
    return count ?? 0;
  };

  const [heroCount, latestWorkCount, videoCount, serviceCount, projectCount, quotationCount] =
    await Promise.all([
      countOf("hero_images"),
      countOf("latest_work_images"),
      countOf("showreel_videos"),
      countOf("services"),
      countOf("projects"),
      countOf("quotations"),
    ]);

  const [{ data: bills }, { data: entries }] = await Promise.all([
    supabase
      .from("bills")
      .select("*, bill_items(*)")
      .neq("status", "cancelled")
      .returns<BillWithItems[]>(),
    supabase.from("finance_entries").select("*").returns<FinanceEntryRow[]>(),
  ]);

  const outstanding = (bills ?? []).reduce((sum, bill) => {
    const totals = computeTotals(bill.bill_items ?? [], Number(bill.discount), Number(bill.tax_rate));
    return sum + billBalance(totals.total, Number(bill.amount_paid)).balance;
  }, 0);

  const finance = summariseCompany(entries ?? []);

  const sections = [
    {
      href: "/admin/hero",
      icon: ImageIcon,
      title: "Hero photos",
      detail: `${heroCount} ${heroCount === 1 ? "photo" : "photos"} rotating on the landing page`,
    },
    {
      href: "/admin/latest-work",
      icon: Images,
      title: "Latest work strip",
      detail: `${latestWorkCount} ${latestWorkCount === 1 ? "image" : "images"} in the scrolling strip`,
    },
    {
      href: "/admin/videos",
      icon: Film,
      title: "Recently completed projects",
      detail: `${videoCount} of 4 YouTube films`,
    },
    {
      href: "/admin/services",
      icon: Wrench,
      title: "Services & prices",
      detail: `${serviceCount} ${serviceCount === 1 ? "service" : "services"} on the site`,
    },
    {
      href: "/admin/projects",
      icon: LayoutGrid,
      title: "Portfolio projects",
      detail: `${projectCount} added to the work page`,
    },
    {
      href: "/admin/quotations",
      icon: FileText,
      title: "Quotations",
      detail: `${quotationCount} raised`,
    },
    {
      href: "/admin/bills",
      icon: Receipt,
      title: "Bills",
      detail: `${(bills ?? []).length} raised`,
    },
    {
      href: "/admin/finance",
      icon: Banknote,
      title: "Accounts",
      detail: "Income, costs and profit",
    },
  ];

  return (
    <>
      <PageHeader
        title="Overview"
        lede="Everything the public site shows, the paperwork behind it, and where the money went."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Figure label="Outstanding" value={formatMoney(outstanding)} hint="Billed and not yet paid" />
        <Figure label="Income to date" value={formatMoney(finance.totalIncome)} />
        <Figure
          label="Net profit"
          value={formatMoney(finance.netProfit)}
          hint="After company overhead"
          strong
        />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className="card card-interactive flex items-start gap-4 rounded-2xl p-5"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-signal-soft text-signal">
                <Icon className="size-5" strokeWidth={1.8} />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-title tracking-tight text-ink">
                  {section.title}
                </span>
                <span className="mt-0.5 block text-meta text-ink-muted">{section.detail}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

function Figure({
  label,
  value,
  hint,
  strong,
}: {
  label: string;
  value: string;
  hint?: string;
  strong?: boolean;
}) {
  return (
    <div className={`card rounded-2xl p-4 ${strong ? "bg-signal-soft" : ""}`}>
      <p className="font-mono text-micro uppercase tracking-[0.18em] text-ink-dim">{label}</p>
      <p className="mt-1.5 font-display text-2xl tabular-nums tracking-tight text-ink">{value}</p>
      {hint && <p className="mt-1 text-micro text-ink-dim">{hint}</p>}
    </div>
  );
}
