'use client';

import { useEffect, useRef } from 'react';

/**
 * Campo de partículas finas que dibuja cordilleras (implementación propia, sin dependencias).
 *
 * Principio visual: puntos de ~1px, casi transparentes y sin rejilla visible. El relieve sale
 * de la DENSIDAD: en las caras de las crestas que miran al observador los puntos se acumulan
 * y oscurecen; en los valles casi desaparecen. Cada fila es un perfil de montaña visto en
 * perspectiva; el conjunto se desplaza muy despacio.
 *
 * Rendimiento: escribe píxeles directo en un ImageData (sin trazos de canvas), resolución
 * interna limitada, 30 fps, pausa fuera de pantalla; con movimiento reducido, un solo cuadro.
 */

export interface FondoMontanasProps {
  /** Token de color de las partículas (nombre de --color-*, por defecto `foreground`). */
  colorToken?: string;
  /** Opacidad máxima de una partícula (0–1). */
  intensidad?: number;
  /** Velocidad del desplazamiento (0 = quieto). */
  velocidad?: number;
  /** Encuadre del terreno: desplaza la cordillera a lo largo del eje horizontal. */
  desfase?: number;
  className?: string;
}

function crearRuido(semilla: number) {
  const perm = new Uint8Array(512);
  const p = Array.from({ length: 256 }, (_, i) => i);
  let s = semilla;
  for (let i = 255; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const valor = (x: number, y: number) => perm[(perm[x & 255] + y) & 255] / 255;
  const suave = (t: number) => t * t * (3 - 2 * t);
  return (x: number, y: number) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const u = suave(x - xi), v = suave(y - yi);
    const a = valor(xi, yi), b = valor(xi + 1, yi), c = valor(xi, yi + 1), d = valor(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
}

function hexARgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/** Fondo de cordillera en partículas. Úsalo una sola vez por página (el hero). */
export function FondoMontanas({ colorToken = 'foreground', intensidad = 0.55, velocidad = 1, desfase = 20, className }: FondoMontanasProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ruido = crearRuido(4217);
    // Cordillera: ruido "ridged" de baja frecuencia
    const altura = (x: number, z: number) => {
      // Crestas: pocas octavas para que dominen las formas grandes, no los festones
      let h = 0, amp = 1, f = 1, norm = 0;
      for (let o = 0; o < 3; o++) {
        const n = ruido(x * f, z * f);
        h += (1 - Math.abs(2 * n - 1)) ** 1.3 * amp; // exponente bajo → laderas rectas, cumbres en "V" invertida
        norm += amp; amp *= 0.38; f *= 2.3;
      }
      // Macizo: envolvente suave de baja frecuencia que agrupa los picos en cordilleras
      const macizo = ruido(x * 0.3 + 7, z * 0.3 + 3);
      // Normalizado: p50 ≈ 0.4, p90 ≈ 0.8 (calibrado con 20.000 muestras)
      return Math.min(1, Math.max(0, ((h / norm) * (0.25 + 0.75 * macizo) - 0.12) / 0.55));
    };

    const color = getComputedStyle(document.documentElement).getPropertyValue(`--color-${colorToken}`).trim() || '#16352E';
    const [R, G, B] = hexARgb(color);
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const littleEndian = new Uint8Array(new Uint32Array([1]).buffer)[0] === 1;
    const PALETA = Array.from({ length: 256 }, (_, al) =>
      littleEndian ? ((al << 24) | (B << 16) | (G << 8) | R) >>> 0 : ((R << 24) | (G << 16) | (B << 8) | al) >>> 0,
    );

    let W = 0, H = 0;
    let img: ImageData | null = null;
    let buf: Uint32Array | null = null;
    let visible = true, raf = 0, t = 0, ultimo = performance.now();

    // Muestras por fila con jitter fijo: rompe la rejilla
    const FILAS = 90;
    const MUESTRAS = 900;
    const alturasA = new Float32Array(MUESTRAS);
    const alturasB = new Float32Array(MUESTRAS);
    const jitter = new Float32Array(FILAS * MUESTRAS);
    const azar = new Float32Array(FILAS * MUESTRAS);
    let s = 9;
    const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < jitter.length; i++) { jitter[i] = rnd() - 0.5; azar[i] = rnd(); }

    function medir() {
      const r = canvas!.getBoundingClientRect();
      // Resolución interna: nítida en retina sin disparar el costo
      const escala = Math.min(window.devicePixelRatio || 1, 1.5);
      W = Math.max(1, Math.round(r.width * escala));
      H = Math.max(1, Math.round(r.height * escala));
      canvas!.width = W;
      canvas!.height = H;
      img = ctx!.createImageData(W, H);
      buf = new Uint32Array(img.data.buffer);
    }

    function plot(x: number, y: number, a: number) {
      const xi = x | 0, yi = y | 0;
      if (xi < 0 || yi < 0 || xi >= W || yi >= H) return;
      const i = yi * W + xi;
      const previo = littleEndian ? buf![i] >>> 24 : buf![i] & 255;
      // acumula: donde caen varios puntos, se oscurece (densidad = relieve)
      buf![i] = PALETA[Math.min(255, previo + ((a * 255) | 0))];
    }

    function dibujar() {
      if (!buf || !img) return;
      buf.fill(0);
      const aspecto = W / H; // la frecuencia horizontal sigue al ancho: los picos no se aplanan en pantallas anchas
      // En pantallas angostas se toman menos muestras por fila: misma densidad visual, sin trazos saturados
      const paso = Math.max(1, Math.round(MUESTRAS / (W * 0.9)));
      // Altura de la fila anterior (más lejana) en cada muestra: sirve de "atrás" sin recalcular ruido
      let filaAnterior = alturasA, filaActual = alturasB;
      for (let f = 0; f < FILAS; f++) {
        // f = 0 fondo (lejos) → FILAS-1 frente (cerca)
        const k = f / (FILAS - 1);
        const cerca = Math.pow(k, 1.7);
        const yBase = H * (0.44 + 0.5 * cerca);           // la fila del fondo se apoya algo arriba de la mitad
        const ensanche = 1 + 1.4 * cerca;                  // filas cercanas más anchas
        const relieve = H * (0.42 - 0.34 * cerca);         // picos altos al fondo, valle al frente
        const alfaFila = intensidad * (0.3 + 0.7 * Math.sin(Math.PI * Math.min(1, k * 1.15)));
        const zx = (1 - k) * 2.6 - t * 0.02;
        for (let m = 0; m < MUESTRAS; m += paso) {
          const idx = f * MUESTRAS + m;
          const u = (m + 0.5 + jitter[idx]) / MUESTRAS;     // 0..1 sobre la fila
          const xw = (u - 0.5) * ensanche;
          const h = altura(xw * aspecto * 2.6 + desfase, zx);
          filaActual[m] = h;
          const hAtras = f === 0 ? h : filaAnterior[m];
          // Sombreado por densidad: caras que suben hacia el observador → más puntos
          const cara = Math.max(0, (h - hAtras) * 30);
          const densidad = Math.min(1, 0.06 * (1 - cerca) + 0.015 + h * h * 0.85 + cara);
          if (azar[idx] > densidad) continue;
          const x = W * 0.5 + xw * W;
          const y = yBase - Math.pow(h, 1.15) * relieve;
          plot(x, y, alfaFila * (0.22 + 0.78 * Math.min(1, h * 0.9 + cara)));
        }
        [filaAnterior, filaActual] = [filaActual, filaAnterior];
      }
      ctx!.putImageData(img, 0, 0);
    }

    // 30 fps; si dibujar cuesta más de 10 ms (equipo lento), baja a 15 fps para no trabar el scroll
    let msCuadro = 1000 / 30;
    let costoMedio = 0;
    function cuadro(ahora: number) {
      if (visible && !document.hidden) raf = requestAnimationFrame(cuadro);
      const dt = ahora - ultimo;
      if (dt < msCuadro) return;
      ultimo = ahora;
      t += (Math.min(dt, 100) / 16.7) * 0.1 * velocidad;
      const t0 = performance.now();
      dibujar();
      costoMedio = costoMedio * 0.9 + (performance.now() - t0) * 0.1;
      msCuadro = costoMedio > 10 ? 1000 / 15 : 1000 / 30;
    }

    function arrancar() {
      cancelAnimationFrame(raf);
      ultimo = performance.now();
      if (reducir || velocidad === 0) dibujar();
      else raf = requestAnimationFrame(cuadro);
    }

    medir();
    arrancar();

    const ro = new ResizeObserver(() => { medir(); dibujar(); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) arrancar(); else cancelAnimationFrame(raf);
    });
    io.observe(canvas);
    const onVis = () => { if (!document.hidden && visible) arrancar(); };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [colorToken, intensidad, velocidad, desfase]);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
