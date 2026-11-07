# Plan de trabajo — Respuesta al feedback de revisión

> Versión 0.2 · 6 de noviembre de 2026 · Borrador para discusión.
> Cubre el 100 % de los puntos recibidos: seguridad, migración a DeepSeek y los 17 puntos de la revisión de contenido, forma y pilotaje. Cada punto trae **hallazgos de la investigación** (8 líneas de búsqueda en paralelo, fuentes de 2024-2026) y una **propuesta de solución**. Lo que no se pudo verificar en fuente primaria está marcado **[verificar]**.

## 0. Cómo leer este documento

- **Fases**: el trabajo se ordena en 5 fases. La fase 1 (seguridad + migración) es prerrequisito de todo lo demás.
- **Trazabilidad**: la tabla de la sección 1 mapea cada punto del feedback a una fase y una sección.
- **Insumos**: cada sección dice qué puede construir el equipo técnico solo y qué requiere validación del equipo de contenido.
- **Decisiones abiertas**: reunidas en la sección 8. **Correcciones de hechos** que la investigación detectó en el contenido actual: sección 9.

## 1. Mapa de cobertura del feedback

| # | Punto del feedback | Fase | Sección |
|---|---|---|---|
| S1 | Test y ajustes de seguridad | 1 | 2.1 |
| S2 | Migración de API a DeepSeek | 1 | 2.2 |
| G | Coherencia concept note ↔ versión actual (evolución del piloto / experimental) | 2 | 3.1 |
| C1 | Alinear alcance: línea base, no sustituye planificación | 2 | 3.2 |
| C2 | Nota metodológica breve | 3 | 4.1 |
| C3 | Citar datos: fuente, año y definición | 4 | 5.1 |
| C4 | Desarrollar casos de ciudad (Bogotá, Medellín, Barranquilla) | 4 | 5.2 |
| C5 | Reforzar derechos y justicia climática | 4 | 5.3 |
| C6 | Tono de recomendaciones: primeros pasos, rutas progresivas | 2–3 | 4.2 |
| C7 | Clarificar autoría y uso institucional | 2 | 3.3 |
| F1 | La navegación funciona bien | — | 3.6 |
| F2 | Ejemplos colombianos en las definiciones | 4 | 5.4 |
| F3 | Generar confianza antes del diagnóstico | 2 | 3.4 |
| F4 | Explicar el cambio a formato conversacional (plataforma + CN) | 2 | 3.1 |
| F5 | Ejemplo de resultado | 2 | 3.5 |
| F6 | Sección de recursos | 4 | 5.5 |
| P | Taller de pilotaje | 5 | 6 |

---

## 2. Fase 1 — Seguridad y migración a DeepSeek

Van juntas porque migrar de proveedor obliga a actualizar el SDK de IA, y asegurar la API sin el SDK nuevo sería hacer el trabajo dos veces.

### 2.1 Seguridad (S1)

**Estado actual (verificado en el código):**
- `/api/chat` y `/api/diagnostico` son públicos, sin límite de uso por IP ni protección contra bots.
- El cliente puede enviar mensajes con rol `system`; no hay tope de longitud por turno ni de transcripción.
- El puntaje total y el nivel los calcula el LLM, no el código. No hay validación de esquema del JSON.
- Los errores del proveedor llegan tal cual al usuario; los logs registran el municipio.
- `next.config.ts` está vacío: sin CSP ni cabeceras de seguridad.
- `package.json` mezcla `ai ^3.4.33` con `@ai-sdk/react ^3.0.170` (paquete React del AI SDK **6**): combinación incompatible. `next 16.2.3` está 4 releases de seguridad por detrás (la última, 3-nov-2026).

**Hallazgos de la investigación:**
- OWASP LLM01:2025 admite que no hay prevención infalible de prompt injection; recomienda salida validada con código determinista y tratar al modelo como usuario no confiable. Estudios de 2025 muestran que los "LLM-as-judge" son manipulables para inflar puntajes (arXiv 2505.13348, JudgeDeceiver). Esto aplica directo al Agente 2.
- Vercel: WAF Rate Limiting disponible en todos los planes (Hobby: 1 regla/proyecto). BotID Basic gratis en todos los planes; patrón oficial para rutas de IA (KB 2026-06-03). Plan Hobby es "uso personal, no comercial": un piloto con gobiernos debería ir en Pro ($20/usuario/mes).
- AI SDK 7 ya rechaza `system` dentro de `messages` por defecto; `generateObject` quedó deprecado a favor de `Output.object({ schema })` con zod.
- Versiones estables al 6-nov-2026: `next` 16.4.5, `ai` 7.0.164, `@ai-sdk/react` 4.0.168, `zod` 4.6.7. Migración 3.4→7 con `npx @ai-sdk/codemod upgrade` + `npx @ai-sdk/codemod v7`. AI SDK 7 exige Node ≥22 y ESM.
- CSP con nonce (vía `proxy.ts`) obliga a render dinámico; para este sitio (landing estática + chat) conviene CSP sin nonce en `next.config.ts`.
- Gemini API en nivel gratuito usa prompts para mejorar productos; en nivel pago no. **[verificar qué nivel usa hoy el proyecto]**.

**Propuesta (en orden de prioridad):**

