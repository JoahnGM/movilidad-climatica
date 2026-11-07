// Punto de entrada del contenido editorial. La UI importa desde '@/lib/contenido'.
// Estándar: docs/estandares/contenido-y-fuentes.md
export type * from './types'
export * from './fuentes'
export { CIFRAS, CIFRAS_PUBLICABLES, getCifra } from './cifras'
export { CIUDADES, HALLAZGO_CIUDADES, FUENTES_CONTEXTO_CIUDADES } from './ciudades'
export {
  OBLIGACIONES,
  GRUPOS_AFECTADOS,
  HITOS_LEGALES,
  PRINCIPIOS_RESPUESTA_JUSTA,
  MICROCOPY_DERECHOS,
  CORRECCIONES,
  NOTA_WAYUU,
  NOTA_MIGRANTES_VICHADA,
  FUENTES_DERECHOS,
} from './derechos'
export { EJEMPLOS } from './ejemplos'
export { GLOSARIO, DEFINICION_MOVILIDAD_CLIMATICA } from './glosario'
export { RECURSOS, GRUPOS_RECURSOS } from './recursos'
export { TEXTOS, getTexto } from './textos'
