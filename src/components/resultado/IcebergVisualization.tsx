import { Mono, Text } from '@/components/ds';
import type { Idioma } from '@/lib/i18n/idioma';
import { nombreNivel, textosIceberg } from '@/lib/i18n/matriz';
import { UI } from '@/lib/i18n/ui';
import type { IcebergId, NivelId } from '@/lib/types';

interface Props {
  iceberg_id: IcebergId;
  nivel_id: NivelId;
  nivel_nombre: string;
  iceberg_texto_corto: string;
  /** Texto ampliado oficial (opcional): acompaña al corto bajo las capas. */
  iceberg_texto_ampliado?: string;
  capas_activas: string[];
  idioma?: Idioma;
}

const CAPAS = [1, 2, 3, 4];

/** Relleno de las capas visibles según el nivel (iceberg_n ↔ nivel_n). */
const RELLENO: Record<IcebergId, string> = {
  iceberg_1: 'bg-red',
  iceberg_2: 'bg-amber',
  iceberg_3: 'bg-blue',
  iceberg_4: 'bg-green',
};

/**
 * Iceberg oficial (imagen por nivel) + textos oficiales + capas activas. En inglés muestra la
 * traducción no oficial de los textos (los oficiales, en español, son los que guarda el resultado).
 */
export default function IcebergVisualization({ iceberg_id, nivel_id, nivel_nombre, iceberg_texto_corto, iceberg_texto_ampliado, capas_activas, idioma = 'es' }: Props) {
  const t = UI[idioma].resultado;
  const textos = textosIceberg(iceberg_id, iceberg_texto_corto, iceberg_texto_ampliado ?? '', idioma);
  return (
    <figure className="grid items-center gap-8 md:grid-cols-[auto_minmax(0,1fr)] md:gap-12">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/icebergs/${iceberg_id}.png`}
        alt={t.icebergAlt(nombreNivel(nivel_id, nivel_nombre, idioma), capas_activas.length)}
        className="mx-auto max-h-[28rem] w-auto max-w-full rounded-xl border border-border object-contain"
      />
      <figcaption className="flex flex-col gap-5">
        <Text variant="eyebrow">{t.tuIceberg}</Text>
        <p className="font-heading text-h4 font-medium tracking-tight text-foreground text-balance">{textos.corto}</p>
        <ol aria-label={t.capasAria} className="flex flex-col gap-1.5">
          {CAPAS.map((n) => {
            const activa = n <= capas_activas.length;
            return (
              <li key={n} className="flex items-center gap-3">
                <Mono size="caption" tone="muted" className="w-14">{t.capa} {n}</Mono>
                <span aria-hidden="true" className={`h-1.5 flex-1 rounded-full ${activa ? RELLENO[iceberg_id] : 'bg-sage'}`} />
                <span className="sr-only">{activa ? t.visible : t.noVisible}</span>
              </li>
            );
          })}
        </ol>
        {iceberg_texto_ampliado && (
          <Text variant="body" className="border-t border-border pt-5">{textos.ampliado}</Text>
        )}
        {t.traduccionNoOficial && <Text variant="caption" tone="muted">{t.traduccionNoOficial}</Text>}
      </figcaption>
    </figure>
  );
}
