# Proveedor de IA: DeepSeek vía Vercel AI Gateway con retención cero; Gemini como fallback

Fecha: 2026-11-06 · Estado: aceptada (por defecto, reversible con `AI_PROVIDER`) · Sesión: Seguridad & IA

## Contexto
El plan (`docs/plan-feedback.md` §2.2 y decisión abierta 1) propone migrar de Gemini a DeepSeek por costo. Las entrevistas contienen datos personales (cargo, municipio, a veces nombres) de funcionarios públicos colombianos. La API oficial de DeepSeek procesa y almacena en China, retiene mientras exista la cuenta, puede usar los datos para entrenar y no ofrece retención cero; China no figura en la lista de países con nivel adecuado de la SIC (Ley 1581/2012 art. 26; Circular SIC 005/2017). Además, al revisar el proyecto se encontró que la clave de Gemini configurada localmente es de **nivel gratuito**, que Google puede usar para mejorar sus productos, y que no tiene cuota para `gemini-3.1-pro` (el Agente 3 actual no puede correr con ella).

## Decisión
- `AI_PROVIDER=deepseek` (por defecto): DeepSeek V4.1 Flash `deepseek/deepseek-v4.1-flash-1017` para los tres agentes, **siempre vía Vercel AI Gateway** con `providerOptions.gateway.zeroDataRetention: true`.
- Además del ZDR, el gateway se restringe con `only`/`order` a proveedores de EE.UU. con acuerdo ZDR: `baseten, fireworks, togetherai, digitalocean, parasail` (configurable con `AI_GATEWAY_PROVIDERS`). Se excluye a Alibaba aunque el gateway lo marque con ZDR, por ser un proveedor chino cuya región de procesamiento no está documentada.
- `AI_PROVIDER=gemini`: fallback. Vía gateway (con ZDR) si hay credencial del gateway; si no, directo con `GOOGLE_GENERATIVE_AI_API_KEY`, que debe ser de nivel de pago.
- Agente 1 sin razonamiento; Agentes 2 y 3 con `reasoning: 'low'`. El modelo del Agente 3 (Flash vs. V4 Pro) se decide con el golden set cuando haya créditos del gateway.
- Se usan créditos del gateway, no BYOK, para que el presupuesto del gateway sea un tope real.

## Consecuencias
- Nunca se usa `@ai-sdk/deepseek` ni `DEEPSEEK_API_KEY`. Cambiar de proveedor es una variable de entorno, sin redeploy de código.
- Requiere AI Gateway con créditos (o plan Pro) y un presupuesto con alertas; sin eso, producción debe quedarse en `AI_PROVIDER=gemini` con clave de pago.
- **Al momento de esta decisión no había `AI_GATEWAY_API_KEY`**: DeepSeek no se pudo evaluar con el golden set; la evaluación registrada es solo de Gemini Flash directo. La migración efectiva de cada agente queda condicionada a cumplir los umbrales de `docs/estandares/agentes-ia.md` §2.
- La política de datos solo puede afirmar retención cero cuando producción use el gateway (texto en `docs/estandares/seguridad.md` §7).
- Si la lista de proveedores con ZDR cambia, el gateway puede quedarse sin proveedor elegible y fallar: hay que revisar la página de endpoints del modelo al cambiarlo.

## Alternativas descartadas
- **API oficial de DeepSeek:** sin ZDR, datos en China, uso para entrenamiento; incompatible con la Circular SIC 002/2024 y mala señal para entidades públicas.
- **Azure AI Foundry directo (UE):** viable, pero agrega otra cuenta, otra SDK y otra facturación; el gateway ya enruta a proveedores con ZDR y permite fallback. Se puede reconsiderar si se exige residencia en UE.
- **Quedarse en Gemini directo:** más simple, pero hoy con clave gratuita (uso para entrenamiento) y sin cuota para el modelo Pro.
