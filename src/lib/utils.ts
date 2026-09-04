import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge has to be told about the project's named type scale.
 *
 * `globals.css` defines `--text-micro / meta / body / lead / title`, which
 * Tailwind turns into font-size utilities. tailwind-merge does not read the
 * stylesheet, so out of the box it sees `text-meta`, fails to match it against
 * the built-in font sizes, and falls back to classifying it as a TEXT COLOUR.
 *
 * That made it strip genuine colour classes. The primary button, for example,
 * is composed as `cn(base, variants, sizes)` — the variant contributes
 * `text-white` and the size contributes `text-meta`, so the "colour" that came
 * later won and `text-white` was silently deleted. The button then inherited
 * the surrounding ink and rendered with near-black type on the brand blue.
 *
 * Registering the scale under `font-size` puts each name in the right group,
 * so a size and a colour can coexist. Add any new `--text-*` token here too.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["micro", "meta", "body", "lead", "title"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Deterministic PRNG so generated artwork is identical on server and client. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatDateShort(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Pseudo coordinates for the HUD chrome — stable per seed, purely decorative. */
export function hudCoords(seed: number) {
  const rnd = mulberry32(seed);
  const lat = (34 + rnd() * 12).toFixed(4);
  const lon = (-(100 + rnd() * 20)).toFixed(4);
  const alt = Math.round(60 + rnd() * 340);
  return { lat: `${lat}N`, lon: `${Math.abs(Number(lon)).toFixed(4)}W`, alt: `${alt}m AGL` };
}
