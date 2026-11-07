/**
 * Tokens de movimiento para Framer Motion.
 * Espejo de las variables --motion-* de src/app/globals.css (check:ds verifica que coincidan).
 */
export const MOTION = {
  /** 150ms — hover, foco, cambios de color */
  fast: 0.15,
  /** 300ms — abrir/cerrar, acordeones, diálogos */
  base: 0.3,
  /** 550ms — entrada de bloques al hacer scroll */
  slow: 0.55,
  /** Desplazamiento vertical del fade-in, en px */
  distance: 24,
  /** Curva por defecto (--ease-out-soft) */
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  /** Retraso entre elementos hermanos en una cuadrícula */
  stagger: 0.07,
} as const;

/** Variantes de fade-in hacia arriba, reutilizables con `variants`. */
export const fadeUp = {
  hidden: { opacity: 0, y: MOTION.distance },
  visible: { opacity: 1, y: 0 },
} as const;
