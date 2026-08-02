import { CONTENT_PILLARS, CREATOR, SOCIAL_PROFILES, YOUTUBE_CHANNEL } from "@/lib/constants/creator-data";
import { FAQ_ITEMS } from "@/lib/constants/faq";
import { SITE_URL } from "@/lib/constants/site";

export const revalidate = 3600;

/**
 * Emerging convention giving AI crawlers a structured, low-noise summary of
 * the site. Built from the same constants as the visible page and JSON-LD
 * (see lib/constants + lib/seo/schema.ts) so nothing here can drift out of
 * sync with what's actually on the page.
 */
function buildLlmsTxt(): string {
  const lines: string[] = [];

  lines.push(`# ${CREATOR.displayName} — Media Kit`);
  lines.push("");
  lines.push(`> ${CREATOR.tagline}`);
  lines.push("");

  lines.push("## Datos clave");
  lines.push(`- Nombre completo: ${CREATOR.fullName}`);
  for (const profile of SOCIAL_PROFILES) {
    lines.push(
      `- ${profile.label}: ${profile.handle} — ${profile.followersDisplay} seguidores, ${profile.secondaryMetric.value} (${profile.secondaryMetric.label.toLowerCase()})`,
    );
  }
  lines.push(`- ${YOUTUBE_CHANNEL.label}: ${YOUTUBE_CHANNEL.handle} (${YOUTUBE_CHANNEL.url})`);
  lines.push(
    `- Ubicación: ${CREATOR.location.city}, ${CREATOR.location.province}, ${CREATOR.location.country}`,
  );
  lines.push(`- Contacto: ${CREATOR.email}`);
  lines.push("");

  lines.push("## Pilares de contenido");
  for (const pillar of CONTENT_PILLARS) {
    lines.push(`- ${pillar.title}: ${pillar.description}`);
  }
  lines.push("");

  lines.push("## Preguntas frecuentes");
  for (const item of FAQ_ITEMS) {
    lines.push(`### ${item.question}`);
    lines.push(item.answer);
    lines.push("");
  }

  lines.push("## Propuestas de marca");
  lines.push(
    `Las marcas pueden enviar una propuesta estructurada (presupuesto, plataformas, tipo de campaña) a través del formulario en ${SITE_URL}/#propuesta, o por email a ${CREATOR.email}. Las propuestas no se gestionan por DM de Instagram.`,
  );

  return lines.join("\n");
}

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
