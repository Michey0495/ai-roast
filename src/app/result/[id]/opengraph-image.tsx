import { ImageResponse } from "next/og";
import { kv } from "@vercel/kv";
import type { RoastResult } from "@/types";

export const runtime = "edge";
export const alt = "AIローストの結果";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const accent = "#f97316";

export default async function OGImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await kv.get<RoastResult>(`roast:${id}`);

  if (!result) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#000",
            color: "#fff",
            fontSize: 48,
            fontWeight: 900,
          }}
        >
          AIロースト
        </div>
      ),
      { ...size }
    );
  }

  const lines = result.roast
    .split("\n")
    .filter((l) => l.trim())
    .slice(0, 2);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#000",
          color: "#fff",
          padding: 60,
          position: "relative",
        }}
      >
        {/* Accent line top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: accent,
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 40,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: accent, fontSize: 32, fontWeight: 900 }}>
              {"//"}
            </span>
            <span style={{ fontSize: 24, fontWeight: 700 }}>AIロースト</span>
          </div>
          <span style={{ fontSize: 18, color: "rgba(255,255,255,0.4)" }}>
            ai-roast.ezoai.jp
          </span>
        </div>

        {/* Center: name + quote */}
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            gap: 24,
          }}
        >
          <div style={{ fontSize: 42, fontWeight: 900 }}>
            {result.input.name.slice(0, 20)}
          </div>

          {/* Quote style roast */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              borderLeft: `4px solid ${accent}`,
              paddingLeft: 24,
            }}
          >
            {lines.map((line, i) => (
              <div
                key={i}
                style={{
                  fontSize: 24,
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.5,
                }}
              >
                {line.slice(0, 60)}
                {line.length > 60 ? "..." : ""}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: 24,
          }}
        >
          <span style={{ fontSize: 16, color: "rgba(255,255,255,0.4)" }}>
            by AIロースト
          </span>
          <span style={{ fontSize: 14, color: "rgba(255,255,255,0.3)" }}>
            ezoai.jp
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
