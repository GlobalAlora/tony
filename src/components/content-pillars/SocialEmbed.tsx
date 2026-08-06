import {
  detectPlatform,
  extractTikTokVideoId,
} from "@/components/content-pillars/detectPlatform";
import { TikTokPlayer } from "@/components/content-pillars/TikTokPlayer";
import { getTikTokOEmbed } from "@/lib/tiktok/oembed";

interface SocialEmbedProps {
  url: string;
}

export async function SocialEmbed({ url }: SocialEmbedProps) {
  const platform = detectPlatform(url);

  if (platform === "tiktok") {
    const videoId = extractTikTokVideoId(url);
    if (!videoId) return null;

    const oembed = await getTikTokOEmbed(url);

    return (
      <div style={{ width: "100%", maxWidth: 325, height: 740 }}>
        <TikTokPlayer
          videoId={videoId}
          thumbnailUrl={oembed?.thumbnailUrl ?? null}
          title={oembed?.title ?? ""}
          fallbackUrl={url}
        />
      </div>
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
