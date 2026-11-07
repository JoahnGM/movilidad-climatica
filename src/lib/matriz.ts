import type { DimensionId, IcebergId, NivelId } from './types'

export const PUNTAJE_MAXIMO = 54 as const

export const NIVELES: Record<NivelId, { min: number; max: number; nombre: string; iceberg: IcebergId; color: string }> = {
  nivel_1: { min: 0,  max: 13, nombre: 'Respuesta reactiva',                     iceberg: 'iceberg_1', color: '#EF4444' },
  nivel_2: { min: 14, max: 27, nombre: 'Reconocimiento parcial del problema',     iceberg: 'iceberg_2', color: '#F59E0B' },
  nivel_3: { min: 28, max: 40, nombre: 'Integración institucional en desarrollo', iceberg: 'iceberg_3', color: '#60A5FA' },
  nivel_4: { min: 41, max: 54, nombre: 'Gobernanza sistémica en consolidación',   iceberg: 'iceberg_4', color: '#2DD4BF' },
}

/**
 * Textos oficiales del iceberg (CLAUDE.md §4). Se usan EXACTAMENTE: el código los
 * inserta en el resultado y sobreescribe lo que diga el modelo. `npm run check:agentes`
 * verifica que sean idénticos a CLAUDE.md.
 */
export const ICEBERGS: Record<IcebergId, { capas_activas: string[]; texto_corto: string; texto_ampliado: string }> = {
  iceberg_1: {
    capas_activas: ['capa_1'],
    texto_corto: 'Tu territorio está abordando principalmente los efectos visibles del problema, pero todavía no cuenta con bases suficientes para intervenir sus causas estructurales.',
    texto_ampliado: 'Esto sugiere que la movilidad climática sigue siendo tratada principalmente como una consecuencia de emergencias o desastres, y no como un asunto que también requiere planeación, prevención, adaptación y coordinación interinstitucional.',
  },
  iceberg_2: {
    capas_activas: ['capa_1', 'capa_2'],
    texto_corto: 'Tu territorio comienza a reconocer que la movilidad climática responde a dinámicas recurrentes y no solo a emergencias aisladas, pero aún requiere mayor articulación institucional y programática.',
    texto_ampliado: 'Esto sugiere que el territorio ya ve parte del problema por debajo de la superficie, pero todavía necesita integrar mejor instrumentos, capacidades y respuestas.',
  },
  iceberg_3: {
    capas_activas: ['capa_1', 'capa_2', 'capa_3'],
    texto_corto: 'Tu territorio muestra avances importantes en la comprensión estructural del problema y ha comenzado a desarrollar una respuesta más integrada, aunque todavía enfrenta vacíos en implementación y consolidación.',
    texto_ampliado: 'Esto sugiere que el territorio ya no se queda solo en eventos o tendencias, sino que empieza a trabajar sobre condiciones institucionales y territoriales que explican la movilidad climática.',
  },
  iceberg_4: {
    capas_activas: ['capa_1', 'capa_2', 'capa_3', 'capa_4'],
    texto_corto: 'Tu territorio cuenta con bases sólidas para abordar la movilidad climática desde una perspectiva sistémica, preventiva e integrada. El desafío ahora es consolidar, sostener y profundizar esta gobernanza.',
    texto_ampliado: 'Esto sugiere que el territorio no solo responde a eventos ni identifica estructuras, sino que también ha avanzado en cambiar la forma en que entiende y prioriza el problema, incorporando adaptación, resiliencia, derechos y justicia climática.',
  },
}

export type PreguntaId =
  | 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6' | 'p7' | 'p8' | 'p9'
  | 'p10' | 'p11' | 'p12' | 'p13' | 'p14' | 'p15' | 'p16' | 'p17' | 'p18'

export const DIMENSIONES: { id: DimensionId; nombre: string; preguntas: PreguntaId[] }[] = [
  { id: 'd1_reconocimiento', nombre: 'Reconocimiento y enfoque del problema',      preguntas: ['p1','p2','p3'] },
  { id: 'd2_instrumentos',   nombre: 'Instrumentos de planeación y política',      preguntas: ['p4','p5','p6'] },
  { id: 'd3_capacidad',      nombre: 'Capacidad institucional y articulación',     preguntas: ['p7','p8','p9'] },
  { id: 'd4_informacion',    nombre: 'Información, datos y análisis territorial',  preguntas: ['p10','p11','p12'] },
  { id: 'd5_respuestas',     nombre: 'Respuestas y rutas de actuación',            preguntas: ['p13','p14','p15'] },
  { id: 'd6_equidad',        nombre: 'Equidad, participación y justicia climática', preguntas: ['p16','p17','p18'] },
]

export const PREGUNTAS: PreguntaId[] = DIMENSIONES.flatMap((d) => d.preguntas)

export const COLORES_ESTADO = {
  fortaleza:      { bg: '#2DD4BF20', border: '#2DD4BF', text: '#2DD4BF' },
  en_desarrollo:  { bg: '#60A5FA20', border: '#60A5FA', text: '#60A5FA' },
  brecha_critica: { bg: '#EF444420', border: '#EF4444', text: '#EF4444' },
}

export function getNivelFromPuntaje(puntaje: number): NivelId {
  const entrada = (Object.entries(NIVELES) as [NivelId, (typeof NIVELES)[NivelId]][])
    .find(([, v]) => puntaje >= v.min && puntaje <= v.max)
  return entrada?.[0] ?? 'nivel_1'
}
