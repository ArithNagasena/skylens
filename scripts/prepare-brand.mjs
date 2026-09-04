/**
 * Turns the supplied master logo into the set of assets the site needs.
 *
 *   node scripts/prepare-brand.mjs [path-to-source]
 *
 * Default source: public/brand/source-logo.png
 *
 * Produces, in public/brand/:
 *   logo-lockup.png        trimmed, white background knocked out to transparent
 *   logo-lockup@2x.png     same at 2x for retina
 *   logo-mark.png          just the drone/arc/mountain mark, no wordmark
 *   logo-lockup-light.png  luminance-inverted variant that reads on dark surfaces
 *   logo-mark-light.png    ditto, mark only
 *
 * ...and in src/app/: icon.png + apple-icon.png, which Next picks up automatically
 * as the favicon and touch icon.
 */

import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=")[1] : fallback;
};

const SRC = args.find((a) => !a.startsWith("--")) ?? "public/brand/source-logo.png";
const OUT = "public/brand";
const APP = "src/app";

/**
 * invert  — flips lightness. Keeps the drone's internal modelling intact, but
 *           any element that was light in the source (the mountain fills) goes
 *           dark and survives only as its outline.
 * lighten — pushes everything into the light end. Nothing drops out, but the
 *           body/propeller/gimbal separation flattens.
 */
const MODE = flag("mode", "invert");

/** Fraction of the trimmed lockup height that is mark rather than wordmark. */
const MARK_FRACTION = Number(flag("mark-fraction", "0.62"));

