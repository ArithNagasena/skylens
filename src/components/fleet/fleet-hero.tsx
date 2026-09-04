"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { fleetFilms } from "@/content/fleet";

/**
 * The Fleet page opener: the DJI Air 3S introduction clip, full bleed.
 *
 * The video is the argument here — a fleet page that leads with a paragraph is
 * asking people to take the aircraft on trust. It autoplays muted and looped,
 * which is the only combination browsers will start without a user gesture,
 * and it carries a poster so the frame is never empty while the file loads.
 *
 * `prefers-reduced-motion` gets the poster image and no playback at all, and
 * the parallax is disabled with it.
 */
export function FleetHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "16%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const copyFade = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0]);

  const film = fleetFilms[0];

  return (
    <section
      ref={ref}
      className="on-deep relative isolate flex min-h-[76vh] items-center justify-center overflow-hidden py-24 md:min-h-[84vh] md:py-28"
    >
      {/* ------------------------------------------------------- background */}
      <motion.div style={{ y: bgY }} aria-hidden="true" className="absolute inset-0 -z-20 scale-110">
        {reduce ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={film.poster} alt="" className="size-full object-cover" />
        ) : (
          <video
            className="size-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={film.poster}
          >
            <source src={film.src} type="video/mp4" />
          </video>
        )}
      </motion.div>

      {/* Scrims: a vertical one for the copy, and a centre wash so the type
          stays readable wherever the footage happens to be bright. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-deep/75 via-deep/40 to-deep/85"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_65%_55%_at_50%_50%,rgba(11,37,64,0.62),transparent_78%)]"
      />

      {/* ------------------------------------------------------------- copy */}
      <motion.div style={{ y: copyY, opacity: copyFade }} className="container-page relative">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center [text-shadow:0_2px_12px_rgba(11,37,64,0.55)]">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-micro uppercase tracking-[0.34em] text-ink-muted"
          >
            Our Fleet
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[2.6rem] leading-[1.02] tracking-[-0.028em] text-ink sm:text-6xl lg:text-[4.4rem]"
          >
            The aircraft behind the work.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl text-pretty text-body leading-relaxed text-ink-muted md:text-lead"
          >
            Two aircraft, owned outright and maintained in-house — a cinema platform for the camera
            work and a heavy-lift airframe for everything a camera drone cannot carry.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.58, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="pt-2"
          >
            <Link
              href="#aircraft"
              className="group/cta inline-flex items-center gap-2.5 rounded-full bg-white/10 px-6 py-3 text-body font-medium text-ink ring-1 ring-inset ring-white/25 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:ring-white/40"
            >
              Explore the fleet
              <ArrowDown
                className="size-4 transition-transform duration-500 group-hover/cta:translate-y-1"
                strokeWidth={2.2}
              />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
