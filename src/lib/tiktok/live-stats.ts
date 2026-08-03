import "server-only";
import { getStoredTikTokTokens, saveTikTokTokens } from "@/lib/tiktok/oauth-store";

export interface TikTokLiveStats {
  followerCount: number;
  likesCount: number;
  videoCount: number;
}

interface TikTokRefreshResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  refresh_expires_in?: number;
}

/** Refreshes access_token if it's expired (or about to). Returns the token to use, or null on failure. */
async function getFreshAccessToken(): Promise<string | null> {
  const stored = await getStoredTikTokTokens();
  if (!stored) return null;

  const expiresAt = new Date(stored.access_token_expires_at).getTime();
  const isStillValid = expiresAt - Date.now() > 5 * 60 * 1000; // 5 min safety margin
  if (isStillValid) return stored.access_token;

  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  if (!clientKey || !clientSecret) return null;

  try {
    const res = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        grant_type: "refresh_token",
        refresh_token: stored.refresh_token,
      }),
    });
    if (!res.ok) return null;

    const data: TikTokRefreshResponse = await res.json();
    if (!data.access_token || !data.refresh_token || !data.expires_in || !data.refresh_expires_in) {
      return null;
    }

    // TikTok may rotate the refresh_token on every use — always persist the
    // newest one, or the chain silently breaks in ~365 days.
    await saveTikTokTokens({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresInSeconds: data.expires_in,
      refreshExpiresInSeconds: data.refresh_expires_in,
    });

    return data.access_token;
  } catch {
    return null;
  }
}

export async function getTikTokLiveStats(): Promise<TikTokLiveStats | null> {
  const accessToken = await getFreshAccessToken();
  if (!accessToken) return null;

  try {
    const res = await fetch(
      "https://open.tiktokapis.com/v2/user/info/?fields=follower_count,likes_count,video_count",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return null;

    const json = await res.json();
    const user = json?.data?.user;
    if (
      typeof user?.follower_count !== "number" ||
      typeof user?.likes_count !== "number" ||
      typeof user?.video_count !== "number"
    ) {
      return null;
    }

    return {
      followerCount: user.follower_count,
      likesCount: user.likes_count,
      videoCount: user.video_count,
    };
  } catch {
    return null;
  }
}

/** Matches the site's existing "357.5K" / "55.2M" display convention. */
export function formatCompactCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return String(count);
}
