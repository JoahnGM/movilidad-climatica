import { describe, expect, it } from 'vitest'
import { AnalisisOutputSchema, ChatRequestSchema, SintesisOutputSchema } from '@/lib/schemas'
import { analisisModelo } from './fixtures'

describe('AnalisisOutputSchema', () => {
  it('acepta una salida válida', () => {
    expect(AnalisisOutputSchema.safeParse(analisisModelo()).success).toBe(true)
  })

  it.each([4, -1, 2.5, '3', null])('rechaza puntaje %j', (puntaje) => {
    const m = analisisModelo() as unknown as { dimensiones: { d1_reconocimiento: { p1: { puntaje: unknown } } } }
    m.dimensiones.d1_reconocimiento.p1.puntaje = puntaje
    expect(AnalisisOutputSchema.safeParse(m).success).toBe(false)
  })

  it('rechaza si falta una pregunta', () => {
    const m = analisisModelo() as unknown as { dimensiones: { d6_equidad: Record<string, unknown> } }
    delete m.dimensiones.d6_equidad.p18
    expect(AnalisisOutputSchema.safeParse(m).success).toBe(false)
  })

  it('perfil_entrevistado: acepta el catálogo, rechaza otros y por defecto es no_mencionado', () => {
    expect(AnalisisOutputSchema.parse({ ...analisisModelo(), perfil_entrevistado: 'ciudadano' }).perfil_entrevistado).toBe('ciudadano')
    expect(AnalisisOutputSchema.safeParse({ ...analisisModelo(), perfil_entrevistado: 'alcalde' }).success).toBe(false)
    const sinPerfil = { ...analisisModelo() } as Record<string, unknown>
    delete sinPerfil.perfil_entrevistado
    expect(AnalisisOutputSchema.parse(sinPerfil).perfil_entrevistado).toBe('no_mencionado')
  })

  it('descarta campos extra como puntaje_total o nivel_id', () => {
    const r = AnalisisOutputSchema.parse({ ...analisisModelo(), puntaje_total: 54, nivel_id: 'nivel_4' })
    expect(r).not.toHaveProperty('puntaje_total')
    expect(r).not.toHaveProperty('nivel_id')
  })
})

describe('SintesisOutputSchema', () => {
  const rec = {
    dimension: 'd2_instrumentos', area: 'Instrumentos', accion: 'a', primer_paso: 'p', siguiente_paso: 's',
    ruta_ampliada: 'r', para_quien: 'todos', urgencia: 'inmediata',
  }
  const base = { resumen_territorio: 'r', fortalezas: [], brechas: [], recomendaciones: [rec], mensaje_final: 'm' }

  it('acepta rutas progresivas', () => {
    expect(SintesisOutputSchema.safeParse(base).success).toBe(true)
  })

  it('rechaza para_quien o urgencia fuera del catálogo', () => {
    expect(SintesisOutputSchema.safeParse({ ...base, recomendaciones: [{ ...rec, para_quien: 'grandes' }] }).success).toBe(false)
    expect(SintesisOutputSchema.safeParse({ ...base, recomendaciones: [{ ...rec, urgencia: 'ya' }] }).success).toBe(false)
  })

  it('exige al menos una recomendación', () => {
    expect(SintesisOutputSchema.safeParse({ ...base, recomendaciones: [] }).success).toBe(false)
  })
})

describe('ChatRequestSchema', () => {
  const msg = (role: string) => ({ id: '1', role, parts: [{ type: 'text', text: 'hola' }] })
  it('acepta user y assistant', () => {
    expect(ChatRequestSchema.safeParse({ messages: [msg('assistant'), msg('user')] }).success).toBe(true)
  })
  it.each(['system', 'tool', 'developer', 'data'])('rechaza rol %s', (role) => {
    expect(ChatRequestSchema.safeParse({ messages: [msg(role), msg('user')] }).success).toBe(false)
  })
})
