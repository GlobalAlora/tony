import "server-only";
import {
  getResendClient,
  NOTIFICATION_RECIPIENT,
  RESEND_FROM,
} from "@/lib/email/resend-client";
import { ProposalAutoReplyEmail } from "@/lib/email/templates/ProposalAutoReplyEmail";
import { ProposalNotificationEmail } from "@/lib/email/templates/ProposalNotificationEmail";
import type { ProposalEmailData } from "@/lib/email/templates/types";
import {
  BUDGET_RANGE_LABELS,
  CAMPAIGN_TYPE_LABELS,
  PLATFORM_LABELS,
  type BudgetRange,
  type CampaignType,
  type ProposalPlatform,
} from "@/lib/constants/form-options";

interface RawProposal {
  brand_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  campaign_type: CampaignType;
  platforms: ProposalPlatform[];
  budget_range: BudgetRange;
  estimated_date?: string;
  message?: string;
}

function formatEstimatedDate(isoDate?: string): string | null {
  if (!isoDate) return null;
  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

function toEmailData(proposal: RawProposal): ProposalEmailData {
  return {
    brandName: proposal.brand_name,
    contactName: proposal.contact_name,
    contactEmail: proposal.contact_email,
    contactPhone: proposal.contact_phone || null,
    campaignTypeLabel: CAMPAIGN_TYPE_LABELS[proposal.campaign_type],
    platformLabels: proposal.platforms.map((p) => PLATFORM_LABELS[p]),
    budgetRangeLabel: BUDGET_RANGE_LABELS[proposal.budget_range],
    estimatedDateLabel: formatEstimatedDate(proposal.estimated_date),
    message: proposal.message || null,
  };
}

/** Notifies Tony that a new proposal arrived. Reply-to is set to the brand's contact so replying goes straight to them. */
export async function sendProposalNotification(proposal: RawProposal) {
  const data = toEmailData(proposal);
  const resend = getResendClient();

  return resend.emails.send({
    from: RESEND_FROM,
    to: NOTIFICATION_RECIPIENT,
    replyTo: proposal.contact_email,
    subject: `Nueva propuesta: ${proposal.brand_name}`,
    react: ProposalNotificationEmail(data),
  });
}

/** Confirms receipt to the brand that submitted the proposal. */
export async function sendProposalAutoReply(proposal: RawProposal) {
  const data = toEmailData(proposal);
  const resend = getResendClient();

  return resend.emails.send({
    from: RESEND_FROM,
    to: proposal.contact_email,
    replyTo: NOTIFICATION_RECIPIENT,
    subject: "Recibimos tu propuesta",
    react: ProposalAutoReplyEmail(data),
  });
}
