import { z } from 'zod'

// ─── Límites de entrada (docs/estandares/seguridad.md, regla 4) ────────────────
export const LIMITES = {
  /** Cuerpo HTTP máximo aceptado por las rutas de IA, antes de parsear JSON. */
  cuerpoBytes: 64 * 1024,
  mensajes: 40,
  /** Caracteres por turno del funcionario. */
  caracteresTurnoUsuario: 2_000,
  /** Caracteres por turno del entrevistador (generado por el Agente 1, ≈600 tokens). */
  caracteresTurnoAsistente: 4_000,
  /** Bytes UTF-8 de la transcripción completa. */
  transcripcionBytes: 30 * 1024,
  municipioCaracteres: 2_000,
} as const

// ─── Entrada de /api/chat ──────────────────────────────────────────────────────
// Forma de UIMessage del AI SDK. Solo roles user/assistant: cualquier otro rol
// (system, tool, developer) falla el esquema → 400.
const ParteMensaje = z.looseObject({
  type: z.string().max(40),
  text: z.string().optional(),
})

export const MensajeChatSchema = z.looseObject({
  id: z.string().max(100).optional(),
  role: z.enum(['user', 'assistant']),
  parts: z.array(ParteMensaje).max(20),
})

export const ChatRequestSchema = z.looseObject({
  messages: z.array(MensajeChatSchema).min(1),
})

// ─── Entrada de /api/diagnostico ──────────────────────────────────────────────
export const DiagnosticoRequestSchema = z.object({
  transcript: z.string().min(1),
  municipio: z.string().min(1),
})

// ─── Salida del Agente 2 (Analista) ───────────────────────────────────────────
// `puntaje` solo puede ser 0, 1, 2 o 3. Se expresa como entero acotado porque los
// proveedores de salida estructurada no aceptan enums numéricos.
export const PreguntaOutSchema = z.object({
  puntaje: z.int().min(0).max(3),
  evidencia: z.string().max(800),
})

const dim = <K extends string>(keys: readonly K[]) =>
  z.object(Object.fromEntries(keys.map((k) => [k, PreguntaOutSchema])) as Record<K, typeof PreguntaOutSchema>)

export const AnalisisOutputSchema = z.object({
  municipio: z.string().max(200),
  dimensiones: z.object({
    d1_reconocimiento: dim(['p1', 'p2', 'p3']),
    d2_instrumentos:   dim(['p4', 'p5', 'p6']),
    d3_capacidad:      dim(['p7', 'p8', 'p9']),
    d4_informacion:    dim(['p10', 'p11', 'p12']),
    d5_respuestas:     dim(['p13', 'p14', 'p15']),
    d6_equidad:        dim(['p16', 'p17', 'p18']),
  }),
  confianza: z.enum(['alta', 'media', 'baja']),
  gaps_de_informacion: z.array(z.string().max(400)),
  contexto_territorial: z.object({
    riesgos_principales: z.array(z.string().max(80)),
    categoria_municipal: z.enum(['especial', '1', '2', '3', '4', '5', '6', 'no_mencionada']),
    pdet: z.enum(['si', 'no', 'no_mencionado']),
  }),
})
export type AnalisisOutput = z.infer<typeof AnalisisOutputSchema>

// ─── Salida del Agente 3 (Sintetizador) ───────────────────────────────────────
// Nivel, puntaje, iceberg y textos oficiales NO están aquí: los pone el código.
export const DimensionIdSchema = z.enum([
  'd1_reconocimiento', 'd2_instrumentos', 'd3_capacidad', 'd4_informacion', 'd5_respuestas', 'd6_equidad',
])

export const RecomendacionOutSchema = z.object({
  dimension: DimensionIdSchema,
  area: z.string().max(120),
  accion: z.string().max(400),
  primer_paso: z.string().max(600),
  siguiente_paso: z.string().max(600),
  ruta_ampliada: z.string().max(600),
  para_quien: z.enum(['todos', 'categoria_1_3', 'categoria_4_6_PDET']),
  urgencia: z.enum(['inmediata', 'corto_plazo', 'mediano_plazo']),
})

export const SintesisOutputSchema = z.object({
  resumen_territorio: z.string().max(1_500),
  fortalezas: z.array(z.string().max(600)),
  brechas: z.array(z.string().max(600)),
  recomendaciones: z.array(RecomendacionOutSchema).min(1),
  mensaje_final: z.string().max(2_000),
})
export type SintesisOutput = z.infer<typeof SintesisOutputSchema>
