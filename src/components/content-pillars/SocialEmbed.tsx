interface SocialEmbedProps {
  url: string;
}

export function detectPlatform(url: string): "tiktok" | "instagram" | null {
  if (/tiktok\.com/.test(url)) return "tiktok";
  if (/instagram\.com/.test(url)) return "instagram";
  return null;
}

function extractTikTokVideoId(url: string): string | null {
  return url.match(/\/video\/(\d+)/)?.[1] ?? null;
}

/**
 * Renders a direct iframe at TikTok's own /embed/v2/{id} page instead of
 * the official blockquote+embed.js mechanism. That mechanism resizes the
 * iframe via a postMessage the iframe sends back once its internal data
 * fetch resolves — with several TikTok embeds on one page, that message
 * gets dropped for some of them at random, permanently leaving a blank
 * ~1px-tall iframe. Confirmed the /embed/v2 page renders its full player
 * completely on its own (verified via direct navigation: real view/like/
 * comment counts and a working <video>), with no dependency on the parent
 * page's JS at all — the postMessage dance only exists so the *parent*
 * knows how tall to make the iframe, not for the embedded content itself
 * to work. A fixed height sidesteps that race entirely, at the cost of
 * some unused whitespace for videos with a short caption.
 */
export function SocialEmbed({ url }: SocialEmbedProps) {
  const platform = detectPlatform(url);

  if (platform === "tiktok") {
    const videoId = extractTikTokVideoId(url);
    if (!videoId) return null;

    return (
      <iframe
        src={`https://www.tiktok.com/embed/v2/${videoId}?lang=es`}
        title="TikTok video"
        allow="encrypted-media;"
        allowFullScreen
        scrolling="no"
        style={{ width: "100%", maxWidth: 325, height: 740, border: "none" }}
      />
    );
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
