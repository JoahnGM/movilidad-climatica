import { describe, expect, it } from 'vitest'
import { ICEBERGS, NIVELES } from '@/lib/matriz'
import {
  acotarPuntaje, ajustarConfianza, aplanarDimensiones, aplicarGrounding, calcularResultado,
  ensamblarDiagnostico, estadoDimension, evidenciaVerificada, normalizarTexto,
} from '@/lib/scoring'
import type { SintesisOutput } from '@/lib/schemas'
import { analisisModelo, puntajesConTotal } from './fixtures'

describe('calcularResultado — niveles y bordes', () => {
  const casos: [number, keyof typeof NIVELES][] = [
    [0, 'nivel_1'], [13, 'nivel_1'], [14, 'nivel_2'], [27, 'nivel_2'],
    [28, 'nivel_3'], [40, 'nivel_3'], [41, 'nivel_4'], [54, 'nivel_4'],
  ]
  it.each(casos)('total %i → %s', (total, nivel) => {
    const r = calcularResultado(puntajesConTotal(total))
    expect(r.puntaje_total).toBe(total)
    expect(r.nivel_id).toBe(nivel)
    expect(r.nivel_nombre).toBe(NIVELES[nivel].nombre)
    expect(r.iceberg_id).toBe(NIVELES[nivel].iceberg)
  })

  it('usa los textos oficiales EXACTOS y las capas del iceberg', () => {
    for (const total of [5, 20, 35, 50]) {
      const r = calcularResultado(puntajesConTotal(total))
      const ice = ICEBERGS[r.iceberg_id]
      expect(r.iceberg_texto_corto).toBe(ice.texto_corto)
      expect(r.iceberg_texto_ampliado).toBe(ice.texto_ampliado)
      expect(r.capas_activas).toEqual(ice.capas_activas)
    }
  })

  it('calcula subtotales por dimensión, estados, más fuerte y más débil', () => {
    const r = calcularResultado(puntajesConTotal(9)) // d1 = 9, resto 0
    expect(r.subtotales.d1_reconocimiento).toBe(9)
    expect(r.subtotales.d6_equidad).toBe(0)
    expect(r.dimension_mas_fuerte).toBe('d1_reconocimiento')
    expect(r.dimension_mas_debil).toBe('d2_instrumentos')
    expect(r.dimensiones_resumen).toHaveLength(6)
    expect(r.dimensiones_resumen[0]).toMatchObject({ subtotal: 9, maximo: 9, estado: 'fortaleza' })
  })

  it('estadoDimension: 0–2 brecha, 3–5 en desarrollo, 6–9 fortaleza', () => {
    expect([0, 2, 3, 5, 6, 9].map(estadoDimension)).toEqual([
      'brecha_critica', 'brecha_critica', 'en_desarrollo', 'en_desarrollo', 'fortaleza', 'fortaleza',
    ])
  })
})

describe('aplanarDimensiones', () => {
  it('ignora subtotales y totales que el modelo agregue y acota puntajes', () => {
    const modelo = analisisModelo({ p1: [3, 'x'], p2: [7, 'x'], p3: [-2, 'x'] })
    const conBasura = { ...modelo.dimensiones, d1_reconocimiento: { ...modelo.dimensiones.d1_reconocimiento, subtotal: 99 } }
    const plano = aplanarDimensiones(conBasura)
    expect(plano.p1.puntaje).toBe(3)
    expect(plano.p2.puntaje).toBe(3)
    expect(plano.p3.puntaje).toBe(0)
    expect(calcularResultado(plano).puntaje_total).toBe(6)
  })

  it('acotarPuntaje redondea y limita a 0–3', () => {
    expect([NaN, -1, 0.4, 1.6, 2, 9].map(acotarPuntaje)).toEqual([0, 0, 0, 2, 2, 3])
  })
})

