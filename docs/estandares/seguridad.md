# Estándar — Seguridad de la API y del pipeline

> Léelo antes de tocar `src/app/api/**`, `src/proxy.ts`, `next.config.ts`, `src/instrumentation-client.ts`, `src/lib/validacion.ts`, `src/lib/manipulacion.ts`, `src/lib/seguridad/**` o cualquier variable de entorno.
> Verificación: `npm run check:seguridad`. Ataque local: `npm run ataque -- http://localhost:3000`.

## 1. Alcance

| Qué | Dónde |
|---|---|
| Rutas de IA | `src/app/api/chat/route.ts` (Agente 1, streaming), `src/app/api/diagnostico/route.ts` (Agentes 2 y 3) |
| Acceso del piloto | `src/app/api/acceso/route.ts`, `src/proxy.ts`, `src/lib/seguridad/acceso.ts`, `src/app/diagnostico/acceso/page.tsx` |
| Validación de entrada y límites | `src/lib/validacion.ts`, `src/lib/schemas.ts` (`LIMITES`) |
| Anti-manipulación | `src/lib/manipulacion.ts`, grounding en `src/lib/scoring.ts`, spotlighting en `src/lib/prompts/agente-2.ts` y `agente-3.ts` |
| Bots, rate limit, kill switch, errores | `src/lib/seguridad/http.ts`, `src/lib/seguridad/rate-limit.ts`, `src/instrumentation-client.ts` |
| Logging | `src/lib/seguridad/log.ts` |
| Cabeceras HTTP | `next.config.ts` |
| Proveedor y retención de datos | `src/lib/ai/provider.ts` (detalle en `docs/estandares/agentes-ia.md`) |
| Configuración fuera del repo | Regla WAF, clave de Gemini de pago y alertas de facturación, variables de entorno en Vercel (§6) |

## 2. Reglas obligatorias

Orden de controles en cada ruta de IA (no se reordena): **kill switch → rate limit → tamaño del cuerpo → esquema y límites → anti-manipulación → BotID → modelo**. Todo lo que puede rechazarse sin gastar inferencia se rechaza antes.

