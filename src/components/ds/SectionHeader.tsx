import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Heading, Text, type TextTone } from './Typography';

export interface SectionHeaderProps {
  /** Rótulo en mayúsculas sobre el título. */
  eyebrow?: string;
  eyebrowTone?: TextTone;
  title: ReactNode;
  /** Párrafo de entrada (lead). */
  lead?: ReactNode;
  /** Nivel semántico del título (h2 por defecto dentro de una Section). */
  as?: 'h1' | 'h2' | 'h3';
  size?: 'h1' | 'h2' | 'h3';
  className?: string;
}

/** Encabezado de sección: eyebrow + título + lead, ancho de lectura limitado. */
export function SectionHeader({ eyebrow, eyebrowTone = 'teal', title, lead, as = 'h2', size, className }: SectionHeaderProps) {
  return (
    <header className={cn('flex max-w-3xl flex-col gap-6', className)}>
      {eyebrow && <Text variant="eyebrow" tone={eyebrowTone}>{eyebrow}</Text>}
      <Heading as={as} size={size ?? (as === 'h1' ? 'h1' : as === 'h3' ? 'h3' : 'h1')}>{title}</Heading>
      {lead && <Text variant="lead" tone="default" className="max-w-2xl text-foreground/90">{lead}</Text>}
    </header>
  );
}
