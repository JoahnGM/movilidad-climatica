/**
 * Piloto cerrado con código de acceso (ACCESS_MODE=passcode). Usado por src/proxy.ts y
 * /api/acceso. Solo depende de `jose` y Web Crypto para funcionar en cualquier runtime.
 *
 * ACCESS_CODES = "CODIGO1:etiqueta opcional,CODIGO2,…"
 * El JWT NO contiene el código ni la etiqueta: solo un hash corto del código (`sub`),
 * que sirve como clave de rate limit y permite revocar quitando el código de la lista.
 */
import { SignJWT, jwtVerify } from 'jose'

export const COOKIE_ACCESO = 'mc_acceso'
export const DURACION_ACCESO_S = 7 * 24 * 60 * 60

export function modoAcceso(): 'open' | 'passcode' {
  return process.env.ACCESS_MODE === 'passcode' ? 'passcode' : 'open'
}

export interface CodigoAcceso { codigo: string; etiqueta?: string }

export function parsearCodigos(valor = process.env.ACCESS_CODES ?? ''): CodigoAcceso[] {
  return valor
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const i = s.indexOf(':')
      return i === -1 ? { codigo: s } : { codigo: s.slice(0, i).trim(), etiqueta: s.slice(i + 1).trim() || undefined }
    })
    .filter((c) => c.codigo.length >= 6)
}

async function sha256Hex(s: string): Promise<string> {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
  return Array.from(new Uint8Array(d), (b) => b.toString(16).padStart(2, '0')).join('')
}

export async function huellaCodigo(codigo: string): Promise<string> {
  return (await sha256Hex(`acceso:${codigo}`)).slice(0, 16)
}

function secreto(): Uint8Array | null {
  const s = process.env.ACCESS_JWT_SECRET
  return s && s.length >= 32 ? new TextEncoder().encode(s) : null
}

export async function firmarAcceso(huella: string): Promise<string | null> {
  const key = secreto()
  if (!key) return null
  return new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(huella)
    .setIssuedAt()
    .setExpirationTime(`${DURACION_ACCESO_S}s`)
    .setAudience('movilidad-climatica')
    .sign(key)
}

/**
 * Devuelve la huella si el token es válido Y el código sigue en ACCESS_CODES
 * (revocación inmediata al quitarlo), o null.
 */
export async function verificarAcceso(token: string | undefined): Promise<string | null> {
  const key = secreto()
  if (!token || !key) return null
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'], audience: 'movilidad-climatica' })
    if (typeof payload.sub !== 'string') return null
    const vigentes = await Promise.all(parsearCodigos().map((c) => huellaCodigo(c.codigo)))
    return vigentes.includes(payload.sub) ? payload.sub : null
  } catch {
    return null
  }
}
