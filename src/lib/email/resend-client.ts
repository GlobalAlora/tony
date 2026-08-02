import "server-only";
import { Resend } from "resend";

let client: Resend | null = null;

export function getResendClient(): Resend {
  if (client) return client;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing RESEND_API_KEY environment variable. See .env.example.",
    );
  }

  client = new Resend(apiKey);
  return client;
}

/**
 * Verified sender identity. Must be on a domain verified in the Resend
 * dashboard for production sends — see README "Configurar Resend".
 */
export const RESEND_FROM =
  process.env.RESEND_FROM_EMAIL ?? "Tony Piorno <onboarding@resend.dev>";

/** Where new-proposal notifications are delivered. Defaults to Tony's inbox. */
export const NOTIFICATION_RECIPIENT =
  process.env.CREATOR_NOTIFICATION_EMAIL ?? "piornotony@gmail.com";
