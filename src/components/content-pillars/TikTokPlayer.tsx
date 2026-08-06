"use client";

import { useState } from "react";

interface TikTokPlayerProps {
  videoId: string;
  thumbnailUrl: string | null;
  title: string;
  fallbackUrl: string;
}

/**
 * Nothing loads from TikTok until the visitor actually clicks — the poster
 * is a static thumbnail from oEmbed (or, failing that, a plain link out to
 * TikTok). Fixes an intermittent bug where TikTok's own embed server
 * returned "overload-protect triggered" for some videos: that response
 * only ever came from *automatically* loading several embeds on page load.
 * A real click is a single, deliberate request — if that one ever gets
 * rate-limited, the visitor can just click again, instead of part of the
 * page silently being broken on load.
 */
export function TikTokPlayer({
  videoId,
  thumbnailUrl,
  title,
  fallbackUrl,
}: TikTokPlayerProps) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`https://www.tiktok.com/embed/v2/${videoId}?lang=es`}
        title="TikTok video"
        allow="encrypted-media;"
        allowFullScreen
        scrolling="no"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Reproducir video de TikTok${title ? `: ${title}` : ""}`}
      className="group relative block h-full w-full overflow-hidden bg-black"
    >
      {thumbnailUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- external, per-video, signed CDN URL; not worth a remotePatterns wildcard for a poster image
        <img
          src={thumbnailUrl}
          alt={title || "Miniatura del video de TikTok"}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-ink-faint">
          Ver en TikTok
          <span className="sr-only">: {fallbackUrl}</span>
        </span>
      )}
      <span className="absolute inset-0 flex items-center justify-center bg-black/15 transition-colors group-hover:bg-black/35">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-black shadow-lg transition-transform group-hover:scale-105">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="ml-1 h-6 w-6"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
