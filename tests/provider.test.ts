import { afterEach, describe, expect, it } from 'vitest'
import { proveedorActivo, resolverModelo } from '@/lib/ai/provider'

const env = { ...process.env }
afterEach(() => { process.env = { ...env } })

function limpiar() {
  for (const k of ['AI_PROVIDER', 'AI_GATEWAY_API_KEY', 'VERCEL_OIDC_TOKEN', 'AI_MODEL_ENTREVISTADOR', 'AI_MODEL_ANALISTA', 'AI_MODEL_SINTETIZADOR', 'AI_GATEWAY_PROVIDERS']) delete process.env[k]
  process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'clave-de-prueba'
}

describe('resolverModelo', () => {
  it('por defecto usa Gemini directo con los modelos fijados', () => {
    limpiar()
    expect(proveedorActivo()).toBe('gemini')
    expect(resolverModelo('entrevistador').etiqueta).toBe('google:gemini-3-flash-preview')
    expect(resolverModelo('analista').etiqueta).toBe('google:gemini-3-flash-preview')
    expect(resolverModelo('sintetizador').etiqueta).toBe('google:gemini-3.1-pro-preview')
  })

  it('en Vercel (VERCEL_OIDC_TOKEN) Gemini sigue directo, no por el gateway', () => {
    limpiar()
    process.env.VERCEL_OIDC_TOKEN = 'token'
    expect(resolverModelo('analista').etiqueta).toBe('google:gemini-3-flash-preview')
    expect(resolverModelo('analista').settings.providerOptions).toBeUndefined()
  })

  it('Gemini por el gateway solo con AI_GATEWAY_API_KEY, y siempre con ZDR', () => {
    limpiar()
    process.env.AI_GATEWAY_API_KEY = 'gw'
    const r = resolverModelo('analista')
    expect(r.etiqueta).toBe('gateway:google/gemini-3-flash')
    expect(r.settings.providerOptions?.gateway.zeroDataRetention).toBe(true)
  })

  it('DeepSeek (opcional) va siempre por el gateway con ZDR y proveedores restringidos', () => {
    limpiar()
    process.env.AI_PROVIDER = 'deepseek'
    const r = resolverModelo('entrevistador')
    expect(r.etiqueta).toBe('gateway:deepseek/deepseek-v4.1-flash-1017')
    expect(r.settings.providerOptions?.gateway).toMatchObject({ zeroDataRetention: true, only: expect.arrayContaining(['baseten']) })
    expect(r.settings.providerOptions?.gateway.only).not.toContain('alibaba')
  })

  it('topes de salida y razonamiento por agente', () => {
    limpiar()
    expect(resolverModelo('entrevistador').settings).toMatchObject({ maxOutputTokens: 600, reasoning: 'none' })
    expect(resolverModelo('analista').settings).toMatchObject({ maxOutputTokens: 4_000, reasoning: 'low' })
  })
})
