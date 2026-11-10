'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { MOTION, fadeUp } from './motion';

export interface RevealProps {
  children: ReactNode;
  /** Retraso en segundos. Para cuadrículas usa `index` en vez de calcularlo. */
  delay?: number;
  /** Posición en una lista: agrega `index × MOTION.stagger` al retraso. */
  index?: number;
  className?: string;
  /** Elemento a renderizar (por defecto `div`). */
  as?: 'div' | 'li' | 'article';
  /**
   * Anima al montar en vez de al entrar en vista. Úsalo en el primer pantallazo (hero): con
   * `whileInView` y margen −80 px, un bloque cerca del borde inferior no aparecía sin scroll.
   */
  alMontar?: boolean;
}

/**
 * Fade-in hacia arriba cuando el bloque entra en pantalla (una sola vez).
 * Con movimiento reducido solo anima la opacidad (ver MotionProvider).
 */
export function Reveal({ children, delay = 0, index = 0, className, as = 'div', alMontar = false }: RevealProps) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      variants={fadeUp}
      initial="hidden"
      {...(alMontar ? { animate: 'visible' } : { whileInView: 'visible', viewport: { once: true, margin: '-80px' } })}
      transition={{ duration: MOTION.slow, ease: MOTION.ease, delay: delay + index * MOTION.stagger }}
    >
      {children}
    </Comp>
  );
}
