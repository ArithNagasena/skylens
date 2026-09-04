"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * A silent, text-free video band.
 *
 * Deliberately lazy. The banner file is tens of megabytes, and it sits well
 * below the fold, so mounting it with a `src` on page load would make every
 * visitor pay for footage most of them never scroll to. Instead the element
 * starts with no source at all and only gets one when it comes within 300px of
 * the viewport — at which point it starts, muted and looping. Scrolling away
 * pauses it again rather than leaving it decoding off-screen.
 *
 * The poster paints immediately either way, so the band is never an empty box,
 * and `prefers-reduced-motion` gets the poster and nothing else.
 */
export function VideoBanner({
  src,
  poster,
  className,
  /** Described for assistive tech; nothing is drawn over the video. */
  label,
}: {
  src: string;
  poster: string;
  className?: string;
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(true);
        else el.pause();
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  // Once a source exists, start playback. Autoplay can still be refused (a
  // data-saver setting, say); the poster simply stays, which is fine.
  useEffect(() => {
    if (!active) return;
    ref.current?.play().catch(() => {});
  }, [active]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-obsidian",
        "shadow-[inset_0_0_0_1px_var(--border-hairline),var(--shadow-e2)]",
        className,
      )}
    >
      <video
        ref={ref}
        // No `src` until the observer fires — this is what defers the download.
        src={active && !reduce ? src : undefined}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        className="size-full object-cover"
      />
    </motion.div>
  );
}
