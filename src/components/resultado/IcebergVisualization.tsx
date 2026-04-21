'use client';

import { motion } from 'framer-motion';
import type { IcebergId } from '@/lib/types';

interface Props {
  iceberg_id: IcebergId;
  nivel_nombre: string;
  iceberg_texto_corto: string;
  capas_activas: string[];
}

export default function IcebergVisualization({
  iceberg_id,
  nivel_nombre,
  iceberg_texto_corto,
  capas_activas,
}: Props) {
  console.log('[IcebergVisualization] iceberg_id:', iceberg_id);

  return (
    <div className="flex flex-col gap-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/icebergs/${iceberg_id}.png`}
          alt={nivel_nombre}
          className="w-full object-contain rounded-xl"
        />
      </motion.div>

      <div className="glassmorphism p-5 flex flex-col gap-3">
        <p className="text-base text-foreground leading-relaxed">
          {iceberg_texto_corto}
        </p>
        <p className="text-sm text-muted">
          Capas visibles para tu territorio:{' '}
          <span className="text-teal font-medium">{capas_activas.length}</span> de 4
        </p>
      </div>
    </div>
  );
}
