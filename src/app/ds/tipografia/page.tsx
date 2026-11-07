import type { Metadata } from 'next';
import { Acento, Heading, Mono, Text } from '@/components/ds';
import { CabeceraCatalogo, Muestra, Specimen } from '../_catalogo/Specimen';

export const metadata: Metadata = { title: 'Tipografía' };

export default function Tipografia() {
  return (
    <>
      <CabeceraCatalogo titulo="Tipografía">Una sola grotesca para todo, una serif itálica para el acento humano y una mono para los datos.</CabeceraCatalogo>

      <Specimen nombre="Heading" archivo="src/components/ds/Typography.tsx"
        descripcion="Títulos en Instrument Sans semibold con tracking negativo. as fija la semántica; size, la escala."
        codigo={`<Heading as="h2">Tres ciudades. Tres realidades.</Heading>
<Heading as="h3" size="h4">Desplazamiento interno</Heading>`}
        usar={['Todos los títulos']} noUsar={['Texto destacado que no es título (usa Text variant="lead")']}
        a11y="Respeta la jerarquía h1 → h2 → h3; un solo h1 por página.">
        {(['display', 'h1', 'h2', 'h3', 'h4'] as const).map((s) => (
          <Muestra key={s} etiqueta={`size="${s}"`}><Heading as="h2" size={s}>Diagnostica tu territorio.</Heading></Muestra>
        ))}
      </Specimen>

      <Specimen nombre="Acento" archivo="src/components/ds/Typography.tsx"
        descripcion="Frase en Instrument Serif itálica verde dentro de un título. Es la voz humana de la marca."
        codigo={`<Heading>No un cuestionario. <Acento>Una conversación.</Acento></Heading>`}
        usar={['Una frase corta al final de un título clave (hero, cómo funciona)']} noUsar={['Párrafos', 'Más de un acento por título', 'Más de 3 por página']}>
        <Heading as="h2" size="h2">No un cuestionario. <Acento>Una conversación.</Acento></Heading>
      </Specimen>

      <Specimen nombre="Text" archivo="src/components/ds/Typography.tsx"
        descripcion="Texto en Instrument Sans. Variantes lead, body, small, caption, eyebrow (mono en mayúsculas). Tonos default, secondary (por defecto), muted y los tonos semánticos."
        codigo={`<Text variant="eyebrow">Contexto</Text>
<Text variant="lead">En Colombia, el fenómeno…</Text>
<Text variant="small" tone="muted">Fuente: …</Text>`}
        usar={['Todo texto que no es título']} noUsar={['Cifras (usa Mono)', 'Etiquetas de estado (usa Badge)']}
        a11y="Todos los tonos cumplen AA (≥4.5:1) sobre las 5 superficies.">
        {(['eyebrow', 'lead', 'body', 'small', 'caption'] as const).map((v) => (
          <Muestra key={v} etiqueta={`variant="${v}"`}><Text variant={v}>La movilidad climática no afecta a todos por igual.</Text></Muestra>
        ))}
        <Muestra etiqueta="tone">
          {(['default', 'secondary', 'muted', 'green', 'blue', 'amber', 'red', 'violet'] as const).map((t) => <Text key={t} as="span" variant="small" tone={t}>{t}</Text>)}
        </Muestra>
      </Specimen>

      <Specimen nombre="Mono" archivo="src/components/ds/Typography.tsx"
        descripcion="Geist Mono con cifras tabulares para números, puntajes y datos."
        codigo={`<Mono size="metric">19</Mono><Mono size="caption" tone="muted">5/9</Mono>`}
        usar={['Cifras, puntajes, códigos de pregunta (P4)']} noUsar={['Párrafos']}>
        <Muestra etiqueta="size">
          <Mono size="metric">91.000</Mono><Mono size="lg">19/54</Mono><Mono size="body">P4 · 2 de 3</Mono><Mono size="caption" tone="muted">5/9</Mono>
        </Muestra>
      </Specimen>
    </>
  );
}
