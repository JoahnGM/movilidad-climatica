import { Badge, Card, Text } from '@/components/ds';
import type { Idioma } from '@/lib/i18n/idioma';
import { UI } from '@/lib/i18n/ui';
import type { Recomendacion } from '@/lib/types';
import { TONO_URGENCIA } from './tonos';

/** Campos de la ruta progresiva: opcionales (resultados viejos no los traen). */
type Props = Pick<Recomendacion, 'dimension' | 'area' | 'accion' | 'urgencia'> &
  Partial<Pick<Recomendacion, 'primer_paso' | 'siguiente_paso' | 'ruta_ampliada' | 'para_quien'>> & { idioma?: Idioma };

const CLAVES_RUTA = ['primer_paso', 'siguiente_paso', 'ruta_ampliada'] as const;

export default function RecomendacionCard({ area, accion, urgencia, primer_paso, siguiente_paso, ruta_ampliada, para_quien, idioma = 'es' }: Props) {
  const t = UI[idioma].resultado;
  const tono = TONO_URGENCIA[urgencia];
  const pasos = { primer_paso, siguiente_paso, ruta_ampliada };
  const conRuta = CLAVES_RUTA.filter((c) => pasos[c]);
  return (
    <Card as="article" variant="raised" accent={tono} className="h-full">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={tono} size="sm">{t.urgencias[urgencia]}</Badge>
        {para_quien && t.paraQuien[para_quien] && <Badge size="sm">{t.paraQuien[para_quien]}</Badge>}
      </div>
      <h4 className="font-heading text-h4 font-semibold tracking-tight text-foreground">{area}</h4>
      <Text variant="small">{accion}</Text>
      {conRuta.length > 0 && (
        <ol aria-label={t.ruta} className="mt-1 flex flex-col gap-3 border-t border-border pt-4">
          {conRuta.map((c) => (
            <li key={c} className="flex flex-col gap-0.5">
              <span className="font-mono text-caption text-subtle">{t.pasosRuta[c][0]} · {t.pasosRuta[c][1]}</span>
              <span className="text-small text-foreground">{pasos[c]}</span>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
