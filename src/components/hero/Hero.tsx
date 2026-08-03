import { Button } from "@/components/ui/Button";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { CREATOR, SOCIAL_PROFILES } from "@/lib/constants/creator-data";
import { SECTION_IDS } from "@/lib/constants/site";

export function Hero() {
  return (
    <section
      id={SECTION_IDS.hero}
      aria-labelledby="hero-heading"
      className="relative overflow-hidden pb-[var(--spacing-section-sm)] pt-14 sm:pt-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--color-accent)_0%,transparent_65%)] opacity-[0.14] blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-[var(--spacing-gutter)] lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-8">
        <div className="animate-fade-up">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface-raised px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-ink-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {CREATOR.location.city}, {CREATOR.location.country} · Media Kit
          </p>

          <h1
            id="hero-heading"
            className="text-[length:var(--text-hero)] font-display font-bold leading-[0.95] tracking-tight text-ink"
          >
            {CREATOR.displayName}
          </h1>

          <p className="mt-6 max-w-xl text-[length:var(--text-lead)] leading-relaxed text-ink-muted text-pretty">
            Creador de contenido en {CREATOR.location.city},{" "}
            {CREATOR.location.province}. Humor cotidiano, vida universitaria
            y lifestyle para más de 357K seguidores entre TikTok e
            Instagram.
          </p>

          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
            {SOCIAL_PROFILES.map((profile) => (
              <div key={profile.platform}>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-faint">
                  <a
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring rounded transition-colors hover:text-accent"
                  >
                    {profile.label} · {profile.handle}
                  </a>
                </dt>
                <dd className="font-display text-2xl font-bold text-ink">
                  {profile.followersDisplay}
                  <span className="ml-1 text-xs font-medium text-ink-muted">
                    seguidores
                  </span>
                </dd>
              </div>
            ))}
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-ink-faint">
                Likes totales TikTok
              </dt>
              <dd className="font-display text-2xl font-bold text-accent">
                55.2M
              </dd>
            </div>
          </dl>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href={`#${SECTION_IDS.proposalForm}`} size="lg">
              Trabajemos juntos
            </Button>
            <Button href={`#${SECTION_IDS.stats}`} variant="secondary" size="lg">
              Ver números
            </Button>
          </div>
        </div>

        <MediaPlaceholder
          alt={`Foto de ${CREATOR.displayName}`}
          label="Reemplazar con foto real de Tony (/public/images/hero.jpg)"
          aspectRatio="4/5"
          priority
          className="animate-fade-up mx-auto w-full max-w-sm lg:max-w-none"
        />
      </div>
    </section>
  );
}
