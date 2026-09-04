import { ImageResponse } from "next/og";
import { contact, site } from "@/content/site";

/**
 * The card that renders whenever the site is shared on WhatsApp, Facebook,
 * LinkedIn or in a Slack unfurl — for a lot of prospective clients it is the
 * first thing they ever see of Sky Lens, before the site itself.
 *
 * It previously shipped the Create-Next-App-era placeholder copy: "FAA Part
 * 107 · Denver CO", "across the Mountain West" and skylens.com. All three were
 * wrong for a Colombo operator working under CAASL, and they were wrong in the
 * one place a client cannot miss them. Copy and palette are now drawn from the
 * site content and the logo's navy.
 */

export const alt = "Sky Lens — professional drone photography and aerial videography in Sri Lanka";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAVY = "#0b2540";
const AZURE = "#68b4f0";
const INK = "#eef4fa";
const DIM = "#8ba4c0";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: NAVY,
          backgroundImage:
            "radial-gradient(ellipse 70% 60% at 25% 20%, rgba(43,130,216,0.30), transparent 70%), radial-gradient(ellipse 50% 50% at 90% 90%, rgba(18,58,99,0.55), transparent 70%)",
          padding: 72,
          fontFamily: "sans-serif",
          color: INK,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                width: 44,
                height: 44,
                borderRadius: 999,
                border: `3px solid ${AZURE}`,
              }}
            />
            <div style={{ display: "flex", fontSize: 32, fontWeight: 700, letterSpacing: -1 }}>
              Sky<span style={{ color: AZURE }}>Lens</span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: AZURE,
            }}
          >
            CAASL registered · Colombo, Sri Lanka
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: -3,
              maxWidth: 900,
            }}
          >
            See what the ground can&apos;t tell you.
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#b9cee4", maxWidth: 860, lineHeight: 1.4 }}>
            Cinematic aerial film, property and event photography, and heavy-lift drone work across
            Sri Lanka.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(238,244,250,0.14)",
            paddingTop: 28,
            fontSize: 20,
            color: DIM,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex" }}>1,240+ flights logged</div>
          <div style={{ display: "flex" }}>Fully insured</div>
          <div style={{ display: "flex" }}>{contact.phone}</div>
          <div style={{ display: "flex", color: AZURE }}>{site.domain.replace("https://", "")}</div>
        </div>
      </div>
    ),
    size,
  );
}
