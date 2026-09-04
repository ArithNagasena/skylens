"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Play, Tag } from "lucide-react";
import type { WorkCard } from "@/lib/cms/work-card";
import { cn } from "@/lib/utils";

/**
 * A project, as a self-contained card: frames you can page through, the name,
 * where it was shot, one line about it, and a way straight to the film.
 *
 * The card is deliberately NOT one big link. It holds several separate
 * controls — the carousel arrows and the video button — and nesting those
 * inside an outer anchor is invalid markup that also breaks keyboard
 * navigation. The title carries the link to the full case study, which is what
 * keeps those eleven pages reachable and indexed now that the explicit
 * "Case study" button has gone.
 *
 * A project added through the admin panel has no case study behind it, so its
 * `href` is null and the title renders as plain text. That is the whole
 * difference between the two kinds of card — everything else on it comes from
 * the same fields.
 */
export function ProjectShowcaseCard({
  project: p,
  priority = false,
}: {
  project: WorkCard;
  /** Only the first row should pre-empt lazy loading. */
  priority?: boolean;
}) {
  const [i, setI] = useState(0);
  const count = p.images.length;

  /**
   * Which frames have a `src` yet.
   *
   * Mounting all three frames of every card meant /work requested 33 images to
   * show 11 — the other two per card were fully downloaded and then hidden
   * behind `opacity-0`. Only the visible frame loads now; hovering the card
   * warms the rest so paging through still feels instant.
   */
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0]));
  const warm = () => setLoaded(new Set(p.images.map((_, n) => n)));

  const go = (delta: number) => {
    const next = (i + delta + count) % count;
    setLoaded((prev) => new Set(prev).add(next));
    setI(next);
  };

  const show = (n: number) => {
    setLoaded((prev) => new Set(prev).add(n));
    setI(n);
  };

  return (
    <article
      onMouseEnter={warm}
      onFocus={warm}
      className="card card-interactive group flex h-full flex-col overflow-hidden rounded-2xl"
    >
      {/* ------------------------------------------------------- carousel */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-obsidian">
        {p.images.map((src, n) =>
          loaded.has(n) ? (
            <Image
              key={`${src}-${n}`}
              src={src}
              alt={`${p.title} — frame ${n + 1} of ${count}`}
              fill
              sizes="(min-width: 1280px) 30vw, (min-width: 768px) 50vw, 100vw"
              priority={priority && n === 0}
              className={cn(
                "object-cover transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                n === i ? "opacity-100" : "opacity-0",
              )}
            />
          ) : null,
        )}

        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep/55 via-transparent to-transparent" />

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={`Previous image of ${p.title}`}
              className="absolute left-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-deep/55 text-white opacity-80 backdrop-blur-sm transition-all hover:bg-deep/90 hover:opacity-100 focus-visible:opacity-100"
            >
              <ChevronLeft className="size-4" strokeWidth={2.2} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={`Next image of ${p.title}`}
              className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-deep/55 text-white opacity-80 backdrop-blur-sm transition-all hover:bg-deep/90 hover:opacity-100 focus-visible:opacity-100"
            >
              <ChevronRight className="size-4" strokeWidth={2.2} />
            </button>

            <span className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {p.images.map((src, n) => (
                <button
                  key={`${src}-${n}`}
                  type="button"
                  onClick={() => show(n)}
                  aria-label={`Show image ${n + 1} of ${count}`}
                  aria-current={n === i}
                  className={cn(
                    "size-1.5 rounded-full transition-all duration-300",
                    n === i ? "w-4 bg-white" : "bg-white/50 hover:bg-white/80",
                  )}
                />
              ))}
            </span>
          </>
        )}
      </div>

      {/* ----------------------------------------------------------- body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-title leading-snug tracking-tight text-ink">
          {p.href ? (
            <Link
              href={p.href}
              className="transition-colors hover:text-signal focus-visible:text-signal"
            >
              {p.title}
            </Link>
          ) : (
            p.title
          )}
        </h3>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-signal-soft px-2.5 py-1 font-mono text-micro uppercase tracking-[0.16em] text-signal">
            <Tag className="size-3" strokeWidth={2} />
            {p.category}
          </span>
          <span className="inline-flex items-center gap-1.5 text-meta text-ink-dim">
            <MapPin className="size-3.5 shrink-0 text-signal" strokeWidth={1.8} />
            {p.location}
          </span>
        </div>

        <p className="text-body leading-relaxed text-ink-muted">{p.excerpt}</p>

        {p.youtubeUrl && (
          <div className="mt-auto flex justify-center pt-3">
            <a
              href={p.youtubeUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-meta font-medium text-white transition-[filter] hover:brightness-110"
            >
              <Play className="size-3.5 fill-current" strokeWidth={0} />
              Watch the project
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
