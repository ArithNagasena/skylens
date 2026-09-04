import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "beacon";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium tracking-tight transition-[transform,background-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  // One fill, one label colour, on every surface. `brand` and `white` are
  // both fixed values rather than theme tokens that `.on-deep` re-points, so
  // this button looks identical in the header, on the light page and inside a
  // dark band. The inset ring does nothing on a light ground and gives the
  // button an edge against the deep navy.
  primary:
    "bg-brand text-white ring-1 ring-inset ring-white/20 hover:brightness-110 shadow-[0_8px_20px_-8px_rgba(26,111,196,0.55)] hover:shadow-[0_12px_28px_-8px_rgba(26,111,196,0.7)]",
  // On white, a secondary button needs a real border and a lift to be seen at
  // all — a 4% ink tint reads as nothing.
  // Ring colours come from the theme variables so this variant also works
  // inside `.on-deep`, where it becomes a light outline on the dark ground.
  // `ring-ink/25` flips with the scope: dark on the light page, light inside
  // `.on-deep`. The old hairline was 14% white on dark, which left this button
  // reading as navy on navy.
  secondary:
    "bg-raised text-ink ring-1 ring-inset ring-ink/25 shadow-[var(--shadow-e1)] hover:bg-obsidian hover:ring-ink/40 hover:shadow-[var(--shadow-e2)]",
  ghost: "text-ink-muted hover:text-ink hover:bg-ink/[0.06]",
  beacon: "bg-beacon text-void hover:brightness-110 shadow-[0_8px_20px_-8px_rgba(10,111,184,0.45)]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-meta",
  md: "h-11 px-6 text-meta",
  lg: "h-14 px-8 text-body",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  /** Appends the diagonal arrow that animates on hover */
  arrow?: boolean;
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  arrow,
  ...rest
}: CommonProps & { href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      <Sheen variant={variant} />
      <span className="relative z-10">{children}</span>
      {arrow && (
        <ArrowUpRight
          className="relative z-10 size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
          strokeWidth={2.2}
        />
      )}
    </Link>
  );
}

export function ActionButton({
  variant = "primary",
  size = "md",
  className,
  children,
  arrow,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      <Sheen variant={variant} />
      <span className="relative z-10">{children}</span>
      {arrow && (
        <ArrowUpRight
          className="relative z-10 size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
          strokeWidth={2.2}
        />
      )}
    </button>
  );
}

function Sheen({ variant }: { variant: Variant }) {
  // A white wipe is invisible on the light-surface variants.
  if (variant === "ghost" || variant === "secondary") return null;
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover/btn:translate-x-full"
    />
  );
}