1. **Kill switch.** `DIAGNOSTICO_ENABLED=false` hace que `/api/chat` y `/api/diagnostico` respondan 503 antes de leer el cuerpo. *Por qué: cortar costos o un abuso sin redeploy de código.*
2. **Cuerpo con tope antes de parsear.** `leerCuerpoJSON` corta en 64 KB (y por `content-length`) → 413. *Por qué: un payload de 1 MB no debe llegar a `JSON.parse`.*
3. **Solo roles `user` y `assistant`.** Cualquier otro rol (`system`, `tool`, `developer`) → 400. Al modelo solo llegan partes de texto, reconstruidas en el servidor; nunca se pasa el `UIMessage` del cliente tal cual. *Por qué: el cliente no puede fijar instrucciones de sistema.*
4. **Límites:** ≤ 40 mensajes; ≤ 2.000 caracteres por turno del funcionario (4.000 por turno del entrevistador, que genera el Agente 1); ≤ 30 KB (UTF-8) de transcripción. Exceder → 413. Cuerpo mal formado → 400. *Por qué: costo acotado y superficie de inyección acotada.*
5. **El tag `[ENTREVISTA_COMPLETA]` solo lo emite el servidor.** En un turno `user` se elimina y se marca como manipulación (→ 422). *Por qué: el cliente no puede forzar el cierre ni simular al entrevistador.*
6. **Detección de manipulación** (`PATRONES_MANIPULACION`) sobre turnos `user` → 422 con mensaje genérico, antes del modelo, en ambas rutas. Si el pipeline llegara a correr con manipulación (p. ej. en evaluación), `confianza` baja a `baja`. Los patrones son frases, no palabras sueltas; cada patrón nuevo trae casos positivos **y** falsos positivos en `tests/manipulacion.test.ts`. *Por qué: OWASP LLM01; los LLM-as-judge son manipulables para inflar puntajes.*
7. **Spotlighting.** La transcripción (Agente 2) y los datos (Agente 3) van entre marcas `<<<…_INICIO id=X>>>`/`<<<…_FIN id=X>>>` con `id` aleatorio por solicitud, y el prompt declara que todo lo interior es dato. *Por qué: el atacante no conoce el id y no puede "cerrar" el bloque.*
8. **Grounding.** Todo puntaje > 0 cuya `evidencia` no aparezca (normalizada, palabra completa, ≥ 12 caracteres) en algún turno del funcionario pasa a 0 (`aplicarGrounding`). Las citas del entrevistador no cuentan. *Por qué: anti-alucinación verificable en código, no confiada al modelo.*
9. **Puntaje en código.** Subtotales, total, nivel, iceberg, capas y textos oficiales los calcula `src/lib/scoring.ts`; lo que el modelo diga sobre ellos se ignora (ADR `2026-11-06-puntaje-en-codigo`).
10. **Salida validada con zod** (`Output.object({ schema })`) y reintento único de JSON (CLAUDE.md §11). *Por qué: la salida del modelo es entrada no confiable.*
11. **BotID** (`checkBotId()`) antes de cada inferencia; `initBotId` protege `POST /api/chat` y `POST /api/diagnostico`. Si BotID falla, no bloquea (lo cubren WAF y rate limit) para no causar una caída total.
12. **Rate limit.** El límite principal es la regla WAF de Vercel (§6). El límite en memoria (`rate-limit.ts`: chat 10/10 s, diagnóstico 5/10 min, acceso 5/10 min, por código de acceso o hash de IP) es defensa en profundidad por instancia.
13. **Costos acotados en código.** `maxOutputTokens` (600 chat, 4.000 análisis, 4.000 síntesis; el razonamiento cuenta dentro del tope), `abortSignal` de 25 s por llamada, `maxRetries: 1`, `maxDuration` 30 s (chat) y 120 s (diagnóstico: 2 agentes × hasta 2 intentos × 25 s).
14. **Errores genéricos.** Al usuario solo `MENSAJES[status]` de `http.ts` y un `requestId`. Nunca `error.message` del proveedor, nombres de modelo, cuotas ni trazas. El stream del chat usa `onError` con texto fijo.
15. **Logging mínimo.** Solo los campos de `EventoLog` (request id, ruta, status, latencia, motivo técnico, tokens, puntaje total, flag y patrones de manipulación, citas no verificadas, modelo, hash de IP). Nunca transcripción, municipio, nombres, cargos, prompts ni respuestas del modelo. *Por qué: datos personales (Ley 1581/2012); los logs de Vercel no son un lugar para guardarlos.*
16. **Cabeceras** en `next.config.ts` para todas las rutas: CSP sin nonce, HSTS (2 años, `includeSubDomains; preload`), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (cámara, micrófono, geolocalización, pago, USB apagados), `X-Frame-Options: DENY`, sin `X-Powered-By`. La única ruta enmarcable es la del proxy de BotID (mismo origen).
17. **Acceso del piloto** (`ACCESS_MODE=passcode`): `POST /api/acceso` compara con `timingSafeEqual` contra todos los códigos; firma un JWT HS256 (`jose`) con solo la huella del código (`sub`), en cookie `mc_acceso` `httpOnly; Secure; SameSite=Lax; 7 días`. `src/proxy.ts` lo exige en `/diagnostico`, `/api/chat` y `/api/diagnostico`. Quitar un código de `ACCESS_CODES` lo revoca de inmediato. Sin `ACCESS_JWT_SECRET` (≥ 32 caracteres) el acceso falla cerrado. `x-acceso-etiqueta` es una cabecera interna: el proxy la borra siempre antes de fijarla.
18. **Proveedor y retención.** Producción usa Gemini directo con una clave de **nivel de pago** (el gratuito usa los prompts para mejorar productos de Google). Si algún día se usa AI Gateway (Gemini con `AI_GATEWAY_API_KEY` o `AI_PROVIDER=deepseek`), va siempre con `zeroDataRetention: true` y, para DeepSeek, solo proveedores de EE.UU. con ZDR. Nunca la API oficial de DeepSeek (ADR `2026-11-06-proveedor-ia-gateway-zdr`).
19. **Secretos.** Ninguna clave en el repositorio. `.env.example` lista todas las variables sin valores; `.env*` está en `.gitignore`.

## 3. Checklist antes de abrir un PR

- [ ] El orden de controles de la regla 2 se mantiene en las rutas que toqué.
- [ ] Ningún `return` de error al usuario incluye `error.message`, nombres de modelo o detalles internos.
- [ ] No agregué campos de texto libre a `EventoLog` ni `console.log` con contenido del usuario.
- [ ] Si toqué límites o esquemas, actualicé `LIMITES`, sus pruebas y la regla 4.
- [ ] Si agregué un patrón de manipulación, agregué casos positivos y de no-falso-positivo.
- [ ] Si agregué un recurso externo (script, fuente, analítica, iframe), actualicé la CSP y la regla 16.
- [ ] Si agregué una variable de entorno, está en `.env.example` con comentario.
- [ ] `npm run check:seguridad`, `npm run build` y `npm run lint` pasan.
- [ ] Corrí `npm run ataque` contra el servidor local y todos los casos devuelven 4xx.

## 4. Pruebas automáticas

`npm run check:seguridad` = `npm audit --omit=dev --audit-level=low` + `vitest run` (toda la suite) + `scripts/check-cabeceras.ts`.

