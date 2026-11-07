# Proveedor de IA: se mantiene Gemini en nivel gratuito; DeepSeek queda implementado pero no adoptado

Fecha: 2026-11-06 · Estado: aceptada (decisión del equipo) · Sesión: Seguridad & IA

## Contexto
El plan (`docs/plan-feedback.md` §2.2 y decisión abierta 1) proponía migrar de Gemini a DeepSeek por costo, y la recomendación técnica era hacerlo solo vía Vercel AI Gateway con retención cero (ZDR), nunca con la API oficial de DeepSeek (datos en China, sin ZDR, posible uso para entrenamiento; China no está en la lista de países adecuados de la SIC).

Al revisar el proyecto se confirmó que la clave de Gemini en uso es de **nivel gratuito**. En ese nivel: (a) Google puede usar los prompts y las respuestas para mejorar sus productos; (b) las cuotas son **por proyecto de Google Cloud y por modelo**, no por clave (observado: 20 solicitudes/día para `gemini-3-flash`); (c) `gemini-3.1-pro` tiene cuota 0, así que el Agente 3 configurado no podía correr.

## Decisión
- **Se mantiene Gemini en nivel gratuito** (`AI_PROVIDER=gemini`, valor por defecto), llamado directo con `GOOGLE_GENERATIVE_AI_API_KEY`.
- Modelos por defecto, elegidos para que todos tengan cuota gratuita y para que el chat y el diagnóstico no compartan la misma cuota diaria:
  - Agente 1 (entrevistador): `gemini-3-flash-preview`
  - Agentes 2 y 3 (analista y sintetizador): `gemini-3.5-flash`. Es el analista con la evaluación más completa disponible (`eval/resultados/2026-11-06-2051-gemini-3.5-flash.md`).
  - `gemini-3.1-pro-preview` deja de ser el modelo del Agente 3.
- **No se migra a DeepSeek.** El código queda detrás de `AI_PROVIDER=deepseek`, siempre vía AI Gateway con `zeroDataRetention: true` y solo proveedores de EE.UU. con ZDR (se excluye a Alibaba). No está adoptado ni evaluado.
- Gemini pasa por AI Gateway **solo** si se define `AI_GATEWAY_API_KEY` explícitamente. No se usa `VERCEL_OIDC_TOKEN` como señal porque existe en todos los despliegues de Vercel.

## Consecuencias
- **Capacidad:** una entrevista usa ~16–20 llamadas al Agente 1, así que con ~20 solicitudes/día por modelo el nivel gratuito alcanza para aproximadamente **una entrevista completa al día por proyecto**. El desarrollo local y producción comparten esa cuota si sus claves pertenecen al mismo proyecto. Para un taller con varios municipios en un mismo día hace falta activar facturación (nivel de pago) o repartir proyectos.
- **Datos:** en el nivel gratuito Google puede usar el contenido para mejorar sus productos. Esto choca con la minimización que pide la Circular SIC 002/2024: la política de datos debe decirlo explícitamente y pedir que no se escriban datos personales (texto en `docs/estandares/seguridad.md` §7). El Agente 1 ya no pide nombres ni datos de contacto.
- **Comparabilidad:** el cambio de modelo del Agente 2 (de `gemini-3-flash-preview` a `gemini-3.5-flash`) cambia la rúbrica efectiva. La evaluación disponible es parcial (10 de 20 casos); hay que completarla cuando haya cuota.
- Pasar a nivel de pago no exige cambios de código: basta con activar la facturación en el proyecto de Google Cloud. Volver a `gemini-3.1-pro-preview` en el Agente 3 se hace con `AI_MODEL_SINTETIZADOR`.
- Adoptar DeepSeek o retención cero contractual requiere credenciales del gateway, correr el golden set con los umbrales de `docs/estandares/agentes-ia.md` §2 y registrar un ADR nuevo.

## Alternativas descartadas
- **Nivel de pago de Gemini:** sin uso de datos para mejorar productos y con cuotas amplias, pero con costo; el equipo prefirió no pagar por ahora.
- **Migrar a DeepSeek vía AI Gateway con ZDR:** retención cero, pero exige otra cuenta y créditos.
- **API oficial de DeepSeek:** sin ZDR, datos en China; incompatible con la Circular SIC 002/2024.
