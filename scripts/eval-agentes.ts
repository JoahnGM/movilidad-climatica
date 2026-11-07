/**
 * Evaluación del Agente 2 contra el golden set (docs/estandares/agentes-ia.md §4 y §6).
 *
 * Uso:
 *   npm run eval:agentes                         # proveedores disponibles según las claves
 *   npm run eval:agentes -- --proveedor gemini --repeticiones 3
 *   npm run eval:agentes -- --solo g01,g07
 *
 * Mide exactamente el código de producción (src/lib/ai/pipeline.ts → analizar):
 * prompt, esquema, grounding y puntaje en código. Escribe eval/resultados/<fecha>.md
 * y el detalle crudo en eval/resultados/<fecha>.json.
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { ErrorAgente, analizar } from '../src/lib/ai/pipeline'
import { PREGUNTAS, getNivelFromPuntaje, type PreguntaId } from '../src/lib/matriz'
import { RUBRICA_VERSION } from '../src/lib/prompts/version'
import { validarDiagnostico, construirTranscripcion, type Turno } from '../src/lib/validacion'
import type { NivelId } from '../src/lib/types'
import type { ProveedorId } from '../src/lib/ai/provider'

interface CasoGolden {
  id: string
  descripcion: string
  nivel_esperado: NivelId
  etiquetas: string[]
  manipulacion_esperada: boolean
  turnos: { rol: 'user' | 'assistant'; texto: string }[]
  esperado: Record<PreguntaId, number>
  total_esperado: number
}

interface Corrida {
  caso: string
  proveedor: ProveedorId
  repeticion: number
  ok: boolean
  error?: string
  latenciaMs: number
  jsonInvalidoPrimerIntento: boolean
  puntajes?: Record<PreguntaId, number>
  total?: number
  nivel?: NivelId
  citasInvalidadas?: number
  manipulacionDetectada: boolean
  tokensEntrada?: number
  tokensSalida?: number
  modelo?: string
}

// ─── Argumentos ───────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const arg = (n: string) => { const i = args.indexOf(`--${n}`); return i === -1 ? undefined : args[i + 1] }
const repeticiones = Number(arg('repeticiones') ?? 1)
const solo = arg('solo')?.split(',')
const pausaMs = Number(process.env.EVAL_PAUSA_MS ?? 0)

function proveedoresDisponibles(): ProveedorId[] {
  const pedido = arg('proveedor')
  if (pedido === 'gemini' || pedido === 'deepseek') return [pedido]
  const lista: ProveedorId[] = []
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.AI_GATEWAY_API_KEY) lista.push('gemini')
  if (process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN) lista.push('deepseek')
  return lista
}

// ─── Métricas ─────────────────────────────────────────────────────────────────

/** Kappa de Cohen con pesos cuadráticos para escalas ordinales 0–3. */
export function kappaPonderado(a: number[], b: number[], k = 4): number {
  const n = a.length
  if (n === 0) return NaN
  const O = Array.from({ length: k }, () => Array(k).fill(0))
  const ha = Array(k).fill(0), hb = Array(k).fill(0)
  for (let i = 0; i < n; i++) { O[a[i]][b[i]]++; ha[a[i]]++; hb[b[i]]++ }
  let num = 0, den = 0
  for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) {
    const w = ((i - j) ** 2) / ((k - 1) ** 2)
    num += w * O[i][j]
    den += w * (ha[i] * hb[j]) / n
  }
  return den === 0 ? 1 : 1 - num / den
}

const media = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / (xs.length || 1)
const percentil = (xs: number[], p: number) => {
  if (!xs.length) return NaN
  const o = [...xs].sort((x, y) => x - y)
  return o[Math.min(o.length - 1, Math.ceil((p / 100) * o.length) - 1)]
}
const desviacion = (xs: number[]) => { const m = media(xs); return Math.sqrt(media(xs.map((x) => (x - m) ** 2))) }
const f2 = (x: number) => (Number.isFinite(x) ? x.toFixed(2) : '—')
const pct = (x: number) => (Number.isFinite(x) ? `${(x * 100).toFixed(0)} %` : '—')

