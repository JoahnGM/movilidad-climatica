'use client';

import { Fragment, useSyncExternalStore } from 'react';
import contraste from '@/components/ds/contraste.json';
import { cn } from '@/lib/utils';

/* Lee los tokens en vivo desde las variables CSS: el catálogo nunca duplica valores. */

type RGBA = [number, number, number, number];

function leerToken(nombre: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(`--color-${nombre}`).trim();
}

function aRgba(valor: string): RGBA | null {
  const v = valor.trim();
  if (v.startsWith('#')) {
    const h = v.slice(1);
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 1];
  }
  const m = v.match(/rgba?\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)(?:\s*[/,]\s*([\d.]+))?\s*\)/);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3]), m[4] ? Number(m[4]) : 1] : null;
}

function componer(c: RGBA, base: RGBA): RGBA {
  if (c[3] === 1) return c;
  return [0, 1, 2].map((i) => Math.round(c[i] * c[3] + base[i] * (1 - c[3]))).concat(1) as RGBA;
}

function luminancia(c: RGBA): number {
  const [r, g, b] = c.slice(0, 3).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a: RGBA, b: RGBA): number {
  const x = luminancia(a);
  const y = luminancia(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

const sinSuscripcion = () => () => {};

/** Valores actuales de los tokens (vacío en el servidor; se leen en el cliente). */
function useTokens(nombres: string[]) {
  const clave = nombres.join(',');
  const snapshot = useSyncExternalStore(
    sinSuscripcion,
    () => clave.split(',').map((n) => `${n}=${leerToken(n)}`).join('|'),
    () => '',
  );
  return Object.fromEntries(snapshot ? snapshot.split('|').map((p) => p.split('=') as [string, string]) : []);
}

export interface ColorToken {
  nombre: string;
  uso: string;
}

/** Cuadrícula de muestras de color con su valor real y la clase Tailwind. */
export function MuestrasColor({ tokens }: { tokens: ColorToken[] }) {
  const valores = useTokens(tokens.map((t) => t.nombre));
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {tokens.map((t) => (
        <li key={t.nombre} className="flex items-center gap-3 rounded-xl border border-border bg-surface-raised p-3">
          <span
            aria-hidden="true"
            className="size-12 shrink-0 rounded-lg border border-border bg-(--muestra)"
            style={{ '--muestra': `var(--color-${t.nombre})` } as React.CSSProperties}
          />
          <span className="flex min-w-0 flex-col">
            <code className="font-mono text-caption text-foreground">--color-{t.nombre}</code>
            <span className="font-mono text-caption text-subtle">{valores[t.nombre] || '…'}</span>
            <span className="text-caption text-muted">{t.uso}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Tabla de contraste calculada en vivo con los mismos pares que verifica `check:ds`. */
export function TablaContraste() {
  const nombres = Array.from(
    new Set([
      ...contraste.fondos,
      ...contraste.grupos.flatMap((g) => g.textos),
      ...contraste.especiales.flatMap((e) => [e.texto, e.fondo]),
    ]),
  );
  const v = useTokens(nombres);
  if (!v.background) return <p className="text-small text-subtle">Calculando…</p>;
  const base = aRgba(v.background) as RGBA;
  const fondo = (n: string) => componer(aRgba(v[n]) as RGBA, base);

  const celda = (r: number, min: number) => (
    <td className={cn('px-3 py-2 text-right font-mono tabular-nums', r >= min ? 'text-muted' : 'font-semibold text-red-ink')}>
      {r.toFixed(2)}
      <span className="sr-only">{r >= min ? ' cumple' : ' no cumple'}</span>
    </td>
  );

  return (
    <div className="flex flex-col gap-8">
      {contraste.grupos.map((g) => (
        <div key={g.uso} className="relative overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[40rem] text-small">
            <caption className="px-3 py-3 text-left text-small font-medium text-foreground">
              {g.uso} — mínimo {g.min}:1
            </caption>
            <thead className="bg-surface text-caption text-subtle">
              <tr>
                <th scope="col" className="px-3 py-2 text-left font-medium">Texto \ Fondo</th>
                {contraste.fondos.map((f) => (
                  <th key={f} scope="col" className="px-3 py-2 text-right font-mono font-medium">{f}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {g.textos.map((t) => (
                <tr key={t}>
                  <th
                    scope="row"
                    className="px-3 py-2 text-left font-mono font-medium text-(--muestra)"
                    style={{ '--muestra': `var(--color-${t})` } as React.CSSProperties}
                  >
                    {t}
                  </th>
                  {contraste.fondos.map((f) => (
                    <Fragment key={f}>{celda(ratio(fondo(t), fondo(f)), g.min)}</Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      <div className="relative overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[32rem] text-small">
          <caption className="px-3 py-3 text-left text-small font-medium text-foreground">Pares especiales</caption>
          <thead className="bg-surface text-caption text-subtle">
            <tr>
              <th scope="col" className="px-3 py-2 text-left font-medium">Uso</th>
              <th scope="col" className="px-3 py-2 text-left font-medium">Texto / fondo</th>
              <th scope="col" className="px-3 py-2 text-right font-medium">Mínimo</th>
              <th scope="col" className="px-3 py-2 text-right font-medium">Ratio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {contraste.especiales.map((e) => (
              <tr key={e.uso}>
                <td className="px-3 py-2 text-muted">{e.uso}</td>
                <td className="px-3 py-2 font-mono text-caption text-subtle">{e.texto} / {e.fondo}</td>
                <td className="px-3 py-2 text-right font-mono text-subtle">{e.min}</td>
                {celda(ratio(fondo(e.texto), fondo(e.fondo)), e.min)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
