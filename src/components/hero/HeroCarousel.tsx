"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const SLIDE_MS = 4500;

interface HeroCarouselProps {
  images: string[];
  alt: string;
  className?: string;
}

/**
 * Auto-advancing photo carousel for the hero. Only mounts slides up to the
 * furthest one reached so far (`maxShown`) instead of all of them upfront —
 * with 11 real photos, eagerly loading every one on first paint would hurt
 * LCP for no benefit, since most won't be seen for another 45+ seconds.
 */
export function HeroCarousel({ images, alt, className }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [maxShown, setMaxShown] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => {
        const next = (i + 1) % images.length;
        setMaxShown((m) => Math.max(m, next));
        return next;
      });
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, [images.length]);

  function goTo(i: number) {
    setIndex(i);
    setMaxShown((m) => Math.max(m, i));
  }

  function goBy(delta: number) {
    goTo((index + delta + images.length) % images.length);
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-card)]",
        className,
      )}
      style={{ aspectRatio: "4/5" }}
    >
      {images.map((src, i) =>
        i <= maxShown ? (
          <Image
            key={src}
            src={src}
            alt={i === index ? alt : ""}
            aria-hidden={i === index ? undefined : true}
            fill
            priority={i === 0}
            sizes="(min-width: 1024px) 480px, 90vw"
            className={cn(
              "object-cover transition-opacity duration-700 ease-out",
              i === index ? "opacity-100" : "opacity-0",
            )}
          />
        ) : null,
      )}

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goBy(-1)}
            aria-label="Foto anterior"
            className="focus-ring absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
          >
            <ArrowRightIcon className="h-4 w-4 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => goBy(1)}
            aria-label="Foto siguiente"
            className="focus-ring absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
          >
            <ArrowRightIcon className="h-4 w-4" />
          </button>

          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Foto ${i + 1} de ${images.length}`}
                aria-current={i === index}
                className={cn(
                  "focus-ring h-1.5 rounded-full transition-all",
                  i === index ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
