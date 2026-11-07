/**
 * Detección de intentos de manipulación en los turnos del funcionario.
 * Regla: docs/estandares/seguridad.md (anti-manipulación). Solo se aplica a turnos `user`.
 * Los patrones son frases, no palabras sueltas, para no bloquear respuestas legítimas
 * ("ignoramos cuántas familias…", "el máximo riesgo…").
 */

export const TAG_CIERRE = '[ENTREVISTA_COMPLETA]'

const TAG_CIERRE_RE = /\[\s*ENTREVISTA[_\s-]*COMPLETA\s*\]/gi

export const PATRONES_MANIPULACION: { id: string; re: RegExp }[] = [
  { id: 'tag_cierre', re: /\[\s*ENTREVISTA[_\s-]*COMPLETA\s*\]/i },
  { id: 'marca_spotlight', re: /<<<?\s*\/?\s*(TRANSCRIPCION|DATOS)_(INICIO|FIN)/i },
  { id: 'ignorar_instrucciones', re: /\b(ignora|ignore|ignoren|olvida|olvide|olviden|omite|omita|desobedece|descarta)\s+((todas?|todo)\s+)?(lo\s+anterior|(las|tus|los|sus|cualquier)\s+(\w+\s+)?(instrucciones|reglas|indicaciones|[oó]rdenes|restricciones|prompt))/i },
  { id: 'ignore_en', re: /\b(ignore|disregard|forget)\s+(all\s+|any\s+|the\s+|your\s+)?(previous|prior|above|earlier)?\s*(instructions|rules|prompt)/i },
  { id: 'pedir_puntaje', re: /\b(ponme|ponnos|ponle|p[oó]ngame|p[oó]nganos|as[ií]gname|as[ií]gnanos|dame|danos|denme|calif[ií]came|calif[ií]canos|punt[uú]ame|punt[uú]anos|pon|ponga|pongan|asigna|asigne|otorga)\s+(un\s+|una\s+|el\s+|la\s+)?(3|tres)\s+(en|a|puntos?\s+en|de\s+puntaje)\s/i },
  { id: 'pedir_puntaje_alto', re: /\b(ponme|ponnos|ponle|p[oó]ngame|p[oó]nganos|as[ií]gname|as[ií]gnanos|dame|danos|denme|calif[ií]came|calif[ií]canos|punt[uú]ame|punt[uú]anos)\s+(el\s+|la\s+|un\s+|una\s+)?(puntaje|puntuaci[oó]n|calificaci[oó]n|nota|nivel)\s+(m[aá]xim|m[aá]s\s+alt|4\b|cuatro)/i },
  { id: 'puntaje_maximo', re: /\b(puntaje|puntuaci[oó]n|calificaci[oó]n|nota)\s+(m[aá]xim[oa]|perfect[oa]|completa|de\s+54|54)\b/i },
  { id: 'nivel_forzado', re: /\b(nivel_[1-4]|iceberg_[1-4]|nivel\s+4\s+en\s+todo|3\s+en\s+(todas|todo|cada))/i },
  { id: 'cambio_rol', re: /\b(eres(\s+ahora)?|act[uú]a\s+como|ahora\s+eres|finge\s+(ser|que\s+eres)|a\s+partir\s+de\s+ahora\s+eres)\s+(el\s+|un\s+|una\s+)?(analista|evaluador|sistema|sintetizador|administrador|modelo|asistente\s+sin)/i },
  { id: 'prompt_sistema', re: /\b(system\s*prompt|prompt\s+(del\s+)?sistema|mensaje\s+de\s+sistema|instrucciones\s+(del\s+)?sistema|modo\s+desarrollador|developer\s+mode|jailbreak)\b/i },
  { id: 'rol_falso_inline', re: /^\s*(system|sistema|assistant|ENTREVISTADOR)\s*:/im },
]

export interface ResultadoManipulacion {
  detectada: boolean
  patrones: string[]
}

export function detectarManipulacion(textosUsuario: string[]): ResultadoManipulacion {
  const patrones = new Set<string>()
  for (const texto of textosUsuario) {
    for (const { id, re } of PATRONES_MANIPULACION) {
      if (re.test(texto)) patrones.add(id)
    }
  }
  return { detectada: patrones.size > 0, patrones: [...patrones] }
}

/** Elimina el tag de cierre de un texto. Solo el servidor (Agente 1) puede emitirlo. */
export function quitarTagCierre(texto: string): string {
  return texto.replace(TAG_CIERRE_RE, '').trim()
}
