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
    "Tony Piorno es creador de contenido en La Plata, Buenos Aires. Estudia arquitectura y combina el humor cotidiano con su vida universitaria en la serie \"Arqui\", además de contenido de lifestyle, haul y viajes.",
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
    value: "Cargando dato",
    helpText: "Se completa con métricas reales de TikTok/Meta Analytics",
    isPlaceholder: true,
  },
];

export interface ContentPillar {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  embedUrl?: string;
}

export const CONTENT_PILLARS: ContentPillar[] = [
  {
    id: "humor",
    title: "Humor y sketches cotidianos",
    description:
      "Situaciones del día a día llevadas al sketch — el formato que más engagement genera dentro de su comunidad.",
    keywords: ["humor", "sketches", "comedia"],
  },
  {
    id: "arqui",
    title: "Vida universitaria — \"Arqui\"",
    description:
      "Serie propia sobre su día a día estudiando arquitectura: entregas, trasnoches, maquetas y la cultura de facultad.",
    keywords: ["universidad", "arquitectura", "estudiantes"],
  },
  {
    id: "lifestyle",
    title: "Lifestyle & haul",
    description:
      "Rutinas, compras y recomendaciones de producto en un formato conversacional, ideal para lanzamientos y unboxings.",
    keywords: ["lifestyle", "haul", "producto"],
  },
  {
    id: "viajes",
    title: "Viajes",
    description:
      "Contenido de viaje con el mismo tono humorístico y cercano — bien recibido para turismo, aerolíneas y hotelería.",
    keywords: ["viajes", "turismo"],
  },
];

/**
 * PLACEHOLDER — sample audience breakdown so the chart component and layout
 * can be reviewed before real data exists. Replace with exports from TikTok
 * Analytics / Meta Business Suite. Never cite these numbers as fact.
 */
export const AUDIENCE_DATA_IS_PLACEHOLDER = true;

export const AUDIENCE_AGE_BREAKDOWN = [
  { bracket: "13-17", percent: 18 },
  { bracket: "18-24", percent: 46 },
  { bracket: "25-34", percent: 26 },
  { bracket: "35-44", percent: 8 },
  { bracket: "45+", percent: 2 },
];

export const AUDIENCE_GENDER_BREAKDOWN = [
  { label: "Mujeres", percent: 58 },
  { label: "Hombres", percent: 41 },
  { label: "Otro / prefiere no decir", percent: 1 },
];

export const AUDIENCE_TOP_LOCATIONS = [
  { label: "Buenos Aires, AR", percent: 38 },
  { label: "CABA, AR", percent: 21 },
  { label: "Córdoba, AR", percent: 9 },
  { label: "Santa Fe, AR", percent: 6 },
  { label: "Resto de LATAM", percent: 14 },
];

export interface CaseStudy {
  id: string;
  brandName: string;
  summary: string;
  campaignType: string;
  isExample: boolean;
}

/**
 * PLACEHOLDER — 3 example slots. Replace brandName/summary with real past
 * collaborations. isExample renders a visible "Caso de ejemplo" badge so
 * this is never mistaken for a real client by anyone viewing the page.
 */
export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "case-1",
    brandName: "Marca / cliente #1",
    summary:
      "Espacio para describir el objetivo de la campaña, el formato usado y el resultado principal en una línea.",
    campaignType: "Post único",
    isExample: true,
  },
  {
    id: "case-2",
    brandName: "Marca / cliente #2",
    summary:
      "Espacio para describir el objetivo de la campaña, el formato usado y el resultado principal en una línea.",
    campaignType: "Serie de contenido",
    isExample: true,
  },
  {
    id: "case-3",
    brandName: "Marca / cliente #3",
    summary:
      "Espacio para describir el objetivo de la campaña, el formato usado y el resultado principal en una línea.",
    campaignType: "Ambassador",
    isExample: true,
  },
];
