"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { useRef, useState } from "react";

import { latestWorkFrames, type MediaFrame } from "@/content/media";

/**
 * The horizontal strip of recent frames.
 *
 * `slides` are managed at /admin/latest-work and resolved by the page, so
 * adding a photograph there changes this strip without a deploy. The dots
 * track the scroll position rather than being hard-coded to the second slide,
 * which is what they did before and which was wrong the moment the list
 * stopped being exactly four images long.
 */
export function LatestWorkCarousel({ slides = latestWorkFrames }: { slides?: MediaFrame[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth > 768 ? window.innerWidth / 3 : window.innerWidth;
      scrollRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  // Which slide is under the left edge, derived from the scroll offset rather
  // than tracked separately — the strip is scrollable by touch and trackpad
  // too, so a counter incremented by the arrows alone would drift out of step.
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || slides.length === 0) return;
    const width = el.scrollWidth / slides.length;
    setActive(Math.min(slides.length - 1, Math.round(el.scrollLeft / width)));
  };

  if (slides.length === 0) return null;

  return (
    <section className="on-deep pt-20 md:pt-24 text-center pb-0 overflow-hidden">
      <div className="container-page mx-auto max-w-4xl px-4">
        <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-ink mb-6">
          Our Latest Work
        </h2>
        <p className="text-body md:text-lead text-ink-muted mb-8 leading-relaxed max-w-4xl mx-auto px-4 md:px-0">
          Villas along the south coast, hill-country resorts, construction programmes tracked month by
          month, and weddings from Galle Fort to Kandy. Every frame below was flown, graded and
          delivered by our own crew.
        </p>
        <Link 
          href="/work" 
          className="inline-flex items-center gap-2 rounded-full border border-ink/40 px-6 py-2.5 text-meta font-medium text-ink transition-colors hover:bg-ink hover:text-deep mb-16"
        >
          All Projects <ChevronsRight className="size-4" />
        </Link>
      </div>

      <div className="relative group w-full">
        {/* Carousel Container */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex w-full overflow-x-auto snap-x snap-mandatory h-[200px] md:h-[300px] lg:h-[350px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {slides.map((slide, i) => (
            <div key={`${slide.src}-${i}`} className="relative min-w-[100vw] md:min-w-[33.333vw] h-full snap-center shrink-0">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(min-width: 768px) 34vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Overlaid Arrows */}
        <button 
          onClick={() => scroll("left")}
          aria-label="Previous images"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/60 p-2 rounded-full backdrop-blur-sm transition-all z-10"
        >
          <ChevronLeft className="size-6" />
        </button>
        <button 
          onClick={() => scroll("right")}
          aria-label="Next images"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/60 p-2 rounded-full backdrop-blur-sm transition-all z-10"
        >
          <ChevronRight className="size-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === active ? "bg-white" : "bg-white/40"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
