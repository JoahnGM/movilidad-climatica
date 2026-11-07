import { Badge, Callout, Card, Heading, Reveal, Section, SectionHeader, SourceLink, Tabs, TabsContent, TabsList, TabsTrigger, Text } from '@/components/ds';
import { CIUDADES, HALLAZGO_CIUDADES, getCifra, type Afirmacion, type Ciudad } from '@/lib/contenido';
import { traducir } from '@/lib/contenido/traducciones/en';
import type { Idioma } from '@/lib/i18n/idioma';
import { UI } from '@/lib/i18n/ui';

const CAMPOS = ['contexto', 'riesgos', 'marcos', 'respuestas', 'brechas'] as const satisfies readonly (keyof Ciudad)[];

/** Fuente de una afirmación: la propia o la de la cifra que referencia. Las síntesis no llevan fuente. */
function fuenteDe(a: Afirmacion) {
  if (a.fuente) return a.fuente;
  if (a.cifraId) return getCifra(a.cifraId).fuente;
  return null;
}

const publicables = (as: Afirmacion[]) => as.filter((a) => a.publicable !== false);

function Afirmaciones({ items, idioma }: { items: Afirmacion[]; idioma: Idioma }) {
  return (
    <ul className="grid gap-x-10 gap-y-4 md:grid-cols-2">
      {publicables(items).map((a) => {
        const f = fuenteDe(a);
        return (
          <li key={a.texto} className="flex flex-col gap-1">
            <span className="text-small text-muted">{traducir(a.texto, idioma)}</span>
            {f && <SourceLink fuente={f.institucion} anio={f.anio} href={f.url} prefijo={false} textoNuevaPestana={UI[idioma].comun.abreNuevaPestana} />}
          </li>
        );
      })}
    </ul>
  );
}

export default function CitiesSection({ idioma = 'es' }: { idioma?: Idioma }) {
  const t = UI[idioma].ciudades;
  return (
    <Section id="ciudades">
      <SectionHeader
        eyebrow={t.eyebrow}
        title={t.titulo}
        lead={t.lead}
      />

      <Reveal>
        <Callout variant="nota" title={t.hallazgo}>{traducir(HALLAZGO_CIUDADES[0].texto, idioma)}</Callout>
      </Reveal>

      <Reveal>
        <Tabs defaultValue={CIUDADES[0].id}>
          <TabsList aria-label={t.tabsAria}>
            {CIUDADES.map((c) => <TabsTrigger key={c.id} value={c.id}>{c.nombre}</TabsTrigger>)}
          </TabsList>
          {CIUDADES.map((c) => (
            <TabsContent key={c.id} value={c.id} className="gap-6">
              <Card variant="sage" padding="lg">
                <div className="flex flex-wrap items-center gap-2">
                  <Text variant="eyebrow">{t.mensajeClave} · {c.nombre}</Text>
                  {!c.nombraMovilidadClimatica.valor && <Badge tone="amber" size="sm">{t.noNombra}</Badge>}
                </div>
                <p className="font-heading text-h3 font-semibold tracking-heading text-foreground text-balance">{traducir(c.mensajeClave.texto, idioma)}</p>
              </Card>
              <Card variant="raised" padding="none" className="divide-y divide-border">
                {CAMPOS.map((clave) => {
                  const items = publicables(c[clave]);
                  if (items.length === 0) return null;
                  return (
                    <div key={clave} className="grid gap-4 p-card lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-10">
                      <Heading as="h3" size="h4">{t.campos[clave]}</Heading>
                      <Afirmaciones items={items} idioma={idioma} />
                    </div>
                  );
                })}
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </Reveal>
    </Section>
  );
}
