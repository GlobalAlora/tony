import { Button } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { LiveDataBadge } from "@/components/ui/LiveDataBadge";
import { HeroCarousel } from "@/components/hero/HeroCarousel";
import {
  CREATOR,
  getSocialProfiles,
  getTotalFollowersDisplay,
} from "@/lib/constants/creator-data";
import { SECTION_IDS } from "@/lib/constants/site";

const HERO_IMAGES = Array.from(
  { length: 11 },
  (_, i) => `/images/hero/hero-${i + 1}.jpeg`,
);

export async function Hero() {
  const [socialProfiles, totalFollowers] = await Promise.all([
    getSocialProfiles(),
    getTotalFollowersDisplay(),
  ]);
  const tiktokProfile = socialProfiles.find((p) => p.platform === "tiktok");

  return (
    <section
      id={SECTION_IDS.hero}
      aria-labelledby="hero-heading"
      className="relative overflow-hidden pb-[var(--spacing-section-sm)] pt-14 sm:pt-20"
    >
      <div
        aria-hidden="true"
        className="decorative-blob pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,var(--color-accent)_0%,transparent_65%)] opacity-[0.14] blur-3xl"
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
            Soy creador de contenido en {CREATOR.location.city},{" "}
            {CREATOR.location.province}. Humor cotidiano, vida universitaria
            y lifestyle para más de {totalFollowers} seguidores en redes
            sociales.
          </p>

          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
            {socialProfiles.map((profile) => (
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
                  <CountUp value={profile.followersDisplay} />
                  <span className="ml-1 text-xs font-medium text-ink-muted">
                    seguidores
                  </span>
                </dd>
              </div>
            ))}
            {tiktokProfile ? (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-faint">
                  {tiktokProfile.secondaryMetric.label}
                </dt>
                <dd className="font-display text-2xl font-bold text-accent">
                  <CountUp value={tiktokProfile.secondaryMetric.value} />
                </dd>
              </div>
            ) : null}
          </dl>

          <LiveDataBadge className="mt-3" />

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href={`#${SECTION_IDS.proposalForm}`} size="lg">
              Trabajemos juntos
            </Button>
            <Button href={`#${SECTION_IDS.stats}`} variant="secondary" size="lg">
              Ver números
            </Button>
          </div>
        </div>

        <HeroCarousel
          images={HERO_IMAGES}
          alt={`Foto de ${CREATOR.displayName}`}
          className="animate-fade-up mx-auto w-full max-w-sm lg:max-w-none"
        />
      </div>
    </section>
  );
}
