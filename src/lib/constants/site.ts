/**
 * PLACEHOLDER: replace with the real production domain once purchased/confirmed,
 * and set NEXT_PUBLIC_SITE_URL in Vercel env vars to match. Everything SEO-related
 * (canonical, OG, sitemap, JSON-LD, llms.txt) derives from this one constant.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tonypiorno.com";

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
