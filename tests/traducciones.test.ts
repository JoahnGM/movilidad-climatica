/** Todo el contenido verificado que muestra el home tiene traducción al inglés (si no, la UI caería al español sin aviso). */
import { describe, expect, it } from 'vitest'
import { CIUDADES, DEFINICION_MOVILIDAD_CLIMATICA, HALLAZGO_CIUDADES, getCifra, getTexto } from '@/lib/contenido'
import { EJEMPLO_DIAGNOSTICO } from '@/lib/contenido/ejemplo-resultado'
import { EJEMPLO_DIAGNOSTICO_EN, EJEMPLO_SCORES_EN, TRADUCCIONES_EN } from '@/lib/contenido/traducciones/en'

const CAMPOS = ['contexto', 'riesgos', 'marcos', 'respuestas', 'brechas'] as const
/** Cifras que muestra ContextSection. */
const CIFRAS_HOME = ['idmc-colombia-desastres-2025', 'idmc-colombia-desastres-2024', 'idmc-colombia-desastres-2023', 'idmc-definicion-desplazamientos']

describe('traducciones al inglés', () => {
  it('cada afirmación publicable de las ciudades y su mensaje clave', () => {
    const faltan = CIUDADES.flatMap((c) => [
      ...CAMPOS.flatMap((k) => c[k].filter((a) => a.publicable !== false).map((a) => a.texto)),
      c.mensajeClave.texto,
    ]).filter((t) => !TRADUCCIONES_EN[t])
    expect(faltan).toEqual([])
  })

  it('hallazgo, definición, cifras del home y alcance', () => {
    const textos = [
      HALLAZGO_CIUDADES[0].texto,
      DEFINICION_MOVILIDAD_CLIMATICA,
      ...CIFRAS_HOME.flatMap((id) => {
        const c = getCifra(id)
        return [c.definicion, ...(c.unidad ? [c.unidad] : []), ...(id === 'idmc-definicion-desplazamientos' ? [c.valor] : [])]
      }),
      getTexto('alcance').cuerpo.replace('[Ver evidencia por pregunta]', '').trim(),
    ]
    expect(textos.filter((t) => !TRADUCCIONES_EN[t])).toEqual([])
  })

  it('el ejemplo en inglés conserva los números, el nivel y el iceberg del original', () => {
    expect(EJEMPLO_DIAGNOSTICO_EN.puntaje_total).toBe(EJEMPLO_DIAGNOSTICO.puntaje_total)
    expect(EJEMPLO_DIAGNOSTICO_EN.nivel_id).toBe(EJEMPLO_DIAGNOSTICO.nivel_id)
    expect(EJEMPLO_DIAGNOSTICO_EN.iceberg_id).toBe(EJEMPLO_DIAGNOSTICO.iceberg_id)
    expect(EJEMPLO_DIAGNOSTICO_EN.dimensiones_resumen).toEqual(EJEMPLO_DIAGNOSTICO.dimensiones_resumen)
    expect(EJEMPLO_DIAGNOSTICO_EN.recomendaciones.map((r) => r.urgencia)).toEqual(EJEMPLO_DIAGNOSTICO.recomendaciones.map((r) => r.urgencia))
  })

  it('las evidencias del ejemplo en inglés siguen marcadas como ficticias', () => {
    const evidencias = Object.values(EJEMPLO_SCORES_EN.dimensiones).flatMap((d) =>
      Object.values(d).filter((v): v is { puntaje: number; evidencia: string } => typeof v === 'object' && v !== null && 'evidencia' in v),
    )
    for (const e of evidencias) expect(e.puntaje === 0 ? /^No (mencionado|sabe)$/.test(e.evidencia) : e.evidencia.startsWith('[FICTITIOUS]')).toBe(true)
  })
})
