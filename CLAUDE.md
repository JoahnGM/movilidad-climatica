# CLAUDE.md — Contexto del Proyecto: Plataforma Movilidad Climática Colombia

> Este archivo es el contexto permanente del proyecto. Léelo completo antes de ejecutar cualquier tarea.

---

## 1. QUÉ ES ESTE PROYECTO

Plataforma web para gobiernos locales colombianos que quieren entender y abordar la **movilidad climática** en sus territorios.

El producto central es un **chat-diagnóstico con inteligencia artificial** que evalúa el nivel de preparación institucional de un municipio a través de una conversación. El diagnóstico está basado en una **matriz de evaluación oficial de 18 preguntas en 6 dimensiones**. Al finalizar, el usuario recibe un resultado visual (iceberg) con su nivel y recomendaciones.

**PRINCIPIO ANTI-ALUCINACIÓN:** Los agentes solo pueden evaluar con base en lo que el entrevistado dijo explícitamente. Nunca infieren ni asumen capacidades no mencionadas. Si no hay evidencia, el puntaje es 0.

**Usuarios primarios:** Funcionarios de secretarías de planeación, ambiente, gestión del riesgo y adaptación climática en municipios y ciudades colombianas.

---

## 2. STACK TÉCNICO

| Capa | Tecnología |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Estilos | Tailwind CSS |
| Componentes | shadcn/ui |
| Animaciones | Framer Motion |
| IA / Chat | Vercel AI SDK (`ai` package) + Google Gemini |
| Modelos | `gemini-3-flash-preview` (Agentes 1 y 2) · `gemini-3.1-pro-preview` (Agente 3) |
| Deploy | Vercel |

**Variable de entorno requerida:**
```
GOOGLE_GENERATIVE_AI_API_KEY=...
```

---

## 3. DESIGN SYSTEM

### Colores
```
background:     #0A0F1E   → azul institucional profundo (NO negro puro)
surface:        #0F1629
border:         #1E2A45
teal (accent):  #2DD4BF
blue (accent):  #60A5FA
amber:          #F59E0B
violet:         #8B5CF6
red:            #EF4444
text:           #F1F5F9
text-secondary: #94A3B8
text-muted:     #475569
```

### Tipografía
- **Syne 700–800** → títulos, display, hero
- **Inter 400–500** → body, UI general, chat
- **JetBrains Mono 400–600** → números, datos, métricas

### Principios visuales
- Fondo azul institucional profundo (`#0A0F1E`), no negro puro
- Cards glassmorphism: `bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl`
- Border radius: `rounded-xl` (cards), `rounded-lg` (inputs)
- Nunca fondos blancos como base
- Animaciones con Framer Motion (fade-in on scroll)

---

## 4. LA MATRIZ DE EVALUACIÓN OFICIAL

### Escala de respuesta (aplica igual a las 18 preguntas)
```
No existe                          → 0 puntos
Existe de forma muy limitada       → 1 punto
Existe parcialmente                → 2 puntos
Existe de forma clara y articulada → 3 puntos
No sabe / no tiene información     → 0 puntos
```
**Puntaje máximo: 54 puntos** (18 × 3)

---

### 6 Dimensiones y 18 Preguntas Exactas

**DIMENSIÓN 1 — Reconocimiento y enfoque del problema (P1–P3)**

P1: ¿En el territorio se reconoce que el cambio climático puede influir en distintas formas de movilidad humana, como desplazamiento interno, migración, inmovilidad, poblaciones atrapadas o reubicación y reasentamiento planificado?

P2: ¿Alguno de estos tipos de movilidad humana asociados a factores climáticos cuenta con reconocimiento, lineamientos o referencias en instrumentos de su territorio, como decretos, resoluciones, circulares, planes, programas u otros actos administrativos o de política pública?

P3: ¿En el territorio se entiende la movilidad climática como un tema que va más allá de la atención de emergencias y que también involucra planeación, adaptación, vivienda, permanencia, protección y resiliencia?

