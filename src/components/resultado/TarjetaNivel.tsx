import { Card, Text } from '@/components/ds';
import { BANNER_EJEMPLO } from '@/lib/contenido/ejemplo-resultado';
import { BANNER_EJEMPLO_EN } from '@/lib/contenido/traducciones/en';
import type { Idioma } from '@/lib/i18n/idioma';
import { UI } from '@/lib/i18n/ui';
import type { DiagnosticoResult } from '@/lib/types';
import DimensionBar from './DimensionBar';
import NivelBadge from './NivelBadge';

interface Props {
  resultado: DiagnosticoResult;
  /** Datos ficticios: muestra el badge EJEMPLO (obligatorio). */
  ejemplo?: boolean;
  /** Franja de aviso dentro de la tarjeta (por defecto, igual a `ejemplo`). Apágala si la vista ya muestra el Banner. */
  aviso?: boolean;
  /** Fecha ya formateada. */
  fecha?: string;
  idioma?: Idioma;
  className?: string;
}

/**
 * Resumen del resultado: municipio, puntaje, nivel y las 6 dimensiones.
 * Es la cabecera de `ResultadoDiagnostico` y la tarjeta del hero: la misma pieza en el demo y en el resultado real.
 */
export default function TarjetaNivel({ resultado, ejemplo, aviso = ejemplo, fecha, idioma = 'es', className }: Props) {
  return (
    <Card variant="raised" className={className}>
      {aviso && (
        <p role="note" className="-mx-card -mt-card mb-1 rounded-t-card bg-amber/15 px-card py-2.5 text-caption font-medium text-amber-ink">
          {idioma === 'en' ? BANNER_EJEMPLO_EN : BANNER_EJEMPLO}
        </p>
      )}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Text variant="eyebrow">{UI[idioma].resultado.eyebrow}</Text>
          <p className="font-heading text-h3 font-semibold tracking-heading text-foreground text-balance">{resultado.municipio}</p>
          {fecha && <Text variant="caption" tone="muted">{fecha}</Text>}
        </div>
        <NivelBadge nivel_id={resultado.nivel_id} nivel_nombre={resultado.nivel_nombre} puntaje={resultado.puntaje_total} ejemplo={ejemplo} idioma={idioma} />
      </div>
      <div className="flex flex-col gap-2.5 border-t border-border pt-5">
        {resultado.dimensiones_resumen.map((d) => (
          <DimensionBar key={d.id} {...d} compacta idioma={idioma} />
        ))}
      </div>
    </Card>
  );
}
