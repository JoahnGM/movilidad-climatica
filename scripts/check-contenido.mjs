#!/usr/bin/env node
// Verificación del contenido editorial (docs/estandares/contenido-y-fuentes.md §4).
//
//   npm run check:contenido                      todas las pruebas (incluye red y tsc)
//   node scripts/check-contenido.mjs --sin-red   omite la prueba de URLs (solo desarrollo local)
//   node scripts/check-contenido.mjs --sync-textos
//                                                regenera src/lib/contenido/textos.ts desde
//                                                docs/contenido/textos/*.md y luego verifica
//
// Falla (exit 1) si:
//   a) una Cifra publicable no tiene fuente.url, anio o definicion, o su fuente no es primaria
//   b) una URL de fuente o recurso publicable no responde 2xx/3xx (salvo excepciones documentadas)
//   c) un cifraId, ejemploId u obligacionId referenciado no existe (o apunta a algo no publicable)
//   d) hay "[verificar]" o "TODO" en un ítem publicable
//   e) `tsc --noEmit` falla
// y además si textos.ts no coincide con los .md, si hay ids duplicados o afirmaciones sin respaldo.

import { spawnSync } from 'node:child_process'
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import ts from 'typescript'

const RAIZ = resolve(import.meta.dirname, '..')
const DIR_CONTENIDO = join(RAIZ, 'src/lib/contenido')
const DIR_TEXTOS_MD = join(RAIZ, 'docs/contenido/textos')
const ARCHIVO_TEXTOS = join(DIR_CONTENIDO, 'textos.ts')

const args = new Set(process.argv.slice(2))
const SIN_RED = args.has('--sin-red')
const SYNC_TEXTOS = args.has('--sync-textos')

/**
 * URLs que no se pueden comprobar automáticamente pero se verificaron a mano.
 * Cada excepción lleva motivo y fecha de la verificación manual. Revisar en cada actualización.
 */
const EXCEPCIONES_URL = {
  'https://www.acnur.org/noticias/comunicados-de-prensa/acnur-alerta-sobre-la-grave-situacion-de-las-comunidades-afectadas':
    'acnur.org responde 403 a clientes automáticos; verificado en informe 07 (2026-11-06)',
  'https://www.acnur.org/noticias/comunicados-de-prensa/acnur-saluda-la-opinion-consultiva-de-la-corte-interamericana-sobre-sobre-emergencia-climatica-y-derechos-humanos':
    'acnur.org responde 403 a clientes automáticos; verificado en informe 07 (2026-11-06)',
  'https://www.unhcr.org/uk/sites/uk/files/legacy-pdf/562f798d9.pdf':
    'unhcr.org bloquea clientes automáticos; PDF pesado citado en informe 07 (2026-11-06)',
}

const errores = []
const avisos = []
const error = (msg) => errores.push(msg)
const aviso = (msg) => avisos.push(msg)

// ── Textos: .md → textos.ts ─────────────────────────────────────────────

function leerTextosMd() {
  const archivos = readdirSync(DIR_TEXTOS_MD).filter((f) => f.endsWith('.md')).sort()
  return archivos.map((archivo) => {
    const crudo = readFileSync(join(DIR_TEXTOS_MD, archivo), 'utf8')
    const m = crudo.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    if (!m) throw new Error(`${archivo}: falta el bloque de metadatos (---)`)
    const meta = Object.fromEntries(
      m[1].split('\n').filter(Boolean).map((linea) => {
        const i = linea.indexOf(':')
        return [linea.slice(0, i).trim(), linea.slice(i + 1).trim()]
      }),
    )
    for (const campo of ['id', 'titulo', 'version', 'fecha']) {
      if (!meta[campo]) throw new Error(`${archivo}: falta "${campo}" en los metadatos`)
    }
    if (`${meta.id}.md` !== archivo) throw new Error(`${archivo}: el id "${meta.id}" no coincide con el nombre del archivo`)
    return { id: meta.id, titulo: meta.titulo, cuerpo: m[2].trim(), version: meta.version, fecha: meta.fecha }
  })
}

function generarTextosTs(textos) {
  const items = textos
    .map((t) => `  {\n    id: ${JSON.stringify(t.id)},\n    titulo: ${JSON.stringify(t.titulo)},\n    version: ${JSON.stringify(t.version)},\n    fecha: ${JSON.stringify(t.fecha)},\n    cuerpo: ${JSON.stringify(t.cuerpo)},\n  },`)
    .join('\n')
  return `// ARCHIVO GENERADO — no editar a mano.
// Fuente editable: docs/contenido/textos/<id>.md
// Regenerar: node scripts/check-contenido.mjs --sync-textos
import type { Texto } from './types'

export const TEXTOS: Texto[] = [
${items}
]

export function getTexto(id: string): Texto {
  const texto = TEXTOS.find((t) => t.id === id)
  if (!texto) throw new Error(\`Texto inexistente: \${id}\`)
  return texto
}
`
}