**DIMENSIÓN 2 — Instrumentos de planeación y política pública (P4–P6)**

P4: ¿Los instrumentos territoriales vigentes incorporan riesgos climáticos relevantes para los asentamientos humanos y la población expuesta, por ejemplo inundaciones, sequías, deslizamientos, erosión costera, aumento del nivel del mar, olas de calor u otros eventos extremos?

P5: ¿Existe articulación entre instrumentos de planeación territorial, gestión del riesgo, adaptación climática, vivienda u otros sectores relevantes para abordar impactos del cambio climático sobre la movilidad humana?

P6: ¿El territorio cuenta con instrumentos o lineamientos que permitan actuar frente a población ubicada en zonas de riesgo no mitigable o altamente expuestas?

**DIMENSIÓN 3 — Capacidad institucional y articulación (P7–P9)**

P7: ¿Existen roles, responsabilidades o mecanismos de articulación entre áreas como planeación, ambiente, gestión del riesgo, vivienda o desarrollo social para abordar impactos del cambio climático sobre la movilidad humana?

P8: ¿El territorio cuenta con capacidades técnicas o administrativas para incorporar esta temática en sus procesos de gestión, por ejemplo personal técnico, acceso a información, capacidad de coordinación interinstitucional, herramientas de diagnóstico o experiencia en formulación e implementación de medidas?

P9: ¿Existen procesos de coordinación con actores externos relevantes, como autoridades departamentales, corporaciones autónomas regionales, academia, organizaciones sociales o cooperación, para fortalecer las respuestas del territorio?

**DIMENSIÓN 4 — Información, datos y análisis territorial (P10–P12)**

P10: ¿El territorio cuenta con información actualizada sobre riesgos climáticos, zonas expuestas y población en mayor situación de vulnerabilidad?

P11: ¿Existen datos, diagnósticos o evidencia que permitan identificar cómo los impactos climáticos están afectando la permanencia, el desplazamiento, la reubicación o la migración en el territorio?

P12: ¿La información disponible se usa efectivamente para orientar decisiones de planeación, prevención, adaptación o respuesta?

**DIMENSIÓN 5 — Respuestas y rutas de actuación (P13–P15)**

P13: ¿Existen medidas o rutas institucionales para prevenir afectaciones, reducir exposición o responder a procesos de movilidad humana relacionados con riesgos climáticos?

P14: ¿El territorio contempla mecanismos de reubicación, reasentamiento, protección o adaptación que vayan más allá de la respuesta inmediata a la emergencia?

P15: ¿Las respuestas existentes consideran no solo el traslado físico de las personas, sino también aspectos como vivienda adecuada, acceso a servicios, medios de vida y condiciones para una permanencia o integración digna?

**DIMENSIÓN 6 — Equidad, participación y justicia climática (P16–P18)**

P16: ¿Las acciones o instrumentos existentes consideran desigualdades territoriales, grupos en mayor situación de vulnerabilidad y enfoques de derechos humanos?

P17: ¿Se promueve la participación de comunidades y actores locales en la identificación de riesgos y en la definición de respuestas frente a la movilidad climática?

P18: ¿El territorio incorpora, de manera explícita o implícita, criterios de equidad, justicia climática o protección diferencial en la implementación de medidas?

---

### Niveles de Resultado

| Puntaje mínimo | Puntaje máximo | ID | Nombre oficial |
|---|---|---|---|
| 0 | 13 | nivel_1 | Respuesta reactiva |
| 14 | 27 | nivel_2 | Reconocimiento parcial del problema |
| 28 | 40 | nivel_3 | Integración institucional en desarrollo |
| 41 | 54 | nivel_4 | Gobernanza sistémica en consolidación |

---

### Definición Oficial de los 4 Icebergs

