/**
 * Single source of truth for every fact rendered on the landing page, the
 * schema.org JSON-LD, and /llms.txt. Keeping one source avoids the visible
 * HTML and the structured data drifting apart, which is what erodes trust
 * signals for generative engines (see project SEO/GEO/AEO requirements).
 *
 * Fields marked `isPlaceholder: true` are NOT real data yet. Components must
 * render those with a visible "dato de ejemplo" / "próximamente" treatment,
 * and SEO/JSON-LD/FAQ code must never surface placeholder values as fact.
 */

import {
  formatFollowerCount,
  getInstagramFollowerCount,
} from "@/lib/instagram/live-stats";
import {
  formatCompactCount,
  getTikTokLiveStats,
} from "@/lib/tiktok/live-stats";

export const CREATOR = {
  fullName: "Tony Piorno Polucci",
  displayName: "Tony Piorno",
  location: {
    city: "La Plata",
    province: "Buenos Aires",
    country: "Argentina",
    countryCode: "AR",
  },
  email: "piornotony@gmail.com",
  tagline: "Humor, vida universitaria y lifestyle para 357K+ personas.",
  bio: [
    "Tony Piorno es creador de contenido en La Plata, Buenos Aires. Estudia arquitectura y combina el humor cotidiano con su vida universitaria en la serie \"Arqui\", además de contenido de lifestyle, haul y unboxing.",
    "Su tono es cercano, espontáneo y humorístico — el tipo de contenido que se comparte porque se siente real, no producido. Esa cercanía es lo que sostiene el engagement con su comunidad.",
  ],
} as const;

export type SocialPlatform = "tiktok" | "instagram" | "youtube";

export interface SocialProfile {
  platform: SocialPlatform;
  label: string;
  handle: string;
  url: string;
  followers: number;
  followersDisplay: string;
  secondaryMetric: {
    label: string;
    value: string;
  };
}

export const SOCIAL_PROFILES: SocialProfile[] = [
  {
    platform: "tiktok",
    label: "TikTok",
    handle: "@t0ni_00",
    url: "https://www.tiktok.com/@t0ni_00",
    followers: 357_500,
    followersDisplay: "357.5K",
    secondaryMetric: { label: "Likes totales", value: "55.2M" },
  },
  {
    platform: "instagram",
    label: "Instagram",
    handle: "@tonii_00_",
    url: "https://www.instagram.com/tonii_00_",
    followers: 73_200,
    followersDisplay: "73.2K",
    secondaryMetric: { label: "Publicaciones", value: "608" },
  },
];

/** Secondary channel — no public follower count supplied yet. */
export const YOUTUBE_CHANNEL = {
  platform: "youtube" as const,
  label: "YouTube",
  handle: "@tonypiorno",
  url: "https://youtube.com/@tonypiorno",
};

export const ALL_SOCIAL_URLS = [
  ...SOCIAL_PROFILES.map((p) => p.url),
  YOUTUBE_CHANNEL.url,
];

/**
 * Headline stats for the dashboard-style stats section. `isPlaceholder`
 * stats render with a distinct "dato pendiente" visual state and are
 * excluded from JSON-LD / FAQ answers.
 */
export interface HeadlineStat {
  id: string;
  label: string;
  value: string;
  helpText: string;
  isPlaceholder?: boolean;
}

export const HEADLINE_STATS: HeadlineStat[] = [
  {
    id: "tiktok-followers",
    label: "Seguidores en TikTok",
    value: "357.5K",
    helpText: "@t0ni_00",
  },
  {
    id: "tiktok-likes",
    label: "Likes totales en TikTok",
    value: "55.2M",
    helpText: "Acumulado histórico",
  },
  {
    id: "instagram-followers",
    label: "Seguidores en Instagram",
    value: "73.2K",
    helpText: "@tonii_00_",
  },
  {
    id: "avg-reach",
    label: "Alcance promedio por video",
    value: "357.9K",
    helpText: "Vistas promedio por video en TikTok (últimos 28 días)",
  },
];

/**
 * Live-data variants: both Instagram (Meta Graph API, System User token) and
 * TikTok (Login Kit, OAuth token pair auto-refreshed via
 * src/lib/tiktok/live-stats.ts) are fetched live and merged over the static
 * values above. Any failure (missing token, expired/revoked auth, network
 * error, Meta/TikTok outage) falls back to the static value — a third-party
 * API hiccup must never take down these numbers on the page.
 */
export async function getSocialProfiles(): Promise<SocialProfile[]> {
  const [instagramCount, tiktokStats] = await Promise.all([
    getInstagramFollowerCount(),
    getTikTokLiveStats(),
  ]);

  return SOCIAL_PROFILES.map((profile) => {
    if (profile.platform === "instagram" && instagramCount !== null) {
      return {
        ...profile,
        followers: instagramCount,
        followersDisplay: formatFollowerCount(instagramCount),
      };
    }
    if (profile.platform === "tiktok" && tiktokStats !== null) {
      return {
        ...profile,
        followers: tiktokStats.followerCount,
        followersDisplay: formatCompactCount(tiktokStats.followerCount),
        secondaryMetric: {
          ...profile.secondaryMetric,
          value: formatCompactCount(tiktokStats.likesCount),
        },
      };
    }
    return profile;
  });
}