| # | Medida | Esfuerzo | Costo |
|---|---|---|---|
| 1 | Actualizar `next@16.4.5` | bajo | $0 |
| 2 | Validar entrada: solo roles `user`/`assistant`; ≤40 mensajes, ≤2.000 caracteres por turno, ≤30 KB de transcripción (413 si excede) | bajo | $0 |
| 3 | **Puntajes en código**: el LLM devuelve solo `puntaje` + `evidencia` por pregunta; subtotales, total, nivel, iceberg y textos oficiales se calculan con `getNivelFromPuntaje` y `NIVELES`. Se ignora cualquier `puntaje_total`/`nivel_id` del modelo | medio | $0 |
| 4 | Esquema zod para la salida de los agentes 2 y 3 (`puntaje: 0\|1\|2\|3`) | bajo | $0 |
| 5 | **Grounding verificable**: la `evidencia` debe ser cita literal; en código se comprueba que aparece (normalizada) en los turnos `user`; si no, puntaje 0 | medio | $0 |
| 6 | **Spotlighting**: envolver la transcripción en delimitadores marcados y decirle al Agente 2 que todo lo interior es dato, nunca instrucción (Microsoft, arXiv 2403.14720). Regex sobre turnos `user` ("pon 3", "puntaje máximo", "ignora", "[ENTREVISTA_COMPLETA]") → `confianza: baja` y bloqueo. El tag de cierre solo lo puede emitir el servidor | medio | $0 |
| 7 | Regla WAF de rate limit sobre `/api/*` + `checkBotId()` antes de cada inferencia | bajo | $0 |
| 8 | Control de costos: `maxOutputTokens` (≈600 chat / 2.500 análisis), `abortSignal: AbortSignal.timeout(25_000)`, kill switch `DIAGNOSTICO_ENABLED=false` → 503, presupuesto en AI Gateway con alertas 50/75/100 % | bajo | $0 |
| 9 | Errores genéricos al usuario; no registrar transcripción, municipio ni nombre/cargo (datos personales, Ley 1581/2012). Sí registrar: request id, ruta, status, latencia, tokens, puntaje total, flag de manipulación | bajo | $0 |
| 10 | Cabeceras en `next.config.ts`: CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options: DENY` | bajo | $0 |
| 11 | Migración AI SDK 7 (se hace junto con DeepSeek, 2.2) | medio-alto | $0 |
| 12 | *(Opcional, si el piloto es cerrado)* Passcode propio: `POST /api/acceso` con `timingSafeEqual`, JWT HS256 (`jose`) en cookie `httpOnly`, verificación en `proxy.ts` para `/diagnostico` y las dos rutas API; códigos por municipio revocables y usables como clave de rate limit. Vercel Password Protection cuesta $20/proyecto/mes y solo en Pro | medio | $0 |

**Plan de pruebas:**
1. Pruebas unitarias de validación de entrada y de cálculo de puntaje/nivel (incluye bordes: 13/14, 27/28, 40/41).
2. Script de ataque: inyección de instrucciones en la entrevista, payloads de 1 MB, roles falsos, tag de cierre inyectado, 200 requests/minuto desde una IP.
3. Verificación de cabeceras con Mozilla Observatory o similar.
4. `npm audit` limpio en dependencias de producción.

### 2.2 Migración a DeepSeek (S2)

**Hallazgos de la investigación (docs oficiales de DeepSeek y Vercel, 6-nov-2026):**

| ID API | Versión | Contexto / salida | Input (pico / valle) | Output (pico / valle) |
|---|---|---|---|---|
| `deepseek-flash` | V4.1-Flash-1017 (17-oct-2026) | 1M / 384K | $0.30 / $0.15 por M tokens | $1.20 / $0.60 |
| `deepseek-v4-pro` | V4-Pro-0813 (13-ago-2026) | 1M / 384K | $1.32 / $0.66 | $3.96 / $1.98 |

- `deepseek-chat` y `deepseek-reasoner` fueron retirados el 24-jul-2026. Cualquier documentación con R1/V3 está obsoleta.
- Ambos tienen modo *thinking* activado por defecto. **Con thinking, el primer token tarda ~52 s en Flash y ~83 s en Pro** (Artificial Analysis): inaceptable para el chat y para el timeout de 30 s. Con thinking desactivado, `temperature` sí aplica.
- DeepSeek solo ofrece `json_object` (no `json_schema` estricto). Si el modelo no produce JSON válido, devuelve contenido vacío: el reintento previsto en CLAUDE.md §11 es necesario. La validación es en cliente (zod), lo que refuerza la medida 4 de seguridad.
- Artificial Analysis puntúa V4.1 Flash 1017 **por encima** de V4 Pro 0813 en su índice (33 vs 23). Pro no aporta ventaja clara hoy.
- Alucinación: tasas altas en versiones preview de V4; mejoró en 1017 pero hay que medirlo explícitamente contra el principio "sin evidencia → 0".
- NIST CAISI (sep-2025) halló que modelos DeepSeek son más susceptibles a seguir instrucciones maliciosas; para gobernanza territorial colombiana el riesgo de censura es bajo, pero la susceptibilidad a inyección en el chat sí importa (ver 2.1).
- No existe benchmark público DeepSeek vs Gemini en español ni para "LLM-as-judge" en español. Hay que medirlo con nuestro propio golden set.

**Dónde alojarlo:**

| Opción | Retención de datos | Veredicto |
|---|---|---|
| API oficial DeepSeek | Datos "procesados y almacenados en la República Popular China"; retención mientras exista la cuenta; se usan para entrenar con opt-out solo por correo; **sin ZDR** (Privacy Policy 10-feb-2026) | **No recomendada** para datos de funcionarios públicos |
| **Vercel AI Gateway** (`deepseek/deepseek-v4-flash`, `deepseek/deepseek-v4-pro`) | ZDR por request (`providerOptions.gateway.zeroDataRetention: true`, sin costo) o a nivel de equipo. Con ZDR activo el gateway **excluye** a proveedores sin acuerdo (DeepSeek directo quedaría fuera; Azure, Baseten, Fireworks, Together sí) | **Recomendada** |
| Azure AI Foundry (West Europe, Sweden Central) | V4 Flash y Pro desde mayo 2026 **[verificar]** | Alternativa directa en UE |

**Marco legal colombiano:**
- Ley 1581/2012 art. 26 y Decreto 1377/2013: transferencia internacional solo a países con nivel adecuado. Circular SIC 005/2017: EE.UU., UE y Japón están en la lista; **China no aparece** **[verificar vigencia en Circular Única Título V]**.
- Circular SIC 003/2025 (publ. 5-ene-2026): Cláusulas Contractuales Modelo para países sin nivel adecuado. Con DeepSeek directo se necesitarían CCM firmadas por DeepSeek: improbable.
- Circular SIC 002/2024: lineamientos para datos personales en sistemas de IA (minimización, evaluación de impacto, responsabilidad demostrada). Vigente.
- CONPES 4144 (feb-2025), Guía Ética DNP/MinTIC (dic-2025), Lineamientos MinTIC de seguridad y privacidad para IA (dic-2025).
- **Implicación**: nombre de funcionario + municipio son datos personales. Enviarlos a la API china sería una transferencia a país sin nivel adecuado, sin CCM ni ZDR. Vía AI Gateway con ZDR a proveedores de EE.UU./UE se cumple la lista adecuada y la Circular 002/2024. Hay que documentar una evaluación de impacto breve.

**Propuesta por agente:**

| Agente | Modelo | Configuración |
|---|---|---|
| 1 Entrevistador (streaming) | `deepseek-flash` | `thinking: disabled`, `maxOutputTokens ≈ 600` |
| 2 Analista (JSON 18 puntajes) | `deepseek-flash` | `reasoningEffort: low`, `json_object`, vigilar < 25 s |
| 3 Sintetizador | `deepseek-flash` (high) o `deepseek-v4-pro` | decidir con el golden set |

**Plan de migración con evaluación:**
1. **Golden set**: 20–30 transcripciones (sintéticas + reales anonimizadas), ≥5 por nivel, con casos "no sabe" y respuestas vagas. Dos anotadores humanos califican las 18 preguntas; se mide el acuerdo entre ellos.
2. **Herramienta**: promptfoo con providers Gemini y DeepSeek. Asserts: JSON válido + esquema zod, nivel correcto, textos del iceberg exactos.
3. **Métricas**: exactitud de nivel, error absoluto medio por pregunta, kappa Gemini-vs-DeepSeek-vs-humano, tasa de JSON inválido, latencia p95, costo por diagnóstico.
4. **Variación**: 5 repeticiones por transcripción; umbral sugerido: ±2 puntos no cambia el nivel en >90 % de los casos.
5. **Despliegue**: AI Gateway con ZDR, fallback a Gemini, feature flag por agente. Migrar primero el Agente 1 (menor riesgo), luego 2 y 3 solo si el kappa iguala o supera al de Gemini.

**Decisión que bloquea esta fase**: ver sección 8, decisión 1.

---

## 3. Fase 2 — Confianza y encuadre

### 3.1 Evolución del piloto, formato conversacional y dos modos (G, F4)

**Hallazgos:**
- Evidencia reciente a favor de la entrevista con IA: Wuttke et al. (arXiv 2410.01824, 2025): entrevistas conversacionales por IA viables y comparables a entrevistador humano. Barari et al./NORC (arXiv 2504.13908, 1.800 participantes, dic-2025): respuestas abiertas "más detalladas e informativas" que en preguntas estáticas, con ligero costo en experiencia y sesgo de aquiescencia. Chopra & Haaland (CESifo 2023): 381 entrevistas por IA a una fracción del costo.
- Limitaciones documentadas: la IA a veces no profundiza, sesgo de aquiescencia, más tiempo por sesión.
- No se encontró ninguna herramienta pública de preparación climática municipal que ofrezca "modo rápido" y "modo conversacional" a la vez. Lo más cercano son formularios sin chat (Climate-Ready Communities, Canadá; UNDRR Scorecard con nivel preliminar y detallado).
- Precedente directo del formato "rápido vs. profundo": el **UNDRR Disaster Resilience Scorecard** tiene nivel preliminar (47 indicadores, escala 0–3) y detallado (117 indicadores, 0–5).

**Propuesta:**
1. **Dos modos con jerarquía clara** en `/diagnostico`:
   - Tarjeta A: "Autoevaluación rápida (10 min) — 18 preguntas, escala 0–3, sin IA. Resultado inmediato." Cumple la concept note tal como se planteó. Reutiliza el cálculo de puntaje en código de la fase 1 y alimenta al Agente 3 con el mismo JSON. Para mitigar el sesgo de autoinforme: opción "No sabe" (= 0), y campo "¿qué instrumento o evidencia lo respalda?" obligatorio para puntajes ≥ 2.
   - Tarjeta B: "Diagnóstico conversacional (experimental, ~20 min) — una IA te entrevista y puntúa solo con base en lo que describas."
   - Nota común: "Ambos producen una línea base orientativa, no un diagnóstico oficial. Si haces los dos, usa el conversacional para revisar las diferencias con tu equipo."
2. Chip **"Piloto experimental"** visible en navbar y en el chat.
3. **Párrafo para la concept note** (borrador):
   > "La matriz de 18 preguntas se mantiene como instrumento de evaluación. Lo que cambia es el modo de captura: un formulario con escala 0–3 pide al funcionario autocalificarse sin evidencia; la entrevista conversacional obtiene descripciones concretas (planes, roles, datos) y un segundo agente puntúa solo con evidencia explícita, reduciendo la autoinflación. Se adopta como funcionalidad experimental del piloto, con límites conocidos: posible sesgo de aquiescencia, menor profundización que un entrevistador humano y mayor tiempo por sesión. Por eso, durante el piloto, se compara contra el formulario rápido."
4. Ventaja adicional: los dos modos dan el comparativo que necesita el taller (sección 6).

### 3.2 Alcance: línea base, no sustituto (C1)

**Propuesta:** texto fijo en tres lugares: pantalla "Antes de empezar" (3.4), pie del resultado y nota metodológica (4.1).
> Pie de resultado: "Línea base orientativa generada a partir de tu conversación. No sustituye un diagnóstico técnico ni un proceso participativo de planificación territorial. [Ver evidencia por pregunta]"

Mostrar las citas del campo `evidencia` por pregunta refuerza la verificabilidad, que es el mecanismo que GOV.UK y Canadá usan para sostener la confianza.

### 3.3 Autoría y uso institucional (C7)

**Hallazgos:**
- **Directiva Conjunta 007 (Procuraduría + Defensoría, 30-sep-2025)**, derivada de la Sentencia T-067/2025 y el CONPES 4144, exige a sujetos obligados de la Ley 1712/2014 publicar por cada sistema algorítmico: nombre, objetivo, función institucional, **estado del sistema** (desarrollo/implementación/suspensión), si trata datos personales, tipo de datos, **desarrollador**, contacto para objeciones y contacto para información. Si el proyecto no es entidad pública no es obligatorio, pero es la plantilla ideal.
- Guía Ética DNP/MinTIC (dic-2025): "asegurar que los chatbots informen a los usuarios cuando están interactuando con IA y cómo se procesa su información"; recomienda pilotos como entornos controlados.
- Patrón en prototipos académicos: "prototipo creado dentro del proyecto financiado X, disponible gratuitamente; se provee como recurso, sin aval ni garantía".

**Propuesta:** página `/sobre` con **ficha de transparencia algorítmica** siguiendo los 9 ítems de la Directiva 007: (1) qué es y estatus con versión y fecha, (2) quién lo desarrolla y quién lo financia, (3) marco metodológico, (4) tecnología: modelo, proveedor, cómo se procesan los datos, (5) limitaciones, (6) licencia (p. ej. CC BY 4.0 para la matriz, MIT para el código), (7) contacto para consultas y objeciones, (8) historial de versiones.
> Borrador de estado: "Prototipo piloto (v0.3, nov-2026). Este recurso no es una herramienta oficial de ninguna entidad del Estado colombiano ni certifica el nivel de un territorio. Desarrollado por [equipo/institución] con apoyo de [financiador]."

**Insumo requerido**: cómo se presenta el proyecto y de qué institución es (decisión 4).

### 3.4 Pantalla "Antes de empezar" (F3)

**Hallazgos:**
- GOV.UK Chat (etiquetado "experimental AI tool"): pantalla de limitaciones que el usuario confirma antes de preguntar. GDS aprendió que una página "before you start" separada **no funcionaba bien sola**; funcionó mejor presentar los riesgos como limitaciones inherentes a la IA generativa, no como defectos del producto, y enlazar fuentes en cada respuesta.
- Chat.Gov.SG: una página de 4 bloques: qué hace / cómo funciona / qué NO hace / no compartas datos personales.
- AI Answers (Canadá): etiqueta "Beta", microcopy bajo cada respuesta "AI can make mistakes, always check your answer", bloqueo de datos personales.
- Schilke & Reimann (OBHDP 2025, 13 experimentos): revelar el uso de IA reduce la confianza, pero menos que si se descubre después; el efecto se atenúa cuando el usuario percibe alta precisión y cuando el aviso va acompañado de información sobre la competencia y límites del sistema.

**Propuesta:** pantalla única de ~120 palabras con 4 bloques y botón "Entendido, empezar":
> **Antes de empezar**
> **Qué es:** una conversación guiada por IA (~20 min) que construye una línea base orientativa del nivel de preparación de tu territorio frente a la movilidad climática.
> **Qué no es:** no sustituye diagnósticos técnicos, procesos participativos ni decisiones de planeación. La IA puede equivocarse: revisa el resultado con tu equipo.
> **Tus datos:** no escribas datos personales de terceros ni información reservada. La conversación se procesa con un modelo de IA alojado en [proveedor] sin retención de datos, y el resultado se guarda solo en tu navegador. [Ver política de datos]
> **Cómo se evalúa:** solo con lo que tú digas explícitamente; lo no mencionado puntúa 0.

Encabezado del chat: "Estás conversando con un asistente de IA (piloto). Evalúa solo lo que digas; puede equivocarse."

La política de datos del footer se reescribe según el proveedor elegido (decisión 1) y cita la Circular SIC 002/2024 y la Guía Ética DNP.

### 3.5 Ejemplo de resultado (F5)

**Hallazgos:** solo hay consenso de practicantes (Chameleon, Pendo) de que previsualizar la salida aumenta inicio y confianza; no se encontraron estudios controlados 2023-2026. Se medirá el efecto en el piloto.

**Propuesta:** ruta `/ejemplo` que renderiza los mismos componentes de `/resultado` con un `DiagnosticoResult` estático de **"Municipio de Ejemplo (ficticio)"**, nivel 2 (19/54), iceberg con 2 capas, 2 fortalezas, 3 brechas, 3 recomendaciones. Banner persistente "Ejemplo ilustrativo con datos ficticios — no corresponde a ningún municipio real", badge "EJEMPLO" en `NivelBadge`, CTA al pie "Hacer el diagnóstico de mi municipio". Botón secundario "Ver ejemplo de resultado" junto al CTA del hero y en `/diagnostico`. Evento `ejemplo_visto` → `diagnostico_iniciado` para medir.

### 3.6 Navegación (F1)

No se toca. Las secciones nuevas (`/sobre`, `/ejemplo`, `/metodologia`, derechos, recursos) se agregan sin cambiar la estructura actual de contexto → ciudades → recomendaciones → diagnóstico.

---

## 4. Fase 3 — Metodología

### 4.1 Nota metodológica (C2)

**Hallazgos:**
- Estructura típica de una nota metodológica de 1 página en herramientas comparables (UNDRR Scorecard, DNP Índice Municipal de Riesgo ajustado por Capacidades, Words into Action): (1) qué es y para quién, (2) marco conceptual de origen, (3) dimensiones e indicadores, (4) escala y descriptores, (5) cómo se calcula e interpreta, (6) limitaciones y uso previsto, (7) referencias.
- Antecedentes para justificar las 6 dimensiones: Agenda de Protección Nansen (2015) y PDD (tipologías de D1 y D5); enfoque de capacidades del UNDRR Scorecard (D3); Ley 1523/2012 (D2, D3); **Hoja de ruta Minambiente–PNUD para la política de desplazamiento por desastres (abr/jul-2026)** con ejes de gobernanza y gestión integral del ciclo (D2–D5); Defensoría del Pueblo, lineamientos de justicia climática y movilidad humana (sep-2025) (D6); Sentencia T-123/2024 (D1, D5).
- Calibración de rúbricas 0–3 con LLM evaluador (RULERS arXiv 2601.08654, "Rubric-Conditioned LLM Grading" 2601.08843): rúbrica anclada con 1–2 ejemplos por nivel y pregunta, evidencia citada obligatoria, rúbrica congelada y versionada, auditoría humana de 100–300 transcripciones con kappa > 0,6 como umbral práctico, y reportar `confianza` y `gaps_de_informacion` al usuario.

**Propuesta:** página `/metodologia` con 8 bloques:
1. **Qué es** — "Diagnóstico de preparación institucional frente a la movilidad climática; no mide el riesgo del territorio sino la capacidad de respuesta institucional."
2. **De dónde vienen las dimensiones** — síntesis Nansen/PDD + UNDRR + marco colombiano (Ley 1523, T-123/2024, Hoja de ruta 2026).
3. **Qué evalúa cada dimensión** — tabla de 6 filas.
4. **Escala y criterios** — "0–3 según exista y qué tan articulada esté la capacidad; 'no sabe' = 0; solo cuenta lo dicho explícitamente."
5. **Cómo se interpreta** — "El puntaje (0–54) ubica al territorio en uno de 4 niveles; el nivel describe un momento, no una calificación."
6. **Limitaciones** — autoevaluación desde la perspectiva de quien responde; no sustituye diagnóstico técnico; puede variar entre sesiones.
7. **Cómo usar las recomendaciones** — rutas progresivas; cada municipio prioriza.
8. **Referencias** y versión de la rúbrica.

Trabajo técnico asociado: agregar ejemplos ancla por nivel a cada una de las 18 preguntas en el prompt del Agente 2, y versionar la rúbrica (`rubrica_version` en el resultado).

**Insumo requerido**: el equipo valida el origen de la matriz (quién la diseñó, en qué marco).

### 4.2 Recomendaciones progresivas (C6)

**Hallazgos:**
- Ley 617/2000: categorías Especial y 1ª–6ª por población e ingresos; la gran mayoría de municipios son categoría 6 **[verificar cifra exacta]**. 170 municipios PDET.
- Literatura de *adaptation pathways* (CoastAdapt, ICLEI USA 2024): rutas en etapas, proyectos "sin arrepentimiento" primero, sin cerrar opciones futuras.

**Propuesta:** ampliar el tipo `Recomendacion`:
```
dimension, area,
primer_paso:    sin costo o con recursos existentes (≤6 meses)
                ej. "incluir la movilidad climática como tema en la próxima sesión del CMGRD"
