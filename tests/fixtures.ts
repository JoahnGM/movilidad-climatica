import { PREGUNTAS, type PreguntaId } from '@/lib/matriz'
import type { Puntajes } from '@/lib/scoring'
import type { AnalisisOutput } from '@/lib/schemas'

/** Construye 18 puntajes que suman `total` (llenando de p1 en adelante con 3s). */
export function puntajesConTotal(total: number, evidencia = 'No mencionado'): Puntajes {
  const r = {} as Puntajes
  let resto = total
  for (const p of PREGUNTAS) {
    const v = Math.min(3, Math.max(0, resto)) as 0 | 1 | 2 | 3
    resto -= v
    r[p] = { puntaje: v, evidencia }
  }
  return r
}

export function analisisModelo(valores: Partial<Record<PreguntaId, [number, string]>> = {}): AnalisisOutput {
  const item = (p: PreguntaId) => {
    const [puntaje, evidencia] = valores[p] ?? [0, 'No mencionado']
    return { puntaje, evidencia }
  }
  return {
    municipio: 'Municipio de Prueba',
    dimensiones: {
      d1_reconocimiento: { p1: item('p1'), p2: item('p2'), p3: item('p3') },
      d2_instrumentos: { p4: item('p4'), p5: item('p5'), p6: item('p6') },
      d3_capacidad: { p7: item('p7'), p8: item('p8'), p9: item('p9') },
      d4_informacion: { p10: item('p10'), p11: item('p11'), p12: item('p12') },
      d5_respuestas: { p13: item('p13'), p14: item('p14'), p15: item('p15') },
      d6_equidad: { p16: item('p16'), p17: item('p17'), p18: item('p18') },
    },
    confianza: 'alta',
    gaps_de_informacion: [],
    contexto_territorial: { riesgos_principales: [], categoria_municipal: 'no_mencionada', pdet: 'no_mencionado' },
    perfil_entrevistado: 'funcionario_municipal',
  }
}
