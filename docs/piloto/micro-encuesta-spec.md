# Especificación de la micro-encuesta en `/resultado`

> Para quien la implemente (ola 2). Patrón: Cloudscape GenAI feedback + PostHog LLM feedback (`docs/investigacion/08-pilotaje-ux.md` §3). Debe cumplir `docs/estandares/medicion-y-feedback.md`. **Los pulgares son señal, no KPI** (miden quién quiso hacer clic, no calidad).

## 1. Comportamiento exacto

**Ubicación:** en `src/app/resultado/page.tsx`, **debajo del iceberg y su texto** (después de la sección 2 o 4 actual), y antes de las recomendaciones, de modo que no interrumpa la lectura del resultado. Componente propio (p. ej. `src/components/resultado/FeedbackResultado.tsx`) que usa solo componentes del design system. No se muestra en `/ejemplo` (`ES_EJEMPLO`) ni mientras el estado sea `cargando` o `error`.

**Bloque A — pulgares**
1. Texto: "¿Te sirvió este resultado?" con dos botones 👍 y 👎 (con etiqueta accesible "Me sirvió" / "No me sirvió"; área táctil mínima 44 px; no depende solo del color).
2. **Clic en 👍:** el ícono queda relleno, aparece "Gracias, registrado." (con `aria-live="polite"`). No se piden más datos, pero se ofrece un campo opcional "¿Quieres contarnos algo más?" (comentario, ≤500 caracteres).
3. **Clic en 👎:** el ícono queda relleno y aparecen **chips de razón** (selección múltiple permitida, máx. 4; se guarda como lista):
   - "No refleja mi municipio" (`no_refleja`)
   - "No entiendo el nivel" (`no_entiendo_nivel`)
   - "Recomendaciones poco realistas" (`recomendaciones_poco_realistas`)
   - "Otro" (`otro`)
   Debajo, un comentario opcional (≤500 caracteres, con contador). Botón "Enviar".
4. **Cambiar el voto:** el usuario puede pulsar el otro pulgar en cualquier momento; el nuevo voto **reemplaza** al anterior (misma fila, se actualiza `ts`). Pulsar el mismo pulgar otra vez lo **retira** (voto = `null`, se borra la razón y el comentario guardados). Siempre se permite editar.
5. **Confirmación:** tras enviar, el bloque muestra "Gracias, registrado." y un enlace "Cambiar mi respuesta". Si falla el envío, se muestra "No pudimos guardar tu respuesta. Reintentar." sin perder lo escrito; **un fallo de la encuesta nunca bloquea ni afecta el resultado**.

**Bloque B — realidad institucional**
1. Pregunta: "¿Este resultado refleja tu realidad institucional?" Escala de 1 a 5 (1 = Nada, 5 = Totalmente), cinco botones con etiqueta de texto en los extremos. Aparece justo después del bloque A (puede mostrarse aunque no haya votado).
2. Se puede cambiar el valor; el último reemplaza al anterior. Mismo mecanismo de confirmación.

**Frecuencia:** una sola vez por diagnóstico (`diagnostico_id`). Al hacer "Nuevo diagnóstico" se genera un `diagnostico_id` nuevo.

## 2. Esquema del registro

Un registro por `diagnostico_id`. Se crea al primer envío y se actualiza si cambia el voto.

```ts
interface RegistroFeedback {
  diagnostico_id: string          // uuid v4 generado en el cliente (crypto.randomUUID()); vive solo en localStorage junto al resultado
  nivel_id: 'nivel_1' | 'nivel_2' | 'nivel_3' | 'nivel_4'
  puntaje_total: number           // 0-54
  subtotales: {                   // los 6 subtotales, 0-9 cada uno
    d1_reconocimiento: number
    d2_instrumentos: number
    d3_capacidad: number
    d4_informacion: number
    d5_respuestas: number
    d6_equidad: number
  }
  voto: 'up' | 'down' | null
  razon: Array<'no_refleja' | 'no_entiendo_nivel' | 'recomendaciones_poco_realistas' | 'otro'> // vacío si voto ≠ 'down'
  realidad: 1 | 2 | 3 | 4 | 5 | null  // bloque B
  comentario: string | null       // ≤500 caracteres, texto libre del usuario (ver «Qué nunca se guarda»)
  ts: string                      // ISO 8601, lo asigna el servidor
  rubrica_version: string         // versión de la matriz/prompts con que se produjo el resultado (p. ej. "2026-11-v1")
}
```

- `diagnostico_id` se genera al **mostrar el resultado**, no al iniciar el chat, y se guarda en `localStorage` como `diagnostico-id`. No se deriva de nada del usuario.
- El route handler **valida con un esquema** (p. ej. Zod, si el proyecto ya lo usa; si no, validación manual): rechaza campos desconocidos, recorta `comentario` a 500, y verifica rangos. Cualquier otro campo del cuerpo se descarta.
- `rubrica_version` viene de una constante en `src/lib/matriz.ts` (o donde el estándar `agentes-ia.md` la defina). **[Pendiente de la sesión de agentes-ia: nombre y ubicación de la constante.]**

## 3. Lo que NUNCA se guarda

