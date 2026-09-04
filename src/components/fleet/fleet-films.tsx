"use client";

import Image from "next/image";
import { Film } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { fleetFilms } from "@/content/fleet";

/**
 * Three video slots, one filled.
 *
 * The two empty ones render as deliberate reserved frames rather than being
 * hidden, because the client asked for the space to be held while the footage
 * is produced. Adding a path in `fleetFilms` turns a placeholder into a player
 * with no other change — see the note in src/content/fleet.ts.
 *
 * Players here carry `controls` and no autoplay: three clips starting at once
 * would fight each other and cost a visitor several megabytes unasked.
 */
export function FleetFilms() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {fleetFilms.map((film, i) => (
        <Reveal key={film.title} delay={Math.min(i * 0.08, 0.24)}>
          <figure className="flex h-full flex-col gap-3">
            {film.src ? (
              <div className="card relative aspect-video w-full overflow-hidden rounded-xl bg-obsidian">
                <video
                  className="absolute inset-0 size-full object-cover"
                  controls
                  preload="none"
                  playsInline
                  poster={film.poster}
                >
                  <source src={film.src} type="video/mp4" />
                  Your browser cannot play this video.
                </video>
              </div>
            ) : (
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-obsidian ring-1 ring-inset ring-ink/[0.12]">
                <Image
                  src={film.poster}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover opacity-25 grayscale"
                />
                <div className="absolute inset-0 grid place-items-center">
                  <span className="flex flex-col items-center gap-2 text-center">
                    <span className="grid size-11 place-items-center rounded-full bg-signal-soft text-signal">
                      <Film className="size-5" strokeWidth={1.6} />
                    </span>
                    <span className="font-mono text-micro uppercase tracking-[0.2em] text-ink-dim">
                      Film in production
                    </span>
                  </span>
                </div>
              </div>
            )}

            <figcaption className="flex flex-col gap-0.5 px-0.5">
              <span className="font-display text-meta font-medium tracking-tight text-ink">
                {film.title}
              </span>
              <span className="font-mono text-micro uppercase tracking-[0.16em] text-ink-dim">
                {film.caption}
              </span>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}