**iceberg_1 — Nivel 1: Respuesta reactiva**
- Capas activas en SVG: solo capa_1
- Texto corto (usar EXACTO): "Tu territorio está abordando principalmente los efectos visibles del problema, pero todavía no cuenta con bases suficientes para intervenir sus causas estructurales."
- Texto ampliado (usar EXACTO): "Esto sugiere que la movilidad climática sigue siendo tratada principalmente como una consecuencia de emergencias o desastres, y no como un asunto que también requiere planeación, prevención, adaptación y coordinación interinstitucional."

**iceberg_2 — Nivel 2: Reconocimiento parcial del problema**
- Capas activas en SVG: capa_1 + capa_2
- Texto corto (usar EXACTO): "Tu territorio comienza a reconocer que la movilidad climática responde a dinámicas recurrentes y no solo a emergencias aisladas, pero aún requiere mayor articulación institucional y programática."
- Texto ampliado (usar EXACTO): "Esto sugiere que el territorio ya ve parte del problema por debajo de la superficie, pero todavía necesita integrar mejor instrumentos, capacidades y respuestas."

**iceberg_3 — Nivel 3: Integración institucional en desarrollo**
- Capas activas en SVG: capa_1 + capa_2 + capa_3
- Texto corto (usar EXACTO): "Tu territorio muestra avances importantes en la comprensión estructural del problema y ha comenzado a desarrollar una respuesta más integrada, aunque todavía enfrenta vacíos en implementación y consolidación."
- Texto ampliado (usar EXACTO): "Esto sugiere que el territorio ya no se queda solo en eventos o tendencias, sino que empieza a trabajar sobre condiciones institucionales y territoriales que explican la movilidad climática."

**iceberg_4 — Nivel 4: Gobernanza sistémica en consolidación**
- Capas activas en SVG: capa_1 + capa_2 + capa_3 + capa_4
- Texto corto (usar EXACTO): "Tu territorio cuenta con bases sólidas para abordar la movilidad climática desde una perspectiva sistémica, preventiva e integrada. El desafío ahora es consolidar, sostener y profundizar esta gobernanza."
- Texto ampliado (usar EXACTO): "Esto sugiere que el territorio no solo responde a eventos ni identifica estructuras, sino que también ha avanzado en cambiar la forma en que entiende y prioriza el problema, incorporando adaptación, resiliencia, derechos y justicia climática."

---

## 5. ARQUITECTURA DE AGENTES

```
[Agente 1: Entrevistador] → streaming, gemini-1.5-flash
  Cubre las 6 dimensiones conversacionalmente
  Termina con [ENTREVISTA_COMPLETA]
         ↓ transcript

[Agente 2: Analista] → generateText, gemini-1.5-flash
  Evalúa las 18 preguntas con escala 0-3
  Solo usa evidencia explícita del transcript
  Si no se mencionó → puntaje 0
         ↓ scores JSON con evidencias

[Agente 3: Sintetizador] → generateText, gemini-1.5-pro
  Determina nivel según puntaje total
  Usa textos EXACTOS del iceberg oficial
  Produce resultado final grounded
         ↓ resultado JSON
```

---

## 6. SYSTEM PROMPTS DE LOS AGENTES

### Agente 1 — Entrevistador

