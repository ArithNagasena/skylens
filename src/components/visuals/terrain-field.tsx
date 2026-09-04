import { cn, mulberry32 } from "@/lib/utils";

type Props = {
  seed: number;
  hue?: number;
  className?: string;
  /** Number of contour rings drawn */
  rings?: number;
  /** Adds the survey grid + flight path chrome */
  chrome?: boolean;
  /** Adds a filled elevation ramp under the contours */
  filled?: boolean;
  /**
   * Which surface the plate is sitting on. "light" draws dark contours on a
   * white ground; "deep" draws bright contours on the dark anchor colour.
   */
  tone?: "light" | "deep";
};

const W = 480;
const H = 360;

type Harmonic = { freq: number; amp: number; phase: number };

/** Round to 1dp and drop a trailing ".0" — meaningful savings across ~20 plates a page. */
const n = (v: number) => {
  const r = Math.round(v * 10) / 10;
  return Number.isInteger(r) ? String(r) : r.toFixed(1);
};

function contourPath(
  cx: number,
  cy: number,
  radius: number,
  harmonics: Harmonic[],
  squash: number,
) {
  // Tessellate proportionally to circumference: tight inner rings need far
  // fewer segments than the outer ones to still read as smooth.
  const steps = Math.min(56, Math.max(20, Math.round(radius * 0.6)));
  let d = "";
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    let m = 1;
    for (const h of harmonics) m += h.amp * Math.sin(h.freq * t + h.phase);
    const r = radius * m;
    const x = cx + Math.cos(t) * r;
    const y = cy + Math.sin(t) * r * squash;
    d += `${i === 0 ? "M" : "L"}${n(x)} ${n(y)}`;
  }
  return `${d}Z`;
}

/**
 * Deterministic topographic artwork. Every project, service and post gets a
 * distinct-but-related "aerial survey" plate derived from its seed, which means
 * the site carries real visual identity without shipping a single photograph.
 */
