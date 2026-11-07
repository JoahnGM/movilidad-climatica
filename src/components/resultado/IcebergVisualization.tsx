import { Mono, Text } from '@/components/ds';
import type { IcebergId } from '@/lib/types';

interface Props {
  iceberg_id: IcebergId;
  nivel_nombre: string;
  iceberg_texto_corto: string;
  capas_activas: string[];
}

const CAPAS = [1, 2, 3, 4];

/** Relleno de las capas visibles según el nivel (iceberg_n ↔ nivel_n). */
const RELLENO: Record<IcebergId, string> = {
  iceberg_1: 'bg-red',
  iceberg_2: 'bg-amber',
  iceberg_3: 'bg-blue',
  iceberg_4: 'bg-green',
};

/** Iceberg oficial (imagen por nivel) + texto corto exacto + capas activas. */
export default function IcebergVisualization({ iceberg_id, nivel_nombre, iceberg_texto_corto, capas_activas }: Props) {
  return (
    <figure className="flex flex-col gap-5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/icebergs/${iceberg_id}.png`}
        alt={`Iceberg del nivel ${nivel_nombre}: ${capas_activas.length} de 4 capas visibles`}
        className="w-full rounded-xl border border-border object-contain"
      />
      <figcaption className="flex flex-col gap-4">
        <Text variant="body" tone="default">{iceberg_texto_corto}</Text>
        <ol aria-label="Capas del iceberg" className="flex flex-col gap-1.5">
          {CAPAS.map((n) => {
            const activa = n <= capas_activas.length;
            return (
              <li key={n} className="flex items-center gap-3">
                <Mono size="caption" tone="muted" className="w-14">Capa {n}</Mono>
                <span aria-hidden="true" className={`h-1.5 flex-1 rounded-full ${activa ? RELLENO[iceberg_id] : 'bg-sage'}`} />
                <span className="sr-only">{activa ? 'visible' : 'aún no visible'}</span>
              </li>
            );
          })}
        </ol>
      </figcaption>
    </figure>
  );
}