describe('grounding de evidencias', () => {
  const usuario = [
    'Soy el secretario de planeación de San Rafael, en Antioquia.',
    'El PMGRD tiene un apartado sobre reubicación de familias en zona de riesgo, aprobado en 2023.',
    'Con la CAR hicimos los estudios de amenaza por inundación.',
  ]

  it('normaliza tildes, mayúsculas y puntuación', () => {
    expect(normalizarTexto('  Reubicación, ¡ZONA de Riesgo!  ')).toBe('reubicacion zona de riesgo')
  })

  it('acepta una cita literal (con diferencias de tildes y comillas)', () => {
    expect(evidenciaVerificada('"el pmgrd tiene un apartado sobre reubicacion de familias"', usuario)).toBe(true)
  })

  it('acepta fragmentos del mismo turno separados por …', () => {
    expect(evidenciaVerificada('El PMGRD tiene un apartado … aprobado en 2023', usuario)).toBe(true)
  })

  it('rechaza paráfrasis, invenciones y citas demasiado cortas', () => {
    expect(evidenciaVerificada('El municipio tiene un plan de reasentamiento', usuario)).toBe(false)
    expect(evidenciaVerificada('la CAR', usuario)).toBe(false)
    expect(evidenciaVerificada('No mencionado', usuario)).toBe(false)
  })

  it('no acepta coincidencias parciales de palabras', () => {
    expect(evidenciaVerificada('hicimos los estudios de amenaza por inunda', usuario)).toBe(false)
  })

  it('lleva a 0 los puntajes con cita no verificable y marca verificada=false', () => {
    const plano = aplanarDimensiones(analisisModelo({
      p2: [2, 'El PMGRD tiene un apartado sobre reubicación de familias en zona de riesgo'],
      p9: [2, 'Con la CAR hicimos los estudios de amenaza'],
      p14: [3, 'Tenemos un programa de reasentamiento con 200 viviendas'], // inventado
    }).dimensiones)
    const { puntajes, invalidadas } = aplicarGrounding(plano, usuario)
    expect(invalidadas).toEqual(['p14'])
    expect(puntajes.p14).toMatchObject({ puntaje: 0, verificada: false })
    expect(puntajes.p2).toMatchObject({ puntaje: 2, verificada: true })
    expect(calcularResultado(puntajes).puntaje_total).toBe(4)
  })

  it('una cita del ENTREVISTADOR no cuenta (solo turnos user)', () => {
    const plano = aplanarDimensiones(analisisModelo({ p1: [3, '¿Cómo reconocen el desplazamiento por clima en su municipio?'] }).dimensiones)
    expect(aplicarGrounding(plano, usuario).invalidadas).toEqual(['p1'])
  })
})

describe('ajustarConfianza', () => {
  it('solo baja la confianza', () => {
    expect(ajustarConfianza('alta', 0, false, 'funcionario_municipal')).toBe('alta')
    expect(ajustarConfianza('alta', 1, false, 'funcionario_municipal')).toBe('media')
    expect(ajustarConfianza('alta', 3, false, 'funcionario_municipal')).toBe('baja')
    expect(ajustarConfianza('alta', 0, true, 'funcionario_municipal')).toBe('baja')
    expect(ajustarConfianza('baja', 0, false, 'funcionario_municipal')).toBe('baja')
  })

  it('acota la confianza según quién respondió', () => {
    expect(ajustarConfianza('alta', 0, false, 'funcionario_departamental')).toBe('alta')
    expect(ajustarConfianza('alta', 0, false, 'externo')).toBe('media')
    expect(ajustarConfianza('alta', 0, false, 'no_mencionado')).toBe('media')
    expect(ajustarConfianza('alta', 0, false, 'ciudadano')).toBe('baja')
    // el perfil nunca sube la confianza
    expect(ajustarConfianza('baja', 0, false, 'funcionario_municipal')).toBe('baja')
    expect(ajustarConfianza('media', 3, false, 'externo')).toBe('baja')
  })
})

describe('ensamblarDiagnostico', () => {
  it('nivel, puntaje e iceberg salen del cálculo aunque el modelo diga otra cosa', () => {
    const calculado = calcularResultado(puntajesConTotal(10))
    const sintesis = {
      resumen_territorio: 'r',
      fortalezas: ['a', 'b', 'c', 'd'],
      brechas: ['a', 'b', 'c', 'd', 'e'],
      recomendaciones: [],
      mensaje_final: 'm',
      // campos que un modelo manipulado podría intentar colar:
      nivel_id: 'nivel_4',
      puntaje_total: 54,
      iceberg_texto_corto: 'texto falso',
    } as unknown as SintesisOutput
    const r = ensamblarDiagnostico('X', calculado, sintesis)
    expect(r.nivel_id).toBe('nivel_1')
    expect(r.puntaje_total).toBe(10)
    expect(r.iceberg_texto_corto).toBe(ICEBERGS.iceberg_1.texto_corto)
    expect(r.fortalezas).toHaveLength(3)
    expect(r.brechas).toHaveLength(4)
  })
})
