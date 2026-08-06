import { DemographicBarChart } from "@/components/audience/DemographicBarChart";
import { DemographicTable } from "@/components/audience/DemographicTable";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  AUDIENCE_AGE_BREAKDOWN,
  AUDIENCE_DATA_IS_PLACEHOLDER,
  AUDIENCE_GENDER_BREAKDOWN,
  AUDIENCE_TOP_LOCATIONS,
} from "@/lib/constants/creator-data";
import { SECTION_IDS } from "@/lib/constants/site";

const AGE_DATA = AUDIENCE_AGE_BREAKDOWN.map((d) => ({
  label: d.bracket,
  percent: d.percent,
}));

const GENDER_DATA = AUDIENCE_GENDER_BREAKDOWN.map((d) => ({
  label: d.label,
  percent: d.percent,
}));

const LOCATION_DATA = AUDIENCE_TOP_LOCATIONS.map((d) => ({
  label: d.label,
  percent: d.percent,
}));

const PANELS = [
  { id: "age", title: "Edad", data: AGE_DATA },
  { id: "gender", title: "Género", data: GENDER_DATA },
  { id: "location", title: "Ubicación", data: LOCATION_DATA },
] as const;

export function AudienceSection() {
  return (
    <section
      id={SECTION_IDS.audience}
      aria-labelledby="audience-heading"
      className="border-t border-line/60 py-[var(--spacing-section)]"
    >
      <div className="mx-auto max-w-6xl px-[var(--spacing-gutter)]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            headingId="audience-heading"
            eyebrow="Audiencia"
            title="A quién le llega el contenido"
            lead="Demografía de mis seguidores en TikTok, según datos oficiales de TikTok Studio."
          />
          {AUDIENCE_DATA_IS_PLACEHOLDER ? (
            <span className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-dashed border-line-strong px-3 py-1 text-xs font-semibold text-ink-faint">
              Datos de ejemplo
            </span>
          ) : null}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {PANELS.map((panel, i) => (
            <Reveal key={panel.id} delayMs={i * 80}>
              <div className="h-full rounded-[var(--radius-card)] border border-line bg-surface-raised p-6">
                <h3 className="font-display text-base font-bold text-ink">
                  {panel.title}
                </h3>
                <div className="mt-4">
                  <DemographicBarChart data={[...panel.data]} />
                </div>
                <DemographicTable title={panel.title} data={[...panel.data]} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
