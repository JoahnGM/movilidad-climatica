/**
 * Modo inglés del agente: el español no cambia ni un carácter; el inglés agrega solo una
 * directiva al final y marca la versión de rúbrica como no comparable.
 */
import { describe, expect, it } from 'vitest'
import { idiomaDeCookies, normalizarIdioma } from '@/lib/i18n/idioma'
import { PROMPT_AGENTE_1 } from '@/lib/prompts/agente-1'
import { PROMPT_AGENTE_2 } from '@/lib/prompts/agente-2'
import { PROMPT_AGENTE_3 } from '@/lib/prompts/agente-3'
import { conIdioma, versionRubrica } from '@/lib/prompts/idioma'
import { RUBRICA_VERSION } from '@/lib/prompts/version'

describe('conIdioma', () => {
  it('en español devuelve el prompt original idéntico', () => {
    expect(conIdioma(PROMPT_AGENTE_1, 'entrevistador', 'es')).toBe(PROMPT_AGENTE_1)
    expect(conIdioma(PROMPT_AGENTE_2, 'analista', 'es')).toBe(PROMPT_AGENTE_2)
    expect(conIdioma(PROMPT_AGENTE_3, 'sintetizador', 'es')).toBe(PROMPT_AGENTE_3)
  })

  it('en inglés conserva el prompt original como prefijo y agrega la directiva', () => {
    for (const [p, a] of [[PROMPT_AGENTE_1, 'entrevistador'], [PROMPT_AGENTE_2, 'analista'], [PROMPT_AGENTE_3, 'sintetizador']] as const) {
      const en = conIdioma(p, a, 'en')
      expect(en.startsWith(p)).toBe(true)
      expect(en.length).toBeGreaterThan(p.length)
    }
  })

  it('el entrevistador en inglés mantiene la etiqueta de cierre sin traducir', () => {
    expect(conIdioma(PROMPT_AGENTE_1, 'entrevistador', 'en')).toMatch(/termina exactamente con \[ENTREVISTA_COMPLETA\]/)
  })

  it('el analista en inglés no traduce las citas ni las marcas de puntaje 0', () => {
    const en = conIdioma(PROMPT_AGENTE_2, 'analista', 'en')
    expect(en).toMatch(/no las traduzcas/)
    expect(en).toMatch(/"No mencionado" o "No sabe"/)
  })

  it('el sintetizador en inglés no traduce los valores del esquema', () => {
    expect(conIdioma(PROMPT_AGENTE_3, 'sintetizador', 'en')).toMatch(/dimension, para_quien y urgencia NO se traducen/)
  })
})

describe('versionRubrica', () => {
  it('marca las corridas en inglés como no comparables', () => {
    expect(versionRubrica('es')).toBe(RUBRICA_VERSION)
    expect(versionRubrica('en')).toBe(`${RUBRICA_VERSION}+en`)
  })
})

describe('idioma desde cookies', () => {
  it('lee la cookie idioma y cae a español ante cualquier otro valor', () => {
    expect(idiomaDeCookies('a=1; idioma=en; b=2')).toBe('en')
    expect(idiomaDeCookies('idioma=es')).toBe('es')
    expect(idiomaDeCookies('idioma=fr')).toBe('es')
    expect(idiomaDeCookies('mi_idioma=en')).toBe('es')
    expect(idiomaDeCookies(null)).toBe('es')
    expect(normalizarIdioma(undefined)).toBe('es')
  })
})
