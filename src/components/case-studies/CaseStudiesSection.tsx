import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CASE_STUDIES } from "@/lib/constants/creator-data";
import { SECTION_IDS } from "@/lib/constants/site";

export function CaseStudiesSection() {
  return (
    <section
      id={SECTION_IDS.caseStudies}
      aria-labelledby="cases-heading"
      className="border-t border-line/60 py-[var(--spacing-section)]"
    >
      <div className="mx-auto max-w-6xl px-[var(--spacing-gutter)]">
        <SectionHeading
          headingId="cases-heading"
          eyebrow="Colaboraciones"
          title="Casos anteriores"
          lead="Espacio listo para reemplazar por colaboraciones reales — objetivo, formato y resultado en una línea."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CASE_STUDIES.map((caseStudy, i) => (
            <Reveal key={caseStudy.id} delayMs={i * 60}>
              <article className="flex h-full flex-col rounded-[var(--radius-card)] border border-dashed border-line-strong bg-surface-raised p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg font-bold text-ink">
                    {caseStudy.brandName}
                  </h3>
                  {caseStudy.isExample ? (
                    <span className="shrink-0 rounded-full bg-surface-overlay px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-ink-faint">
                      Ejemplo
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-accent">
                  {caseStudy.campaignType}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                  {caseStudy.summary}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-10">
          <Button href={`#${SECTION_IDS.proposalForm}`} variant="secondary">
            Trabajemos juntos
          </Button>
        </div>
      </div>
    </section>
  );
}