| Prueba | Verifica | Falla si… |
|---|---|---|
| `npm audit --omit=dev` | Dependencias de producción sin vulnerabilidades conocidas | Aparece cualquier advisory en una dependencia de runtime |
| `tests/validacion.test.ts` | Roles, límites de mensajes/turno/transcripción, 413 vs 400, tag eliminado y marcado, formato de transcripción, tope de cuerpo | Se relaja un límite o se acepta un rol no permitido |
| `tests/manipulacion.test.ts` | 15 ataques detectados y 11 respuestas legítimas no marcadas | Un patrón deja pasar un ataque conocido o bloquea una respuesta normal |
| `tests/scoring.test.ts` | Grounding (citas literales, paráfrasis, citas del entrevistador), puntaje y nivel en código, el modelo no puede cambiar nivel ni textos | Se rompe el grounding o se confía en el modelo para el nivel |
| `tests/schemas.test.ts` | `puntaje` solo 0–3, campos calculados descartados, catálogos cerrados | Se amplía un esquema sin querer |
| `tests/acceso.test.ts` | JWT sin código ni etiqueta, revocación, token manipulado, secreto corto, rate limit en memoria | Se filtra el código en el token o se acepta un token alterado |
| `scripts/check-cabeceras.ts` | Con `curl`, las 6 cabeceras en `/`, `/diagnostico` y `/api/chat`, y ausencia de `X-Powered-By` | Falta o cambia una cabecera. Usa `CHECK_URL` si responde; si no, levanta `next dev` en el puerto 3999 |
| `scripts/ataque.ts` (manual) | Inyección, 1 MB, roles falsos, tag inyectado, >40 mensajes, turno largo, JSON inválido, cabecera interna falsificada, 60 solicitudes en 10 s | Algún ataque no devuelve 4xx |

## 5. Qué NO hacer

- No pasar `messages` del cliente directo a `streamText`/`convertToModelMessages`, ni activar `allowSystemInMessages`.
- No devolver `error.message` ni `String(error)` al cliente; no registrar `body`, `transcript`, `municipio` ni prompts.
- No "arreglar" un falso positivo de manipulación borrando el patrón: hazlo más específico y agrega la prueba.
- No confiar en el modelo para el nivel, el puntaje total, los textos del iceberg o la cita de evidencia.
- No usar la API oficial de DeepSeek (`@ai-sdk/deepseek` con `DEEPSEEK_API_KEY`) ni proveedores del gateway sin ZDR.
- No poner CSP con nonce en `proxy.ts`: obliga a render dinámico en todo el sitio (informe 01 §4).
- No agregar `'unsafe-eval'` a la CSP de producción (solo existe en desarrollo para React Refresh).
- No mover el límite de tasa solo a código: en serverless cada instancia tiene su propia memoria.
- No poner el código de acceso ni el municipio dentro del JWT.

## 6. Cómo extenderlo

**Nueva ruta que llama a un modelo:** copiar la estructura de `src/app/api/chat/route.ts` (orden de controles de la regla 2), agregarla al `matcher` de `src/proxy.ts`, a `initBotId` en `src/instrumentation-client.ts`, a `LIMITES_RUTA`, a la regla WAF y a `scripts/ataque.ts` y `scripts/check-cabeceras.ts`.

**Nuevo patrón de manipulación:** agregarlo a `PATRONES_MANIPULACION` con un `id` corto; agregar al menos un ataque y un caso legítimo parecido en `tests/manipulacion.test.ts`.

**Nuevo recurso externo:** agregar el origen mínimo a la directiva CSP correspondiente en `next.config.ts` y a `ESPERADAS` si cambia una cabecera verificada.

**Activar el piloto cerrado:** en Vercel, `ACCESS_MODE=passcode`, `ACCESS_JWT_SECRET` (`openssl rand -base64 48`) y `ACCESS_CODES=CODIGO1:etiqueta,CODIGO2`. Repartir un código por municipio; para revocar, quitarlo de la lista.

### Configuración manual en el dashboard de Vercel (no se puede automatizar desde el repo)

1. **Regla WAF de rate limit** — Project → Firewall → Configure → New Rule (los nombres de los campos pueden variar con el dashboard; lo que importa son los valores):
   - Nombre: `rate-limit-api-ia`
   - Condición: *Request Path* · *matches expression* · `^/api/(chat|diagnostico|acceso)$`, y *Method* · *equals* · `POST`
   - Acción: *Rate Limit* · algoritmo *Fixed Window* · ventana **60 s** · **20 solicitudes** · clave **IP** (en Pro, agregar **JA4 Digest**) · al exceder: **Deny con 429** durante 60 s
   - Hobby permite una sola regla; esta es la que debe existir. En Pro, agregar dos más: `^/api/diagnostico$` → 5 solicitudes / 10 min por IP; `^/api/acceso$` → 5 solicitudes / 10 min por IP.
   - Probar primero con acción *Log* durante un día y luego cambiar a *Deny*.