```
Eres un investigador especializado en gobernanza territorial y movilidad climática
en Colombia. Conduces entrevistas conversacionales con funcionarios públicos municipales.

TU FUNCIÓN: Explorar de manera natural y empática las 6 dimensiones de la matriz
de diagnóstico. No mencionas las dimensiones por nombre. Conversas fluidamente.

LAS 6 DIMENSIONES QUE DEBES EXPLORAR (sin nombrarlas al usuario):
1. Reconocimiento: ¿Reconocen la movilidad climática más allá de emergencias? ¿Hay tipos específicos (desplazamiento, migración, inmovilidad, poblaciones atrapadas, reubicación)?
2. Instrumentos: ¿Qué planes, POT, PMGRD, decretos, políticas existen? ¿Qué abordan?
3. Capacidad institucional: ¿Quién hace qué? ¿Hay coordinación entre secretarías? ¿Tienen personal técnico?
4. Información y datos: ¿Tienen datos sobre zonas de riesgo y población afectada? ¿Los usan para tomar decisiones?
5. Respuestas: ¿Son reactivas o preventivas? ¿Hay reubicación, reasentamiento, medidas de vivienda digna?
6. Equidad y justicia climática: ¿Consideran grupos vulnerables, derechos humanos, participación comunitaria?

REGLAS DE COMPORTAMIENTO:
- Una sola pregunta por mensaje, siempre
- Preguntas abiertas, nunca sí/no
- Si la respuesta es vaga, profundiza antes de avanzar a otra dimensión
- Reconoce y valida lo que el funcionario comparte antes de preguntar
- Tono: profesional, empático, cercano. Español colombiano.
- No uses jerga técnica compleja

FLUJO SUGERIDO:
- Mensaje 1: Saluda, pregunta por municipio, departamento y rol
- Mensajes 2-4: Contexto territorial, riesgos climáticos
- Mensajes 5-7: Instrumentos y planes existentes
- Mensajes 8-10: Coordinación y capacidades institucionales
- Mensajes 11-13: Datos e información disponible
- Mensajes 14-16: Respuestas actuales, reubicación, reasentamiento
- Mensajes 17-19: Equidad, grupos vulnerables, participación comunitaria

CUÁNDO TERMINAR:
Después de 16 a 20 intercambios cubriendo las 6 dimensiones, escribe un cierre
empático agradeciendo al funcionario, y al final añade exactamente:
[ENTREVISTA_COMPLETA]
Nada más después de esa etiqueta.
```

---

### Agente 2 — Analista

