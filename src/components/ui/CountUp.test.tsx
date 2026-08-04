import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { CountUp } from "@/components/ui/CountUp";

/**
 * Regression test for a real bug: parseValue() returned a fresh object on
 * every render, and that object sat in the animation effect's dependency
 * array — so the effect re-ran (cancelling and restarting the rAF loop,
 * resetting its start time) on every single setDisplay-triggered render,
 * and the count-up could never advance past ~0%. Fixed by memoizing the
 * parsed value on `value`.
 *
 * Drives requestAnimationFrame with a manually-controlled clock rather
 * than real timers: jsdom's rAF doesn't reliably correlate with
 * performance.now() (confirmed while writing this test — progress went
 * negative, then got stuck at 0 with real timers), so a deterministic
 * fake clock is both more reliable and exercises the exact frame-by-frame
 * path production code runs.
 */
describe("CountUp", () => {
  let rafQueue: FrameRequestCallback[];
  let clock: number;

  beforeEach(() => {
    window.IntersectionObserver = class {
      constructor(private callback: IntersectionObserverCallback) {}
      observe() {
        this.callback(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          this as unknown as IntersectionObserver,
        );
      }
      disconnect() {}
      unobserve() {}
    } as unknown as typeof IntersectionObserver;

    window.matchMedia = vi
      .fn()
      .mockReturnValue({ matches: false }) as unknown as typeof window.matchMedia;

    rafQueue = [];
    clock = 0;
    vi.spyOn(window, "performance", "get").mockReturnValue({
      now: () => clock,
    } as Performance);
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      rafQueue.push(cb);
      return rafQueue.length;
    });
    vi.stubGlobal("cancelAnimationFrame", () => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  function advance(ms: number) {
    clock += ms;
    const queue = rafQueue;
    rafQueue = [];
    act(() => {
      queue.forEach((cb) => cb(clock));
    });
  }

  test("counts up and reaches the final value", () => {
    render(<CountUp value="357.5K" durationMs={100} />);

    expect(screen.getByText("0K")).toBeInTheDocument();

    // Midway through: should have progressed, but not reached the final value.
    advance(50);
    const mid = screen.getByText(/K$/).textContent;
    expect(mid).not.toBe("0K");
    expect(mid).not.toBe("357.5K");

    // Past the full duration: must land exactly on the real value, not
    // drift off it (and must not still be "stuck" near 0).
    advance(60);
    expect(screen.getByText("357.5K")).toBeInTheDocument();
  });

  test("renders non-numeric values as static text", () => {
    render(<CountUp value="Cargando dato" />);
    expect(screen.getByText("Cargando dato")).toBeInTheDocument();
  });
});
