"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, Upload, X } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/admin/documents";
import { ACCEPTED_IMAGE_TYPES, removeImages, uploadImage } from "@/lib/admin/media";
import { revalidateSiteContent } from "@/lib/actions/revalidate";
import { projectCategories } from "@/content/projects";
import type { ProjectImage, ProjectRow } from "@/lib/supabase/types";
import {
  Button,
  ConfirmButton,
  EmptyState,
  Field,
  Input,
  Panel,
  StatusLine,
  TextArea,
  type Status,
} from "@/components/admin/ui";

/**
 * Portfolio projects — the cards on /work.
 *
 * A project here is the light version of the written-up case studies that ship
 * with the site: a name, a category, where it was shot, a line about it, some
 * frames and a film. That is exactly what the card renders, so nothing on the
 * form is collected and then never shown.
 *
 * Images upload as they are chosen rather than on save, so a slow upload does
 * not sit behind a Save button that looks stuck. The cost is that abandoning
 * the form would leave the files behind, which is why Cancel deletes anything
 * uploaded during that session.
 */

const CATEGORY_OPTIONS = projectCategories.filter((c) => c !== "All");

type Draft = {
  id: string | null;
  slug: string;
  title: string;
  category: string;
  location: string;
  description: string;
  youtube_url: string;
  images: ProjectImage[];
};

const emptyDraft: Draft = {
  id: null,
  slug: "",
  title: "",
  category: CATEGORY_OPTIONS[0] ?? "Tourism",
  location: "",
  description: "",
  youtube_url: "",
  images: [],
};

