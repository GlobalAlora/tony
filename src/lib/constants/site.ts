/**
 * PLACEHOLDER: replace with the real production domain once purchased/confirmed,
 * and set NEXT_PUBLIC_SITE_URL in Vercel env vars to match. Everything SEO-related
 * (canonical, OG, sitemap, JSON-LD, llms.txt) derives from this one constant.
 */
/**
 * Defensive against two easy mistakes when pasting into Vercel's env var UI:
 * a missing `https://` scheme (breaks `new URL(SITE_URL)` in the root layout
 * with ERR_INVALID_URL, failing the whole build) and a trailing slash
 * (silently produces a double slash everywhere this gets concatenated with a
 * path — e.g. `${SITE_URL}/api/tiktok/oauth/callback` — which made TikTok
 * reject the OAuth redirect_uri as not matching what's registered).
 */
function normalizeSiteUrl(raw: string): string {
  const withScheme = /^https?:\/\//.test(raw) ? raw : `https://${raw}`;
  return withScheme.replace(/\/+$/, "");
}

export const SITE_URL = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tonypiorno.com",
);

export const SITE_NAME = "Tony Piorno — Media Kit";

export const CONTACT_EMAIL = "piornotony@gmail.com";

export const SECTION_IDS = {
  hero: "inicio",
  stats: "numeros",
  about: "quien-soy",
  pillars: "contenido",
  audience: "audiencia",
  caseStudies: "casos",
  faq: "preguntas-frecuentes",
  proposalForm: "propuesta",
} as const;
