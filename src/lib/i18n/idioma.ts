/** Idiomas del sitio. El español es la fuente; el inglés es una traducción. */
export type Idioma = 'es' | 'en'

export const IDIOMAS: readonly Idioma[] = ['es', 'en']

/** Cookie que fija el toggle de idioma; la leen las páginas y las rutas de IA. */
export const COOKIE_IDIOMA = 'idioma'

export function normalizarIdioma(valor: string | null | undefined): Idioma {
  return valor === 'en' ? 'en' : 'es'
}

/** Idioma a partir de la cabecera Cookie de una solicitud (rutas de API). */
export function idiomaDeCookies(cabecera: string | null | undefined): Idioma {
  const m = cabecera?.match(new RegExp(`(?:^|;\\s*)${COOKIE_IDIOMA}=([^;]+)`))
  return normalizarIdioma(m?.[1])
}
