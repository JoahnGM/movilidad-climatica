export const maxDuration = 60

import { generateText } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import type { AnalisisResult, DiagnosticoResult } from '@/lib/types'

const SYSTEM_AGENTE_2 = `Eres un analista experto en gobernanza de movilidad climática en Colombia.
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
}`

const SYSTEM_AGENTE_3 = `Eres un consultor senior en adaptación climática y gobernanza territorial para Colombia.
Produces diagnósticos basados en evidencia usando la terminología oficial del framework.

LÓGICA DE NIVEL (aplicar estrictamente):
0-13   → nivel_1, "Respuesta reactiva",                     iceberg_1
14-27  → nivel_2, "Reconocimiento parcial del problema",    iceberg_2
28-40  → nivel_3, "Integración institucional en desarrollo", iceberg_3
41-54  → nivel_4, "Gobernanza sistémica en consolidación",  iceberg_4

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
}`

function parseJSON<T>(raw: string): T {
  // Intento 1: parse directo
  try {
    return JSON.parse(raw) as T
  } catch {
    // Intento 2: extraer entre primer { y último }
    const first = raw.indexOf('{')
    const last = raw.lastIndexOf('}')
    if (first !== -1 && last !== -1 && last > first) {
      try {
        return JSON.parse(raw.slice(first, last + 1)) as T
      } catch {
        // continúa al throw
      }
    }
    throw new Error('JSON_PARSE_FAILED')
  }
}

async function runAgentWithRetry<T>(
  googleClient: ReturnType<typeof createGoogleGenerativeAI>,
  model: string,
  system: string,
  userMessage: string,
  step: 'analista' | 'sintetizador'
): Promise<T> {
  const { text: firstAttempt } = await generateText({
    model: googleClient(model),
    system,
    prompt: userMessage,
  })

  try {
    return parseJSON<T>(firstAttempt)
  } catch {
    // Intento 3: reintento con instrucción explícita
    const { text: secondAttempt } = await generateText({
      model: googleClient(model),
      system,
      prompt:
        'Tu respuesta no era JSON válido. Responde ÚNICAMENTE con el JSON, sin texto ni backticks:\n' +
        firstAttempt,
    })

    try {
      return parseJSON<T>(secondAttempt)
    } catch {
      throw new Error(`Agente ${step === 'analista' ? '2' : '3'}: JSON inválido`)
    }
  }
}

export async function POST(req: Request) {
  console.log('[diagnostico] POST recibido')
  console.log('[diagnostico] KEY EXISTS:', !!process.env.GOOGLE_GENERATIVE_AI_API_KEY)

  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('TIMEOUT')), 55_000)
  )

  try {
    const body = await req.json()
    const { transcript, municipio } = body as { transcript: string; municipio: string }

    console.log('[diagnostico] municipio:', municipio)
    console.log('[diagnostico] transcript length:', transcript?.length)

    if (!transcript || !municipio) {
      return Response.json(
        { error: true, message: 'transcript y municipio son requeridos', step: 'analista' },
        { status: 400 }
      )
    }

    const googleClient = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    })

    const result = await Promise.race([
      (async () => {
        console.log('[diagnostico] Iniciando Agente 2 (Analista)...')
        // PASO 1 — Agente 2: Analista
        const analisisResult = await runAgentWithRetry<AnalisisResult>(
          googleClient,
          'gemini-3-flash-preview',
          SYSTEM_AGENTE_2,
          'Municipio: ' + municipio + '\n\nTranscripción:\n\n' + transcript,
          'analista'
        )

        console.log('[diagnostico] Agente 2 completado. Iniciando Agente 3 (Sintetizador)...')
        // PASO 2 — Agente 3: Sintetizador
        const diagnosticoResult = await runAgentWithRetry<DiagnosticoResult>(
          googleClient,
          'gemini-3.1-pro-preview',
          SYSTEM_AGENTE_3,
          'Municipio: ' +
            municipio +
            '\n\nEvaluación técnica:\n' +
            JSON.stringify(analisisResult, null, 2) +
            '\n\nTranscripción:\n' +
            transcript,
          'sintetizador'
        )

        console.log('[diagnostico] Pipeline completo. Nivel:', diagnosticoResult.nivel_id)
        return { resultado: diagnosticoResult, scores: analisisResult }
      })(),
      timeout,
    ])

    return Response.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)

    if (message === 'TIMEOUT') {
      return Response.json(
        { error: true, message: 'El diagnóstico tardó demasiado. Por favor intenta de nuevo.', step: 'sintetizador' },
        { status: 500 }
      )
    }

    const step: 'analista' | 'sintetizador' = message.includes('Agente 2')
      ? 'analista'
      : 'sintetizador'

    console.error(`Error en /api/diagnostico [${step}]:`, message)
    return Response.json(
      { error: true, message, step },
      { status: 500 }
    )
  }
}
