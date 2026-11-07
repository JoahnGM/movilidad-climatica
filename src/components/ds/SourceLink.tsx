import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SourceLinkProps {
  /** Institución o documento: "IDMC GRID 2025", "UNGRD". */
  fuente: string;
  /** Año de la fuente. */
  anio?: number | string;
  /** URL de la fuente primaria. Sin URL se muestra como texto. */
  href?: string;
  /** Muestra el prefijo "Fuente:" (por defecto sí). */
  prefijo?: boolean;
  className?: string;
}

/** Cita de fuente en una línea. Abre en pestaña nueva y lo anuncia a lectores de pantalla. */
export function SourceLink({ fuente, anio, href, prefijo = true, className }: SourceLinkProps) {
  const etiqueta = anio ? `${fuente}, ${anio}` : fuente;
  return (
    <span className={cn('text-caption text-subtle', className)}>
      {prefijo && 'Fuente: '}
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-muted underline decoration-border-strong underline-offset-2 transition-colors hover:text-teal hover:decoration-teal"
        >
          {etiqueta}
          <ExternalLink aria-hidden="true" className="size-3" />
          <span className="sr-only">(abre en una pestaña nueva)</span>
        </a>
      ) : (
        <span className="text-muted">{etiqueta}</span>
      )}
    </span>
  );
}
