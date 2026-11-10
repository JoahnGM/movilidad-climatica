#!/usr/bin/env node
/**
 * npm run check:ds — verifica el estándar docs/estandares/design-system.md.
 *
 *  1. Colores: ningún archivo de src/app/** o src/components/** (salvo ui/ y ds/) usa hex,
 *     rgb()/hsl(), clases de color arbitrarias, la paleta por defecto de Tailwind, white/black,
 *     tokens retirados ni `style={{ color… }}` en línea.
 *  2. Catálogo: cada componente exportado por src/components/ds/index.ts tiene su ficha
 *     <Specimen nombre="…"> en src/app/ds/**.
 *  3. Pureza: src/components/ds/** no importa lógica de negocio (@/lib/* salvo utils) ni usa fetch/localStorage.
 *  4. Contraste: los pares de src/components/ds/contraste.json cumplen AA con los valores de globals.css.
 *  5. Movimiento: --motion-* de globals.css coincide con MOTION de src/components/ds/motion.ts.
 *  6. Tipos: tsc --noEmit.
 *
 *  Opciones: --tabla imprime la tabla de contraste en Markdown · --sin-tsc omite el paso 6.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { execSync } from 'node:child_process';

const RAIZ = process.cwd();
const args = new Set(process.argv.slice(2));
const errores = [];
const ok = (m) => console.log(`  ✓ ${m}`);
const falla = (m) => errores.push(m);

function archivos(dir, ext = /\.(tsx?|mjs)$/) {
  const out = [];
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) out.push(...archivos(p, ext));
    else if (ext.test(n)) out.push(p);
  }
  return out;
}
const rel = (p) => relative(RAIZ, p);
const linea = (texto, idx) => texto.slice(0, idx).split('\n').length;

/* ── 1. Colores fuera de los tokens ─────────────────────────────────── */
console.log('1. Colores solo desde tokens');
/** Archivos con deuda conocida que se migran después. Si un archivo listado queda limpio, hay que sacarlo de aquí. */
const PENDIENTES_MIGRACION = [];
const EXCLUIDOS = ['src/components/ui/', 'src/components/ds/'];
const PALETA = 'slate|gray|zinc|neutral|stone|orange|yellow|lime|emerald|teal|cyan|sky|indigo|purple|fuchsia|pink|rose|red|amber|green|blue|violet';
const PREFIJOS = 'bg|text|border|ring|from|via|to|fill|stroke|outline|decoration|divide|placeholder|shadow|accent|caret';
const REGLAS = [
  { nombre: 'hex literal', re: /#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?(?:[0-9a-fA-F]{2})?\b/g },
  { nombre: 'función de color', re: /\b(?:rgba?|hsla?|oklch)\(/g },
  { nombre: 'color arbitrario', re: /-\[(?:#|rgb|hsl|color:)/g },
  { nombre: 'paleta por defecto de Tailwind', re: new RegExp(`\\b(?:${PREFIJOS})-(?:${PALETA})-\\d{2,3}\\b`, 'g') },
  { nombre: 'white/black (usa surface-raised, ink, foreground)', re: new RegExp(`\\b(?:${PREFIJOS})-(?:white|black)\\b`, 'g') },
  { nombre: 'token retirado (teal, glass, *-light)', re: /\b(?:bg|text|border|ring|from|to)-(?:teal|glass|border-glass|red-light|violet-light)\b|\bglassmorphism\b/g },
  { nombre: 'color de matriz.ts en la UI (usa components/resultado/tonos.ts)', re: /NIVELES\[[^\]]*\]\.color|COLORES_ESTADO/g },
  { nombre: 'ui/button en páginas (usa Button de @/components/ds)', re: /@\/components\/ui\/button/g },
];
// `inline-block` choca con la utilidad de tamaño `inline-{spacing}` del token `block`
// (genera `inline-size: var(--space-block)`, ~56 px). Usa `[display:inline-block]`.
const REGLA_INLINE_BLOCK = { nombre: 'clase inline-block (choca con inline-size del token block; usa [display:inline-block])', re: /(?<![\w[-])(?<!display:)inline-block(?![\w\]-])/g };
let violaciones = 0;
const conDeuda = new Set();
for (const f of [...archivos(join(RAIZ, 'src/app')), ...archivos(join(RAIZ, 'src/components'))]) {
  const r = rel(f);
  if (EXCLUIDOS.some((e) => r.startsWith(e))) continue;
  const t = readFileSync(f, 'utf8');
  const hallazgos = [];
  for (const { nombre, re } of REGLAS) {
    for (const m of t.matchAll(re)) hallazgos.push(`${r}:${linea(t, m.index)} ${nombre}: "${m[0]}"`);
  }
  for (const m of t.matchAll(/style=\{\{([\s\S]*?)\}\}/g)) {
    if (/\b(?:color|background|backgroundColor|borderColor|border|fill|stroke|boxShadow|fontFamily)\s*:/.test(m[1])) {
      hallazgos.push(`${r}:${linea(t, m.index)} estilo en línea de color/fuente`);
    }
  }
  if (hallazgos.length === 0) continue;
  if (PENDIENTES_MIGRACION.includes(r)) { conDeuda.add(r); continue; }
  violaciones += hallazgos.length;
  hallazgos.forEach(falla);
}
for (const p of PENDIENTES_MIGRACION) if (!conDeuda.has(p)) falla(`${p} ya cumple: sácalo de PENDIENTES_MIGRACION en scripts/check-ds.mjs`);
if (violaciones === 0) ok(`sin colores fuera de tokens${PENDIENTES_MIGRACION.length ? ` (${PENDIENTES_MIGRACION.length} pendientes de migrar)` : ''}`);

// Incluye ds/ (allí también rompe el layout); ui/ es de shadcn y no se toca.
let inlineBlock = 0;
for (const f of [...archivos(join(RAIZ, 'src/app')), ...archivos(join(RAIZ, 'src/components'))]) {
  const r = rel(f);
  if (r.startsWith('src/components/ui/')) continue;
  const t = readFileSync(f, 'utf8');
  for (const m of t.matchAll(REGLA_INLINE_BLOCK.re)) { inlineBlock++; falla(`${r}:${linea(t, m.index)} ${REGLA_INLINE_BLOCK.nombre}`); }
}
if (inlineBlock === 0) ok('sin la clase inline-block (usa [display:inline-block])');

/* ── 2. Catálogo ────────────────────────────────────────────────────── */
console.log('2. Cada primitiva tiene ficha en /ds');
const indice = readFileSync(join(RAIZ, 'src/components/ds/index.ts'), 'utf8');
const NO_COMPONENTES = new Set(['MOTION', 'fadeUp', 'TONES', 'buttonVariants']);
const exportados = [...indice.matchAll(/export\s*\{([^}]*)\}/g)]
  .flatMap((m) => m[1].split(','))
  .map((s) => s.trim())
  .filter((s) => s && !s.startsWith('type '))
  .map((s) => s.split(/\s+as\s+/).pop())
  .filter((s) => !NO_COMPONENTES.has(s));
const catalogo = archivos(join(RAIZ, 'src/app/ds')).map((f) => readFileSync(f, 'utf8')).join('\n');
const sinFicha = exportados.filter((n) => !catalogo.includes(`nombre="${n}"`));
sinFicha.forEach((n) => falla(`${n} no tiene <Specimen nombre="${n}"> en src/app/ds/**`));
if (sinFicha.length === 0) ok(`${exportados.length} componentes, todos con ficha`);

/* ── 3. Pureza de ds/ ───────────────────────────────────────────────── */
console.log('3. ds/ sin lógica de negocio');
let impuros = 0;
for (const f of archivos(join(RAIZ, 'src/components/ds'))) {
  const t = readFileSync(f, 'utf8');
  for (const m of t.matchAll(/from ['"](@\/lib\/[^'"]+)['"]/g)) {
    if (m[1] !== '@/lib/utils') { impuros++; falla(`${rel(f)} importa ${m[1]} (ds/ solo puede importar @/lib/utils)`); }
  }
  if (/\bfetch\(|localStorage/.test(t)) { impuros++; falla(`${rel(f)} usa fetch/localStorage`); }
}
if (impuros === 0) ok('sin imports de dominio, fetch ni localStorage');

/* ── 4. Contraste ───────────────────────────────────────────────────── */
console.log('4. Contraste AA de los tokens');
const css = readFileSync(join(RAIZ, 'src/app/globals.css'), 'utf8');
const bloque = css.slice(css.indexOf('@theme static'));
const tokens = Object.fromEntries([...bloque.slice(0, bloque.indexOf('\n}\n')).matchAll(/--color-([a-z-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
const aRgba = (v) => {
  if (!v) return null;
  if (v.startsWith('#')) return [0, 2, 4].map((i) => parseInt(v.slice(1 + i, 3 + i), 16)).concat(1);
  const m = v.match(/rgb\((\d+)\s+(\d+)\s+(\d+)(?:\s*\/\s*([\d.]+))?\)/);
  return m ? [+m[1], +m[2], +m[3], m[4] ? +m[4] : 1] : null;
};
const base = aRgba(tokens.background);
const componer = (c) => (c[3] === 1 ? c : [0, 1, 2].map((i) => Math.round(c[i] * c[3] + base[i] * (1 - c[3]))).concat(1));
const L = (c) => { const [r, g, b] = c.slice(0, 3).map((v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const x = L(componer(aRgba(tokens[a]))), y = L(componer(aRgba(tokens[b]))); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const pares = JSON.parse(readFileSync(join(RAIZ, 'src/components/ds/contraste.json'), 'utf8'));
const filas = [];
let pruebas = 0;
for (const g of pares.grupos) for (const t of g.textos) for (const f of pares.fondos) {
  if (!tokens[t] || !tokens[f]) { falla(`contraste: token inexistente ${t} o ${f}`); continue; }
  const r = ratio(t, f); pruebas++; filas.push([g.uso, t, f, r, g.min]);
  if (r < g.min) falla(`contraste ${t} sobre ${f} = ${r.toFixed(2)} < ${g.min}`);
}
for (const e of pares.especiales) {
  if (!tokens[e.texto] || !tokens[e.fondo]) { falla(`contraste: token inexistente ${e.texto} o ${e.fondo}`); continue; }
  const r = ratio(e.texto, e.fondo); pruebas++; filas.push([e.uso, e.texto, e.fondo, r, e.min]);
  if (r < e.min) falla(`contraste ${e.uso}: ${e.texto} sobre ${e.fondo} = ${r.toFixed(2)} < ${e.min}`);
}
if (!errores.some((e) => e.startsWith('contraste'))) ok(`${pruebas} pares cumplen`);
if (args.has('--tabla')) {
  console.log('\n| Uso | Texto | Fondo | Ratio | Mínimo |\n|---|---|---|---|---|');
  for (const [uso, t, f, r, min] of filas) console.log(`| ${uso} | \`${t}\` | \`${f}\` | ${r.toFixed(2)} | ${min} |`);
  console.log('');
}

/* ── 5. Movimiento ──────────────────────────────────────────────────── */
console.log('5. Tokens de movimiento sincronizados');
const motionTs = readFileSync(join(RAIZ, 'src/components/ds/motion.ts'), 'utf8');
const enJs = (k) => Number(motionTs.match(new RegExp(`\\b${k}:\\s*([\\d.]+)`))?.[1]);
const enCss = (k) => css.match(new RegExp(`--motion-${k}:\\s*([\\d.]+)(ms|px)`));
let desincronizados = 0;
for (const k of ['fast', 'base', 'slow', 'distance']) {
  const c = enCss(k);
  if (!c) { desincronizados++; falla(`falta --motion-${k} en globals.css`); continue; }
  const valorCss = c[2] === 'ms' ? Number(c[1]) / 1000 : Number(c[1]);
  if (valorCss !== enJs(k)) { desincronizados++; falla(`--motion-${k} (${c[1]}${c[2]}) ≠ MOTION.${k} (${enJs(k)})`); }
}
if (desincronizados === 0) ok('CSS y MOTION coinciden');

/* ── 6. Tipos ───────────────────────────────────────────────────────── */
if (!args.has('--sin-tsc')) {
  console.log('6. tsc --noEmit');
  try { execSync('npx tsc --noEmit -p .', { stdio: 'pipe' }); ok('sin errores de tipos'); }
  catch (e) { falla(`tsc:\n${e.stdout?.toString() ?? e.message}`); }
}

if (errores.length) {
  console.error(`\n✗ check:ds falló (${errores.length}):`);
  errores.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}
console.log('\n✓ check:ds pasó');
