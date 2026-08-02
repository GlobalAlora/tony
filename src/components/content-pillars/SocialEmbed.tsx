"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    tiktokEmbedLoad?: () => void;
    instgrm?: { Embeds: { process: () => void } };
  }
}

interface SocialEmbedProps {
  url: string;
}

function detectPlatform(url: string): "tiktok" | "instagram" | null {
  if (/tiktok\.com/.test(url)) return "tiktok";
  if (/instagram\.com/.test(url)) return "instagram";
  return null;
}

/**
 * Renders the official TikTok/Instagram oEmbed blockquote and lazy-loads
 * that platform's embed script — only when a real `embedUrl` is supplied,
 * so no third-party script ships while pillars are still placeholders.
 */
export function SocialEmbed({ url }: SocialEmbedProps) {
  const platform = detectPlatform(url);

  useEffect(() => {
    if (platform === "tiktok") {
      window.tiktokEmbedLoad?.();
    }
    if (platform === "instagram") {
      window.instgrm?.Embeds.process();
    }
  }, [platform, url]);

  if (platform === "tiktok") {
    const videoId = url.match(/\/video\/(\d+)/)?.[1];
    return (
      <>
        <blockquote
          className="tiktok-embed"
          cite={url}
          data-video-id={videoId}
          style={{ maxWidth: "100%", minWidth: "260px" }}
        >
          <section />
        </blockquote>
        <Script src="https://www.tiktok.com/embed.js" strategy="lazyOnload" />
      </>
    );
  }

  if (platform === "instagram") {
    return (
      <>
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={url}
          data-instgrm-version="14"
          style={{ width: "100%" }}
        />
        <Script src="https://www.instagram.com/embed.js" strategy="lazyOnload" />
      </>
    );
  }

  return null;
}
