import { cn } from '@/lib/utils';
import { SourceLink } from './SourceLink';
import { Mono, Text } from './Typography';
import type { Tone } from './tones';

export interface CifraConFuenteProps {
  /** Valor ya formateado ("91.000"). */
  valor: string;
  /** Unidad o sujeto de la cifra ("desplazamientos por desastres"). */
  unidad?: string;
  /** Qué mide, en una línea ("Movimientos forzados, no personas únicas, en 2024"). */
  definicion: string;
  /** Institución o documento fuente ("IDMC GRID 2025"). */
  fuente: string;
  /** Año del dato o de la publicación. */
  anio: number | string;
  /** URL de la fuente primaria. */
  enlace?: string;
  /** Aclaración opcional (alcance, advertencia). */
  nota?: string;
  tone?: Tone;
  size?: 'md' | 'lg';
  className?: string;
}

/**
 * Cifra publicable: valor · definición · fuente · año · enlace.
 * Recibe los campos tal cual; no busca, calcula ni valida datos.
 * Con `src/lib/contenido`: `<CifraConFuente valor={c.valor} unidad={c.unidad} definicion={c.definicion}
 *   fuente={c.fuente.institucion} anio={c.anio} enlace={c.fuente.url} nota={c.notas} />`
 */
export function CifraConFuente({
  valor,
  unidad,
  definicion,
  fuente,
  anio,
  enlace,
  nota,
  tone = 'teal',
  size = 'lg',
  className,
}: CifraConFuenteProps) {
  return (
    <figure className={cn('flex flex-col gap-3', className)}>
      <Mono size={size === 'lg' ? 'metric' : 'lg'} tone={tone} className="leading-none">
        {valor}
      </Mono>
      <figcaption className="flex flex-col gap-2">
        {unidad && (
          <Mono size="caption" tone={tone} className="font-semibold uppercase tracking-widest">
            {unidad}
          </Mono>
        )}
        <Text variant="small">{definicion}</Text>
        {nota && <Text variant="caption" tone="muted">{nota}</Text>}
        <SourceLink fuente={fuente} anio={anio} href={enlace} />
      </figcaption>
    </figure>
  );
}
