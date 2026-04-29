import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logoBuffer = await readFile(join(process.cwd(), "public", "lsgt-logo.png"));
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "linear-gradient(135deg, #040f24 0%, #0a1f4a 40%, #0f3270 72%, #1f7fb5 100%)",
          color: "#f5fbff",
          padding: 46,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            borderRadius: 28,
            border: "1px solid rgba(255,255,255,0.20)",
            background: "rgba(2, 8, 23, 0.46)",
            backdropFilter: "blur(8px)",
            padding: 34,
            gap: 28,
          }}
        >
          <div
            style={{
              width: 320,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 22,
              background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(226,240,255,0.9))",
              border: "1px solid rgba(255,255,255,0.65)",
            }}
          >
            <img src={logoSrc} alt="GlobalTech logo" width={250} height={250} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
            <div style={{ fontSize: 60, fontWeight: 800, letterSpacing: -1 }}>MSP Plans | GlobalTech</div>
            <div style={{ marginTop: 14, fontSize: 32, fontWeight: 600, color: "#d6ecff" }}>
              Essential, Professional, Enterprise
            </div>
            <div style={{ marginTop: 20, fontSize: 28, lineHeight: 1.25, color: "#d9e9fb" }}>
              Calculate your estimate and send your selected plan for direct follow-up.
            </div>
            <div style={{ marginTop: 26, fontSize: 22, color: "#a8dfff" }}>lonestarglobaltech.com/msp</div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
