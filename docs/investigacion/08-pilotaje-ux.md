# Piloto y validación de la plataforma Movilidad Climática — propuesta basada en evidencia

> Fecha de investigación: 2026-11-06. Marcado **[NC]** = no confirmado en fuente primaria / fuente secundaria o fuera del rango 2023-2026.

## 1. Taller de pilotaje (105 min, formato híbrido validación + promoción)

**Participantes:** 5-6 funcionarios por sesión (planeación, ambiente, gestión del riesgo, inclusión social). Base: NN/g sostiene que 5 usuarios descubren ~85 % de los problemas y que conviene iterar en rondas pequeñas (artículo de 2000, sigue siendo la referencia canónica **[NC: fuera del rango]**); 18F limita cada prueba a ≤9 usuarios; GOV.UK recomienda sesiones de 30-60 min con note-taker dedicado (guía de 2017, aún vigente **[NC: no actualizada]**). Si hay dos perfiles muy distintos (capital vs. municipio categoría 5-6), 3-4 por grupo.

**Roles:** 1 moderador (no interviene, solo pide "pensar en voz alta"), 1 note-taker por mesa, 1-2 observadores que alimentan un *rolling issues log* (18F), 1 anfitrión institucional (aliado convocante).

**Materiales:** laptops/celulares con la plataforma en producción (no demo), consentimiento informado de 1 página (anónimo, sin datos personales), guion del moderador, plantilla de registro (tarea · momento · cita textual · severidad 1-3), cuestionario post-uso (sección 2), one-pager de la plataforma, cronómetro.

| Min | Bloque | Qué pasa | Qué se registra |
|---|---|---|---|
| 0-10 | Apertura | Encuadre: "el prototipo es el evaluado, no ustedes"; pedir crítica honesta (IDEO: la gente elogia por cortesía) | — |
| 10-20 | Pre-encuesta | 3 ítems: rol, ¿en qué nivel (1-4) cree que está su municipio?, familiaridad con "movilidad climática" | Autopercepción previa |
| 20-25 | Demo guiada | Se muestra **el ejemplo de resultado** (municipio ficticio) 3 min, sin explicar conceptos | Preguntas espontáneas sobre conceptos |
| 25-60 | Uso individual think-aloud | Cada participante completa el chat-diagnóstico con su propio municipio | Abandonos, confusiones, tiempo, cita textual al ver el iceberg |
| 60-70 | Cuestionario | ≤8 ítems (sección 2) en formulario anónimo | Métricas cuantitativas |
| 70-95 | Conversación guiada | Las 3 preguntas del feedback + "¿El nivel asignado refleja su realidad? ¿Por qué?" + "¿Cuál recomendación aplicaría el lunes?" | Acuerdo nivel vs. autopercepción; utilidad |
| 95-105 | Cierre promocional | Cómo acceder, a quién compartirla, inscripción voluntaria a contacto de seguimiento | Leads |

Después: debrief de 15 min del equipo (18F) y síntesis colaborativa en 48 h.

## 2. Cuestionario post-uso (8 ítems, anónimo)

Diseño: UMUX-Lite (2 ítems, correlación r=.83-.87 con SUS) sustituye al SUS de 10 ítems; SEQ (7 puntos, benchmark 5.3-5.6); S-TIAS 2025 (3 ítems, α=.97) para confianza en IA; NPS **omitido** (NN/g y MeasuringU: no es interpretable con n pequeño). No hay UMUX-Lite ni S-TIAS validados en español **[NC]**; usar traducción directa + retrotraducción, como hizo el SUS-ES (JMIR 2020).

| # | Ítem | Escala | Origen |
|---|---|---|---|
| 1 | Las funciones de esta herramienta cubren lo que necesito | 1-7 | UMUX-Lite |
| 2 | Esta herramienta es fácil de usar | 1-7 | UMUX-Lite |
| 3 | En general, ¿qué tan difícil o fácil fue completar el diagnóstico? | 1 muy difícil – 7 muy fácil | SEQ |
| 4 | Puedo confiar en el diagnóstico que entrega la IA | 1-7 | S-TIAS (ítem 3) |
| 5 | El nivel asignado refleja la realidad institucional de mi municipio | 1-5 | Feedback (realidad) |
| 6 | ¿Qué fue lo más útil? | abierta | Feedback |
| 7 | ¿Qué le generó confusión (conceptos, pasos, resultado)? | abierta | Feedback |
| 8 | ¿Qué necesitaría para aplicar esta herramienta en su trabajo? | abierta | Feedback |

## 3. Micro-encuesta dentro del producto (página /resultado)

