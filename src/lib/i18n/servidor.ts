import { cookies } from 'next/headers'
import { COOKIE_IDIOMA, normalizarIdioma, type Idioma } from './idioma'

/** Idioma de la solicitud actual (server components y layouts). */
export async function obtenerIdioma(): Promise<Idioma> {
  return normalizarIdioma((await cookies()).get(COOKIE_IDIOMA)?.value)
}
