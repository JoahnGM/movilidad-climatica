'use client';

import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';
import { MOTION } from './motion';

/**
 * Configura Framer Motion para todo el sitio: respeta `prefers-reduced-motion`
 * (desactiva desplazamientos y escalas; conserva solo la opacidad) y fija la
 * curva y duración por defecto. Se monta una sola vez en `src/app/layout.tsx`.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: MOTION.slow, ease: MOTION.ease }}>
      {children}
    </MotionConfig>
  );
}
