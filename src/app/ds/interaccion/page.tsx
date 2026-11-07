import type { Metadata } from 'next';
import { ArrowRight, Plus } from 'lucide-react';
import { Button, Disclosure, DisclosureItem, Tabs, TabsContent, TabsList, TabsTrigger, Text, TextInput } from '@/components/ds';
import { CabeceraCatalogo, Muestra, Specimen } from '../_catalogo/Specimen';
import { FeedbackDemo, PlaceholderDemo } from '../_catalogo/Demos';

export const metadata: Metadata = { title: 'Interacción' };

export default function Interaccion() {
  return (
    <>
      <CabeceraCatalogo titulo="Interacción">Botones, campos, acordeones, pestañas y la micro-encuesta.</CabeceraCatalogo>

      <Specimen nombre="Button" archivo="src/components/ds/Button.tsx"
        descripcion="Píldoras. primary (tinta verde bosque; una por vista), secondary, ghost, inverse (sobre fondo oscuro), link. Para navegar, asChild con Link."
        codigo={`<Button asChild size="lg"><Link href="#diagnostico">Iniciar Diagnóstico <ArrowRight /></Link></Button>
<Button variant="secondary" onClick={…}><Plus /> Nuevo diagnóstico</Button>`}
        usar={['Toda acción o CTA']} noUsar={['src/components/ui/button en páginas', 'Más de un primary por vista']}
        a11y="Foco visible verde; disabled y aria-disabled atenúan y bloquean. Botones solo con ícono necesitan aria-label.">
        <Muestra etiqueta="variant">
          <Button>Primario <ArrowRight /></Button><Button variant="secondary"><Plus /> Secundario</Button><Button variant="ghost">Ghost</Button><Button variant="link">Enlace</Button>
        </Muestra>
        <Muestra etiqueta="size"><Button size="sm">sm</Button><Button size="md">md</Button><Button size="lg">lg</Button><Button size="icon" aria-label="Agregar"><Plus /></Button></Muestra>
        <Muestra etiqueta="estados"><Button disabled>Deshabilitado</Button><Button variant="secondary" disabled>Deshabilitado</Button></Muestra>
        <div className="rounded-card bg-ink p-6"><Button variant="inverse">inverse <ArrowRight /></Button></div>
      </Specimen>

      <Specimen nombre="TextInput" archivo="src/components/ds/TextInput.tsx"
        descripcion="Campo con etiqueta obligatoria (visible u oculta), ayuda y estado de error."
        codigo={`<TextInput label="Código de acceso" hideLabel invalid={!!error} hint={error} />`}
        usar={['Formularios cortos']} noUsar={['El área de texto del chat (es propia del chat)']}
        a11y="label asociado; el hint va en aria-describedby; con invalid, aria-invalid y role=&quot;alert&quot;.">
        <div className="flex max-w-sm flex-col gap-5">
          <TextInput label="Municipio" placeholder="¿En qué municipio trabajas?" hint="Lo usamos solo para personalizar el diagnóstico." />
          <TextInput label="Código de acceso" invalid hint="El código no es válido." defaultValue="ABC" />
          <TextInput label="Deshabilitado" disabled placeholder="No disponible" />
        </div>
      </Specimen>

      <Specimen nombre="usePlaceholderAnimado" archivo="src/components/ds/efectos/usePlaceholderAnimado.ts"
        descripcion="Hook: placeholder que se escribe y se borra solo (invitación + ejemplos). Se pausa con el campo enfocado o con texto."
        codigo={`const placeholder = usePlaceholderAnimado(FRASES, !enfocado && valor === '');
<TextInput … placeholder={placeholder} onFocus={…} onBlur={…} />`}
        usar={['El campo principal del hero']} noUsar={['Formularios largos', 'Como única instrucción del campo (la etiqueta sigue siendo obligatoria)']}
        a11y="El placeholder no se anuncia; la etiqueta del campo no cambia. Con movimiento reducido queda fija la primera frase.">
        <PlaceholderDemo />
      </Specimen>

      <Specimen nombre="Disclosure" archivo="src/components/ds/Disclosure.tsx"
        descripcion="Acordeón accesible (Radix). variant list (preguntas frecuentes, evidencia) o card. Se compone con DisclosureItem."
        codigo={`<Disclosure>
  <DisclosureItem value="p1" title="¿Qué evalúa el diagnóstico?">…</DisclosureItem>
</Disclosure>`}
        usar={['FAQ, evidencia por pregunta, detalles opcionales']} noUsar={['Contenido que todos deben leer']}
        a11y="Botón con aria-expanded/aria-controls; Enter/Espacio abren; ↑/↓ e Inicio/Fin mueven el foco entre encabezados.">
        <Disclosure defaultValue={['a']}>
          <DisclosureItem value="a" title="¿Qué evalúa el diagnóstico?">La preparación institucional en 6 dimensiones, no el riesgo del territorio.</DisclosureItem>
          <DisclosureItem value="b" title="¿Dónde se guardan mis datos?">El resultado se guarda solo en tu navegador.</DisclosureItem>
          <DisclosureItem value="c" title="Ítem deshabilitado" disabled>—</DisclosureItem>
        </Disclosure>
      </Specimen>

      <Specimen nombre="DisclosureItem" archivo="src/components/ds/Disclosure.tsx"
        descripcion="Cada ítem del Disclosure: value único + title (puede incluir badges o cifras) + contenido."
        codigo={`<DisclosureItem value="d1" title={<span>Reconocimiento <Mono>5/9</Mono></span>}>…</DisclosureItem>`}
        usar={['Siempre dentro de Disclosure']} noUsar={['Fuera de Disclosure']}>
        <Disclosure variant="card">
          <DisclosureItem value="x" title="variant=&quot;card&quot;"><Text variant="small">Cada ítem es una tarjeta.</Text></DisclosureItem>
        </Disclosure>
      </Specimen>

      <Specimen nombre="Tabs" archivo="src/components/ds/Tabs.tsx"
        descripcion="Pestañas accesibles (Radix) para fichas con campos paralelos (ciudades). Se compone con TabsList, TabsTrigger y TabsContent."
        codigo={`<Tabs defaultValue="bogota">
  <TabsList aria-label="Ciudades"><TabsTrigger value="bogota">Bogotá</TabsTrigger>…</TabsList>
  <TabsContent value="bogota">…</TabsContent>
</Tabs>`}
        usar={['Fichas de ciudad, vistas alternativas del mismo contenido']} noUsar={['Navegación entre páginas', 'Pasos secuenciales']}
        a11y="role tablist/tab/tabpanel; ←/→ cambian de pestaña, Inicio/Fin a los extremos. TabsList necesita aria-label.">
        <Tabs defaultValue="bogota">
          <TabsList aria-label="Ciudades de ejemplo">
            <TabsTrigger value="bogota">Bogotá</TabsTrigger><TabsTrigger value="medellin">Medellín</TabsTrigger><TabsTrigger value="bq" disabled>Deshabilitada</TabsTrigger>
          </TabsList>
          <TabsContent value="bogota">Contenido de Bogotá.</TabsContent>
          <TabsContent value="medellin">Contenido de Medellín.</TabsContent>
        </Tabs>
      </Specimen>

      <Specimen nombre="TabsList" archivo="src/components/ds/Tabs.tsx" descripcion="Fila de pestañas (píldora); se desplaza en móvil." codigo={`<TabsList aria-label="Ciudades">…</TabsList>`} usar={['Dentro de Tabs']} noUsar={['Fuera de Tabs']}>
        <Text variant="small">Ver la demo de Tabs arriba.</Text>
      </Specimen>
      <Specimen nombre="TabsTrigger" archivo="src/components/ds/Tabs.tsx" descripcion="Cada pestaña." codigo={`<TabsTrigger value="bogota">Bogotá</TabsTrigger>`} usar={['Dentro de TabsList']} noUsar={['Como botón suelto']}>
        <Text variant="small">Ver la demo de Tabs arriba.</Text>
      </Specimen>
      <Specimen nombre="TabsContent" archivo="src/components/ds/Tabs.tsx" descripcion="Panel de cada pestaña." codigo={`<TabsContent value="bogota">…</TabsContent>`} usar={['Dentro de Tabs']} noUsar={['Fuera de Tabs']}>
        <Text variant="small">Ver la demo de Tabs arriba.</Text>
      </Specimen>

      <Specimen nombre="FeedbackThumbs" archivo="src/components/ds/FeedbackThumbs.tsx"
        descripcion="👍/👎 visual con callbacks. Sin persistencia: la analítica vive fuera de ds/."
        codigo={`<FeedbackThumbs pregunta="¿Este resultado te fue útil?" value={voto} onChange={setVoto} />`}
        usar={['Micro-encuesta bajo el resultado']} noUsar={['Votaciones que necesiten más de 2 opciones']}
        a11y="Grupo con nombre (la pregunta); cada botón con aria-pressed y nombre accesible.">
        <FeedbackDemo />
      </Specimen>
    </>
  );
}
