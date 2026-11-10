# Estándar: medición, analítica y feedback

> Léelo antes de agregar, cambiar o eliminar cualquier evento de analítica, la micro-encuesta, un instrumento de feedback o un taller de pilotaje. Convención general: `docs/estandares/README.md`. Investigación: `docs/investigacion/08-pilotaje-ux.md`. Decisión: `docs/decisiones/2026-11-06-analitica-sin-cookies.md`. Kit del taller y micro-encuesta: `docs/piloto/`.

## 1. Alcance

Cubre:
- Todo evento de analítica emitido desde `src/**` (cliente o servidor) y la capa que los envía (se espera `src/lib/analitica/**`; hoy **no existe**, la crea la ola 2).
- La micro-encuesta de `/resultado` y su route handler (`src/app/api/feedback/route.ts`, aún no existe), especificadas en `docs/piloto/micro-encuesta-spec.md`.
- El kit de talleres de `docs/piloto/**` y las métricas del piloto.
- Lo que **nunca** se guarda sobre los usuarios.

No cubre: seguridad de las rutas (ver `seguridad.md`), contenido del diagnóstico (ver `agentes-ia.md` y `contenido-y-fuentes.md`) ni el diseño visual de la encuesta (ver `design-system.md`).

## 2. Reglas obligatorias

### 2.1 Privacidad (aplica a todo lo demás)

1. **Sin cookies.** Ninguna herramienta de medición puede escribir cookies ni usar almacenamiento persistente para identificar a una persona entre visitas. *Por qué:* evita banner de consentimiento y cumple la promesa de anonimato.
2. **Sin IP cruda.** La aplicación no guarda ni envía la IP del usuario como propiedad. La herramienta de analítica debe anonimizarla o descartarla. *Por qué:* es un dato personal bajo la Ley 1581/2012.
3. **Nunca se registra** transcripción del chat, nombre del municipio ni departamento, nombre o cargo de personas, correo, ni los textos que generaron los agentes (`evidencia`, fortalezas, brechas, recomendaciones). *Por qué:* permitirían reidentificar a un funcionario o filtrar información institucional.
4. **Nunca texto libre del usuario en propiedades de eventos.** Las propiedades son números, booleanos o valores de listas cerradas (enums) definidas en este estándar. La única entrada de texto libre que se guarda es el `comentario` de la micro-encuesta, y vive en su propia tabla, no en analítica. *Por qué:* el texto libre puede contener datos personales y es imposible de filtrar de forma confiable.
5. **Sin medir sin consentimiento.** Instrumentos como el cuestionario y la encuesta de feedback se aplican solo con aviso previo o consentimiento (en taller, `docs/piloto/consentimiento-informado.md`; en producto, aviso en la pantalla "Antes de empezar" y en la política de datos). La analítica sin cookies y agregada se declara en la política de datos.
6. **Datos mínimos.** Si no hay una pregunta de decisión que lo justifique, no se mide. Cada evento de la taxonomía tiene una métrica o decisión asociada.

### 2.2 Eventos

7. **Solo se emiten eventos de la taxonomía (§2.3).** Un evento fuera de la lista falla `check:medicion`.
8. **Nombres en `snake_case`, en español, formato `sustantivo_participio`** (p. ej. `diagnostico_iniciado`). Sin tildes ni mayúsculas. *Por qué:* uniformidad con el código y con el filtrado de herramientas.
9. **Propiedades en `snake_case`, máximo 3 por evento.** Si la herramienta elegida limita las propiedades por evento (Vercel Pro: 2), se respeta el límite de la herramienta.
10. **Los eventos nunca bloquean la experiencia.** Si falla el envío, se descarta en silencio; nunca se reintenta con datos sensibles ni afecta el resultado.
11. **Los eventos se emiten desde un único módulo** (`src/lib/analitica/eventos.ts`), con una función tipada por evento; está prohibido llamar a la herramienta directamente desde un componente. *Por qué:* permite verificar la taxonomía y cambiar de proveedor sin tocar la UI.
12. **Las métricas se definen antes de instrumentar** (§4). Un evento sin métrica o decisión asociada se elimina.

