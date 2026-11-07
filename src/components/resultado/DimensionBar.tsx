import { Badge, Mono, ProgressBar } from '@/components/ds';
import type { Idioma } from '@/lib/i18n/idioma';
import { nombreDimension } from '@/lib/i18n/matriz';
import { UI } from '@/lib/i18n/ui';
import type { DimensionId, EstadoDimension } from '@/lib/types';
import { TONO_ESTADO } from './tonos';

interface Props {
  id: DimensionId;
  nombre: string;
  subtotal: number;
  maximo: number;
  estado: EstadoDimension;
  /** Versión de una línea (para tarjetas resumen). */
  compacta?: boolean;
  idioma?: Idioma;
}

export default function DimensionBar({ id, nombre, subtotal, maximo, estado, compacta, idioma = 'es' }: Props) {
  const tono = TONO_ESTADO[estado];
  const etiqueta = nombreDimension(id, nombre, idioma);
  const label = `${etiqueta}: ${subtotal} / ${maximo}`;
  if (compacta) {
    return (
      <div className="grid grid-cols-[minmax(0,1fr)_38%_2.25rem] items-center gap-3">
        <span className="text-caption leading-tight text-muted">{etiqueta}</span>
        <ProgressBar value={subtotal} max={maximo} label={label} tone={tono === 'blue' ? 'green' : tono} size="sm" />
        <Mono size="caption" tone="muted" className="text-right">{subtotal}/{maximo}</Mono>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <span className="text-small font-medium leading-snug text-foreground">{etiqueta}</span>
        <Mono size="small" tone="muted" className="shrink-0">{subtotal}/{maximo}</Mono>
      </div>
      <ProgressBar value={subtotal} max={maximo} label={label} tone={tono} />
      <Badge tone={tono} size="sm">{UI[idioma].resultado.estados[estado]}</Badge>
    </div>
  );
}