/** White-ish pixels become transparent; everything else keeps its colour. */
async function knockoutWhite(input, threshold = 240) {
  const img = sharp(input).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const px = new Uint8ClampedArray(data);

  for (let i = 0; i < px.length; i += 4) {
    const [r, g, b] = [px[i], px[i + 1], px[i + 2]];
    if (r >= threshold && g >= threshold && b >= threshold) {
      px[i + 3] = 0;
      continue;
    }
    // Feather the anti-aliased rim so edges do not look cut out
    const lum = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255;
    if (lum > 0.86) px[i + 3] = Math.round(px[i + 3] * (1 - (lum - 0.86) / 0.14));
  }

  return sharp(Buffer.from(px.buffer), {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).png();
}

/**
 * Flips lightness while preserving hue, so a dark-on-white mark becomes a
 * light-on-dark one without turning the blues into their complement.
 */
async function toLightVariant(input) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const px = new Uint8ClampedArray(data);

  for (let i = 0; i < px.length; i += 4) {
    if (px[i + 3] === 0) continue;
    const r = px[i] / 255, g = px[i + 1] / 255, b = px[i + 2] / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;

    // "lighten" compresses everything into the upper band, so nothing vanishes.
    // "invert" flips, preserving contrast but sinking originally-light elements.
    const mapped = MODE === "lighten" ? 0.55 + (1 - l) * 0.4 : 0.18 + (1 - l) * 0.78;

    if (max === min) {
      px[i] = px[i + 1] = px[i + 2] = Math.round(Math.min(1, mapped) * 255);
      continue;
    }
    // Chromatic: move lightness, keep the hue relationship between channels
    const target = MODE === "lighten" ? 0.5 + (1 - l) * 0.34 : 0.42 + (1 - l) * 0.46;
    const k = target / Math.max(l, 0.001);
    px[i] = Math.min(255, Math.round(r * 255 * k));
    px[i + 1] = Math.min(255, Math.round(g * 255 * k));
    px[i + 2] = Math.min(255, Math.round(b * 255 * k));
  }

  return sharp(Buffer.from(px.buffer), {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).png();
}

async function main() {
  if (!existsSync(SRC)) {
    console.error(`\n  Source logo not found: ${SRC}`);
    console.error(`  Save the master artwork there (PNG or SVG), then re-run.\n`);
    process.exit(1);
  }

  await mkdir(OUT, { recursive: true });

  const meta = await sharp(SRC).metadata();
  console.log(`source: ${SRC} — ${meta.width}x${meta.height} ${meta.format}`);

  // 1. Knock out the white field, then trim the transparent margin.
  const transparent = await (await knockoutWhite(SRC)).toBuffer();
  const lockup = sharp(transparent).trim({ threshold: 1 });
  const lockupBuf = await lockup.png().toBuffer();
  const lockupMeta = await sharp(lockupBuf).metadata();

  await sharp(lockupBuf).resize({ width: 720 }).png({ compressionLevel: 9 })
    .toFile(path.join(OUT, "logo-lockup@2x.png"));
  await sharp(lockupBuf).resize({ width: 360 }).png({ compressionLevel: 9 })
    .toFile(path.join(OUT, "logo-lockup.png"));

  // 2. The mark alone — the wordmark sits in the lower third of this artwork.
  const markHeight = Math.round(lockupMeta.height * MARK_FRACTION);
  const markBuf = await sharp(lockupBuf)
    .extract({ left: 0, top: 0, width: lockupMeta.width, height: markHeight })
    .trim({ threshold: 1 })
    .png()
    .toBuffer();

  await sharp(markBuf).resize({ width: 512 }).png().toFile(path.join(OUT, "logo-mark.png"));

  // 3. Light-on-dark variants for the site's dark chrome.
  await (await toLightVariant(lockupBuf)).resize({ width: 360 })
    .toFile(path.join(OUT, "logo-lockup-light.png"));
  await (await toLightVariant(lockupBuf)).resize({ width: 720 })
    .toFile(path.join(OUT, "logo-lockup-light@2x.png"));
  await (await toLightVariant(markBuf)).resize({ width: 512 })
    .toFile(path.join(OUT, "logo-mark-light.png"));

  // 4. Favicon + touch icon. Padded onto the brand ground so the dark drone
  //    stays legible against a browser tab of any colour.
  const iconSrc = await (await toLightVariant(markBuf)).resize({
    width: 400, height: 400, fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  }).toBuffer();

  for (const [file, size] of [["icon.png", 256], ["apple-icon.png", 180]]) {
    await sharp({
      create: { width: size, height: size, channels: 4, background: { r: 4, g: 6, b: 10, alpha: 1 } },
    })
      .composite([{ input: await sharp(iconSrc).resize({
        width: Math.round(size * 0.78), height: Math.round(size * 0.78), fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      }).toBuffer() }])
      .png()
      .toFile(path.join(APP, file));
  }

  // 5. Rewrite the manifest so the components switch off the SVG fallback and
  //    next/image gets the true intrinsic dimensions.
  const markOut = await sharp(path.join(OUT, "logo-mark-light.png")).metadata();
  const lockupOut = await sharp(path.join(OUT, "logo-lockup-light.png")).metadata();

  await writeFile(
    "src/content/brand.ts",
    `/**
 * Brand asset manifest.
 *
 * GENERATED by \`npm run brand\` from public/brand/source-logo.png.
 * Re-run that script after replacing the master artwork rather than editing here.
 */

export const brand = {
  hasCustomLogo: true,

  /** Mark only (drone + arc + mountains), light-on-dark variant. */
  mark: {
    src: "/brand/logo-mark-light.png",
    width: ${markOut.width},
    height: ${markOut.height},
  },

  /** Full stacked lockup including the SKY LENS wordmark, light-on-dark. */
  lockup: {
    src: "/brand/logo-lockup-light.png",
    width: ${lockupOut.width},
    height: ${lockupOut.height},
  },
} as const;
`,
    "utf8",
  );

  console.log(`
  wrote:
    src/content/brand.ts              manifest (hasCustomLogo: true)
    ${OUT}/logo-lockup.png            (${lockupMeta.width}x${lockupMeta.height} trimmed -> 360w)
    ${OUT}/logo-lockup@2x.png
    ${OUT}/logo-lockup-light.png      light-on-dark variant
    ${OUT}/logo-lockup-light@2x.png
    ${OUT}/logo-mark.png              mark only
    ${OUT}/logo-mark-light.png
    ${APP}/icon.png                   favicon
    ${APP}/apple-icon.png             touch icon
`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
