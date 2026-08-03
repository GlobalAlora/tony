import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getFaqItems } from "@/lib/constants/faq";
import { SECTION_IDS } from "@/lib/constants/site";

/**
 * Answers render fully expanded — no accordion/collapse. Critical info
 * (rates, metrics, contact) must sit in the initial DOM for generative
 * engines that don't execute JS or interact with the page (see project
 * GEO/AEO requirements). `dl`/`dt`/`dd` mirrors the FAQPage JSON-LD 1:1.
 */
export async function FAQSection() {
  const faqItems = await getFaqItems();

  return (
    <section
      id={SECTION_IDS.faq}
      aria-labelledby="faq-heading"
      className="border-t border-line/60 py-[var(--spacing-section)]"
    >
      <div className="mx-auto max-w-4xl px-[var(--spacing-gutter)]">
        <SectionHeading
          headingId="faq-heading"
          eyebrow="Preguntas frecuentes"
          title="Todo lo que una marca necesita saber"
        />

        <dl className="mt-10 divide-y divide-line">
          {faqItems.map((item, i) => (
            <Reveal key={item.question} delayMs={Math.min(i * 40, 200)}>
              <div className="py-6">
                <dt className="font-display text-base font-bold text-ink sm:text-lg">
                  {item.question}
                </dt>
                <dd className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base">
                  {item.answer}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>

        <div className="mt-10 text-center">
          <Button href={`#${SECTION_IDS.proposalForm}`} size="lg">
            Trabajemos juntos
          </Button>
        </div>
      </div>
    </section>
  );
}
