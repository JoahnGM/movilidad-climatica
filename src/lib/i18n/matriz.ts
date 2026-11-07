/**
 * Nombres de niveles y dimensiones y textos del iceberg en el idioma de la UI.
 * Los textos OFICIALES están en español (src/lib/matriz.ts, CLAUDE.md §4) y son los que se
 * guardan en el resultado. Las versiones en inglés son traducciones NO oficiales para mostrar.
 */
import type { DimensionId, IcebergId, NivelId } from '@/lib/types'
import type { Idioma } from './idioma'

export const NIVELES_EN: Record<NivelId, string> = {
  nivel_1: 'Reactive response',
  nivel_2: 'Partial recognition of the problem',
  nivel_3: 'Institutional integration in progress',
  nivel_4: 'Systemic governance in consolidation',
}

export const DIMENSIONES_EN: Record<DimensionId, string> = {
  d1_reconocimiento: 'Recognition and framing of the problem',
  d2_instrumentos: 'Planning and policy instruments',
  d3_capacidad: 'Institutional capacity and coordination',
  d4_informacion: 'Information, data and territorial analysis',
  d5_respuestas: 'Responses and action pathways',
  d6_equidad: 'Equity, participation and climate justice',
}

export const ICEBERGS_EN: Record<IcebergId, { corto: string; ampliado: string }> = {
  iceberg_1: {
    corto: 'Your territory is mainly addressing the visible effects of the problem, but it does not yet have sufficient foundations to tackle its structural causes.',
    ampliado: 'This suggests that climate mobility is still treated mainly as a consequence of emergencies or disasters, and not as an issue that also requires planning, prevention, adaptation and inter-institutional coordination.',
  },
  iceberg_2: {
    corto: 'Your territory is beginning to recognize that climate mobility responds to recurring dynamics and not only to isolated emergencies, but it still needs greater institutional and programmatic coordination.',
    ampliado: 'This suggests that the territory already sees part of the problem below the surface, but still needs to better integrate instruments, capacities and responses.',
  },
  iceberg_3: {
    corto: 'Your territory shows significant progress in understanding the structural nature of the problem and has begun to develop a more integrated response, although it still faces gaps in implementation and consolidation.',
    ampliado: 'This suggests that the territory no longer focuses only on events or trends, but is beginning to work on the institutional and territorial conditions that explain climate mobility.',
  },
  iceberg_4: {
    corto: 'Your territory has solid foundations to address climate mobility from a systemic, preventive and integrated perspective. The challenge now is to consolidate, sustain and deepen this governance.',
    ampliado: 'This suggests that the territory not only responds to events or identifies structures, but has also advanced in changing how it understands and prioritizes the problem, incorporating adaptation, resilience, rights and climate justice.',
  },
}

export const nombreNivel = (id: NivelId, oficial: string, idioma: Idioma) => (idioma === 'en' ? NIVELES_EN[id] : oficial)
export const nombreDimension = (id: DimensionId, oficial: string, idioma: Idioma) => (idioma === 'en' ? DIMENSIONES_EN[id] : oficial)
export const textosIceberg = (id: IcebergId, corto: string, ampliado: string, idioma: Idioma) =>
  idioma === 'en' ? ICEBERGS_EN[id] : { corto, ampliado }
