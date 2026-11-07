import { COOKIE_IDIOMA, type Idioma } from './idioma'

/** Guarda el idioma elegido (cookie de un año) y actualiza el atributo lang del documento. Solo en el navegador. */
export function guardarIdioma(idioma: Idioma): void {
  document.cookie = `${COOKIE_IDIOMA}=${idioma}; path=/; max-age=31536000; samesite=lax`
  document.documentElement.lang = idioma
}
