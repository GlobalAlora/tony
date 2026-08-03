"use client";

import { useInViewOnce } from "@/hooks/useInViewOnce";

/**
 * Only inserts the embed's HTML into the DOM once its card scrolls into
 * view, instead of all pillar cards mounting their TikTok blockquote at
 * once on page load. TikTok's embed.js resizes each player via a
 * postMessage the iframe sends back once its own data fetch resolves —
 * with several TikTok iframes initializing simultaneously, that message
 * gets dropped for some of them at random, permanently collapsing those
 * players to ~1-150px (confirmed: reloading the page breaks a different,
 * random subset each time). Staggering when each blockquote enters the DOM
 * (naturally spread out as the user scrolls) avoids the pile-up.
 */
export function LazyEmbed({ html }: { html: string }) {
  const { ref, isInView } = useInViewOnce<HTMLDivElement>(0.1);

  return (
    <div ref={ref} style={{ minHeight: isInView ? undefined : 300, width: "100%" }}>
      {isInView ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null}
    </div>
  );
}
