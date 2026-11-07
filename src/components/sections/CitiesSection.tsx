import { Badge, Callout, Card, Heading, Reveal, Section, SectionHeader, SourceLink, Tabs, TabsContent, TabsList, TabsTrigger, Text } from '@/components/ds';
import { CIUDADES, HALLAZGO_CIUDADES, getCifra, type Afirmacion, type Ciudad } from '@/lib/contenido';

const CAMPOS: { clave: keyof Pick<Ciudad, 'contexto' | 'riesgos' | 'marcos' | 'respuestas' | 'brechas'>; titulo: string }[] = [
  { clave: 'contexto', titulo: 'Contexto' },
  { clave: 'riesgos', titulo: 'Riesgos' },
  { clave: 'marcos', titulo: 'Marcos e instrumentos' },
  { clave: 'respuestas', titulo: 'Respuestas' },
  { clave: 'brechas', titulo: 'Brechas' },
];

/** Fuente de una afirmación: la propia o la de la cifra que referencia. Las síntesis no llevan fuente. */
function fuenteDe(a: Afirmacion) {
  if (a.fuente) return a.fuente;
  if (a.cifraId) return getCifra(a.cifraId).fuente;
  return null;
}

const publicables = (as: Afirmacion[]) => as.filter((a) => a.publicable !== false);

function Afirmaciones({ items }: { items: Afirmacion[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {publicables(items).map((a) => {
        const f = fuenteDe(a);
        return (
          <li key={a.texto} className="flex flex-col gap-1">
            <span className="text-small text-muted">{a.texto}</span>
            {f && <SourceLink fuente={f.institucion} anio={f.anio} href={f.url} prefijo={false} />}
          </li>
        );
      })}
    </ul>
  );
}

export default function CitiesSection() {
  return (
    <Section id="ciudades">
      <SectionHeader
        eyebrow="Casos de estudio"
        title="Tres ciudades. Tres realidades."
        lead="Cómo tres ciudades colombianas están —y no están— abordando la movilidad climática. Elige una ciudad para ver su contexto, riesgos, marcos, respuestas y brechas."
      />

      <Reveal>
        <Callout variant="nota" title="Hallazgo">{HALLAZGO_CIUDADES[0].texto}</Callout>
      </Reveal>

      <Reveal>
        <Tabs defaultValue={CIUDADES[0].id}>
          <TabsList aria-label="Ciudades">
            {CIUDADES.map((c) => <TabsTrigger key={c.id} value={c.id}>{c.nombre}</TabsTrigger>)}
          </TabsList>
          {CIUDADES.map((c) => (
            <TabsContent key={c.id} value={c.id} className="gap-6">
              <Card variant="sage" padding="lg">
                <div className="flex flex-wrap items-center gap-2">
                  <Text variant="eyebrow">Mensaje clave · {c.nombre}</Text>
                  {!c.nombraMovilidadClimatica.valor && <Badge tone="amber" size="sm">No nombra la movilidad climática</Badge>}
                </div>
                <p className="font-heading text-h3 font-semibold tracking-heading text-foreground text-balance">{c.mensajeClave.texto}</p>
              </Card>
              <div className="grid gap-4 md:grid-cols-2">
                {CAMPOS.map(({ clave, titulo }) => {
                  const items = publicables(c[clave]);
                  if (items.length === 0) return null;
                  return (
                    <Card key={clave} variant="raised" className={clave === 'contexto' ? 'md:col-span-2' : undefined}>
                      <Heading as="h3" size="h4">{titulo}</Heading>
                      <Afirmaciones items={items} />
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Reveal>
    </Section>
  );
}
