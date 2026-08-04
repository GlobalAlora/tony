"use client";

import { useEffect, useMemo, useState } from "react";
import { useInViewOnce } from "@/hooks/useInViewOnce";

interface CountUpProps {
  /** Final display value, e.g. "357.5K", "55.7M", "608". */
  value: string;
  durationMs?: number;
  className?: string;
}

interface ParsedValue {
  number: number;
  suffix: string;
  decimals: number;
}

function parseValue(value: string): ParsedValue | null {
  const match = value.match(/^([\d,.]+)\s*(K|M)?$/i);
  if (!match) return null;

  const raw = match[1].replace(/,/g, "");
  const number = parseFloat(raw);
  if (Number.isNaN(number)) return null;

  const decimalPart = raw.split(".")[1];
  return { number, suffix: match[2] ?? "", decimals: decimalPart?.length ?? 0 };
}

/**
 * Counts up from 0 to the final value once it scrolls into view. Only
 * animates values that parse as plain "123", "357.5K", "55.7M" style
 * strings — anything else (e.g. a future non-numeric stat) just renders as
 * static text, no silent breakage. Skips the animation under
 * prefers-reduced-motion, jumping straight to the final value.
 */
export function CountUp({ value, durationMs = 1400, className }: CountUpProps) {
  // Memoized on `value`: parseValue returns a fresh object every call, and
  // without this, the effect below re-ran on every render (its deps array
  // saw a "new" parsed object each time) — cancelling and restarting the
  // rAF loop from scratch before it could ever advance past ~0, so the
  // count-up appeared permanently stuck instead of finishing.
  const parsed = useMemo(() => parseValue(value), [value]);
  const { ref, isInView } = useInViewOnce<HTMLSpanElement>(0.4);
  const [display, setDisplay] = useState(() => (parsed ? `0${parsed.suffix}` : value));

  useEffect(() => {
    if (!parsed || !isInView) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const raf = requestAnimationFrame(() => setDisplay(value));
      return () => cancelAnimationFrame(raf);
    }

    let raf: number;
    const start = performance.now();

    function tick(now: number) {
      // Clamp both ends: some environments' requestAnimationFrame
      // timestamp doesn't reliably correlate with performance.now() (seen
      // in jsdom, via the regression test) — an unclamped negative
      // progress sends `eased` to a huge negative number instead of 0.
      const progress = Math.max(0, Math.min((now - start) / durationMs, 1));
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = parsed!.number * eased;
      setDisplay(`${current.toFixed(parsed!.decimals)}${parsed!.suffix}`);
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(value);
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, parsed, value, durationMs]);

  if (!parsed) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
