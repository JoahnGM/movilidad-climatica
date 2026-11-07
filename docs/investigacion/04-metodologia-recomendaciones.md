# Investigación: nota metodológica y recomendaciones progresivas

Fecha de consulta: 2026-11-06. Todo lo marcado **[no confirmado]** proviene de fragmentos de búsqueda o de memoria y debe verificarse antes de citarlo en la plataforma.

## 1. Herramientas comparables y cómo documentan su metodología

**UNDRR Disaster Resilience Scorecard for Cities / MCR2030 (2017)** — https://mcr2030.undrr.org/online-disaster-resilience-scorecard-cities. Dos niveles: *preliminar* (47 indicadores, **escala 0–3**, taller de 1–2 días) y *detallado* (117 indicadores, escala 0–5, 1–4 meses). Organizado por los "Diez Esenciales" (1–3 gobernanza/finanzas, 4–8 planeación y preparación). Es el antecedente más directo de nuestra escala 0–3 y del formato "autoevaluación rápida vs. profunda". Su documentación explica: propósito, a quién va dirigido, cómo se puntúa cada indicador con descriptores por nivel, qué NO mide (no es ranking entre ciudades) y cómo usar el resultado para un plan de acción.

**DNP — Índice Municipal de Riesgo de Desastres ajustado por Capacidades (2018)** — https://www.dnp.gov.co/LaEntidad_/subdireccion-general-prospectiva-desarrollo-nacional/direccion-ambiente-desarrollo-sostenible/Paginas/indice-municipal-de-gestion-de-riesgo-ajustado-por-capacidades.aspx y PDF https://www.asocapitales.co/wp-content/uploads/2020/06/IndiceMunicipaldeRiesgodeDesastres.pdf. Combina un componente de riesgo con un índice de capacidades (financieras, de gestión del riesgo y socioeconómicas); tiene una "guía de interpretación" con el Banco Mundial. Útil como referencia colombiana para la idea de "ajustar por capacidades". **[no confirmado]**: no se encontró un "índice de capacidades" oficial de la UNGRD; solo trabajos académicos (IGRM).

