import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SourceLinkProps {
  /** Institución o documento: "IDMC GRID 2025". */
  fuente: string;
  /** Año de la fuente. */
  anio?: number | string;
  /** URL de la fuente primaria. Sin URL se muestra como texto. */
  href?: string;
  /** Muestra el prefijo "Fuente:" (por defecto sí). */
  prefijo?: boolean;
  /** Textos de la interfaz (por defecto en español). */
  textoFuente?: string;
  textoNuevaPestana?: string;
  className?: string;
}

/** Cita de fuente en una línea, en monoespaciada. Abre en pestaña nueva y lo anuncia. */
export function SourceLink({ fuente, anio, href, prefijo = true, textoFuente = 'Fuente: ', textoNuevaPestana = '(abre en una pestaña nueva)', className }: SourceLinkProps) {
  const etiqueta = anio ? `${fuente}, ${anio}` : fuente;
  return (
    <span className={cn('font-mono text-caption text-subtle', className)}>
      {prefijo && textoFuente}
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 underline decoration-border-strong underline-offset-2 transition-colors hover:text-green-ink hover:decoration-green"
        >
          {etiqueta}
          <ArrowUpRight aria-hidden="true" className="size-3" />
          <span className="sr-only">{textoNuevaPestana}</span>
        </a>
      ) : (
        <span>{etiqueta}</span>
      )}
    </span>
  );
}
