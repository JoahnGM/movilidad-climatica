/**
 * Logging estructurado de las rutas de IA (docs/estandares/seguridad.md, regla de logging).
 *
 * Solo se aceptan los campos de `EventoLog`: el tipo impide registrar transcripción,
 * municipio, nombres, prompts o respuestas del modelo. No agregues campos de texto libre.
 */
export interface EventoLog {
  requestId: string
  ruta: '/api/chat' | '/api/diagnostico' | '/api/acceso'
  status: number
  latenciaMs: number
  /** Motivo técnico corto de un rechazo (p. ej. 'turno_largo', 'manipulacion'), nunca contenido. */
  motivo?: string
  tokensEntrada?: number
  tokensSalida?: number
  puntajeTotal?: number
  manipulacion?: boolean
  patronesManipulacion?: string[]
  citasNoVerificadas?: number
  modelo?: string
  ipHash?: string
}

export function registrar(evento: EventoLog): void {
  const linea = JSON.stringify({ nivel: evento.status >= 500 ? 'error' : 'info', ...evento })
  if (evento.status >= 500) console.error(linea)
  else console.log(linea)
}

/** Hash corto y no reversible de la IP (con sal) para correlacionar abuso sin guardar la IP. */
export async function hashIP(ip: string): Promise<string> {
  const sal = process.env.LOG_IP_SALT ?? 'movilidad-climatica'
  const datos = new TextEncoder().encode(`${sal}:${ip}`)
  const digest = await crypto.subtle.digest('SHA-256', datos)
  return Array.from(new Uint8Array(digest).slice(0, 6), (b) => b.toString(16).padStart(2, '0')).join('')
}
