"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { RevealWords } from "@/components/ui/reveal";

/**
 * The Request-a-Quote page opener.
 *
 * Shorter than the Work/Services/Fleet cinematic heroes (58vh rather than
 * 80–88vh) on purpose: unlike those pages, the useful content here — the
 * enquiry box — is the reason anyone lands on this page, so it should not
 * take a long scroll to reach. Same crossfade/parallax treatment as the other
 * heroes, at a size that respects that.
 */
function useDeferredFrame(delay = 1000) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return ready;
}

const frames = [
  { src: "/images/projects/expressway-3.jpg", alt: "" },
  { src: "/images/hero-feed.jpg", alt: "" },
];

export function QuoteHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const frameReady = useDeferredFrame();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "14%"]);

  return (
    <section
      ref={ref}
      className="on-deep relative isolate flex min-h-[52vh] items-center overflow-hidden py-20 md:min-h-[58vh] md:py-24"
    >
      <motion.div style={{ y: bgY }} aria-hidden="true" className="absolute inset-0 -z-20 scale-110">
        {frameReady && (
          <Image src={frames[1].src} alt="" fill sizes="100vw" className="object-cover" />
        )}
        <Image
          src={frames[0].src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="animate-hero-dissolve object-cover"
        />
      </motion.div>

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-deep/78 via-deep/45 to-deep/85"
      />

      <div className="container-page relative">
        <div className="flex max-w-2xl flex-col gap-5 [text-shadow:0_2px_12px_rgba(11,37,64,0.55)]">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-micro uppercase tracking-[0.3em] text-ink-muted"
          >
            Request a Quote
          </motion.span>

          <h1 className="font-display text-[2.3rem] leading-[1.05] tracking-[-0.026em] sm:text-5xl lg:text-[3.6rem]">
            <RevealWords text="Premium results." />
            <br />
            <RevealWords text="Honest pricing." delay={0.16} gradient />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-lg text-pretty text-body leading-relaxed text-ink-muted md:text-lead"
          >
            Pick what you need, fill in a few details, and get an instant estimate — before you ever
            pick up the phone.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.56, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="pt-1"
          >
            <Link
              href="#enquiry"
              className="group/cta inline-flex items-center gap-2.5 rounded-full bg-white/10 px-6 py-3 text-body font-medium text-ink ring-1 ring-inset ring-white/25 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:ring-white/40"
            >
              Start your enquiry
              <ArrowDown
                className="size-4 transition-transform duration-500 group-hover/cta:translate-y-1"
                strokeWidth={2.2}
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
