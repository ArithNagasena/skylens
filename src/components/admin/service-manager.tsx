"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, X } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/admin/documents";
import { revalidateSiteContent } from "@/lib/actions/revalidate";
import { formatStartingPrice } from "@/content/service-cards";
import { ServiceIcon, serviceIconNames } from "@/components/ui/icon";
import type { ServiceRow } from "@/lib/supabase/types";
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
  type Status,
} from "@/components/admin/ui";

/**
 * Services and their starting prices — the one list behind the landing-page
 * grid, the /services cards and the categories on the quote form. Change a
 * price here and all three follow.
 *
 * The price is a plain number of rupees, not free text. Storing "from LKR
 * 25,000-ish" would render exactly like that on the site and, worse, the quote
 * estimator parses these numbers to build a client's total — a price it cannot
 * read becomes a silent zero on a document going out to a customer. Leaving it
 * blank is a real answer and shows as "On request".
 *
 * The slug is editable but pre-filled from the title, because it decides the
 * address of the service's page. It is locked once a service exists: changing
 * it would break any link already sent to a client.
 */

type Draft = {
  slug: string;
  title: string;
  description: string;
  starting_price: string;
  price_note: string;
  icon: string;
  tier: "core" | "specialist";
};

const emptyDraft: Draft = {
  slug: "",
  title: "",
  description: "",
  starting_price: "",
  price_note: "",
  icon: "Camera",
  tier: "core",
};

