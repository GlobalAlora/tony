/**
 * PLACEHOLDER: replace with the real production domain once purchased/confirmed,
 * and set NEXT_PUBLIC_SITE_URL in Vercel env vars to match. Everything SEO-related
 * (canonical, OG, sitemap, JSON-LD, llms.txt) derives from this one constant.
 */
/**
 * Trailing slash stripped defensively: a NEXT_PUBLIC_SITE_URL set with one
 * (easy to do by accident in Vercel's env var UI) silently produced a
 * double slash everywhere this gets concatenated with a path — e.g.
 * `${SITE_URL}/api/tiktok/oauth/callback` — which made TikTok reject the
 * OAuth redirect_uri as not matching what's registered.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tonypiorno.com"
).replace(/\/+$/, "");

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