const textosMd = leerTextosMd()
const textosTsEsperado = generarTextosTs(textosMd)
if (SYNC_TEXTOS) {
  writeFileSync(ARCHIVO_TEXTOS, textosTsEsperado)
  console.log(`textos.ts regenerado (${textosMd.length} textos)`)
}
let textosTsActual = ''
try {
  textosTsActual = readFileSync(ARCHIVO_TEXTOS, 'utf8')
} catch {
  // se reporta abajo
}
if (textosTsActual !== textosTsEsperado) {
  error('textos.ts no coincide con docs/contenido/textos/*.md. Corre: node scripts/check-contenido.mjs --sync-textos')
}

// ── Cargar los módulos de contenido (transpilados a un directorio temporal) ──

async function cargarContenido() {
  const tmp = mkdtempSync(join(tmpdir(), 'check-contenido-'))
  try {
    for (const archivo of readdirSync(DIR_CONTENIDO).filter((f) => f.endsWith('.ts'))) {
      const fuente = readFileSync(join(DIR_CONTENIDO, archivo), 'utf8')
      const { outputText } = ts.transpileModule(fuente, {
        compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
      })
      const conExtensiones = outputText.replace(/from '(\.\/[^']+)'/g, "from '$1.mjs'")
      writeFileSync(join(tmp, archivo.replace(/\.ts$/, '.mjs')), conExtensiones)
    }
    return await import(pathToFileURL(join(tmp, 'index.mjs')).href)
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
}

const c = await cargarContenido()

// ── Utilidades ──────────────────────────────────────────────────────────

const esPublicable = (item) => item.publicable !== false

function idsUnicos(nombre, lista) {
  const vistos = new Set()
  for (const { id } of lista) {
    if (vistos.has(id)) error(`${nombre}: id duplicado "${id}"`)
    vistos.add(id)
  }
}

function textosDe(valor, ruta = '') {
  if (typeof valor === 'string') return [[ruta, valor]]
  if (Array.isArray(valor)) return valor.flatMap((v, i) => textosDe(v, `${ruta}[${i}]`))
  if (valor && typeof valor === 'object') return Object.entries(valor).flatMap(([k, v]) => textosDe(v, ruta ? `${ruta}.${k}` : k))
  return []
}

/** (d) Ningún ítem publicable puede tener "[verificar]" ni "TODO". */
function sinMarcasPendientes(nombre, item) {
  for (const [ruta, texto] of textosDe(item)) {
    if (/\[verificar/i.test(texto) || /\bTODO\b/.test(texto)) error(`${nombre}: "${ruta}" contiene [verificar] o TODO en un ítem publicable`)
  }
}

const urls = new Map() // url → dónde se usa
function registrarUrl(url, donde) {
  if (!url) return
  if (!urls.has(url)) urls.set(url, donde)
}

function validarFuente(nombre, fuente, { exigirPrimaria = false } = {}) {
  if (!fuente) return error(`${nombre}: sin fuente`)
  for (const campo of ['institucion', 'titulo', 'anio', 'url', 'consultadoEl', 'tipo']) {
    if (!fuente[campo]) error(`${nombre}: la fuente no tiene "${campo}"`)
  }
  if (fuente.consultadoEl && !/^\d{4}-\d{2}-\d{2}$/.test(fuente.consultadoEl)) error(`${nombre}: consultadoEl no es AAAA-MM-DD`)
  if (fuente.tipo === 'secundaria' && !fuente.citaA) error(`${nombre}: fuente secundaria sin "citaA" (qué fuente oficial o institucional cita)`)
  if (exigirPrimaria && fuente.tipo !== 'primaria') error(`${nombre}: una cifra publicable exige fuente primaria (es "${fuente.tipo}")`)
  registrarUrl(fuente.url, nombre)
}

// ── (a) Cifras ──────────────────────────────────────────────────────────

const cifras = new Map(c.CIFRAS.map((x) => [x.id, x]))
idsUnicos('cifras', c.CIFRAS)
for (const cifra of c.CIFRAS) {
  const nombre = `cifra ${cifra.id}`
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(cifra.id)) error(`${nombre}: el id debe ser kebab-case`)
  if (!cifra.publicable) {
    if (!cifra.notas) error(`${nombre}: no publicable sin "notas" que expliquen qué falta`)
    continue
  }
  if (!cifra.definicion?.trim()) error(`${nombre}: publicable sin definición`)
  if (cifra.anio === undefined || cifra.anio === '') error(`${nombre}: publicable sin año`)
  if (cifra.confianza === 'baja') error(`${nombre}: confianza baja no puede ser publicable`)
  validarFuente(nombre, cifra.fuente, { exigirPrimaria: true })
  sinMarcasPendientes(nombre, cifra)
}

