/**
 * Verifica las cabeceras de seguridad con curl (docs/estandares/seguridad.md §4).
 * Usa CHECK_URL si se define; si no, levanta su propio servidor en el puerto 3999
 * (`next start` si hay build, que tiene las cabeceras de producción; si no, `next dev`)
 * y lo apaga al final.
 */
import { execFileSync, spawn, type ChildProcess } from 'node:child_process'
import { existsSync } from 'node:fs'

const ESPERADAS: [string, RegExp][] = [
  ['content-security-policy', /default-src 'self'.*object-src 'none'.*frame-ancestors 'none'/],
  ['strict-transport-security', /max-age=63072000; includeSubDomains; preload/],
  ['x-content-type-options', /^nosniff$/],
  ['referrer-policy', /^strict-origin-when-cross-origin$/],
  ['permissions-policy', /camera=\(\).*microphone=\(\).*geolocation=\(\)/],
  ['x-frame-options', /^DENY$/],
]
const PROHIBIDAS = ['x-powered-by']
const RUTAS = ['/', '/diagnostico', '/api/chat']

function cabeceras(url: string): Record<string, string> | null {
  try {
    const salida = execFileSync('curl', ['-s', '-o', '/dev/null', '-D', '-', '--max-time', '20', url], { encoding: 'utf8' })
    const h: Record<string, string> = {}
    for (const linea of salida.split(/\r?\n/)) {
      const i = linea.indexOf(':')
      if (i > 0) h[linea.slice(0, i).trim().toLowerCase()] = linea.slice(i + 1).trim()
    }
    return Object.keys(h).length ? h : null
  } catch {
    return null
  }
}

async function esperarServidor(base: string, ms: number): Promise<boolean> {
  const fin = Date.now() + ms
  while (Date.now() < fin) {
    if (cabeceras(base + '/')) return true
    await new Promise((r) => setTimeout(r, 1_000))
  }
  return false
}

async function main() {
  let base = process.env.CHECK_URL ?? ''
  let servidor: ChildProcess | undefined
  if (!base) {
    base = 'http://localhost:3999'
    const modo = existsSync('.next/BUILD_ID') ? 'start' : 'dev'
    console.log(`Levantando next ${modo} en ${base}…`)
    servidor = spawn('npx', ['next', modo, '-p', '3999'], { stdio: 'ignore', detached: true })
    if (!(await esperarServidor(base, 90_000))) {
      console.error('No se pudo levantar el servidor para verificar cabeceras.')
      process.kill(-servidor.pid!)
      process.exit(1)
    }
  }

  let fallas = 0
  for (const ruta of RUTAS) {
    const h = cabeceras(base + ruta) ?? {}
    for (const [nombre, re] of ESPERADAS) {
      const ok = re.test(h[nombre] ?? '')
      if (!ok) fallas++
      console.log(`${ok ? 'OK   ' : 'FALLA'} ${ruta.padEnd(14)} ${nombre}`)
    }
    for (const nombre of PROHIBIDAS) {
      const ok = !(nombre in h)
      if (!ok) fallas++
      console.log(`${ok ? 'OK   ' : 'FALLA'} ${ruta.padEnd(14)} sin ${nombre}`)
    }
  }
  if (servidor) process.kill(-servidor.pid!)
  console.log(fallas ? `\n${fallas} verificaciones fallaron.` : '\nCabeceras de seguridad correctas.')
  process.exit(fallas ? 1 : 0)
}

main()
