# Estándar — Agentes de IA: prompts, rúbrica, evaluación y proveedor

> Léelo antes de tocar `src/lib/prompts/**`, `src/lib/scoring.ts`, `src/lib/schemas.ts`, `src/lib/matriz.ts`, `src/lib/ai/**`, `eval/**` o `scripts/eval-agentes.ts`.
> Verificación: `npm run check:agentes`. Evaluación con modelos reales: `npm run eval:agentes`.

## 1. Alcance

| Qué | Dónde |
|---|---|
| Prompts de los 3 agentes y versión de rúbrica | `src/lib/prompts/agente-1.ts`, `agente-2.ts` (con `ANCLAS`), `agente-3.ts`, `version.ts` (`RUBRICA_VERSION`) |
| Matriz oficial, niveles y textos del iceberg | `src/lib/matriz.ts` (`NIVELES`, `ICEBERGS`, `DIMENSIONES`, `PREGUNTAS`) — copia exacta de `CLAUDE.md` §4 |
| Puntaje, nivel, grounding y ensamblaje | `src/lib/scoring.ts` |
| Esquemas de salida de los agentes | `src/lib/schemas.ts` (`AnalisisOutputSchema`, `SintesisOutputSchema`) |
| Proveedor, modelos y parámetros por agente | `src/lib/ai/provider.ts` (Gemini por defecto; DeepSeek vía AI Gateway disponible pero no adoptado) |
| Pipeline Agente 2 → código → Agente 3 | `src/lib/ai/pipeline.ts` (lo usan la ruta y la evaluación) |
| Golden set y evaluación | `eval/golden/`, `scripts/eval-agentes.ts`, `eval/promptfooconfig.yaml`, `eval/resultados/` |

### Flujo

```
Agente 1 (entrevistador, streaming) ──transcripción──▶ validación + anti-manipulación (código)
  ──▶ Agente 2 (analista): 18 × {puntaje 0–3, cita textual} + confianza + contexto territorial
  ──▶ código: grounding → subtotales → total → nivel → iceberg → textos oficiales → estados
  ──▶ Agente 3 (sintetizador): recibe el resultado calculado y las citas (NO la transcripción)
       y devuelve resumen, fortalezas, brechas, rutas progresivas y mensaje final
  ──▶ código: ensambla; nivel, puntaje, iceberg y textos se sobreescriben siempre
```

## 2. Reglas obligatorias

1. **El modelo puntúa preguntas; el código decide el nivel.** El Agente 2 devuelve solo `puntaje` + `evidencia` por pregunta. Cualquier subtotal, total, nivel o iceberg que devuelva se descarta (el esquema zod lo elimina). *Por qué: reproducibilidad y resistencia a manipulación (ADR `2026-11-06-puntaje-en-codigo`).*
2. **Textos oficiales exactos.** `ICEBERGS` en `matriz.ts` es copia literal de `CLAUDE.md` §4; `tests/prompts.test.ts` lo compara carácter por carácter. Ningún prompt pide al modelo escribirlos.
3. **Evidencia = cita textual del funcionario.** Puntaje > 0 sin cita verificable → 0 (grounding en código). "No sabe / no tiene información" → 0. Respuesta vaga → máximo 1.
4. **Anclas.** Cada una de las 18 preguntas tiene ejemplos para 0, 1, 2 y 3 en `ANCLAS` (derivados de la matriz). Una pregunta nueva o modificada no se publica sin sus 4 anclas.
5. **`RUBRICA_VERSION` se sube con cualquier cambio** en `src/lib/prompts/**`, en `ANCLAS`, en la escala, en los esquemas de salida o en el grounding. Formato `AAAA-MM-DD.n`. Viaja en `scores.rubrica_version` de cada resultado. *Por qué: resultados de versiones distintas no son comparables.*
6. **Umbrales para aceptar un cambio de prompt, modelo o proveedor** (medidos con `npm run eval:agentes -- --repeticiones 3` sobre el golden set):
   - kappa ponderado vs. golden **≥ el de la configuración vigente** (y nunca < 0,60);
   - estabilidad de nivel entre repeticiones **> 90 %** (equivale a "±2 puntos no cambian el nivel en más del 90 % de los casos");
   - tasa de JSON inválido en el primer intento **≤ 5 %**, y 0 corridas fallidas;
   - latencia p95 del Agente 2 **< 20 s** (el corte es 25 s);
   - los 2 casos de manipulación: detección 100 % y el puntaje del modelo no sube más de 2 puntos sobre el esperado.
