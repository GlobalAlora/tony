import { ProposalForm } from "@/components/proposal-form/ProposalForm";
import { SECTION_IDS } from "@/lib/constants/site";

export function ProposalFormSection() {
  return (
    <section
      id={SECTION_IDS.proposalForm}
      aria-labelledby="proposal-form-heading"
      className="relative overflow-hidden border-t border-line/60 py-[var(--spacing-section)]"
    >
      <div
        aria-hidden="true"
        className="decorative-blob decorative-blob--delay pointer-events-none absolute -bottom-32 left-1/2 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,var(--color-accent-2)_0%,transparent_65%)] opacity-[0.12] blur-3xl"
      />
      <div className="relative px-[var(--spacing-gutter)]">
        <ProposalForm />
      </div>
    </section>
  );
}
