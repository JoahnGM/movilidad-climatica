import type { Metadata } from 'next';
import { Card, Container, PageHeader, Reveal, Section, SectionHeader, SkipLink, Text } from '@/components/ds';
import { CabeceraCatalogo, Specimen } from '../_catalogo/Specimen';

export const metadata: Metadata = { title: 'Estructura' };

export default function Estructura() {
  return (
    <>
      <CabeceraCatalogo titulo="Estructura">Anchos, secciones, encabezados y la animación de entrada.</CabeceraCatalogo>

      <Specimen nombre="Container" archivo="src/components/ds/Container.tsx"
        descripcion="Ancho máximo + padding lateral fluido. Tamaños: prose (768), content (1024), wide (1152, por defecto)."
        codigo={`<Container size="wide">…</Container>`}
        usar={['Todo contenido de página que no esté dentro de una Section', 'Navbar y footer (wide)']}
        noUsar={['Dentro de una Section (ya trae Container)', 'Para limitar el ancho de un párrafo: usa max-w-2xl']}>
        {(['prose', 'content', 'wide'] as const).map((s) => (
          <Container key={s} size={s} className="rounded-lg bg-sage py-3 font-mono text-caption text-green-ink">size=&quot;{s}&quot;</Container>
        ))}
      </Specimen>

      <Specimen nombre="Section" archivo="src/components/ds/Section.tsx"
        descripcion="Bloque vertical de página: fondo + py-section + Container + gap-block entre hijos. Fondos: base, alt, halo, ink."
        codigo={`<Section id="contexto" background="alt" border>
  <SectionHeader eyebrow="Contexto" title="…" lead="…" />
  …
</Section>`}
        usar={['Cada sección del home y de las páginas de contenido', 'Alternar base y alt para dar ritmo']}
        noUsar={['Bloques dentro de una tarjeta', 'Más de una Section con background="ink" por página']}
        a11y="Dale un id para anclas de navegación; scroll-padding-top compensa la navbar fija.">
        <div className="overflow-hidden rounded-xl border border-border">
          <Section background="alt" spacing="compact"><Text variant="small">background=&quot;alt&quot; spacing=&quot;compact&quot;</Text></Section>
          <Section background="halo" spacing="compact"><Text variant="small">background=&quot;halo&quot;</Text></Section>
        </div>
      </Specimen>

      <Specimen nombre="SectionHeader" archivo="src/components/ds/SectionHeader.tsx"
        descripcion="Eyebrow monoespaciado + título + lead, con fade-in. align=&quot;start&quot; (por defecto) pone en escritorio el título a la izquierda y el lead a la derecha, sin columna vacía; align=&quot;center&quot; apila y centra."
        codigo={`<SectionHeader eyebrow="Casos de estudio" title="Tres ciudades. Tres realidades." lead="…" />`}
        usar={['Encabezado de cada Section']} noUsar={['Títulos dentro de tarjetas (usa Heading size="h4")']}
        a11y="Por defecto renderiza h2; usa as=&quot;h1&quot; solo si es el título de la página.">
        <SectionHeader eyebrow="Casos de estudio" title="Tres ciudades. Tres realidades." lead="Cómo tres ciudades colombianas están —y no están— abordando la movilidad climática." />
      </Specimen>

      <Specimen nombre="PageHeader" archivo="src/components/ds/PageHeader.tsx"
        descripcion="Encabezado de páginas internas (/sobre, /metodologia, /recursos): migas + h1 + descripción + elemento lateral."
        codigo={`<PageHeader breadcrumb={[{ label: 'Inicio', href: '/' }, { label: 'Metodología' }]} title="Nota metodológica" />`}
        usar={['Páginas internas']} noUsar={['El home (usa el hero)']}
        a11y="Las migas son un nav con aria-label y aria-current=&quot;page&quot; en la última.">
        <PageHeader headingLevel="h2" breadcrumb={[{ label: 'Inicio', href: '/' }, { label: 'Metodología' }]} eyebrow="Versión 1.0" title="Nota metodológica" description="Cómo se construye y cómo se interpreta el diagnóstico." />
      </Specimen>

      <Specimen nombre="Reveal" archivo="src/components/ds/Reveal.tsx"
        descripcion="Fade-in hacia arriba al entrar en pantalla, una sola vez. index escalona elementos de una cuadrícula."
        codigo={`{items.map((it, i) => <Reveal as="li" key={it.id} index={i}>…</Reveal>)}`}
        usar={['Bloques y tarjetas que entran al hacer scroll']} noUsar={['Animar una sección completa muy alta', 'Contenido crítico above-the-fold que no debe esperar']}
        a11y="Con movimiento reducido solo anima la opacidad (MotionProvider).">
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => <Reveal key={i} index={i}><Card variant="sage" padding="sm"><Text variant="small">index={i}</Text></Card></Reveal>)}
        </div>
      </Specimen>

      <Specimen nombre="MotionProvider" archivo="src/components/ds/MotionProvider.tsx"
        descripcion="Configura Framer Motion para todo el sitio (reducedMotion=&quot;user&quot;, curva y duración por defecto). Se monta una vez en src/app/layout.tsx."
        codigo={`<MotionProvider>{children}</MotionProvider>`}
        usar={['Solo en el layout raíz']} noUsar={['Anidarlo en páginas o componentes']}>
        <Text variant="small">Sin vista previa: es un proveedor de contexto.</Text>
      </Specimen>

      <Specimen nombre="SkipLink" archivo="src/components/ds/SkipLink.tsx"
        descripcion="&quot;Saltar al contenido principal&quot;, visible solo con foco de teclado. Apunta a #contenido."
        codigo={`<SkipLink />  // y <main id="contenido"> en cada página`}
        usar={['Layout raíz']} noUsar={['Más de una vez por página']}
        a11y="Presiona Tab al cargar cualquier página para verlo.">
        <div className="relative h-14"><SkipLink href="#estructura" label="Saltar al contenido principal (enfócame con Tab)" /></div>
      </Specimen>
    </>
  );
}
