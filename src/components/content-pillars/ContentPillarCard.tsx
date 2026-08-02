import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { SocialEmbed } from "@/components/content-pillars/SocialEmbed";
import type { ContentPillar } from "@/lib/constants/creator-data";

export function ContentPillarCard({ pillar }: { pillar: ContentPillar }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-raised">
      <div className="bg-surface-overlay p-3">
        {pillar.embedUrl ? (
          <SocialEmbed url={pillar.embedUrl} />
        ) : (
          <MediaPlaceholder
            alt={`Video de ejemplo — ${pillar.title}`}
            label="Agregá un link de TikTok/Reel real en CONTENT_PILLARS (embedUrl)"
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
