"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Plus, X } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { today } from "@/lib/admin/documents";
import {
  COMPANY_EXPENSE_CATEGORIES,
  summariseCompany,
  summariseProject,
} from "@/lib/admin/finance";
import type { FinanceEntryRow, FinanceProjectRow } from "@/lib/supabase/types";
import {
  Button,
  ConfirmButton,
  EmptyState,
  Field,
  Input,
  Panel,
  Select,
  StatusLine,
  TextArea,
  formatMoney,
  type Status,
} from "@/components/admin/ui";

/**
 * The accounts page: what came in, what went out, and what is left.
 *
 * Three things sit on it because they answer one question between them —
 * project by project profit, the company overhead that no single project pays
 * for, and the totals that fall out of both. Splitting them across three
 * screens would mean the bottom line was never visible next to the figures it
 * comes from.
 */
export function FinanceOverview() {
  const supabase = createClient();

  const [projects, setProjects] = useState<FinanceProjectRow[]>([]);
  const [entries, setEntries] = useState<FinanceEntryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Status>(null);
  const [saving, setSaving] = useState(false);

  const [addingProject, setAddingProject] = useState(false);
  const [projectDraft, setProjectDraft] = useState({
    name: "",
    client: "",
    reference: "",
    start_date: today(),
    notes: "",
  });

  const [expense, setExpense] = useState({
    category: COMPANY_EXPENSE_CATEGORIES[0] as string,
    description: "",
    amount: "",
    entry_date: today(),
  });

  const load = useCallback(async () => {
    const [projectsResult, entriesResult] = await Promise.all([
      supabase
        .from("finance_projects")
        .select("*")
        .order("start_date", { ascending: false })
        .returns<FinanceProjectRow[]>(),
      supabase
        .from("finance_entries")
        .select("*")
        .order("entry_date", { ascending: false })
        .returns<FinanceEntryRow[]>(),
    ]);

    const error = projectsResult.error ?? entriesResult.error;
    if (error) setStatus({ kind: "error", message: error.message });

    setProjects(projectsResult.data ?? []);
    setEntries(entriesResult.data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void load();
  }, [load]);

  const company = summariseCompany(entries);
  const companyExpenseEntries = entries.filter(
    (e) => e.scope === "company" && e.kind === "expense",
  );

  const createProject = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!projectDraft.name.trim()) {
      return setStatus({ kind: "error", message: "The job needs a name." });
    }

    setSaving(true);
    const { error } = await supabase.from("finance_projects").insert({
      name: projectDraft.name.trim(),
      client: projectDraft.client.trim(),
      reference: projectDraft.reference.trim(),
      start_date: projectDraft.start_date || today(),
      notes: projectDraft.notes.trim(),
    });
    setSaving(false);

    if (error) return setStatus({ kind: "error", message: error.message });

    setProjectDraft({ name: "", client: "", reference: "", start_date: today(), notes: "" });
    setAddingProject(false);
    await load();
    setStatus({ kind: "ok", message: "Job added. Open it to record income and costs." });
  };

  const addCompanyExpense = async (event: React.FormEvent) => {
    event.preventDefault();
    const amount = Number(expense.amount);
    if (!amount || amount <= 0) {
      return setStatus({ kind: "error", message: "Enter an amount." });
    }

    setSaving(true);
    const { error } = await supabase.from("finance_entries").insert({
      kind: "expense",
      scope: "company",
      category: expense.category,
      description: expense.description.trim(),
      amount,
      entry_date: expense.entry_date || today(),
    });
    setSaving(false);

    if (error) return setStatus({ kind: "error", message: error.message });

    setExpense((e) => ({ ...e, description: "", amount: "" }));
    await load();
    setStatus({ kind: "ok", message: "Expense recorded." });
  };

  const removeEntry = async (id: string) => {
    const { error } = await supabase.from("finance_entries").delete().eq("id", id);
    if (error) return setStatus({ kind: "error", message: error.message });
    await load();
    setStatus({ kind: "ok", message: "Entry deleted." });
  };

  const removeProject = async (id: string) => {
    const { error } = await supabase.from("finance_projects").delete().eq("id", id);
    if (error) return setStatus({ kind: "error", message: error.message });
    await load();
    setStatus({ kind: "ok", message: "Job and its entries deleted." });
  };

  if (loading) return <EmptyState>Loading…</EmptyState>;

  return (
    <div className="flex flex-col gap-5">
      {/* ── The bottom line ───────────────────────────────────────────── */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Figure label="Income" value={formatMoney(company.totalIncome)} tone="good" />
        <Figure label="Expenses" value={formatMoney(company.totalExpenses)} tone="bad" />
        <Figure
          label="Profit on jobs"
          hint="Before company overhead"
          value={formatMoney(company.grossProfit)}
        />
        <Figure
          label="Net profit"
          hint="After overhead — the bottom line"
          value={formatMoney(company.netProfit)}
          tone={company.netProfit >= 0 ? "good" : "bad"}
          strong
        />
      </div>

      <StatusLine status={status} />

      {/* ── Jobs ──────────────────────────────────────────────────────── */}
      <Panel
        title="Jobs"
        description="Each one holds the money taken and the costs that went with it."
        actions={
          <Button
            variant={addingProject ? "secondary" : "primary"}
            onClick={() => setAddingProject((v) => !v)}
          >
            {addingProject ? (
              <>
                <X className="size-4" strokeWidth={2} />
                Cancel
              </>
            ) : (
              <>
                <Plus className="size-4" strokeWidth={2.2} />
                New job
              </>
            )}
          </Button>
        }
      >
        {addingProject && (
          <form onSubmit={createProject} className="mb-5 flex flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-4">
              <Field label="Job name" required className="md:col-span-2">
                <Input
                  required
                  value={projectDraft.name}
                  onChange={(e) => setProjectDraft({ ...projectDraft, name: e.target.value })}
                  placeholder="South coast villa collection"
                />
              </Field>
              <Field label="Client">
                <Input
                  value={projectDraft.client}
                  onChange={(e) => setProjectDraft({ ...projectDraft, client: e.target.value })}
                  placeholder="Serendib Villas"
                />
              </Field>
              <Field label="Started">
                <Input
                  type="date"
                  value={projectDraft.start_date}
                  onChange={(e) => setProjectDraft({ ...projectDraft, start_date: e.target.value })}
                />
              </Field>
              <Field
                label="Reference"
                hint="A quotation or bill number, so the ledger points back at the paperwork."
                className="md:col-span-2"
              >
                <Input
                  value={projectDraft.reference}
                  onChange={(e) => setProjectDraft({ ...projectDraft, reference: e.target.value })}
                  placeholder="SLQ-2026-0007"
                />
              </Field>
              <Field label="Notes" className="md:col-span-2">
                <TextArea
                  value={projectDraft.notes}
                  onChange={(e) => setProjectDraft({ ...projectDraft, notes: e.target.value })}
                  className="min-h-20"
                />
              </Field>
            </div>
            <Button type="submit" busy={saving} className="self-start">
              Add job
            </Button>
          </form>
        )}

        {projects.length === 0 ? (
          <EmptyState>No jobs yet. Add one to start recording what it earned and cost.</EmptyState>
        ) : (
          <ul className="flex flex-col gap-2">
            {projects.map((project) => {
              const summary = summariseProject(entries, project.id);
              return (
                <li
                  key={project.id}
                  className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl bg-void p-4 hairline"
                >
                  <Link href={`/admin/finance/${project.id}`} className="min-w-0 flex-1">
                    <span className="block truncate font-display text-title tracking-tight text-ink hover:text-signal">
                      {project.name}
                    </span>
                    <span className="block truncate text-meta text-ink-muted">
                      {project.client || "—"}
                      {project.reference && (
                        <span className="ml-3 font-mono text-micro text-ink-dim">
                          {project.reference}
                        </span>
                      )}
                    </span>
                  </Link>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 font-mono text-meta tabular-nums">
                    <Stat label="in" value={formatMoney(summary.income)} />
                    <Stat label="out" value={formatMoney(summary.expenses)} />
                    <Stat
                      label="profit"
                      value={formatMoney(summary.profit)}
                      className={summary.profit >= 0 ? "text-emerald-700" : "text-rose-700"}
                    />
                  </div>

                  <ConfirmButton onConfirm={() => void removeProject(project.id)} />
                </li>
              );
            })}
          </ul>
        )}
      </Panel>

      {/* ── Company overhead ──────────────────────────────────────────── */}
      <Panel
        title="Company expenses"
        description="Management, advertising and everything else no single job pays for. Subtracted from the profit on jobs to give the net figure above."
      >
        <form onSubmit={addCompanyExpense} className="mb-5 grid items-end gap-4 md:grid-cols-5">
          <Field label="Category">
            <Select
              value={expense.category}
              onChange={(e) => setExpense({ ...expense, category: e.target.value })}
            >
              {COMPANY_EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Description" className="md:col-span-2">
            <Input
              value={expense.description}
              onChange={(e) => setExpense({ ...expense, description: e.target.value })}
              placeholder="Facebook campaign, September"
            />
          </Field>
          <Field label="Amount (LKR)" required>
            <Input
              type="number"
              required
              min={0}
              step="100"
              inputMode="decimal"
              value={expense.amount}
              onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
            />
          </Field>
          <Field label="Date">
            <Input
              type="date"
              value={expense.entry_date}
              onChange={(e) => setExpense({ ...expense, entry_date: e.target.value })}
            />
          </Field>
          <Button type="submit" busy={saving} className="md:col-span-5 md:justify-self-start">
            <Plus className="size-4" strokeWidth={2.2} />
            Record expense
          </Button>
        </form>

        {company.companyExpensesByCategory.length > 0 && (
          <ul className="mb-5 flex flex-wrap gap-2">
            {company.companyExpensesByCategory.map((row) => (
              <li
                key={row.category}
                className="rounded-full bg-obsidian px-3 py-1.5 text-meta text-ink-muted"
              >
                {row.category}{" "}
                <span className="font-mono tabular-nums text-ink">{formatMoney(row.amount)}</span>
              </li>
            ))}
          </ul>
        )}

        {companyExpenseEntries.length === 0 ? (
          <EmptyState>No company expenses recorded.</EmptyState>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {companyExpenseEntries.map((entry) => (
              <li
                key={entry.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl bg-void px-4 py-2.5 hairline"
              >
                <span className="w-28 shrink-0 font-mono text-micro uppercase tracking-[0.14em] text-ink-dim">
                  {entry.entry_date}
                </span>
                <span className="w-44 shrink-0 truncate text-meta text-signal">
                  {entry.category}
                </span>
                <span className="min-w-0 flex-1 truncate text-meta text-ink-muted">
                  {entry.description || "—"}
                </span>
                <span className="font-mono text-meta tabular-nums text-ink">
                  {formatMoney(Number(entry.amount))}
                </span>
                <ConfirmButton onConfirm={() => void removeEntry(entry.id)} label="Remove" />
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function Figure({
  label,
  value,
  hint,
  tone,
  strong,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "good" | "bad";
  strong?: boolean;
}) {
  return (
    <div className={`card rounded-2xl p-4 ${strong ? "bg-signal-soft" : ""}`}>
      <p className="font-mono text-micro uppercase tracking-[0.18em] text-ink-dim">{label}</p>
      <p
        className={`mt-1.5 font-display text-2xl tabular-nums tracking-tight ${
          tone === "good" ? "text-emerald-700" : tone === "bad" ? "text-rose-700" : "text-ink"
        }`}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-micro text-ink-dim">{hint}</p>}
    </div>
  );
}

function Stat({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <span className="flex flex-col">
      <span className="text-micro uppercase tracking-[0.14em] text-ink-dim">{label}</span>
      <span className={className ?? "text-ink"}>{value}</span>
    </span>
  );
}
