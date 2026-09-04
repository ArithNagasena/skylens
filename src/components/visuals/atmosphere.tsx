import { cn } from "@/lib/utils";

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")";

/**
 * Full-viewport film grain. Sits above content, ignores pointer events.
 * Kept deliberately light: on a white ground the same grain that read as
 * texture on black reads as a dirty grey cast.
 */
export function Grain({ opacity = 0.022 }: { opacity?: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70] mix-blend-soft-light"
      style={{ opacity, backgroundImage: NOISE }}
    />
  );
}

/** Soft atmospheric colour wash — the "high altitude haze" of the palette. */
export function Aurora({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div
        className="animate-drift absolute -top-[28rem] left-1/2 h-[52rem] w-[78rem] -translate-x-1/2 rounded-full blur-[140px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(43,130,216,0.24), rgba(13,77,138,0.13) 55%, transparent 78%)",
        }}
      />
      <div
        className="absolute -right-40 top-1/3 h-[34rem] w-[34rem] rounded-full blur-[130px]"
        style={{
          background: "radial-gradient(closest-side, rgba(58,157,224,0.15), transparent 72%)",
        }}
      />
      <div
        className="absolute -left-52 top-2/3 h-[32rem] w-[32rem] rounded-full blur-[130px]"
        style={{
          background: "radial-gradient(closest-side, rgba(26,60,104,0.16), transparent 72%)",
        }}
      />
    </div>
  );
}

/** The survey-plot grid backdrop, faded at the edges. */
export function GridBackdrop({ className, fine }: { className?: string; fine?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 mask-radial",
        fine ? "bg-grid-fine" : "bg-grid",
        className,
      )}
    />
  );
}

/** A single hairline that sweeps across a container, like a radar return. */
export function ScanBeam({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="animate-sweep absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-signal/[0.10] to-transparent" />
    </div>
  );
}

/** Horizon line with a subtle glow — used to close out large sections. */
export function HorizonRule({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("relative h-px w-full", className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-signal/25 to-transparent" />
      <div className="absolute inset-x-1/4 -top-px h-[3px] bg-gradient-to-r from-transparent via-signal/10 to-transparent blur-[2px]" />
    </div>
  );
}
