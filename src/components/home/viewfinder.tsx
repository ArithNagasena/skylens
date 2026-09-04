"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { heroFrames, type MediaFrame } from "@/content/media";

/**
 * The hero panel: an aerial shot dressed as a live drone camera feed.
 *
 * The frames rotate automatically. Each is visible for ~4 s with a 1 s
 * crossfade — fast enough to feel like footage, slow enough to appreciate
 * each shot. The first frame is priority-loaded; the rest mount 800 ms
 * after the component mounts so they never delay the LCP image.
 *
 * They arrive as a prop, managed at /admin/hero. The component takes them
 * pre-resolved rather than fetching, because it is a client component sitting
 * at the top of the page — a fetch here would push the hero behind a network
 * round trip that the server has already made.
 */

/** Swap in a real telemetry read-out from a flight if you would rather. */
const hud = {
  format: "4K · 120 FPS",
  altitude: "AGL 122 M",
  coords: "5.9483° N  80.4716° E",
  satellites: "GPS 18",
  battery: "91%",
  timecode: "00:02:17",
};

/**
 * Drop a short, muted, silent loop at this path to use footage instead of the
 * stills — 8–15 seconds, H.264 MP4, ideally under about 4 MB. Set to `null`
 * to use the crossfading photographs.
 */
const heroVideo: string | null = null;

/** How long each frame stays fully visible (ms). */
const HOLD = 4000;
/** Crossfade duration (ms) — must match the CSS transition below. */
const FADE = 900;
/** Total interval between frame switches. */
const INTERVAL = HOLD + FADE;

export function Viewfinder({ frames = heroFrames }: { frames?: MediaFrame[] }) {
  const [current, setCurrent] = useState(0);
  const [next, setNext]       = useState<number | null>(null);
  const [fading, setFading]   = useState(false);
  const [ready, setReady]     = useState(false);

  // Mount additional frames after a short delay so LCP isn't blocked.
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 800);
    return () => clearTimeout(t);
  }, []);

  // Rotate frames.
  useEffect(() => {
    if (frames.length < 2) return;
    const id = setInterval(() => {
      const n = (current + 1) % frames.length;
      setNext(n);
      setFading(true);
      setTimeout(() => {
        setCurrent(n);
        setNext(null);
        setFading(false);
      }, FADE);
    }, INTERVAL);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  // Nothing to show. The content layer already falls back to the shipped
  // frames rather than returning an empty list, so this only fires if a caller
  // passes one explicitly — but `frames[current]` would throw, and the hero is
  // the worst place on the site for a render error.
  if (frames.length === 0) return null;

  return (
    <div className="elev-4 relative aspect-[4/3.2] w-full overflow-hidden rounded-3xl bg-deep hairline">
      {/* ---------------------------------------------------------- media */}
      {heroVideo ? (
        <video
          className="absolute inset-0 size-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={frames[0].src}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      ) : (
        <>
          {/* Base frame — always rendered. */}
          <Image
            src={frames[current].src}
            alt={frames[current].alt}
            fill
            priority={current === 0}
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="object-cover"
          />

          {/* Incoming frame — fades in on top, then becomes the base. */}
          {ready && next !== null && (
            <Image
              src={frames[next].src}
              alt={frames[next].alt}
              fill
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="object-cover"
              style={{
                opacity: fading ? 1 : 0,
                transition: `opacity ${FADE}ms cubic-bezier(0.4, 0, 0.2, 1)`,
              }}
            />
          )}

          {/* Preload the remaining frames silently once the first has painted. */}
          {ready && frames.slice(1).map((f) => (
            <Image
              key={f.src}
              src={f.src}
              alt=""
              fill
              sizes="1px"
              aria-hidden
              className="invisible absolute opacity-0 pointer-events-none"
            />
          ))}
        </>
      )}

      {/* ------------------------------------------------------ hud layer */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* Legibility scrims */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-deep/75 via-deep/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-deep/80 via-deep/30 to-transparent" />

        {/* Framing brackets */}
        <div className="absolute inset-3.5 md:inset-4">
          <Bracket className="left-0 top-0 border-l-2 border-t-2" />
          <Bracket className="right-0 top-0 border-r-2 border-t-2" />
          <Bracket className="bottom-0 left-0 border-b-2 border-l-2" />
          <Bracket className="bottom-0 right-0 border-b-2 border-r-2" />
        </div>

        {/* Centre reticle */}
        <div className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_1px_2px_rgba(11,37,64,0.9)]">
          <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-white/90" />
          <span className="absolute bottom-0 left-1/2 h-3 w-px -translate-x-1/2 bg-white/90" />
          <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-white/90" />
          <span className="absolute right-0 top-1/2 h-px w-3 -translate-y-1/2 bg-white/90" />
          <span className="absolute left-1/2 top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90" />
        </div>

        {/* Top row — recording state and capture format */}
        <div className="absolute inset-x-6 top-10 flex items-center justify-between md:inset-x-7 md:top-11">
          <span className="inline-flex items-center gap-2">
            <span className="animate-blink size-1.5 rounded-full bg-signal-vivid shadow-[0_0_6px_var(--color-signal-vivid)]" />
            <Readout>REC {hud.timecode}</Readout>
          </span>
          <Readout>{hud.format}</Readout>
        </div>

        {/* Bottom row — position and aircraft state */}
        <div className="absolute inset-x-6 bottom-10 flex items-end justify-between gap-3 md:inset-x-7 md:bottom-11">
          <span className="flex flex-col gap-1">
            <Readout>{hud.coords}</Readout>
            <Readout className="text-white/70">{hud.altitude}</Readout>
          </span>
          <span className="flex shrink-0 items-center gap-3">
            <Readout className="text-white/70">{hud.satellites}</Readout>
            <span className="flex items-center gap-1.5">
              <span className="relative h-2.5 w-6 rounded-[2px] border border-white/75">
                <span className="absolute inset-[1.5px] right-1/4 rounded-[1px] bg-white/90" />
              </span>
              <Readout>{hud.battery}</Readout>
            </span>
          </span>
        </div>

        {/* Frame counter dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5 md:bottom-11">
          {frames.map((_, i) => (
            <span
              key={i}
              className="size-1 rounded-full transition-all duration-500"
              style={{ background: i === current ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)" }}
            />
          ))}
        </div>

        {/* Sensor scan line */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="animate-scan-y absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>
      </div>

      {/* Glass edge */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]" />
    </div>
  );
}

function Bracket({ className }: { className: string }) {
  return (
    <span
      className={`absolute size-5 border-white/85 drop-shadow-[0_1px_2px_rgba(11,37,64,0.8)] md:size-6 ${className}`}
    />
  );
}

function Readout({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={`font-mono text-micro uppercase tracking-[0.16em] text-white/85 [text-shadow:0_1px_2px_rgba(11,37,64,0.6)] md:text-micro ${className ?? ""}`}
    >
      {children}
    </span>
  );
}
