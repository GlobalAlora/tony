import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatCard } from "@/components/stats/StatCard";
import { HEADLINE_STATS } from "@/lib/constants/creator-data";
import { SECTION_IDS } from "@/lib/constants/site";

export function StatsSection() {
  return (
    <section
      id={SECTION_IDS.stats}
      aria-labelledby="stats-heading"
      className="border-t border-line/60 bg-surface py-[var(--spacing-section-sm)]"
    >
      <div className="mx-auto max-w-6xl px-[var(--spacing-gutter)]">
        <SectionHeading
          headingId="stats-heading"
          eyebrow="En números"
          title="Alcance real, sin vueltas"
          lead="Los datos duros que una marca necesita para evaluar una colaboración, de un vistazo."
        />

        <div className="mt-10 grid grid-cols-2 gap-4">
          {HEADLINE_STATS.map((stat, i) => (
            <Reveal key={stat.id} delayMs={i * 60} className={i === 0 ? "col-span-2" : undefined}>
              <StatCard stat={stat} featured={i === 0} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
