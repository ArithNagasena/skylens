"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/primitives";
import { processSteps } from "@/content/company";

export function Process() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 22, restDelta: 0.001 });

  return (
    <section className="relative py-24 md:py-32">
      <div className="container-page">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="flex flex-col gap-6">
              <Eyebrow>How we work</Eyebrow>
              <h2 className="text-balance text-3xl leading-[1.06] sm:text-4xl md:text-[2.9rem]">
                Five stages, and none of them start with the drone.
              </h2>
              <p className="text-body leading-relaxed text-ink-muted">
                Most of the risk in aerial work is retired on the ground, before anyone drives to
                site. Airspace, weather modelling, ground control and a signed-off shot list are what
                make the flying day boring, which is exactly what you want it to be.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button href="/contact" arrow>
                  Start with a brief
                </Button>
                <Button href="/faq" variant="ghost">
                  Read the FAQ
                </Button>
              </div>
            </div>
          </div>

          <ol ref={ref} className="relative flex flex-col gap-10">
            {/* progress rail */}
            <div aria-hidden="true" className="absolute bottom-4 left-[1.4rem] top-4 w-px bg-ink/[0.12]">
              <motion.div
                style={{ scaleY, transformOrigin: "top" }}
                className="h-full w-full bg-gradient-to-b from-signal via-signal/60 to-transparent"
              />
            </div>

            {processSteps.map((step, i) => (
              <motion.li
                key={step.n}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex gap-6 pl-0"
              >
                <span className="relative z-10 mt-1 grid size-11 shrink-0 place-items-center rounded-full bg-raised font-mono text-meta font-medium tracking-wider text-signal shadow-[inset_0_0_0_1px_rgba(13,77,138,0.3)] transition-colors duration-500 group-hover:bg-signal group-hover:text-void">
                  {step.n}
                </span>

                <div className="flex flex-1 flex-col gap-3 pb-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="text-title tracking-tight">{step.title}</h3>
                    <span className="font-mono text-micro uppercase tracking-[0.18em] text-ink-dim">
                      {step.duration}
                    </span>
                  </div>
                  <p className="text-pretty text-body leading-relaxed text-ink-muted">{step.body}</p>
                  <ul className="flex flex-wrap gap-2 pt-1">
                    {step.outputs.map((o) => (
                      <li
                        key={o}
                        className="rounded-full bg-obsidian px-3 py-1 font-mono text-micro uppercase tracking-[0.14em] text-ink-muted shadow-[inset_0_0_0_1px_rgba(17,23,34,0.09)]"
                      >
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
