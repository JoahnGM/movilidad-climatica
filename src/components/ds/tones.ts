/**
 * Tonos semánticos del DS. Cada tono mapea a clases completas de Tailwind
 * (literales, para que Tailwind las detecte).
 *
 *  green   → marca, acción principal, fortaleza, nivel 4, evidencia
 *  blue    → información, en desarrollo, nivel 3, mediano plazo
 *  amber   → advertencia, brecha, nivel 2, corto plazo, ejemplo
 *  red     → crítico, nivel 1, urgencia inmediata
 *  violet  → IA y funciones experimentales
 *  neutral → sin carga semántica
 */
export type Tone = 'green' | 'blue' | 'amber' | 'red' | 'violet' | 'neutral';

export const TONES: readonly Tone[] = ['green', 'blue', 'amber', 'red', 'violet', 'neutral'];

/** Texto con contraste AA (≥4.5:1) sobre cualquier superficie del DS. */
export const toneText: Record<Tone, string> = {
  green: 'text-green-ink',
  blue: 'text-blue-ink',
  amber: 'text-amber-ink',
  red: 'text-red-ink',
  violet: 'text-violet-ink',
  neutral: 'text-muted',
};

/** Borde suave. */
export const toneBorder: Record<Tone, string> = {
  green: 'border-green/30',
  blue: 'border-blue/30',
  amber: 'border-amber/40',
  red: 'border-red/30',
  violet: 'border-violet/30',
  neutral: 'border-border',
};

/** Borde izquierdo de acento (3px). */
export const toneAccent: Record<Tone, string> = {
  green: 'border-l-green',
  blue: 'border-l-blue',
  amber: 'border-l-amber',
  red: 'border-l-red',
  violet: 'border-l-violet',
  neutral: 'border-l-border-strong',
};

/** Fondo tenue. */
export const toneSoftBg: Record<Tone, string> = {
  green: 'bg-green/10',
  blue: 'bg-blue/10',
  amber: 'bg-amber/15',
  red: 'bg-red/10',
  violet: 'bg-violet/10',
  neutral: 'bg-surface',
};

/** Relleno sólido (barras, puntos). */
export const toneSolid: Record<Tone, string> = {
  green: 'bg-green',
  blue: 'bg-blue',
  amber: 'bg-amber',
  red: 'bg-red',
  violet: 'bg-violet',
  neutral: 'bg-subtle',
};
