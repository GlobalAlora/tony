import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CREATOR } from "@/lib/constants/creator-data";
import { SECTION_IDS } from "@/lib/constants/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-[var(--spacing-gutter)]">
        <Link
          href={`#${SECTION_IDS.hero}`}
          className="focus-ring flex items-center gap-2 rounded-full font-display text-sm font-bold uppercase tracking-[0.15em] text-ink"
        >
          <span
            className="inline-block h-2 w-2 rounded-full bg-accent"
            aria-hidden="true"
          />
          {CREATOR.displayName}
        </Link>

        <Button href={`#${SECTION_IDS.proposalForm}`} size="md">
          Trabajemos juntos
        </Button>
      </div>
    </header>
  );
}
