import { cn } from '@/lib/utils';
import { Mono, Text } from './Typography';
import type { Tone } from './tones';

export interface StatProps {
  /** Valor ya formateado ("536.000"). El DS no formatea ni calcula. */
  value: string;
  /** Etiqueta corta bajo el valor. */
  label?: string;
  /** Descripción en una o dos líneas. */
  description?: string;
  tone?: Tone | 'default';
  className?: string;
}

/** Cifra protagonista sin fuente. Si la cifra se publica como dato, usa `CifraConFuente`. */
export function Stat({ value, label, description, tone = 'default', className }: StatProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <Mono size="metric" tone={tone}>{value}</Mono>
      {label && <Text variant="eyebrow">{label}</Text>}
      {description && <Text variant="small">{description}</Text>}
    </div>
  );
}
