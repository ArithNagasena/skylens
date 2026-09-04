"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { today } from "@/lib/admin/documents";
import { PROJECT_EXPENSE_CATEGORIES, summariseProject } from "@/lib/admin/finance";
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
  formatMoney,
  type Status,
} from "@/components/admin/ui";

/**
 * One job's ledger: what was taken for it, what it cost to fly, and the
 * difference.
 *
 * Income and expenses are entered through the same row of fields with a
 * switch, rather than two forms — they are the same four pieces of information
 * and a second form only doubles the places a typo can hide. The running
 * profit sits above them so the effect of each entry is visible as it is made.
 *
 * Company overhead is deliberately absent. It is not this job's to carry, and
 * apportioning it here would make the per-job figure something other than
 * "what this job made", which is the number the studio prices future work off.
 */
export function FinanceProjectLedger({ projectId }: { projectId: string }) {
  const supabase = createClient();

  const [project, setProject] = useState<FinanceProjectRow | null>(null);
  const [entries, setEntries] = useState<FinanceEntryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const [draft, setDraft] = useState({
    kind: "income" as "income" | "expense",
    category: "Fee",
    description: "",
    amount: "",
    entry_date: today(),
  });

  const load = useCallback(async () => {
    const [projectResult, entriesResult] = await Promise.all([
      supabase
        .from("finance_projects")
        .select("*")
        .eq("id", projectId)
        .maybeSingle<FinanceProjectRow>(),
      supabase
        .from("finance_entries")
        .select("*")
        .eq("project_id", projectId)
        .order("entry_date", { ascending: false })
        .returns<FinanceEntryRow[]>(),
    ]);

    const error = projectResult.error ?? entriesResult.error;
    if (error) setStatus({ kind: "error", message: error.message });

    setProject(projectResult.data ?? null);
    setEntries(entriesResult.data ?? []);
    setLoading(false);
  }, [supabase, projectId]);

  useEffect(() => {
    void load();
  }, [load]);

  const summary = summariseProject(entries, projectId);

  const add = async (event: React.FormEvent) => {
    event.preventDefault();
    const amount = Number(draft.amount);
    if (!amount || amount <= 0) {
      return setStatus({ kind: "error", message: "Enter an amount." });
    }

    setSaving(true);
    const { error } = await supabase.from("finance_entries").insert({
      kind: draft.kind,
      scope: "project",
      project_id: projectId,
      category: draft.category,
      description: draft.description.trim(),
      amount,
      entry_date: draft.entry_date || today(),
    });
    setSaving(false);

    if (error) return setStatus({ kind: "error", message: error.message });

    setDraft((d) => ({ ...d, description: "", amount: "" }));
    await load();
    setStatus({
      kind: "ok",
      message: draft.kind === "income" ? "Payment recorded." : "Cost recorded.",
    });
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("finance_entries").delete().eq("id", id);
    if (error) return setStatus({ kind: "error", message: error.message });
    await load();
    setStatus({ kind: "ok", message: "Entry deleted." });
  };

  const setKind = (kind: "income" | "expense") =>
    setDraft((d) => ({
      ...d,
      kind,
      // The category lists have nothing in common, so switching sides has to
      // reset it or an expense ends up filed under "Fee".
      category: kind === "income" ? "Fee" : PROJECT_EXPENSE_CATEGORIES[0],
    }));

  if (loading) return <EmptyState>Loading…</EmptyState>;
  if (!project) return <EmptyState>That job no longer exists.</EmptyState>;

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/admin/finance"
        className="inline-flex w-fit items-center gap-2 text-meta text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" strokeWidth={1.9} />
        All jobs
      </Link>

      <div>
        <h1 className="font-display text-2xl tracking-tight text-ink md:text-3xl">{project.name}</h1>
        <p className="mt-1 text-meta text-ink-muted">
          {project.client || "No client recorded"}
          {project.reference && (
            <span className="ml-3 font-mono text-micro text-ink-dim">{project.reference}</span>
          )}
          <span className="ml-3 text-ink-dim">started {project.start_date}</span>
        </p>
        {project.notes && (
          <p className="mt-2 max-w-2xl whitespace-pre-line text-meta text-ink-muted">
            {project.notes}
          </p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Figure label="Amount taken" value={formatMoney(summary.income)} tone="good" />
        <Figure label="Costs" value={formatMoney(summary.expenses)} tone="bad" />
        <Figure
          label="Profit"
          value={formatMoney(summary.profit)}
          tone={summary.profit >= 0 ? "good" : "bad"}
          strong
        />
      </div>

      <StatusLine status={status} />

      <Panel title="Record money in or out">
        <form onSubmit={add} className="grid items-end gap-4 md:grid-cols-6">
          <Field label="Type">
            <Select
              value={draft.kind}
              onChange={(e) => setKind(e.target.value as "income" | "expense")}
            >
              <option value="income">Money in</option>
              <option value="expense">Money out</option>
            </Select>
          </Field>

          <Field label="Category">
            {draft.kind === "income" ? (
              <Select
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              >
                <option value="Fee">Fee</option>
                <option value="Advance">Advance</option>
                <option value="Balance payment">Balance payment</option>
                <option value="Extra work">Extra work</option>
                <option value="Other">Other</option>
              </Select>
            ) : (
              <Select
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              >
                {PROJECT_EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <Field label="Description" className="md:col-span-2">
            <Input
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              placeholder={draft.kind === "income" ? "50% advance on booking" : "Second pilot, two days"}
            />
          </Field>

          <Field label="Amount (LKR)" required>
            <Input
              type="number"
              required
              min={0}
              step="100"
              inputMode="decimal"
              value={draft.amount}
              onChange={(e) => setDraft({ ...draft, amount: e.target.value })}
            />
          </Field>

          <Field label="Date">
            <Input
              type="date"
              value={draft.entry_date}
              onChange={(e) => setDraft({ ...draft, entry_date: e.target.value })}
            />
          </Field>

          <Button type="submit" busy={saving} className="md:col-span-6 md:justify-self-start">
            <Plus className="size-4" strokeWidth={2.2} />
            Add entry
          </Button>
        </form>
      </Panel>

      <Panel title="Ledger">
        {entries.length === 0 ? (
          <EmptyState>Nothing recorded against this job yet.</EmptyState>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl bg-void px-4 py-2.5 hairline"
              >
                <span className="w-28 shrink-0 font-mono text-micro uppercase tracking-[0.14em] text-ink-dim">
                  {entry.entry_date}
                </span>
                <span
                  className={`w-40 shrink-0 truncate text-meta ${
                    entry.kind === "income" ? "text-emerald-700" : "text-rose-700"
                  }`}
                >
                  {entry.category}
                </span>
                <span className="min-w-0 flex-1 truncate text-meta text-ink-muted">
                  {entry.description || "—"}
                </span>
                <span className="font-mono text-meta tabular-nums text-ink">
                  {entry.kind === "income" ? "+" : "−"} {formatMoney(Number(entry.amount))}
                </span>
                <ConfirmButton onConfirm={() => void remove(entry.id)} label="Remove" />
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
  tone,
  strong,
}: {
  label: string;
  value: string;
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
    </div>
  );
}
