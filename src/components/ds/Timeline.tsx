import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { toneSolid, type Tone } from './tones';
import { Mono, Text } from './Typography';

export interface TimelineItem {
  /** Fecha o año ya formateado ("16-abr-2024", "2026"). */
  fecha: string;
  titulo: string;
  descripcion?: ReactNode;
  /** Normalmente un `<SourceLink>`. */
  fuente?: ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
  tone?: Tone;
  className?: string;
}

/** Línea de tiempo vertical (lista ordenada) para hitos con fecha: sentencias, leyes, procesos. */
export function Timeline({ items, tone = 'green', className }: TimelineProps) {
  return (
    <ol className={cn('relative flex flex-col gap-8 border-l border-border pl-8', className)}>
      {items.map((item) => (
        <li key={`${item.fecha}-${item.titulo}`} className="relative flex flex-col gap-1.5">
          <span aria-hidden="true" className={cn('absolute top-1.5 -left-[2.3125rem] size-3 rounded-full ring-4 ring-background', toneSolid[tone])} />
          <Mono size="caption" tone="muted" className="uppercase tracking-eyebrow">{item.fecha}</Mono>
          <Text as="span" variant="body" tone="default" weight="semibold">{item.titulo}</Text>
          {item.descripcion && <Text variant="small">{item.descripcion}</Text>}
          {item.fuente}
        </li>
      ))}
    </ol>
  );
}
