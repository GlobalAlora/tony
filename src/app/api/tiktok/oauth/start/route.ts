import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/constants/site";

export const runtime = "nodejs";

const SCOPES = "user.info.stats";
const STATE_COOKIE = "tiktok_oauth_state";

/**
 * One-time admin setup endpoint: Tony visits this URL once (with the setup
 * secret) to authorize the app, which lets the site auto-refresh his TikTok
 * follower/likes/video count going forward (see src/lib/tiktok/live-stats.ts).
 * Gated by TIKTOK_SETUP_SECRET so a random visitor can't trigger the flow
 * and silently swap in a different TikTok account's stats.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");

  if (!process.env.TIKTOK_SETUP_SECRET || key !== process.env.TIKTOK_SETUP_SECRET) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  if (!clientKey) {
    return NextResponse.json(
      { error: "Falta configurar TIKTOK_CLIENT_KEY." },
      { status: 500 },
    );
  }

  const state = crypto.randomUUID();
  const redirectUri = `${SITE_URL}/api/tiktok/oauth/callback`;

  const authorizeUrl = new URL("https://www.tiktok.com/v2/auth/authorize/");
  authorizeUrl.searchParams.set("client_key", clientKey);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("scope", SCOPES);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return response;
}
