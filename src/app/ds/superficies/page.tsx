import type { Metadata } from 'next';
import { Compass } from 'lucide-react';
import { Banner, Button, Callout, Card, EmptyState, Heading, Skeleton, Text } from '@/components/ds';
import { CabeceraCatalogo, Muestra, Specimen } from '../_catalogo/Specimen';
import { DialogDemo } from '../_catalogo/Demos';

export const metadata: Metadata = { title: 'Superficies y avisos' };

export default function Superficies() {
  return (
    <>
      <CabeceraCatalogo titulo="Superficies y avisos">Tarjetas, avisos destacados, franjas, estados vacíos, diálogos y esqueletos.</CabeceraCatalogo>

      <Specimen nombre="Card" archivo="src/components/ds/Card.tsx"
        descripcion="Tarjeta del DS. flat para contenido; raised (blanca, con sombra) para piezas de producto; outline; sage para mensajes clave. accent pone un borde izquierdo de tono."
        codigo={`<Card variant="raised" accent="red">…</Card>`}
        usar={['Features, fichas, resultado, chat']} noUsar={['Envolver una sección completa', 'Tarjetas dentro de tarjetas (usa bg-surface)']}
        a11y="interactive solo cambia el borde: si toda la tarjeta navega, envuélvela en un Link." fondo="alt">
        <div className="grid gap-4 sm:grid-cols-2">
          {(['flat', 'raised', 'outline', 'sage'] as const).map((v) => (
            <Card key={v} variant={v}><Heading as="h3" size="h4">variant=&quot;{v}&quot;</Heading><Text variant="small">Contenido de ejemplo.</Text></Card>
          ))}
          <Card variant="raised" accent="red"><Heading as="h3" size="h4">accent=&quot;red&quot;</Heading><Text variant="small">Urgencia inmediata.</Text></Card>
          <Card variant="raised" interactive><Heading as="h3" size="h4">interactive</Heading><Text variant="small">Pasa el cursor.</Text></Card>
        </div>
      </Specimen>

      <Specimen nombre="Callout" archivo="src/components/ds/Callout.tsx"
        descripcion="Bloque destacado con borde izquierdo: nota (definiciones), info, ia (aviso de IA), advertencia, critico. tone sobrescribe el color (p. ej. el del nivel)."
        codigo={`<Callout variant="ia" title="Cómo se evalúa">Solo con lo que tú digas explícitamente; lo no mencionado puntúa 0.</Callout>`}
        usar={['Definiciones, avisos de IA, límites de uso']} noUsar={['Párrafos normales', 'Errores de formulario (usa el hint de TextInput)']}
        a11y="role=&quot;note&quot;; el ícono es decorativo.">
        <Callout variant="nota" title="¿Qué es la movilidad climática?">Las formas en que las personas cambian —o no logran cambiar— su relación con el territorio.</Callout>
        <Callout variant="info" title="Info">Contexto adicional.</Callout>
        <Callout variant="ia" title="Cómo se evalúa">Solo con lo que tú digas explícitamente; lo no mencionado puntúa 0.</Callout>
        <Callout variant="advertencia" title="Qué no es">No sustituye diagnósticos técnicos ni procesos participativos.</Callout>
        <Callout variant="critico" title="Crítico">Riesgo que bloquea.</Callout>
      </Specimen>

      <Specimen nombre="Banner" archivo="src/components/ds/Banner.tsx"
        descripcion="Franja de aviso persistente: ejemplo (datos ficticios), experimental, info."
        codigo={`<Banner variant="ejemplo">{BANNER_EJEMPLO}</Banner>`}
        usar={['Toda vista con datos ficticios (obligatorio)', 'Avisos de piloto']} noUsar={['Mensajes efímeros', 'Más de un banner por vista']}
        a11y="role=&quot;note&quot;, siempre visible (no se puede cerrar).">
        <Banner variant="ejemplo">Ejemplo ilustrativo con datos ficticios — no corresponde a ningún municipio real</Banner>
        <Banner variant="experimental">Funcionalidad experimental del piloto</Banner>
        <Banner variant="info" action={<Button variant="link" size="sm">Ver más</Button>}>Aviso general con acción</Banner>
      </Specimen>

      <Specimen nombre="EmptyState" archivo="src/components/ds/EmptyState.tsx"
        descripcion="Estado vacío o de error: ícono + título + explicación + acciones."
        codigo={`<EmptyState icon={AlertCircle} title="Error al generar el diagnóstico" description={msg} actions={<Button>Reintentar</Button>} />`}
        usar={['Errores del pipeline, 404, listas vacías']} noUsar={['Avisos dentro de un flujo que sigue funcionando (usa Callout)']}>
        <EmptyState icon={Compass} tone="green" title="No encontramos esta página" description="Vuelve al inicio para seguir explorando." actions={<Button>Volver al inicio</Button>} />
      </Specimen>

      <Specimen nombre="Dialog" archivo="src/components/ds/Dialog.tsx"
        descripcion="Diálogo modal accesible para textos largos (política de privacidad)."
        codigo={`<Dialog open={open} onOpenChange={setOpen} title="Política de privacidad">…</Dialog>`}
        usar={['Textos legales, confirmaciones']} noUsar={['Formularios largos', 'Contenido que debe indexarse']}
        a11y="Foco atrapado, Esc y clic afuera cierran, el foco vuelve al disparador; título = nombre accesible.">
        <DialogDemo />
      </Specimen>

      <Specimen nombre="Skeleton" archivo="src/components/ds/Skeleton.tsx"
        descripcion="Bloque de carga; dale tamaño con clases."
        codigo={`<Skeleton className="h-4 w-3/4" />`}
        usar={['loading.tsx, cargas de datos']} noUsar={['Esperas de IA largas (usa el loader con pasos)']}>
        <Muestra etiqueta="Skeleton"><div className="flex w-full flex-col gap-2"><Skeleton className="h-6 w-1/2" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-4/5" /></div></Muestra>
      </Specimen>
    </>
  );
}
