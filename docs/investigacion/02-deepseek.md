# Migración Gemini → DeepSeek: informe de investigación (2026-11-06)

**Nota de método:** investigado con búsqueda web y lectura directa de docs oficiales (DeepSeek, Vercel, AI SDK, NIST, SIC, MinTIC). El presupuesto de búsqueda se agotó antes de confirmar Groq y AWS Bedrock; se marcan como *no confirmado*. Precios en USD por millón de tokens.

## 1. Modelos DeepSeek vigentes (API oficial)

Fuente: [Models & Pricing](https://api-docs.deepseek.com/quick_start/pricing/) y [Change Log](https://api-docs.deepseek.com/updates), leídos 2026-11-06.

| ID API | Versión servida | Lanzamiento | Contexto / salida máx. | Input (cache miss) pico / valle | Output pico / valle | Cache hit pico |
|---|---|---|---|---|---|---|
| `deepseek-flash` | DeepSeek-V4.1-Flash-1017 | V4.1 Flash 2026-09-10; rev. 1017 el 2026-10-17 | 1M / 384K | $0.30 / $0.15 | $1.20 / $0.60 | $0.006 |
| `deepseek-v4-pro` | DeepSeek-V4-Pro-0813 | V4 preview 2026-04-24; GA 2026-08-13 | 1M / 384K | $1.32 / $0.66 | $3.96 / $1.98 | $0.044 |

- Pico = 01:00–04:00 y 06:00–10:00 UTC L–V (valle = mitad de precio). Ambos soportan JSON output, tool calls, Responses API y modo *thinking* (activado por defecto; `reasoning_effort` low/high/max).
- **`deepseek-chat` y `deepseek-reasoner` fueron retirados el 2026-07-24.** `deepseek-v4-flash` sigue aceptado pero se enruta a V4.1 Flash. Cualquier documentación que mencione R1/V3.2 está obsoleta.
- Pesos abiertos en Hugging Face (nota de [2026-10-17](https://api-docs.deepseek.com/news/news261017)).

**Recomendación por agente:**

| Agente | Modelo | Modo | Razón |
|---|---|---|---|
| 1 Entrevistador (streaming) | `deepseek-flash` | `thinking: disabled` | Con thinking activo, Artificial Analysis mide ~52 s hasta el primer token de respuesta en V4.1 Flash 1017 (max) y 83 s en V4 Pro ([AA](https://artificialanalysis.ai/models/deepseek-v4-1-flash-1017)); inaceptable para chat y para el timeout de 30 s de Vercel. Sin thinking, `temperature` sí aplica. |
| 2 Analista (JSON 18 puntajes) | `deepseek-flash` | thinking `low`/`high` + `response_format: json_object` | Barato; el razonamiento ayuda a la rúbrica. Vigilar tiempo total < 30 s o mover a Vercel Functions con duración extendida. |
| 3 Sintetizador | `deepseek-v4-pro` o `deepseek-flash` (high) | thinking | DeepSeek afirma que V4.1 Flash supera a V4 Pro en costo y calidad; AA puntúa Flash 1017 (max) = 33 vs Pro 0813 (max) = 23 en su Intelligence Index ([AA Pro](https://artificialanalysis.ai/models/deepseek-v4-pro)). Pro no aporta ventaja clara hoy; validar con el golden set (§6). |

## 2. Dónde alojarlo

| Opción | DeepSeek V4.x disponible | Ubicación / retención | Precio Flash (in/out) | Streaming / JSON / tools |
|---|---|---|---|---|
| **API oficial DeepSeek** | Sí (fuente) | Datos "procesados y almacenados en la República Popular China"; retención "mientras exista la cuenta"; usa datos para entrenar con opt-out solo por correo (privacy@deepseek.com); los Términos del Open Platform (vig. 2026-04-29) no fijan retención de inputs API. **Sin ZDR.** ([Privacy Policy, 2026-02-10](https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html)) | $0.30/$1.20 (valle $0.15/$0.60) | Sí / `json_object` (no `json_schema`) / sí; strict tools solo en `/beta` |
| **Vercel AI Gateway** (`deepseek/deepseek-v4-pro`, `deepseek/deepseek-v4-flash`) | Sí. Proveedores listados: deepseek, novita, deepinfra, baseten, azure, alibaba, digitalocean, wafer, gmi ([modelo Pro](https://vercel.com/ai-gateway/models/deepseek-v4-pro), [Flash](https://vercel.com/ai-gateway/models/deepseek-v4-flash)) | ZDR por request (`providerOptions.gateway.zeroDataRetention: true`, sin costo) o team-wide ($0.10/1k req); requiere plan Pro/Enterprise o créditos. Con ZDR el gateway **excluye** proveedores sin acuerdo (DeepSeek directo y Alibaba quedarían fuera si no tienen acuerdo; Azure, Baseten, Fireworks, Together, Groq, Bedrock sí están en la lista ZDR). ([Docs ZDR, 2026-09-22](https://vercel.com/docs/ai-gateway/security-and-compliance/zdr)) | Pro: $0.66/$1.98. Flash: $0.06/$0.18 (*la página Flash parece reflejar V4 Flash viejo; verificar*) | Sí; "metadata de capacidades no reportada" para structured output |
| **Together AI** (EE.UU.) | `deepseek-ai/DeepSeek-V4.1-Flash` ([página](https://www.together.ai/models/deepseek-v4-1-flash)) | En lista ZDR de Vercel; su página no declara región | $0.30/$1.20 | No especificado en la página |
| **Fireworks AI** | V4 Pro (`deepseek-v4-pro`) y V4.1 Flash según agregadores ($0.375/$1.50 tier priority) — *no confirmado en página oficial* | ZDR vía Vercel | — | — |
| **Azure / Microsoft Foundry** | V4 Flash y Pro desde mayo 2026 (regiones EU: West Europe, Sweden Central) según [innFactory](https://innfactory.ai/en/ai-models/deepseek/); agregado a AI Gateway en junio 2026 | ZDR vía Vercel | — | — |
| **AWS Bedrock** | *No confirmado* para V4 (una fuente de julio 2026 dice que aún no) | — | — | — |
| **Groq** | *No confirmado* (sin resultados) | — | — | — |

**Conclusión:** para una herramienta dirigida a alcaldías, la opción defendible es **AI Gateway con ZDR forzado** (o Azure EU directo), nunca la API china. Costo similar al oficial en hora pico.

## 3. Integración con Vercel AI SDK

Fuente: [docs @ai-sdk/deepseek](https://ai-sdk.dev/providers/ai-sdk-providers/deepseek).

- `pnpm add @ai-sdk/deepseek` con `DEEPSEEK_API_KEY`, o solo `ai` con `AI_GATEWAY_API_KEY` y string `"deepseek/deepseek-v4-flash"` (Gateway es el default).
- Tabla oficial: `deepseek-flash`, `deepseek-v4-pro` soportan object generation, tool usage y tool streaming; imagen solo `deepseek-v4-flash-vision-exp`.
- `providerOptions.deepseek`: `thinking: { type: 'enabled'|'disabled' }`, `reasoningEffort: 'low'|'high'|'max'`. **Con thinking activo, `temperature`/`topP` se ignoran** (aviso del SDK) → para evaluar variación por temperatura hay que desactivar thinking.
- Reasoning llega como partes `reasoning` en streaming; `frequencyPenalty`/`presencePenalty` deprecados.
- JSON: DeepSeek solo ofrece `json_object` (prompt-level, requiere la palabra "json" y un ejemplo); si el modelo no produce JSON válido, la API devuelve `content` en blanco con `finish_reason: stop` → el reintento ya previsto en CLAUDE.md §11 es necesario ([JSON mode](https://api-docs.deepseek.com/guides/json_mode)). Strict tool calls (`strict: true`) solo en base URL `/beta`. No hay `json_schema` estricto nativo; `generateObject` del SDK funciona pero valida en cliente (Zod), no en servidor.
- A través de Gateway no todas las `providerOptions` se propagan; depende del proveedor que sirva.

## 4. Calidad en español, rúbrica y riesgos

- **Español:** no existe benchmark público DeepSeek-vs-Gemini en español ni LLM-as-judge en español. El informe técnico V4 reporta MMMLU (agregado multilingüe) 90.3 Pro-Base / 88.8 Flash-Base ([arXiv 2606.19348](https://arxiv.org/pdf/2606.19348)). Opiniones de blogs califican el español de DeepSeek como "aceptable, menos matiz" — evidencia débil.
- **Alucinación:** Artificial Analysis (AA-Omniscience) midió tasas de alucinación muy altas en V4 preview (94% Pro, 96% Flash) y 84% en V4 Flash 0731; para 1017 OfficeChai reporta "no-alucinación" subiendo de 4% a 33% ([fuente](https://officechai.com/ai/deepseek-v4-1-flash-1017-places-ahead-of-glm-5-3-kimi-k3-on-artificial-analysis-intelligence-index/)). Relevante: el principio anti-alucinación del Agente 2 exige "puntaje 0 sin evidencia"; hay que medirlo explícitamente.
- **Sesgo/censura:** NIST CAISI (2025-09-30) halló que DeepSeek repite narrativas del PCCh ~4× más que modelos de EE.UU. y que agentes sobre R1-0528 son 12× más propensos a seguir instrucciones maliciosas ([NIST](https://www.nist.gov/document/caisi-evaluation-deepseek-ai-models-report)). CAISI V4 Pro (2026-05-01): "modelo PRC más capaz", ~8 meses detrás de la frontera; no cubrió censura ([NIST](https://nist.gov/news-events/news/2026/05/caisi-evaluation-deepseek-v4-pro)). Para temas de gobernanza territorial colombiana el riesgo de censura es bajo, pero la susceptibilidad a inyección en el chat (Agente 1 recibe texto libre de usuarios) sí importa.
- **JSON:** sin schema estricto; modo thinking + JSON alarga latencia.

## 5. Marco legal colombiano

| Norma | Fecha | Implicación |
|---|---|---|
| Ley 1581/2012 art. 26; Decreto 1377/2013 | — | Transferencia internacional solo a países con nivel adecuado o con excepción/declaración de conformidad. |
| Circular Externa SIC 005/2017 (+008/2017) | 2017-08-10 | Lista de ~36 países adecuados: incluye **EE.UU., UE, Japón**; **China no aparece** en ninguna fuente consultada (*verificar Circular Única Título V*). Estudio 2026 propone añadir Brasil, Ecuador, Kenia, Panamá, Sudáfrica. |
| Circular Externa SIC 003/2025 | publ. 2026-01-05 | Adopta Cláusulas Contractuales Modelo RIPD para transferir a países sin nivel adecuado ([SIC PDF](https://sedeelectronica.sic.gov.co/sites/default/files/normativa/Circular%20Externa%20003%20de%202025.pdf)). Con DeepSeek directo se necesitarían CCM firmadas por DeepSeek — improbable. |
| Circular Externa SIC 002/2024 | 2024-08-21 | Lineamientos de datos personales en sistemas de IA: responsabilidad demostrada, evaluación de impacto, minimización, derechos de titulares ([PDF](https://sedeelectronica.sic.gov.co/sites/default/files/normativa/Circular%20Externa%20No.%20002%20del%2021%20de%20agosto%20de%202024.pdf)). Vigente; no hallé circular 2025-2026 que la reemplace. |
| CONPES 4144 | 2025-02-14 | Política Nacional de IA a 2030 ([PDF](https://ambitojuridico.com/sites/default/files/2025-02/Conpes-4144-2025.pdf)). |
| Guía Ética DNP para IA en entidades públicas | dic. 2025 | Principios (centralidad humana, transparencia, privacidad); alcance nacional vs. territorial en disputa; no vinculante aún ([MinTIC PDF](https://www.mintic.gov.co/portal/715/articles-425888_recurso_1.pdf)). |
| MinTIC — Lineamientos de seguridad y privacidad para sistemas de IA (MSPI v1.0) | 2025-12-19 / anuncio 2026-04-22 | Directrices técnicas para entidades del Estado ([MinTIC](https://www.mintic.gov.co/portal/715/w3-article-437197.html)). |
| Directiva Presidencial 03/2021 | 2021 | Lineamientos nube/IA para Rama Ejecutiva nacional. |

**Implicación:** nombres de funcionarios + municipio son datos personales. Enviarlos a la API china = transferencia a país sin nivel adecuado, sin CCM ni ZDR → riesgo alto frente a SIC y mala señal para entidades públicas. EE.UU./UE (Azure, Together, Fireworks vía Gateway con ZDR) están en la lista adecuada y permiten cumplir Circular 002/2024 (minimización, retención cero). Documentar evaluación de impacto. No hallé guía específica de MinTIC/SIC sobre *LLM generativos* en entidades públicas más allá de las anteriores.

## 6. Plan de migración con evaluación

1. **Golden set:** 20–30 transcripts sintéticos + reales anonimizados, cubriendo los 4 niveles (≥5 por nivel), casos "no sabe", respuestas vagas, municipios reales. Anotar manualmente los 18 puntajes esperados (2 anotadores, medir acuerdo).
2. **Herramienta:** [promptfoo](https://www.promptfoo.dev/docs/guides/llm-as-a-judge/) con providers `google:gemini-3-flash-preview` y `deepseek:deepseek-flash` (o `openai`-compatible vía Gateway). Asserts: `is-json` + schema Zod, suma de subtotales = `puntaje_total`, nivel correcto, textos del iceberg exactos (`equals`), y `llm-rubric` para evidencias citadas.
3. **Métricas:** exactitud de nivel, MAE por pregunta, acuerdo ponderado (κ) Gemini-vs-DeepSeek-vs-humano, tasa de JSON inválido, latencia p95, costo por diagnóstico.
4. **Variación:** 5 repeticiones por transcript; Agente 2 con `thinking: disabled` a temperaturas 0 y 0.7 (con thinking la temperatura no aplica) y con `reasoningEffort: low/high`. Reportar desviación estándar del puntaje total; umbral sugerido: ±2 puntos no cambia el nivel en >90% de casos.
5. **Judge:** fijar modelo y versión del juez (p. ej. Gemini 3.1 Pro a T=0), rúbrica bloqueada; auditar 100 muestras humano-vs-juez antes de confiar.
6. **Despliegue:** AI Gateway con ZDR por request, fallback Gemini, feature flag por agente; migrar primero Agente 1 (menor riesgo), luego 2 y 3 solo si κ ≥ nivel Gemini.

**No confirmado:** disponibilidad en Groq y Bedrock; precio Flash en la página de AI Gateway ($0.06/$0.18 parece desactualizado); si DeepSeek directo o Alibaba tienen acuerdo ZDR con Vercel; vigencia exacta de la lista de países adecuados de la SIC.