function moda<T>(xs: T[]): T | undefined {
  const c = new Map<T, number>()
  for (const x of xs) c.set(x, (c.get(x) ?? 0) + 1)
  return [...c.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
}

// ─── Ejecución ────────────────────────────────────────────────────────────────

function cargarGolden(): CasoGolden[] {
  const dir = path.resolve('eval/golden')
  return readdirSync(dir)
    .filter((f) => /^g\d+\.json$/.test(f))
    .sort()
    .map((f) => JSON.parse(readFileSync(path.join(dir, f), 'utf8')) as CasoGolden)
    .filter((c) => !solo || solo.includes(c.id))
}

async function correr(caso: CasoGolden, proveedor: ProveedorId, repeticion: number): Promise<Corrida> {
  process.env.AI_PROVIDER = proveedor
  const turnos: Turno[] = caso.turnos.map((t) => ({ rol: t.rol, texto: t.texto }))
  const validado = validarDiagnostico({ transcript: construirTranscripcion(turnos), municipio: 'eval' })
  if (!validado.ok) {
    return { caso: caso.id, proveedor, repeticion, ok: false, error: `entrada_${validado.motivo}`, latenciaMs: 0, jsonInvalidoPrimerIntento: false, manipulacionDetectada: false }
  }
  const { transcripcion, textosUsuario, manipulacion } = validado.valor
  const inicio = Date.now()
  try {
    // En producción un caso con manipulación se bloquea (422) antes del modelo. Aquí se
    // analiza igual para medir si el Agente 2 resiste la inyección.
    const a = await analizar(transcripcion, textosUsuario)
    const puntajes = Object.fromEntries(PREGUNTAS.map((p) => [p, a.puntajes[p].puntaje])) as Record<PreguntaId, number>
    return {
      caso: caso.id, proveedor, repeticion, ok: true, latenciaMs: Date.now() - inicio,
      jsonInvalidoPrimerIntento: a.jsonInvalidoPrimerIntento, puntajes,
      total: a.calculado.puntaje_total, nivel: a.calculado.nivel_id, citasInvalidadas: a.invalidadas.length,
      manipulacionDetectada: manipulacion.detectada, tokensEntrada: a.uso.entrada, tokensSalida: a.uso.salida,
      modelo: a.etiquetaModelo,
    }
  } catch (e) {
    return {
      caso: caso.id, proveedor, repeticion, ok: false, error: e instanceof Error ? e.message : 'error',
      latenciaMs: Date.now() - inicio,
      // Solo cuenta como JSON inválido si falló por formato, no por cuota, red o timeout.
      jsonInvalidoPrimerIntento: e instanceof ErrorAgente && e.causa === 'json',
      manipulacionDetectada: manipulacion.detectada,
    }
  }
}

function resumen(golden: CasoGolden[], corridas: Corrida[], proveedor: ProveedorId) {
  const propias = corridas.filter((c) => c.proveedor === proveedor)
  const ok = propias.filter((c) => c.ok)
  const porCaso = new Map(golden.map((g) => [g.id, g]))
  const esperados: number[] = [], obtenidos: number[] = []
  const errPorPregunta = Object.fromEntries(PREGUNTAS.map((p) => [p, [] as number[]])) as Record<PreguntaId, number[]>
  for (const c of ok) {
    const g = porCaso.get(c.caso)!
    for (const p of PREGUNTAS) {
      esperados.push(g.esperado[p]); obtenidos.push(c.puntajes![p])
      errPorPregunta[p].push(Math.abs(g.esperado[p] - c.puntajes![p]))
    }
  }
  const estabilidad = golden.map((g) => {
    const niveles = ok.filter((c) => c.caso === g.id).map((c) => c.nivel!)
    const m = moda(niveles)
    return niveles.length ? niveles.filter((n) => n === m).length / niveles.length : NaN
  }).filter(Number.isFinite)
  const sdTotales = golden.map((g) => desviacion(ok.filter((c) => c.caso === g.id).map((c) => c.total!)))
  const manip = golden.map((g) => {
    const c = propias.find((x) => x.caso === g.id)
    return c ? c.manipulacionDetectada === g.manipulacion_esperada : false
  })
  return {
    proveedor,
    modelo: ok[0]?.modelo ?? '—',
    corridas: propias.length,
    fallidas: propias.length - ok.length,
    fallidasPorCausa: Object.entries(propias.filter((c) => !c.ok).reduce<Record<string, number>>((m, c) => {
      const k = (c.error ?? 'error').replace(/^agente_\w+?_/, '')
      m[k] = (m[k] ?? 0) + 1
      return m
    }, {})).map(([k, v]) => `${k} ${v}`).join(', ') || '—',
    exactitudNivel: media(ok.map((c) => (c.nivel === porCaso.get(c.caso)!.nivel_esperado ? 1 : 0))),
    maeGlobal: media(Object.values(errPorPregunta).flat()),
    maePorPregunta: Object.fromEntries(PREGUNTAS.map((p) => [p, media(errPorPregunta[p])])) as Record<PreguntaId, number>,
    errorTotalMedio: media(ok.map((c) => Math.abs(c.total! - porCaso.get(c.caso)!.total_esperado))),
    sesgoTotal: media(ok.map((c) => c.total! - porCaso.get(c.caso)!.total_esperado)),
    kappa: kappaPonderado(esperados, obtenidos),
    tasaJsonInvalido: media(propias.map((c) => (c.jsonInvalidoPrimerIntento ? 1 : 0))),
    latP50: percentil(ok.map((c) => c.latenciaMs), 50),
    latP95: percentil(ok.map((c) => c.latenciaMs), 95),
    tokensEntrada: media(ok.map((c) => c.tokensEntrada ?? 0)),
    tokensSalida: media(ok.map((c) => c.tokensSalida ?? 0)),
    citasInvalidadas: media(ok.map((c) => c.citasInvalidadas ?? 0)),
    estabilidadNivel: repeticiones > 1 ? media(estabilidad) : NaN,
    sdTotalMedia: repeticiones > 1 ? media(sdTotales.filter(Number.isFinite)) : NaN,
    deteccionManipulacion: media(manip.map((x) => (x ? 1 : 0))),
  }
}

async function main() {
  const golden = cargarGolden()
  if (!golden.length) throw new Error('No hay casos en eval/golden/')

  // --reporte <archivo.json>: rehace el .md desde una corrida guardada, sin llamar al modelo.
  const reporte = arg('reporte')
  if (reporte) {
    const previo = JSON.parse(readFileSync(reporte, 'utf8')) as { corridas: Corrida[]; fecha: string }
    const provs = [...new Set(previo.corridas.map((c) => c.proveedor))]
    escribirReporte(golden, previo.corridas, provs, reporte.replace(/\.json$/, ''), previo.fecha)
    return
  }

  const proveedores = proveedoresDisponibles()
  if (!proveedores.length) throw new Error('No hay claves de proveedor (GOOGLE_GENERATIVE_AI_API_KEY o AI_GATEWAY_API_KEY)')

  console.log(`Golden set: ${golden.length} casos · proveedores: ${proveedores.join(', ')} · repeticiones: ${repeticiones} · rúbrica ${RUBRICA_VERSION}`)
  const corridas: Corrida[] = []
  for (const proveedor of proveedores) {
    for (let r = 1; r <= repeticiones; r++) {
      for (const caso of golden) {
        const c = await correr(caso, proveedor, r)
        corridas.push(c)
        console.log(`${proveedor} r${r} ${caso.id}: ${c.ok ? `total ${c.total} (esperado ${caso.total_esperado}) ${c.nivel}${c.nivel === caso.nivel_esperado ? '' : ' ✗'} · ${c.latenciaMs} ms` : `ERROR ${c.error}`}`)
        if (pausaMs) await new Promise((res) => setTimeout(res, pausaMs))
      }
    }
  }

  const ahora = new Date()
  const dos = (n: number) => String(n).padStart(2, '0')
  const fecha = `${ahora.getFullYear()}-${dos(ahora.getMonth() + 1)}-${dos(ahora.getDate())}`
  const hora = `${dos(ahora.getHours())}${dos(ahora.getMinutes())}`
  const dir = path.resolve('eval/resultados')
  mkdirSync(dir, { recursive: true })
  const base = path.join(dir, `${fecha}-${hora}`)
  writeFileSync(`${base}.json`, JSON.stringify({ fecha, rubrica: RUBRICA_VERSION, repeticiones, corridas }, null, 2))
  escribirReporte(golden, corridas, proveedores, base, fecha)
}

function escribirReporte(golden: CasoGolden[], corridas: Corrida[], proveedores: ProveedorId[], base: string, fecha: string) {
  const resumenes = proveedores.map((p) => resumen(golden, corridas, p))

  // Acuerdo entre proveedores (repetición 1).
  let kappaEntreProveedores = NaN
  if (proveedores.length === 2) {
    const a: number[] = [], b: number[] = []
    for (const g of golden) {
      const x = corridas.find((c) => c.caso === g.id && c.proveedor === proveedores[0] && c.repeticion === 1 && c.ok)
      const y = corridas.find((c) => c.caso === g.id && c.proveedor === proveedores[1] && c.repeticion === 1 && c.ok)
      if (x && y) for (const p of PREGUNTAS) { a.push(x.puntajes![p]); b.push(y.puntajes![p]) }
    }
    kappaEntreProveedores = kappaPonderado(a, b)
  }

  const md: string[] = [
    `# Evaluación del Agente 2 — ${fecha}`,
    '',
    `- Rúbrica: \`${RUBRICA_VERSION}\``,
    `- Golden set: ${golden.length} casos (\`eval/golden/\`), anotación sintética pendiente de revisión humana`,
    `- Repeticiones por caso: ${repeticiones}`,
    `- Comando: \`npm run eval:agentes -- ${args.join(' ')}\``,
    '',
    '## Resumen por proveedor',
    '',
    '| Métrica | ' + resumenes.map((r) => `${r.proveedor} (\`${r.modelo}\`)`).join(' | ') + ' |',
    '|---|' + resumenes.map(() => '---|').join(''),
    ...([
      ['Corridas (fallidas)', (r) => `${r.corridas} (${r.fallidas})`],
      ['Fallidas por causa', (r) => r.fallidasPorCausa],
      ['Exactitud de nivel', (r) => pct(r.exactitudNivel)],
      ['MAE por pregunta (0–3)', (r) => f2(r.maeGlobal)],
      ['Error medio del total (puntos)', (r) => f2(r.errorTotalMedio)],
      ['Sesgo del total (modelo − esperado)', (r) => f2(r.sesgoTotal)],
      ['Kappa ponderado vs. golden', (r) => f2(r.kappa)],
      ['Tasa de JSON inválido (1er intento)', (r) => pct(r.tasaJsonInvalido)],
      ['Citas no verificadas por caso (→ 0)', (r) => f2(r.citasInvalidadas)],
      ['Latencia p50 / p95 (ms)', (r) => `${r.latP50} / ${r.latP95}`],
      ['Tokens entrada / salida (media)', (r) => `${Math.round(r.tokensEntrada)} / ${Math.round(r.tokensSalida)}`],
      ['Estabilidad de nivel entre repeticiones', (r) => pct(r.estabilidadNivel)],
      ['Desv. estándar del total entre repeticiones', (r) => f2(r.sdTotalMedia)],
      ['Detección de manipulación (regex) correcta', (r) => pct(r.deteccionManipulacion)],
    ] as [string, (r: ReturnType<typeof resumen>) => string][]).map(([n, f]) => `| ${n} | ${resumenes.map(f).join(' | ')} |`),
    '',
    proveedores.length === 2 ? `Kappa ponderado entre proveedores (repetición 1): **${f2(kappaEntreProveedores)}**\n` : '',
    '## Umbrales (docs/estandares/agentes-ia.md §2)',
    '',
    ...resumenes.map((r) => `- ${r.proveedor}: kappa ${f2(r.kappa)} ${r.kappa >= 0.6 ? '≥' : '<'} 0,60 · JSON inválido ${pct(r.tasaJsonInvalido)} · estabilidad ${pct(r.estabilidadNivel)}${repeticiones > 1 ? (r.estabilidadNivel > 0.9 ? ' > 90 %' : ' ≤ 90 %') : ' (requiere --repeticiones ≥ 2)'}`),
    '',
    '## MAE por pregunta',
    '',
    '| Pregunta | ' + resumenes.map((r) => r.proveedor).join(' | ') + ' |',
    '|---|' + resumenes.map(() => '---|').join(''),
    ...PREGUNTAS.map((p) => `| ${p.toUpperCase()} | ${resumenes.map((r) => f2(r.maePorPregunta[p])).join(' | ')} |`),
    '',
    '## Detalle por caso (repetición 1)',
    '',
    '| Caso | Nivel esperado | Total esperado | ' + proveedores.map((p) => `${p}: total · nivel`).join(' | ') + ' | Manipulación (esperada / detectada) |',
    '|---|---|---|' + proveedores.map(() => '---|').join('') + '---|',
    ...golden.map((g) => {
      const celdas = proveedores.map((p) => {
        const c = corridas.find((x) => x.caso === g.id && x.proveedor === p && x.repeticion === 1)
        if (!c) return '—'
        return c.ok ? `${c.total} · ${c.nivel}${c.nivel === g.nivel_esperado ? '' : ' ✗'}` : `error: ${c.error}`
      })
      const det = corridas.find((x) => x.caso === g.id)?.manipulacionDetectada
      return `| ${g.id} | ${g.nivel_esperado} | ${g.total_esperado} | ${celdas.join(' | ')} | ${g.manipulacion_esperada ? 'sí' : 'no'} / ${det ? 'sí' : 'no'} |`
    }),
    '',
    '> Los casos con manipulación se bloquean con 422 en producción antes de llegar al modelo; aquí se analizan igual para medir si el Agente 2 resiste la inyección.',
    '',
  ]
  writeFileSync(`${base}.md`, md.join('\n'))
  console.log(`\nResultados: ${path.relative(process.cwd(), base)}.md`)
  // Verificación de coherencia: el nivel esperado del golden debe corresponder a su total.
  for (const g of golden) if (getNivelFromPuntaje(g.total_esperado) !== g.nivel_esperado) console.warn(`Aviso: ${g.id} tiene nivel_esperado incoherente con su total`)
}

main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1) })
