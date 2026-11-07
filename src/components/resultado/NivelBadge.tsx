import { Badge, Mono } from '@/components/ds';
import type { Idioma } from '@/lib/i18n/idioma';
import { nombreNivel } from '@/lib/i18n/matriz';
import { UI } from '@/lib/i18n/ui';
import type { NivelId } from '@/lib/types';
import { TONO_NIVEL, numeroNivel } from './tonos';

interface Props {
  nivel_id: NivelId;
  nivel_nombre: string;
  puntaje: number;
  /** Muestra el badge "EJEMPLO" (obligatorio con datos ficticios). */
  ejemplo?: boolean;
  idioma?: Idioma;
}

/** Puntaje total + nivel oficial. Es la misma pieza en el demo y en el resultado real. */
export default function NivelBadge({ nivel_id, nivel_nombre, puntaje, ejemplo, idioma = 'es' }: Props) {
  const t = UI[idioma].resultado;
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
      <Mono size="metric" className="leading-none">
        {puntaje}
        <span className="text-h4 text-subtle">/54</span>
      </Mono>
      <div className="flex flex-wrap gap-1.5">
        {ejemplo && <Badge tone="amber" variant="solid" size="sm">{t.ejemplo}</Badge>}
        <Badge tone={TONO_NIVEL[nivel_id]} className="whitespace-normal">
          {t.nivel} {numeroNivel(nivel_id)} · {nombreNivel(nivel_id, nivel_nombre, idioma)}
        </Badge>
      </div>
    </div>
  );
}
