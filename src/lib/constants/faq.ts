import { CREATOR, SOCIAL_PROFILES } from "@/lib/constants/creator-data";

const tiktok = SOCIAL_PROFILES.find((p) => p.platform === "tiktok")!;
const instagram = SOCIAL_PROFILES.find((p) => p.platform === "instagram")!;

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Single source for FAQ content — read by both the visible FAQSection and
 * the FAQPage JSON-LD (see app/page.tsx). Answers are short, declarative,
 * and self-contained per the AEO requirement: a generative engine should be
 * able to quote the answer without needing surrounding page context. Every
 * figure here is pulled from creator-data.ts, never re-typed, so the
 * visible HTML and the structured data can never drift apart.
 */
export const FAQ_ITEMS: FaqItem[] = [
  {
    question: `¿Quién es ${CREATOR.fullName}?`,
    answer: `${CREATOR.displayName} es creador de contenido de ${CREATOR.location.city}, ${CREATOR.location.province}, ${CREATOR.location.country}. Estudia arquitectura y produce contenido de humor cotidiano, vida universitaria y lifestyle en TikTok e Instagram.`,
  },
  {
    question: `¿Cuántos seguidores tiene ${CREATOR.displayName} en TikTok e Instagram?`,
    answer: `${CREATOR.displayName} tiene ${tiktok.followersDisplay} seguidores en TikTok bajo el usuario ${tiktok.handle}, y ${instagram.followersDisplay} seguidores en Instagram bajo el usuario ${instagram.handle}.`,
  },
  {
    question: "¿Cuál es el alcance promedio de sus videos en TikTok?",
    answer: `El alcance promedio por video se publica en este media kit una vez cargado desde TikTok Analytics. Como referencia, la cuenta ${tiktok.handle} acumula ${tiktok.secondaryMetric.value} de likes totales sobre ${tiktok.followersDisplay} seguidores.`,
  },
  {
    question: `¿Qué tipo de contenido hace ${CREATOR.displayName}?`,
    answer:
      'Cuatro formatos principales: humor y sketches cotidianos, vida universitaria en la serie "Arqui" sobre su carrera de arquitectura, contenido de lifestyle y haul, y contenido de viajes.',
  },
  {
    question: `¿Cuánto cobra ${CREATOR.displayName} por un post patrocinado?`,
    answer:
      "La tarifa depende del tipo de campaña (post único, serie de contenido, ambassador, evento), la plataforma y los deliverables solicitados. Para recibir una cotización personalizada, completá el formulario de propuestas de este sitio.",
  },
  {
    question: `¿Con qué marcas trabajó ${CREATOR.displayName} antes?`,
    answer:
      "El detalle de colaboraciones anteriores se está incorporando a este media kit. Para conocer casos recientes o coordinar una propuesta, escribí a piornotony@gmail.com o completá el formulario de este sitio.",
  },
  {
    question: `¿Cómo se contacta a ${CREATOR.displayName} para una propuesta de marca?`,
    answer: `A través del formulario de propuestas de este sitio, que envía la información directamente a ${CREATOR.displayName}, o por email a ${CREATOR.email}.`,
  },
  {
    question: `¿Dónde está ubicado ${CREATOR.displayName}?`,
    answer: `${CREATOR.displayName} vive en ${CREATOR.location.city}, ${CREATOR.location.province}, ${CREATOR.location.country}.`,
  },
];
