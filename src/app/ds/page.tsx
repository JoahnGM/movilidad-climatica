import Link from 'next/link';
import { Callout, Card, Heading, Text } from '@/components/ds';
import { CabeceraCatalogo } from './_catalogo/Specimen';
import { GRUPOS } from './_catalogo/grupos';

export default function DsIndex() {
  return (
    <>
      <CabeceraCatalogo titulo="Cordillera">
        El design system de Movilidad Climática Colombia: tecnología con la sobriedad de una ONG climática.
        Papel cálido, tinta verde bosque, una sola grotesca y la interfaz del producto como ilustración.
      </CabeceraCatalogo>

      <Callout variant="info" title="Cómo usarlo">
        Importa siempre desde <code className="font-mono text-small">@/components/ds</code>. Antes de crear un componente nuevo,
        busca aquí. Reglas completas en <code className="font-mono text-small">docs/estandares/design-system.md</code>;
        verificación con <code className="font-mono text-small">npm run check:ds</code>.
      </Callout>

      <section className="flex flex-col gap-4">
        <Heading as="h2" size="h3">Reglas de oro</Heading>
        <ol className="flex list-decimal flex-col gap-2 pl-5 text-body text-muted marker:font-mono marker:text-subtle">
          <li>Ningún color literal fuera de <code className="font-mono text-small">globals.css</code>: usa tokens (<code className="font-mono text-small">text-muted</code>, <code className="font-mono text-small">bg-surface</code>, <code className="font-mono text-small">text-green-ink</code>).</li>
          <li>Un solo efecto protagonista por página (la cordillera del hero).</li>
          <li>La interfaz real ilustra el producto: el demo y el resultado usan el mismo componente.</li>
          <li>Toda cifra lleva fuente y año (<code className="font-mono text-small">CifraConFuente</code>).</li>
          <li>Aviso de IA siempre con competencia y límite: “Evalúa solo lo que digas; puede equivocarse”.</li>
        </ol>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {GRUPOS.map((g) => (
          <Link key={g.slug} href={`/ds/${g.slug}`} className="group">
            <Card variant="raised" interactive className="h-full">
              <Heading as="h2" size="h4" className="group-hover:text-green-ink">{g.titulo}</Heading>
              <Text variant="small">{g.descripcion}</Text>
              {g.primitivas.length > 0 && (
                <p className="font-mono text-caption text-subtle">{g.primitivas.join(' · ')}</p>
              )}
            </Card>
          </Link>
        ))}
      </section>
    </>
  );
}
