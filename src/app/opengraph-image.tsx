import { ImageResponse } from "next/og";
import { CREATOR, SOCIAL_PROFILES } from "@/lib/constants/creator-data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${CREATOR.displayName} — Media Kit`;

/**
 * Generated instead of a static asset: there's no real hero photo in
 * /public yet (see MediaPlaceholder), and shipping a placeholder photo as
 * the OG image would be a worse first impression than a clean data card.
 * Pulls from the same creator-data constants as the page, so the numbers
 * shown when this gets shared can never drift from what's on the page.
 */
export default function OpengraphImage() {
  const tiktok = SOCIAL_PROFILES.find((p) => p.platform === "tiktok")!;
  const instagram = SOCIAL_PROFILES.find((p) => p.platform === "instagram")!;

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
