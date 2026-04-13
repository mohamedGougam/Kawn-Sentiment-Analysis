/**
 * Brand images: frontend/public/branding/
 *
 * - logo.png  → header mark + browser tab (single source for brand mark)
 * - hero.png  → hero visual
 * - icon.svg  → optional; only used if you point `favicon` at it
 */

export const branding = {
  /** Browser tab — uses the same asset as the header logo by default */
  favicon: "/branding/logo.png",

  /** Header logo beside the title */
  logoSrc: "/branding/logo.png",

  /**
   * If set, the header shows this image instead of logo + title row.
   * Example: "/branding/header.png"
   */
  headerBannerSrc: null as string | null,

  heroSrc: "/branding/hero.png",

  heroAlt: "Kawn Sentiment Analysis",
} as const;
