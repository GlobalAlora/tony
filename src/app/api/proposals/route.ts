import { NextResponse } from "next/server";
import type { z } from "zod";
import {
  sendProposalAutoReply,
  sendProposalNotification,
} from "@/lib/email/send-proposal-emails";
import { isRateLimited } from "@/lib/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/constants/site";
import { proposalFormSchema } from "@/lib/validations/proposal";

export const runtime = "nodejs";

/** Real users can't fill and submit this form in under 1.5s — bots that autofill instantly do. */
const MIN_FILL_TIME_MS = 1500;

function flattenIssues(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in fieldErrors)) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // absent on some legitimate same-origin requests — don't false-positive block
  return origin === SITE_URL || origin === new URL(SITE_URL).origin;
}

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  );
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { success: false, error: "Origen no permitido." },
      { status: 403 },
    );
  }

  if (isRateLimited(getClientIp(request))) {
    return NextResponse.json(
      { success: false, error: "Demasiados envíos. Probá de nuevo en un minuto." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Solicitud inválida." },
      { status: 400 },
    );
  }

  const parsed = proposalFormSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Revisá los datos del formulario.",
        fieldErrors: flattenIssues(parsed.error),
      },
      { status: 400 },
    );
  }

  const values = parsed.data;

  // Honeypot and timing heuristics catch bots. Respond as if it worked —
  // revealing detection just teaches the bot what to fix.
  const isHoneypotTripped = Boolean(values.website);
  const isTooFast =
    typeof values.renderedAt === "number" &&
    Date.now() - values.renderedAt < MIN_FILL_TIME_MS;

  if (isHoneypotTripped || isTooFast) {
    return NextResponse.json({ success: true });
  }

  const supabase = createSupabaseServerClient();

  const { error: insertError } = await supabase.from("proposals").insert({
    brand_name: values.brand_name,
    contact_name: values.contact_name,
    contact_email: values.contact_email,
    contact_phone: values.contact_phone || undefined,
    campaign_type: values.campaign_type,
    platforms: values.platforms,
    budget_range: values.budget_range,
    estimated_date: values.estimated_date || undefined,
    message: values.message || undefined,
  });

  if (insertError) {
    console.error("[api/proposals] Supabase insert failed:", insertError);
    return NextResponse.json(
      {
        success: false,
        error: "No pudimos guardar la propuesta. Probá de nuevo en unos minutos.",
      },
      { status: 500 },
    );
  }

  // The proposal is already saved at this point — email delivery is a
  // best-effort convenience, not the source of truth. A failed send must
  // never make the API report failure for a proposal that was, in fact,
  // captured.
  const emailOutcomes = await Promise.allSettled([
    sendProposalNotification(values),
    sendProposalAutoReply(values),
  ]);

  const emailLabels = ["notification", "auto-reply"] as const;
  emailOutcomes.forEach((outcome, i) => {
    if (outcome.status === "rejected") {
      console.error(`[api/proposals] ${emailLabels[i]} email failed:`, outcome.reason);
    }
  });

  return NextResponse.json({ success: true });
}
