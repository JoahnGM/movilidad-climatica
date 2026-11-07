# Investigación de seguridad — endpoints LLM públicos (Next.js 16 / Vercel)

Fecha: 2026-11-06. Versiones verificadas con `npm view` en el registro y docs oficiales; lo no confirmado está marcado **[no confirmado]**.

## 0. Hallazgo previo en el repo
`package.json` declara `ai ^3.4.33` junto a `@ai-sdk/react ^3.0.170` (que es el paquete React de AI SDK **6**): combinación incompatible. `next 16.2.3` está detrás de 4 releases de seguridad (jul, ago, sep ×2, oct, nov 2026).

## 1. Rate limiting y bots
**Recomendación:** regla WAF de Vercel (por IP/JA4) sobre `/api/*` + BotID Basic (`checkBotId()` antes de inferir) + límite de longitud en código. Costo: $0 en Hobby/Pro base.

| Opción | Pros | Contras | Costo |
|---|---|---|---|
| **Vercel WAF Rate Limiting** (todos los planes) | Sin código, se aplica sin redeploy; acciones 429/Deny/Challenge/Log | Hobby: **1 regla/proyecto**, ventana 10s–10min, contadores por región; Pro: 40 reglas | Hobby: 1M requests permitidos incluidos; Pro usage-based $0.50/1M ([docs, 2026-08-28](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting); [changelog 2025-05-23](https://vercel.com/changelog/rate-limiting-now-available-on-hobby-with-higher-included-usage-on-pro)) |
| **Rate Limiting SDK `@vercel/firewall`** (`checkRateLimit(id, req)`) | Claves de aplicación (p.ej. código de invitación) | Requiere regla WAF previa | Igual que WAF ([KB, act. 2026-11-02](https://vercel.com/kb/guide/add-rate-limiting-vercel)) |
| **Upstash Ratelimit** (`@upstash/ratelimit` 2.2.0) | Portable, sliding window, `ephemeralCache` | Dependencia externa; comandos por `limit()` **[no confirmado]** | Free 500K comandos/mes; $0.20/100K ([upstash.com](https://upstash.com/blog/redis-new-pricing)) |
| **Arcjet** (`@arcjet/next` 1.15.0) | Rate limit + bot + shield en una lib | Free: 10K req/mes con corte duro; luego $25/mes + $5/1M | ([arcjet.com/pricing](https://arcjet.com/pricing.md)) |
| **Vercel BotID** (`botid` 1.5.12) | CAPTCHA invisible; Basic gratis en todos los planes | Deep Analysis (Kasada) solo Pro: $1/1000 llamadas `checkBotId()` | [docs 2026-06-16](https://vercel.com/docs/botid); patrón para rutas IA: [KB 2026-06-03](https://vercel.com/kb/guide/protect-ai-endpoints-with-vercel-botid) |

Ojo: Hobby es "uso personal, no comercial" ([vercel.com/pricing](https://vercel.com/pricing)); un piloto con gobiernos debería ir en Pro ($20/usuario/mes).

## 2. Prompt injection en el pipeline de evaluación
OWASP LLM01:2025 admite que no hay prevención infalible; recomienda restringir el rol en el system prompt, **formatos de salida validados con código determinista**, filtrado de entrada/salida y tratar al modelo como usuario no confiable ([genai.owasp.org](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)). Estudios 2025 muestran que los "LLM-as-judge" son manipulables para inflar puntajes ([arXiv 2505.13348](https://arxiv.org/abs/2505.13348), [JudgeDeceiver, ago-2025](https://arxiv.org/html/2403.17710v1)).

Medidas concretas, en orden:
1. **Rechazar roles `system`/`tool` del cliente**; solo `user`/`assistant`. AI SDK 7 ya rechaza `system` dentro de `messages` por defecto (`allowSystemInMessages`) ([guía v7](https://ai-sdk.dev/docs/migration-guides/migration-guide-7-0)).
2. **Tope**: ≤40 mensajes, ≤2.000 chars por turno, ≤30KB de transcript; 413 si excede.
3. **Spotlighting**: envolver el transcript en delimitadores con marca (`<<TRANSCRIPT>>…`) y decir al Agente 2 que todo lo interior es *dato*, nunca instrucción ([Microsoft, arXiv 2403.14720](https://arxiv.org/abs/2403.14720v1)); "instruction hierarchy" ([arXiv 2404.13208](https://arxiv.org/html/2404.13208v1)).
4. **Salida estructurada**: `generateText({ output: Output.object({ schema }) })` con zod (`puntaje: z.union([z.literal(0),…,z.literal(3)])`); `generateObject` está deprecado desde v6 ([guía v6](https://ai-sdk.dev/docs/migration-guides/migration-guide-6-0)).
5. **Puntajes en código, no en el LLM**: el modelo devuelve solo `puntaje`+`evidencia` por pregunta; subtotal, total, nivel, iceberg y textos oficiales se calculan con `getNivelFromPuntaje` y `NIVELES`. Ignorar `puntaje_total`/`nivel_id` del modelo.
6. **Grounding verificable**: exigir que `evidencia` sea cita literal; en código comprobar que aparece (normalizada) en los turnos `user`; si no, puntaje=0.
7. **Detección de manipulación**: regex sobre turnos `user` ("pon 3", "puntaje máximo", "ignora", "eres el analista", "[ENTREVISTA_COMPLETA]") → marcar `confianza: baja` y bloquear; el tag de cierre solo lo puede emitir el servidor.

## 3. Control de costos
- **AI Gateway budgets** (team/proyecto/API key/usuario): al superar, HTTP 402; alertas 50/75/100% por correo; es *soft cap* (la petición que cruza se completa). **BYOK no cuenta en budgets** → para tener tope real, usar créditos del gateway (precio de lista, sin markup **[markup 0% no confirmado en doc oficial]**) en vez de la clave propia de Google ([docs 2026-09-10](https://vercel.com/docs/ai-gateway/observability-and-spend/budgets)).
- En código: `maxOutputTokens` (p.ej. 600 chat / 2.500 análisis), `abortSignal: AbortSignal.timeout(25_000)`, `export const maxDuration` (Hobby máx 300s con Fluid; Pro 800s) ([limits 2026-02-24](https://vercel.com/docs/functions/limitations)).
- **Kill switch**: `DIAGNOSTICO_ENABLED=false` → 503 antes de cualquier llamada; cambiar env no requiere redeploy del código.
- Gemini API free tier usa prompts para mejorar productos; el paid tier no ([ai.google.dev/billing](https://ai.google.dev/gemini-api/docs/billing)). Para datos de funcionarios, usar paid tier.

## 4. Cabeceras de seguridad
Guía oficial ([nextjs.org, 2026-03-20](https://nextjs.org/docs/app/guides/content-security-policy)): CSP con nonce se hace en `proxy.ts` (ex-middleware) con `'strict-dynamic'`, pero **obliga a render dinámico e incompatible con PPR/caché**. Para este sitio (landing estática + chat) recomiendo CSP sin nonce en `next.config.ts` `headers()`:
`default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' (Tailwind/Framer); img-src 'self' blob: data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests`
más `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `X-Frame-Options: DENY`. Vercel añade HSTS solo si no declaras `headers` **[no confirmado en doc vigente]**. SRI hash-based existe pero es experimental.

## 5. Versiones (npm, 2026-11-06)
- `next` **16.4.5** (Active LTS; release de seguridad [2026-11-03](https://nextjs.org/blog/november-2026-security-release); 15.x → 15.5.29).
- `ai` **7.0.164** (tags: `ai-v6` 6.0.324, `ai-v5` 5.0.285); `@ai-sdk/react` **4.0.168** (v7 ↔ react v4; v6 ↔ react v3); `@ai-sdk/google` **4.0.113**; `zod` 4.6.7.
- Migración 3.4→7: `npx @ai-sdk/codemod upgrade` (v4+v5+v6) y luego `npx @ai-sdk/codemod v7`. Cambios clave: `toDataStreamResponse`→`toUIMessageStreamResponse` (v5; en v7 deprecado a favor de `createUIMessageStreamResponse(result.stream)`), `useChat` con `DefaultChatTransport`, `sendMessage({text})`, `parts` en vez de `content`, `status` en vez de `isLoading`, `convertToModelMessages` (async en v6), `maxTokens`→`maxOutputTokens`, `getErrorMessage`→`onError` (errores ya no se envían al cliente), `system`→`instructions`, `createGoogleGenerativeAI`→`createGoogle`, **Node ≥22 y ESM-only** en v7 ([v5](https://ai-sdk.dev/docs/migration-guides/migration-guide-5-0), [v6](https://ai-sdk.dev/docs/migration-guides/migration-guide-6-0), [v7](https://ai-sdk.dev/docs/migration-guides/migration-guide-7-0)).

## 6. Logging y privacidad
- Retención de runtime logs: Hobby 1h (docs actuales dicen 12h **[inconsistente]**), Pro 1 día; Observability Plus 30 días ($10/mes Pro); Log Drains solo Pro ([docs](https://vercel.com/docs/observability/limits-and-pricing)).
- **No registrar**: transcript, municipio, nombre/cargo del funcionario (datos personales, Ley 1581/2012), prompts, cuerpo de respuesta del LLM. **Sí**: request id, ruta, status, latencia, tokens de uso, puntaje total, flag de manipulación, hash de IP.
- Errores al usuario: mensaje genérico ("No pudimos procesar el diagnóstico. Reintenta."); nunca `error.message` del proveedor (puede filtrar modelo, cuota, prompt).

## 7. Piloto cerrado con código de acceso
| Opción | Pros | Contras | Costo |
|---|---|---|---|
| **Vercel Password Protection** | Cero código | Solo Pro, **no Hobby**; una sola clave compartida | $20/proyecto/mes ([changelog](https://vercel.com/changelog/password-protection-now-costs-20-per-project-per-month-on-pro)) |
| **Vercel Authentication** | Gratis | Exige cuenta Vercel del visitante: inviable para funcionarios | $0 |
| **Passcode propio (recomendado)** | Códigos por municipio en env/Edge Config; revocables; sirve como clave de rate limit | ~80 líneas de código | $0 |

Patrón: `POST /api/acceso` compara con `crypto.timingSafeEqual`, firma JWT HS256 con `jose` (válido en Edge y Node) en cookie `httpOnly; Secure; SameSite=Lax; maxAge 7d`; `proxy.ts` verifica para `/diagnostico` y las dos rutas API (no solo páginas). No incluir el código en el payload. Rate-limitar `/api/acceso` (5/10min por IP).

**Prioridad sugerida:** (1) `next@16.4.5`; (2) validar roles/longitud + puntajes en código + zod; (3) regla WAF + BotID Basic + kill switch + budget; (4) passcode; (5) headers; (6) migración AI SDK 7.