Patrón (Cloudscape GenAI feedback + PostHog LLM feedback): 👍/👎 bajo el iceberg → al 👎, chips de razón ("No refleja mi municipio", "No entiendo el nivel", "Recomendaciones poco realistas", "Otro") + comentario opcional; al 👍, confirmación con ícono relleno y "Gracias, registrado"; permitir cambiar el voto. Segundo bloque: "¿Este resultado refleja tu realidad institucional?" 1-5. Advertencia: los pulgares miden "quién quiso hacer clic", no calidad; usarlos como señal, no como KPI.

**Vinculación sin identificar:** guardar `{diagnostico_id: uuid aleatorio generado en cliente, nivel_id, puntaje_total, subtotales, voto, razon, comentario, ts}`; nunca municipio ni transcript. El uuid vive solo en localStorage junto al resultado. Almacenamiento: Postgres (Neon vía Marketplace) con route handler, o PostHog Surveys (1.500 respuestas/mes gratis **[NC: dato de página archivada]**, `cookieless_mode: 'always'`). Tally: gratis ilimitado, hosting UE **[NC: afirmación del proveedor]**; Google Forms: gratis pero la SIC ordenó a Google adecuarse a la Ley 1581 (2017) y las respuestas pueden vincularse a cuenta Google — evitarlo para funcionarios. Sentry User Feedback: incluido sin costo en todos los planes, pero orientado a errores.

## 4. Especificación del "Ejemplo de resultado"

- **Entrada:** botón secundario "Ver ejemplo de resultado" junto al CTA "Iniciar diagnóstico" en HeroSection y en /diagnostico antes del primer mensaje.
- **Contenido:** ruta `/ejemplo` que renderiza los mismos componentes de /resultado con un `DiagnosticoResult` estático de **"Municipio de Ejemplo (ficticio)"**, nivel_2 (puntaje 19/54), iceberg con capa_1+capa_2, 2 fortalezas, 3 brechas, 3 recomendaciones (inmediata/corto/mediano), DimensionBar con subtotales visibles.
- **Etiquetado:** banner persistente superior "Ejemplo ilustrativo con datos ficticios — no corresponde a ningún municipio real", badge "EJEMPLO" en NivelBadge, y CTA al pie "Hacer el diagnóstico de mi municipio". Evita que el usuario confunda datos de muestra con reales (guías de empty states).
- **Evidencia:** solo hay consenso de practicantes (Chameleon, Pendo, Letterhead) de que previsualizar la salida aumenta inicio y confianza; **no se encontraron estudios controlados 2023-2026 [NC]**. Medir el efecto con evento `ejemplo_visto` → `diagnostico_iniciado`.

## 5. Métricas del piloto y analítica

Vercel Web Analytics es cookieless (hash diario, sin tracking entre días) pero **los custom events requieren plan Pro** (Hobby: 50k eventos, sin custom events; Pro: 2 propiedades por evento, $0.03/1k). Plausible: $9/mes, 30 días gratis, sin cookies, datos en UE, custom events incluidos. PostHog: cookieless_mode documentado. Recomendación: Plausible o PostHog cookieless; si el proyecto ya está en Vercel Pro, Vercel.

| Métrica | Cómo medir | Evento / instrumento | Meta piloto |
|---|---|---|---|
| Tasa de finalización | `resultado_mostrado` / `diagnostico_iniciado` | custom event | ≥70 % |
| Tiempo medio | ts primer mensaje → `[ENTREVISTA_COMPLETA]` (cliente) | propiedad `duracion_min` | 12-20 min |
| Abandono por paso | evento `mensaje_enviado` con propiedad `turno` (1-20) | funnel por turno | identificar turno crítico |
| Errores pipeline | `diagnostico_error` (timeout 30 s) + `reintento` | custom event | <10 % |
| Acuerdo nivel vs. autopercepción | pre-encuesta (nivel esperado) vs. nivel_id asignado | taller, por participante | ≥60 % ±1 nivel |
| Realidad institucional | ítem 5 cuestionario + micro-encuesta 1-5 | formulario / DB | mediana ≥4 |
| Utilidad recomendaciones | "¿Cuál aplicaría?" + 👍/👎 | taller + micro-encuesta | ≥1 accionable por persona |
| Efecto del ejemplo | `ejemplo_visto` → `diagnostico_iniciado` | funnel | comparar con/sin |

## 6. Taller como promoción: canales y materiales

