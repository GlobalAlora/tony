"use client";

import type { ReactNode } from "react";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}

/** Fades content up once it scrolls into view. No-ops visually under prefers-reduced-motion (see globals.css). */
export function Reveal({ children, className, delayMs = 0 }: RevealProps) {
  const { ref, isInView } = useInViewOnce<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(!isInView && "opacity-0", isInView && "animate-fade-up", className)}
      style={isInView && delayMs ? { animationDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
