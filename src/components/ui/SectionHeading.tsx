import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  headingId: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  headingId,
  eyebrow,
  title,
  lead,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={headingId}
        className="text-[length:var(--text-h2)] font-display font-bold leading-[1.05] tracking-tight text-ink text-balance"
      >
        {title}
      </h2>
      {lead ? (
        <p className="mt-4 text-[length:var(--text-lead)] leading-relaxed text-ink-muted text-pretty">
          {lead}
        </p>
      ) : null}
    </div>
  );
}