siguiente_paso: requiere decisión administrativa o articulación (6–18 meses)
                ej. "incorporar un capítulo en la actualización del PMGRD"
ruta_ampliada:  requiere inversión, cooperación o instrumento formal (>18 meses)
                ej. "programa de reasentamiento con enfoque de derechos"
para_quien:     "todos" | "categoria_1_3" | "categoria_4_6_PDET"
```
Criterios de priorización que el Agente 3 aplica y la UI muestra: (1) riesgo principal declarado, (2) dimensión más débil, (3) categoría del municipio, (4) ventanas institucionales (actualización de POT/PMGRD, plan de desarrollo), (5) acciones sin arrepentimiento primero. Tono: "ruta sugerida, no lista de obligaciones; el municipio decide por dónde empezar". Se aplica en dos lugares: el prompt del Agente 3 y `RecomendacionesSection.tsx` del home. Opcional: preguntar la categoría del municipio en el chat o en el formulario rápido.

---

## 5. Fase 4 — Contenido de fondo

### 5.1 Cifras con fuente, año y definición (C3)

**Hallazgos:** cifras verificadas en PDF oficiales de IDMC (GRID 2025 y 2026) y en fuentes institucionales:

| Cifra | Definición | Fuente / año | Confianza |
|---|---|---|---|
| **91.000** desplazamientos por desastres en Colombia | Movimientos forzados (no personas únicas) en 2024 | IDMC GRID 2025 | Alta |
| **88.000** desplazamientos por desastres (≈78.000 por inundaciones) | Idem, 2025 | IDMC GRID 2026 | Alta |
| **351.000** desplazamientos por desastres | Idem, 2023 | IDMC GRID 2024 | Media-alta |
| 29.000 desplazamientos por inundaciones en Chocó (2024); 7.900 por sequía en Bolívar/Córdoba/Sucre, primer registro de este tipo | Desglose | IDMC GRID 2025 | Alta |
| IDMC **no publica** stock de desplazados por desastres para Colombia | — | GRID 2025 | — |
| ~9.000 eventos en 1.024 municipios; inundaciones >709.000 personas afectadas; 70 fallecidos por movimientos en masa | Afectados reportados por consejos municipales de GRD (no desplazados) | UNGRD balance 2024 | Media |
| 1.015.056 damnificados, 537 municipios en calamidad | La Niña ago-2021 a ene-2023 | UNGRD | Media |
| 22,7 M personas afectadas, 8.141 muertes, >92.000 viviendas destruidas | Acumulado 1998-2022 | PNUD PDS 53 (2024) con datos UNGRD | Alta |
| 100 % de municipios con algún riesgo climático; 59 % con riesgo medio-muy alto a 2040 | Índice de riesgo climático municipal | IDEAM, Tercera Comunicación Nacional (2017) | Media-alta; Cuarta Comunicación prevista dic-2026 |
| 17 M migrantes climáticos internos en América Latina a 2050 (escenario pesimista) | Proyección; **no existe cifra desagregada para Colombia** | Banco Mundial Groundswell (2021) | Alta (regional) |
| Gramalote: 984-988 viviendas; 100 % entregado el 10-oct-2024, 14 años después | Reasentamiento completo | Fondo Adaptación | Media |
| Bogotá: 20.872 familias en gestión de reasentamiento, 10.699 terminadas; reasentamiento n.º 420 del programa actual (29-oct-2026) | CVP | SDP / bogota.gov.co | **[verificar]** la primera; alta la segunda |

**No existe o no se verificó** (no usar): cifra nacional de hogares en zonas de alto riesgo no mitigable; Groundswell para Colombia; hogares reasentados en La Mojana.

**Propuesta:** componente `CifraConFuente` (valor · definición en una línea · fuente · año · enlace) usado en `ContextSection` y `CitiesSection`. Un archivo `src/lib/cifras.ts` centraliza cada cifra con su metadata para que ninguna se escriba suelta en el JSX. Regla: **sin fuente primaria no se publica**.

**Insumo requerido:** el equipo valida la selección final de cifras.

### 5.2 Casos de ciudad (C4)

**Hallazgo central:** **ninguna de las tres ciudades nombra la "movilidad climática"** en POT, plan de gestión del riesgo ni plan de acción climática. Bogotá y Barranquilla la mencionan solo en discursos de alcaldes en foros internacionales (2022-2023). El reconocimiento viene del nivel nacional (T-123/2024, Ley 2577/2026, Hoja de ruta Minambiente-PNUD). Este es el argumento central del producto: las ciudades gestionan riesgo y vivienda por separado, sin el concepto integrador.

**Plantilla estándar (6 campos) con lo verificado:**

| Campo | Bogotá | Medellín | Barranquilla |
|---|---|---|---|
| Contexto | ~8 M hab.; ocupación informal en laderas del sur y llanuras del río Bogotá/Tunjuelo; primera ciudad de AL en declarar emergencia climática (2020) | ~57 % del territorio en pendientes >15°; crecimiento informal empujado por desplazamiento forzado (4.723 llegados en 2024) y loteo ilegal | Costera-ribereña; ladera suroccidental con 11 sectores de alto riesgo; ~146.600 extranjeros (~10 %) que se asientan en zonas vulnerables |
| Riesgos | Remoción en masa; >800.000 personas en zonas con amenaza de inundación (cifra MEPOT 2013, sin actualización pública); incendios Cerros Orientales 2024 (148 ha); racionamiento de agua abr-2024 a 2025 | 30 % de la población (~780.000) en zonas de alto riesgo (Observatorio del Hábitat-UNAL, 2025); >65 puntos críticos; 4.360 emergencias DAGRD en 2025; 150 días >29 °C proyectados a 2040-2050 | Arroyos (cuenca oriental >90 % urbanizada sin drenaje pluvial); erosión y pérdida de ~650 ha de la Ciénaga de Mallorquín; 1.ª ciudad de AL en peligro por olas de calor (Oxford, 2026) |
| Marcos | POT Decreto 555/2021 (art. 32: reasentamiento obligatorio en riesgo no mitigable); PDGRDCC 2018-2030; PAC 2020-2050; IDIGER, Hábitat, CVP | POT Acuerdo 48/2014; revisión en trámite (PA 104/2026, 1.er debate 19-oct-2026); PAC 2020-2050; Política de Protección a Moradores; DAGRD, ISVIMED | POT 2012-2032 (Decreto 0212/2014) sin revisión adoptada; PDGR 2017-2032; Oficina de Gestión del Riesgo; "Biodiverciudad"; PAC formal **[verificar]** |
| Respuestas | Programa Vivienda Segura (CVP): meta 2.000 hogares; reasentamiento n.º 420 (oct-2026); 174 familias ante La Niña 2024 | Corredores Verdes (−2 °C local, premios Ashden/C40); Jardín Circunvalar (contestado); Moravia 2004-2012 con reocupación; ISVIMED 1.144 familias acompañadas | Canalización de arroyos (>$1 billón en 12 años); Ecoparque Mallorquín (980 ha, $230.000 M); Siembra Barranquilla |
| Brechas | Ritmo del reasentamiento (420 en ~2,5 años vs. meta 2.000); reocupación de predios; datos de exposición de 2013 | 25 obras del Plan de Mitigación Comuna 8 sin priorizar en PDM 2024-2027; 37.000 familias requieren vivienda; respuesta por evacuación/desalojo | Sin programa de reasentamiento por riesgo comparable a CVP/ISVIMED; sin cifras públicas de población expuesta; respuesta centrada en obra gris |
| Mensaje clave | Tiene el andamiaje más completo del país, pero el reasentamiento avanza a una fracción de la demanda y aún no nombra la movilidad climática | Documenta mejor que nadie su riesgo de ladera y lidera en adaptación verde, pero gestiona la movilidad por evacuación y desalojo, no por reasentamiento preventivo | Invierte masivamente en obra dura y naturaleza, pero carece de ruta de reasentamiento y de datos de exposición, en la ciudad con mayor riesgo por calor de AL |

**Propuesta:** `src/lib/ciudades.ts` con la plantilla tipada; `CitiesSection` renderiza las 6 pestañas por ciudad; cada afirmación lleva su `CifraConFuente`. Pendientes de verificación: cifra CVP de familias en alto riesgo no mitigable, número del Acuerdo de moradores de Medellín, existencia de PAC de Barranquilla.

### 5.3 Derechos y justicia climática (C5)

**Hallazgos clave:**
- **Sentencia T-123/2024** (16-abr-2024): reconoce el "desplazamiento forzado interno por factores ambientales" (súbito y gradual), declara déficit de protección constitucional, afirma que los damnificados son sujetos de especial protección y que los Principios Deng y Pinheiro integran el bloque de constitucionalidad. Obligaciones para la alcaldía: estudio de riesgo participativo en 1 año; si mitigable → retorno voluntario, seguro y digno; si no mitigable → acceso prioritario a vivienda y fuente de ingresos acorde con identidad cultural.
- **Ley 2577 de 2026** (sancionada 29-may-2026) **[verificar texto completo]**: reconoce la condición de desplazado por cambio climático, degradación o desastres; crea el **Registro Único de Desplazamiento Ambiental** (UNGRD); ordena política pública articulada con SINA, SISCLIMA, SNGRD y PIGCCT. La Ley 1448 **no aplica** a desplazados ambientales.
- **T-333/2022**: vulneración de derechos del pueblo raizal por reconstrucción post-Iota sin consulta previa.
- **OC-32/25 Corte IDH** (29-may-2025): derecho a un clima sano; el desplazamiento por clima exige atención urgente.
- **Escazú**: Ley 2273/2022, depósito 25-sep-2024.
- Evidencia de poblaciones afectadas: Chocó nov-2024, >180.000 afectados "en su mayoría pueblos indígenas y comunidades afrocolombianas" (ACNUR); OCHA 2022: 71 % de víctimas de confinamiento y 69 % de afectados por inundaciones son comunidades étnicas; Wayuu: 40 menores fallecidos en 2023 por sequía; T-123 y T-305/24: campesinos, adultos mayores, víctimas del conflicto doblemente desplazadas. **Sin desagregación oficial** por género, edad ni discapacidad: mostrar como "brecha de datos", no inventar.

**Propuesta:** sección "Derechos y justicia climática" en el home con 6 bloques:
1. **Hero**: "La movilidad climática no afecta a todos por igual. Quién se mueve, quién se queda atrapado y quién decide depende de derechos, no solo del clima."
2. **Fichas "¿Quiénes están en mayor riesgo?"** (8 tarjetas: afro/raizales · indígenas · campesinos · mujeres y niñez · víctimas del conflicto doblemente desplazadas · migrantes · personas mayores y con discapacidad · asentamientos informales), cada una con 1 dato, 1 fuente y 1 obligación; "Sin dato desagregado" donde no haya.
3. **Línea de tiempo "Lo que ya reconoce Colombia"**: T-025/04 → T-333/22 → T-123/24 → Escazú 2024 → OC-32/25 → Ley 2577/26.
4. **"Qué le exige la ley a tu municipio"**: 9 obligaciones (delimitar zonas de riesgo no mitigable; estudios participativos; prevenir; atención mínima; retorno o reasentamiento con vivienda, servicios y medios de vida; consulta previa; debido proceso antes de desalojos; registro desagregado; enfoque diferencial).
5. **"Qué es una respuesta justa"**: último recurso · decisión informada y voluntaria · consulta previa · vivienda + medios de vida + identidad cultural · no repetición · derecho a permanecer. Cada uno con ejemplo (Gramalote, Providencia, Tierra Bomba).
6. **CTA**: "Las preguntas 16–18 del diagnóstico miden esto en tu territorio."

Microcopy: "Quedarse también es una decisión que merece protección." · "Reubicar no es trasladar casas: es trasladar vida, trabajo y comunidad." · "Si no hay datos sobre quién está en riesgo, el riesgo ya es una brecha."

### 5.4 Ejemplos colombianos en las definiciones (F2)

Listos para usar (2–3 líneas, con fuente):
- **Desplazamiento por desastre** — Mocoa 2017: avalancha con >320 muertos; de 1.209 viviendas prometidas, en 2021 solo 300 entregadas (Contraloría). La Mojana 2021-2025: ruptura de Cara de Gato; >4.000 familias damnificadas en días en 2025; compra de 46 predios para reasentar.
- **Migración gradual por sequía** — La Guajira: familias wayuu abandonan rancherías por falta de agua y se instalan en asentamientos de Riohacha/Maicao que luego se inundan (AP, 2025).
- **Inmovilidad / poblaciones atrapadas** — Tierra Bomba (Cartagena): el mar destruyó ~250 viviendas; la comunidad afro reclama obras de protección, no reubicación.
- **Reubicación planificada** — Gramalote: 3.300 evacuados en dic-2010; 100 % entregado en oct-2024, 14 años después. Providencia post-Iota: 1.134 casas; T-333/22 ordenó consulta previa.
- **Reubicación urbana** — Bogotá, Altos de la Estancia: CVP reasienta desde 2004. Medellín: 26,1 % del territorio en riesgo no mitigable (POT 2014).
- **Erosión costera** — Urabá/Necoclí: casas con "puertas traseras al mar"; Tumaco actualiza PMGRD por erosión.

### 5.5 Sección de recursos (F6)

**Propuesta:** página `/recursos` con 5 grupos y 1 línea de "para qué sirve" por ítem:
- **Reportes**: IDMC GRID 2025/2026 y página país Colombia; OIM Informe sobre las Migraciones en el Mundo 2024; PNUD PDS 53 (2024); Minambiente–PNUD Hoja de ruta (2026); IDEAM Tercera Comunicación Nacional; Banco Mundial Groundswell.
- **Guías**: UNDRR–PDD Words into Action: Disaster Displacement (2019); PDD checklist; Banco Mundial/GFDRR Guía de reasentamiento (2011, ES); Minvivienda Res. 0448/2014 (inventario de asentamientos en riesgo); DNP Índice Municipal de Riesgo ajustado por Capacidades (base 2024).
- **Datos abiertos**: UNGRD Consolidado Anual de Emergencias 1998-2025; IDMC event data (HDX); datos.gov.co; DANE Geoportal; IDEAM escenarios 2011-2100; RUV (para contraste).
- **Marco legal**: Ley 1523/2012; Decreto 1807/2014 (en 1077/2015); Ley 2169/2021; CONPES 4058/2021; T-123/2024; Ley 2577/2026; Escazú.
- **Agenda nacional**: Conferencia Regional Cancillería–OIM (nov-2023); portal Minambiente Movilidad Humana y CC; Defensoría lineamientos (2025).

**Insumo requerido:** el equipo aporta su lista base; se complementa con lo anterior.

---

## 6. Fase 5 — Taller de pilotaje (P)

**Hallazgos:** NN/g (5 usuarios descubren ~85 % de los problemas; iterar en rondas); 18F (≤9 usuarios por prueba, *rolling issues log*, debrief de 15 min); GOV.UK (note-taker dedicado). Instrumentos breves validados: UMUX-Lite (2 ítems, r = .83–.87 con SUS), SEQ (benchmark 5.3–5.6), S-TIAS 2025 (confianza en IA, 3 ítems). NPS se omite (no interpretable con n pequeño). No hay UMUX-Lite ni S-TIAS validados en español: traducción directa + retrotraducción. Google Forms se evita (vinculación a cuenta Google; antecedente SIC 2017); Tally o base propia en Vercel.

**Taller (105 min, 5–6 funcionarios por sesión):**

| Min | Bloque | Qué se registra |
|---|---|---|
| 0–10 | Encuadre: "el prototipo es el evaluado, no ustedes" | — |
| 10–20 | Pre-encuesta: rol, ¿en qué nivel (1–4) cree que está su municipio?, familiaridad con el concepto | Autopercepción previa |
| 20–25 | Demo de `/ejemplo` (3 min, sin explicar conceptos) | Preguntas espontáneas sobre conceptos |
| 25–60 | Uso individual con pensamiento en voz alta, con su propio municipio | Abandonos, confusiones, tiempo, reacción al iceberg |
| 60–70 | Cuestionario de 8 ítems, anónimo | Métricas |
| 70–95 | Conversación guiada: las 3 preguntas del feedback + "¿El nivel refleja su realidad? ¿Por qué?" + "¿Cuál recomendación aplicaría el lunes?" | Acuerdo nivel vs. autopercepción; utilidad |
| 95–105 | Cierre promocional: cómo acceder, a quién compartirla, inscripción a seguimiento | Leads |

**Cuestionario (8 ítems):** 1–2 UMUX-Lite (1–7) · 3 SEQ (1–7) · 4 "Puedo confiar en el diagnóstico que entrega la IA" (S-TIAS, 1–7) · 5 "El nivel asignado refleja la realidad institucional de mi municipio" (1–5) · 6 ¿Qué fue lo más útil? · 7 ¿Qué le generó confusión? · 8 ¿Qué necesitaría para aplicar esta herramienta en su trabajo?

**Micro-encuesta en `/resultado`:** 👍/👎 bajo el iceberg; al 👎, chips ("No refleja mi municipio", "No entiendo el nivel", "Recomendaciones poco realistas", "Otro") + comentario opcional; segundo bloque "¿Este resultado refleja tu realidad institucional?" 1–5. Se guarda `{diagnostico_id (uuid en cliente), nivel_id, puntaje_total, subtotales, voto, razón, comentario, ts}`; nunca municipio ni transcripción.

**Métricas del piloto:**

| Métrica | Cómo | Meta |
|---|---|---|
| Tasa de finalización | `resultado_mostrado` / `diagnostico_iniciado` | ≥70 % |
| Tiempo medio | primer mensaje → cierre | 12–20 min |
| Abandono por turno | `mensaje_enviado` con `turno` | identificar turno crítico |
| Errores de pipeline | `diagnostico_error` + `reintento` | <10 % |
| Acuerdo nivel vs. autopercepción | pre-encuesta vs. `nivel_id` | ≥60 % ±1 nivel |
| Realidad institucional | ítem 5 + micro-encuesta | mediana ≥4 |
| Efecto del ejemplo | `ejemplo_visto` → `diagnostico_iniciado` | comparar |

Analítica sin cookies: Plausible ($9/mes, datos en UE) o PostHog cookieless; Vercel Web Analytics requiere Pro para eventos personalizados.

**Canales de convocatoria:** Asocapitales (área de ambiente y gestión del riesgo; Declaración de Medellín sept-2026); Federación Colombiana de Municipios (Congreso Nacional) **[verificar fecha 2026]**; Minambiente + PNUD (municipios de la Hoja de ruta); OIM Colombia (proyecto de gobernanza de movilidad humana climática 2026) **[verificar]**; ESAP/DNP.

**Materiales:** one-pager, demo guiada de 3 min con `/ejemplo`, formulario de inscripción, kit del moderador, consentimiento informado de 1 página.

---

## 7. Secuencia y dependencias

```
Fase 1  Seguridad + DeepSeek ─────────────┐
        (bloquea: decisión 1)             │
                                          ▼