export function TerrainField({
  seed,
  hue = 196,
  className,
  rings = 15,
  chrome = true,
  filled = true,
  tone = "light",
}: Props) {
  const rnd = mulberry32(seed);
  const uid = `tf${seed}`;

  const cx = W * (0.34 + rnd() * 0.34);
  const cy = H * (0.36 + rnd() * 0.3);
  const squash = 0.62 + rnd() * 0.22;
  const rotate = -18 + rnd() * 36;

  const harmonics: Harmonic[] = Array.from({ length: 4 }, (_, i) => ({
    freq: 2 + i + Math.floor(rnd() * 3),
    amp: (0.2 - i * 0.035) * (0.6 + rnd() * 0.8),
    phase: rnd() * Math.PI * 2,
  }));

  // Outermost ring always reaches roughly the same radius, so `rings` controls
  // contour *density* rather than how much of the frame gets covered. Without
  // this, a low ring count leaves the plate looking empty.
  const baseR = 24 + rnd() * 14;
  const outerR = 235 + rnd() * 55;
  const step = (outerR - baseR) / Math.max(1, rings - 1);

  const paths = Array.from({ length: rings }, (_, i) => {
    const r = baseR + i * step;
    // Higher rings wander a little more, like real terrain spreading out
    const local = harmonics.map((h) => ({ ...h, amp: h.amp * (1 + i * 0.045) }));
    return { d: contourPath(cx, cy, r, local, squash), i };
  });

  // A secondary, smaller massif for visual asymmetry
  const cx2 = W * (0.1 + rnd() * 0.8);
  const cy2 = H * (0.15 + rnd() * 0.7);
  const harmonics2: Harmonic[] = Array.from({ length: 3 }, (_, i) => ({
    freq: 3 + i + Math.floor(rnd() * 2),
    amp: 0.24 - i * 0.05,
    phase: rnd() * Math.PI * 2,
  }));
  const rings2 = Math.max(3, Math.round(rings * 0.4));
  const step2 = (70 + rnd() * 40) / rings2;
  const paths2 = Array.from({ length: rings2 }, (_, i) => ({
    d: contourPath(cx2, cy2, 14 + i * step2, harmonics2, squash * 0.9),
    i,
  }));

  // Flight path: a lazy S across the plate
  const fp = `M-20 ${(H * (0.2 + rnd() * 0.2)).toFixed(0)} C ${W * 0.3} ${
    H * (0.05 + rnd() * 0.2)
  }, ${W * 0.45} ${H * (0.7 + rnd() * 0.2)}, ${W * 0.72} ${H * 0.5} S ${W * 0.95} ${
    H * (0.15 + rnd() * 0.2)
  }, ${W + 20} ${(H * (0.55 + rnd() * 0.2)).toFixed(0)}`;

  // The plate has to invert wholesale, not just swap the line colour: on white
  // the index contour is the *dark* weight, on deep it is the bright one.
  const deep = tone === "deep";
  const stroke = deep ? `oklch(0.78 0.15 ${hue})` : `oklch(0.54 0.13 ${hue})`;
  const strokeSoft = deep ? `oklch(0.52 0.12 ${hue})` : `oklch(0.72 0.1 ${hue})`;
  const plate = deep ? "#0b2540" : "#fdfeff";
  const glowInner = deep ? `oklch(0.62 0.16 ${hue})` : `oklch(0.86 0.09 ${hue})`;
  const glowMid = deep ? `oklch(0.4 0.12 ${hue})` : `oklch(0.93 0.05 ${hue})`;
  const rampFrom = deep ? `oklch(0.34 0.09 ${hue})` : `oklch(0.84 0.08 ${hue})`;
  const rampTo = deep
    ? `oklch(0.18 0.05 ${(hue + 40) % 360})`
    : `oklch(0.94 0.04 ${(hue + 40) % 360})`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={cn("h-full w-full", className)}
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="45%" r="62%">
          <stop offset="0%" stopColor={glowInner} stopOpacity={deep ? "0.42" : "0.55"} />
          <stop offset="55%" stopColor={glowMid} stopOpacity={deep ? "0.14" : "0.3"} />
          <stop offset="100%" stopColor={plate} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-ramp`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor={rampFrom} stopOpacity={deep ? "0.55" : "0.5"} />
          <stop offset="100%" stopColor={rampTo} stopOpacity={deep ? "0.15" : "0.18"} />
        </linearGradient>
        <linearGradient id={`${uid}-fade`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.25" />
        </linearGradient>
        {/* Oversized: the mask rotates with the contour group, so a viewBox-sized
            rect would drag its own straight edge across the plate. */}
        <mask id={`${uid}-mask`}>
          <rect
            x={-W * 0.4}
            y={-H * 0.4}
            width={W * 1.8}
            height={H * 1.8}
            fill={`url(#${uid}-fade)`}
          />
        </mask>
      </defs>

      <rect width={W} height={H} fill={plate} />
      <rect width={W} height={H} fill={`url(#${uid}-glow)`} />

      {chrome && (
        <g stroke={stroke} strokeOpacity={deep ? "0.07" : "0.12"} strokeWidth="1">
          {Array.from({ length: Math.ceil(W / 40) }, (_, i) => (
            <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2={H} />
          ))}
          {Array.from({ length: Math.ceil(H / 40) }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 40} x2={W} y2={i * 40} />
          ))}
        </g>
      )}

      <g mask={`url(#${uid}-mask)`} transform={`rotate(${rotate.toFixed(1)} ${W / 2} ${H / 2})`}>
        {filled && (
          <>
            <path d={paths[rings - 1].d} fill={`url(#${uid}-ramp)`} />
            <path d={paths[Math.floor(rings * 0.45)].d} fill={`url(#${uid}-ramp)`} opacity="0.7" />
          </>
        )}

        {paths2.map((p) => (
          <path
            key={`b${p.i}`}
            d={p.d}
            fill="none"
            stroke={strokeSoft}
            strokeWidth="0.8"
            strokeOpacity={0.34 - p.i * 0.03}
          />
        ))}

        {paths.map((p) => {
          const t = p.i / rings;
          const index = p.i % 5 === 0;
          return (
            <path
              key={p.i}
              d={p.d}
              fill="none"
              stroke={index ? stroke : strokeSoft}
              strokeWidth={index ? 1.3 : 0.7}
              strokeOpacity={(index ? 0.8 : 0.45) * (1 - t * 0.5)}
            />
          );
        })}
      </g>

      {chrome && (
        <>
          <path
            d={fp}
            fill="none"
            stroke={stroke}
            strokeOpacity="0.5"
            strokeWidth="1.2"
            strokeDasharray="6 7"
            className="animate-dash-flow"
          />
          <g fill="none" stroke={stroke} strokeOpacity="0.45" strokeWidth="1">
            <circle cx={cx} cy={cy} r="9" />
            <line x1={cx - 16} y1={cy} x2={cx - 4} y2={cy} />
            <line x1={cx + 4} y1={cy} x2={cx + 16} y2={cy} />
            <line x1={cx} y1={cy - 16} x2={cx} y2={cy - 4} />
            <line x1={cx} y1={cy + 4} x2={cx} y2={cy + 16} />
          </g>
          <circle cx={cx} cy={cy} r="2" fill={stroke} />
          <g stroke={stroke} strokeOpacity="0.35" strokeWidth="1.4">
            <path d={`M8 20 L8 8 L20 8`} fill="none" />
            <path d={`M${W - 20} 8 L${W - 8} 8 L${W - 8} 20`} fill="none" />
            <path d={`M8 ${H - 20} L8 ${H - 8} L20 ${H - 8}`} fill="none" />
            <path d={`M${W - 20} ${H - 8} L${W - 8} ${H - 8} L${W - 8} ${H - 20}`} fill="none" />
          </g>
        </>
      )}
    </svg>
  );
}
