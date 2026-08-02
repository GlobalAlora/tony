import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CREATOR } from "@/lib/constants/creator-data";
import { SECTION_IDS } from "@/lib/constants/site";

const VOICE_TAGS = ["Cercano", "Espontáneo", "Humorístico", "Sin filtro"];

export function AboutSection() {
  return (
    <section
      id={SECTION_IDS.about}
      aria-labelledby="about-heading"
      className="py-[var(--spacing-section)]"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-[var(--spacing-gutter)] lg:grid-cols-[1fr_0.7fr] lg:gap-16">
        <Reveal>
          <SectionHeading
            headingId="about-heading"
            eyebrow="Quién soy"
            title="Contenido que se siente real, no producido"
          />
          <article className="mt-6 space-y-5">
            {CREATOR.bio.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="max-w-2xl text-[length:var(--text-base)] leading-relaxed text-ink-muted text-pretty"
              >
                {paragraph}
              </p>
            ))}
          </article>

          <div className="mt-8">
            <Button href={`#${SECTION_IDS.proposalForm}`} variant="secondary">
              Trabajemos juntos
            </Button>
          </div>
        </Reveal>

        <Reveal delayMs={100}>
          <div className="rounded-[var(--radius-card)] border border-line bg-surface-raised p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
              Tono de marca personal
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {VOICE_TAGS.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-line-strong px-3.5 py-1.5 text-sm font-medium text-ink"
                >
                  {tag}
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-line pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
                Base
              </p>
              <p className="mt-2 font-display text-xl font-bold text-ink">
                {CREATOR.location.city}, {CREATOR.location.province}
              </p>
              <p className="text-sm text-ink-muted">{CREATOR.location.country}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
