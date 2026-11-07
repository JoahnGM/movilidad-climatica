/**
 * Puntaje en código (ADR docs/decisiones/2026-11-06-puntaje-en-codigo.md).
 * Funciones puras: reciben los 18 {puntaje, evidencia} y devuelven subtotales, total,
 * nivel, iceberg, capas y textos oficiales EXACTOS. El modelo nunca decide el nivel.
 */
import { DIMENSIONES, ICEBERGS, NIVELES, PREGUNTAS, PUNTAJE_MAXIMO, getNivelFromPuntaje, type PreguntaId } from './matriz'
import type { AnalisisOutput, SintesisOutput } from './schemas'
import type {
  AnalisisResult, Confianza, DiagnosticoResult, DimensionId, DimensionResumen,
  DimensionScore, EstadoDimension, IcebergId, NivelId, PreguntaScore,
} from './types'

export type Puntaje = 0 | 1 | 2 | 3
export type Puntajes = Record<PreguntaId, PreguntaScore>

// ─── Utilidades ────────────────────────────────────────────────────────────────

export function acotarPuntaje(n: number): Puntaje {
  if (!Number.isFinite(n)) return 0
  const r = Math.round(n)
  return (r < 0 ? 0 : r > 3 ? 3 : r) as Puntaje
}

/** Aplana la salida anidada del Agente 2 a {p1…p18}. Ignora subtotales o totales que el modelo agregue. */
export function aplanarDimensiones(dimensiones: AnalisisOutput['dimensiones']): Puntajes {
  const plano = {} as Puntajes
  for (const d of DIMENSIONES) {
    const bloque = dimensiones[d.id] as Record<string, { puntaje: number; evidencia: string }>
    for (const p of d.preguntas) {
      const item = bloque?.[p]
      plano[p] = { puntaje: acotarPuntaje(item?.puntaje ?? 0), evidencia: item?.evidencia ?? 'No mencionado' }
    }
  }
  return plano
}

// ─── Grounding ────────────────────────────────────────────────────────────────

/** Minúsculas, sin tildes, sin puntuación, espacios colapsados. */
export function normalizarTexto(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9ñ]+/g, ' ')
    .trim()
}

const MIN_CARACTERES_EVIDENCIA = 12
const MIN_CARACTERES_FRAGMENTO = 4

/**
 * Una evidencia está verificada si cada fragmento (separados por "…" o "...")
 * aparece, normalizado, dentro de algún turno del funcionario.
 */
