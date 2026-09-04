"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Plus } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { parseYouTubeId } from "@/lib/admin/documents";
import { revalidateSiteContent } from "@/lib/actions/revalidate";
import type { ShowreelVideoRow } from "@/lib/supabase/types";
import {
  Button,
  ConfirmButton,
  EmptyState,
  Field,
  Input,
  Panel,
  StatusLine,
  type Status,
} from "@/components/admin/ui";

/**
 * The four films under "Recently completed projects" on the landing page.
 *
 * The form takes any YouTube address a person is likely to have in their
 * clipboard — a watch URL, a `youtu.be` share link, an embed, a Short, or the
 * bare eleven-character id — and shows the thumbnail of whatever it resolved
 * to before it is saved. Pasting a link and finding out three days later that
 * the tracking parameters on the end broke it is the failure this avoids.
 *
 * Four is a soft cap, not a constraint: the page renders at most four, and the
 * form says so, but a fifth can be added and left inactive as next month's
 * replacement.
 */
const MAX_LIVE = 4;

export function VideoManager() {
  const supabase = createClient();

  const [rows, setRows] = useState<ShowreelVideoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");

  const parsed = parseYouTubeId(link);
  const liveCount = rows.filter((r) => r.is_active).length;

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("showreel_videos")
      .select("*")
      .order("sort_order", { ascending: true })
      .returns<ShowreelVideoRow[]>();

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

  const add = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!parsed) {
      return setStatus({ kind: "error", message: "That does not look like a YouTube link." });
    }
    if (rows.some((r) => r.youtube_id === parsed)) {
      return setStatus({ kind: "error", message: "That film is already in the list." });
    }

    setSaving(true);
    const { error } = await supabase.from("showreel_videos").insert({
      youtube_id: parsed,
      title: title.trim(),
      sort_order: (rows.at(-1)?.sort_order ?? 0) + 10,
      // A fifth film goes in switched off rather than silently never appearing.
      is_active: liveCount < MAX_LIVE,
    });
    setSaving(false);

    if (error) return setStatus({ kind: "error", message: error.message });

    setLink("");
    setTitle("");
    await settle(
      liveCount < MAX_LIVE
        ? "Film added to the landing page."
        : `Film added, but switched off — ${MAX_LIVE} are already live.`,
    );
  };

  const saveTitle = async (row: ShowreelVideoRow, value: string) => {
    if (value === row.title) return;
    const { error } = await supabase
      .from("showreel_videos")
      .update({ title: value })
      .eq("id", row.id);
    if (error) return setStatus({ kind: "error", message: error.message });
    await settle("Title saved.");
  };

  const toggleActive = async (row: ShowreelVideoRow) => {
    if (!row.is_active && liveCount >= MAX_LIVE) {
      return setStatus({
        kind: "error",
        message: `Only ${MAX_LIVE} films show on the page. Hide one first.`,
      });
    }
    const { error } = await supabase
      .from("showreel_videos")
      .update({ is_active: !row.is_active })
      .eq("id", row.id);
    if (error) return setStatus({ kind: "error", message: error.message });
    await settle(row.is_active ? "Film hidden." : "Film is live.");
  };

  const move = async (index: number, direction: -1 | 1) => {
    const a = rows[index];
    const b = rows[index + direction];
    if (!a || !b) return;

    const [first, second] = await Promise.all([
      supabase.from("showreel_videos").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("showreel_videos").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    const error = first.error ?? second.error;
    if (error) return setStatus({ kind: "error", message: error.message });
    await settle("Order updated.");
  };

  const remove = async (row: ShowreelVideoRow) => {
    const { error } = await supabase.from("showreel_videos").delete().eq("id", row.id);
    if (error) return setStatus({ kind: "error", message: error.message });
    await settle("Film removed.");
  };

  return (
    <div className="flex flex-col gap-5">
      <Panel title="Add a film" description={`${liveCount} of ${MAX_LIVE} showing on the landing page.`}>
        <form onSubmit={add} className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="YouTube link"
              required
              hint="A watch link, a share link, an embed or a Short — all work."
            >
              <Input
                required
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=…"
              />
            </Field>
            <Field
              label="Title"
              hint="Not shown on the page — YouTube draws its own. Read out by screen readers."
            >
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ella Ridge Resort brand film"
              />
            </Field>
          </div>

          {link && !parsed && (
            <p className="text-meta text-rose-700">
              No video id in that link. Copy the address straight from the YouTube page.
            </p>
          )}

          {parsed && (
            <div className="flex items-center gap-3 rounded-xl bg-void p-3 hairline">
              <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-lg bg-obsidian">
                <Image
                  src={`https://i.ytimg.com/vi/${parsed}/hqdefault.jpg`}
                  alt=""
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>
              <p className="text-meta text-ink-muted">
                Found video <code className="font-mono text-ink">{parsed}</code>. Check the
                thumbnail is the right film before adding it.
              </p>
            </div>
          )}

          <StatusLine status={status} />

          <Button type="submit" busy={saving} disabled={!parsed} className="self-start">
            <Plus className="size-4" strokeWidth={2.2} />
            Add film
          </Button>
        </form>
      </Panel>

      {loading ? (
        <EmptyState>Loading…</EmptyState>
      ) : rows.length === 0 ? (
        <EmptyState>
          No films yet. Until one is added, the landing page shows the sample videos that ship with
          the site — replace them, they are not Sky Lens footage.
        </EmptyState>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((row, index) => (
            <li key={row.id} className="card flex flex-col gap-4 rounded-2xl p-4 sm:flex-row">
              <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-obsidian sm:w-48">
                <Image
                  src={`https://i.ytimg.com/vi/${row.youtube_id}/hqdefault.jpg`}
                  alt=""
                  fill
                  sizes="200px"
                  className={row.is_active ? "object-cover" : "object-cover opacity-40 grayscale"}
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <Input
                  defaultValue={row.title}
                  placeholder="Film title"
                  onBlur={(e) => void saveTitle(row, e.target.value.trim())}
                />
                <a
                  href={`https://www.youtube.com/watch?v=${row.youtube_id}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-mono text-micro text-ink-dim underline underline-offset-4 hover:text-signal"
                >
                  youtube.com/watch?v={row.youtube_id}
                </a>

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
                  <ConfirmButton onConfirm={() => void remove(row)} label="Remove" className="ml-auto" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