export function ServiceManager() {
  const supabase = createClient();

  const [rows, setRows] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Status>(null);
  const [saving, setSaving] = useState(false);

  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  /** Whether the admin has typed their own slug, so we stop overwriting it. */
  const [slugTouched, setSlugTouched] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true })
      .returns<ServiceRow[]>();

    if (error) setStatus({ kind: "error", message: error.message });
    setRows(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void load();
  }, [load]);

  const settle = async (message: string) => {
    await revalidateSiteContent();
    await load();
    setStatus({ kind: "ok", message });
  };

  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    const slug = (slugTouched ? slugify(draft.slug) : slugify(draft.title)) || slugify(draft.title);

    if (!draft.title.trim() || !slug) {
      return setStatus({ kind: "error", message: "A service needs a name." });
    }

    setSaving(true);
    const { error } = await supabase.from("services").insert({
      slug,
      title: draft.title.trim(),
      description: draft.description.trim(),
      starting_price: draft.starting_price === "" ? null : Number(draft.starting_price),
      price_note: draft.price_note.trim(),
      icon: draft.icon,
      tier: draft.tier,
      sort_order: (rows.at(-1)?.sort_order ?? 0) + 10,
    });
    setSaving(false);

    if (error) {
      return setStatus({
        kind: "error",
        message: error.message.includes("duplicate")
          ? `There is already a service at /services/${slug}.`
          : error.message,
      });
    }

    setDraft(emptyDraft);
    setSlugTouched(false);
    setAdding(false);
    await settle("Service added.");
  };

  const update = async (row: ServiceRow, patch: Partial<ServiceRow>) => {
    setSaving(true);
    const { error } = await supabase.from("services").update(patch).eq("id", row.id);
    setSaving(false);
    if (error) return setStatus({ kind: "error", message: error.message });
    await settle("Service saved.");
  };

  const move = async (index: number, direction: -1 | 1) => {
    const a = rows[index];
    const b = rows[index + direction];
    if (!a || !b) return;

    const [first, second] = await Promise.all([
      supabase.from("services").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("services").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    const error = first.error ?? second.error;
    if (error) return setStatus({ kind: "error", message: error.message });
    await settle("Order updated.");
  };

  const remove = async (row: ServiceRow) => {
    const { error } = await supabase.from("services").delete().eq("id", row.id);
    if (error) return setStatus({ kind: "error", message: error.message });
    await settle("Service deleted.");
  };

  return (
    <div className="flex flex-col gap-5">
      <Panel
        title="Add a service"
        description="It appears on the landing page, the services page and the quote form as soon as it is saved."
        actions={
          <Button variant={adding ? "secondary" : "primary"} onClick={() => setAdding((v) => !v)}>
            {adding ? (
              <>
                <X className="size-4" strokeWidth={2} />
                Cancel
              </>
            ) : (
              <>
                <Plus className="size-4" strokeWidth={2.2} />
                New service
              </>
            )}
          </Button>
        }
      >
        {adding && (
          <form onSubmit={create} className="flex flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Service name" required>
                <Input
                  required
                  value={draft.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setDraft((d) => ({
                      ...d,
                      title,
                      slug: slugTouched ? d.slug : slugify(title),
                    }));
                  }}
                  placeholder="Aerial Photography"
                />
              </Field>

              <Field label="Page address" hint="Used in the link to this service.">
                <Input
                  value={draft.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setDraft((d) => ({ ...d, slug: e.target.value }));
                  }}
                  placeholder="aerial-photography"
                />
              </Field>
            </div>

            <Field
              label="Description"
              hint="One short line. It sits under the name on a card that gets scanned, not read."
            >
              <TextArea
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                placeholder="High-resolution drone stills for brands, property and hospitality."
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-4">
              <Field label="Starting from (LKR)" hint="Leave blank for “On request”.">
                <Input
                  type="number"
                  min={0}
                  step={500}
                  inputMode="numeric"
                  value={draft.starting_price}
                  onChange={(e) => setDraft((d) => ({ ...d, starting_price: e.target.value }))}
                  placeholder="25000"
                />
              </Field>

              <Field label="Price qualifier" hint="Optional, e.g. “per visit”.">
                <Input
                  value={draft.price_note}
                  onChange={(e) => setDraft((d) => ({ ...d, price_note: e.target.value }))}
                  placeholder="per visit"
                />
              </Field>

              <Field label="Icon">
                <Select
                  value={draft.icon}
                  onChange={(e) => setDraft((d) => ({ ...d, icon: e.target.value }))}
                >
                  {serviceIconNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Group" hint="Which block of the services page it sits in.">
                <Select
                  value={draft.tier}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, tier: e.target.value as Draft["tier"] }))
                  }
                >
                  <option value="core">Photography, film & events</option>
                  <option value="specialist">Survey, mapping & inspection</option>
                </Select>
              </Field>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-void p-3 hairline">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-signal-soft text-signal">
                <ServiceIcon name={draft.icon} className="size-5" />
              </span>
              <p className="text-meta text-ink-muted">
                Shows as{" "}
                <strong className="text-ink">{draft.title || "Service name"}</strong> —{" "}
                {formatStartingPrice(
                  draft.starting_price === "" ? null : Number(draft.starting_price),
                  draft.price_note,
                )}
              </p>
            </div>

            <Button type="submit" busy={saving} className="self-start">
              Add service
            </Button>
          </form>
        )}
        <StatusLine status={status} />
      </Panel>

      {loading ? (
        <EmptyState>Loading…</EmptyState>
      ) : rows.length === 0 ? (
        <EmptyState>
          No services yet — the site is showing the list it ships with. Add one to take over.
        </EmptyState>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((row, index) => (
            <li key={row.id} className="card rounded-2xl p-4">
              {editingId === row.id ? (
                <ServiceEditor
                  row={row}
                  saving={saving}
                  onCancel={() => setEditingId(null)}
                  onSave={async (patch) => {
                    await update(row, patch);
                    setEditingId(null);
                  }}
                />
              ) : (
                <div className="flex flex-wrap items-center gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-signal-soft text-signal">
                    <ServiceIcon name={row.icon} className="size-5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 font-display text-title tracking-tight text-ink">
                      {row.title}
                      {!row.is_active && (
                        <span className="rounded-full bg-ink/[0.07] px-2 py-0.5 font-mono text-micro uppercase tracking-[0.14em] text-ink-dim">
                          hidden
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 truncate text-meta text-ink-muted">{row.description}</p>
                    <p className="mt-1 font-mono text-micro uppercase tracking-[0.16em] text-signal">
                      {formatStartingPrice(
                        row.starting_price === null ? null : Number(row.starting_price),
                        row.price_note,
                      )}
                      <span className="ml-3 text-ink-dim">
                        {row.tier === "core" ? "photography & film" : "survey & inspection"}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => void move(index, -1)}
                      disabled={index === 0}
                      aria-label="Move up"
                    >
                      <ArrowUp className="size-4" strokeWidth={2} />
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => void move(index, 1)}
                      disabled={index === rows.length - 1}
                      aria-label="Move down"
                    >
                      <ArrowDown className="size-4" strokeWidth={2} />
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => void update(row, { is_active: !row.is_active })}
                    >
                      {row.is_active ? (
                        <EyeOff className="size-4" strokeWidth={1.9} />
                      ) : (
                        <Eye className="size-4" strokeWidth={1.9} />
                      )}
                    </Button>
                    <Button variant="secondary" onClick={() => setEditingId(row.id)}>
                      Edit
                    </Button>
                    <ConfirmButton onConfirm={() => void remove(row)} />
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ServiceEditor({
  row,
  saving,
  onSave,
  onCancel,
}: {
  row: ServiceRow;
  saving: boolean;
  onSave: (patch: Partial<ServiceRow>) => void | Promise<void>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(row.title);
  const [description, setDescription] = useState(row.description);
  const [price, setPrice] = useState(row.starting_price === null ? "" : String(row.starting_price));
  const [note, setNote] = useState(row.price_note);
  const [icon, setIcon] = useState(row.icon);
  const [tier, setTier] = useState<"core" | "specialist">(row.tier);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void onSave({
          title: title.trim(),
          description: description.trim(),
          starting_price: price === "" ? null : Number(price),
          price_note: note.trim(),
          icon,
          tier,
        });
      }}
      className="flex flex-col gap-4"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Service name" required>
          <Input required value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field
          label="Page address"
          hint="Fixed once a service exists — changing it would break links already sent out."
        >
          <Input value={row.slug} readOnly disabled />
        </Field>
      </div>

      <Field label="Description">
        <TextArea value={description} onChange={(e) => setDescription(e.target.value)} />
      </Field>

      <div className="grid gap-4 md:grid-cols-4">
        <Field label="Starting from (LKR)" hint="Blank means “On request”.">
          <Input
            type="number"
            min={0}
            step={500}
            inputMode="numeric"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Field>
        <Field label="Price qualifier">
          <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="per visit" />
        </Field>
        <Field label="Icon">
          <Select value={icon} onChange={(e) => setIcon(e.target.value)}>
            {serviceIconNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Group">
          <Select
            value={tier}
            onChange={(e) => setTier(e.target.value as "core" | "specialist")}
          >
            <option value="core">Photography, film & events</option>
            <option value="specialist">Survey, mapping & inspection</option>
          </Select>
        </Field>
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" busy={saving}>
          Save changes
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