### 2.3 Taxonomía de eventos

Propiedades prohibidas en **todos** los eventos (lista negra, verificada por `check:medicion`): `municipio`, `departamento`, `nombre`, `cargo`, `correo`, `email`, `telefono`, `transcript`, `transcripcion`, `mensaje`, `texto`, `comentario`, `evidencia`, `ip`, `user_agent`, `userid`, `user_id`, `session_id`, `diagnostico_id`, `resultado`, `fortalezas`, `brechas`, `recomendaciones`.

> `diagnostico_id` **no** va en eventos de analítica: solo vive en la tabla de feedback. Así ninguna analítica se puede cruzar con un voto o resultado concreto.

| Evento | Cuándo se dispara | Propiedades permitidas | Propiedades prohibidas (además de la lista negra) | Métrica asociada |
|---|---|---|---|---|
| `diagnostico_iniciado` | El usuario envía el **primer mensaje** del chat (o inicia el formulario rápido) | `modo` (`rapido`\|`conversacional`) si ya existe el selector | cualquier dato del primer mensaje | Tasa de finalización (denominador) |
| `modo_elegido` | El usuario elige modo en `/diagnostico` | `modo` (`rapido`\|`conversacional`) | — | Preferencia de modo; comparativo rápido vs. conversacional |
| `mensaje_enviado` | El usuario envía un mensaje en el chat (uno por turno) | `turno` (entero 1-20+) | contenido del mensaje, longitud exacta | Abandono por turno (funnel) |
| `resultado_mostrado` | La página `/resultado` pasa a estado `listo` con un resultado **real** (no `/ejemplo`) | `nivel_id` (`nivel_1`…`nivel_4`), `duracion_min` (entero redondeado, primer mensaje → resultado) | puntaje exacto, subtotales, municipio | Tasa de finalización (numerador), tiempo medio, distribución de niveles |
| `diagnostico_error` | El pipeline falla o vence el tiempo (30 s) | `step` (`agente_2`\|`agente_3`\|`chat`\|`parseo`\|`timeout`) | mensaje de error crudo, stack, texto devuelto por el modelo | Tasa de errores |
| `reintento` | El usuario pulsa "Reintentar" tras un error | `step` (igual que arriba) | — | Tasa de errores (recuperación) |
| `ejemplo_visto` | El usuario abre `/ejemplo` | `origen` (`hero`\|`diagnostico`\|`directo`) | — | Efecto del ejemplo (`ejemplo_visto` → `diagnostico_iniciado`) |
| `enlace_compartido` | El usuario elige un canal en el menú de compartir o completa la hoja nativa (plan-feedback §10.2). **Pendiente de instrumentar** cuando exista `src/lib/analitica/` | `origen` (`navbar`\|`cta`\|`resultado`), `canal` (`nativo`\|`copiar`\|`whatsapp`\|`correo`) | la URL compartida, el texto del mensaje | Tasa de compartir (`enlace_compartido` ÷ visitas) y llegadas con `?ref=compartir` |
| `feedback_enviado` | El usuario envía o cambia el voto de la micro-encuesta | `voto` (`up`\|`down`) | `comentario`, razones en texto, `diagnostico_id` | Cobertura de feedback; señal, no KPI |

Notas:
- `duracion_min` se redondea a minutos enteros y se calcula en el cliente con la marca de tiempo del primer mensaje (en memoria; no se guarda en localStorage con el contenido).
- `feedback_enviado` registra solo el sentido del voto; la razón, la escala 1-5 y el comentario viven en la tabla de feedback (`docs/piloto/micro-encuesta-spec.md`).
- Los eventos de pageview vienen de la herramienta (agregados, sin cookies); no se duplican con eventos propios.

