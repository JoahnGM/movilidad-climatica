import { ArrowRight, Home, Lock, MapPin, TrendingUp } from 'lucide-react';
import {
  Callout, Card, Chip, CifraConFuente, Heading, IconTile, Reveal, Section, SectionHeader, SourceLink, Text,
} from '@/components/ds';
import { DEFINICION_MOVILIDAD_CLIMATICA, getCifra } from '@/lib/contenido';
import { traducir } from '@/lib/contenido/traducciones/en';
import type { Idioma } from '@/lib/i18n/idioma';
import { UI } from '@/lib/i18n/ui';

const ICONOS_FORMAS = [ArrowRight, TrendingUp, MapPin, Lock, Home];

/** Cifras verificadas (docs/contenido/inventario-ui.md reemplaza las tres cifras sin fuente del diseño anterior). */
const CIFRAS = ['idmc-colombia-desastres-2025', 'idmc-colombia-desastres-2024', 'idmc-colombia-desastres-2023'].map(getCifra);
const NOTA_DESPLAZAMIENTOS = getCifra('idmc-definicion-desplazamientos');

export default function ContextSection({ idioma = 'es' }: { idioma?: Idioma }) {
  const t = UI[idioma].contexto;
  const tr = (texto: string) => traducir(texto, idioma);
  return (
    <Section id="contexto" background="alt" border>
      <SectionHeader
        eyebrow={t.eyebrow}
        title={t.titulo}
        lead={t.lead}
      />

      <div className="flex flex-col gap-6">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Reveal as="li">
            <Card variant="sage" className="h-full justify-center">
              <Text variant="eyebrow">{t.queEs}</Text>
              <p className="text-body font-medium text-foreground">{tr(DEFINICION_MOVILIDAD_CLIMATICA)}</p>
            </Card>
          </Reveal>
          {t.formas.map((f, i) => (
            <Reveal as="li" key={f.titulo} index={i + 1}>
              <Card variant="raised" className="h-full">
                <IconTile icon={ICONOS_FORMAS[i]} />
                <Heading as="h3" size="h4">{f.titulo}</Heading>
                <Text variant="small">{f.descripcion}</Text>
              </Card>
            </Reveal>
          ))}
        </ul>
      </div>

      <Reveal>
        <p className="max-w-2xl font-heading text-h3 font-semibold tracking-heading text-foreground text-balance">
          {t.primeraLinea}
        </p>
      </Reveal>

      <div className="flex flex-col gap-10">
        <SectionHeader
          as="h3"
          eyebrow={t.evidenciaEyebrow}
          title={t.evidenciaTitulo}
          lead={t.evidenciaLead}
        />
        <div className="grid border-t border-border md:grid-cols-3">
          {CIFRAS.map((c, i) => (
            <Reveal key={c.id} index={i} className={i > 0 ? 'border-t border-border md:border-t-0 md:border-l md:pl-8' : 'md:pr-8'}>
              <CifraConFuente
                className="py-8"
                valor={c.valor}
                unidad={`${tr(c.unidad ?? '')} · ${c.anio}`}
                definicion={tr(c.definicion)}
                fuente={c.fuente.institucion}
                anio={c.fuente.anio}
                enlace={c.fuente.url}
                textoFuente={UI[idioma].comun.fuente}
                textoNuevaPestana={UI[idioma].comun.abreNuevaPestana}
              />
            </Reveal>
          ))}
        </div>
        <Reveal>
          <Text variant="small" tone="muted" className="max-w-3xl">
            <span className="font-medium text-muted">{tr(NOTA_DESPLAZAMIENTOS.valor)}.</span> {tr(NOTA_DESPLAZAMIENTOS.definicion)}{' '}
            <SourceLink fuente={NOTA_DESPLAZAMIENTOS.fuente.institucion} anio={NOTA_DESPLAZAMIENTOS.fuente.anio} href={NOTA_DESPLAZAMIENTOS.fuente.url} textoFuente={UI[idioma].comun.fuente} textoNuevaPestana={UI[idioma].comun.abreNuevaPestana} />
          </Text>
        </Reveal>
      </div>

      <div className="flex flex-col gap-6">
        <Reveal>
          <Callout variant="info" title={t.ciudadesTitulo}>{t.ciudadesTexto}</Callout>
        </Reveal>
        <Reveal className="flex flex-wrap gap-2.5">
          {t.areas.map((area) => <Chip key={area}>{area}</Chip>)}
        </Reveal>
      </div>
    </Section>
  );
}
