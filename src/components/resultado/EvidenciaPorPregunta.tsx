import { Badge, Disclosure, DisclosureItem, Mono, Text } from '@/components/ds';
import type { Idioma } from '@/lib/i18n/idioma';
import { nombreDimension } from '@/lib/i18n/matriz';
import { UI } from '@/lib/i18n/ui';
import { DIMENSIONES } from '@/lib/matriz';
import type { AnalisisResult, DimensionScore } from '@/lib/types';

/** Evidencia citada por pregunta (verificabilidad): qué dijo la persona y qué puntaje recibió. */
export default function EvidenciaPorPregunta({ scores, idioma = 'es' }: { scores: AnalisisResult; idioma?: Idioma }) {
  const t = UI[idioma].resultado;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={scores.confianza === 'alta' ? 'green' : scores.confianza === 'media' ? 'blue' : 'amber'} size="sm">
          {t.confianza[scores.confianza]}
        </Badge>
        {scores.perfil_entrevistado && <Badge size="sm">{t.perfil[scores.perfil_entrevistado]}</Badge>}
        {scores.rubrica_version && <Badge size="sm">{t.rubrica} {scores.rubrica_version}</Badge>}
      </div>
      <Disclosure>
        {DIMENSIONES.map((d) => {
          const dim = scores.dimensiones[d.id] as DimensionScore;
          return (
            <DisclosureItem
              key={d.id}
              value={d.id}
              title={
                <span className="flex flex-wrap items-baseline justify-between gap-2 pr-2">
                  <span>{nombreDimension(d.id, d.nombre, idioma)}</span>
                  <Mono size="small" tone="muted">{dim.subtotal}/9</Mono>
                </span>
              }
            >
              <dl className="flex flex-col gap-4">
                {d.preguntas.map((p) => {
                  const s = dim[p];
                  if (!s) return null;
                  return (
                    <div key={p} className="grid grid-cols-[3rem_1fr] gap-x-4 gap-y-1">
                      <dt className="font-mono text-caption text-subtle">{p.toUpperCase()}</dt>
                      <dd className="flex flex-col gap-1">
                        <Mono size="caption" tone={s.puntaje >= 2 ? 'green' : s.puntaje === 1 ? 'amber' : 'muted'}>{s.puntaje} {t.deTres}</Mono>
                        <span className="text-small text-muted">{t.noMencionado[s.evidencia] ?? s.evidencia}</span>
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </DisclosureItem>
          );
        })}
      </Disclosure>
      {scores.gaps_de_informacion.length > 0 && (
        <div className="flex flex-col gap-2">
          <Text variant="eyebrow">{t.noClaro}</Text>
          <ul className="flex list-disc flex-col gap-1 pl-5 text-small text-muted">
            {scores.gaps_de_informacion.map((g) => <li key={g}>{g}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