| Canal | Formato | Estado |
|---|---|---|
| Asocapitales (área misional ambiente y gestión del riesgo, Plan de Acción 2026; Declaración de Medellín sept-2026) | Sesión práctica en encuentro ambiental de capitales | Confirmado interés temático |
| Federación Colombiana de Municipios (Congreso Nacional de Municipios anual) | Stand + taller de 90 min | **[NC: fecha 2026 no verificada]** |
| MinAmbiente + PNUD (Hoja de Ruta política de movilidad humana por factores climáticos) | Webinar conjunto + piloto con municipios de la hoja de ruta | Confirmado documento; alianza por gestionar |
| OIM Colombia (proyecto "Gobernanza de la movilidad humana inducida por factores ambientales y climáticos", 2026) | Piloto en municipios del proyecto | **[NC: solo convocatoria de consultoría]** |
| ESAP / DNP | Inducción a mandatarios, Sinergia | **[NC: sin evidencia de espacio específico]** |
| GIZ Colombia | Sus proyectos son de movilidad urbana baja en carbono, no movilidad humana | Baja prioridad |

**Materiales:** one-pager (qué es, 6 dimensiones, 4 niveles, tiempo, privacidad), demo guiada de 3 min usando `/ejemplo`, formulario de inscripción al piloto (Tally), kit del moderador.

## Fuentes

- GOV.UK, Using moderated usability testing — https://www.gov.uk/service-manual/user-research/using-moderated-usability-testing (act. 2017-10-03)
- 18F Methods, Usability testing — https://guides.18f.org/methods/validate/usability-testing/ (archivado 2025-01-20)
- NN/g, Why you only need to test with 5 users — https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/ (2000-03-18) **[NC rango]**
- IDEO Design Kit, Get Feedback — https://www.designkit.org/methods/get-feedback.html (s.f.)
- Sevilla-Gonzalez et al., Spanish SUS, JMIR Hum Factors — https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7773510/ (2020)
- MeasuringU, UMUX-Lite — https://measuringu.com/umux-lite/ ; SEQ — https://measuringu.com/seq10/ (2012, act. 2019)
- McGrath et al., S-TIAS, Frontiers in AI — https://www.frontiersin.org/journals/artificial-intelligence/articles/10.3389/frai.2025.1582880/full (2025-05-09)
- NN/g, NPS and UX — https://www.nngroup.com/articles/nps-ux/ ; MeasuringU, NPS criticisms — https://measuringu.com/?p=224
- Cloudscape, GenAI feedback — https://cloudscape.design/patterns/genai/feedback ; PostHog, Collect user feedback — https://posthog.com/docs/llm-analytics/collect-user-feedback
- PostHog cookieless/persistence — https://posthog.com/docs/libraries/js/persistence.md ; pricing surveys — https://posthog.com/surveys/pricing **[NC]**
- Vercel, Web Analytics pricing — https://vercel.com/docs/analytics/limits-and-pricing (2026-08-25); custom events — https://vercel.com/docs/analytics/custom-events (2026-06-26); privacidad — https://vercel.com/docs/analytics
- Plausible — https://plausible.io/ (consultado 2026-11-06)
- Tally vs Typeform — https://www.tally.so/help/compare ; Sentry User Feedback — https://sentry.io/for/user-feedback
- SIC vs Google / Ley 1581 — https://www.enter.co/empresas/colombia-digital/google-tendra-que-cumplir-con-ley-de-proteccion-de-datos (2017)
- Chameleon onboarding (preview antes de registro) — https://www.chameleon.io/shift-left/auditing-onboarding ; Pendo sample data — https://support.pendo.io/hc/en-us/articles/37511836117787
- MinAmbiente, Movilidad humana y cambio climático — https://www.minambiente.gov.co/cambio-climatico-y-gestion-del-riesgo/movilidad-humana-y-cambio-climatico/ (PDF 2026-07)
- PNUD Climate Promise, nota Colombia — https://climatepromise.undp.org/sites/default/files/research_report_document/PDS-Number53%20Climate%20Colombia%20ES.pdf (2024-06)
- Asocapitales Plan de Acción 2026 — https://www.asocapitales.co/sites/default/files/2026-02/asocapitales-transparencia-plan-de-accion.pdf ; Declaración de Medellín — https://forbes.co/2026/09/29/actualidad/asocapitales-suscribio-la-declaracion-de-medellin-para-hacer-frente-al-cambio-climatico/ (2026-09-29)
- OIM consultoría movilidad humana climática — https://unvacancies.org/jobs/cons-235-2026-consultoria-profesional-politicas-de-movilidad-humana-climatica-OM-23849 (2026)
- MinTIC Kit guía de usabilidad (sin fecha 2024 confirmada) — https://gobiernodigital.mintic.gov.co/692/articles-272746_recurso_1.pdf

**No encontrado (2023-2026):** guía BID "Design thinking en el sector público", guía de testeo del Laboratorio de Gobierno Chile, estudios controlados sobre "preview before commit", validaciones en español de UMUX-Lite/S-TIAS.
