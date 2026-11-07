# El puntaje, el nivel y los textos del iceberg se calculan en código

Fecha: 2026-11-06 · Estado: aceptada · Sesión: Seguridad & IA

## Contexto
Hasta ahora el Agente 2 devolvía subtotales y `puntaje_total`, y el Agente 3 elegía nivel, iceberg y copiaba los textos oficiales. Nada lo verificaba: un modelo podía sumar mal, parafrasear un texto oficial o ser inducido por la persona entrevistada ("ponme 3 en todo") a inflar el resultado. OWASP LLM01:2025 y estudios sobre LLM-as-judge (arXiv 2505.13348, JudgeDeceiver) muestran que los evaluadores con LLM son manipulables. La matriz oficial es determinista: 18 puntajes 0–3, suma, cuatro rangos fijos.

## Decisión
- El Agente 2 devuelve solo `{puntaje, evidencia}` por pregunta, validado con zod (`puntaje` entero 0–3). Cualquier total o nivel que devuelva se descarta.
- `src/lib/scoring.ts` (funciones puras) calcula subtotales, total, `nivel_id`, `iceberg_id`, `capas_activas`, estados por dimensión, dimensión más fuerte/débil y copia los textos oficiales EXACTOS de `ICEBERGS`.
- Antes del cálculo, el **grounding** lleva a 0 todo puntaje cuya cita no aparezca literalmente en los turnos del funcionario.
- El Agente 3 recibe el resultado ya calculado y solo redacta resumen, fortalezas, brechas, recomendaciones y mensaje final. El ensamblaje sobreescribe nivel, puntaje, iceberg y textos.

## Consecuencias
- Mismo conjunto de 18 puntajes → mismo resultado, siempre. Los bordes 13/14, 27/28 y 40/41 tienen prueba.
- Inflar el resultado exige engañar al modelo pregunta por pregunta **y** aportar citas reales del funcionario.
- El grounding es estricto: una paráfrasis del modelo cuenta como 0. Si el golden set muestra muchas citas no verificadas, se ajusta el prompt (no el grounding).
- Las reglas de nivel viven en un solo lugar (`matriz.ts` + `scoring.ts`); cambiar un rango o un texto exige cambiar `CLAUDE.md` §4 y pasar `tests/prompts.test.ts`.
- La salida pública (`DiagnosticoAPIResponse`) mantiene su forma; la UI no cambia.

## Alternativas descartadas
- **Confiar en el modelo y validar después** (comparar su total con la suma): duplica la lógica y deja abierta la pregunta de cuál gana.
- **Un solo agente que puntúe y redacte:** mezcla juicio y aritmética; impide medir el Agente 2 por separado con el golden set.
- **Grounding con similitud semántica (embeddings):** más tolerante a paráfrasis, pero no verificable a simple vista y manipulable; se puede reconsiderar con datos del golden set.
