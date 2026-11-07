import { cn } from '@/lib/utils';
import { Mono, Text } from './Typography';
import type { Tone } from './tones';

export interface StatProps {
  /** Valor ya formateado ("536.000"). El DS no formatea ni calcula. */
  value: string;
  /** Etiqueta corta en mayúsculas bajo el valor. */
  label?: string;
  /** Descripción en una o dos líneas. */
  description?: string;
  /** Rótulo superior opcional ("Dato"). */
  eyebrow?: string;
  tone?: Tone;
  className?: string;
}

/** Cifra protagonista sin fuente. Si la cifra se publica, usa `CifraConFuente`. */
export function Stat({ value, label, description, eyebrow, tone = 'teal', className }: StatProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {eyebrow && <Text variant="eyebrow" tone="muted">{eyebrow}</Text>}
      <Mono size="metric" tone={tone} className="leading-none">{value}</Mono>
      {label && <Mono size="caption" tone={tone} className="font-semibold uppercase tracking-widest">{label}</Mono>}
      {description && <Text variant="small">{description}</Text>}
    </div>
  );
}
