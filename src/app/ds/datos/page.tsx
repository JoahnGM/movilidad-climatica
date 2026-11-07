import type { Metadata } from 'next';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { CifraConFuente, IconList, ProgressBar, SourceLink, Stat, Timeline } from '@/components/ds';
import { getCifra } from '@/lib/contenido';
import { CabeceraCatalogo, Muestra, Specimen } from '../_catalogo/Specimen';

export const metadata: Metadata = { title: 'Datos y fuentes' };

const c = getCifra('idmc-colombia-desastres-2024');

export default function Datos() {
  return (
    <>
      <CabeceraCatalogo titulo="Datos y fuentes">Toda cifra publicada lleva valor · definición · fuente · año · enlace.</CabeceraCatalogo>

      <Specimen nombre="CifraConFuente" archivo="src/components/ds/CifraConFuente.tsx"
        descripcion="Cifra publicable. Recibe los campos tal cual (sin lógica de datos); los datos viven en src/lib/contenido/cifras.ts."
        codigo={`const c = getCifra('idmc-colombia-desastres-2024');
<CifraConFuente valor={c.valor} unidad={c.unidad} definicion={c.definicion}
  fuente={c.fuente.institucion} anio={c.fuente.anio} enlace={c.fuente.url} />`}
        usar={['Toda cifra destacada del sitio']} noUsar={['Cifras sin fuente primaria (no se publican)', 'Puntajes del diagnóstico (usa Mono)']}
        a11y="figure + figcaption; el enlace a la fuente anuncia que abre pestaña nueva.">
        <CifraConFuente valor={c.valor} unidad={c.unidad} definicion={c.definicion} fuente={c.fuente.institucion} anio={c.fuente.anio} enlace={c.fuente.url} />
      </Specimen>

      <Specimen nombre="Stat" archivo="src/components/ds/Stat.tsx"
        descripcion="Cifra protagonista sin fuente: solo para valores propios del producto (p. ej. &quot;18 preguntas&quot;)."
        codigo={`<Stat value="18" label="Preguntas" description="Seis dimensiones, tres preguntas cada una." />`}
        usar={['Datos del propio producto']} noUsar={['Cifras de contexto (usa CifraConFuente)']}>
        <Stat value="18" label="Preguntas" description="Seis dimensiones, tres preguntas cada una." />
      </Specimen>

      <Specimen nombre="SourceLink" archivo="src/components/ds/SourceLink.tsx"
        descripcion="Cita de fuente en una línea, en monoespaciada."
        codigo={`<SourceLink fuente="IDMC GRID 2025" anio={2025} href="…" />`}
        usar={['Bajo afirmaciones y cifras']} noUsar={['Enlaces de navegación']}>
        <SourceLink fuente={c.fuente.institucion} anio={c.fuente.anio} href={c.fuente.url} />
        <SourceLink fuente="Corte Constitucional" anio={2024} prefijo={false} />
      </Specimen>

      <Specimen nombre="ProgressBar" archivo="src/components/ds/ProgressBar.tsx"
        descripcion="Barra de avance o puntaje. animate llena al entrar en pantalla; animate={false} sigue el valor en vivo."
        codigo={`<ProgressBar value={5} max={9} label="Reconocimiento: 5 de 9" tone="green" />`}
        usar={['Puntajes por dimensión, progreso del diagnóstico']} noUsar={['Cargas sin valor conocido (usa Skeleton o el loader)']}
        a11y="role=&quot;progressbar&quot; con aria-valuenow/min/max y nombre accesible obligatorio.">
        <Muestra etiqueta="tone" className="w-full flex-col items-stretch">
          {(['green', 'blue', 'amber', 'red'] as const).map((t, i) => <ProgressBar key={t} value={7 - i * 2} max={9} label={`${t}: ${7 - i * 2} de 9`} tone={t} />)}
        </Muestra>
      </Specimen>

      <Specimen nombre="Timeline" archivo="src/components/ds/Timeline.tsx"
        descripcion="Línea de tiempo vertical para hitos con fecha (sentencias, leyes)."
        codigo={`<Timeline items={[{ fecha: '2024', titulo: 'Sentencia T-123', descripcion: '…', fuente: <SourceLink … /> }]} />`}
        usar={['"Lo que ya reconoce Colombia" (derechos)']} noUsar={['Pasos de un proceso (usa Pasos o Etapas)']}>
        <Timeline items={[
          { fecha: '2004', titulo: 'Sentencia T-025', descripcion: 'Contenido de ejemplo para el catálogo.' },
          { fecha: '2024', titulo: 'Sentencia T-123', descripcion: 'Contenido de ejemplo para el catálogo.' },
          { fecha: '2026', titulo: 'Ley 2577', descripcion: 'Contenido de ejemplo para el catálogo.' },
        ]} />
      </Specimen>

      <Specimen nombre="IconList" archivo="src/components/ds/IconList.tsx"
        descripcion="Lista con viñeta de ícono: fortalezas (green + CheckCircle2), brechas (amber + AlertTriangle)."
        codigo={`<IconList items={resultado.fortalezas} icon={CheckCircle2} tone="green" />`}
        usar={['Fortalezas, brechas, beneficios']} noUsar={['Listas numeradas de pasos']}>
        <IconList items={['Plan de gestión del riesgo vigente']} icon={CheckCircle2} />
        <IconList items={['Sin registro de familias desplazadas']} icon={AlertTriangle} tone="amber" />
      </Specimen>
    </>
  );
}
