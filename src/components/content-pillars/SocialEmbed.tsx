import { LazyEmbed } from "@/components/content-pillars/LazyEmbed";
import { getTikTokEmbedHtml } from "@/lib/tiktok/oembed";

interface SocialEmbedProps {
  url: string;
}

export function detectPlatform(url: string): "tiktok" | "instagram" | null {
  if (/tiktok\.com/.test(url)) return "tiktok";
  if (/instagram\.com/.test(url)) return "instagram";
  return null;
}

/**
 * Renders the official embed markup for a TikTok/Instagram URL — but not
 * the platform <Script> tag. That's hoisted once to the parent section
 * (ContentPillarsSection) instead of one-per-card: loading embed.js
 * multiple times on the same page had each instance's DOM scan race the
 * others, non-deterministically collapsing some embeds to ~150px/1px on
 * every reload.
 *
 * For TikTok, the markup comes from TikTok's own oEmbed API rather than
 * being hand-rolled: embed.js's resize logic depends on the exact inline
 * styles and fallback content that API returns. The result is handed to
 * LazyEmbed so it only enters the DOM once its card is scrolled into view
 * — see that file for why (staggers TikTok's own postMessage race).
 * Returns null (caller falls back to the placeholder) if the oEmbed call
 * fails for any reason.
 */
export async function SocialEmbed({ url }: SocialEmbedProps) {
  const platform = detectPlatform(url);

  if (platform === "tiktok") {
    const html = await getTikTokEmbedHtml(url);
    if (!html) return null;

    return <LazyEmbed html={html} />;
  }

  if (platform === "instagram") {
    return (
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{ width: "100%" }}
      />
    );
  }

  return null;
}
