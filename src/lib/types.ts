export type NivelId = 'nivel_1' | 'nivel_2' | 'nivel_3' | 'nivel_4'
export type IcebergId = 'iceberg_1' | 'iceberg_2' | 'iceberg_3' | 'iceberg_4'
export type DimensionId = 'd1_reconocimiento' | 'd2_instrumentos' | 'd3_capacidad' | 'd4_informacion' | 'd5_respuestas' | 'd6_equidad'
export type UrgenciaType = 'inmediata' | 'corto_plazo' | 'mediano_plazo'
export type EstadoDimension = 'fortaleza' | 'en_desarrollo' | 'brecha_critica'

export interface PreguntaScore {
  puntaje: 0 | 1 | 2 | 3
  evidencia: string
}

export interface DimensionScore {
  p1?: PreguntaScore; p2?: PreguntaScore; p3?: PreguntaScore
  p4?: PreguntaScore; p5?: PreguntaScore; p6?: PreguntaScore
  p7?: PreguntaScore; p8?: PreguntaScore; p9?: PreguntaScore
  p10?: PreguntaScore; p11?: PreguntaScore; p12?: PreguntaScore
  p13?: PreguntaScore; p14?: PreguntaScore; p15?: PreguntaScore
  p16?: PreguntaScore; p17?: PreguntaScore; p18?: PreguntaScore
  subtotal: number
}

export interface AnalisisResult {
  municipio: string
  dimensiones: {
    d1_reconocimiento: DimensionScore
    d2_instrumentos: DimensionScore
    d3_capacidad: DimensionScore
    d4_informacion: DimensionScore
    d5_respuestas: DimensionScore
    d6_equidad: DimensionScore
  }
  puntaje_total: number
  confianza: 'alta' | 'media' | 'baja'
  dimension_mas_fuerte: DimensionId
  dimension_mas_debil: DimensionId
  gaps_de_informacion: string[]
}

export interface DimensionResumen {
  id: DimensionId
  nombre: string
  subtotal: number
  maximo: number
  estado: EstadoDimension
}

export interface Recomendacion {
  dimension: DimensionId
  area: string
  accion: string
  urgencia: UrgenciaType
}

export interface DiagnosticoResult {
  municipio: string
  nivel_id: NivelId
  nivel_nombre: string
  iceberg_id: IcebergId
  puntaje_total: number
  puntaje_maximo: 54
  capas_activas: string[]
  iceberg_texto_corto: string
  iceberg_texto_ampliado: string
  resumen_territorio: string
  dimensiones_resumen: DimensionResumen[]
  fortalezas: string[]
  brechas: string[]
  recomendaciones: Recomendacion[]
  mensaje_final: string
}

export interface DiagnosticoAPIResponse {
  resultado: DiagnosticoResult
  scores: AnalisisResult
}
