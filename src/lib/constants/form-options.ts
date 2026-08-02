/**
 * Shared option lists for the proposal form. Both the zod schema
 * (validations/proposal.ts) and the form UI read from these so the set of
 * valid values can never drift between client validation, server
 * validation, and what's rendered in <select>/checkbox controls.
 */

export const CAMPAIGN_TYPE_VALUES = [
  "post_unico",
  "serie_contenido",
  "ambassador",
  "evento",
  "otro",
] as const;

export type CampaignType = (typeof CAMPAIGN_TYPE_VALUES)[number];

export const CAMPAIGN_TYPE_LABELS: Record<CampaignType, string> = {
  post_unico: "Post único",
  serie_contenido: "Serie de contenido",
  ambassador: "Ambassador de largo plazo",
  evento: "Evento",
  otro: "Otro",
};

export const PLATFORM_VALUES = ["tiktok", "instagram", "youtube"] as const;

export type ProposalPlatform = (typeof PLATFORM_VALUES)[number];

export const PLATFORM_LABELS: Record<ProposalPlatform, string> = {
  tiktok: "TikTok",
  instagram: "Instagram",
  youtube: "YouTube",
};

/**
 * Reference exchange rate used only to show an approximate ARS figure next
 * to each USD range so a brand can ballpark it without leaving the form.
 * This is illustrative, not a live rate — revisit periodically.
 */
const REFERENCE_USD_ARS_RATE = 1300;

function approxArs(usdLow: number, usdHigh: number | null): string {
  const format = (n: number) =>
    Math.round((n * REFERENCE_USD_ARS_RATE) / 1000) * 1000;
  const fmt = new Intl.NumberFormat("es-AR");
  if (usdHigh === null) return `ARS $${fmt.format(format(usdLow))}+`;
  return `ARS $${fmt.format(format(usdLow))} – $${fmt.format(format(usdHigh))}`;
}

export const BUDGET_RANGE_VALUES = [
  "100_300",
  "300_800",
  "800_2000",
  "2000_5000",
  "5000_plus",
  "a_definir",
] as const;

export type BudgetRange = (typeof BUDGET_RANGE_VALUES)[number];

export const BUDGET_RANGE_LABELS: Record<BudgetRange, string> = {
  "100_300": `USD $100 – $300 (aprox. ${approxArs(100, 300)})`,
  "300_800": `USD $300 – $800 (aprox. ${approxArs(300, 800)})`,
  "800_2000": `USD $800 – $2.000 (aprox. ${approxArs(800, 2000)})`,
  "2000_5000": `USD $2.000 – $5.000 (aprox. ${approxArs(2000, 5000)})`,
  "5000_plus": `USD $5.000+ (aprox. ${approxArs(5000, null)})`,
  a_definir: "A definir / prefiero conversarlo",
};