## 3. Elección de herramienta

**Restricción dura:** sin cookies y sin identificar a personas (reglas 1-2).

| | **Plausible** | **PostHog (cookieless)** | **Vercel Web Analytics** |
|---|---|---|---|
| Cookies | No | `cookieless_mode: 'always'` documentado | No (hash diario, sin seguimiento entre días) |
| Eventos personalizados | Incluidos | Sí | **Solo plan Pro** (Hobby: sin custom events) |
| Costo | $9/mes, 30 días gratis (consultado 2026-11-06) | Nivel gratuito [no confirmado: límites vigentes] | Pro: 2 propiedades por evento, $0,03 por 1.000 eventos |
| Datos | UE | UE o EE. UU. a elegir [verificar] | Vercel |
| Embudos por turno (abandono) | [no confirmado: puede requerir un plan superior] | Sí (funnels) | Limitado |
| Encuestas | No | Surveys (1.500/mes gratis, **no confirmado**) | No |

**Recomendación:** **Plausible** como herramienta de eventos (sin cookies, datos en UE, eventos incluidos, costo bajo), y la **micro-encuesta en Postgres propio** (opción A de `micro-encuesta-spec.md`). Si el proyecto ya está en Vercel Pro por otras razones (plan de trabajo, decisión 5), **Vercel Web Analytics** es aceptable y no agrega proveedor. **PostHog cookieless** es la alternativa si se quiere el funnel por turno y las encuestas en una sola herramienta.
**Es decisión del equipo** (ADR en estado "propuesta"). Antes de contratar, verificar: límite de propiedades por evento y disponibilidad de funnels en el plan de Plausible, y los términos y la región de datos de cada herramienta.

## 4. Métricas del piloto (definición y meta)

| Métrica | Definición exacta | Fuente | Meta del piloto |
|---|---|---|---|
| **Tasa de finalización** | `resultado_mostrado` ÷ `diagnostico_iniciado` en el período | Eventos | ≥70 % |
| **Tiempo medio** | Media de `duracion_min` de `resultado_mostrado` | Eventos | 12-20 min |
| **Abandono por paso** | Para cada `turno` N, usuarios con `mensaje_enviado{turno=N}` que no llegan a `N+1` ni a resultado | Funnel de `mensaje_enviado` | Identificar el turno crítico |
| **Errores de pipeline** | `diagnostico_error` ÷ `resultado_mostrado + diagnostico_error` | Eventos | <10 % |
| **Recuperación tras error** | `reintento` seguido de `resultado_mostrado` | Eventos | Informativa |
| **Acuerdo nivel vs. autopercepción** | % de participantes del taller cuyo `nivel_id` asignado difiere ≤1 nivel del nivel marcado en la pre-encuesta (excluye "no sé") | Taller (pre-encuesta + registro) | ≥60 % |
| **Realidad institucional** | Mediana del ítem 5 del cuestionario y de `realidad` en la micro-encuesta | Taller + tabla de feedback | Mediana ≥4 |
| **Utilidad de recomendaciones** | % de participantes que nombran ≥1 recomendación que aplicarían + señal de 👍/👎 | Taller + feedback | ≥1 accionable por persona |
| **Efecto del ejemplo** | Tasa `diagnostico_iniciado` entre sesiones que vieron `ejemplo_visto` vs. las que no (comparativo, no causal) | Eventos | Comparar y reportar |
| **Distribución de niveles** | % de `resultado_mostrado` por `nivel_id` | Eventos | Informativa (vigilar si casi todos caen en un nivel) |
| **Usabilidad percibida** | UMUX-Lite, SEQ, confianza en IA | Cuestionario del taller | Referencia SEQ 5,3-5,6 |

Con pocos usuarios del piloto no se reportan porcentajes con decimales ni significancia: se reportan conteos y rangos. Dos o más sesiones sin cookies no se pueden cruzar a la misma persona, así que "usuarios únicos" se reporta como aproximado.

