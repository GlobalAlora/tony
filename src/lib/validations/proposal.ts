import { z } from "zod";
import {
  BUDGET_RANGE_VALUES,
  CAMPAIGN_TYPE_VALUES,
  PLATFORM_VALUES,
} from "@/lib/constants/form-options";

/**
 * Shared by the client form (react-hook-form resolver) and the API route
 * (server-side re-validation — never trust client input). Keeping one
 * schema for both means the rules can never silently drift apart.
 */
export const proposalFormSchema = z.object({
  brand_name: z
    .string()
    .trim()
    .min(1, "Ingresá el nombre de la marca o empresa.")
    .max(160, "Máximo 160 caracteres."),
  contact_name: z
    .string()
    .trim()
    .min(1, "Ingresá tu nombre y cargo.")
    .max(160, "Máximo 160 caracteres."),
  contact_email: z.email("Ingresá un email válido."),
  contact_phone: z
    .string()
    .trim()
    .max(40, "Máximo 40 caracteres.")
    .optional()
    .or(z.literal("")),
  campaign_type: z.enum(CAMPAIGN_TYPE_VALUES, "Seleccioná un tipo de campaña."),
  platforms: z
    .array(z.enum(PLATFORM_VALUES))
    .min(1, "Seleccioná al menos una plataforma."),
  budget_range: z.enum(
    BUDGET_RANGE_VALUES,
    "Seleccioná un rango de presupuesto.",
  ),
  estimated_date: z
    .union([z.iso.date("Fecha inválida."), z.literal("")])
    .optional(),
  message: z
    .string()
    .trim()
    .max(4000, "Máximo 4000 caracteres.")
    .optional()
    .or(z.literal("")),
  /** Honeypot — real users leave it empty (hidden via CSS); the route rejects non-empty values. */
  website: z.string().optional().or(z.literal("")),
  /** Anti-bot timing check — epoch ms captured when the form mounted. */
  renderedAt: z.number().optional(),
});

export type ProposalFormValues = z.infer<typeof proposalFormSchema>;

/** Fields actually persisted — strips honeypot/timing metadata. */
export const PROPOSAL_PERSISTED_FIELDS = [
  "brand_name",
  "contact_name",
  "contact_email",
  "contact_phone",
  "campaign_type",
  "platforms",
  "budget_range",
  "estimated_date",
  "message",
] as const;
