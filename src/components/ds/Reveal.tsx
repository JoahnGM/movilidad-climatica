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
}

/**
 * Fade-in hacia arriba cuando el bloque entra en pantalla (una sola vez).
 * Con movimiento reducido solo anima la opacidad (ver MotionProvider).
 */
export function Reveal({ children, delay = 0, index = 0, className, as = 'div' }: RevealProps) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: MOTION.slow, ease: MOTION.ease, delay: delay + index * MOTION.stagger }}
    >
      {children}
    </Comp>
  );
}
