"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ProjectShowcaseCard } from "@/components/work/project-showcase-card";
import { workCategories, type WorkCard } from "@/lib/cms/work-card";
import { cn } from "@/lib/utils";

/**
 * The filterable project grid.
 *
 * Takes already-resolved cards rather than reading content itself, because the
 * list is a mix of the shipped case studies and whatever has been added in the
 * admin panel — which only the server can see. The chips are derived from the
 * cards for the same reason: a fixed category list would go stale the first
 * time someone adds a project in a category nobody thought of.
 */
export function WorkGallery({ projects }: { projects: WorkCard[] }) {
  const [filter, setFilter] = useState<string>("All");

  const categories = useMemo(() => workCategories(projects), [projects]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: projects.length };
    for (const p of projects) map[p.category] = (map[p.category] ?? 0) + 1;
    return map;
  }, [projects]);

  const visible = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div className="flex flex-col gap-10">
      <div
        role="tablist"
        aria-label="Filter projects by category"
        className="flex flex-wrap items-center gap-2"
      >
        {categories.map((c) => {
          const active = filter === c;
          return (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(c)}
              className={cn(
                "group relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-meta font-medium transition-all duration-300",
                active
                  ? "bg-brand text-white shadow-[0_8px_20px_-8px_rgba(26,111,196,0.5)]"
                  : "bg-ink/[0.06] text-ink-muted hairline hover:bg-ink/[0.12] hover:text-ink",
              )}
            >
              {c}
              <span
                className={cn(
                  "font-mono text-micro tabular-nums",
                  active ? "text-void/80" : "text-ink-dim",
                )}
              >
                {counts[c] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      <motion.div layout className="grid auto-rows-fr gap-5 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((p, idx) => (
            <motion.div
              key={p.key}
              layout
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProjectShowcaseCard project={p} priority={idx < 3} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <p aria-live="polite" className="font-mono text-micro uppercase tracking-[0.18em] text-ink-dim">
        Showing {visible.length} of {projects.length} projects
      </p>
    </div>
  );
}
