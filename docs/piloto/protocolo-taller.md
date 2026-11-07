# Protocolo del taller de pilotaje

> Kit reutilizable. Sirve para el primer taller y para cualquier taller futuro (nueva versión de la plataforma, nuevo grupo de municipios). Base de evidencia: `docs/investigacion/08-pilotaje-ux.md` §1. Si algo cambia en la práctica, se corrige este archivo y se anota en el historial al final.

**Duración:** 105 minutos + debrief del equipo (15 min) + síntesis en 48 horas.
**Propósito doble:** (1) validar la plataforma con usuarios reales y (2) darla a conocer. El taller **evalúa la herramienta, no a los participantes**.
**Tres preguntas que guían todo:** ¿qué fue lo más útil?, ¿qué generó confusión?, ¿qué necesitarían para aplicarla en su trabajo?

## 1. Antes del taller

| Cuándo | Qué | Quién |
|---|---|---|
| 3-4 semanas antes | Definir fecha, lugar/plataforma y aliado convocante (ver `convocatoria.md`) | Equipo del proyecto |
| 3 semanas antes | Enviar invitaciones y abrir inscripción (nombre del cargo y tipo de municipio; no datos personales sensibles) | Equipo + aliado |
| 1 semana antes | Confirmar asistentes (meta: 5-6 por sesión) y reenviar el one-pager | Anfitrión |
| 2 días antes | Probar la plataforma **en producción** desde los equipos y la red del lugar; revisar que `/ejemplo` abra; verificar cuota del proveedor de IA | Equipo técnico |
| 1 día antes | Imprimir materiales (lista abajo); preparar cronómetro, extensiones y conexión de respaldo | Anfitrión |

**Condición para hacerlo:** la plataforma debe tener terminadas la seguridad básica y la pantalla "Antes de empezar" (plan, fase 5 depende de fases 1 y 2). No se pilotea algo inseguro ni sin aviso de que es una IA.

## 2. Cuántas personas

- **Una sesión:** 5 o 6 funcionarios de planeación, ambiente, gestión del riesgo e inclusión social.
- **Por qué:** con unas 5 personas se encuentra la gran mayoría de los problemas de uso; es mejor repetir en rondas pequeñas que hacer una sola grande (NN/g, artículo de 2000; sigue siendo la referencia aunque es antiguo).
- **Máximo por prueba:** 9 personas (18F).
- **Si hay dos perfiles muy distintos** (ciudad capital y municipio categoría 5-6): dos mesas de 3-4 personas, o dos sesiones. Cada perfil se analiza por separado en la síntesis.
- Mezcla recomendada y criterios de selección: `convocatoria.md` §3.

## 3. Roles

| Rol | Cantidad | Qué hace | Qué NO hace |
|---|---|---|---|
| **Moderador** | 1 | Conduce con `guion-moderador.md`; pide "pensar en voz alta" | No explica la herramienta ni corrige; no defiende el producto |
| **Tomador de notas** | 1 por mesa (3 participantes máx. por tomador) | Llena `plantilla-registro.md` con citas textuales | No interviene ni conversa con el participante |
| **Observadores** | 1-2 | Alimentan el registro de problemas ("rolling issues log"); miran, no hablan | No ayudan al participante aunque se trabe |
| **Anfitrión institucional** | 1 | Representa al aliado convocante; abre y cierra | No evalúa |
| **Soporte técnico** | 1 (puede ser un observador) | Resuelve caídas de red o de equipo | No resuelve dudas de contenido |

## 4. Materiales

Impresos: consentimiento (`consentimiento-informado.md`), pre-encuesta, cuestionario post-uso, one-pager, plantilla de registro (una por tomador), guion del moderador.
Equipos: laptop o celular por participante con la plataforma **en producción** (no demo ni copia), cargadores, conexión de respaldo (datos móviles de un celular).
Otros: cronómetro visible, esferos, tarjetas adhesivas, proyector o pantalla para `/ejemplo`, hoja de asistencia con solo el cargo y el tipo de municipio.

Formulario digital: el cuestionario puede responderse en papel o en una herramienta que no obligue a iniciar sesión con cuenta personal (se evita Google Forms: respuestas vinculables a una cuenta Google; ver investigación 08 §3). Opción recomendada: Tally o papel.

## 5. Agenda (105 minutos)