// ── (c) Afirmaciones de ciudades ────────────────────────────────────────

function validarAfirmacion(nombre, a) {
  if (!esPublicable(a)) {
    if (!a.notas) error(`${nombre}: afirmación no publicable sin "notas"`)
    if (a.cifraId && !cifras.has(a.cifraId)) error(`${nombre}: cifraId "${a.cifraId}" no existe`)
    return
  }
  if (!a.fuente && !a.cifraId && !a.sintesis) error(`${nombre}: afirmación sin fuente, cifraId ni sintesis`)
  if (a.fuente) validarFuente(nombre, a.fuente)
  if (a.cifraId) {
    const cifra = cifras.get(a.cifraId)
    if (!cifra) error(`${nombre}: cifraId "${a.cifraId}" no existe`)
    else if (!cifra.publicable) error(`${nombre}: afirmación publicable apunta a la cifra no publicable "${a.cifraId}"`)
  }
  sinMarcasPendientes(nombre, a)
}

idsUnicos('ciudades', c.CIUDADES)
for (const ciudad of c.CIUDADES) {
  for (const campo of ['contexto', 'riesgos', 'marcos', 'respuestas', 'brechas']) {
    const lista = ciudad[campo]
    if (!Array.isArray(lista) || lista.filter(esPublicable).length === 0) error(`ciudad ${ciudad.id}: "${campo}" sin afirmaciones publicables`)
    lista?.forEach((a, i) => validarAfirmacion(`ciudad ${ciudad.id}.${campo}[${i}]`, a))
  }
  if (!ciudad.mensajeClave?.sintesis) error(`ciudad ${ciudad.id}: el mensaje clave debe marcarse sintesis: true`)
  validarAfirmacion(`ciudad ${ciudad.id}.mensajeClave`, ciudad.mensajeClave)
  validarAfirmacion(`ciudad ${ciudad.id}.nombraMovilidadClimatica`, ciudad.nombraMovilidadClimatica.afirmacion)
}
c.HALLAZGO_CIUDADES.forEach((a, i) => validarAfirmacion(`HALLAZGO_CIUDADES[${i}]`, a))

// ── Derechos, ejemplos, glosario, recursos ──────────────────────────────

const obligaciones = new Map(c.OBLIGACIONES.map((o) => [o.id, o]))
for (const [nombreLista, lista] of [
  ['obligaciones', c.OBLIGACIONES],
  ['hitos', c.HITOS_LEGALES],
  ['principios', c.PRINCIPIOS_RESPUESTA_JUSTA],
  ['ejemplos', c.EJEMPLOS],
]) {
  idsUnicos(nombreLista, lista)
  for (const item of lista) {
    const nombre = `${nombreLista} ${item.id}`
    if (!item.publicable) {
      if (!item.notas) error(`${nombre}: no publicable sin "notas"`)
      continue
    }
    validarFuente(nombre, item.fuente)
    item.otrasFuentes?.forEach((f) => validarFuente(nombre, f))
    if (item.fecha && !/^\d{4}-\d{2}-\d{2}$/.test(item.fecha)) error(`${nombre}: fecha no es AAAA-MM-DD`)
    sinMarcasPendientes(nombre, item)
  }
}

idsUnicos('grupos afectados', c.GRUPOS_AFECTADOS)
for (const g of c.GRUPOS_AFECTADOS) {
  const nombre = `grupo ${g.id}`
  if (!obligaciones.has(g.obligacionId)) error(`${nombre}: obligacionId "${g.obligacionId}" no existe`)
  if (!g.publicable) continue
  if (g.sinDato && g.dato) error(`${nombre}: sinDato y dato a la vez`)
  if (!g.sinDato && (!g.dato || !g.fuente)) error(`${nombre}: sin dato ni fuente; marcar sinDato: true`)
  if (g.fuente) validarFuente(nombre, g.fuente)
  sinMarcasPendientes(nombre, g)
}

const ejemplos = new Map(c.EJEMPLOS.map((e) => [e.id, e]))
idsUnicos('glosario', c.GLOSARIO)
for (const t of c.GLOSARIO) {
  const ej = ejemplos.get(t.ejemploId)
  if (!ej) error(`glosario ${t.id}: ejemploId "${t.ejemploId}" no existe`)
  else if (!ej.publicable) error(`glosario ${t.id}: apunta al ejemplo no publicable "${t.ejemploId}"`)
  if (t.fuente) validarFuente(`glosario ${t.id}`, t.fuente)
  sinMarcasPendientes(`glosario ${t.id}`, t)
}

