import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  TikTokIcon,
  InstagramIcon,
  YouTubeIcon,
  FacebookIcon,
} from "@/components/ui/icons";
import {
  CREATOR,
  SOCIAL_PROFILES,
  SECONDARY_CHANNELS,
} from "@/lib/constants/creator-data";
import { SECTION_IDS } from "@/lib/constants/site";

const PLATFORM_ICONS = {
  tiktok: TikTokIcon,
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
  facebook: FacebookIcon,
} as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-[var(--spacing-gutter)]">
        <Link
          href={`#${SECTION_IDS.hero}`}
          className="focus-ring flex items-center gap-2 rounded-full font-display text-sm font-bold uppercase tracking-[0.15em] text-ink"
        >
          <span
            className="inline-block h-2 w-2 rounded-full bg-accent"
            aria-hidden="true"
          />
          {CREATOR.displayName}
        </Link>

        <div className="flex items-center gap-4">
          <nav
            aria-label="Redes sociales"
            className="hidden items-center gap-3 sm:flex"
          >
            {SOCIAL_PROFILES.map((profile) => {
              const Icon = PLATFORM_ICONS[profile.platform];
              return (
                <a
                  key={profile.platform}
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${profile.label} de ${CREATOR.displayName} (se abre en una pestaña nueva)`}
                  className="focus-ring rounded-full text-ink-muted transition-colors hover:text-accent"
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
            {SECONDARY_CHANNELS.map((channel) => {
              const Icon = PLATFORM_ICONS[channel.platform];
              return (
                <a
                  key={channel.platform}
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${channel.label} de ${CREATOR.displayName} (se abre en una pestaña nueva)`}
                  className="focus-ring rounded-full text-ink-muted transition-colors hover:text-accent"
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </nav>

          <Button href={`#${SECTION_IDS.proposalForm}`} size="md">
            Trabajemos juntos
          </Button>
        </div>
      </div>
    </header>
  );
}
