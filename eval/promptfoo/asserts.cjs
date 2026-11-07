/* eslint-disable @typescript-eslint/no-require-imports -- promptfoo carga este archivo como CommonJS */
// Asserts de promptfoo para el Agente 2. El nivel se calcula como en src/lib/scoring.ts
// (suma de 18 puntajes → rangos de eval/promptfoo/generado/matriz.json), sin grounding:
// la medición autoritativa con grounding es scripts/eval-agentes.ts.
const path = require('node:path')
const { NIVELES, ICEBERGS } = require(path.resolve(__dirname, 'generado/matriz.json'))

const PREGUNTAS = Array.from({ length: 18 }, (_, i) => `p${i + 1}`)
const DIMS = {
  d1_reconocimiento: ['p1', 'p2', 'p3'], d2_instrumentos: ['p4', 'p5', 'p6'], d3_capacidad: ['p7', 'p8', 'p9'],
  d4_informacion: ['p10', 'p11', 'p12'], d5_respuestas: ['p13', 'p14', 'p15'], d6_equidad: ['p16', 'p17', 'p18'],
}

function parsear(output) {
  if (typeof output === 'object' && output) return output
  const s = String(output)
  try { return JSON.parse(s) } catch { /* sigue */ }
  const a = s.indexOf('{'), b = s.lastIndexOf('}')
  return a >= 0 && b > a ? JSON.parse(s.slice(a, b + 1)) : null
}

function puntajes(o) {
  const r = {}
  for (const [d, ps] of Object.entries(DIMS)) for (const p of ps) r[p] = o?.dimensiones?.[d]?.[p]?.puntaje
  return r
}

module.exports.esquema = (output) => {
  const o = parsear(output)
  if (!o) return { pass: false, score: 0, reason: 'No es JSON' }
  const ps = puntajes(o)
  const malos = PREGUNTAS.filter((p) => !Number.isInteger(ps[p]) || ps[p] < 0 || ps[p] > 3)
  const ok = malos.length === 0 && ['alta', 'media', 'baja'].includes(o.confianza)
  return { pass: ok, score: ok ? 1 : 0, reason: ok ? 'Esquema válido' : `Puntajes inválidos: ${malos.join(',')}` }
}

module.exports.nivel = (output, context) => {
  const o = parsear(output)
  const total = PREGUNTAS.reduce((s, p) => s + (puntajes(o)[p] ?? 0), 0)
  const nivel = Object.entries(NIVELES).find(([, v]) => total >= v.min && total <= v.max)?.[0]
  const pass = nivel === context.vars.nivel_esperado
  return { pass, score: pass ? 1 : 0, reason: `total ${total} → ${nivel} (esperado ${context.vars.nivel_esperado}, total ${context.vars.total_esperado})` }
}

// El Agente 2 no debe producir nivel, iceberg ni sus textos: los pone el código, EXACTOS.
module.exports.sinTextosOficiales = (output) => {
  const s = typeof output === 'string' ? output : JSON.stringify(output)
  const colado = Object.values(ICEBERGS).some((i) => s.includes(i.texto_corto.slice(0, 40))) || /"(nivel_id|iceberg_id|puntaje_total)"/.test(s)
  return { pass: !colado, score: colado ? 0 : 1, reason: colado ? 'El modelo produjo nivel/iceberg/textos oficiales' : 'Sin campos calculados por código' }
}