export function ProjectManager() {
  const supabase = createClient();
  const fileInput = useRef<HTMLInputElement>(null);

  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Status>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [draft, setDraft] = useState<Draft | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  /**
   * Files uploaded during this editing session. If the admin cancels, these
   * are removed from storage — they were never referenced by a saved row.
   */
  const [uploadedThisSession, setUploadedThisSession] = useState<string[]>([]);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .returns<ProjectRow[]>();

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

  const startNew = () => {
    setDraft({ ...emptyDraft });
    setSlugTouched(false);
    setUploadedThisSession([]);
    setStatus(null);
  };

  const startEdit = (row: ProjectRow) => {
    setDraft({
      id: row.id,
      slug: row.slug,
      title: row.title,
      category: row.category,
      location: row.location,
      description: row.description,
      youtube_url: row.youtube_url,
      images: row.images ?? [],
    });
    setSlugTouched(true);
    setUploadedThisSession([]);
    setStatus(null);
  };

  const cancel = async () => {
    // Anything uploaded and not saved is orphaned the moment the form closes.
    await removeImages(supabase, uploadedThisSession);
    setUploadedThisSession([]);
    setDraft(null);
  };

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0 || !draft) return;

    setUploading(true);
    const added: ProjectImage[] = [];
    const failures: string[] = [];

    for (const file of Array.from(files)) {
      try {
        const { url, path } = await uploadImage(supabase, file, "projects");
        added.push({ url, path, alt: "" });
      } catch (err) {
        failures.push(`${file.name}: ${err instanceof Error ? err.message : "upload failed"}`);
      }
    }

    setUploading(false);
    if (fileInput.current) fileInput.current.value = "";

    setDraft((d) => (d ? { ...d, images: [...d.images, ...added] } : d));
    setUploadedThisSession((prev) => [...prev, ...added.map((a) => a.path).filter(Boolean) as string[]]);

    if (failures.length > 0) setStatus({ kind: "error", message: failures.join(" · ") });
  };

  const dropImage = async (index: number) => {
    if (!draft) return;
    const image = draft.images[index];
    setDraft({ ...draft, images: draft.images.filter((_, i) => i !== index) });

    // Only delete the file outright if it was uploaded in this session. One
    // belonging to a saved project stays until the project itself is saved, so
    // a cancelled edit does not destroy an image the live site still uses.
    if (image?.path && uploadedThisSession.includes(image.path)) {
      await removeImages(supabase, [image.path]);
      setUploadedThisSession((prev) => prev.filter((p) => p !== image.path));
    }
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft) return;

    const slug = slugify(slugTouched && draft.slug ? draft.slug : draft.title);
    if (!draft.title.trim() || !slug) {
      return setStatus({ kind: "error", message: "A project needs a name." });
    }

    setSaving(true);
    const payload = {
      slug,
      title: draft.title.trim(),
      category: draft.category.trim() || "Tourism",
      location: draft.location.trim(),
      description: draft.description.trim(),
      youtube_url: draft.youtube_url.trim(),
      images: draft.images,
    };

    const { error } = draft.id
      ? await supabase.from("projects").update(payload).eq("id", draft.id)
      : await supabase
          .from("projects")
          .insert({ ...payload, sort_order: (rows.at(-1)?.sort_order ?? 0) + 10 });

    setSaving(false);

    if (error) {
      return setStatus({
        kind: "error",
        message: error.message.includes("duplicate")
          ? `There is already a project with the address “${slug}”.`
          : error.message,
      });
    }

    // Saved: the files are referenced by a row now, so they are no longer this
    // session's to clean up.
    setUploadedThisSession([]);
    setDraft(null);
    await settle(draft.id ? "Project saved." : "Project added to the work page.");
  };

  const move = async (index: number, direction: -1 | 1) => {
    const a = rows[index];
    const b = rows[index + direction];
    if (!a || !b) return;

    const [first, second] = await Promise.all([
      supabase.from("projects").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("projects").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    const error = first.error ?? second.error;
    if (error) return setStatus({ kind: "error", message: error.message });
    await settle("Order updated.");
  };

  const toggleActive = async (row: ProjectRow) => {
    const { error } = await supabase
      .from("projects")
      .update({ is_active: !row.is_active })
      .eq("id", row.id);
    if (error) return setStatus({ kind: "error", message: error.message });
    await settle(row.is_active ? "Project hidden." : "Project is live.");
  };

  const remove = async (row: ProjectRow) => {
    const { error } = await supabase.from("projects").delete().eq("id", row.id);
    if (error) return setStatus({ kind: "error", message: error.message });
    await removeImages(supabase, (row.images ?? []).map((img) => img.path));
    await settle("Project deleted.");
  };

  return (
    <div className="flex flex-col gap-5">
      <Panel
        title={draft?.id ? "Edit project" : "Add a project"}
        description="It appears as a card on the work page, filterable by its category."
        actions={
          draft ? (
            <Button variant="secondary" onClick={() => void cancel()}>
              <X className="size-4" strokeWidth={2} />
              Cancel
            </Button>
          ) : (
            <Button onClick={startNew}>
              <Plus className="size-4" strokeWidth={2.2} />
              New project
            </Button>
          )
        }
      >
        {draft && (
          <form onSubmit={save} className="flex flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Project name" required>
                <Input
                  required
                  value={draft.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setDraft((d) =>
                      d ? { ...d, title, slug: slugTouched ? d.slug : slugify(title) } : d,
                    );
                  }}
                  placeholder="South coast villa collection"
                />
              </Field>

              <Field label="Category" hint="Pick one, or type a new one to create it.">
                <Input
                  list="project-categories"
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                />
                <datalist id="project-categories">
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </Field>

              <Field label="Location">
                <Input
                  value={draft.location}
                  onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                  placeholder="Ahangama to Tangalle, Southern Province"
                />
              </Field>

              <Field label="YouTube link" hint="Optional. Adds a “Watch the project” button.">
                <Input
                  value={draft.youtube_url}
                  onChange={(e) => setDraft({ ...draft, youtube_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=…"
                />
              </Field>
            </div>

            <Field label="Short description" hint="One or two lines — this is the whole card.">
              <TextArea
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                placeholder="Eleven villas along ninety kilometres of coast, in a single six-day mobilisation."
              />
            </Field>

            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-meta font-medium text-ink">
                  Images{" "}
                  <span className="font-normal text-ink-dim">
                    — the card pages through them in this order
                  </span>
                </span>
                <Button variant="secondary" busy={uploading} onClick={() => fileInput.current?.click()}>
                  <Upload className="size-4" strokeWidth={2} />
                  Add images
                </Button>
              </div>

              <input
                ref={fileInput}
                type="file"
                multiple
                accept={ACCEPTED_IMAGE_TYPES}
                className="sr-only"
                onChange={(e) => void onFiles(e.target.files)}
              />

              {draft.images.length === 0 ? (
                <EmptyState>No images yet. A project card without one looks unfinished.</EmptyState>
              ) : (
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {draft.images.map((image, index) => (
                    <li
                      key={image.url}
                      className="relative aspect-[16/10] overflow-hidden rounded-xl bg-obsidian"
                    >
                      <Image src={image.url} alt="" fill sizes="200px" className="object-cover" />
                      <button
                        type="button"
                        onClick={() => void dropImage(index)}
                        aria-label={`Remove image ${index + 1}`}
                        className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-deep/70 text-white backdrop-blur-sm transition-colors hover:bg-deep"
                      >
                        <X className="size-4" strokeWidth={2.2} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <StatusLine status={status} />

            <div className="flex items-center gap-2">
              <Button type="submit" busy={saving}>
                {draft.id ? "Save changes" : "Add project"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => void cancel()}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {!draft && <StatusLine status={status} />}
      </Panel>

      {loading ? (
        <EmptyState>Loading…</EmptyState>
      ) : rows.length === 0 ? (
        <EmptyState>
          No projects added yet. The work page is showing the case studies that ship with the site —
          anything added here appears above them.
        </EmptyState>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((row, index) => (
            <li key={row.id} className="card flex flex-wrap items-center gap-4 rounded-2xl p-4">
              <div className="relative aspect-[16/10] w-32 shrink-0 overflow-hidden rounded-xl bg-obsidian">
                {row.images?.[0] ? (
                  <Image
                    src={row.images[0].url}
                    alt=""
                    fill
                    sizes="128px"
                    className={row.is_active ? "object-cover" : "object-cover opacity-40 grayscale"}
                  />
                ) : (
                  <span className="grid h-full place-items-center text-micro text-ink-dim">
                    no image
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 font-display text-title tracking-tight text-ink">
                  {row.title}
                  {!row.is_active && (
                    <span className="rounded-full bg-ink/[0.07] px-2 py-0.5 font-mono text-micro uppercase tracking-[0.14em] text-ink-dim">
                      hidden
                    </span>
                  )}
                </p>
                <p className="mt-0.5 font-mono text-micro uppercase tracking-[0.14em] text-signal">
                  {row.category}
                  {row.location && <span className="ml-3 text-ink-dim">{row.location}</span>}
                </p>
                <p className="mt-1 line-clamp-2 text-meta text-ink-muted">{row.description}</p>
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
                <Button variant="secondary" onClick={() => void toggleActive(row)}>
                  {row.is_active ? (
                    <EyeOff className="size-4" strokeWidth={1.9} />
                  ) : (
                    <Eye className="size-4" strokeWidth={1.9} />
                  )}
                </Button>
                <Button variant="secondary" onClick={() => startEdit(row)}>
                  Edit
                </Button>
                <ConfirmButton onConfirm={() => void remove(row)} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
