/** Pre-formatted, human-readable proposal data shared by both email templates. */
export interface ProposalEmailData {
  brandName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  campaignTypeLabel: string;
  platformLabels: string[];
  budgetRangeLabel: string;
  estimatedDateLabel: string | null;
  message: string | null;
}