export async function getHeadlineStats(): Promise<HeadlineStat[]> {
  const [instagramCount, tiktokStats] = await Promise.all([
    getInstagramFollowerCount(),
    getTikTokLiveStats(),
  ]);

  return HEADLINE_STATS.map((stat) => {
    if (stat.id === "instagram-followers" && instagramCount !== null) {
      return { ...stat, value: formatFollowerCount(instagramCount) };
    }
    if (stat.id === "tiktok-followers" && tiktokStats !== null) {
      return { ...stat, value: formatCompactCount(tiktokStats.followerCount) };
    }
    if (stat.id === "tiktok-likes" && tiktokStats !== null) {
      return { ...stat, value: formatCompactCount(tiktokStats.likesCount) };
    }
    return stat;
  });
}

export interface ContentPillar {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  /** Most pillars show one example video; "Lifestyle & haul" shows two (haul + unboxing). */
  embedUrls?: string[];
}

export const CONTENT_PILLARS: ContentPillar[] = [
  {
    id: "lifestyle",
    title: "Lifestyle & haul",
    description:
      "Rutinas, compras y recomendaciones de producto en un formato conversacional, ideal para lanzamientos.",
    keywords: ["lifestyle", "haul", "producto"],
    embedUrls: ["https://www.tiktok.com/@t0ni_00/video/7662175127110503700"],
  },
  {
    id: "unboxing",
    title: "Unboxing & reseñas",
    description:
      "Muestra el producto en cámara al abrirlo y da su opinión real — el formato preferido de las marcas para lanzamientos.",
    keywords: ["unboxing", "reseñas", "producto"],
    embedUrls: ["https://www.tiktok.com/@t0ni_00/video/7637289567766301972"],
  },
  {
    id: "arqui",
    title: "Vida universitaria — \"Arqui\"",
    description:
      "Serie propia sobre su día a día estudiando arquitectura: entregas, trasnoches, maquetas y la cultura de facultad.",
    keywords: ["universidad", "arquitectura", "estudiantes"],
    embedUrls: ["https://www.tiktok.com/@t0ni_00/video/7632879811748171029"],
  },
  {
    id: "humor",
    title: "Humor y sketches cotidianos",
    description:
      "Situaciones del día a día llevadas al sketch — el formato que más engagement genera dentro de su comunidad.",
    keywords: ["humor", "sketches", "comedia"],
    embedUrls: ["https://www.tiktok.com/@t0ni_00/video/7443879490331118903"],
  },
];

/**
 * Real export from TikTok Studio → Analytics → Followers tab (@t0ni_00,
 * captured 2026-08-03). Followers tab specifically — not "Viewers", which
 * includes non-follower For You page traffic and skews younger/more
 * Argentina-heavy than the actual follower base.
 */
export const AUDIENCE_DATA_IS_PLACEHOLDER = false;

export const AUDIENCE_AGE_BREAKDOWN = [
  { bracket: "18-24", percent: 50.2 },
  { bracket: "25-34", percent: 34.9 },
  { bracket: "35-44", percent: 8 },
  { bracket: "45-54", percent: 3.4 },
  { bracket: "55+", percent: 3.5 },
];

export const AUDIENCE_GENDER_BREAKDOWN = [
  { label: "Mujeres", percent: 64 },
  { label: "Hombres", percent: 36 },
  { label: "Otro / prefiere no decir", percent: 0 },
];

export const AUDIENCE_TOP_LOCATIONS = [
  { label: "México", percent: 22.7 },
  { label: "Argentina", percent: 21.3 },
  { label: "Colombia", percent: 6.1 },
  { label: "Perú", percent: 4.7 },
  { label: "Chile", percent: 3.2 },
  { label: "Resto del mundo", percent: 42 },
];

export interface CaseStudy {
  id: string;
  brandName: string;
  summary: string;
  campaignType: string;
  isExample: boolean;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "shein",
    brandName: "Shein",
    summary: "Más de 5 videos reseñando productos de la marca.",
    campaignType: "Ambassador",
    isExample: false,
  },
  {
    id: "adrenaline",
    brandName: "Adrenaline",
    summary: "Reseña de un pack 8x1 de gafas de sol.",
    campaignType: "Post único",
    isExample: false,
  },
  {
    id: "luqstoff",
    brandName: "Luqstoff",
    summary: "Reseña de una pava eléctrica.",
    campaignType: "Post único",
    isExample: false,
  },
  {
    id: "firmoo",
    brandName: "Firmoo",
    summary: "Reseña de dos modelos de anteojos para la marca mexicana Firmoo.",
    campaignType: "Post único",
    isExample: false,
  },
  {
    id: "suprabond",
    brandName: "Suprabond",
    summary:
      "Le enviaron el pegamento para mostrar su uso pegando maquetas de arquitectura.",
    campaignType: "Post único",
    isExample: false,
  },
  {
    id: "emprendimientos",
    brandName: "Emprendimientos locales",
    summary:
      "Colaboraciones por canje con distintos emprendimientos: recibe el producto a cambio de mostrarlo en su contenido.",
    campaignType: "Canje",
    isExample: false,
  },
];