## 5. Cómo agregar un evento nuevo

1. **Justifica:** escribe la pregunta de decisión y la métrica que responde. Si no hay, no se agrega.
2. **Define:** nombre (`snake_case`, español, participio), cuándo se dispara, propiedades permitidas (tipos y valores cerrados) y prohibidas. Revisa la lista negra de §2.3.
3. **Registra** el evento en la taxonomía de este archivo (§2.3) y en `src/lib/analitica/taxonomia.ts` (constante con nombre, propiedades permitidas y tipos). *Ese archivo es la fuente que lee `check:medicion`.*
4. **Implementa** la función tipada en `src/lib/analitica/eventos.ts`; llámala desde el componente. Nunca llames a la herramienta directamente.
5. **Prueba:** agrega una prueba que dispare el evento y compruebe que solo contiene propiedades permitidas.
6. **Actualiza** la tabla de métricas (§4) si el evento alimenta una, y el historial (§8).
7. **Corre** `npm run check:medicion`. Debe pasar.
8. Si el evento recoge algo nuevo sobre las personas (aunque sea agregado), **escribe un ADR** y actualiza la política de datos.

Para **retirar** un evento: quítalo de la taxonomía, del código y de la tabla de métricas en el mismo PR.

## 6. Cómo se revisan las métricas

| Qué | Cuándo | Quién | Salida |
|---|---|---|---|
| Revisión rápida de tasa de finalización, errores y abandono por turno | **Semanal** mientras dure el piloto; luego **mensual** | Responsable de producto/datos del proyecto [por asignar] | Nota de 5 líneas en el canal del equipo |
| Lectura de los comentarios de la micro-encuesta y borrado de los que contengan datos personales | Semanal durante el piloto | Quien revise la encuesta [por asignar] | Lista de temas |
| Síntesis de cada taller | A las 48 h | Redactor designado (`docs/piloto/sintesis-plantilla.md`) | Documento + decisiones |
| Revisión de la taxonomía y de la lista negra | Cada trimestre o al agregar un evento | Quien mantenga este estándar | Entrada en el historial |
| Contraste de `realidad` y nivel con subtotales para detectar desajustes de la rúbrica | Tras cada ronda de taller | Responsable de agentes IA | Casos para el golden set (`agentes-ia.md`) |

## 7. Qué NO hacer (anti-patrones)

1. **Usar 👍/👎 como KPI** ("el 85 % de los usuarios está satisfecho"). Miden quién quiso hacer clic, no calidad. Son una señal para leer comentarios y razones.
2. **Medir sin consentimiento** o recoger datos que el consentimiento y la política no mencionan.
3. **Guardar el municipio o la transcripción** "solo para depurar".
4. **Poner texto libre en propiedades** (incluidos mensajes de error crudos de la IA).
5. **Usar `diagnostico_id`, IP o `session_id` en eventos** para poder "seguir" a alguien.
6. **Usar Google Forms** o cualquier formulario que obligue a iniciar sesión con una cuenta personal.
7. **Introducir un NPS** con pocos participantes: no es interpretable.
8. **Presentar el UMUX-Lite o el S-TIAS como medidas validadas en español**: son adaptaciones propias hasta retrotraducir y validar.
9. **Agregar eventos "por si acaso"** sin métrica asociada.
10. **Concluir causalidad del ejemplo** (`ejemplo_visto` → inicio): no hay estudios controlados; es un comparativo observacional.
11. **Pilotear en producción algo sin la pantalla "Antes de empezar"** o con fallas de seguridad abiertas (dependencia fase 5 → fases 1 y 2 del plan).

## 8. Historial

| Fecha | Versión | Cambio |
|---|---|---|
| 2026-11-06 | 1.0 | Primera versión: taxonomía, privacidad, herramienta (propuesta), métricas, checklist, `check:medicion` especificado |

