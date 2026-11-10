import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ImageResponse } from 'next/og';

/**
 * Imagen de vista previa al compartir el enlace (WhatsApp, correo, redes) — plan-feedback §10.2.
 *
 * Vive fuera de src/app porque ImageResponse solo acepta estilos en línea: los colores se leen
 * de los tokens de src/app/globals.css (una sola fuente de la marca), no se escriben aquí.
 * WhatsApp exige og:image absoluta, < 600 KB y proporción ≤ 4:1 (1200×630 cumple).
 */
export const TAMANO_OG = { width: 1200, height: 630 };

function token(css: string, nombre: string): string {
  const m = css.match(new RegExp(`--color-${nombre}:\\s*([^;]+);`));
  if (!m) throw new Error(`Token --color-${nombre} no encontrado en globals.css`);
  return m[1].trim();
}

/** Crestas de la cordillera (eco del hero), como polilíneas con ruido determinista. */
function crestas(ancho: number): string[] {
  const filas = 7;
  const lineas: string[] = [];
  for (let f = 0; f < filas; f++) {
    const base = 150 + f * 28;
    const amplitud = 110 - f * 9;
    const puntos: string[] = [];
    for (let x = 0; x <= ancho; x += 12) {
      const u = x / ancho;
      const y =
        base -
        amplitud *
          (0.55 * Math.pow(Math.sin(Math.PI * (u * 1.6 + f * 0.07)), 2) +
            0.3 * Math.pow(Math.sin(Math.PI * (u * 3.3 + 0.4 + f * 0.11)), 2) +
            0.15 * Math.sin(Math.PI * (u * 7.1 + f * 0.3)));
      puntos.push(`${x},${y.toFixed(1)}`);
    }
    lineas.push(puntos.join(' '));
  }
  return lineas;
}

export function imagenCompartir(textos: { titulo: string; acento: string; bajada: string; marca: string }) {
  const css = readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');
  const c = {
    fondo: token(css, 'background'),
    texto: token(css, 'foreground'),
    apoyo: token(css, 'muted'),
    marca: token(css, 'green'),
    suave: token(css, 'sage'),
  };
  const { width, height } = TAMANO_OG;

  return new ImageResponse(
    (
      <div style={{ width, height, display: 'flex', flexDirection: 'column', backgroundColor: c.fondo, position: 'relative' }}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', top: 0, left: 0 }}>
          {crestas(width).map((d, i) => (
            <polyline key={i} points={d} fill="none" stroke={c.texto} strokeWidth={2.2} strokeOpacity={0.16 + i * 0.05} strokeDasharray="1 6" strokeLinecap="round" />
          ))}
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', padding: '0 80px 72px' }}>
          <div style={{ display: 'flex', fontSize: 26, color: c.marca, marginBottom: 20, letterSpacing: 1 }}>{textos.marca}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', fontSize: 66, lineHeight: 1.05, fontWeight: 700, color: c.texto, letterSpacing: -2, maxWidth: 1000 }}>
            {textos.titulo}&nbsp;<span style={{ color: c.marca, fontStyle: 'italic' }}>{textos.acento}</span>
          </div>
          <div style={{ display: 'flex', fontSize: 30, color: c.apoyo, marginTop: 26, maxWidth: 940 }}>{textos.bajada}</div>
        </div>
        <div style={{ position: 'absolute', top: 0, left: 0, width, height: 10, backgroundColor: c.suave, display: 'flex' }} />
      </div>
    ),
    TAMANO_OG,
  );
}