| Nunca | Por qué |
|---|---|
| **Transcripción** de la conversación | Contiene información institucional y a veces personal |
| **Municipio** (nombre) ni departamento, ni cualquier cosa que lo identifique | El resultado + municipio permitiría reidentificar a un funcionario |
| **Nombre, cargo exacto, correo, teléfono** | Anonimato prometido en el consentimiento y en el one-pager |
| **IP cruda**, huella digital del navegador, user agent completo | Privacidad; el proveedor de alojamiento ya ve la IP, la aplicación no la persiste |
| **Cookies** ni identificadores persistentes entre días o dispositivos | La medición es sin cookies (ver ADR 2026-11-06) |
| **`evidencia` por pregunta** ni textos generados por la IA | Pueden contener fragmentos de la conversación |
| El **resultado completo** (fortalezas, brechas, recomendaciones) | Solo se guardan nivel, puntaje y subtotales |

**Sobre `comentario`:** es la única entrada de texto libre. Se guarda **solo en la tabla de feedback**, nunca como propiedad de un evento de analítica. En el formulario se muestra la advertencia: "Por favor no escribas nombres de personas ni datos reservados." Se revisa manualmente y se puede borrar un registro si contiene datos personales (ver acceptance 8).

## 4. Dónde se guarda

### Opción A (recomendada): Postgres con route handler

Ruta `src/app/api/feedback/route.ts` (POST y PATCH/PUT idempotente por `diagnostico_id`) que escribe en Postgres obtenido vía Vercel Marketplace (Neon u otro).

| Pros | Contras |
|---|---|
| Control total del esquema y de lo que se guarda; el `diagnostico_id` y los subtotales viven en tu base | Hay que mantener un route handler y aplicar a él las reglas de `seguridad.md` (límite de tamaño, tasa, validación de origen) |
| Permite el cruce `nivel_id`/subtotales ↔ voto para análisis y para el golden set | Hay que gestionar el borrado de registros (solicitud de supresión) |
| Sin dependencia de un proveedor de analítica ni de su política de cookies | Requiere aprovisionar base de datos |
| Datos en la región que se elija | Si el proyecto no está en plan de pago, revisar límites de la base [verificar] |
| Se puede conectar el comentario a la revisión humana | |

**Costo:** los planes gratuitos de Neon y Vercel Marketplace son suficientes para el volumen de un piloto; **[no confirmado: el costo y los límites vigentes de Neon/Marketplace no se verificaron en esta investigación; confirmar antes de decidir]**.

### Opción B: PostHog Surveys con `cookieless_mode: 'always'`

| Pros | Contras |
|---|---|
| No hay backend propio; la herramienta trae interfaz y paneles | **1.500 respuestas/mes gratis [no confirmado: dato de una página archivada]** |
| Documenta modo sin cookies | Hay que enviar `nivel_id`, subtotales y comentario a un tercero; control menor sobre qué se guarda |
| Podría servir también para la analítica de eventos | La UI de la encuesta de PostHog no sigue el design system; los chips personalizados exigen trabajo extra |
| | Hosting y región a elegir (UE disponible) pero hay que verificar los términos |

### Descartadas
- **Google Forms:** las respuestas pueden vincularse a una cuenta Google y existe el antecedente de la SIC (2017) que ordenó a Google adecuarse a la Ley 1581; se evita para funcionarios.
- **Tally:** bueno para formularios del taller (gratis, sin cuenta), pero no para una micro-encuesta embebida con vínculo al resultado.
- **Sentry User Feedback:** está orientado a errores, no a calidad del resultado.

**Recomendación: Opción A**, porque deja el control de lo que se guarda en el proyecto y evita enviar subtotales y comentarios libres a un tercero. Decisión final pendiente del equipo (ver ADR).

## 5. Criterios de aceptación (para quien lo implemente)

1. [ ] 👍/👎 aparece bajo el iceberg, solo con el resultado en estado "listo", y **no** aparece en `/ejemplo`.
2. [ ] Al 👎 aparecen los 4 chips y el comentario opcional; al 👍 aparece "Gracias, registrado." con ícono relleno.
3. [ ] El usuario puede cambiar el voto y retirarlo; solo existe un registro por `diagnostico_id` y refleja el último estado.
4. [ ] La escala 1-5 de "realidad institucional" funciona, se puede cambiar y se guarda en el mismo registro.
5. [ ] El cuerpo enviado contiene **exactamente** los campos del esquema (sin transcript, municipio, evidencia, IP ni user agent). Hay una prueba que lo verifica.
6. [ ] `comentario` se recorta a 500 caracteres en cliente **y** servidor y nunca aparece en propiedades de eventos de analítica.
7. [ ] Si el guardado falla, el resultado sigue visible, se ofrece reintentar y no se pierde lo escrito.
8. [ ] Hay un procedimiento documentado para **borrar un registro** a solicitud (por `diagnostico_id`) y para revisar/eliminar comentarios con datos personales.
9. [ ] Se emite el evento `feedback_enviado{voto}` (ver estándar) sin texto libre.
10. [ ] Es accesible: operable con teclado, etiquetas para lectores de pantalla, `aria-live` para la confirmación, contraste AA, área táctil ≥44 px, usable en pantalla de 360 px.
11. [ ] El route handler aplica límites de tamaño y de tasa y valida origen, según `docs/estandares/seguridad.md`.
12. [ ] El estándar `medicion-y-feedback.md` y `npm run check:medicion` están actualizados en el mismo PR.
13. [ ] Documentado qué ve el usuario sobre su privacidad: enlace "Cómo usamos tu respuesta" (en la política de datos).

## 6. Cómo se usa el dato

Se revisa con la periodicidad del estándar (§6). **No se reporta "% de 👍" como indicador de éxito.** Se usa para: (a) detectar clusters de razones de 👎 y leer los comentarios; (b) contrastar `realidad` con `nivel_id` y con los subtotales; (c) alimentar casos nuevos al golden set de agentes (sin el transcript, solo patrones de discrepancia).
