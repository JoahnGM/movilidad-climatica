import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const esDesarrollo = process.env.NODE_ENV === "development";
const esPreview = process.env.VERCEL_ENV === "preview";

/**
 * CSP sin nonce (docs/investigacion/01-seguridad.md §4): un nonce obliga a render
 * dinámico en todo el sitio. 'unsafe-inline' en script-src es necesario para el
 * runtime de Next sin nonce; en style-src lo exigen Tailwind y Framer Motion.
 * Reglas y cómo extenderla: docs/estandares/seguridad.md.
 */
const directivas = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${esDesarrollo ? " 'unsafe-eval'" : ""}${esPreview ? " https://vercel.live" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  `connect-src 'self'${esDesarrollo ? " ws:" : ""}${esPreview ? " https://vercel.live wss://ws-us3.pusher.com" : ""}`,
  "worker-src 'self' blob:",
  // BotID carga un iframe desde una ruta propia del mismo origen.
  `frame-src 'self'${esPreview ? " https://vercel.live" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(esDesarrollo ? [] : ["upgrade-insecure-requests"]),
];

/** Ruta del proxy de BotID (botid/next/config): necesita poder enmarcarse en el mismo origen. */
const RUTA_BOTID = "149e9513-01fa-4fb0-aad4-566afd725d1b";

const cabeceras = (enmarcable: boolean) => [
  {
    key: "Content-Security-Policy",
    value: [...directivas, enmarcable ? "frame-ancestors 'self'" : "frame-ancestors 'none'"].join("; "),
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "X-Frame-Options", value: enmarcable ? "SAMEORIGIN" : "DENY" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: `/:path((?!${RUTA_BOTID}/).*)`, headers: cabeceras(false) }];
  },
};

export default withBotId(nextConfig, cabeceras(true));
