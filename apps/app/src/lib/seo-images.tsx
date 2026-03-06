import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "./metadata";

const brandGradient = "linear-gradient(135deg, #111111 0%, #1f2937 50%, #0f766e 100%)";

type ImageKind = "icon" | "social";

function BrandImage({
  kind,
  width,
  height,
}: {
  kind: ImageKind;
  width: number;
  height: number;
}) {
  if (kind === "icon") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: brandGradient,
          color: "#f4c86a",
          fontSize: width * 0.42,
          fontWeight: 700,
          letterSpacing: "-0.05em",
        }}
      >
        M
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px",
        background: brandGradient,
        color: "#ffffff",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div
          style={{
            width: "92px",
            height: "92px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "24px",
            border: "2px solid rgba(244, 200, 106, 0.35)",
            color: "#f4c86a",
            fontSize: "52px",
            fontWeight: 700,
          }}
        >
          M
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div
            style={{
              fontSize: "24px",
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: "#f4c86a",
            }}
          >
            Orange County Real Estate
          </div>
          <div
            style={{
              fontSize: "54px",
              fontWeight: 700,
              letterSpacing: "-0.04em",
            }}
          >
            {SITE_NAME}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          maxWidth: "860px",
        }}
      >
        <div
          style={{
            fontSize: "34px",
            color: "rgba(255,255,255,0.82)",
          }}
        >
          {SITE_TAGLINE}
        </div>
        <div
          style={{
            fontSize: "24px",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          Buyers, sellers, investors, and property owners across Orange County, LA County,
          and Riverside County.
        </div>
      </div>
    </div>
  );
}

export function createIconImage(width: number, height: number) {
  return new ImageResponse(<BrandImage kind="icon" width={width} height={height} />, {
    width,
    height,
  });
}

export function createSocialImage(width: number, height: number) {
  return new ImageResponse(<BrandImage kind="social" width={width} height={height} />, {
    width,
    height,
  });
}
