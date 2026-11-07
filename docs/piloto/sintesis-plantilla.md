# Plantilla de síntesis del taller (completar en 48 horas)

> Copiar este archivo a `docs/piloto/sintesis/AAAA-MM-DD-<lugar>.md` por cada taller y completarlo. Hechos primero, soluciones después (18F). Sin nombres ni municipios.

**Taller:** [fecha, lugar/modalidad, aliado convocante]  ·  **Versión de la plataforma probada:** [0.x, commit/fecha]  ·  **Participantes:** [n], mezcla [capital/cat. 4-6; dependencias]  ·  **Redactó:** [rol]

## 1. Resumen en cinco líneas

1. Cuántas personas terminaron el diagnóstico y en cuánto tiempo.
2. El hallazgo más grave.
3. Lo que más valoraron.
4. Qué dijeron que necesitarían para aplicarla.
5. Decisión principal que se propone.

## 2. Métricas del taller

| Métrica | Resultado | Meta | ¿Se cumplió? | Notas |
|---|---|---|---|---|
| Tasa de finalización (terminaron / empezaron) | | ≥70 % | | |
| Tiempo medio (min) | | 12-20 | | |
| Acuerdo nivel vs. autopercepción (misma o ±1 nivel) | | ≥60 % | | Excluir "no sé" |
| Realidad institucional (ítem 5, mediana 1-5) | | ≥4 | | |
| Recomendaciones accionables (≥1 por persona) | | ≥1 por persona | | |
| Errores/reintentos observados | | <10 % | | |
| UMUX-Lite (ítems 1-2), media | | — | | Adaptación sin validar |
| SEQ (ítem 3), media | | 5,3-5,6 de referencia | | |
| Confianza en la IA (ítem 4), mediana | | — | | |

Con 5-9 personas no hay significancia estadística: reportar valores y rangos, no porcentajes con decimales.

## 3. Problemas encontrados (por severidad y frecuencia)

Ordenar de mayor a menor severidad y, a igual severidad, por frecuencia. Severidad: 1 molestia, 2 serio, 3 bloqueo (ver `plantilla-registro.md`).

| ID | Problema (frase corta) | Dónde ocurre (momento) | Sev. máx. | Frecuencia (n/total) | Evidencia (cita textual) | Causa probable | Propuesta |
|---|---|---|---|---|---|---|---|
| P1 | | | 3 | / | " " | | |
| P2 | | | 2 | / | " " | | |
| P3 | | | 1 | / | " " | | |

**Regla de prioridad:** se corrige primero todo lo de severidad 3; luego lo de severidad 2 que apareció en 2 o más personas.

## 4. Respuestas a las tres preguntas

| Pregunta | Patrones (qué dijo la mayoría) | Citas |
|---|---|---|
| ¿Qué fue lo más útil? | | |
| ¿Qué generó confusión? | | |
| ¿Qué necesitarían para aplicarla? | | |

## 5. Comprensión de conceptos y de resultados

- Conceptos que se preguntaron espontáneamente al ver el ejemplo:
- ¿Entendieron qué significa su nivel? ¿Lo leyeron como una calificación personal?
- ¿Reflejó su realidad institucional? Motivos de quienes dijeron que no:
- Recomendaciones: ¿cuáles aplicarían? ¿cuáles no eran realistas y por qué?
- Efecto del ejemplo (cualitativo): ¿lo entendieron como ficticio? ¿les ayudó a empezar?

## 6. Decisiones

| Decisión | Quién decide | Fecha límite | Estado |
|---|---|---|---|
| | | | pendiente / tomada |

Cada decisión que condicione trabajo futuro se registra como ADR en `docs/decisiones/`.

## 7. Siguientes pasos

| Acción | Responsable | Fecha | Estándar o archivo que cambia |
|---|---|---|---|
| | | | |

Ejemplos de dónde se refleja un hallazgo: texto de la pantalla "Antes de empezar", prompts del Agente 1 (estándar `agentes-ia.md`), glosario/ejemplos del contenido (`contenido-y-fuentes.md`), componentes del resultado (`design-system.md`), métricas o eventos (`medicion-y-feedback.md`).

## 8. Seguimiento promocional

- Interesados en seguimiento (solo número; los correos viven en la hoja aparte): [n]
- Canal que más funcionó para la convocatoria:
- Lecciones para la próxima convocatoria:

## 9. Mejoras al kit

¿Qué cambió en la práctica frente a `protocolo-taller.md` y `guion-moderador.md`? Anotarlo y actualizar esos archivos y su historial.
