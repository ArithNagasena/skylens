/**
 * Brand asset manifest.
 *
 * All four entries are cut from public/brand/client-logo.jpg — the master
 * artwork — by the one-off script that trimmed its white margin to alpha. The
 * source is a 1024×1024 JPEG that is mostly empty ground, so pointing the site
 * at it directly rendered a postage-stamp mark inside a white box.
 *
 *   mark        drone + arc + ridge, dark-on-light   (header, light sections)
 *   markLight   the same, light-on-dark              (deep CTA surfaces)
 *   lockup      mark + SKY LENS wordmark, dark-on-light
 *   lockupLight the same, light-on-dark              (footer)
 *
 * The mark already contains no type, so components that place it beside live
 * text will not repeat the wordmark; the lockup already contains the type, so
 * it must never be paired with a text wordmark.
 */

export const brand = {
  hasCustomLogo: true,

  /** Mark only (drone + arc + mountains), dark-on-light variant. */
  mark: {
    src: "/brand/logo-mark.png",
    width: 784,
    height: 398,
  },

  /** The same mark, light-on-dark, for the deep surfaces. */
  markLight: {
    src: "/brand/logo-mark-light.png",
    width: 784,
    height: 398,
  },

  /** Full stacked lockup including the SKY LENS wordmark, dark-on-light. */
  lockup: {
    src: "/brand/logo-lockup.png",
    width: 784,
    height: 504,
  },

  /** The same lockup, light-on-dark. */
  lockupLight: {
    src: "/brand/logo-lockup-light.png",
    width: 784,
    height: 504,
  },
} as const;
