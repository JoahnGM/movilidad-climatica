import { createHash, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { COOKIE_ACCESO, DURACION_ACCESO_S, firmarAcceso, huellaCodigo, modoAcceso, parsearCodigos } from '@/lib/seguridad/acceso'
import { leerCuerpoJSON } from '@/lib/validacion'
import { registrar } from '@/lib/seguridad/log'
import { LIMITES_RUTA, consumir } from '@/lib/seguridad/rate-limit'
import { claveCliente, obtenerRequestId, respuestaError } from '@/lib/seguridad/http'

const RUTA = '/api/acceso'
const CuerpoSchema = z.object({ codigo: z.string().min(1).max(100) })

const digest = (s: string) => createHash('sha256').update(s).digest()

/** Compara contra TODOS los códigos sin salir antes, en tiempo constante por comparación. */
function codigoValido(intento: string): string | null {
  const d = digest(intento)
  let encontrado: string | null = null
  for (const { codigo } of parsearCodigos()) {
    if (timingSafeEqual(d, digest(codigo)) && encontrado === null) encontrado = codigo
  }
  return encontrado
}

export async function POST(req: Request) {
  const inicio = Date.now()
  const requestId = obtenerRequestId(req)
  const fin = (status: number, motivo?: string, ipHash?: string) =>
    registrar({ requestId, ruta: RUTA, status, latenciaMs: Date.now() - inicio, motivo, ipHash })

  if (modoAcceso() !== 'passcode') {
    fin(404, 'modo_abierto')
    return new Response(null, { status: 404 })
  }

  const { ipHash } = await claveCliente(req)
  if (!consumir(`acceso:ip:${ipHash}`, LIMITES_RUTA.acceso)) {
    fin(429, 'rate_limit', ipHash)
    return respuestaError(429, requestId)
  }

  const cuerpo = await leerCuerpoJSON(req, 2_048)
  if (!cuerpo.ok) {
    fin(cuerpo.status, cuerpo.motivo, ipHash)
    return respuestaError(cuerpo.status, requestId)
  }
  const parsed = CuerpoSchema.safeParse(cuerpo.valor)
  const codigo = parsed.success ? codigoValido(parsed.data.codigo.trim()) : null
  if (!codigo) {
    fin(401, 'codigo_invalido', ipHash)
    return respuestaError(401, requestId)
  }

  const token = await firmarAcceso(await huellaCodigo(codigo))
  if (!token) {
    fin(500, 'sin_secreto_jwt', ipHash)
    return respuestaError(500, requestId)
  }

  const jar = await cookies()
  jar.set(COOKIE_ACCESO, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: DURACION_ACCESO_S,
  })
  fin(200, undefined, ipHash)
  return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } })
}
