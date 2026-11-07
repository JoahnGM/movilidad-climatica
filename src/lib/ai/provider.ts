/**
 * Cliente de modelo por agente (ADR docs/decisiones/2026-11-06-proveedor-ia-gateway-zdr.md).
 *
 * AI_PROVIDER=gemini (por defecto) → Gemini directo con GOOGLE_GENERATIVE_AI_API_KEY en
 *   NIVEL GRATUITO (decisión del equipo, 2026-11-06): Google puede usar los prompts para
 *   mejorar sus productos y las cuotas son por proyecto y por modelo (~20 solicitudes/día).
 *   Solo pasa por AI Gateway (con ZDR) si se define AI_GATEWAY_API_KEY explícitamente.
 * AI_PROVIDER=deepseek → implementado pero NO adoptado (decisión del equipo, 2026-11-06):
 *   siempre vía Vercel AI Gateway con zeroDataRetention y solo proveedores de EE.UU. con
 *   ZDR. Nunca la API oficial de DeepSeek.
 */
import { createGateway, type LanguageModel } from 'ai'
import { createGoogle } from '@ai-sdk/google'

export type Agente = 'entrevistador' | 'analista' | 'sintetizador'
export type ProveedorId = 'deepseek' | 'gemini'
type Razonamiento = 'none' | 'low' | 'medium' | 'high'

interface ConfigAgente {
  modelo: string
  razonamiento: Razonamiento
  maxOutputTokens: number
  temperature?: number
}

/**
 * Modelos fijados a una versión con fecha: un alias que cambia por debajo rompe la
 * comparabilidad de puntajes. Cambiar un modelo exige correr el golden set
 * (docs/estandares/agentes-ia.md §6).
 */
const MODELOS: Record<ProveedorId, { gateway: Record<Agente, string>; directo?: Record<Agente, string> }> = {
  deepseek: {
    gateway: {
      entrevistador: 'deepseek/deepseek-v4.1-flash-1017',
      analista: 'deepseek/deepseek-v4.1-flash-1017',
      sintetizador: 'deepseek/deepseek-v4.1-flash-1017',
    },
  },
  gemini: {
    gateway: {
      entrevistador: 'google/gemini-3-flash',
      analista: 'google/gemini-3-flash',
      sintetizador: 'google/gemini-3.1-pro-preview',
    },
    // Nivel gratuito: gemini-3.1-pro no tiene cuota (0) y la cuota diaria es por modelo, así
    // que el chat y el diagnóstico usan modelos distintos para no bloquearse entre sí.
    // gemini-3.5-flash es el analista con la evaluación más completa (eval/resultados/).
    directo: {
      entrevistador: 'gemini-3-flash-preview',
      analista: 'gemini-3.5-flash',
      sintetizador: 'gemini-3.5-flash',
    },
  },
}

const PARAMETROS: Record<Agente, Omit<ConfigAgente, 'modelo'>> = {
  // Sin razonamiento: con thinking el primer token tarda ~50 s (informe 02 §1).
  entrevistador: { razonamiento: 'none', maxOutputTokens: 600, temperature: 0.7 },
  // Los tokens de razonamiento cuentan dentro de maxOutputTokens: con 2.000–2.500 el JSON se
  // truncaba (finishReason "length") en Gemini. 4.000 sigue siendo un tope duro (~USD 0,005 por llamada).
  analista: { razonamiento: 'low', maxOutputTokens: 4_000 },
  sintetizador: { razonamiento: 'low', maxOutputTokens: 4_000 },
}

/** Proveedores de inferencia permitidos en el gateway para DeepSeek: EE.UU./UE con ZDR. */
const PROVEEDORES_ZDR_DEEPSEEK = ['baseten', 'fireworks', 'togetherai', 'digitalocean', 'parasail']

export const TIMEOUT_LLM_MS = 25_000

export function proveedorActivo(): ProveedorId {
  return process.env.AI_PROVIDER === 'deepseek' ? 'deepseek' : 'gemini'
}

// Gemini solo usa el gateway si se pide con AI_GATEWAY_API_KEY. No se usa VERCEL_OIDC_TOKEN
// como señal: existe en todos los despliegues de Vercel y desviaría Gemini al gateway sin créditos.
const usaGateway = (p: ProveedorId) => p === 'deepseek' || Boolean(process.env.AI_GATEWAY_API_KEY)

function listaEnv(nombre: string): string[] | undefined {
  const v = process.env[nombre]?.split(',').map((s) => s.trim()).filter(Boolean)
  return v && v.length > 0 ? v : undefined
}

export interface ModeloResuelto {
  model: LanguageModel
  /** Para logs: proveedor y modelo, nunca la clave. */
  etiqueta: string
  settings: {
    maxOutputTokens: number
    temperature?: number
    reasoning: Razonamiento
    providerOptions?: { gateway: { zeroDataRetention: true; only?: string[]; order?: string[] } }
  }
}

export function resolverModelo(agente: Agente): ModeloResuelto {
  const proveedor = proveedorActivo()
  const params = PARAMETROS[agente]
  const override = process.env[`AI_MODEL_${agente.toUpperCase()}`]

  if (usaGateway(proveedor)) {
    const id = override || MODELOS[proveedor].gateway[agente]
    const only = listaEnv('AI_GATEWAY_PROVIDERS') ?? (proveedor === 'deepseek' ? PROVEEDORES_ZDR_DEEPSEEK : undefined)
    const gw = createGateway({ apiKey: process.env.AI_GATEWAY_API_KEY })
    return {
      model: gw(id),
      etiqueta: `gateway:${id}`,
      settings: {
        maxOutputTokens: params.maxOutputTokens,
        temperature: params.temperature,
        reasoning: params.razonamiento,
        providerOptions: { gateway: { zeroDataRetention: true, ...(only ? { only, order: only } : {}) } },
      },
    }
  }

  const id = override || MODELOS.gemini.directo![agente]
  const google = createGoogle({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY })
  return {
    model: google(id),
    etiqueta: `google:${id}`,
    settings: {
      maxOutputTokens: params.maxOutputTokens,
      temperature: params.temperature,
      reasoning: params.razonamiento,
    },
  }
}

/** Señal de corte: 25 s por llamada, encadenada con la del request si existe. */
export function senalTimeout(req?: AbortSignal): AbortSignal {
  const t = AbortSignal.timeout(TIMEOUT_LLM_MS)
  return req ? AbortSignal.any([req, t]) : t
}