idsUnicos('recursos', c.RECURSOS)
for (const r of c.RECURSOS) {
  const nombre = `recurso ${r.id}`
  if (!r.publicable) {
    if (!r.notas) error(`${nombre}: no publicable sin "notas"`)
    continue
  }
  if (!r.paraQueSirve?.trim()) error(`${nombre}: sin "paraQueSirve"`)
  registrarUrl(r.url, nombre)
  sinMarcasPendientes(nombre, r)
}

idsUnicos('textos', c.TEXTOS)
for (const t of c.TEXTOS) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t.fecha)) error(`texto ${t.id}: fecha no es AAAA-MM-DD`)
  sinMarcasPendientes(`texto ${t.id}`, t)
  // Convención: placeholders en minúscula entre corchetes ([proveedor]); etiquetas de botón con mayúscula ([Ver política de datos]).
  const placeholders = [...new Set(t.cuerpo.match(/\[[a-záéíóúñ][^\]\n]*\](?!\()/g) ?? [])]
  if (placeholders.length) aviso(`texto ${t.id}: placeholders pendientes ${placeholders.join(' ')}`)
}

// ── (b) URLs ────────────────────────────────────────────────────────────

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36'

/** Segundo intento con curl: usa el almacén de certificados del sistema (algunos sitios .gov.co no envían la cadena intermedia que Node espera). */
function comprobarConCurl(url) {
  const r = spawnSync('curl', ['-sS', '-L', '-o', '/dev/null', '-m', '30', '-A', UA, '-w', '%{http_code}', url], { encoding: 'utf8' })
  const codigo = Number(r.stdout)
  return { ok: codigo >= 200 && codigo < 400, detalle: `curl ${r.stdout || r.stderr.trim()}` }
}

async function comprobarUrl(url) {
  const opciones = { redirect: 'follow', signal: AbortSignal.timeout(25_000), headers: { 'user-agent': UA, accept: 'text/html,application/pdf,*/*' } }
  let detalle
  try {
    let r = await fetch(url, { ...opciones, method: 'HEAD' })
    if (r.status >= 400) r = await fetch(url, { ...opciones, method: 'GET' })
    await r.body?.cancel()
    if (r.status < 400) return { ok: true, detalle: String(r.status) }
    detalle = String(r.status)
  } catch (e) {
    detalle = e.cause?.code ?? e.name ?? String(e)
  }
  const reintento = comprobarConCurl(url)
  return reintento.ok ? reintento : { ok: false, detalle: `${detalle}; ${reintento.detalle}` }
}

if (SIN_RED) {
  aviso(`prueba de URLs omitida (--sin-red): ${urls.size} URLs sin comprobar. CI debe correr sin esta opción.`)
} else {
  const pendientes = [...urls.entries()].filter(([url]) => !(url in EXCEPCIONES_URL))
  const LOTE = 8
  for (let i = 0; i < pendientes.length; i += LOTE) {
    const resultados = await Promise.all(pendientes.slice(i, i + LOTE).map(async ([url, donde]) => ({ url, donde, ...(await comprobarUrl(url)) })))
    for (const { url, donde, ok, detalle } of resultados) {
      if (!ok) error(`URL no responde (${detalle}) en ${donde}: ${url}`)
    }
  }
  for (const [url, motivo] of Object.entries(EXCEPCIONES_URL)) {
    if (urls.has(url)) aviso(`URL exceptuada: ${url} — ${motivo}`)
  }
}

// ── (e) tsc --noEmit ────────────────────────────────────────────────────

const tsc = spawnSync(process.execPath, [join(RAIZ, 'node_modules/typescript/bin/tsc'), '--noEmit', '-p', RAIZ], { encoding: 'utf8' })
if (tsc.status !== 0) error(`tsc --noEmit falló:\n${tsc.stdout}${tsc.stderr}`)

// ── Resumen ─────────────────────────────────────────────────────────────

const publicables = c.CIFRAS.filter((x) => x.publicable).length
console.log(`check:contenido — ${c.CIFRAS.length} cifras (${publicables} publicables), ${c.CIUDADES.length} ciudades, ${c.EJEMPLOS.length} ejemplos, ${c.RECURSOS.length} recursos, ${c.TEXTOS.length} textos, ${urls.size} URLs`)
for (const a of avisos) console.log(`  aviso: ${a}`)
if (errores.length) {
  console.error(`\n${errores.length} error(es):`)
  for (const e of errores) console.error(`  ✗ ${e}`)
  process.exit(1)
}
console.log('  ✓ contenido verificado')
