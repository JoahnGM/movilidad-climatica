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

/**
 * Encabezado de sección con fade-in. `start` (por defecto): en escritorio, título a la izquierda y
 * lead a la derecha, alineados abajo (usa todo el ancho, sin columna vacía). `center`: apilado y centrado.
 */
export function SectionHeader({ eyebrow, title, lead, as = 'h2', align = 'start', className }: SectionHeaderProps) {
  const titulo = <Heading as={as} size={as === 'h1' ? 'h1' : as === 'h3' ? 'h3' : 'h2'}>{title}</Heading>;
  if (align === 'center') {
    return (
      <Reveal className={cn('mx-auto flex max-w-2xl flex-col items-center gap-5 text-center', className)}>
        {eyebrow && <Text variant="eyebrow">{eyebrow}</Text>}
        {titulo}
        {lead && <Text variant="lead">{lead}</Text>}
      </Reveal>
    );
  }
  return (
    <Reveal className={cn('grid gap-5 lg:grid-cols-2 lg:items-end lg:gap-16', className)}>
      <div className="flex max-w-2xl flex-col gap-5">
        {eyebrow && <Text variant="eyebrow">{eyebrow}</Text>}
        {titulo}
      </div>
      {lead && <Text variant="lead" className="max-w-xl lg:pb-1">{lead}</Text>}
    </Reveal>
  );
}
