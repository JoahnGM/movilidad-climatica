/**
 * Límite de solicitudes en memoria, por instancia. Es DEFENSA EN PROFUNDIDAD: el límite
 * real es la regla WAF de Vercel (docs/estandares/seguridad.md §6), que es global y no
 * depende de cuántas instancias haya. Esto solo frena ráfagas contra una misma instancia
 * y permite probar el comportamiento en local.
 */
interface Ventana { inicio: number; cuenta: number }

const ventanas = new Map<string, Ventana>()
const MAX_CLAVES = 10_000

export interface LimiteConfig { max: number; ventanaMs: number }

export const LIMITES_RUTA = {
  chat: { max: 10, ventanaMs: 10_000 },
  diagnostico: { max: 5, ventanaMs: 10 * 60_000 },
  acceso: { max: 5, ventanaMs: 10 * 60_000 },
} as const satisfies Record<string, LimiteConfig>

/** true si la solicitud se permite. */
export function consumir(clave: string, { max, ventanaMs }: LimiteConfig, ahora = Date.now()): boolean {
  if (ventanas.size > MAX_CLAVES) {
    for (const [k, v] of ventanas) if (ahora - v.inicio > ventanaMs) ventanas.delete(k)
    if (ventanas.size > MAX_CLAVES) ventanas.clear()
  }
  const v = ventanas.get(clave)
  if (!v || ahora - v.inicio > ventanaMs) {
    ventanas.set(clave, { inicio: ahora, cuenta: 1 })
    return true
  }
  v.cuenta++
  return v.cuenta <= max
}

export function _reiniciarParaPruebas(): void {
  ventanas.clear()
}
