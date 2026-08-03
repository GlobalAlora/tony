import { NextResponse } from "next/server";
import { saveTikTokTokens } from "@/lib/tiktok/oauth-store";
import { SITE_URL } from "@/lib/constants/site";

export const runtime = "nodejs";

const STATE_COOKIE = "tiktok_oauth_state";

interface TikTokTokenResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  refresh_expires_in?: number;
  error?: string;
  error_description?: string;
}

/** Receives TikTok's authorization redirect, exchanges the code for tokens, and stores them. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = request.headers
    .get("cookie")
    ?.split("; ")
    .find((c) => c.startsWith(`${STATE_COOKIE}=`))
    ?.split("=")[1];

  if (!code || !state || !cookieState || state !== cookieState) {
    return NextResponse.json(
      { error: "Solicitud inválida o vencida. Reintentá desde /api/tiktok/oauth/start." },
      { status: 400 },
    );
  }

  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  if (!clientKey || !clientSecret) {
    return NextResponse.json(
      { error: "Falta configurar TIKTOK_CLIENT_KEY / TIKTOK_CLIENT_SECRET." },
      { status: 500 },
    );
  }

  const body = new URLSearchParams({
    client_key: clientKey,
    client_secret: clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: `${SITE_URL}/api/tiktok/oauth/callback`,
  });

  const tokenRes = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const tokenData: TikTokTokenResponse = await tokenRes.json();

  if (
    !tokenRes.ok ||
    !tokenData.access_token ||
    !tokenData.refresh_token ||
    !tokenData.expires_in ||
    !tokenData.refresh_expires_in
  ) {
    console.error("[tiktok/oauth/callback] Token exchange failed:", tokenData);
    return NextResponse.json(
      { error: tokenData.error_description ?? "No se pudo obtener el token de TikTok." },
      { status: 502 },
    );
  }

  try {
    await saveTikTokTokens({
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresInSeconds: tokenData.expires_in,
      refreshExpiresInSeconds: tokenData.refresh_expires_in,
    });
  } catch (err) {
    console.error("[tiktok/oauth/callback] Failed to store tokens:", err);
    return NextResponse.json(
      { error: "TikTok autorizó la app pero no pudimos guardar el token. Revisá la configuración de Supabase." },
      { status: 500 },
    );
  }

  const response = NextResponse.json({
    success: true,
    message: "Cuenta de TikTok conectada. Ya podés cerrar esta pestaña.",
  });
  response.cookies.delete(STATE_COOKIE);
  return response;
}
