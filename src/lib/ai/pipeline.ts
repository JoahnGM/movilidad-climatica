/**
 * Pipeline de diagnóstico: Agente 2 (analista) → puntaje en código → Agente 3 (sintetizador).
 * Lo usan /api/diagnostico y scripts/eval-agentes.ts, para que la evaluación mida
 * exactamente el mismo código que corre en producción.
 */
import { generateText, NoObjectGeneratedError, Output } from 'ai'
import type { z } from 'zod'
import { PROMPT_AGENTE_2, mensajeAgente2 } from '../prompts/agente-2'
import { PROMPT_AGENTE_3, mensajeAgente3 } from '../prompts/agente-3'
import { RUBRICA_VERSION } from '../prompts/version'
import { AnalisisOutputSchema, SintesisOutputSchema, type AnalisisOutput } from '../schemas'
import {
  ajustarConfianza, aplanarDimensiones, aplicarGrounding, calcularResultado,
  ensamblarAnalisis, ensamblarDiagnostico, type Puntajes, type ResultadoCalculado,
} from '../scoring'
import type { DiagnosticoAPIResponse } from '../types'
import { resolverModelo, senalTimeout, type Agente } from './provider'

export class ErrorAgente extends Error {
  constructor(public paso: 'analista' | 'sintetizador', public causa: 'json' | 'timeout' | 'proveedor') {
    super(`agente_${paso}_${causa}`)
  }
}

export interface UsoTokens { entrada: number; salida: number }

interface ResultadoGeneracion<T> {
  valor: T
  uso: UsoTokens
  /** true si el primer intento no produjo JSON válido (métrica de evaluación). */
  jsonInvalidoPrimerIntento: boolean
  modelo: string
}

/** Extrae el JSON entre el primer `{` y el último `}` (CLAUDE.md §11). */
export function extraerJSON(texto: string | undefined): unknown {
  if (!texto) return undefined
  const a = texto.indexOf('{')
  const b = texto.lastIndexOf('}')
  if (a === -1 || b <= a) return undefined
  try { return JSON.parse(texto.slice(a, b + 1)) } catch { return undefined }
}

/**
 * generateText + Output.object. Si la salida no valida: intenta extraer el JSON del texto
 * crudo; si tampoco valida, reintenta UNA vez la llamada (CLAUDE.md §11).
 */
export async function generarConEsquema<S extends z.ZodType>(params: {
  agente: Agente
  paso: 'analista' | 'sintetizador'
  schema: S
  instrucciones: string
  prompt: string
  signal?: AbortSignal
}): Promise<ResultadoGeneracion<z.infer<S>>> {
  const { agente, paso, schema, instrucciones, prompt, signal } = params
  const { model, settings, etiqueta } = resolverModelo(agente)
  const uso: UsoTokens = { entrada: 0, salida: 0 }
  let jsonInvalidoPrimerIntento = false

  for (let intento = 0; intento < 2; intento++) {
    try {
      const r = await generateText({
        model,
        instructions: instrucciones,
        prompt: intento === 0
          ? prompt
          : `${prompt}\n\nTu respuesta anterior no era un JSON válido según el esquema. Responde ÚNICAMENTE con el JSON, sin texto ni backticks.`,
        output: Output.object({ schema }),
        ...settings,
        maxRetries: 1,
        abortSignal: senalTimeout(signal),
      })
      uso.entrada += r.usage.inputTokens ?? 0
      uso.salida += r.usage.outputTokens ?? 0
      return { valor: r.output as z.infer<S>, uso, jsonInvalidoPrimerIntento, modelo: etiqueta }
    } catch (error) {
      if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
        throw new ErrorAgente(paso, 'timeout')
      }
      if (!NoObjectGeneratedError.isInstance(error)) throw new ErrorAgente(paso, 'proveedor')
      uso.entrada += error.usage?.inputTokens ?? 0
      uso.salida += error.usage?.outputTokens ?? 0
      const rescatado = schema.safeParse(extraerJSON(error.text))
      if (rescatado.success) {
        return { valor: rescatado.data, uso, jsonInvalidoPrimerIntento, modelo: etiqueta }
      }
      if (intento === 0) jsonInvalidoPrimerIntento = true
    }
  }
  throw new ErrorAgente(paso, 'json')
}

