import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Reveal } from './Reveal';
import { Heading, Text } from './Typography';

export interface SectionHeaderProps {
  /** Rótulo monoespaciado en mayúsculas sobre el título. */
  eyebrow?: string;
  title: ReactNode;
  /** Párrafo de entrada (lead). */
  lead?: ReactNode;
  /** Nivel semántico del título (h2 por defecto dentro de una Section). */
  as?: 'h1' | 'h2' | 'h3';
  align?: 'start' | 'center';
  className?: string;
}

/** Encabezado de sección: eyebrow + título + lead, ancho de lectura limitado, con fade-in. */
export function SectionHeader({ eyebrow, title, lead, as = 'h2', align = 'start', className }: SectionHeaderProps) {
  return (
    <Reveal className={cn('flex max-w-2xl flex-col gap-5', align === 'center' && 'mx-auto items-center text-center', className)}>
      {eyebrow && <Text variant="eyebrow">{eyebrow}</Text>}
      <Heading as={as} size={as === 'h1' ? 'h1' : as === 'h3' ? 'h3' : 'h2'}>{title}</Heading>
      {lead && <Text variant="lead">{lead}</Text>}
    </Reveal>
  );
}
