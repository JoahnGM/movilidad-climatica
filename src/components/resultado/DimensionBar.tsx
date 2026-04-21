'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { COLORES_ESTADO } from '@/lib/matriz';
import type { DimensionId, EstadoDimension } from '@/lib/types';

interface Props {
  id: DimensionId;
  nombre: string;
  subtotal: number;
  maximo: number;
  estado: EstadoDimension;
}

const ESTADO_LABEL: Record<EstadoDimension, string> = {
  fortaleza:      'Fortaleza',
  en_desarrollo:  'En desarrollo',
  brecha_critica: 'Brecha crítica',
};

export default function DimensionBar({ nombre, subtotal, maximo, estado }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const pct = maximo > 0 ? (subtotal / maximo) * 100 : 0;
  const colores = COLORES_ESTADO[estado];

  return (
    <div ref={ref} className="flex flex-col gap-0">
      {/* Nombre + puntaje */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-sm font-semibold text-foreground leading-snug">{nombre}</span>
        <span
          className="text-xs shrink-0"
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            color: colores.text,
          }}
        >
          {subtotal}/{maximo}
        </span>
      </div>

      {/* Barra de progreso */}
      <div
        className="w-full h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: '#1E2A45' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: colores.border }}
          initial={{ width: '0%' }}
          animate={{ width: inView ? `${pct}%` : '0%' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>

      {/* Badge de estado */}
      <div className="flex mt-3">
        <span
          className="text-xs px-2 py-0.5 rounded-full border font-medium"
          style={{
            backgroundColor: colores.bg,
            borderColor: colores.border,
            color: colores.text,
          }}
        >
          {ESTADO_LABEL[estado]}
        </span>
      </div>
    </div>
  );
}
