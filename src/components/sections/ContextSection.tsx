import { ArrowRight, Home, Lock, MapPin, TrendingUp } from 'lucide-react';
import {
  Callout, Card, Chip, CifraConFuente, Heading, IconTile, Reveal, Section, SectionHeader, SourceLink, Text,
} from '@/components/ds';
import { DEFINICION_MOVILIDAD_CLIMATICA, getCifra } from '@/lib/contenido';

const FORMAS = [
  {
    icon: ArrowRight,
    titulo: 'Desplazamiento interno',
    descripcion:
      'Cuando las personas deben salir de su lugar de residencia de forma involuntaria por inundaciones, tormentas, deslizamientos o erosión.',
  },
  {
    icon: TrendingUp,
    titulo: 'Migración',
    descripcion:
      'Cuando el movimiento ocurre de manera gradual o estratégica, combinando factores climáticos, económicos y sociales.',
  },
  {
    icon: MapPin,
    titulo: 'Inmovilidad',
    descripcion:
      'Cuando las personas permanecen en lugares expuestos a riesgos, ya sea porque no pueden salir o porque deciden quedarse.',
  },
  {
    icon: Lock,
    titulo: 'Poblaciones atrapadas',
    descripcion:
      'Cuando la permanencia no es una elección real, sino el resultado de restricciones materiales, sociales o institucionales.',
  },
  {
    icon: Home,
    titulo: 'Reubicación planificada',
    descripcion:
      'Cuando el traslado se organiza de manera anticipada o institucional frente a riesgos que hacen inviable la permanencia.',
  },
];

const AREAS = [
  'Planeación territorial',
  'Adaptación climática',
  'Gestión del riesgo',
  'Vivienda y hábitat',
  'Inclusión social',
  'Resiliencia territorial',
];

/** Cifras verificadas (docs/contenido/inventario-ui.md reemplaza las tres cifras sin fuente del diseño anterior). */
const CIFRAS = ['idmc-colombia-desastres-2025', 'idmc-colombia-desastres-2024', 'idmc-colombia-desastres-2023'].map(getCifra);
const NOTA_DESPLAZAMIENTOS = getCifra('idmc-definicion-desplazamientos');

export default function ContextSection() {
  return (
    <Section id="contexto" background="alt" border>
      <SectionHeader
        eyebrow="Contexto"
        title="La crisis climática está moviendo a Colombia"
        lead="En Colombia, el fenómeno no se explica solo por inundaciones o deslizamientos, sino por cómo esos impactos se combinan con desigualdad, debilidad institucional y presión creciente sobre ciudades y territorios."
      />

      <div className="flex flex-col gap-6">
        <Reveal>
          <Callout variant="nota" title="¿Qué es la movilidad climática?">{DEFINICION_MOVILIDAD_CLIMATICA}</Callout>
        </Reveal>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FORMAS.map((f, i) => (
            <Reveal as="li" key={f.titulo} index={i}>
              <Card variant="raised" className="h-full">
                <IconTile icon={f.icon} />
                <Heading as="h3" size="h4">{f.titulo}</Heading>
                <Text variant="small">{f.descripcion}</Text>
              </Card>
            </Reveal>
          ))}
        </ul>
      </div>

      <Reveal>
        <p className="max-w-2xl font-heading text-h3 font-semibold tracking-heading text-foreground text-balance">
          Los municipios colombianos están en la primera línea de esta crisis.
        </p>
      </Reveal>

      <div className="flex flex-col gap-10">
        <Reveal className="flex max-w-2xl flex-col gap-5">
          <Text variant="eyebrow">La evidencia</Text>
          <Heading as="h3" size="h2">Colombia enfrenta una crisis silenciosa</Heading>
          <Text variant="lead">
            Los datos oficiales muestran el tamaño del fenómeno — aunque todavía subestiman su verdadera dimensión.
          </Text>
        </Reveal>
        <div className="grid border-t border-border md:grid-cols-3">
          {CIFRAS.map((c, i) => (
            <Reveal key={c.id} index={i} className={i > 0 ? 'border-t border-border md:border-t-0 md:border-l md:pl-8' : 'md:pr-8'}>
              <CifraConFuente
                className="py-8"
                valor={c.valor}
                unidad={`${c.unidad ?? ''} · ${c.anio}`}
                definicion={c.definicion}
                fuente={c.fuente.institucion}
                anio={c.fuente.anio}
                enlace={c.fuente.url}
              />
            </Reveal>
          ))}
        </div>
        <Reveal>
          <Text variant="small" tone="muted" className="max-w-3xl">
            <span className="font-medium text-muted">{NOTA_DESPLAZAMIENTOS.valor}.</span> {NOTA_DESPLAZAMIENTOS.definicion}{' '}
            <SourceLink fuente={NOTA_DESPLAZAMIENTOS.fuente.institucion} anio={NOTA_DESPLAZAMIENTOS.fuente.anio} href={NOTA_DESPLAZAMIENTOS.fuente.url} />
          </Text>
        </Reveal>
      </div>

      <div className="flex flex-col gap-6">
        <Reveal>
          <Callout variant="info" title="¿Por qué importa para ciudades?">
            La mayor parte de estas presiones de movilidad tienden a ser internas. Muchas personas
            no cruzan fronteras internacionales, sino que se desplazan hacia municipios, ciudades
            intermedias o grandes centros urbanos. Esto vuelve a los territorios locales actores
            centrales del problema.
          </Callout>
        </Reveal>
        <Reveal className="flex flex-wrap gap-2.5">
          {AREAS.map((area) => <Chip key={area}>{area}</Chip>)}
        </Reveal>
      </div>
    </Section>
  );
}
