import Link from "next/link";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ Eyebrow */

export function Eyebrow({
  children,
  className,
  dot = true,
}: {
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-micro uppercase tracking-[0.24em] text-signal",
        className,
      )}
    >
      {dot && (
        <span className="relative flex size-1.5">
          <span className="animate-pulse-ring absolute inline-flex size-full rounded-full bg-signal" />
          <span className="relative inline-flex size-1.5 rounded-full bg-signal" />
        </span>
      )}
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------- Section */

export function Section({
  children,
  className,
  id,
  tight,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  tight?: boolean;
}) {
  return (
    <section id={id} className={cn("relative", tight ? "py-16 md:py-20" : "py-24 md:py-32", className)}>
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  className,
  action,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: string;
  align?: "left" | "center";
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        action && "md:flex-row md:items-end md:justify-between md:gap-12",
        className,
      )}
    >
      <div className={cn("flex flex-col gap-4", align === "center" ? "max-w-3xl" : "max-w-2xl")}>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 className="text-balance text-3xl leading-[1.08] sm:text-4xl md:text-[2.9rem]">{title}</h2>
        {lede && <p className="text-pretty text-body leading-relaxed text-ink-muted md:text-lead">{lede}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* --------------------------------------------------------------------- Chips */

export function Chip({
  children,
  className,
  tone = "neutral",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "neutral" | "signal" | "beacon" | "horizon";
}) {
  const tones = {
    neutral: "text-ink-muted bg-obsidian shadow-[inset_0_0_0_1px_rgba(17,23,34,0.12)]",
    signal: "text-signal bg-signal-soft shadow-[inset_0_0_0_1px_rgba(13,77,138,0.28)]",
    beacon: "text-beacon bg-beacon-soft shadow-[inset_0_0_0_1px_rgba(10,111,184,0.26)]",
    horizon: "text-horizon bg-horizon-soft shadow-[inset_0_0_0_1px_rgba(26,60,104,0.26)]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-micro uppercase tracking-[0.14em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------- Metrics */

export function Metric({
  value,
  label,
  detail,
  className,
}: {
  value: string;
  label: string;
  detail?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="font-display text-3xl tracking-tight text-ink md:text-[2.6rem] md:leading-none">
        {value}
      </span>
      {/* Display face, matching the hero stat bar: a stat tile set half in the
          display face and half in the body face reads as two components. */}
      <span className="font-display text-meta font-medium text-ink">{label}</span>
      {detail && <span className="font-mono text-micro uppercase tracking-[0.14em] text-ink-dim">{detail}</span>}
    </div>
  );
}

/* --------------------------------------------------------------------- Cards */

export function Panel({
  children,
  className,
  interactive,
}: {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "card relative overflow-hidden rounded-2xl",
        interactive && "card-interactive",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Corner ticks — the recurring "viewfinder" motif. */
export function CornerTicks({ className }: { className?: string }) {
  const c = "absolute size-3 border-signal/70";
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100", className)}>
      <span className={cn(c, "left-0 top-0 border-l border-t")} />
      <span className={cn(c, "right-0 top-0 border-r border-t")} />
      <span className={cn(c, "bottom-0 left-0 border-b border-l")} />
      <span className={cn(c, "bottom-0 right-0 border-b border-r")} />
    </div>
  );
}

/* -------------------------------------------------------------------- Arrows */

export function TextLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group/link inline-flex items-center gap-1.5 text-meta font-medium text-signal transition-colors hover:text-signal-deep",
        className,
      )}
    >
      {children}
      <span className="transition-transform duration-300 group-hover/link:translate-x-1">&rarr;</span>
    </Link>
  );
}

/** Monospaced key/value row used across spec tables. */
export function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-ink/[0.09] py-3 last:border-0">
      <span className="font-mono text-micro uppercase tracking-[0.16em] text-ink-dim">{label}</span>
      <span className="text-right text-meta font-medium text-ink">{value}</span>
    </div>
  );
}
