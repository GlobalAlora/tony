"use client";

import { useEffect, useState } from "react";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { detectPlatform } from "@/components/content-pillars/detectPlatform";

interface SocialEmbedProps {
  url: string;
  /**
   * Stagger before mounting the iframe once it scrolls into view. Browser-
   * native `loading="lazy"` wasn't enough on its own: cards in the same or
   * adjacent grid rows can all enter the viewport within the same instant,
   * still firing several requests at TikTok's embed server at once — the
   * kind of burst its own "overload-protect" response is built to catch.
   * An explicit per-card delay guarantees real time between requests
   * regardless of how close together the cards are on screen.
   */
  delayMs?: number;
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
export function SocialEmbed({ url, delayMs = 0 }: SocialEmbedProps) {
  const platform = detectPlatform(url);
  const { ref, isInView } = useInViewOnce<HTMLDivElement>(0.1);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => setReady(true), delayMs);
    return () => clearTimeout(timer);
  }, [isInView, delayMs]);

  if (platform === "tiktok") {
    const videoId = extractTikTokVideoId(url);
    if (!videoId) return null;

    return (
      <div ref={ref} style={{ width: "100%", maxWidth: 325, height: 740 }}>
        {ready ? (
          <iframe
            src={`https://www.tiktok.com/embed/v2/${videoId}?lang=es`}
            title="TikTok video"
            allow="encrypted-media;"
            allowFullScreen
            scrolling="no"
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        ) : null}
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
