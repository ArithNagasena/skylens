"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import {
  billBalance,
  blankItem,
  computeTotals,
  daysFromNow,
  lineTotal,
  today,
} from "@/lib/admin/documents";
import type {
  BillWithItems,
  DocumentItem,
  QuotationRow,
  QuotationWithItems,
} from "@/lib/supabase/types";
import {
  Button,
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
 * The editor behind both a quotation and a bill.
 *
 * They are the same document with different endings — a quotation is valid
 * until a date, a bill is due by one and can be part-paid — so they share a
 * form rather than being maintained as two that drift apart. What differs is
 * gated on `kind` and nothing else.
 *
 * Line items are edited in place and saved by replacement: the existing rows
 * are deleted and the current set inserted. Diffing them would be the more
 * careful approach for a document with hundreds of lines, but these have five,
 * and replacement cannot leave a stale row behind after a reorder.
 *
 * Totals are never typed. They are recomputed from the lines on every
 * keystroke and shown live, so the number the admin sends is the number the
 * document will print.
 */

export type DocumentKind = "quotation" | "bill";

const DEFAULT_TERMS = [
  "This quotation is an estimate. The final price depends on location, access and the hours actually flown.",
  "Travel within 40 km of Colombo is included. Beyond that, transport and accommodation are billed at cost.",
  "Flights are subject to CAASL approval and safe weather. A weather cancellation is rescheduled at no charge.",
  "50% is payable on booking and the balance on delivery.",
].join("\n");

type Draft = {
  client_name: string;
  client_company: string;
  client_email: string;
  client_phone: string;
  client_address: string;
  project_title: string;
  location: string;
  issue_date: string;
  valid_until: string;
  due_date: string;
  discount: string;
  tax_rate: string;
  notes: string;
  terms: string;
  status: string;
  amount_paid: string;
  payment_method: string;
  quotation_id: string;
  quote_reference: string;
};

function emptyDraft(kind: DocumentKind): Draft {
  return {
    client_name: "",
    client_company: "",
    client_email: "",
    client_phone: "",
    client_address: "",
    project_title: "",
    location: "",
    issue_date: today(),
    valid_until: daysFromNow(30),
    due_date: daysFromNow(14),
    discount: "0",
    tax_rate: "0",
    notes: "",
    terms: kind === "quotation" ? DEFAULT_TERMS : "",
    status: kind === "quotation" ? "draft" : "unpaid",
    amount_paid: "0",
    payment_method: "",
    quotation_id: "",
    quote_reference: "",
  };
}

export function DocumentForm({
  kind,
  existing,
  fromQuotationId,
}: {
  kind: DocumentKind;
  /** Present when editing; absent when creating. */
  existing?: QuotationWithItems | BillWithItems;
  /** On a new bill: the quotation it is being raised against. */
  fromQuotationId?: string;
}) {
  const supabase = createClient();
  const router = useRouter();

  const [draft, setDraft] = useState<Draft>(() => {
    if (!existing) return emptyDraft(kind);
    const bill = kind === "bill" ? (existing as BillWithItems) : null;
    const quote = kind === "quotation" ? (existing as QuotationWithItems) : null;

    return {
      client_name: existing.client_name,
      client_company: existing.client_company,
      client_email: existing.client_email,
      client_phone: existing.client_phone,
      client_address: existing.client_address,
      project_title: existing.project_title,
      location: existing.location,
      issue_date: existing.issue_date,
      valid_until: quote?.valid_until ?? "",
      due_date: bill?.due_date ?? "",
      discount: String(existing.discount ?? 0),
      tax_rate: String(existing.tax_rate ?? 0),
      notes: existing.notes,
      terms: existing.terms,
      status: existing.status,
      amount_paid: String(bill?.amount_paid ?? 0),
      payment_method: bill?.payment_method ?? "",
      quotation_id: bill?.quotation_id ?? "",
      quote_reference: bill?.quote_reference ?? "",
    };
  });

  const [items, setItems] = useState<DocumentItem[]>(() => {
    const rows =
      kind === "quotation"
        ? (existing as QuotationWithItems | undefined)?.quotation_items
        : (existing as BillWithItems | undefined)?.bill_items;

    if (!rows || rows.length === 0) return [blankItem(0)];
    return [...rows]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((r) => ({
        id: r.id,
        description: r.description,
        quantity: Number(r.quantity),
        unit_price: Number(r.unit_price),
        sort_order: r.sort_order,
      }));
  });

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const [quotations, setQuotations] = useState<QuotationRow[]>([]);

  // Bills offer a picker of every quotation, so one can be cited without
  // remembering its number.
  useEffect(() => {
    if (kind !== "bill") return;
    void (async () => {
      const { data } = await supabase
        .from("quotations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200)
        .returns<QuotationRow[]>();
      setQuotations(data ?? []);
    })();
  }, [kind, supabase]);

  // Raising a bill from a quotation: copy the client, the job and the lines,
  // so the two documents agree by construction rather than by retyping.
  useEffect(() => {
    if (kind !== "bill" || !fromQuotationId || existing) return;

    void (async () => {
      const { data, error } = await supabase
        .from("quotations")
        .select("*, quotation_items(*)")
        .eq("id", fromQuotationId)
        .maybeSingle<QuotationWithItems>();

      if (error || !data) {
        setStatus({ kind: "error", message: "Could not load that quotation." });
        return;
      }

      setDraft((d) => ({
        ...d,
        client_name: data.client_name,
        client_company: data.client_company,
        client_email: data.client_email,
        client_phone: data.client_phone,
        client_address: data.client_address,
        project_title: data.project_title,
        location: data.location,
        discount: String(data.discount ?? 0),
        tax_rate: String(data.tax_rate ?? 0),
        terms: data.terms,
        quotation_id: data.id,
        quote_reference: data.quote_number,
      }));

      const lines = [...(data.quotation_items ?? [])].sort((a, b) => a.sort_order - b.sort_order);
      if (lines.length > 0) {
        setItems(
          lines.map((r, i) => ({
            id: crypto.randomUUID(),
            description: r.description,
            quantity: Number(r.quantity),
            unit_price: Number(r.unit_price),
            sort_order: i,
          })),
        );
      }
      setStatus({ kind: "ok", message: `Copied from quotation ${data.quote_number}.` });
    })();
  }, [kind, fromQuotationId, existing, supabase]);

  const totals = computeTotals(items, Number(draft.discount) || 0, Number(draft.tax_rate) || 0);
  const balance = billBalance(totals.total, Number(draft.amount_paid) || 0);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const setItem = (id: string, patch: Partial<DocumentItem>) =>
    setItems((list) => list.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  const pickQuotation = (id: string) => {
    const found = quotations.find((q) => q.id === id);
    setDraft((d) => ({
      ...d,
      quotation_id: id,
      quote_reference: found?.quote_number ?? "",
    }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!draft.client_name.trim()) {
      return setStatus({ kind: "error", message: "A document needs a client name." });
    }

    const usable = items.filter((i) => i.description.trim() !== "" || i.unit_price > 0);
    if (usable.length === 0) {
      return setStatus({ kind: "error", message: "Add at least one line." });
    }

    setSaving(true);

    const shared = {
      client_name: draft.client_name.trim(),
      client_company: draft.client_company.trim(),
      client_email: draft.client_email.trim(),
      client_phone: draft.client_phone.trim(),
      client_address: draft.client_address.trim(),
      project_title: draft.project_title.trim(),
      location: draft.location.trim(),
      issue_date: draft.issue_date || today(),
      discount: Number(draft.discount) || 0,
      tax_rate: Number(draft.tax_rate) || 0,
      notes: draft.notes.trim(),
      terms: draft.terms.trim(),
    };

    // Typed loosely on purpose. The two document tables have different columns
    // and the client is not generated against a schema, so a union of two
    // object literals is not something the query builder can narrow — every
    // field in it is validated by the table's own constraints anyway.
    const payload: Record<string, unknown> =
      kind === "quotation"
        ? { ...shared, valid_until: draft.valid_until || null, status: draft.status }
        : {
            ...shared,
            due_date: draft.due_date || null,
            amount_paid: Number(draft.amount_paid) || 0,
            payment_method: draft.payment_method.trim(),
            quotation_id: draft.quotation_id || null,
            quote_reference: draft.quote_reference.trim(),
            // Cancelled is a decision; every other state follows from the
            // money, so it is derived rather than chosen.
            status: draft.status === "cancelled" ? "cancelled" : balance.status,
          };

    const table = kind === "quotation" ? "quotations" : "bills";
    const itemTable = kind === "quotation" ? "quotation_items" : "bill_items";
    const parentKey = kind === "quotation" ? "quotation_id" : "bill_id";

    let id = existing?.id ?? "";

    if (existing) {
      const { error } = await supabase.from(table).update(payload).eq("id", existing.id);
      if (error) {
        setSaving(false);
        return setStatus({ kind: "error", message: error.message });
      }
      await supabase.from(itemTable).delete().eq(parentKey, existing.id);
    } else {
      const { data, error } = await supabase
        .from(table)
        .insert(payload)
        .select("id")
        .single<{ id: string }>();
      if (error || !data) {
        setSaving(false);
        return setStatus({ kind: "error", message: error?.message ?? "Could not save." });
      }
      id = data.id;
    }

    const { error: itemsError } = await supabase.from(itemTable).insert(
      usable.map((item, index) => ({
        [parentKey]: id,
        description: item.description.trim(),
        quantity: Number(item.quantity) || 0,
        unit_price: Number(item.unit_price) || 0,
        sort_order: index,
      })),
    );

    setSaving(false);

    if (itemsError) return setStatus({ kind: "error", message: itemsError.message });

    router.push(`/admin/${kind === "quotation" ? "quotations" : "bills"}/${id}`);
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <Panel title="Client">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Name" required>
            <Input
              required
              value={draft.client_name}
              onChange={(e) => set("client_name", e.target.value)}
              placeholder="Nimal Perera"
            />
          </Field>
          <Field label="Company">
            <Input
              value={draft.client_company}
              onChange={(e) => set("client_company", e.target.value)}
              placeholder="Serendib Villas (Pvt) Ltd"
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={draft.client_email}
              onChange={(e) => set("client_email", e.target.value)}
            />
          </Field>
          <Field label="Phone">
            <Input
              value={draft.client_phone}
              onChange={(e) => set("client_phone", e.target.value)}
              placeholder="+94 77 018 4420"
            />
          </Field>
          <Field label="Address" className="md:col-span-2">
            <TextArea
              value={draft.client_address}
              onChange={(e) => set("client_address", e.target.value)}
              className="min-h-20"
            />
          </Field>
        </div>
      </Panel>

      <Panel title="The job">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Project title">
            <Input
              value={draft.project_title}
              onChange={(e) => set("project_title", e.target.value)}
              placeholder="South coast villa collection"
            />
          </Field>
          <Field label="Location">
            <Input
              value={draft.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="Ahangama, Southern Province"
            />
          </Field>

          <Field label="Issue date">
            <Input
              type="date"
              value={draft.issue_date}
              onChange={(e) => set("issue_date", e.target.value)}
            />
          </Field>

          {kind === "quotation" ? (
            <Field label="Valid until" hint="After this date the price is no longer held.">
              <Input
                type="date"
                value={draft.valid_until}
                onChange={(e) => set("valid_until", e.target.value)}
              />
            </Field>
          ) : (
            <Field label="Payment due">
              <Input
                type="date"
                value={draft.due_date}
                onChange={(e) => set("due_date", e.target.value)}
              />
            </Field>
          )}

          {kind === "bill" && (
            <Field
              label="Against quotation"
              hint="Optional. The quotation's number is printed on the bill."
              className="md:col-span-2"
            >
              <Select
                value={draft.quotation_id}
                onChange={(e) => pickQuotation(e.target.value)}
              >
                <option value="">No quotation — a standalone bill</option>
                {quotations.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.quote_number} — {q.client_name}
                    {q.project_title ? ` · ${q.project_title}` : ""}
                  </option>
                ))}
              </Select>
            </Field>
          )}
        </div>
      </Panel>

      <Panel
        title="Lines"
        actions={
          <Button
            type="button"
            variant="secondary"
            onClick={() => setItems((list) => [...list, blankItem(list.length)])}
          >
            <Plus className="size-4" strokeWidth={2.2} />
            Add line
          </Button>
        }
      >
        <div className="flex flex-col gap-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="grid items-end gap-3 rounded-xl bg-void p-3 hairline md:grid-cols-[1fr_6rem_9rem_8rem_auto]"
            >
              <Field label={index === 0 ? "Description" : ""}>
                <Input
                  value={item.description}
                  onChange={(e) => setItem(item.id, { description: e.target.value })}
                  placeholder="Full production day — cinema airframe, two crew"
                />
              </Field>
              <Field label={index === 0 ? "Qty" : ""}>
                <Input
                  type="number"
                  min={0}
                  step="0.5"
                  inputMode="decimal"
                  value={item.quantity}
                  onChange={(e) => setItem(item.id, { quantity: Number(e.target.value) })}
                />
              </Field>
              <Field label={index === 0 ? "Unit price (LKR)" : ""}>
                <Input
                  type="number"
                  min={0}
                  step="100"
                  inputMode="decimal"
                  value={item.unit_price}
                  onChange={(e) => setItem(item.id, { unit_price: Number(e.target.value) })}
                />
              </Field>
              <div className="flex h-10 items-center justify-end px-1 font-mono text-meta tabular-nums text-ink">
                {formatMoney(lineTotal(item))}
              </div>
              <Button
                type="button"
                variant="ghost"
                aria-label="Remove line"
                disabled={items.length === 1}
                onClick={() => setItems((list) => list.filter((i) => i.id !== item.id))}
              >
                <Trash2 className="size-4" strokeWidth={1.9} />
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Discount (LKR)">
              <Input
                type="number"
                min={0}
                step="100"
                inputMode="decimal"
                value={draft.discount}
                onChange={(e) => set("discount", e.target.value)}
              />
            </Field>
            <Field label="Tax (%)" hint="Leave at 0 if you are not registered for VAT.">
              <Input
                type="number"
                min={0}
                max={100}
                step="0.5"
                inputMode="decimal"
                value={draft.tax_rate}
                onChange={(e) => set("tax_rate", e.target.value)}
              />
            </Field>
          </div>

          <dl className="flex flex-col gap-2 rounded-xl bg-void p-4 text-meta hairline">
            <Row label="Subtotal" value={formatMoney(totals.subtotal)} />
            {totals.discount > 0 && (
              <Row label="Discount" value={`− ${formatMoney(totals.discount)}`} />
            )}
            {totals.tax > 0 && (
              <Row label={`Tax at ${draft.tax_rate}%`} value={formatMoney(totals.tax)} />
            )}
            <div className="mt-1 border-t border-ink/[0.12] pt-2">
              <Row label="Total" value={formatMoney(totals.total)} strong />
            </div>
            {kind === "bill" && (
              <>
                <Row label="Paid" value={formatMoney(balance.paid)} />
                <Row label="Balance due" value={formatMoney(balance.balance)} strong />
              </>
            )}
          </dl>
        </div>
      </Panel>

      <Panel title={kind === "quotation" ? "Status & notes" : "Payment, status & notes"}>
        <div className="grid gap-4 md:grid-cols-2">
          {kind === "bill" && (
            <>
              <Field label="Amount received (LKR)">
                <Input
                  type="number"
                  min={0}
                  step="100"
                  inputMode="decimal"
                  value={draft.amount_paid}
                  onChange={(e) => set("amount_paid", e.target.value)}
                />
              </Field>
              <Field label="Payment method">
                <Input
                  value={draft.payment_method}
                  onChange={(e) => set("payment_method", e.target.value)}
                  placeholder="Bank transfer"
                />
              </Field>
            </>
          )}

          <Field
            label="Status"
            hint={
              kind === "bill"
                ? "Set from the amount received — only cancellation is a manual choice."
                : undefined
            }
          >
            <Select
              // On a bill the only stored state that is a decision is
              // "cancelled"; the rest is read off the payment, so the control
              // shows the derived value rather than a stale stored one that
              // would leave the select matching none of its options.
              value={kind === "bill" && draft.status !== "cancelled" ? balance.status : draft.status}
              onChange={(e) => set("status", e.target.value)}
            >
              {kind === "quotation" ? (
                <>
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="accepted">Accepted</option>
                  <option value="declined">Declined</option>
                  <option value="expired">Expired</option>
                </>
              ) : (
                <>
                  <option value={balance.status}>
                    {balance.status === "paid"
                      ? "Paid"
                      : balance.status === "partial"
                        ? "Part paid"
                        : "Unpaid"}
                  </option>
                  <option value="cancelled">Cancelled</option>
                </>
              )}
            </Select>
          </Field>

          <Field label="Notes to the client" className="md:col-span-2">
            <TextArea value={draft.notes} onChange={(e) => set("notes", e.target.value)} />
          </Field>

          <Field label="Terms" className="md:col-span-2">
            <TextArea
              value={draft.terms}
              onChange={(e) => set("terms", e.target.value)}
              className="min-h-32"
            />
          </Field>
        </div>
      </Panel>

      <StatusLine status={status} />

      <div className="flex items-center gap-2">
        <Button type="submit" busy={saving}>
          {existing ? "Save changes" : kind === "quotation" ? "Create quotation" : "Create bill"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={strong ? "font-medium text-ink" : "text-ink-muted"}>{label}</dt>
      <dd className={`font-mono tabular-nums ${strong ? "font-medium text-ink" : "text-ink-muted"}`}>
        {value}
      </dd>
    </div>
  );
}
