import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface TikTokTokenRow {
  access_token: string;
  refresh_token: string;
  access_token_expires_at: string;
  refresh_token_expires_at: string;
}

/**
 * Never throws: missing Supabase env vars (e.g. a build running without
 * them configured) or any query error just means "no live TikTok data yet" —
 * this is on the page-render path (via getSocialProfiles/getHeadlineStats),
 * so it must degrade to the static fallback rather than take the page down.
 */
export async function getStoredTikTokTokens(): Promise<TikTokTokenRow | null> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("tiktok_oauth_tokens")
      .select("access_token, refresh_token, access_token_expires_at, refresh_token_expires_at")
      .eq("id", 1)
      .maybeSingle();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

export async function saveTikTokTokens(tokens: {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
  refreshExpiresInSeconds: number;
}): Promise<void> {
  const supabase = createSupabaseServerClient();
  const now = Date.now();

  await supabase.from("tiktok_oauth_tokens").upsert({
    id: 1,
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
    access_token_expires_at: new Date(now + tokens.expiresInSeconds * 1000).toISOString(),
    refresh_token_expires_at: new Date(now + tokens.refreshExpiresInSeconds * 1000).toISOString(),
  });
}