export function idSpotlight(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 12)
}

export interface Analisis {
  modelo: AnalisisOutput
  puntajes: Puntajes
  invalidadas: string[]
  calculado: ResultadoCalculado
  uso: UsoTokens
  jsonInvalidoPrimerIntento: boolean
  etiquetaModelo: string
}

/** Agente 2 + grounding + cálculo. Separado para que la evaluación pueda medirlo solo. */
export async function analizar(transcripcion: string, textosUsuario: string[], signal?: AbortSignal): Promise<Analisis> {
  const r = await generarConEsquema({
    agente: 'analista',
    paso: 'analista',
    schema: AnalisisOutputSchema,
    instrucciones: PROMPT_AGENTE_2,
    prompt: mensajeAgente2(transcripcion, idSpotlight()),
    signal,
  })
  const { puntajes, invalidadas } = aplicarGrounding(aplanarDimensiones(r.valor.dimensiones), textosUsuario)
  return {
    modelo: r.valor,
    puntajes,
    invalidadas,
    calculado: calcularResultado(puntajes),
    uso: r.uso,
    jsonInvalidoPrimerIntento: r.jsonInvalidoPrimerIntento,
    etiquetaModelo: r.modelo,
  }
}

export interface ResultadoPipeline {
  respuesta: DiagnosticoAPIResponse
  meta: {
    uso: UsoTokens
    puntajeTotal: number
    invalidadas: number
    modelos: string[]
  }
}

export async function ejecutarDiagnostico(params: {
  transcripcion: string
  textosUsuario: string[]
  manipulacion: boolean
  signal?: AbortSignal
}): Promise<ResultadoPipeline> {
  const analisis = await analizar(params.transcripcion, params.textosUsuario, params.signal)
  const { modelo, puntajes, calculado } = analisis
  const confianza = ajustarConfianza(modelo.confianza, analisis.invalidadas.length, params.manipulacion)
  const scores = ensamblarAnalisis({ modelo, puntajes, calculado, confianza, rubricaVersion: RUBRICA_VERSION })

  // El Agente 3 recibe el resultado calculado y las citas; no la transcripción completa.
  const datos = {
    municipio: modelo.municipio,
    nivel: { id: calculado.nivel_id, nombre: calculado.nivel_nombre, puntaje_total: calculado.puntaje_total, puntaje_maximo: 54 },
    dimensiones: calculado.dimensiones_resumen,
    dimension_mas_fuerte: calculado.dimension_mas_fuerte,
    dimension_mas_debil: calculado.dimension_mas_debil,
    preguntas: puntajes,
    gaps_de_informacion: scores.gaps_de_informacion,
    contexto_territorial: modelo.contexto_territorial,
  }
  const sintesis = await generarConEsquema({
    agente: 'sintetizador',
    paso: 'sintetizador',
    schema: SintesisOutputSchema,
    instrucciones: PROMPT_AGENTE_3,
    prompt: mensajeAgente3(datos, idSpotlight()),
    signal: params.signal,
  })

  return {
    respuesta: {
      resultado: ensamblarDiagnostico(modelo.municipio, calculado, sintesis.valor),
      scores,
    },
    meta: {
      uso: { entrada: analisis.uso.entrada + sintesis.uso.entrada, salida: analisis.uso.salida + sintesis.uso.salida },
      puntajeTotal: calculado.puntaje_total,
      invalidadas: analisis.invalidadas.length,
      modelos: [analisis.etiquetaModelo, sintesis.modelo],
    },
  }
}
