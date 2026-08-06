import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { SocialEmbed } from "@/components/content-pillars/SocialEmbed";

/**
 * Regression coverage for a real bug: loading="lazy" alone wasn't enough to
 * keep multiple TikTok embeds on the same page from requesting TikTok's
 * embed server at (near) the same instant — cards in the same/adjacent grid
 * row can enter the viewport together, and TikTok's own "overload-protect"
 * response is built to catch exactly that kind of burst. SocialEmbed now
 * only mounts its iframe `delayMs` after becoming visible, so callers can
 * stagger several embeds on one page.
 */
describe("SocialEmbed", () => {
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

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("does not mount the iframe until the stagger delay elapses", () => {
    render(
      <SocialEmbed url="https://www.tiktok.com/@t0ni_00/video/123" delayMs={1000} />,
    );

    expect(screen.queryByTitle("TikTok video")).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(screen.queryByTitle("TikTok video")).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByTitle("TikTok video")).toBeInTheDocument();
  });

  test("staggers multiple embeds so their iframes mount at different times", () => {
    render(
      <>
        <SocialEmbed url="https://www.tiktok.com/@t0ni_00/video/111" delayMs={0} />
        <SocialEmbed url="https://www.tiktok.com/@t0ni_00/video/222" delayMs={1000} />
        <SocialEmbed url="https://www.tiktok.com/@t0ni_00/video/333" delayMs={2000} />
      </>,
    );

    // Even a 0ms delay still goes through setTimeout, which needs a timer
    // flush to fire — it isn't synchronous with mount.
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(screen.getAllByTitle("TikTok video")).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getAllByTitle("TikTok video")).toHaveLength(2);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getAllByTitle("TikTok video")).toHaveLength(3);
  });

  test("sets the correct iframe src for the video id", () => {
    render(
      <SocialEmbed
        url="https://www.tiktok.com/@t0ni_00/video/7443879490331118903"
        delayMs={0}
      />,
    );

    act(() => {
      vi.runAllTimers();
    });

    const iframe = screen.getByTitle("TikTok video") as HTMLIFrameElement;
    expect(iframe.src).toBe(
      "https://www.tiktok.com/embed/v2/7443879490331118903?lang=es",
    );
  });
});
