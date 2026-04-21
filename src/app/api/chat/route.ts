import { streamText } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'

export const maxDuration = 30

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})

const SYSTEM_PROMPT = `Eres un investigador especializado en gobernanza territorial y movilidad climática
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
Nada más después de esa etiqueta.`

export async function POST(req: Request) {
  console.log('API llamada')
  console.log('KEY EXISTS:', !!process.env.GOOGLE_GENERATIVE_AI_API_KEY)

  try {
    const body = await req.json()
    const { messages } = body

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'messages es requerido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (messages.length > 40) {
      return new Response(
        JSON.stringify({
          error: 'Conversación demasiado larga. Por favor inicia un nuevo diagnóstico.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const googleClient = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    })

    const result = await streamText({
      model: googleClient('gemini-3-flash-preview'),  // Agente 1
      system: SYSTEM_PROMPT,
      messages,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error en /api/chat:', message)
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