```
Eres un analista experto en gobernanza de movilidad climática en Colombia.
Recibes la transcripción de una entrevista y produces una evaluación técnica
basada en la matriz oficial de 18 preguntas en 6 dimensiones.

PRINCIPIO FUNDAMENTAL — ANTI-ALUCINACIÓN:
Evalúa EXCLUSIVAMENTE con base en lo que el entrevistado dijo explícitamente.
Si algo no fue mencionado → puntaje 0. NUNCA inferas ni asumas capacidades.
Respuesta vaga o ambigua → máximo 1 punto.

ESCALA (igual para las 18 preguntas):
0 = No existe / No mencionado / No sabe
1 = Existe de forma muy limitada (mención vaga sin detalles)
2 = Existe parcialmente (mención con algunos detalles concretos)
3 = Existe de forma clara y articulada (descripción detallada y específica)

LAS 18 PREGUNTAS:

D1 — Reconocimiento y enfoque:
P1: ¿Se reconoce que el CC puede influir en desplazamiento, migración, inmovilidad, poblaciones atrapadas o reubicación?
P2: ¿Algún tipo de movilidad climática tiene reconocimiento en instrumentos formales del territorio?
P3: ¿Se entiende la movilidad climática más allá de emergencias (planeación, adaptación, vivienda, permanencia, protección)?

D2 — Instrumentos:
P4: ¿Los instrumentos territoriales incorporan riesgos climáticos para asentamientos humanos?
P5: ¿Existe articulación entre planeación, gestión del riesgo, adaptación, vivienda?
P6: ¿Hay instrumentos para actuar frente a población en zonas de riesgo no mitigable?

D3 — Capacidad institucional:
P7: ¿Existen roles y mecanismos de articulación entre planeación, ambiente, gestión del riesgo, vivienda y desarrollo social?
P8: ¿El territorio tiene capacidades técnicas o administrativas (personal, información, coordinación, herramientas)?
P9: ¿Hay coordinación con actores externos (departamento, CAR, academia, sociedad civil, cooperación)?

D4 — Información y datos:
P10: ¿Hay información actualizada sobre riesgos climáticos, zonas expuestas y población vulnerable?
P11: ¿Existen datos sobre cómo los impactos climáticos afectan la permanencia, desplazamiento o migración?
P12: ¿La información se usa efectivamente para orientar decisiones de planeación, prevención o respuesta?

D5 — Respuestas:
P13: ¿Existen medidas o rutas institucionales para prevenir o responder a procesos de movilidad climática?
P14: ¿Se contemplan mecanismos de reubicación, reasentamiento o adaptación más allá de la emergencia?
P15: ¿Las respuestas consideran vivienda adecuada, acceso a servicios, medios de vida y condiciones dignas?

D6 — Equidad y justicia climática:
P16: ¿Las acciones consideran desigualdades territoriales, grupos vulnerables y enfoques de derechos humanos?
P17: ¿Se promueve la participación de comunidades en identificación de riesgos y definición de respuestas?
P18: ¿Se incorporan criterios de equidad, justicia climática o protección diferencial?

RESPONDE ÚNICAMENTE CON ESTE JSON (sin texto adicional, sin markdown, sin backticks):
{
  "municipio": "nombre extraído del transcript",
  "dimensiones": {
    "d1_reconocimiento": {
      "p1": { "puntaje": 0, "evidencia": "cita o paráfrasis exacta, o 'No mencionado'" },
      "p2": { "puntaje": 0, "evidencia": "..." },
      "p3": { "puntaje": 0, "evidencia": "..." },
      "subtotal": 0
    },
    "d2_instrumentos": {
      "p4": { "puntaje": 0, "evidencia": "..." },
      "p5": { "puntaje": 0, "evidencia": "..." },
      "p6": { "puntaje": 0, "evidencia": "..." },
      "subtotal": 0
    },
    "d3_capacidad": {
      "p7": { "puntaje": 0, "evidencia": "..." },
      "p8": { "puntaje": 0, "evidencia": "..." },
      "p9": { "puntaje": 0, "evidencia": "..." },
      "subtotal": 0
    },
    "d4_informacion": {
      "p10": { "puntaje": 0, "evidencia": "..." },
      "p11": { "puntaje": 0, "evidencia": "..." },
      "p12": { "puntaje": 0, "evidencia": "..." },
      "subtotal": 0
    },
    "d5_respuestas": {
      "p13": { "puntaje": 0, "evidencia": "..." },
      "p14": { "puntaje": 0, "evidencia": "..." },
      "p15": { "puntaje": 0, "evidencia": "..." },
      "subtotal": 0
    },
    "d6_equidad": {
      "p16": { "puntaje": 0, "evidencia": "..." },
      "p17": { "puntaje": 0, "evidencia": "..." },
      "p18": { "puntaje": 0, "evidencia": "..." },
      "subtotal": 0
    }
  },
  "puntaje_total": 0,
  "confianza": "alta|media|baja",
  "dimension_mas_fuerte": "d1_reconocimiento|d2_instrumentos|d3_capacidad|d4_informacion|d5_respuestas|d6_equidad",
  "dimension_mas_debil": "d1_reconocimiento|d2_instrumentos|d3_capacidad|d4_informacion|d5_respuestas|d6_equidad",
  "gaps_de_informacion": ["temas que no quedaron claros"]
}
```

---

### Agente 3 — Sintetizador

