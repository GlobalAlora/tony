import "server-only";

/**
 * Reads the live follower count for Tony's Instagram Business account via
 * the Meta Graph API, so the number shown on the site never goes stale
 * without anyone touching code. Falls back to `null` on any failure
 * (missing token, network error, revoked/expired token, unexpected shape)
 * so a Meta-side outage or a revoked token can never break the page —
 * callers must merge this with the static fallback in creator-data.ts.
 *
 * The account ID is public info (not a secret), so it's a plain constant.
 * The token is the only thing that must live in an env var.
 */
const INSTAGRAM_BUSINESS_ACCOUNT_ID = "17841461238881287";
const GRAPH_API_VERSION = "v21.0";
const REVALIDATE_SECONDS = 3600;

export async function getInstagramFollowerCount(): Promise<number | null> {
  const token = process.env.META_ACCESS_TOKEN;
  if (!token) return null;

  try {
    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${INSTAGRAM_BUSINESS_ACCOUNT_ID}?fields=followers_count&access_token=${token}`;
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return null;

    const data: unknown = await res.json();
    if (
      typeof data !== "object" ||
      data === null ||
      !("followers_count" in data) ||
      typeof (data as { followers_count: unknown }).followers_count !== "number"
    ) {
      return null;
    }

    return (data as { followers_count: number }).followers_count;
  } catch {
    return null;
  }
}

/** Matches the site's existing "357.5K" / "55.2M" display convention. */
export function formatFollowerCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return String(count);
}
