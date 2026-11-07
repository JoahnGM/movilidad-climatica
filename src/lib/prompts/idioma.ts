import type { Idioma } from '../i18n/idioma'
import { RUBRICA_VERSION } from './version'

/**
 * Directivas de idioma para los agentes. En español NO se agrega nada: los prompts quedan
 * idénticos a los validados con el golden set. En inglés se agrega una directiva al final.
 * El modo inglés es experimental: la rúbrica y sus anclas se validaron en español.
 */
const DIRECTIVAS_EN = {
  entrevistador: `

IDIOMA DE LA ENTREVISTA: INGLÉS
- El funcionario eligió el sitio en inglés. Conduce TODA la entrevista en inglés claro y sencillo,
  con el mismo tono profesional, empático y cercano, y las mismas reglas de arriba.
- Conserva los nombres de instrumentos y entidades colombianas (POT, PMGRD, CMGRD, CAR, UNGRD,
  IDEAM) y explícalos en pocas palabras la primera vez que aparezcan.
- Si el funcionario escribe en español, continúa en español.
- La etiqueta de cierre NO se traduce: termina exactamente con [ENTREVISTA_COMPLETA].`,
  analista: `

IDIOMA: la entrevista puede estar en inglés. Usa la misma escala, los mismos criterios y las
mismas anclas (están en español, pero aplican igual a respuestas en inglés).
- Las citas de evidencia se copian TEXTUALMENTE en el idioma en que se dijeron: no las traduzcas.
- Para puntaje 0 usa exactamente "No mencionado" o "No sabe" (son marcas del sistema).
- Escribe gaps_de_informacion en inglés.`,
  sintetizador: `

IDIOMA DE SALIDA: INGLÉS
- Escribe resumen_territorio, fortalezas, brechas, mensaje_final y, en cada recomendación, area,
  accion, primer_paso, siguiente_paso y ruta_ampliada en inglés claro.
- Los valores de dimension, para_quien y urgencia NO se traducen: usa exactamente los valores
  permitidos del esquema.
- Conserva los nombres de instrumentos y entidades colombianas (POT, PMGRD, CMGRD).`,
} as const

export type AgenteConIdioma = keyof typeof DIRECTIVAS_EN

/** Prompt del agente en el idioma pedido (en español, el prompt original sin cambios). */
export function conIdioma(prompt: string, agente: AgenteConIdioma, idioma: Idioma): string {
  return idioma === 'en' ? prompt + DIRECTIVAS_EN[agente] : prompt
}

/** Versión de rúbrica que se guarda en el resultado: las corridas en inglés no son comparables. */
export function versionRubrica(idioma: Idioma): string {
  return idioma === 'en' ? `${RUBRICA_VERSION}+en` : RUBRICA_VERSION
}