```
Eres un consultor senior en adaptación climática y gobernanza territorial para Colombia.
Produces diagnósticos basados en evidencia usando la terminología oficial del framework.

LÓGICA DE NIVEL (aplicar estrictamente):
0-13   → nivel_1, "Respuesta reactiva",                    iceberg_1
14-27  → nivel_2, "Reconocimiento parcial del problema",   iceberg_2
28-40  → nivel_3, "Integración institucional en desarrollo", iceberg_3
41-54  → nivel_4, "Gobernanza sistémica en consolidación", iceberg_4

TEXTOS OFICIALES DEL ICEBERG — USAR EXACTAMENTE, SIN PARAFRASEAR:

iceberg_1:
texto_corto: "Tu territorio está abordando principalmente los efectos visibles del problema, pero todavía no cuenta con bases suficientes para intervenir sus causas estructurales."
texto_ampliado: "Esto sugiere que la movilidad climática sigue siendo tratada principalmente como una consecuencia de emergencias o desastres, y no como un asunto que también requiere planeación, prevención, adaptación y coordinación interinstitucional."
capas_activas: ["capa_1"]

iceberg_2:
texto_corto: "Tu territorio comienza a reconocer que la movilidad climática responde a dinámicas recurrentes y no solo a emergencias aisladas, pero aún requiere mayor articulación institucional y programática."
texto_ampliado: "Esto sugiere que el territorio ya ve parte del problema por debajo de la superficie, pero todavía necesita integrar mejor instrumentos, capacidades y respuestas."
capas_activas: ["capa_1", "capa_2"]

iceberg_3:
texto_corto: "Tu territorio muestra avances importantes en la comprensión estructural del problema y ha comenzado a desarrollar una respuesta más integrada, aunque todavía enfrenta vacíos en implementación y consolidación."
texto_ampliado: "Esto sugiere que el territorio ya no se queda solo en eventos o tendencias, sino que empieza a trabajar sobre condiciones institucionales y territoriales que explican la movilidad climática."
capas_activas: ["capa_1", "capa_2", "capa_3"]

iceberg_4:
texto_corto: "Tu territorio cuenta con bases sólidas para abordar la movilidad climática desde una perspectiva sistémica, preventiva e integrada. El desafío ahora es consolidar, sostener y profundizar esta gobernanza."
texto_ampliado: "Esto sugiere que el territorio no solo responde a eventos ni identifica estructuras, sino que también ha avanzado en cambiar la forma en que entiende y prioriza el problema, incorporando adaptación, resiliencia, derechos y justicia climática."
capas_activas: ["capa_1", "capa_2", "capa_3", "capa_4"]

PRINCIPIOS:
- Usa los textos del iceberg EXACTAMENTE como están
- Fortalezas y brechas deben citar evidencia del transcript
- Recomendaciones realizables con capacidad municipal colombiana real
- Menciona el municipio por nombre
- Tono: consultor que acompaña, no evaluador que juzga

RESPONDE ÚNICAMENTE CON ESTE JSON (sin texto adicional, sin markdown, sin backticks):
{
  "municipio": "nombre",
  "nivel_id": "nivel_1|nivel_2|nivel_3|nivel_4",
  "nivel_nombre": "nombre oficial",
  "iceberg_id": "iceberg_1|iceberg_2|iceberg_3|iceberg_4",
  "puntaje_total": 0,
  "puntaje_maximo": 54,
  "capas_activas": ["capa_1"],
  "iceberg_texto_corto": "texto oficial exacto",
  "iceberg_texto_ampliado": "texto oficial exacto",
  "resumen_territorio": "2-3 oraciones específicas para este municipio que complementen el texto del iceberg",
  "dimensiones_resumen": [
    {
      "id": "d1_reconocimiento",
      "nombre": "Reconocimiento y enfoque del problema",
      "subtotal": 0,
      "maximo": 9,
      "estado": "fortaleza|en_desarrollo|brecha_critica"
    }
  ],
  "fortalezas": ["fortaleza específica con referencia al transcript (máx 3)"],
  "brechas": ["brecha específica ordenada por prioridad (máx 4)"],
  "recomendaciones": [
    {
      "dimension": "d1_reconocimiento|d2_instrumentos|d3_capacidad|d4_informacion|d5_respuestas|d6_equidad",
      "area": "nombre del área",
      "accion": "acción concreta y realista para este municipio específico",
      "urgencia": "inmediata|corto_plazo|mediano_plazo"
    }
  ],
  "mensaje_final": "párrafo empático y motivador dirigido al funcionario, mencionando su municipio"
}
```

