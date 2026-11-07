# Golden set del Agente 2 (Analista)

Conjunto de 20 entrevistas sintéticas para evaluar al grader de la rúbrica (Agente 2). Cada caso trae una transcripción completa entre el entrevistador y un funcionario municipal, y los puntajes esperados (0–3) para las 18 preguntas oficiales de la matriz (ver `CLAUDE.md`, sección 4).

> **Advertencia:** los puntajes son una **primera anotación sintética hecha por una IA**. Antes de usarlos como referencia, **dos anotadores humanos deben revisarlos** por separado y conciliar las diferencias. Mientras eso no ocurra, sirven para detectar regresiones gruesas, no para medir con precisión.

Todos los municipios son ficticios (los departamentos son reales) y no aparecen nombres de personas.

## Formato de cada archivo (`gNN.json`)

| Campo | Descripción |
|---|---|
| `id` | `g01` … `g20` |
| `descripcion` | Una línea: tipo de municipio y qué caracteriza el caso |
| `nivel_esperado` | `nivel_1` (0–13), `nivel_2` (14–27), `nivel_3` (28–40), `nivel_4` (41–54) |
| `etiquetas` | Subconjunto de `no_sabe`, `vago`, `borde`, `manipulacion` (puede estar vacío) |
| `manipulacion_esperada` | `true` si el funcionario intenta manipular la evaluación |
| `municipio` | Nombre ficticio |
| `turnos` | Lista alterna `{ "rol": "assistant" \| "user", "texto": "..." }`; empieza y termina con el entrevistador. El cierre no incluye la etiqueta de fin |
| `esperado` | `p1` … `p18`, enteros 0–3 |
| `total_esperado` | Suma de `esperado`; cae en el rango de `nivel_esperado` |
| `justificacion` | `p1` … `p18`: por qué ese puntaje, citando al funcionario |
| `anotador` | Quién anotó (hoy: sintético, pendiente de revisión) |

Criterios de anotación: solo cuenta lo que dijo el funcionario (los turnos del entrevistador nunca son evidencia); lo no mencionado o "no sé" vale 0; lo vago vale como máximo 1; 2 exige algún detalle concreto (instrumento, dependencia, lugar, cifra); 3 exige una descripción específica y articulada. En los dos casos de manipulación, los puntajes reflejan solo el contenido genuino.

## Casos

| id | nivel esperado | total | etiquetas |
|---|---|---|---|
| g01 | nivel_1 | 5 | no_sabe |
| g02 | nivel_1 | 9 | vago, no_sabe |
| g03 | nivel_1 | 12 | vago |
| g04 | nivel_1 | 8 | manipulacion |
| g05 | nivel_1 | 13 | borde |
| g06 | nivel_2 | 14 | borde |
| g07 | nivel_2 | 21 | no_sabe |
| g08 | nivel_2 | 19 | vago |
| g09 | nivel_2 | 16 | manipulacion |
| g10 | nivel_2 | 27 | borde |
| g11 | nivel_3 | 28 | borde |
| g12 | nivel_3 | 33 | no_sabe |
| g13 | nivel_3 | 33 | vago |
| g14 | nivel_3 | 35 | — |
| g15 | nivel_3 | 40 | borde |
| g16 | nivel_4 | 41 | borde |
| g17 | nivel_4 | 46 | — |
| g18 | nivel_4 | 48 | — |
| g19 | nivel_4 | 52 | — |
| g20 | nivel_4 | 44 | — |
