"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { RevealWords } from "@/components/ui/reveal";

/**
 * The services page opener.
 *
 * It replaces the shared `PageHero`, which put this page on the same light,
 * text-only template as Privacy and Terms — fine for a legal page, wrong for
 * the page a visitor lands on to decide whether to hire a film crew. The job
 * here is to say "professional drone services" in the first second, visually,
 * before anyone reads a word.
 *
 * How it does that:
 *   · full-bleed aerial photography under a deep navy scrim, so the type stays
 *     readable while the image still carries the mood;
 *   · a slow Ken Burns push plus a parallax drift on scroll, which reads as
 *     footage rather than a static banner;
 *   · a crossfade between two frames on a long cycle, so the page is never
 *     quite the same twice;
 *   · an explicit scroll cue to the priced service cards below.
 *
 * Every motion effect is disabled under `prefers-reduced-motion`, and the
 * whole thing is CSS/transform-only — no layout thrash while scrolling.
 */

/** Swap in a muted, silent H.264 loop to run footage instead of the stills. */
const heroVideo: string | null = null;

const frames = [
  { src: "/images/dji-banner.jpg", alt: "Aerial view of Sigiriya rock fortress at sunrise" },
  { src: "/images/hero-feed.jpg", alt: "Aerial view of a south coast bay and coastal road" },
];

const marks = [
  "Aerial photography",
  "Cinematic film",
  "Weddings & events",
  "Survey & mapping",
  "Inspection",
  "Heavy lift",
];


/**
 * The crossfade needs its other frames eventually, not immediately.
 *
 * Mounting them all at once meant a full-bleed hero fetched two or three
 * 100vw images before it could paint one, which is most of the delay you feel
 * when a nav link is clicked. The first frame is the only one on screen for
 * the first several seconds, so the rest mount shortly after — long before the
 * dissolve reaches them.
 */
function useDeferredFrames(delay = 1200) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return ready;
}

export function ServicesHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const framesReady = useDeferredFrames();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Background drifts slower than the page; copy lifts and fades away.
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const copyFade = useTransform(scrollYProgress, [0, 0.75], [1, reduce ? 1 : 0]);

  return (
    <section
      ref={ref}
      className="on-deep relative isolate flex min-h-[74vh] items-center overflow-hidden py-24 md:min-h-[80vh] md:py-28"
    >
      {/* ------------------------------------------------------- background */}
      <motion.div style={{ y: bgY }} aria-hidden="true" className="absolute inset-0 -z-20 scale-110">
        {heroVideo ? (
          <video
            className="size-full object-cover"
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
            {framesReady && (
              <Image src={frames[1].src} alt="" fill sizes="100vw" className="object-cover" />
            )}
            <Image
              src={frames[0].src}
              alt=""
              fill
              priority
              sizes="100vw"
              className="animate-hero-dissolve animate-slow-push object-cover"
            />
          </>
        )}
      </motion.div>

      {/* Scrims. Two of them: a vertical one so the copy has a ground, and a
          left-weighted one so the type side stays dark whatever the photo does. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-deep/70 via-deep/38 to-deep/88"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-deep/72 via-deep/18 to-transparent"
      />

      {/* ------------------------------------------------------------- copy */}
      <motion.div style={{ y: copyY, opacity: copyFade }} className="container-page relative">
        <div className="flex max-w-3xl flex-col gap-6">
          <h1 className="font-display text-[2.5rem] leading-[1.0] tracking-[-0.03em] sm:text-[3.4rem] lg:text-[4.1rem]">
            <RevealWords text="Professional Drone Services" />
            <br className="hidden sm:block" />
            <RevealWords text="& Aerial Media" delay={0.16} gradient />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl text-pretty text-body leading-relaxed text-ink-muted md:text-lead"
          >
            Every service we fly, with a published starting price — from{" "}
            <span className="whitespace-nowrap text-ink">LKR 25,000</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.56, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-3"
          >
            {/* A plain anchor, so the browser's own smooth scrolling (set on
                <html> in globals.css) carries the visitor to the cards. */}
            <Link
              href="#services-pricing"
              className="group/btn relative inline-flex h-14 items-center justify-center gap-2 overflow-hidden rounded-full bg-brand px-8 text-body font-medium tracking-tight text-white ring-1 ring-inset ring-white/20 shadow-[0_10px_28px_-10px_rgba(26,111,196,0.6)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_14px_34px_-10px_rgba(26,111,196,0.75)] active:scale-[0.98]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover/btn:translate-x-full" />
              <span className="relative z-10">Explore Our Services</span>
              <ArrowDown
                className="relative z-10 size-4 transition-transform duration-300 group-hover/btn:translate-y-0.5"
                strokeWidth={2.2}
              />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-14 items-center gap-2 rounded-full bg-white/10 px-7 text-body font-medium text-ink ring-1 ring-inset ring-white/25 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:ring-white/40"
            >
              Request a quote
              <ArrowUpRight className="size-4" strokeWidth={2.2} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.9 }}
            className="mt-2 flex flex-col gap-4 border-t border-white/15 pt-6"
          >
            <ul className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
              {marks.map((m, i) => (
                <li
                  key={m}
                  className="flex items-center gap-2.5 font-mono text-micro uppercase tracking-[0.18em] text-ink-dim"
                >
                  {m}
                  {i < marks.length - 1 && (
                    <span aria-hidden="true" className="text-white/25">
                      /
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>

    </section>
  );
}