---

## Anexo A. Checklist antes de abrir un PR que toque eventos, feedback o taller

- [ ] El evento está en la taxonomía de este archivo y en `src/lib/analitica/taxonomia.ts`.
- [ ] El nombre es `snake_case`, en español, participio.
- [ ] Todas las propiedades son números, booleanos o enums cerrados; ninguna está en la lista negra.
- [ ] No hay texto libre del usuario en propiedades; `diagnostico_id`, IP y `session_id` no se envían a analítica.
- [ ] No se guardan transcripción, municipio, nombres ni `evidencia`.
- [ ] No hay cookies ni almacenamiento persistente nuevo para identificar a una persona.
- [ ] El evento tiene una métrica o decisión asociada, anotada en §4.
- [ ] Un fallo del envío no bloquea la experiencia ni el resultado.
- [ ] La política de datos y el consentimiento siguen siendo ciertos tras el cambio.
- [ ] Se actualizó el historial (§8) y, si hay decisión de fondo, un ADR.
- [ ] Si se tocó la micro-encuesta: se cumplen los criterios de aceptación de `docs/piloto/micro-encuesta-spec.md` §5.
- [ ] `npm run check:medicion` pasa; `npm run build` y `npm run lint` pasan.

## Anexo B. Pruebas automáticas — `npm run check:medicion` (especificado; **pendiente de implementar en la ola 2**)

> No está registrado en `package.json` todavía. Quien lo implemente lo agrega en el mismo PR que la instrumentación.

**Archivo sugerido:** `scripts/check-medicion.ts` (ejecutable con `tsx`, sin dependencias nuevas si es posible).

**Qué verificará cuando exista la instrumentación:**

| # | Verificación | Falla si |
|---|---|---|
| 1 | **Todo evento emitido está en la taxonomía.** Recorre `src/**` buscando llamadas a las funciones de `src/lib/analitica/eventos.ts` y a la herramienta, y compara los nombres con `taxonomia.ts` | Hay un nombre de evento que no está en `taxonomia.ts` o en este estándar |
| 2 | **Taxonomía y estándar coinciden.** Extrae la tabla de §2.3 y la compara con `taxonomia.ts` | Un evento está en uno y no en el otro |
| 3 | **Ninguna propiedad está en la lista prohibida.** Revisa las propiedades declaradas en `taxonomia.ts` y las claves usadas en cada llamada | Aparece `municipio`, `transcript`, `comentario`, `diagnostico_id`, `ip`… (lista de §2.3) |
| 4 | **Solo propiedades permitidas y tipadas.** Cada propiedad de un evento está declarada con tipo o enum cerrado | Hay una propiedad `string` abierta, o más de 3 propiedades por evento |
| 5 | **Nombres en `snake_case`.** | Un evento o propiedad rompe el formato |
| 6 | **Sin llamadas directas a la herramienta** fuera de `src/lib/analitica/**` (p. ej. `plausible(`, `posthog.capture(`, `track(`) | Un componente llama a la herramienta directamente |
| 7 | **Sin cookies ni almacenamiento nuevo:** busca `document.cookie` y `localStorage.setItem` con claves no registradas en una lista permitida (`diagnostico-*`) | Aparece un uso no autorizado |
| 8 | **Esquema de feedback:** el tipo `RegistroFeedback` coincide con `docs/piloto/micro-encuesta-spec.md` §2 y no contiene campos prohibidos (`transcript`, `municipio`, `evidencia`, `ip`) | El tipo tiene un campo ajeno al esquema |
| 9 | **Cada evento tiene métrica asociada** en la tabla de §4 | Un evento no aparece referenciado |
| 10 | **Prueba del route handler de feedback:** un POST con campos extra o `comentario` de más de 500 caracteres se rechaza o se recorta | El campo extra se guarda |

Salida: lista de incumplimientos con archivo y línea; código de salida distinto de cero si hay alguno.
