'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MOTION } from './motion';
import { toneSolid, type Tone } from './tones';

export interface ProgressBarProps {
  value: number;
  max: number;
  /** Nombre accesible ("Reconocimiento: 5 de 9"). */
  label: string;
  tone?: Tone;
  size?: 'sm' | 'md';
  /** Anima el llenado al entrar en pantalla (por defecto sí). Con `false`, sigue el valor en vivo. */
  animate?: boolean;
  className?: string;
}

/** Barra de avance o puntaje (`role="progressbar"` con valores ARIA). */
export function ProgressBar({ value, max, label, tone = 'green', size = 'md', animate = true, className }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn('w-full overflow-hidden rounded-full bg-sage', size === 'md' ? 'h-2' : 'h-1.5', className)}
    >
      {animate ? (
        <motion.div
          className={cn('h-full rounded-full', toneSolid[tone])}
          initial={{ width: '0%' }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: MOTION.slow * 1.3, ease: MOTION.ease }}
        />
      ) : (
        <div className={cn('h-full rounded-full transition-[width] duration-700 ease-out', toneSolid[tone])} style={{ width: `${pct}%` }} />
      )}
    </div>
  );
}