Fase 2  Confianza y encuadre ──────── requiere proveedor definido para la política de datos
        (bloquea: decisiones 2, 3, 4)     │
                                          ▼
Fase 3  Metodología ───────────────── requiere validación del origen de la matriz
                                          │
Fase 4  Contenido ─────────────────── puede correr en paralelo con 2 y 3; requiere validación de cifras
                                          │
                                          ▼
Fase 5  Taller ────────────────────── requiere 1 + 2 terminadas (no pilotear algo inseguro o sin pantalla de confianza)
```

Estimación gruesa de esfuerzo técnico (sin contar validaciones del equipo de contenido): Fase 1 ≈ 2 semanas (incluye golden set y evaluación); Fase 2 ≈ 1 semana; Fase 3 ≈ 3–4 días; Fase 4 ≈ 1,5–2 semanas; Fase 5 (materiales e instrumentación) ≈ 3–4 días.

**Entregables por fase:** cada fase cierra con un PR revisable y un deploy de preview en Vercel.

## 8. Decisiones abiertas

| # | Decisión | Bloquea | Recomendación |
|---|---|---|---|
| 1 | **Dónde corre DeepSeek**: AI Gateway con ZDR (proveedores EE.UU./UE) vs. API oficial (China) | Fase 1 | AI Gateway con ZDR. La API oficial no tiene ZDR, retiene datos en China y China no está en la lista de países adecuados de la SIC |
| 2 | **Dos modos** (formulario rápido + conversacional experimental) vs. solo conversacional | Fase 2 | Dos modos. Cumple la CN, da fallback sin IA y produce el comparativo que el taller necesita |
| 3 | **Acceso durante el piloto**: abierto vs. código de acceso | Fase 1 (medida 12) | Código de acceso por municipio durante el piloto; abrir después |
| 4 | **Autoría e institución**: prototipo académico / piloto de X institución / recurso público; quién financia | Fase 2 (`/sobre`) | Requiere respuesta del equipo |
| 5 | **Plan de Vercel**: Hobby es "no comercial"; Pro habilita WAF con más reglas, BotID Deep Analysis, eventos de analítica, ZDR a nivel de equipo | Fase 1 | Pro durante el piloto |
| 6 | **Modelo del Agente 3**: Flash (high) vs. Pro | Fase 1 | Decidir con el golden set; hoy Flash 1017 puntúa mejor y cuesta 4× menos |

## 9. Correcciones de hechos detectadas en el contenido actual

Independientes del plan, conviene aplicarlas pronto:
- **CLAUDE.md** dice Next.js 14 y, en el diagrama de la sección 5, `gemini-1.5-*`. El código usa Next.js 16 y `gemini-3-*`.
- **Principios de Península** son de **2013**, no de 2023, si se citan.
- La **Ley 1448** no cubre a desplazados ambientales (T-123/2024 lo confirma).
- Existe la **Ley 2577/2026** y el Registro Único de Desplazamiento Ambiental; si la plataforma dice que "no hay marco legal", ya no es exacto **[verificar texto]**.
- La **política de privacidad** del footer debe reflejar el proveedor real de IA y su retención de datos (hoy Gemini; verificar si el proyecto está en nivel gratuito, que sí usa los prompts).
- Bogotá: la cifra de >800.000 personas en zonas de amenaza por inundación es de 2013; marcarla como tal o no usarla.

## Anexo — Fuentes principales por sección

- **2.1**: OWASP LLM01:2025 · Vercel WAF Rate Limiting (docs 2026-08-28) · Vercel BotID (2026-06-16) · AI SDK migration guides v5/v6/v7 · Next.js CSP guide (2026-03-20) · Next.js security release (2026-11-03) · Microsoft Spotlighting (arXiv 2403.14720) · JudgeDeceiver / arXiv 2505.13348.
- **2.2**: DeepSeek Models & Pricing y Change Log (api-docs.deepseek.com) · DeepSeek Privacy Policy (2026-02-10) · Vercel AI Gateway ZDR (2026-09-22) · @ai-sdk/deepseek docs · Artificial Analysis (V4.1 Flash 1017, V4 Pro) · NIST CAISI (2025-09-30, 2026-05-01) · SIC Circulares 005/2017, 002/2024, 003/2025 · CONPES 4144.
- **3.x**: GOV.UK Chat "About" (2026-03-20) e Inside GOV.UK (2024-11-28) · Chat.Gov.SG (2026-04-30) · Canada.ca AI Answers (2025-12-17) · Directiva Conjunta 007/2025 (AND) · Guía Ética DNP/MinTIC (2025-12) · Schilke & Reimann OBHDP 2025 · Wuttke et al. 2025 · Barari et al./NORC 2025 · Chopra & Haaland 2023.
- **4.x**: UNDRR Scorecard/MCR2030 · DNP IMRC · Words into Action (2019) · PDD Strategic Framework · Minambiente–PNUD Hoja de ruta (2026) · Defensoría lineamientos (2025) · RULERS (arXiv 2601.08654) · Ley 617/2000 · ICLEI USA 2024 · CoastAdapt.
- **5.x**: IDMC GRID 2025 y 2026 (PDF) · UNGRD balance 2024 · PNUD PDS 53 (2024) · IDEAM TCN (2017) · Banco Mundial Groundswell · T-123/2024 (texto completo) · T-333/2022 · Ley 2577/2026 (sidn.ramajudicial.gov.co) · OC-32/25 · ACNUR Chocó 2024 · OCHA 2022 · POT Bogotá Decreto 555/2021 · bogota.gov.co (CVP 2024-2026) · El Colombiano / Blu Radio (Medellín 2025) · PAC Medellín 2021 · El Heraldo / Portafolio (Barranquilla 2022-2026).
- **6**: GOV.UK Service Manual · 18F Methods · NN/g · MeasuringU (UMUX-Lite, SEQ) · McGrath et al. S-TIAS (Frontiers in AI, 2025) · Cloudscape GenAI feedback · Vercel Analytics pricing (2026-08-25) · Plausible · Asocapitales Plan de Acción 2026.

Los informes completos de cada línea de investigación, con todas las URLs, están disponibles en la sesión y pueden exportarse a `docs/investigacion/` si se desea conservarlos en el repositorio.
