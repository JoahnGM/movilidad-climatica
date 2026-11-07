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
  /** Anima el llenado al entrar en pantalla. */
  animate?: boolean;
  className?: string;
}

/** Barra de avance o puntaje (`role="progressbar"` con valores ARIA). */
export function ProgressBar({ value, max, label, tone = 'teal', size = 'md', animate = true, className }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn('w-full overflow-hidden rounded-full bg-border', size === 'md' ? 'h-2' : 'h-1.5', className)}
    >
      <motion.div
        className={cn('h-full rounded-full', toneSolid[tone])}
        initial={animate ? { width: '0%' } : false}
        whileInView={{ width: `${pct}%` }}
        animate={animate ? undefined : { width: `${pct}%` }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: MOTION.slow * 1.3, ease: MOTION.ease }}
      />
    </div>
  );
}