2. **BotID Deep Analysis** (solo Pro, $1 por 1.000 verificaciones): Firewall → Configure → Vercel BotID Deep Analysis. BotID Basic queda activo sin configuración.
3. **Clave de Gemini y costos:** la clave de `GOOGLE_GENERATIVE_AI_API_KEY` debe ser de un proyecto de Google Cloud con **facturación activa** (nivel de pago). En Google Cloud → Billing → Budgets & alerts, crear un presupuesto mensual (sugerido para el piloto: USD 20) con alertas al 50/75/100 %. Solo si se adopta AI Gateway: presupuesto en AI Gateway → Budgets, con créditos del gateway (el BYOK no cuenta contra el presupuesto).
4. **Variables de entorno:** `GOOGLE_GENERATIVE_AI_API_KEY` (de pago), `AI_PROVIDER=gemini` (o sin definir), `DIAGNOSTICO_ENABLED`, `ACCESS_MODE`, `ACCESS_CODES`, `ACCESS_JWT_SECRET`, `LOG_IP_SALT`. No definir `AI_GATEWAY_API_KEY` salvo que se adopte el gateway.
5. **Plan:** Hobby es "uso personal, no comercial"; el piloto con gobiernos debe ir en **Pro** (más reglas WAF, BotID Deep Analysis, retención de logs de 1 día).

## 7. Decisiones y fuentes

- Informe: `docs/investigacion/01-seguridad.md` (rate limit, prompt injection, costos, cabeceras, logging, passcode) y `docs/investigacion/02-deepseek.md` (proveedor, retención, marco legal).
- ADR: `docs/decisiones/2026-11-06-puntaje-en-codigo.md`, `docs/decisiones/2026-11-06-proveedor-ia-gateway-zdr.md`.
- OWASP LLM01:2025 · Spotlighting (arXiv 2403.14720) · Next.js CSP guide · Vercel WAF, BotID y AI Gateway ZDR (docs citadas en el informe 01).

### Texto para la política de datos (para la sesión de Contenido)

> Condición: este texto solo es cierto cuando producción use una clave de Gemini de **nivel de pago**. La clave revisada el 2026-11-06 era gratuita; no publicar hasta confirmar el cambio en Vercel.

**Cómo procesamos tus respuestas**

Las respuestas que escribes en el chat se envían a un modelo de inteligencia artificial para conducir la entrevista y generar tu diagnóstico. Usamos la API de Google Gemini en su modalidad de pago, en la que Google no utiliza el contenido de las conversaciones para mejorar sus productos ni entrenar sus modelos. Google puede conservar temporalmente las solicitudes con fines de seguridad y prevención de abusos, según sus términos de servicio.

La plataforma no guarda tu conversación en sus servidores. La transcripción y el resultado se conservan solo en tu navegador (almacenamiento local) hasta que inicies un nuevo diagnóstico o borres los datos del navegador. Los registros técnicos del servicio no contienen el texto de la conversación, el nombre del municipio ni datos personales; solo información operativa como la hora, la duración y el puntaje total.

Para cumplir la Ley 1581 de 2012 y los lineamientos de la Circular Externa 002 de 2024 de la Superintendencia de Industria y Comercio sobre datos personales en sistemas de inteligencia artificial, aplicamos minimización de datos: el diagnóstico no necesita tu nombre, tu número de documento ni datos de contacto, y te pedimos no incluirlos. Basta con el cargo o el área en la que trabajas. El resultado es una herramienta de apoyo: el puntaje refleja solo lo que se dijo en la entrevista y debe ser revisado por el equipo de la entidad antes de usarse en decisiones.

**[verificar]** antes de publicar: (a) en los términos vigentes de la API de Gemini (ai.google.dev, "Gemini API Additional Terms"), el plazo de conservación por monitoreo de abusos y que el nivel de pago excluye el uso para mejorar productos; (b) el país de procesamiento de Google y la vigencia de la lista de países adecuados de la SIC (Circular Única, Título V); (c) que la clave de Vercel sea de un proyecto con facturación activa.

## 8. Historial

| Fecha | Versión | Cambio |
|---|---|---|
| 2026-11-06 | 1.1 | El equipo decide mantener Gemini con clave de pago y no migrar a DeepSeek: proveedor por defecto `gemini`, Gemini nunca se desvía al gateway por OIDC, texto de política y pasos manuales ajustados. |
| 2026-11-06 | 1.0 | Creación (sesión Seguridad & IA, fase 1 de `docs/plan-feedback.md`). Validación de entrada, anti-manipulación, grounding, puntaje en código, BotID, rate limit, kill switch, errores genéricos, logging mínimo, cabeceras, passcode, AI SDK 7, next 16.4.5. |
