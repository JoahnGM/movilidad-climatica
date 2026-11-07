import { createUIMessageStreamResponse, streamText, toUIMessageStream, type ModelMessage } from 'ai'
import { resolverModelo, senalTimeout } from '@/lib/ai/provider'
import { PROMPT_AGENTE_1 } from '@/lib/prompts/agente-1'
import { leerCuerpoJSON, validarChat } from '@/lib/validacion'
import { registrar } from '@/lib/seguridad/log'
import { LIMITES_RUTA, consumir } from '@/lib/seguridad/rate-limit'
import {
  claveCliente, diagnosticoHabilitado, esBot, obtenerRequestId, respuestaError,
} from '@/lib/seguridad/http'

export const maxDuration = 30

const RUTA = '/api/chat'

export async function POST(req: Request) {
  const inicio = Date.now()
  const requestId = obtenerRequestId(req)
  const fin = (status: number, extra: Omit<Parameters<typeof registrar>[0], 'requestId' | 'ruta' | 'status' | 'latenciaMs'> = {}) =>
    registrar({ requestId, ruta: RUTA, status, latenciaMs: Date.now() - inicio, ...extra })

  // 1. Kill switch, antes de leer nada.
  if (!diagnosticoHabilitado()) {
    fin(503, { motivo: 'kill_switch' })
    return respuestaError(503, requestId)
  }

  // 2. Rate limit (defensa en profundidad; la regla WAF es la principal).
  const { clave, ipHash } = await claveCliente(req)
  if (!consumir(`chat:${clave}`, LIMITES_RUTA.chat)) {
    fin(429, { motivo: 'rate_limit', ipHash })
    return respuestaError(429, requestId)
  }

  // 3. Tamaño y forma de la entrada.
  const cuerpo = await leerCuerpoJSON(req)
  if (!cuerpo.ok) {
    fin(cuerpo.status, { motivo: cuerpo.motivo, ipHash })
    return respuestaError(cuerpo.status, requestId)
  }
  const validado = validarChat(cuerpo.valor)
  if (!validado.ok) {
    fin(validado.status, { motivo: validado.motivo, ipHash })
    return respuestaError(validado.status, requestId)
  }
  const { turnos, manipulacion } = validado.valor

  // 4. Anti-manipulación: se bloquea antes de llamar al modelo.
  if (manipulacion.detectada) {
    fin(422, { motivo: 'manipulacion', manipulacion: true, patronesManipulacion: manipulacion.patrones, ipHash })
    return respuestaError(422, requestId)
  }

  // 5. BotID antes de inferir.
  if (await esBot()) {
    fin(403, { motivo: 'bot', ipHash })
    return respuestaError(403, requestId)
  }

  const { model, settings, etiqueta } = resolverModelo('entrevistador')
  const messages: ModelMessage[] = turnos.map((t) => ({ role: t.rol, content: t.texto }))

  try {
    const result = streamText({
      model,
      instructions: PROMPT_AGENTE_1,
      messages,
      ...settings,
      maxRetries: 1,
      abortSignal: senalTimeout(req.signal),
      onEnd: ({ totalUsage }) => {
        fin(200, { tokensEntrada: totalUsage.inputTokens, tokensSalida: totalUsage.outputTokens, modelo: etiqueta, ipHash })
      },
      onError: () => {
        fin(500, { motivo: 'proveedor', modelo: etiqueta, ipHash })
      },
    })

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: result.stream,
        sendReasoning: false,
        sendSources: false,
        onError: () => 'No pudimos continuar la conversación. Reintenta en unos segundos.',
      }),
      headers: { 'Cache-Control': 'no-store', 'X-Request-Id': requestId },
    })
  } catch {
    fin(500, { motivo: 'proveedor', modelo: etiqueta, ipHash })
    return respuestaError(500, requestId)
  }
}
