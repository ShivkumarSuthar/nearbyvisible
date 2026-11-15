import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

const font = (file: string) => fs.readFileSync(path.join(process.cwd(), "lib", "fonts", file));

export const ogSize = { width: 1200, height: 630 };

/** Shared 1200×630 social preview in the brand style. */
export function ogImage({ eyebrow, title, accent }: { eyebrow: string; title: string; accent?: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0b0f0c",
          backgroundImage: "radial-gradient(circle at 85% 15%, rgba(34,197,94,0.35), transparent 45%)",
          color: "white",
          fontFamily: "Poppins",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="44" height="56" viewBox="0 0 48 60">
            <path d="M24 0C11 0 0 10.5 0 23.5 0 41 24 60 24 60s24-19 24-36.5C48 10.5 37 0 24 0Z" fill="#22c55e" />
            <circle cx="24" cy="23" r="9" fill="#0b0f0c" />
          </svg>
          <div style={{ display: "flex", fontSize: 38, fontWeight: 700 }}>
            <span>Nearby</span>
            <span style={{ color: "#22c55e" }}>Visible</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 28, color: "#22c55e", fontWeight: 600 }}>{eyebrow}</div>
          <div style={{ display: "flex", flexWrap: "wrap", fontSize: title.length > 60 ? 58 : 72, fontWeight: 700, lineHeight: 1.1, letterSpacing: -1.5, maxWidth: 1040 }}>
            {[...title.split(" ").map((w) => ({ w, on: false })), ...(accent ? accent.split(" ").map((w) => ({ w, on: true })) : [])].map(({ w, on }, i) => (
              <span key={i} style={{ marginRight: 18, color: on ? "#22c55e" : "white" }}>
                {w}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 24, fontWeight: 600, color: "#a9b6ad" }}>
          <span>Google presence · Websites · Growth</span>
          <span style={{ background: "#22c55e", color: "#0b0f0c", padding: "12px 26px", borderRadius: 999, fontWeight: 700 }}>Get your free Visibility Score</span>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Poppins", data: font("Poppins-Bold.ttf"), weight: 700, style: "normal" },
        { name: "Poppins", data: font("Poppins-SemiBold.ttf"), weight: 600, style: "normal" },
      ],
    },
  );
}