7. **Proveedor y modelos fijados.** Producción usa Gemini directo en nivel gratuito: `gemini-3-flash-preview` (Agente 1) y `gemini-3.5-flash` (Agentes 2 y 3). En el nivel gratuito `gemini-3.1-pro` no tiene cuota y la cuota diaria es por modelo: no poner el chat y el diagnóstico en el mismo modelo. Ids con versión fija (p. ej. `deepseek/deepseek-v4.1-flash-1017`, no `deepseek-flash`): un alias que cambia por debajo rompe la comparabilidad. Cambiar de proveedor exige un ADR nuevo (ADR `2026-11-06-proveedor-ia-gateway-zdr`).
8. **Parámetros por agente** (`PARAMETROS` en `provider.ts`): Agente 1 sin razonamiento (`reasoning: 'none'`, el primer token con thinking tarda ~50 s), `maxOutputTokens` 600, `temperature` 0,7; Agente 2 `reasoning: 'low'`, 4.000 tokens; Agente 3 `reasoning: 'low'`, 4.000 tokens (los tokens de razonamiento cuentan dentro de `maxOutputTokens`: con 2.000–2.500 el JSON se truncaba). Se usa la opción portable `reasoning` del AI SDK 7, no `providerOptions` específicos.
9. **Minimización: qué NUNCA se envía al modelo.** IP, cookies, código de acceso o su huella, `requestId`, cabeceras, el campo `municipio` del request, metadatos del navegador. Al Agente 3 no se le envía la transcripción completa: solo el resultado calculado y las citas. El Agente 1 tiene instrucción de no pedir nombres, documentos ni datos de contacto.
10. **Salida estructurada** con `generateText({ output: Output.object({ schema }) })`; nunca `generateObject` (deprecado). Si no valida: extraer JSON entre el primer `{` y el último `}` y, si tampoco, reintentar una vez (CLAUDE.md §11).
11. **La evaluación mide el código de producción.** `scripts/eval-agentes.ts` llama a `analizar()` de `src/lib/ai/pipeline.ts`: mismo prompt, esquema, grounding y cálculo. No se evalúa un prompt copiado.
12. **El golden set es sintético hasta que lo revisen dos anotadores humanos** (`eval/golden/README.md`). Mientras tanto, kappa vs. golden mide acuerdo con una anotación de IA, no validez.
13. **Modo inglés (experimental).** Si la cookie `idioma=en` llega a `/api/chat` o `/api/diagnostico`, `conIdioma()` (`src/lib/prompts/idioma.ts`) agrega al final una directiva de idioma; en español el prompt es byte a byte el validado (`tests/idioma.test.ts`). Las citas se copian en el idioma en que se dijeron (el grounding no cambia), los valores del esquema y la etiqueta `[ENTREVISTA_COMPLETA]` no se traducen, y el resultado guarda los nombres de nivel y textos del iceberg OFICIALES en español (la UI muestra una traducción no oficial por id). Las corridas en inglés llevan `rubrica_version` = `<versión>+en`: no son comparables con las de español hasta que el golden set tenga casos en inglés y cumplan los umbrales de la regla 6.

## 3. Checklist antes de abrir un PR

- [ ] Si cambié un prompt, anclas, escala, esquema o grounding: subí `RUBRICA_VERSION`.
- [ ] Corrí `npm run eval:agentes -- --repeticiones 3` con la configuración vigente y con la nueva, y adjunté los dos `eval/resultados/*.md` al PR.
- [ ] Los umbrales de la regla 6 se cumplen (o el PR explica por qué no y quién lo aprobó).
- [ ] No agregué al prompt del Agente 3 nada que le permita cambiar nivel, puntaje o textos del iceberg.
- [ ] No envío al modelo nada de la lista de la regla 9.
- [ ] `npm run check:agentes`, `npm run build` y `npm run lint` pasan.