**IOM — Integrated Human Mobility Assessment Tool (DRR/CCA)** — descrito solo en convocatorias (p. ej. https://www.preventionweb.net/vacancy/consultancy-migration-environment-climate-change-and-disaster-risk-reduction-mecc-drr): cuestionario de 500+ preguntas en 5 dimensiones de capacidad (gobernanza, capacidad de implementación, financiación, conocimiento y datos, tecnología). Es de nivel nacional, piloto Sierra Leona. **[no confirmado]** que exista documento metodológico público.

**UNDRR/PDD/NRC — Words into Action: Disaster Displacement (2019)** — https://www.undrr.org/publication/words-action-guidelines-disaster-displacement. Dirigido a actores locales; organizado por las 4 prioridades de Sendai; incluye un *checklist* para identificar brechas y priorizar. Buen modelo de "lista de verificación" para el formulario rápido.

Estructura típica de una nota metodológica de 1 página en estas herramientas: (1) qué es y para quién, (2) marco conceptual de origen, (3) dimensiones e indicadores, (4) escala y descriptores, (5) cómo se calcula e interpreta el resultado, (6) limitaciones y uso previsto, (7) referencias.

## 2. Antecedentes conceptuales de las 6 dimensiones

- **Agenda de Protección Nansen (2015)**, respaldada por 109 Estados; tres áreas: protección de desplazados transfronterizos, gestión del riesgo de desplazamiento en el país de origen, migración como adaptación. **PDD (2016)** la implementa — https://disasterdisplacement.org/wp-content/uploads/2016/10/02062016-PDD-Strategic-Framework-FINAL.pdf. Sustenta D1 (tipologías: desplazamiento, migración, reubicación planificada, inmovilidad) y D5.
- **Grupo de Trabajo sobre Desplazamiento (CMNUCC, WIM)**, creado en COP21, recomendaciones 2018 — contenido no recuperado en esta búsqueda **[no confirmado]**. Pacto Mundial para la Migración objetivos 2 y 5 (de memoria, no verificado hoy).
- **Colombia**: Ley 1523/2012 (SNGRD, PMGRD, CMGRD → D2, D3); Ley 2169/2021 (acción climática) — no se halló artículo específico sobre movilidad humana **[no confirmado]**; CONPES 3700 (2011) y 4058 (2021) de memoria, no verificados. Hallazgos recientes relevantes:
  - **Sentencia T-123 de 2024** (Corte Constitucional) reconoce el desplazamiento interno por factores ambientales.
  - **Ley 2577 de 2026** reconoce el desplazamiento por cambio climático, degradación ambiental y desastres — vista solo en fragmentos (https://www.dmsjuridica.com/buscador_20179478954/legislacion/leyes/2026/06/23/ley-2577-de-2026/) **[verificar texto completo]**.
  - **Minambiente/PNUD, "Hoja de ruta para la construcción de la política pública de desplazamiento interno asociado a desastres y eventos de evolución lenta"** (versión de trabajo abril 2026; publicación julio 2026) — https://www.minambiente.gov.co/cambio-climatico-y-gestion-del-riesgo/movilidad-humana-y-cambio-climatico/ y https://www.undp.org/sites/g/files/zskgke326/files/2026-06/undp_co_pub_insumospp_desplazamiento_desastres_jul_2026.pdf. Ejes: gobernanza (arquitectura institucional, financiación) y gestión integral del ciclo (prevención, ordenamiento, respuesta). Es la mejor fuente nacional para justificar D2–D5.
  - **Defensoría del Pueblo**, lineamientos sobre justicia climática y movilidad humana (sept. 2025) y Mesa de Articulación Institucional sobre Movilidad Climática — https://www.defensoria.gov.co/w/lineamientos-para-avanzar-en-justicia-climatica-y-movilidad-humana. Sustenta D6.
  - No existe (según lo encontrado) una "Estrategia de movilidad humana en contexto de cambio climático" de Cancillería con ese nombre; sí la Primera Conferencia Regional con OIM (c. 2023).

## 3. Calibrar rúbricas 0–3 con LLM evaluador

Fuentes: RULERS (arXiv 2601.08654), "Rubric-Conditioned LLM Grading" (https://arxiv.org/html/2601.08843v1), "Geometry of LLM-as-Judge" (arXiv 2606.03043), guía Kinde (https://kinde.com/learn/ai-for-software-engineering/best-practice/llm-as-a-judge-done-right-calibrating-guarding-debiasing-your-evaluators/). Prácticas que convergen:
- **Rúbrica anclada**: por cada pregunta, 1–2 ejemplos de respuesta típica para 0, 1, 2 y 3 (ya tenemos los descriptores; faltan los ejemplos).
- **Evidencia citada obligatoria** (ya implementado: campo `evidencia`); puntaje sin cita → 0.
- **Rúbrica "congelada" y versionada**: si cambia, no comparar resultados entre versiones.
- **Auditoría humana** de 100–300 transcripciones; kappa de Cohen judge-humano > 0,6 como umbral práctico (heurística de proveedor, no estándar).
- Separar **repetibilidad** (misma entrevista, varias corridas) de **alineación** (vs. evaluador humano); la concordancia entre LLMs no equivale a validez.
- **Reportar confianza al usuario**: mostrar el campo `confianza` y `gaps_de_informacion` con texto como "este puntaje refleja lo dicho en la entrevista; temas no mencionados puntúan 0".

## 4. Recomendaciones diferenciadas por capacidad

**Ley 617 de 2000** (https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=3771): categorías Especial, 1ª–6ª por población e ICLD (6ª: ≤10.000 hab. y ≤15.000 SMLMV; prevalece el criterio de ingresos). ~90% de los municipios son categoría 6 (dato de memoria, **no verificado**). PDET: 170 municipios (Decreto 893/2017, de memoria).

Literatura de *pathways*: Clarence City Council (https://coastadapt.com.au/sites/default/files/case_studies/SS42_Clarence_City_Council_pathways.pdf): ruta en 3 etapas, proyectos "no/low regret" primero, sin cerrar opciones futuras; ICLEI USA (2024) "Spectrum of Community Implementation Readiness" (https://icleiusa.org/wp-content/uploads/2024/01/Adaptation-in-Climate-Planning-and-Implementation_-Recommendations-for-U.S.-Local-Governments.pdf).

**Plantilla propuesta para `Recomendacion`** (ampliar el tipo actual):
```
dimension, area,
primer_paso:   acción sin costo o con recursos existentes (≤6 meses, ej. "incluir la movilidad climática como tema en la próxima sesión del CMGRD")
siguiente_paso: requiere decisión administrativa o articulación (6–18 meses, ej. "incorporar un capítulo en la actualización del PMGRD")
ruta_ampliada: requiere inversión, cooperación o instrumento formal (>18 meses, ej. "programa de reasentamiento con enfoque de derechos")
para_quien:    "todos" | "categoria_1_3" | "categoria_4_6_PDET"
```
Criterios de priorización (mostrar al usuario como pregunta de cierre): (1) riesgo principal declarado en la entrevista, (2) dimensión más débil, (3) capacidad fiscal/categoría, (4) ventanas institucionales (actualización de POT/PMGRD, plan de desarrollo), (5) acciones "sin arrepentimiento" primero. Tono: "ruta sugerida, no lista de obligaciones; el municipio decide por dónde empezar".

## 5. Formulario rápido de 18 preguntas

Ventajas: comparabilidad y repetibilidad (misma rúbrica para todos), menor tiempo, línea base para auditar al LLM. Riesgo: sesgo de autoinforme (sobreestimación). Mitigaciones halladas (AFROSAI-E, INQAAHE, WHO IHR): opción explícita "No sabe" (=0, ya prevista en la matriz), exigir un campo "¿qué instrumento/evidencia lo respalda?" por pregunta con puntaje ≥2, descriptores de nivel con ejemplos concretos, y contrastar formulario vs. entrevista como control de consistencia. Se recomienda que el formulario alimente al Agente 3 con el mismo JSON de scores y que el resultado indique "modo: autoevaluación rápida" con confianza "media" por defecto.

## Borrador de estructura — Nota metodológica (1 página)

1. **Qué es esta herramienta** — "Diagnóstico de preparación institucional frente a la movilidad climática; no mide el riesgo del territorio sino la capacidad de respuesta institucional."
2. **De dónde vienen las dimensiones** — "Las 6 dimensiones sintetizan la Agenda de Protección Nansen/PDD, el enfoque de capacidades del Scorecard UNDRR y el marco colombiano (Ley 1523/2012, Sentencia T-123/2024, Hoja de ruta Minambiente-PNUD 2026)."
3. **Qué evalúa cada dimensión** — tabla de 6 filas con 1 frase.
4. **Escala y criterios** — "Cada pregunta puntúa 0–3 según exista y qué tan articulada esté la capacidad; 'no sabe' = 0. Solo cuenta lo dicho explícitamente."
5. **Cómo se interpreta el resultado** — "El puntaje total (0–54) ubica al territorio en uno de 4 niveles representados por el iceberg; el nivel describe un momento, no una calificación."
6. **Limitaciones** — "Es una autoevaluación basada en la perspectiva de quien responde; no sustituye un diagnóstico técnico; los resultados dependen de la calidad de la conversación y pueden variar entre sesiones."
7. **Cómo usar las recomendaciones** — "Se formulan como rutas progresivas; cada municipio prioriza según su necesidad principal y capacidad."
8. **Referencias** — lista corta de los documentos verificados arriba.
