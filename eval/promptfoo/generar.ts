/**
 * Genera las entradas de promptfoo desde el código fuente (prompts, matriz y golden set),
 * para que eval/promptfooconfig.yaml nunca se desincronice de producción.
 * Lo llama `npm run eval:promptfoo` antes de `promptfoo eval`.
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { ICEBERGS, NIVELES } from '../../src/lib/matriz'
import { PROMPT_AGENTE_2, mensajeAgente2 } from '../../src/lib/prompts/agente-2'
import { RUBRICA_VERSION } from '../../src/lib/prompts/version'
import { construirTranscripcion, type Turno } from '../../src/lib/validacion'

const salida = path.resolve('eval/promptfoo/generado')
mkdirSync(salida, { recursive: true })

writeFileSync(path.join(salida, 'prompt.json'), JSON.stringify([
  { role: 'system', content: PROMPT_AGENTE_2 },
  { role: 'user', content: mensajeAgente2('{{transcripcion}}', 'eval') },
], null, 2))

writeFileSync(path.join(salida, 'matriz.json'), JSON.stringify({ rubrica: RUBRICA_VERSION, NIVELES, ICEBERGS }, null, 2))

const dir = path.resolve('eval/golden')
const tests = readdirSync(dir).filter((f) => /^g\d+\.json$/.test(f)).sort().map((f) => {
  const g = JSON.parse(readFileSync(path.join(dir, f), 'utf8'))
  return {
    description: `${g.id} · ${g.nivel_esperado} · ${g.descripcion}`,
    vars: {
      transcripcion: construirTranscripcion(g.turnos as Turno[]),
      nivel_esperado: g.nivel_esperado,
      total_esperado: g.total_esperado,
    },
  }
})
writeFileSync(path.join(salida, 'tests.json'), JSON.stringify(tests, null, 2))
console.log(`promptfoo: ${tests.length} casos generados en eval/promptfoo/generado/ (rúbrica ${RUBRICA_VERSION})`)