## 4. Pruebas automáticas

`npm run check:agentes` = `vitest run tests/scoring.test.ts tests/schemas.test.ts tests/prompts.test.ts tests/provider.test.ts tests/idioma.test.ts` (sin red, sin costo).

| Prueba | Verifica | Falla si… |
|---|---|---|
| `scoring.test.ts` | Bordes 13/14, 27/28, 40/41 y 0/54; textos y capas exactos; subtotales y estados; grounding; confianza solo baja; el ensamblaje ignora nivel/puntaje/textos del modelo | Cambia la lógica de nivel o el modelo puede imponer un resultado |
| `schemas.test.ts` | `puntaje` solo entero 0–3; faltantes rechazados; `puntaje_total`/`nivel_id` descartados; catálogos de `para_quien` y `urgencia` | Se acepta una salida inválida |
| `provider.test.ts` | Gemini es el proveedor por defecto con los modelos fijados; en Vercel (OIDC) Gemini no se desvía al gateway; con gateway siempre hay ZDR; DeepSeek restringido a proveedores de EE.UU.; topes por agente | Cambia el proveedor por defecto sin querer o se pierde el ZDR |
| `idioma.test.ts` | En español `conIdioma` devuelve el prompt idéntico; en inglés lo conserva como prefijo, no traduce la etiqueta de cierre, las citas ni los valores del esquema; `rubrica_version` lleva `+en`; la cookie se lee bien | El modo inglés altera el prompt en español o rompe el cierre/grounding |
| `prompts.test.ts` (lint de prompts) | `RUBRICA_VERSION` existe y la reexportan los 3 prompts; `ICEBERGS` = `CLAUDE.md` §4; rangos 0–54 sin huecos; 18 preguntas con 4 anclas; spotlighting; tag de cierre y regla de privacidad en el Agente 1; rutas progresivas en el Agente 3 | Alguien parafrasea un texto oficial, borra anclas o la versión |

Evaluación con modelos (manual, con costo): `npm run eval:agentes` escribe `eval/resultados/<fecha>-<hora>.md` (+ `.json` crudo) con exactitud de nivel, MAE por pregunta, kappa ponderado vs. golden y entre proveedores, tasa de JSON inválido, citas no verificadas, latencia p50/p95, tokens, estabilidad entre repeticiones y detección de manipulación. Opciones: `--proveedor gemini|deepseek`, `--repeticiones N`, `--solo g01,g02`; `EVAL_PAUSA_MS` para respetar cuotas. `npm run eval:promptfoo` corre el mismo golden set en promptfoo (esquema, nivel y ausencia de campos calculados), sin grounding.

## 5. Qué NO hacer

- No pedirle al modelo el total, el nivel, el iceberg ni los textos oficiales "para verificar": se ignoran y abren una vía de manipulación.
- No editar textos del iceberg en `matriz.ts` sin que cambien primero en `CLAUDE.md` §4 (la prueba lo impide).
- No cambiar un prompt sin subir `RUBRICA_VERSION` ni correr el golden set.
- No usar alias de modelo sin versión ni cambiar el modelo por defecto sin evaluación.
- No enviar la transcripción al Agente 3 "para dar contexto": las citas por pregunta y el contexto territorial bastan.
- No subir `maxOutputTokens` para "arreglar" JSON truncado sin medir: el razonamiento consume tokens de salida; preferir bajar `reasoning`.
- No comparar resultados de distintas `RUBRICA_VERSION` en reportes o en el taller de pilotaje.

## 6. Cómo extenderlo

**Cambiar un prompt sin romper la comparabilidad**
1. Editar el archivo en `src/lib/prompts/`. Si es el Agente 2, revisar que las `ANCLAS` sigan siendo coherentes.
2. Subir `RUBRICA_VERSION` en `src/lib/prompts/version.ts`.
3. `npm run check:agentes`.
4. Correr el golden set con la versión anterior (desde `main`) y con la nueva: `npm run eval:agentes -- --repeticiones 3`.
5. Comparar contra los umbrales de la regla 6 y adjuntar ambos reportes al PR.

