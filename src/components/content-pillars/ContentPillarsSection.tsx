import Script from "next/script";
import { ContentPillarCard } from "@/components/content-pillars/ContentPillarCard";
import { detectPlatform } from "@/components/content-pillars/detectPlatform";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CONTENT_PILLARS } from "@/lib/constants/creator-data";
import { SECTION_IDS } from "@/lib/constants/site";

export function ContentPillarsSection() {
  const platforms = new Set(
    CONTENT_PILLARS.flatMap((p) => p.embedUrls ?? []).map(detectPlatform).filter(Boolean),
  );

  return (
    <section
      id={SECTION_IDS.pillars}
      aria-labelledby="pillars-heading"
      className="border-t border-line/60 py-[var(--spacing-section)]"
    >
      <div className="mx-auto max-w-6xl px-[var(--spacing-gutter)]">
        <SectionHeading
          headingId="pillars-heading"
          eyebrow="Formatos"
          title="Cuatro pilares de contenido, un mismo tono"
          lead="Cada pilar es un formato probado con mi comunidad — listo para adaptarse al brief de una marca."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {CONTENT_PILLARS.map((pillar, i) => (
            <Reveal key={pillar.id} delayMs={i * 60}>
              <ContentPillarCard pillar={pillar} />
            </Reveal>
          ))}
        </div>
      </div>

      {/* TikTok renders via a direct iframe now (see SocialEmbed.tsx) — no
          script needed. Instagram still uses the official blockquote, so
          its script stays. */}
      {platforms.has("instagram") && (
        <Script src="https://www.instagram.com/embed.js" strategy="lazyOnload" />
      )}
    </section>
  );
}
