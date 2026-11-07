import { cn } from '@/lib/utils';
import { SourceLink } from './SourceLink';
import { Mono, Text } from './Typography';
import type { Tone } from './tones';

export interface CifraConFuenteProps {
  /** Valor ya formateado ("91.000"). */
  valor: string;
  /** Unidad o sujeto de la cifra ("desplazamientos por desastres"). */
  unidad?: string;
  /** Qué mide, en una línea. */
  definicion: string;
  /** Institución o documento fuente ("IDMC GRID 2025"). */
  fuente: string;
  /** Año del dato o de la publicación. */
  anio: number | string;
  /** URL de la fuente primaria. */
  enlace?: string;
  /** Aclaración opcional (alcance, advertencia). */
  nota?: string;
  tone?: Tone | 'default';
  size?: 'md' | 'lg';
  /** Textos de la cita de fuente (por defecto en español). */
  textoFuente?: string;
  textoNuevaPestana?: string;
  className?: string;
}

/**
 * Cifra publicable: valor · definición · fuente · año · enlace. Recibe los campos tal cual.
 * Con `src/lib/contenido`: `<CifraConFuente valor={c.valor} unidad={c.unidad} definicion={c.definicion}
 *   fuente={c.fuente.institucion} anio={c.anio} enlace={c.fuente.url} nota={c.notas} />`
 */
export function CifraConFuente({
  valor, unidad, definicion, fuente, anio, enlace, nota, tone = 'default', size = 'lg', textoFuente, textoNuevaPestana, className,
}: CifraConFuenteProps) {
  return (
    <figure className={cn('flex flex-col gap-3', className)}>
      <Mono size={size === 'lg' ? 'metric' : 'lg'} tone={tone}>{valor}</Mono>
      <figcaption className="flex flex-col gap-2">
        {unidad && <Text variant="eyebrow">{unidad}</Text>}
        <Text variant="small">{definicion}</Text>
        {nota && <Text variant="caption" tone="muted">{nota}</Text>}
        <SourceLink fuente={fuente} anio={anio} href={enlace} textoFuente={textoFuente} textoNuevaPestana={textoNuevaPestana} />
      </figcaption>
    </figure>
  );
}
