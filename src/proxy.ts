import { NextResponse, type NextRequest } from 'next/server'
import { COOKIE_ACCESO, modoAcceso, verificarAcceso } from '@/lib/seguridad/acceso'

/**
 * Control de acceso del piloto (ACCESS_MODE=passcode). Protege la página del chat y las
 * dos rutas de IA, no solo las páginas. En modo abierto solo limpia la cabecera interna.
 */
export async function proxy(request: NextRequest) {
  const headers = new Headers(request.headers)
  // Cabecera interna: nunca se acepta del cliente.
  headers.delete('x-acceso-etiqueta')

  const { pathname } = request.nextUrl
  if (modoAcceso() !== 'passcode' || pathname.startsWith('/diagnostico/acceso')) {
    return NextResponse.next({ request: { headers } })
  }

  const huella = await verificarAcceso(request.cookies.get(COOKIE_ACCESO)?.value)
  if (huella) {
    headers.set('x-acceso-etiqueta', huella)
    return NextResponse.next({ request: { headers } })
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.json(
      { error: true, message: 'Necesitas un código de acceso para usar el diagnóstico.' },
      { status: 401, headers: { 'Cache-Control': 'no-store' } },
    )
  }
  const url = request.nextUrl.clone()
  url.pathname = '/diagnostico/acceso'
  url.search = '?acceso=1'
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/diagnostico/:path*', '/diagnostico', '/api/chat', '/api/diagnostico'],
}