**Cambiar de proveedor o de modelo**
1. Agregar o cambiar el id en `MODELOS` (`provider.ts`), siempre con versión fija. Para probar sin tocar código: `AI_PROVIDER` y `AI_MODEL_ENTREVISTADOR|ANALISTA|SINTETIZADOR`.
2. Verificar en `https://ai-gateway.vercel.sh/v1/models/<id>/endpoints` qué proveedores tienen `has_zdr: true` y en qué país operan; ajustar `PROVEEDORES_ZDR_DEEPSEEK` o `AI_GATEWAY_PROVIDERS`.
3. Correr el golden set con ambos (`--proveedor`), con `--repeticiones 3`, y cumplir la regla 6 (kappa ≥ el del proveedor anterior).
4. Migrar por etapas: primero el Agente 1 (menor riesgo), luego el 2 y el 3 solo si cumplen umbrales.
5. Registrar un ADR si cambia el proveedor por defecto o la política de retención.

**Agregar un caso al golden set:** crear `eval/golden/gNN.json` con el formato de `eval/golden/README.md` (18 puntajes, `total_esperado` = suma y dentro del nivel, `justificacion` por pregunta). Mantener ≥ 5 casos por nivel y los casos de "no sabe", vagos, bordes y manipulación.

**Agregar un campo a la salida del Agente 3:** agregarlo a `SintesisOutputSchema`, al prompt, a `Recomendacion`/`DiagnosticoResult` en `types.ts` como opcional (la UI lo adopta después), subir `RUBRICA_VERSION`.

## 7. Decisiones y fuentes

- ADR: `docs/decisiones/2026-11-06-puntaje-en-codigo.md`, `docs/decisiones/2026-11-06-proveedor-ia-gateway-zdr.md`.
- Informes: `docs/investigacion/02-deepseek.md` (modelos, thinking, JSON, ZDR, marco legal), `docs/investigacion/04-metodologia-recomendaciones.md` §3 (rúbricas ancladas, evidencia obligatoria, versionado, kappa > 0,6) y §4 (rutas progresivas), `docs/investigacion/01-seguridad.md` §2 (prompt injection).
- Resultados de evaluación: `eval/resultados/`.
- Decisión del equipo (2026-11-06): se mantiene Gemini y no se migra a DeepSeek; la decisión abierta 6 del plan (modelo del Agente 3 en DeepSeek) queda sin efecto. Se queda en el nivel gratuito; el Agente 2 pasa a `gemini-3.5-flash`. Pendiente: completar la evaluación de `gemini-3.5-flash` (10 de 20 casos) en días distintos, con `--solo` para respetar las ~20 solicitudes/día por modelo.

## 8. Historial

| Fecha | Versión | Cambio |
|---|---|---|
| 2026-11-07 | 1.3 · rúbrica `2026-11-06.1` (+en) | Modo inglés experimental (regla 13): directiva de idioma solo en inglés, `rubrica_version` con sufijo `+en`, idioma por cookie. El español no cambia. Pendiente: casos en inglés en el golden set. |
| 2026-11-06 | 1.2 · rúbrica `2026-11-06.1` | Nivel gratuito de Gemini: Agentes 2 y 3 en `gemini-3.5-flash` (el Pro no tiene cuota gratuita), Agente 1 en `gemini-3-flash-preview`. |
| 2026-11-06 | 1.1 · rúbrica `2026-11-06.1` | Se mantiene Gemini como proveedor por defecto; DeepSeek queda detrás de `AI_PROVIDER=deepseek`, no adoptado. Prueba `tests/provider.test.ts` en `check:agentes`. |
| 2026-11-06 | 1.0 · rúbrica `2026-11-06.1` | Creación. Prompts a `src/lib/prompts/`, anclas 0–3 para las 18 preguntas, puntaje y nivel en código, grounding, spotlighting, esquemas zod con `Output.object`, rutas progresivas en el Agente 3 (`primer_paso`, `siguiente_paso`, `ruta_ampliada`, `para_quien`), Agente 3 sin transcripción, proveedor DeepSeek vía AI Gateway con ZDR y Gemini como fallback, golden set de 20 casos y `eval-agentes.ts`. |