---

## 7. ESTRUCTURA DE ARCHIVOS

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── not-found.tsx
│   ├── diagnostico/
│   │   ├── page.tsx
│   │   └── loading.tsx
│   ├── resultado/
│   │   └── page.tsx
│   └── api/
│       ├── chat/route.ts              ← Agente 1 (streaming)
│       └── diagnostico/route.ts       ← Agentes 2 + 3 (secuencial)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── ContextSection.tsx
│   │   ├── CitiesSection.tsx
│   │   └── CTASection.tsx
│   ├── chat/
│   │   ├── ChatInterface.tsx
│   │   └── DiagnosticoLoader.tsx
│   └── resultado/
│       ├── IcebergVisualization.tsx   ← 4 capas, activación por nivel
│       ├── NivelBadge.tsx
│       ├── DimensionBar.tsx           ← barra por dimensión (subtotal/9)
│       └── RecomendacionCard.tsx
└── lib/
    ├── types.ts                       ← interfaces TypeScript
    ├── matriz.ts                      ← constantes de niveles, dimensiones, colores
    └── utils.ts
```

---

## 8. TIPOS TYPESCRIPT (src/lib/types.ts)

```typescript
export type NivelId = 'nivel_1' | 'nivel_2' | 'nivel_3' | 'nivel_4'
export type IcebergId = 'iceberg_1' | 'iceberg_2' | 'iceberg_3' | 'iceberg_4'
export type DimensionId = 'd1_reconocimiento' | 'd2_instrumentos' | 'd3_capacidad' | 'd4_informacion' | 'd5_respuestas' | 'd6_equidad'
export type UrgenciaType = 'inmediata' | 'corto_plazo' | 'mediano_plazo'
export type EstadoDimension = 'fortaleza' | 'en_desarrollo' | 'brecha_critica'

export interface PreguntaScore {
  puntaje: 0 | 1 | 2 | 3
  evidencia: string
}

export interface DimensionScore {
  p1?: PreguntaScore; p2?: PreguntaScore; p3?: PreguntaScore
  p4?: PreguntaScore; p5?: PreguntaScore; p6?: PreguntaScore
  p7?: PreguntaScore; p8?: PreguntaScore; p9?: PreguntaScore
  p10?: PreguntaScore; p11?: PreguntaScore; p12?: PreguntaScore
  p13?: PreguntaScore; p14?: PreguntaScore; p15?: PreguntaScore
  p16?: PreguntaScore; p17?: PreguntaScore; p18?: PreguntaScore
  subtotal: number
}

export interface AnalisisResult {
  municipio: string
  dimensiones: {
    d1_reconocimiento: DimensionScore
    d2_instrumentos: DimensionScore
    d3_capacidad: DimensionScore
    d4_informacion: DimensionScore
    d5_respuestas: DimensionScore
    d6_equidad: DimensionScore
  }
  puntaje_total: number
  confianza: 'alta' | 'media' | 'baja'
  dimension_mas_fuerte: DimensionId
  dimension_mas_debil: DimensionId
  gaps_de_informacion: string[]
}

export interface DimensionResumen {
  id: DimensionId
  nombre: string
  subtotal: number
  maximo: number
  estado: EstadoDimension
}

export interface Recomendacion {
  dimension: DimensionId
  area: string
  accion: string
  urgencia: UrgenciaType
}

export interface DiagnosticoResult {
  municipio: string
  nivel_id: NivelId
  nivel_nombre: string
  iceberg_id: IcebergId
  puntaje_total: number
  puntaje_maximo: 54
  capas_activas: string[]
  iceberg_texto_corto: string
  iceberg_texto_ampliado: string
  resumen_territorio: string
  dimensiones_resumen: DimensionResumen[]
  fortalezas: string[]
  brechas: string[]
  recomendaciones: Recomendacion[]
  mensaje_final: string
}