export function evidenciaVerificada(evidencia: string, textosUsuario: string[]): boolean {
  const limpia = evidencia.trim().replace(/^["“«']+|["”»']+$/g, '')
  const fragmentos = limpia
    .split(/…|\.\.\./)
    .map(normalizarTexto)
    .filter((f) => f.length >= MIN_CARACTERES_FRAGMENTO)
  const total = fragmentos.reduce((n, f) => n + f.length, 0)
  if (fragmentos.length === 0 || total < MIN_CARACTERES_EVIDENCIA) return false

  const turnos = textosUsuario.map((t) => ` ${normalizarTexto(t)} `)
  return fragmentos.every((f) => turnos.some((t) => t.includes(` ${f} `)))
}

/**
 * Todo puntaje > 0 cuya evidencia no aparece en los turnos del funcionario pasa a 0.
 * Devuelve los puntajes corregidos y la lista de preguntas invalidadas.
 */
export function aplicarGrounding(puntajes: Puntajes, textosUsuario: string[]): { puntajes: Puntajes; invalidadas: PreguntaId[] } {
  const corregidos = {} as Puntajes
  const invalidadas: PreguntaId[] = []
  for (const p of PREGUNTAS) {
    const item = puntajes[p]
    if (item.puntaje > 0 && !evidenciaVerificada(item.evidencia, textosUsuario)) {
      corregidos[p] = { puntaje: 0, evidencia: item.evidencia, verificada: false }
      invalidadas.push(p)
    } else {
      corregidos[p] = { ...item, verificada: item.puntaje > 0 ? true : undefined }
    }
  }
  return { puntajes: corregidos, invalidadas }
}

// ─── Cálculo ──────────────────────────────────────────────────────────────────

export function estadoDimension(subtotal: number): EstadoDimension {
  if (subtotal >= 6) return 'fortaleza'
  if (subtotal >= 3) return 'en_desarrollo'
  return 'brecha_critica'
}

export interface ResultadoCalculado {
  subtotales: Record<DimensionId, number>
  puntaje_total: number
  puntaje_maximo: typeof PUNTAJE_MAXIMO
  nivel_id: NivelId
  nivel_nombre: string
  iceberg_id: IcebergId
  capas_activas: string[]
  iceberg_texto_corto: string
  iceberg_texto_ampliado: string
  dimensiones_resumen: DimensionResumen[]
  dimension_mas_fuerte: DimensionId
  dimension_mas_debil: DimensionId
}

export function calcularResultado(puntajes: Puntajes): ResultadoCalculado {
  const subtotales = {} as Record<DimensionId, number>
  for (const d of DIMENSIONES) {
    subtotales[d.id] = d.preguntas.reduce((n, p) => n + acotarPuntaje(puntajes[p]?.puntaje ?? 0), 0)
  }
  const puntaje_total = DIMENSIONES.reduce((n, d) => n + subtotales[d.id], 0)
  const nivel_id = getNivelFromPuntaje(puntaje_total)
  const nivel = NIVELES[nivel_id]
  const iceberg = ICEBERGS[nivel.iceberg]

  let fuerte = DIMENSIONES[0].id
  let debil = DIMENSIONES[0].id
  for (const d of DIMENSIONES) {
    if (subtotales[d.id] > subtotales[fuerte]) fuerte = d.id
    if (subtotales[d.id] < subtotales[debil]) debil = d.id
  }

  return {
    subtotales,
    puntaje_total,
    puntaje_maximo: PUNTAJE_MAXIMO,
    nivel_id,
    nivel_nombre: nivel.nombre,
    iceberg_id: nivel.iceberg,
    capas_activas: [...iceberg.capas_activas],
    iceberg_texto_corto: iceberg.texto_corto,
    iceberg_texto_ampliado: iceberg.texto_ampliado,
    dimensiones_resumen: DIMENSIONES.map((d) => ({
      id: d.id,
      nombre: d.nombre,
      subtotal: subtotales[d.id],
      maximo: 9,
      estado: estadoDimension(subtotales[d.id]),
    })),
    dimension_mas_fuerte: fuerte,
    dimension_mas_debil: debil,
  }
}

const ORDEN_CONFIANZA: Confianza[] = ['baja', 'media', 'alta']

/** La confianza solo puede bajar: manipulación o ≥3 citas no verificadas → baja; 1–2 → máximo media. */
export function ajustarConfianza(delModelo: Confianza, invalidadas: number, manipulacion: boolean): Confianza {
  let tope: Confianza = 'alta'
  if (manipulacion || invalidadas >= 3) tope = 'baja'
  else if (invalidadas > 0) tope = 'media'
  return ORDEN_CONFIANZA[Math.min(ORDEN_CONFIANZA.indexOf(delModelo), ORDEN_CONFIANZA.indexOf(tope))]
}

// ─── Ensamblaje ───────────────────────────────────────────────────────────────

export function ensamblarAnalisis(params: {
  modelo: AnalisisOutput
  puntajes: Puntajes
  calculado: ResultadoCalculado
  confianza: Confianza
  rubricaVersion: string
}): AnalisisResult {
  const { modelo, puntajes, calculado, confianza, rubricaVersion } = params
  const dimensiones = {} as AnalisisResult['dimensiones']
  for (const d of DIMENSIONES) {
    const bloque: DimensionScore = { subtotal: calculado.subtotales[d.id] }
    for (const p of d.preguntas) bloque[p] = puntajes[p]
    dimensiones[d.id] = bloque
  }
  return {
    municipio: modelo.municipio,
    dimensiones,
    puntaje_total: calculado.puntaje_total,
    confianza,
    dimension_mas_fuerte: calculado.dimension_mas_fuerte,
    dimension_mas_debil: calculado.dimension_mas_debil,
    gaps_de_informacion: modelo.gaps_de_informacion.slice(0, 10),
    rubrica_version: rubricaVersion,
  }
}

/**
 * Une el cálculo con la síntesis del Agente 3. Nivel, puntaje, iceberg, capas,
 * textos oficiales y dimensiones vienen SIEMPRE del cálculo, nunca del modelo.
 */
export function ensamblarDiagnostico(municipio: string, calculado: ResultadoCalculado, sintesis: SintesisOutput): DiagnosticoResult {
  return {
    municipio,
    nivel_id: calculado.nivel_id,
    nivel_nombre: calculado.nivel_nombre,
    iceberg_id: calculado.iceberg_id,
    puntaje_total: calculado.puntaje_total,
    puntaje_maximo: calculado.puntaje_maximo,
    capas_activas: calculado.capas_activas,
    iceberg_texto_corto: calculado.iceberg_texto_corto,
    iceberg_texto_ampliado: calculado.iceberg_texto_ampliado,
    resumen_territorio: sintesis.resumen_territorio,
    dimensiones_resumen: calculado.dimensiones_resumen,
    fortalezas: sintesis.fortalezas.slice(0, 3),
    brechas: sintesis.brechas.slice(0, 4),
    recomendaciones: sintesis.recomendaciones.slice(0, 5),
    mensaje_final: sintesis.mensaje_final,
  }
}
