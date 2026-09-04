import Link from "next/link";
import Image from "next/image";
import { brand } from "@/content/brand";
import { cn } from "@/lib/utils";

/**
 * Fallback mark: an aperture iris framed by four rotor arcs.
 * Used until the master artwork is processed by `npm run brand`.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden="true" fill="none">
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M6.4 6.4a4.2 4.2 0 0 1 5.4-.5" opacity="0.55" />
        <path d="M25.6 6.4a4.2 4.2 0 0 0-5.4-.5" opacity="0.55" />
        <path d="M6.4 25.6a4.2 4.2 0 0 0 5.4.5" opacity="0.55" />
        <path d="M25.6 25.6a4.2 4.2 0 0 1-5.4.5" opacity="0.55" />
      </g>
      <circle cx="16" cy="16" r="8.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 7.6 A8.4 8.4 0 0 1 23.3 20.2 Z" fill="currentColor" opacity="0.9" />
      <circle cx="16" cy="16" r="2.1" fill="var(--color-void, #f5f8fc)" />
    </svg>
  );
}

/**
 * The header lockup. The supplied artwork stacks the mark above the wordmark,
 * which is too tall for a 40px header bar — so at this size we use the mark on
 * its own beside live text, and reserve the full stacked lockup for the footer.
 * `brand.mark` is cropped above the wordmark precisely so this pairing does not
 * print "SKY LENS" twice.
 */
export function Logo({
  className,
  markClassName,
  showWordmark = true,
  onDeep = false,
}: {
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
  /** Use the light-on-dark artwork, for the deep nav / footer surfaces. */
  onDeep?: boolean;
}) {
  const art = onDeep ? brand.markLight : brand.mark;
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5 text-ink transition-colors hover:text-signal",
        className,
      )}
      aria-label="Sky Lens — home"
    >
      {brand.hasCustomLogo ? (
        <Image
          src={art.src}
          width={168}
          height={85}
          alt=""
          priority
          className={cn("h-8 w-auto transition-transform duration-500 group-hover:scale-105", markClassName)}
        />
      ) : (
        <LogoMark
          className={cn(
            "size-8 text-signal transition-transform duration-700 group-hover:rotate-90",
            markClassName,
          )}
        />
      )}

      {showWordmark && (
        <span className="font-display text-lead font-semibold tracking-[-0.02em]">
          Sky<span className="text-signal">Lens</span>
        </span>
      )}
    </Link>
  );
}

/** The full stacked lockup, for the footer and anywhere with vertical room. */
export function LogoLockup({
  className,
  onDeep = false,
}: {
  className?: string;
  onDeep?: boolean;
}) {
  const art = onDeep ? brand.lockupLight : brand.lockup;

  if (!brand.hasCustomLogo) {
    return (
      <span className={cn("inline-flex items-center gap-2.5 text-ink", className)}>
        <LogoMark className="size-9 text-signal" />
        <span className="font-display text-title font-semibold tracking-[-0.02em]">
          Sky<span className="text-signal">Lens</span>
        </span>
      </span>
    );
  }

  return (
    <Image
      src={art.src}
      width={360}
      height={231}
      alt="Sky Lens"
      className={cn("h-auto w-[180px]", className)}
    />
  );
}
