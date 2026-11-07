/**
 * Tonos semánticos del DS. Cada tono mapea a clases completas de Tailwind
 * (literales, para que Tailwind las detecte).
 *
 * Significado:
 *  teal    → acción principal, marca, fortaleza, nivel 4
 *  blue    → información, en desarrollo, nivel 3, mediano plazo
 *  amber   → advertencia, brecha, nivel 2, corto plazo, ejemplo
 *  red     → crítico, nivel 1, urgencia inmediata
 *  violet  → IA y funciones experimentales
 *  neutral → sin carga semántica
 */
export type Tone = 'teal' | 'blue' | 'amber' | 'red' | 'violet' | 'neutral';

export const TONES: readonly Tone[] = ['teal', 'blue', 'amber', 'red', 'violet', 'neutral'];

/** Texto con contraste AA (≥4.5:1) sobre cualquier superficie del DS. */
export const toneText: Record<Tone, string> = {
  teal: 'text-teal',
  blue: 'text-blue',
  amber: 'text-amber',
  red: 'text-red-light',
  violet: 'text-violet-light',
  neutral: 'text-muted',
};

/** Borde suave (tarjetas, chips). */
export const toneBorder: Record<Tone, string> = {
  teal: 'border-teal/40',
  blue: 'border-blue/40',
  amber: 'border-amber/40',
  red: 'border-red/40',
  violet: 'border-violet/50',
  neutral: 'border-border-glass',
};

/** Borde izquierdo de acento (4px). */
export const toneAccent: Record<Tone, string> = {
  teal: 'border-l-teal',
  blue: 'border-l-blue',
  amber: 'border-l-amber',
  red: 'border-l-red',
  violet: 'border-l-violet',
  neutral: 'border-l-border-strong',
};

/** Fondo tenue (10%). */
export const toneSoftBg: Record<Tone, string> = {
  teal: 'bg-teal/10',
  blue: 'bg-blue/10',
  amber: 'bg-amber/10',
  red: 'bg-red/10',
  violet: 'bg-violet/10',
  neutral: 'bg-glass',
};

/** Fondo muy tenue (5%) para bloques grandes. */
export const toneWashBg: Record<Tone, string> = {
  teal: 'bg-teal/5',
  blue: 'bg-blue/5',
  amber: 'bg-amber/5',
  red: 'bg-red/5',
  violet: 'bg-violet/5',
  neutral: 'bg-glass',
};

/** Relleno sólido (barras, puntos, botones). */
export const toneSolid: Record<Tone, string> = {
  teal: 'bg-teal',
  blue: 'bg-blue',
  amber: 'bg-amber',
  red: 'bg-red',
  violet: 'bg-violet',
  neutral: 'bg-subtle',
};
