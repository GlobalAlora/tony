import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { TikTokPlayer } from "@/components/content-pillars/TikTokPlayer";

/**
 * Regression coverage for a real bug: auto-loading TikTok video embeds (even
 * staggered) still triggered TikTok's own "overload-protect triggered"
 * response intermittently. Nothing should ever request TikTok until the
 * visitor deliberately clicks — this locks in that the iframe only mounts
 * after a click, never before.
 */
describe("TikTokPlayer", () => {
  test("shows a play button with the thumbnail, no iframe, before any click", () => {
    render(
      <TikTokPlayer
        videoId="123"
        thumbnailUrl="https://example.com/thumb.jpg"
        title="Un video"
        fallbackUrl="https://www.tiktok.com/@t0ni_00/video/123"
      />,
    );

    expect(screen.queryByTitle("TikTok video")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reproducir video de tiktok: un video/i })).toBeInTheDocument();
    expect(screen.getByAltText("Un video")).toHaveAttribute(
      "src",
      "https://example.com/thumb.jpg",
    );
  });

  test("mounts the iframe with the right video only after a click", async () => {
    const user = userEvent.setup();
    render(
      <TikTokPlayer
        videoId="7443879490331118903"
        thumbnailUrl="https://example.com/thumb.jpg"
        title="Un video"
        fallbackUrl="https://www.tiktok.com/@t0ni_00/video/7443879490331118903"
      />,
    );

    await user.click(screen.getByRole("button", { name: /reproducir/i }));

    const iframe = screen.getByTitle("TikTok video") as HTMLIFrameElement;
    expect(iframe.src).toBe(
      "https://www.tiktok.com/embed/v2/7443879490331118903?lang=es",
    );
    expect(screen.queryByRole("button", { name: /reproducir/i })).not.toBeInTheDocument();
  });

  test("falls back to a plain label when there's no thumbnail", () => {
    render(
      <TikTokPlayer
        videoId="123"
        thumbnailUrl={null}
        title=""
        fallbackUrl="https://www.tiktok.com/@t0ni_00/video/123"
      />,
    );

    expect(screen.getByText("Ver en TikTok")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
