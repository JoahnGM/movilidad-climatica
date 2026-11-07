import { Badge, Card, Text } from '@/components/ds';
import type { Recomendacion } from '@/lib/types';
import { ETIQUETA_URGENCIA, TONO_URGENCIA } from './tonos';

/** Campos de la ruta progresiva: opcionales (resultados viejos no los traen). */
type Props = Pick<Recomendacion, 'dimension' | 'area' | 'accion' | 'urgencia'> &
  Partial<Pick<Recomendacion, 'primer_paso' | 'siguiente_paso' | 'ruta_ampliada' | 'para_quien'>>;

const PARA_QUIEN: Record<string, string> = {
  todos: 'Para todos los municipios',
  categoria_1_3: 'Municipios de categoría 1 a 3',
  categoria_4_6_PDET: 'Municipios de categoría 4 a 6 y PDET',
};

const RUTA = [
  { clave: 'primer_paso', etiqueta: 'Primer paso', plazo: '≤ 6 meses' },
  { clave: 'siguiente_paso', etiqueta: 'Siguiente paso', plazo: '6–18 meses' },
  { clave: 'ruta_ampliada', etiqueta: 'Ruta ampliada', plazo: '> 18 meses' },
] as const;

export default function RecomendacionCard({ area, accion, urgencia, primer_paso, siguiente_paso, ruta_ampliada, para_quien }: Props) {
  const tono = TONO_URGENCIA[urgencia];
  const pasos = { primer_paso, siguiente_paso, ruta_ampliada };
  const conRuta = RUTA.filter((r) => pasos[r.clave]);
  return (
    <Card as="article" variant="raised" accent={tono} className="h-full">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={tono} size="sm">{ETIQUETA_URGENCIA[urgencia]}</Badge>
        {para_quien && PARA_QUIEN[para_quien] && <Badge size="sm">{PARA_QUIEN[para_quien]}</Badge>}
      </div>
      <h4 className="font-heading text-h4 font-semibold tracking-tight text-foreground">{area}</h4>
      <Text variant="small">{accion}</Text>
      {conRuta.length > 0 && (
        <ol aria-label="Ruta sugerida" className="mt-1 flex flex-col gap-3 border-t border-border pt-4">
          {conRuta.map((r) => (
            <li key={r.clave} className="flex flex-col gap-0.5">
              <span className="font-mono text-caption text-subtle">{r.etiqueta} · {r.plazo}</span>
              <span className="text-small text-foreground">{pasos[r.clave]}</span>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
