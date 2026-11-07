import { Check, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type EstadoEtapa = 'pendiente' | 'actual' | 'completa';

export interface Etapa {
  id: string;
  titulo: string;
  /** Línea de apoyo bajo el título (visible solo en la etapa actual si `detalleSoloActual`). */
  detalle?: ReactNode;
  icon?: LucideIcon;
  estado: EstadoEtapa;
}

export interface EtapasProps {
  etapas: Etapa[];
  /** Nombre accesible de la lista ("Avance del diagnóstico"). */
  label: string;
  /** Muestra el detalle solo en la etapa actual (por defecto sí). */
  detalleSoloActual?: boolean;
  className?: string;
}

/**
 * Lista vertical de etapas con estado (pendiente · actual · completa). La etapa actual lleva
 * `aria-current="step"`. Para avances de procesos: entrevista por dimensiones, análisis, síntesis.
 */
export function Etapas({ etapas, label, detalleSoloActual = true, className }: EtapasProps) {
  return (
    <ol aria-label={label} className={cn('relative flex flex-col', className)}>
      {etapas.map((e, i) => {
        const Icon = e.icon;
        const ultima = i === etapas.length - 1;
        return (
          <li key={e.id} aria-current={e.estado === 'actual' ? 'step' : undefined} className="relative flex gap-3 pb-4 last:pb-0">
            {!ultima && (
              <span aria-hidden="true" className={cn('absolute top-8 bottom-0 left-[15px] w-px', e.estado === 'completa' ? 'bg-green' : 'bg-border')} />
            )}
            <span
              aria-hidden="true"
              className={cn(
                'relative z-[1] flex size-8 shrink-0 items-center justify-center rounded-full border text-caption transition-colors duration-300 [&_svg]:size-4',
                e.estado === 'completa' && 'border-green bg-green text-on-accent',
                e.estado === 'actual' && 'border-green bg-surface-raised text-green-ink ring-4 ring-green/15',
                e.estado === 'pendiente' && 'border-border bg-surface-raised text-subtle',
              )}
            >
              {e.estado === 'completa' ? <Check /> : Icon ? <Icon /> : <span className="font-mono">{i + 1}</span>}
            </span>
            <div className="flex min-w-0 flex-col gap-0.5 pt-1.5">
              <span className={cn('text-small leading-tight', e.estado === 'pendiente' ? 'text-subtle' : 'text-foreground', e.estado === 'actual' && 'font-medium')}>
                {e.titulo}
                <span className="sr-only">
                  {e.estado === 'completa' ? ' (completa)' : e.estado === 'actual' ? ' (en curso)' : ' (pendiente)'}
                </span>
              </span>
              {e.detalle && (!detalleSoloActual || e.estado === 'actual') && (
                <span className="text-caption text-subtle">{e.detalle}</span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
