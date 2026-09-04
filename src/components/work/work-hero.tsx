"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * The Work page opener.
 *
 * It replaces the shared `PageHero`, which gave a portfolio the same
 * breadcrumb-and-paragraph treatment as the Terms page. For a page whose whole
 * argument is "look at what we shot", the picture has to be the argument — so
 * the frame runs full bleed and the copy is four short lines centred over it.
 *
 * Motion is layered so a still photograph reads as footage: a slow Ken Burns
 * push, a long crossfade between three frames, and a parallax drift as the
 * page scrolls. All of it is transform/opacity only, and all of it stops under
 * `prefers-reduced-motion`.
 *
 * Scope: this component is the entire change to the Work page. The filter,
 * the project grid and the closing banner below it are untouched.
 */

/** Drop a muted, silent H.264 loop here to run footage instead of the stills. */
const heroVideo: string | null = null;

const frames = [
  { src: "/images/work-hero/frame-1.jpg", alt: "Aerial view of a south coast bay at sunrise" },
  { src: "/images/work-hero/frame-2.jpg", alt: "Cinematic aerial of a coastline at sunset" },
  { src: "/images/work-hero/frame-3.jpg", alt: "Aerial detail of a headland and beach road" },
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

export function WorkHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const framesReady = useDeferredFrames();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "20%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -70]);
  const copyFade = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0]);

  return (
    <section
      ref={ref}
      className="on-deep relative isolate flex min-h-[80vh] items-center justify-center overflow-hidden py-28 md:min-h-[88vh] md:py-32"
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
            {/* Bottom frame always painted; the two above it dissolve in turn,
                which gives a three-way crossfade with no JavaScript. */}
            {framesReady && (
              <>
                <Image src={frames[2].src} alt="" fill sizes="100vw" className="object-cover" />
                <Image
                  src={frames[1].src}
                  alt=""
                  fill
                  sizes="100vw"
                  className="animate-hero-dissolve-b object-cover"
                />
              </>
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

      {/* A softer scrim than the services hero: the copy here is four short
          lines, so the photograph can carry far more of the frame. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-deep/70 via-deep/35 to-deep/80"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_65%_55%_at_50%_50%,rgba(11,37,64,0.70),transparent_78%)]"
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
            Our Work
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[2.8rem] leading-[1.02] tracking-[-0.028em] text-ink sm:text-6xl lg:text-[4.6rem]"
          >
            Captured From Above.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl text-pretty text-body leading-relaxed text-ink-muted md:text-lead"
          >
            Explore our aerial photography, cinematic videography and drone productions across Sri
            Lanka.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.58, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="pt-2"
          >
            {/* A plain anchor: `scroll-behavior: smooth` on <html> does the
                easing, so no scroll handler is needed and it still works with
                JavaScript disabled. */}
            <Link
              href="#projects"
              className="group/cta inline-flex items-center gap-2.5 rounded-full bg-white/10 px-6 py-3 text-body font-medium text-ink ring-1 ring-inset ring-white/25 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:ring-white/40"
            >
              Explore Projects
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
