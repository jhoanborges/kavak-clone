import { ImageResponse } from "next/og";

import { APP_NAME } from "@/lib/config";
import { SITE_DESCRIPTION } from "@/lib/seo";

/**
 * OG image por defecto, 1200x630 (la proporción que piden Facebook, LinkedIn,
 * WhatsApp y Twitter/X). Se genera en build con los tokens del Design System
 * VALUE en vez de servir un PNG cuadrado reescalado.
 *
 * Las rutas que quieran su propia imagen pueden añadir su propio
 * opengraph-image.tsx en su carpeta; Next resuelve la más cercana.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${APP_NAME} - Seminuevos certificados`;

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
          // Verde Value + overlay petróleo (mismo lenguaje que el hero del DS)
          background: "linear-gradient(235deg, #004E59 0%, #0D1F26 71%)",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 100,
              background: "#DEF698",
            }}
          />
          <div
            style={{
              fontSize: 24,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#A5DBD9",
            }}
          >
            {APP_NAME}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Satori exige display:flex explícito en cualquier div con >1 hijo,
              y no soporta <br/>: cada línea va en su propio div. */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 68,
              lineHeight: 1.1,
              color: "#FFFFFF",
              maxWidth: 900,
            }}
          >
            <div>Seminuevos certificados,</div>
            <div>financiamiento a tu medida</div>
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 28,
              color: "#A5DBD9",
              maxWidth: 820,
            }}
          >
            {SITE_DESCRIPTION}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ width: 72, height: 10, borderRadius: 100, background: "#DEF698" }} />
          <div style={{ width: 32, height: 10, borderRadius: 100, background: "rgba(255,255,255,0.5)" }} />
          <div style={{ width: 32, height: 10, borderRadius: 100, background: "rgba(255,255,255,0.5)" }} />
        </div>
      </div>
    ),
    size
  );
}
