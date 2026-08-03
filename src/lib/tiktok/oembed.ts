import "server-only";

/**
 * Fetches TikTok's official oEmbed HTML for a video URL, instead of
 * hand-rolling the <blockquote> ourselves. This matters because TikTok's
 * embed.js resize logic depends on the exact markup/inline styles
 * (`min-width: 325px`, real fallback content inside <section>) that the
 * oEmbed API returns — a hand-rolled blockquote with an empty <section />
 * and a different min-width caused the embed to collapse to ~150px/1px
 * instead of its real height. Accepts any valid TikTok URL, including
 * vt.tiktok.com short links (no need to resolve them ourselves).
 */
export async function getTikTokEmbedHtml(videoUrl: string): Promise<string | null> {
  try {
    const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(videoUrl)}`;
    const res = await fetch(oembedUrl, { next: { revalidate: 86400 } });
    if (!res.ok) return null;

    const data: unknown = await res.json();
    if (typeof data !== "object" || data === null || !("html" in data)) return null;

    const html = (data as { html: unknown }).html;
    return typeof html === "string" ? html : null;
  } catch {
    return null;
  }
}
