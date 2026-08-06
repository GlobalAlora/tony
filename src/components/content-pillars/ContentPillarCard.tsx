import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { SocialEmbed } from "@/components/content-pillars/SocialEmbed";
import type { ContentPillar } from "@/lib/constants/creator-data";

export function ContentPillarCard({ pillar }: { pillar: ContentPillar }) {
  const embedUrl = pillar.embedUrls?.[0];

  return (
    <article className="flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-raised">
      {/*
        No horizontal padding below sm: TikTok's embed has a hardcoded
        min-width:325px, and on a ~375px phone the padded content area fell
        just short of that (309px) — with this card's overflow-hidden, the
        video was silently clipped away instead of shown.
      */}
      <div className="flex justify-center overflow-x-auto bg-surface-overlay px-0 py-3 sm:p-3">
        {embedUrl ? (
          <SocialEmbed url={embedUrl} />
        ) : (
          <MediaPlaceholder
            alt={`Video de ejemplo — ${pillar.title}`}
            label="Agregá un link de TikTok/Reel real en CONTENT_PILLARS (embedUrls)"
            aspectRatio="9/16"
            className="mx-auto max-w-[240px]"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg font-bold text-ink">
          {pillar.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
          {pillar.description}
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {pillar.keywords.map((keyword) => (
            <li
              key={keyword}
              className="rounded-full bg-surface-overlay px-3 py-1 text-xs font-medium text-ink-muted"
            >
              #{keyword}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
