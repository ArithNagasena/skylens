import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

/**
 * The "what we do" banner, sitting between the trust bar and the service grid.
 *
 * Modelled on the tourism-board banner the client supplied: a wide aerial with
 * a panel over one side carrying a headline, a two-column list of what the
 * studio actually shoots, and a single link out. It answers "can you shoot my
 * kind of thing?" in one glance, before the visitor reaches the service cards
 * where each answer costs a card to read.
 *
 * Two columns rather than one long list on purpose — eight items stacked reads
 * as a wall, eight in two fours reads as a menu.
 */
const WE_DO = [
  ["Luxury hotels", "Resorts & villas", "Real estate", "Weddings & events"],
  ["Tourism promotion", "Religious festivals", "Survey & mapping", "Heavy-lift & flower drops"],
];

export function WhatWeDo() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* -------------------------------------------------------- backdrop */}
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        <Image
          src="/images/what-we-do-banner.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Panel-side scrim so the list stays readable over the water, and a
          light vertical wash so the frame still reads as one image. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-deep/92 via-deep/70 to-deep/25 md:via-deep/45 md:to-transparent"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-deep/40 to-deep/60" />

      <div className="container-page relative py-16 md:py-20">
        <Reveal>
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 font-mono text-micro uppercase tracking-[0.22em] text-white ring-1 ring-inset ring-white/25 backdrop-blur-sm">
              <span className="animate-blink size-1.5 rounded-full bg-signal-vivid" />
              CAASL registered operator
            </span>

            <h2 className="mt-5 font-display text-[1.9rem] leading-[1.12] tracking-[-0.025em] text-white sm:text-[2.4rem] [text-shadow:0_2px_12px_rgba(11,37,64,0.6)]">
              Professional Drone Photography
              <br className="hidden sm:block" /> &amp; Video Production
            </h2>

            <div className="mt-7 flex flex-col gap-3">
              <span className="font-display text-title font-semibold tracking-tight text-white [text-shadow:0_2px_10px_rgba(11,37,64,0.6)]">
                We do:
              </span>

              <div className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
                {WE_DO.map((column, c) => (
                  <ul key={c} className="flex flex-col gap-2">
                    {column.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2.5 text-meta uppercase tracking-[0.08em] text-white/90 [text-shadow:0_1px_8px_rgba(11,37,64,0.7)]"
                      >
                        <span aria-hidden="true" className="h-px w-3 shrink-0 bg-signal-vivid" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>

            <Link
              href="/services"
              className="group/link mt-8 inline-flex items-center gap-3 border-b border-white/40 pb-2 font-display text-title tracking-tight text-white transition-colors hover:border-white"
            >
              Find out more
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover/link:translate-x-1"
                strokeWidth={2.2}
              />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
