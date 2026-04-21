import { Clock } from 'lucide-react';
import type { DimensionId, UrgenciaType } from '@/lib/types';

interface Props {
  dimension: DimensionId;
  area: string;
  accion: string;
  urgencia: UrgenciaType;
}

const URGENCIA_COLOR: Record<UrgenciaType, string> = {
  inmediata:      '#EF4444',
  corto_plazo:    '#F59E0B',
  mediano_plazo:  '#60A5FA',
};

const URGENCIA_LABEL: Record<UrgenciaType, string> = {
  inmediata:     'Inmediata',
  corto_plazo:   'Corto plazo',
  mediano_plazo: 'Mediano plazo',
};

export default function RecomendacionCard({ area, accion, urgencia }: Props) {
  const color = URGENCIA_COLOR[urgencia];
  const label = URGENCIA_LABEL[urgencia];

  return (
    <div
      className="glassmorphism p-6 flex flex-col gap-5 border-l-4"
      style={{ borderLeftColor: color }}
    >
      {/* Badge de urgencia */}
      <span
        className="text-xs font-semibold uppercase tracking-wider"
        style={{ color }}
      >
        {label}
      </span>

      {/* Área */}
      <p
        className="font-semibold text-foreground text-sm leading-snug"
        style={{ fontFamily: 'var(--font-syne), sans-serif' }}
      >
        {area}
      </p>

      {/* Acción */}
      <p className="text-sm text-muted leading-relaxed">{accion}</p>

      {/* Urgencia con ícono */}
      <div className="flex items-center gap-1.5" style={{ color }}>
        <Clock size={13} />
        <span className="text-xs">{label}</span>
      </div>
    </div>
  );
}
