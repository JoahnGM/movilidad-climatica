import { idiomaDeCookies } from '@/lib/i18n/idioma'
import { ErrorAgente, ejecutarDiagnostico } from '@/lib/ai/pipeline'
import { leerCuerpoJSON, validarDiagnostico } from '@/lib/validacion'
import { registrar, type EventoLog } from '@/lib/seguridad/log'
import { LIMITES_RUTA, consumir } from '@/lib/seguridad/rate-limit'
import {
  claveCliente, diagnosticoHabilitado, esBot, obtenerRequestId, respuestaError,
} from '@/lib/seguridad/http'

// Dos agentes secuenciales de hasta 25 s por llamada, cada uno con un posible reintento de JSON.
export const maxDuration = 120

const RUTA = '/api/diagnostico'

export async function POST(req: Request) {
  const inicio = Date.now()
  const requestId = obtenerRequestId(req)
  const fin = (status: number, extra: Omit<EventoLog, 'requestId' | 'ruta' | 'status' | 'latenciaMs'> = {}) =>
    registrar({ requestId, ruta: RUTA, status, latenciaMs: Date.now() - inicio, ...extra })

  if (!diagnosticoHabilitado()) {
    fin(503, { motivo: 'kill_switch' })
    return respuestaError(503, requestId)
  }

  const { clave, ipHash } = await claveCliente(req)
  if (!consumir(`diagnostico:${clave}`, LIMITES_RUTA.diagnostico)) {
    fin(429, { motivo: 'rate_limit', ipHash })
    return respuestaError(429, requestId)
  }

  const cuerpo = await leerCuerpoJSON(req)
  if (!cuerpo.ok) {
    fin(cuerpo.status, { motivo: cuerpo.motivo, ipHash })
    return respuestaError(cuerpo.status, requestId)
  }
  const validado = validarDiagnostico(cuerpo.valor)
  if (!validado.ok) {
    fin(validado.status, { motivo: validado.motivo, ipHash })
    return respuestaError(validado.status, requestId)
  }
  const { transcripcion, textosUsuario, manipulacion } = validado.valor

  // Manipulación → confianza baja y bloqueo: no se genera un diagnóstico sobre una entrevista manipulada.
  if (manipulacion.detectada) {
    fin(422, { motivo: 'manipulacion', manipulacion: true, patronesManipulacion: manipulacion.patrones, ipHash })
    return respuestaError(422, requestId, { step: 'analista' })
  }

  if (await esBot()) {
    fin(403, { motivo: 'bot', ipHash })
    return respuestaError(403, requestId)
  }

  try {
    const { respuesta, meta } = await ejecutarDiagnostico({
      transcripcion,
      textosUsuario,
      manipulacion: false,
      signal: req.signal,
      idioma: idiomaDeCookies(req.headers.get('cookie')),
    })
    fin(200, {
      tokensEntrada: meta.uso.entrada,
      tokensSalida: meta.uso.salida,
      puntajeTotal: meta.puntajeTotal,
      citasNoVerificadas: meta.invalidadas,
      manipulacion: false,
      modelo: meta.modelos.join(','),
      ipHash,
    })
    return Response.json(respuesta, { headers: { 'Cache-Control': 'no-store', 'X-Request-Id': requestId } })
  } catch (error) {
    if (error instanceof ErrorAgente) {
      const status = error.causa === 'timeout' ? 504 : 500
      fin(status, { motivo: error.message, ipHash })
      return respuestaError(status, requestId, { step: error.paso })
    }
    fin(500, { motivo: 'desconocido', ipHash })
    return respuestaError(500, requestId, { step: 'analista' })
  }
}
