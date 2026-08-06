import { CREATOR, HEADLINE_STATS, getSocialProfiles } from "@/lib/constants/creator-data";

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Single source for FAQ content — read by both the visible FAQSection and
 * the FAQPage JSON-LD (see app/page.tsx) and llms.txt. An async function,
 * not a static array: the follower-count answer must read the same
 * live-merged TikTok/Instagram numbers as the Hero/Stats sections, or the
 * FAQ and JSON-LD silently go stale relative to the visible page — exactly
 * the kind of HTML/structured-data drift that erodes trust signals for
 * generative engines. Answers are short, declarative, and self-contained
 * per the AEO requirement: a generative engine should be able to quote the
 * answer without needing surrounding page context.
 */
export async function getFaqItems(): Promise<FaqItem[]> {
  const socialProfiles = await getSocialProfiles();
  const tiktok = socialProfiles.find((p) => p.platform === "tiktok")!;
  const instagram = socialProfiles.find((p) => p.platform === "instagram")!;
  const avgReach = HEADLINE_STATS.find((s) => s.id === "avg-reach")!;

  return [
    {
      question: `¿Quién es ${CREATOR.fullName}?`,
      answer: `Soy ${CREATOR.displayName}, creador de contenido de ${CREATOR.location.city}, ${CREATOR.location.province}, ${CREATOR.location.country}. Estudio arquitectura y produzco contenido de humor cotidiano, vida universitaria y lifestyle en TikTok e Instagram.`,
    },
    {
      question: `¿Cuántos seguidores tiene ${CREATOR.displayName} en TikTok e Instagram?`,
      answer: `Tengo ${tiktok.followersDisplay} seguidores en TikTok bajo el usuario ${tiktok.handle}, y ${instagram.followersDisplay} seguidores en Instagram bajo el usuario ${instagram.handle}.`,
    },
    {
      question: "¿Cuál es el alcance promedio de sus videos en TikTok?",
      answer: `Mi cuenta ${tiktok.handle} promedia ${avgReach.value} vistas por video (últimos 28 días, datos de TikTok Studio), y acumula ${tiktok.secondaryMetric.value} de likes totales sobre ${tiktok.followersDisplay} seguidores.`,
    },
    {
      question: `¿Qué tipo de contenido hace ${CREATOR.displayName}?`,
      answer:
        'Hago cuatro formatos principales: humor y sketches cotidianos, vida universitaria en la serie "Arqui" sobre mi carrera de arquitectura, contenido de lifestyle y haul, y unboxing con reseñas de producto.',
    },
    {
      question: `¿Cuánto cobra ${CREATOR.displayName} por un post patrocinado?`,
      answer:
        "Depende del tipo de campaña (post único, serie de contenido, ambassador, evento), la plataforma y los deliverables. Completá el formulario de propuestas de este sitio y te paso una cotización personalizada.",
    },
    {
      question: `¿Con qué marcas trabajó ${CREATOR.displayName} antes?`,
      answer: `Trabajé con marcas como Shein (como ambassador), Adrenaline, Luqstoff, Firmoo y Suprabond, con reseñas de producto y contenido patrocinado, además de colaboraciones por canje con varios emprendimientos locales. El detalle de cada colaboración está en la sección de casos de este media kit.`,
    },
    {
      question: `¿Cómo se contacta a ${CREATOR.displayName} para una propuesta de marca?`,
      answer: `A través del formulario de propuestas de este sitio, que me llega directamente, o por email a ${CREATOR.email}.`,
    },
    {
      question: `¿Dónde está ubicado ${CREATOR.displayName}?`,
      answer: `Vivo en ${CREATOR.location.city}, ${CREATOR.location.province}, ${CREATOR.location.country}.`,
    },
  ];
}
