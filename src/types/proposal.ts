import type { BudgetRange, CampaignType, ProposalPlatform } from "@/lib/constants/form-options";

export type ProposalStatus = "new" | "in_conversation" | "closed" | "rejected";

/**
 * Mirrors the `public.proposals` table (see supabase/migrations). Declared
 * as a `type`, not an `interface`: only object-literal type aliases get an
 * implicit index signature when TS checks them against `Record<string,
 * unknown>`, which is what `SupabaseClient<Database>` requires internally
 * (`GenericTable["Row"]`). An interface here silently makes every
 * `.from("proposals")` call resolve to `never`.
 */
export type ProposalRow = {
  id: string;
  brand_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  campaign_type: CampaignType;
  platforms: ProposalPlatform[];
  budget_range: BudgetRange | null;
  estimated_date: string | null;
  message: string | null;
  status: ProposalStatus;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ProposalInsert = Pick<
  ProposalRow,
  | "brand_name"
  | "contact_name"
  | "contact_email"
  | "campaign_type"
  | "platforms"
> &
  Partial<
    Pick<
      ProposalRow,
      "contact_phone" | "budget_range" | "estimated_date" | "message"
    >
  >;

export type Database = {
  public: {
    Tables: {
      proposals: {
        Row: ProposalRow;
        Insert: ProposalInsert;
        Update: Partial<ProposalInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
