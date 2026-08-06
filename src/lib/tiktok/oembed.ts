import "server-only";

interface TikTokOEmbedData {
  thumbnailUrl: string;
  title: string;
}

/**
 * Used only for the thumbnail (a click-to-play poster) — never for the
 * `html` field, which needs TikTok's embed.js and only scans the DOM once
 * on load, so it silently ignores any blockquote mounted later than initial
 * page load (see SocialEmbed.tsx for why the direct iframe approach exists
 * instead). thumbnail_url is a signed, time-limited CDN URL, not a stable
 * asset, so this is refetched on a schedule rather than cached forever.
 *
 * Never throws: a thumbnail is a nice-to-have, not something a failed
 * TikTok request should be allowed to break the page over — falls back to
 * a plain "watch on TikTok" link when this returns null.
 */
export async function getTikTokOEmbed(
  videoUrl: string,
): Promise<TikTokOEmbedData | null> {
  try {
    const res = await fetch(
      `https://www.tiktok.com/oembed?url=${encodeURIComponent(videoUrl)}`,
      { next: { revalidate: 86_400 } },
    );
    if (!res.ok) return null;

    const data = (await res.json()) as {
      thumbnail_url?: string;
      title?: string;
    };
    if (!data.thumbnail_url) return null;

    return { thumbnailUrl: data.thumbnail_url, title: data.title ?? "" };
  } catch {
    return null;
  }
}
