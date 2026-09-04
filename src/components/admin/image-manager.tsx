"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Upload } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { ACCEPTED_IMAGE_TYPES, removeImages, uploadImage } from "@/lib/admin/media";
import { revalidateSiteContent } from "@/lib/actions/revalidate";
import type { ImageRow } from "@/lib/supabase/types";
import {
  Button,
  ConfirmButton,
  EmptyState,
  Input,
  Panel,
  StatusLine,
  type Status,
} from "@/components/admin/ui";

/**
 * Add, describe, reorder, hide and delete the photographs in one section of
 * the site. Used by both the hero and the "Our Latest Work" strip, which are
 * the same job against two tables.
 *
 * Order is stored as a sparse `sort_order` (10, 20, 30 …) and the arrows swap
 * two neighbouring values. Sparse gaps mean a later insert between two rows
 * does not have to renumber the whole list, and swapping rather than
 * recomputing means a reorder is two updates regardless of how long the list
 * has grown.
 *
 * Hiding is kept separate from deleting because they are different intentions.
 * A seasonal shot taken off the hero in December is wanted back in June, and
 * the only way to get it back after a delete is to find the original file
 * again.
 */
export function ImageManager({
  table,
  folder,
  emptyHint,
}: {
  table: "hero_images" | "latest_work_images";
  /** Sub-folder inside the `media` bucket, so uploads stay sorted by purpose. */
  folder: string;
  emptyHint: string;
}) {
  const supabase = createClient();
  const fileInput = useRef<HTMLInputElement>(null);

  const [rows, setRows] = useState<ImageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("sort_order", { ascending: true })
      .returns<ImageRow[]>();

    if (error) setStatus({ kind: "error", message: error.message });
    setRows(data ?? []);
    setLoading(false);
  }, [supabase, table]);

  useEffect(() => {
    void load();
  }, [load]);

  /** Publishes the change to the live site, then refreshes this list. */
  const settle = async (message: string) => {
    await revalidateSiteContent();
    await load();
    setStatus({ kind: "ok", message });
  };

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setStatus(null);

    // Sequential rather than parallel: a phone on a Sri Lankan mobile
    // connection uploading six 12 MB photographs at once tends to have all six
    // time out instead of the first four succeeding.
    let next = (rows.at(-1)?.sort_order ?? 0) + 10;
    const failures: string[] = [];

    for (const file of Array.from(files)) {
      try {
        const { url, path } = await uploadImage(supabase, file, folder);
        const { error } = await supabase.from(table).insert({
          url,
          storage_path: path,
          // A filename is a poor alt text, but an empty one is worse, and it
          // at least tells the admin which row to rewrite.
          alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
          sort_order: next,
        });
        if (error) throw new Error(error.message);
        next += 10;
      } catch (err) {
        failures.push(`${file.name}: ${err instanceof Error ? err.message : "upload failed"}`);
      }
    }

    setUploading(false);
    if (fileInput.current) fileInput.current.value = "";

    await revalidateSiteContent();
    await load();

    setStatus(
      failures.length > 0
        ? { kind: "error", message: failures.join(" · ") }
        : { kind: "ok", message: `${files.length} image${files.length === 1 ? "" : "s"} added.` },
    );
  };

  const saveAlt = async (row: ImageRow, alt: string) => {
    if (alt === row.alt) return;
    const { error } = await supabase.from(table).update({ alt }).eq("id", row.id);
    if (error) return setStatus({ kind: "error", message: error.message });
    await settle("Description saved.");
  };

  const toggleActive = async (row: ImageRow) => {
    const { error } = await supabase
      .from(table)
      .update({ is_active: !row.is_active })
      .eq("id", row.id);
    if (error) return setStatus({ kind: "error", message: error.message });
    await settle(row.is_active ? "Image hidden from the site." : "Image is live again.");
  };

  const move = async (index: number, direction: -1 | 1) => {
    const a = rows[index];
    const b = rows[index + direction];
    if (!a || !b) return;

    const [first, second] = await Promise.all([
      supabase.from(table).update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from(table).update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);

    const error = first.error ?? second.error;
    if (error) return setStatus({ kind: "error", message: error.message });
    await settle("Order updated.");
  };

  const remove = async (row: ImageRow) => {
    const { error } = await supabase.from(table).delete().eq("id", row.id);
    if (error) return setStatus({ kind: "error", message: error.message });
    // The row is gone either way; the file is tidied up on a best-effort basis.
    await removeImages(supabase, [row.storage_path]);
    await settle("Image deleted.");
  };

  return (
    <div className="flex flex-col gap-5">
      <Panel
        title="Add photographs"
        description="JPEG, PNG, WebP or AVIF, up to 15 MB each. Landscape frames work best."
        actions={
          <Button busy={uploading} onClick={() => fileInput.current?.click()}>
            <Upload className="size-4" strokeWidth={2} />
            Choose images
          </Button>
        }
      >
        <input
          ref={fileInput}
          type="file"
          multiple
          accept={ACCEPTED_IMAGE_TYPES}
          className="sr-only"
          onChange={(e) => void onFiles(e.target.files)}
        />
        <StatusLine status={status} />
      </Panel>

      {loading ? (
        <EmptyState>Loading…</EmptyState>
      ) : rows.length === 0 ? (
        <EmptyState>{emptyHint}</EmptyState>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((row, index) => (
            <li key={row.id} className="card flex flex-col gap-4 rounded-2xl p-4 sm:flex-row">
              <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl bg-obsidian sm:w-52">
                <Image
                  src={row.url}
                  alt=""
                  fill
                  sizes="220px"
                  className={row.is_active ? "object-cover" : "object-cover opacity-40 grayscale"}
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-micro font-medium uppercase tracking-[0.14em] text-ink-dim">
                    Description (read aloud by screen readers, and shown if the image fails to load)
                  </span>
                  <Input
                    defaultValue={row.alt}
                    placeholder="Aerial view of a south coast villa at sunset"
                    onBlur={(e) => void saveAlt(row, e.target.value.trim())}
                  />
                </label>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => void move(index, -1)}
                    disabled={index === 0}
                    aria-label="Move earlier"
                  >
                    <ArrowUp className="size-4" strokeWidth={2} />
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => void move(index, 1)}
                    disabled={index === rows.length - 1}
                    aria-label="Move later"
                  >
                    <ArrowDown className="size-4" strokeWidth={2} />
                  </Button>
                  <Button variant="secondary" onClick={() => void toggleActive(row)}>
                    {row.is_active ? (
                      <>
                        <EyeOff className="size-4" strokeWidth={1.9} />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="size-4" strokeWidth={1.9} />
                        Show
                      </>
                    )}
                  </Button>
                  <ConfirmButton onConfirm={() => void remove(row)} className="ml-auto" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
