import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Chip, CornerTicks } from "@/components/ui/primitives";
import { TerrainField } from "@/components/visuals/terrain-field";
import { ScanBeam } from "@/components/visuals/atmosphere";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/utils";

export function ProjectCard({
  project,
  className,
  size = "md",
}: {
  project: Project;
  className?: string;
  size?: "md" | "lg";
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className={cn(
        "card card-interactive group relative flex h-full flex-col overflow-hidden rounded-2xl",
        className,
      )}
    >
      <div className={cn("relative overflow-hidden", size === "lg" ? "aspect-[16/10]" : "aspect-[16/11]")}>
        <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]">
          <TerrainField seed={project.seed} hue={project.hue} rings={11} />
        </div>
        <ScanBeam className="opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/25 to-transparent" />

        <div className="absolute inset-0 flex items-start justify-between p-4">
          <Chip tone="signal">{project.category}</Chip>
          <span className="rounded-full bg-raised/85 px-2.5 py-1 font-mono text-micro uppercase tracking-[0.16em] text-ink-muted shadow-[inset_0_0_0_1px_rgba(17,23,34,0.1)] backdrop-blur-sm">
            {project.year}
          </span>
        </div>

        <CornerTicks className="inset-4" />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <span className="font-mono text-micro uppercase tracking-[0.2em] text-signal">
          {project.client}
        </span>

        <h3
          className={cn(
            "tracking-tight transition-colors duration-300 group-hover:text-signal",
            size === "lg" ? "text-2xl" : "text-title",
          )}
        >
          {project.title}
        </h3>

        <p className="text-pretty text-body leading-relaxed text-ink-muted">{project.excerpt}</p>

        <div className="mt-auto flex items-end justify-between gap-4 pt-5">
          <dl className="flex flex-wrap gap-x-6 gap-y-2">
            {project.results.slice(0, size === "lg" ? 3 : 2).map((r) => (
              <div key={r.label} className="flex flex-col">
                <dt className="sr-only">{r.label}</dt>
                <dd className="font-display text-lead tracking-tight text-ink">{r.metric}</dd>
                <span className="font-mono text-micro uppercase tracking-[0.14em] text-ink-dim">
                  {r.label}
                </span>
              </div>
            ))}
          </dl>
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink/[0.06] text-ink-muted transition-all duration-500 group-hover:bg-signal group-hover:text-void">
            <ArrowUpRight className="size-4" strokeWidth={2} />
          </span>
        </div>
      </div>
    </Link>
  );
}
