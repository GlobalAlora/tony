/**
 * Plain module (no "use client") so server components (ContentPillarsSection)
 * and the client SocialEmbed component can both call this without pulling
 * one into the other's boundary — a client-only export can't be called
 * directly from server code, which is exactly what broke when this used to
 * live inside SocialEmbed.tsx before that file needed "use client".
 */
export function detectPlatform(url: string): "tiktok" | "instagram" | null {
  if (/tiktok\.com/.test(url)) return "tiktok";
  if (/instagram\.com/.test(url)) return "instagram";
  return null;
}
