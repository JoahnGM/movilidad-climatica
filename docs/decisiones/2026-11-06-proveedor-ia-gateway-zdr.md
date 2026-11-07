# Proveedor de IA: se mantiene Gemini (nivel de pago); DeepSeek queda implementado pero no adoptado

Fecha: 2026-11-06 · Estado: aceptada (decisión del equipo) · Sesión: Seguridad & IA

## Contexto
El plan (`docs/plan-feedback.md` §2.2 y decisión abierta 1) proponía migrar de Gemini a DeepSeek por costo, y la recomendación técnica era hacerlo solo vía Vercel AI Gateway con retención cero (ZDR), nunca con la API oficial de DeepSeek (datos en China, sin ZDR, posible uso para entrenamiento; China no está en la lista de países adecuados de la SIC).

Al revisar el proyecto se encontró que la clave de Gemini en uso era de **nivel gratuito**: Google puede usar los prompts para mejorar sus productos, el límite es de 20 solicitudes/día por modelo (una entrevista usa ~20) y no hay cuota para `gemini-3.1-pro`, el modelo del Agente 3.

## Decisión
- **Se mantiene Gemini** como proveedor (`AI_PROVIDER=gemini`, valor por defecto): `gemini-3-flash-preview` para los Agentes 1 y 2 y `gemini-3.1-pro-preview` para el Agente 3, llamados directo con `GOOGLE_GENERATIVE_AI_API_KEY`.
- **La clave se reemplaza por una de nivel de pago**, en el que Google no usa los prompts para mejorar sus productos. Es una acción manual del equipo en `.env.local` y en Vercel.
- **No se migra a DeepSeek.** El código queda disponible detrás de `AI_PROVIDER=deepseek`, siempre vía AI Gateway con `zeroDataRetention: true` y solo proveedores de EE.UU. con ZDR (`baseten, fireworks, togetherai, digitalocean, parasail`; se excluye a Alibaba). No es el camino por defecto ni está evaluado.
- Gemini pasa por AI Gateway (con ZDR) **solo** si se define `AI_GATEWAY_API_KEY` de forma explícita. No se usa `VERCEL_OIDC_TOKEN` como señal porque existe en todos los despliegues de Vercel y desviaría el tráfico a un gateway sin créditos.

## Consecuencias
- No hace falta cuenta ni presupuesto de AI Gateway; el control de costos queda en los topes de código (`maxOutputTokens`, timeout, kill switch, rate limit) y en el presupuesto o alertas de facturación de Google Cloud.
- La política de datos debe describir el procesamiento por la API de Gemini de pago (texto en `docs/estandares/seguridad.md` §7), no la retención cero del gateway.
- Si en el futuro se quiere DeepSeek o retención cero contractual, basta con credenciales del gateway y cambiar una variable, pero antes hay que correr el golden set y cumplir los umbrales de `docs/estandares/agentes-ia.md` §2, y registrar un ADR nuevo.
- Con la clave gratuita, la evaluación registrada el 2026-11-06 quedó parcial (`eval/resultados/`). Hay que repetirla completa, con `--repeticiones 3`, cuando esté la clave de pago.

## Alternativas descartadas
- **Migrar a DeepSeek vía AI Gateway con ZDR:** menor costo por token y retención cero, pero exige otra cuenta y créditos, y no hay benchmark en español; el equipo prefirió no cambiar de proveedor.
- **API oficial de DeepSeek:** sin ZDR, datos en China; incompatible con la Circular SIC 002/2024.
- **Seguir con la clave gratuita de Gemini:** uso de prompts para entrenamiento, 20 solicitudes/día y sin acceso al modelo del Agente 3.
