import { ImageResponse } from "next/og";
import { CREATOR, getSocialProfiles } from "@/lib/constants/creator-data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${CREATOR.displayName} — Media Kit`;
// Without this, Next.js renders the image once at build time and never
// again — the exact bug that left this OG image showing stale follower
// counts after they'd already gone live everywhere else on the site.
export const revalidate = 3600;

/**
 * Generated instead of a static asset: 11 real photos exist now (see
 * HeroCarousel), but a rotating carousel has no single canonical portrait
 * to use as the OG image, so a data card fits better here anyway. Pulls
 * from the same live-merged data as the rest of the page (getSocialProfiles),
 * so the numbers shown when this gets shared can't drift from what's on
 * the page.
 */
export default async function OpengraphImage() {
  const socialProfiles = await getSocialProfiles();
  const tiktok = socialProfiles.find((p) => p.platform === "tiktok")!;
  const instagram = socialProfiles.find((p) => p.platform === "instagram")!;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#0d0d0e",
          backgroundImage:
            "radial-gradient(circle at 82% 18%, rgba(214,255,71,0.18) 0%, transparent 55%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#a6a6ad",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              backgroundColor: "#d6ff47",
              display: "flex",
            }}
          />
          {CREATOR.location.city}, {CREATOR.location.country} · Media Kit
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 108,
              fontWeight: 800,
              color: "#f5f5f4",
              lineHeight: 1,
            }}
          >
            {CREATOR.displayName}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 32,
              color: "#d4d4d8",
              maxWidth: 900,
            }}
          >
            Humor, vida universitaria y lifestyle para {tiktok.followersDisplay}+
            seguidores en TikTok e Instagram.
          </div>
        </div>

        <div style={{ display: "flex", gap: 56 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 22, color: "#a6a6ad" }}>
              TikTok · {tiktok.handle}
            </div>
            <div style={{ fontSize: 48, fontWeight: 700, color: "#d6ff47" }}>
              {tiktok.followersDisplay}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 22, color: "#a6a6ad" }}>
              Instagram · {instagram.handle}
            </div>
            <div style={{ fontSize: 48, fontWeight: 700, color: "#f5f5f4" }}>
              {instagram.followersDisplay}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 22, color: "#a6a6ad" }}>
              Likes totales TikTok
            </div>
            <div style={{ fontSize: 48, fontWeight: 700, color: "#f5f5f4" }}>
              {tiktok.secondaryMetric.value}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
