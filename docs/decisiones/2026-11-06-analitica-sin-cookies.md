# ADR: analítica sin cookies y feedback anónimo

**Fecha:** 2026-11-06  ·  **Estado:** propuesta (la herramienta final la decide el equipo)

## Contexto

El piloto necesita medir finalización, tiempo, abandono por turno, errores y efecto del ejemplo, y recoger feedback del resultado. Los usuarios son funcionarios públicos que describen la situación institucional de su municipio; la plataforma promete no guardar la conversación ni identificar a nadie y debe ser coherente con la Ley 1581/2012 y la Circular SIC 002/2024 sobre IA. Un banner de cookies agregaría fricción y contradice el mensaje de anonimato. Vercel Web Analytics es sin cookies pero **solo permite eventos personalizados en plan Pro** (Hobby no los incluye).

## Decisión

1. **Medición sin cookies y sin identificar personas.** No se guardan cookies, IP crudas, transcripción, municipio, nombres ni texto libre en eventos (`docs/estandares/medicion-y-feedback.md` §2).
2. **Taxonomía cerrada de 8 eventos** con propiedades de valores cerrados; cualquier evento nuevo se registra en el estándar y pasa `check:medicion`.
3. **Herramienta recomendada: Plausible** (sin cookies, datos en UE, eventos incluidos, USD 9/mes con 30 días de prueba). Alternativas aceptables: Vercel Web Analytics si ya hay plan Pro; PostHog con `cookieless_mode: 'always'`.
4. **Feedback del resultado en Postgres propio** (Vercel Marketplace) con un route handler que valida y guarda solo `{diagnostico_id uuid cliente, nivel_id, puntaje_total, subtotales, voto, razon, realidad, comentario ≤500, ts, rubrica_version}`.
5. **`diagnostico_id` solo vive en la tabla de feedback**, nunca en analítica, para que no se pueda cruzar un voto con el recorrido de una persona.
6. Los 👍/👎 son señal para leer comentarios, **no un KPI**.

## Consecuencias

- No hay banner de cookies ni consentimiento de analítica; la política de datos y la pantalla "Antes de empezar" deben declarar la medición agregada.
- Se pierde el seguimiento de una misma persona entre visitas: "usuarios únicos" es aproximado y no hay cohortes longitudinales.
- Plausible agrega un proveedor y un costo pequeño; hay que **verificar** el límite de propiedades por evento y si los funnels requieren plan superior.
- El feedback propio añade un route handler que debe cumplir `seguridad.md` y un procedimiento de borrado a solicitud.
- La instrumentación y `check:medicion` quedan para la ola 2; mientras tanto el piloto en taller se mide a mano (`docs/piloto/`).

## Alternativas descartadas

- **Google Analytics / cualquier herramienta con cookies o ID persistente:** exige consentimiento y contradice el anonimato.
- **Vercel Web Analytics en plan Hobby:** no permite eventos personalizados. Es viable solo con Pro.
- **PostHog Surveys para el feedback:** conveniente, pero envía subtotales y comentarios a un tercero y la UI no sigue el design system; el nivel gratuito (1.500 respuestas/mes) no está confirmado.
- **Google Forms para el taller y el feedback:** respuestas vinculables a una cuenta Google; antecedente de la SIC (2017).
- **NPS:** no interpretable con pocos participantes.
- **Guardar la transcripción para mejorar el modelo:** incompatible con la promesa de privacidad.
