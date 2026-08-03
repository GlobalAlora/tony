import { cn } from "@/lib/utils";
import type { HeadlineStat } from "@/lib/constants/creator-data";

const DECORATIVE_BAR_HEIGHTS = [40, 65, 50, 80, 60];

interface StatCardProps {
  stat: HeadlineStat;
  featured?: boolean;
}

export function StatCard({ stat, featured = false }: StatCardProps) {
  return (
    <article
      className={cn(
        "relative flex min-h-[11rem] flex-col justify-between overflow-hidden rounded-[var(--radius-card)] p-4 transition-transform duration-[var(--duration-normal)] ease-[var(--ease-out-expo)] hover:-translate-y-1 sm:p-6",
        featured
          ? "h-full bg-accent text-accent-ink"
          : "h-full border border-line bg-surface-raised text-ink",
        stat.isPlaceholder && "border-dashed border-line-strong bg-surface-raised/60",
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "absolute right-5 top-5 flex items-end gap-1 opacity-40",
          featured ? "text-accent-ink" : "text-ink-faint",
        )}
      >
        {DECORATIVE_BAR_HEIGHTS.map((h, i) => (
          <span
            key={i}
            className="w-1 rounded-full bg-current"
            style={{ height: `${h * 0.18}px` }}
          />
        ))}
      </div>

      <p
        className={cn(
          "text-xs font-semibold uppercase tracking-[0.14em]",
          featured ? "text-accent-ink/70" : "text-ink-faint",
        )}
      >
        {stat.label}
      </p>

      <div>
        <p
          className={cn(
            "font-display font-bold leading-none",
            // Non-featured cards sit two-up on mobile at ~150px wide —
            // the full --text-stat clamp (36px+) doesn't fit values like
            // "357.5K" there without cramming/overflowing. Featured stays
            // full-size since it always spans the full row width.
            featured
              ? "text-[length:var(--text-stat)]"
              : "text-3xl sm:text-[length:var(--text-stat)]",
            stat.isPlaceholder && "text-ink-faint",
          )}
        >
          {stat.value}
        </p>
        <p
          className={cn(
            "mt-2 text-sm",
            featured ? "text-accent-ink/70" : "text-ink-muted",
          )}
        >
          {stat.helpText}
        </p>
      </div>
    </article>
  );
}
