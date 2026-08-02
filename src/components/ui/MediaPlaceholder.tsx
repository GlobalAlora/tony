import Image from "next/image";
import { cn } from "@/lib/utils";

interface MediaPlaceholderProps {
  /** Real asset path once available, e.g. "/images/hero.jpg". Omit to render the placeholder state. */
  src?: string;
  alt: string;
  /** Shown only in the placeholder state — what to drop in and where. */
  label: string;
  aspectRatio?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

/**
 * Reserves layout space (no CLS) whether or not the real asset exists yet.
 * Pass `src` once the real photo/video frame is available in /public — no
 * other changes needed, the placeholder treatment disappears automatically.
 */
export function MediaPlaceholder({
  src,
  alt,
  label,
  aspectRatio = "4/5",
  priority = false,
  sizes = "(min-width: 1024px) 480px, 90vw",
  className,
}: MediaPlaceholderProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-card)]",
        className,
      )}
      style={{ aspectRatio }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 border border-dashed border-line-strong bg-[radial-gradient(circle_at_30%_20%,var(--color-accent-2)_0%,transparent_45%),radial-gradient(circle_at_80%_80%,var(--color-accent)_0%,transparent_50%)] bg-surface-raised p-6 text-center"
        >
          <span className="font-display text-4xl font-bold text-ink/30">
            TP
          </span>
          <span className="max-w-[16rem] text-xs font-medium leading-snug text-ink-muted">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
