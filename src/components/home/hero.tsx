"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

import { Button } from "@/components/ui/button";
import { Viewfinder } from "@/components/home/viewfinder";
import { RevealWords } from "@/components/ui/reveal";
import { TerrainField } from "@/components/visuals/terrain-field";
import { Aurora, GridBackdrop } from "@/components/visuals/atmosphere";
import { heroStats } from "@/content/site";
import { heroFrames, type MediaFrame } from "@/content/media";

/**
 * The landing-page hero. `frames` are the photographs that rotate inside the
 * viewfinder panel, managed at /admin/hero and resolved by the page above so
 * this client component never has to fetch them itself.
 */
export function Hero({ frames = heroFrames }: { frames?: MediaFrame[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]), {
    stiffness: 90,
    damping: 24,
  });
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden pb-20 pt-24 md:pb-28 md:pt-28">
      {/* ---------------------------------------------------------- backdrop */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-[0.55]">
          <TerrainField seed={9021} hue={211} rings={10} chrome={false} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-void via-void/80 to-void" />
        <GridBackdrop />
        <Aurora />
      </div>

      <div className="container-page">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          {/* ------------------------------------------------------- copy */}
          <motion.div style={{ y, opacity: fade }} className="flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-micro uppercase tracking-[0.22em] text-ink-muted"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-signal/10 px-3 py-1.5 text-signal ring-1 ring-inset ring-signal/20">
                <span className="animate-blink size-1.5 rounded-full bg-signal" />
                CAASL registered operator
              </span>
              <span>Colombo, Sri Lanka</span>
            </motion.div>

            <h1 className="font-display text-[2.9rem] leading-[0.98] tracking-[-0.022em] sm:text-[3.5rem] lg:text-[4.1rem]">
              <RevealWords text="See what the" />
              <br className="hidden sm:block" />
              <RevealWords text="ground can't tell you." delay={0.18} gradient={true} />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl text-pretty text-body leading-relaxed text-ink-muted md:text-lead"
            >
              Sky Lens provides professional drone photography and cinematic aerial videography
              services across Sri Lanka, capturing stunning moments from the sky.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-3"
            >
              <Button href="/contact" size="lg" arrow>
                Request a quote
              </Button>
              <Button href="/work" size="lg" variant="secondary">
                See selected work
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="font-mono text-micro uppercase tracking-[0.18em] text-ink-dim"
            >
              Fixed quotes · CAASL approvals handled · Weather reschedules free
            </motion.p>
          </motion.div>

          {/* -------------------------------------------------- viewfinder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <Viewfinder frames={frames} />
          </motion.div>
        </div>

        {/* ------------------------------------------------------- stat bar */}
        <motion.dl
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="card elev-1 mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-ink/[0.1] sm:grid-cols-3 md:mt-20"
        >
          {heroStats.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center gap-1 bg-raised px-5 py-6">
              <dd className="order-1 font-display text-2xl tracking-tight text-ink md:text-3xl">
                {s.value}
              </dd>
              <dt className="order-2 font-display text-meta font-medium text-ink">{s.label}</dt>
              <dd className="order-3 font-mono text-micro uppercase tracking-[0.16em] text-ink-dim">
                {s.detail}
              </dd>
            </div>
          ))}
        </motion.dl>

      </div>
    </section>
  );
}
