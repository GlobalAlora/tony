import Link from "next/link";
import {
  MailIcon,
  TikTokIcon,
  InstagramIcon,
  YouTubeIcon,
} from "@/components/ui/icons";
import {
  CREATOR,
  SOCIAL_PROFILES,
  YOUTUBE_CHANNEL,
} from "@/lib/constants/creator-data";

const PLATFORM_ICONS = {
  tiktok: TikTokIcon,
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
} as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-0 border-t border-line/60 bg-surface-raised">
      <div className="mx-auto max-w-6xl px-[var(--spacing-gutter)] py-12">
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <p className="font-display text-lg font-bold text-ink">
              {CREATOR.displayName}
            </p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-muted">
              {CREATOR.location.city}, {CREATOR.location.province},{" "}
              {CREATOR.location.country}
            </p>
            <a
              href={`mailto:${CREATOR.email}`}
              className="focus-ring mt-4 inline-flex items-center gap-2 rounded-full text-sm font-medium text-ink transition-colors hover:text-accent"
            >
              <MailIcon className="h-4 w-4" />
              {CREATOR.email}
            </a>
          </div>

          <nav aria-label="Redes sociales" className="sm:justify-self-end">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-faint">
              Redes
            </p>
            <ul className="mt-3 flex flex-col gap-3 sm:items-end">
              {SOCIAL_PROFILES.map((profile) => {
                const Icon = PLATFORM_ICONS[profile.platform];
                return (
                  <li key={profile.platform}>
                    <a
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring inline-flex items-center gap-2 rounded-full text-sm font-medium text-ink-muted transition-colors hover:text-accent"
                    >
                      <Icon className="h-4 w-4" />
                      {profile.label} {profile.handle}
                    </a>
                  </li>
                );
              })}
              <li>
                <a
                  href={YOUTUBE_CHANNEL.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex items-center gap-2 rounded-full text-sm font-medium text-ink-muted transition-colors hover:text-accent"
                >
                  <YouTubeIcon className="h-4 w-4" />
                  {YOUTUBE_CHANNEL.label} {YOUTUBE_CHANNEL.handle}
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line/60 pt-6 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {CREATOR.fullName}. Todos los derechos reservados.
          </p>
          <p className="max-w-lg sm:text-right">
            Los datos enviados por el formulario de propuestas se usan
            exclusivamente para evaluar colaboraciones comerciales y no se
            comparten con terceros. Este sitio no está afiliado oficialmente
            a TikTok, Instagram ni YouTube.
          </p>
        </div>
      </div>
    </footer>
  );
}
