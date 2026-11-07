/**
 * Respuestas y utilidades comunes de las rutas de IA. Los mensajes al usuario son
 * SIEMPRE genéricos: nunca se reenvía `error.message` del proveedor ni detalles internos.
 */
import { checkBotId } from 'botid/server'
import { hashIP } from './log'

export const MENSAJES = {
  400: 'No pudimos procesar tu mensaje. Revisa el texto e inténtalo de nuevo.',
  401: 'Necesitas un código de acceso para usar el diagnóstico.',
  403: 'No pudimos verificar tu solicitud.',
  413: 'El mensaje o la conversación supera el tamaño permitido. Acorta tu respuesta o inicia un nuevo diagnóstico.',
  422: 'Tu mensaje no pudo procesarse. Responde con información sobre tu municipio para continuar.',
  429: 'Demasiadas solicitudes seguidas. Espera un momento e inténtalo de nuevo.',
  500: 'No pudimos procesar el diagnóstico. Reintenta en unos segundos.',
  503: 'El diagnóstico no está disponible en este momento. Inténtalo más tarde.',
  504: 'El diagnóstico tardó demasiado. Reintenta en unos segundos.',
} as const

export type StatusError = keyof typeof MENSAJES

export function respuestaError(status: StatusError, requestId: string, extra?: Record<string, string>): Response {
  return Response.json(
    { error: true, message: MENSAJES[status], requestId, ...extra },
    { status, headers: { 'Cache-Control': 'no-store' } },
  )
}

export function obtenerRequestId(req: Request): string {
  return req.headers.get('x-vercel-id')?.slice(0, 64) ?? crypto.randomUUID()
}

export function obtenerIP(req: Request): string {
  return (
    req.headers.get('x-real-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'local'
  )
}

/** Clave de rate limit: etiqueta del código de acceso si existe (la pone proxy.ts), si no, hash de IP. */
export async function claveCliente(req: Request): Promise<{ clave: string; ipHash: string }> {
  const ipHash = await hashIP(obtenerIP(req))
  const acceso = req.headers.get('x-acceso-etiqueta')
  return { clave: acceso ? `acceso:${acceso}` : `ip:${ipHash}`, ipHash }
}

/** Kill switch: DIAGNOSTICO_ENABLED=false apaga las rutas de IA antes de cualquier llamada. */
export function diagnosticoHabilitado(): boolean {
  return process.env.DIAGNOSTICO_ENABLED !== 'false'
}

/** BotID antes de cada inferencia. En desarrollo devuelve "humano" salvo override. */
export async function esBot(): Promise<boolean> {
  try {
    const verificacion = await checkBotId()
    return verificacion.isBot
  } catch {
    // Si BotID no está disponible (p. ej. fuera de Vercel), no bloquea: lo cubren WAF y rate limit.
    return false
  }
}