| Min | Bloque | Qué pasa | Qué se registra | Material |
|---|---|---|---|---|
| 0-10 | **Apertura** | Bienvenida, encuadre ("la herramienta es la evaluada, no ustedes"), pedir crítica honesta, leer y firmar consentimiento | — | Consentimiento |
| 10-20 | **Pre-encuesta** | 3 ítems: rol, nivel (1-4) en el que creen que está su municipio, familiaridad con "movilidad climática" | Autopercepción previa | `pre-encuesta.md` |
| 20-25 | **Demo guiada** | Se muestra el **ejemplo de resultado** (`/ejemplo`, municipio ficticio) 3 minutos, **sin explicar conceptos** | Preguntas espontáneas sobre conceptos | Pantalla |
| 25-60 | **Uso individual (pensar en voz alta)** | Cada participante completa el chat-diagnóstico con su propio municipio | Abandonos, confusiones, tiempo, cita textual al ver el iceberg | Equipo + registro |
| 60-70 | **Cuestionario** | 8 ítems, anónimo | Métricas cuantitativas | `cuestionario-post-uso.md` |
| 70-95 | **Conversación guiada** | Las 3 preguntas del feedback + 2 adicionales (nivel refleja su realidad; qué recomendación aplicarían el lunes) | Acuerdo nivel vs. autopercepción; utilidad | Guion |
| 95-105 | **Cierre promocional** | Cómo acceder, a quién compartirla, inscripción voluntaria a seguimiento | Interesados en seguimiento | One-pager |

Si el uso individual se alarga (el diagnóstico completo dura 12-20 min por meta, pero puede ser más), se recorta la conversación guiada a 15 min, no el uso individual: es el dato más valioso.

## 6. Cómo observar y registrar

1. El tomador de notas anota **qué hizo la persona, en qué momento, qué dijo textualmente y qué tan grave fue el problema** (severidad 1-3). Formato exacto en `plantilla-registro.md`.
2. Se anota lo que la persona **dice y hace**, no lo que se interpreta. "Dijo: ‘¿esto qué significa, inmovilidad?’" y no "no entendió el concepto".
3. Se registra el tiempo de inicio y fin del diagnóstico de cada participante (para contrastar con el evento de analítica).
4. Los observadores suman problemas a un registro compartido en vivo; al final del bloque de uso se unifican duplicados.
5. **Nunca** se anota nombre, municipio ni datos identificables en la plantilla. Los participantes son P1, P2… Si sirve distinguir perfil, se usa "P1-capital", "P2-cat5".
6. **No se guarda la transcripción del chat** del participante. La plataforma tampoco la guarda en servidor. Si el participante quiere mostrar su resultado, es voluntario y no se copia.
7. Si alguien se traba más de 2 minutos, el moderador pregunta "¿qué está pensando?" y solo ayuda si la persona lo pide o si el problema ya se registró (se anota "intervención del moderador").

## 7. Debrief del equipo (15 min, justo después)

- Cada observador dice las 3 cosas que más le llamaron la atención.
- Se unen los registros y se marcan los problemas que aparecieron en 2 o más personas.
- Se acuerda quién completa la síntesis y la fecha.
- No se discuten soluciones todavía; primero los hechos (18F).

## 8. Síntesis en 48 horas

Con `sintesis-plantilla.md`: tabla de problemas por severidad y frecuencia, resultados del cuestionario y de las métricas, respuestas a las tres preguntas, decisiones y siguientes pasos. Se comparte con el aliado convocante y con el equipo.

## 9. Qué se mide (resumen)

Las métricas del piloto y sus metas viven en `docs/estandares/medicion-y-feedback.md` §4. En el taller se levantan a mano: acuerdo nivel vs. autopercepción, realidad institucional (ítem 5), utilidad de las recomendaciones. Las demás salen de la analítica sin cookies.

## 10. Datos y privacidad en el taller

- Participación voluntaria, anónima, sin datos personales en los instrumentos.
- El municipio que cada persona usa en el chat se queda en su navegador y no se registra en la analítica ni en el cuestionario.
- Fotos o grabaciones: solo con consentimiento aparte, expreso y específico. Por defecto, no se graba.
- Los formularios de inscripción para seguimiento (correo) se guardan **separados** de las respuestas del cuestionario, para que no se puedan cruzar.

## Historial

| Fecha | Versión | Cambio |
|---|---|---|
| 2026-11-06 | 1.0 | Primera versión, basada en `docs/investigacion/08-pilotaje-ux.md` |