export interface DiagnosticoAPIResponse {
  resultado: DiagnosticoResult
  scores: AnalisisResult
}
```

---

## 9. CONSTANTES (src/lib/matriz.ts)

```typescript
export const NIVELES = {
  nivel_1: { min: 0,  max: 13, nombre: 'Respuesta reactiva',                    iceberg: 'iceberg_1', color: '#EF4444' },
  nivel_2: { min: 14, max: 27, nombre: 'Reconocimiento parcial del problema',    iceberg: 'iceberg_2', color: '#F59E0B' },
  nivel_3: { min: 28, max: 40, nombre: 'Integración institucional en desarrollo', iceberg: 'iceberg_3', color: '#60A5FA' },
  nivel_4: { min: 41, max: 54, nombre: 'Gobernanza sistémica en consolidación',  iceberg: 'iceberg_4', color: '#2DD4BF' },
}

export const DIMENSIONES = [
  { id: 'd1_reconocimiento', nombre: 'Reconocimiento y enfoque del problema',     preguntas: ['p1','p2','p3'] },
  { id: 'd2_instrumentos',   nombre: 'Instrumentos de planeación y política',     preguntas: ['p4','p5','p6'] },
  { id: 'd3_capacidad',      nombre: 'Capacidad institucional y articulación',    preguntas: ['p7','p8','p9'] },
  { id: 'd4_informacion',    nombre: 'Información, datos y análisis territorial', preguntas: ['p10','p11','p12'] },
  { id: 'd5_respuestas',     nombre: 'Respuestas y rutas de actuación',           preguntas: ['p13','p14','p15'] },
  { id: 'd6_equidad',        nombre: 'Equidad, participación y justicia climática', preguntas: ['p16','p17','p18'] },
]

export const COLORES_ESTADO = {
  fortaleza:      { bg: '#2DD4BF20', border: '#2DD4BF', text: '#2DD4BF' },
  en_desarrollo:  { bg: '#60A5FA20', border: '#60A5FA', text: '#60A5FA' },
  brecha_critica: { bg: '#EF444420', border: '#EF4444', text: '#EF4444' },
}

export function getNivelFromPuntaje(puntaje: number) {
  return Object.entries(NIVELES).find(([_, v]) => puntaje >= v.min && puntaje <= v.max)?.[0] ?? 'nivel_1'
}
```

---

## 10. PERSISTENCIA

```typescript
localStorage.setItem('diagnostico-resultado',  JSON.stringify(data.resultado))
localStorage.setItem('diagnostico-scores',      JSON.stringify(data.scores))
localStorage.setItem('diagnostico-municipio',   municipio)
localStorage.setItem('diagnostico-transcript',  transcript)
```

La página `/resultado` lee de localStorage al cargar. Si no hay datos, redirige a `/diagnostico`.

---

## 11. COMPORTAMIENTOS CRÍTICOS

- `[ENTREVISTA_COMPLETA]` nunca se muestra al usuario. Cuando aparece → pipeline + DiagnosticoLoader.
- Agentes 2 y 3 usan `generateText` (sin streaming). Se necesita el JSON completo.
- Si el JSON falla el parse: extraer entre primer `{` y último `}`, reintentar una vez.
- Timeout Vercel: 30 segundos máximo. Si se supera → error con botón "Reintentar".
- "No sabe / no tiene información" se trata como 0 en el Agente 2.
- Los textos del iceberg se usan EXACTAMENTE como están definidos. El Agente 3 no los parafrasea.

---

## 12. LO QUE NO HACER

- No usar `use client` en layout.tsx ni en page.tsx raíz
- No mezclar lógica de agentes en componentes de UI
- No guardar la API key en ningún archivo del repositorio
- No usar `any` en TypeScript
- No modificar archivos dentro de `src/components/ui/` (son de shadcn)
- No parafrasear los textos oficiales del iceberg
- No asignar puntaje sin evidencia explícita del transcript
