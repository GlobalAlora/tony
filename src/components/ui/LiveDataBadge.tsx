import { cn } from "@/lib/utils";

function formatToday(): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());
}

/**
 * Tells the reader how fresh the stats are, without hardcoding a date that
 * would go stale — computed at render time, and this page regenerates every
 * hour (see `revalidate` on the routes that use live data), so it never
 * lags more than an hour behind the real numbers.
 */
export function LiveDataBadge({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium text-ink-faint",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
      Datos en vivo · actualizado {formatToday()}
    </p>
  );
}
