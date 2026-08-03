"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SLIDE_MS = 4500;

interface HeroCarouselProps {
  images: string[];
  alt: string;
  className?: string;
}

/**
 * Auto-advancing photo carousel for the hero — no manual controls, photos
 * just cycle on their own. Only mounts slides up to the furthest one
 * reached so far (`maxShown`) instead of all of them upfront — with 11
 * real photos, eagerly loading every one on first paint would hurt LCP for
 * no benefit, since most won't be seen for another 45+ seconds.
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
    </div>
  );
}
