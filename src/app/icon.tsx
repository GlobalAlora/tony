import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0d0d0e",
          borderRadius: 7,
          fontFamily: "sans-serif",
          fontWeight: 800,
          fontSize: 22,
          color: "#d6ff47",
        }}
      >
        T
      </div>
    ),
    { ...size },
  );
}
