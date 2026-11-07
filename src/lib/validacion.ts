/**
 * Validación de entrada de las rutas de IA (docs/estandares/seguridad.md).
 * Todo error sale con mensaje genérico; el detalle solo va al log como `motivo`.
 */
import { detectarManipulacion, quitarTagCierre, type ResultadoManipulacion } from './manipulacion'
import { ChatRequestSchema, DiagnosticoRequestSchema, LIMITES } from './schemas'

export type Rol = 'user' | 'assistant'
export interface Turno { rol: Rol; texto: string }

export type Validacion<T> =
  | { ok: true; valor: T }
  | { ok: false; status: 400 | 413; motivo: string }

const encoder = new TextEncoder()
export const bytesUtf8 = (s: string) => encoder.encode(s).length

/** Lee el cuerpo con tope de bytes ANTES de parsear JSON (protege contra payloads grandes). */
export async function leerCuerpoJSON(req: Request, maxBytes: number = LIMITES.cuerpoBytes): Promise<Validacion<unknown>> {
  const declarado = Number(req.headers.get('content-length') ?? '0')
  if (declarado > maxBytes) return { ok: false, status: 413, motivo: 'content_length' }

  const reader = req.body?.getReader()
  if (!reader) return { ok: false, status: 400, motivo: 'sin_cuerpo' }
  const partes: Uint8Array[] = []
  let total = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    total += value.byteLength
    if (total > maxBytes) {
      await reader.cancel()
      return { ok: false, status: 413, motivo: 'cuerpo_grande' }
    }
    partes.push(value)
  }
  const buffer = new Uint8Array(total)
  let offset = 0
  for (const p of partes) { buffer.set(p, offset); offset += p.byteLength }
  try {
    return { ok: true, valor: JSON.parse(new TextDecoder().decode(buffer)) }
  } catch {
    return { ok: false, status: 400, motivo: 'json_invalido' }
  }
}

function validarLimitesTurnos(turnos: Turno[]): Validacion<Turno[]> {
  if (turnos.length > LIMITES.mensajes) return { ok: false, status: 413, motivo: 'demasiados_mensajes' }
  for (const t of turnos) {
    const max = t.rol === 'user' ? LIMITES.caracteresTurnoUsuario : LIMITES.caracteresTurnoAsistente
    if (t.texto.length > max) return { ok: false, status: 413, motivo: 'turno_largo' }
  }
  const total = turnos.reduce((n, t) => n + bytesUtf8(t.texto), 0)
  if (total > LIMITES.transcripcionBytes) return { ok: false, status: 413, motivo: 'transcripcion_grande' }
  return { ok: true, valor: turnos }
}

export interface ChatValidado {
  turnos: Turno[]
  manipulacion: ResultadoManipulacion
}

/**
 * Valida el cuerpo de /api/chat. Solo roles user/assistant y partes de texto.
 * El tag de cierre en un turno `user` se elimina y se marca como manipulación.
 */
export function validarChat(cuerpo: unknown): Validacion<ChatValidado> {
  const parsed = ChatRequestSchema.safeParse(cuerpo)
  if (!parsed.success) return { ok: false, status: 400, motivo: 'esquema' }

  const turnos: Turno[] = parsed.data.messages.map((m) => ({
    rol: m.role,
    texto: m.parts
      .filter((p) => p.type === 'text' && typeof p.text === 'string')
      .map((p) => p.text as string)
      .join('\n'),
  }))
  if (turnos[turnos.length - 1].rol !== 'user') return { ok: false, status: 400, motivo: 'ultimo_no_user' }

  const limites = validarLimitesTurnos(turnos)
  if (!limites.ok) return limites

  const textosUsuario = turnos.filter((t) => t.rol === 'user').map((t) => t.texto)
  const manipulacion = detectarManipulacion(textosUsuario)
  const limpios = turnos.map((t) => (t.rol === 'user' ? { ...t, texto: quitarTagCierre(t.texto) } : t))
  if (limpios.some((t) => t.rol === 'user' && t.texto.length === 0)) return { ok: false, status: 400, motivo: 'turno_vacio' }

  return { ok: true, valor: { turnos: limpios, manipulacion } }
}

// ─── Transcripción ────────────────────────────────────────────────────────────
// Formato que construye ChatInterface: "FUNCIONARIO:\n…" / "ENTREVISTADOR:\n…"
// separados por "\n\n---\n\n".

export const ETIQUETA: Record<Rol, string> = { user: 'FUNCIONARIO', assistant: 'ENTREVISTADOR' }
export const SEPARADOR_TURNOS = '\n\n---\n\n'

export function construirTranscripcion(turnos: Turno[]): string {
  return turnos.map((t) => `${ETIQUETA[t.rol]}:\n${t.texto}`).join(SEPARADOR_TURNOS)
}

export function parsearTranscripcion(transcripcion: string): Turno[] | null {
  const bloques = transcripcion.split(/\n\s*---\s*\n/)
  const turnos: Turno[] = []
  for (const bloque of bloques) {
    const m = bloque.trim().match(/^(FUNCIONARIO|ENTREVISTADOR):\s*\n?([\s\S]*)$/)
    if (!m) return null
    turnos.push({ rol: m[1] === 'FUNCIONARIO' ? 'user' : 'assistant', texto: m[2].trim() })
  }
  return turnos
}

export interface DiagnosticoValidado {
  turnos: Turno[]
  /** Transcripción reconstruida a partir de los turnos validados (lo único que ve el modelo). */
  transcripcion: string
  textosUsuario: string[]
  manipulacion: ResultadoManipulacion
}

export function validarDiagnostico(cuerpo: unknown): Validacion<DiagnosticoValidado> {
  const parsed = DiagnosticoRequestSchema.safeParse(cuerpo)
  if (!parsed.success) return { ok: false, status: 400, motivo: 'esquema' }
  const { transcript, municipio } = parsed.data

  if (bytesUtf8(transcript) > LIMITES.transcripcionBytes) return { ok: false, status: 413, motivo: 'transcripcion_grande' }
  if (municipio.length > LIMITES.municipioCaracteres) return { ok: false, status: 413, motivo: 'municipio_largo' }

  const turnos = parsearTranscripcion(transcript)
  if (!turnos || turnos.length === 0) return { ok: false, status: 400, motivo: 'transcripcion_formato' }

  const limites = validarLimitesTurnos(turnos)
  if (!limites.ok) return limites

  const textosUsuario = turnos.filter((t) => t.rol === 'user').map((t) => t.texto)
  if (textosUsuario.length === 0) return { ok: false, status: 400, motivo: 'sin_turnos_user' }
  const manipulacion = detectarManipulacion(textosUsuario)

  // El tag de cierre del entrevistador ya no aporta nada al análisis; en turnos user es manipulación.
  const limpios = turnos.map((t) => ({ ...t, texto: quitarTagCierre(t.texto) }))
  return {
    ok: true,
    valor: {
      turnos: limpios,
      transcripcion: construirTranscripcion(limpios),
      textosUsuario: limpios.filter((t) => t.rol === 'user').map((t) => t.texto),
      manipulacion,
    },
  }
}
